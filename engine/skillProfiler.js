/**
 * Skill Profiler Engine for AgPlacify
 * Calculates granular per-skill mastery, confidence, evidence, and 5-tier proficiency level:
 * - 80–100% = MASTERED
 * - 60–79%  = STRONG
 * - 40–59%  = PARTIAL
 * - 20–39%  = WEAK
 * - 0–19%   = NOT_LEARNED
 */

const { getKnowledgeGraph, getAllSkillsInGraph } = require('./knowledgeGraph');

/**
 * Categorizes mastery score percentage into 5-tier status
 */
function getMasteryTier(scorePct) {
  if (scorePct >= 80) return 'MASTERED';
  if (scorePct >= 60) return 'STRONG';
  if (scorePct >= 40) return 'PARTIAL';
  if (scorePct >= 20) return 'WEAK';
  return 'NOT_LEARNED';
}

/**
 * Generates user skill profile from quiz evaluation / quiz answers or historical quiz data
 */
function buildUserSkillProfile({ userId, domain, quizEvaluation, existingProfile }) {
  const graph = getKnowledgeGraph(domain);
  const allSkills = getAllSkillsInGraph(graph);

  const skillStatsMap = new Map();

  // Initialize all skills in graph with base metadata
  allSkills.forEach(sk => {
    skillStatsMap.set(sk.skillId, {
      skillId: sk.skillId,
      topic: sk.topicName,
      subtopic: sk.subtopicName,
      skillName: sk.skillName,
      masteryScore: 0,
      masteryTier: 'NOT_LEARNED',
      confidence: 0.1,
      evidence: { correct: 0, total: 0 },
      level: sk.difficulty || 'BEGINNER',
      lastAssessedAt: new Date()
    });
  });

  // Preserve existing profile skills if available
  if (existingProfile && Array.isArray(existingProfile.skills)) {
    existingProfile.skills.forEach(s => {
      if (skillStatsMap.has(s.skillId)) {
        const score = s.masteryScore || 0;
        skillStatsMap.set(s.skillId, {
          ...skillStatsMap.get(s.skillId),
          masteryScore: score,
          masteryTier: getMasteryTier(score),
          confidence: s.confidence || 0.1,
          evidence: s.evidence || { correct: 0, total: 0 },
          level: s.level || 'BEGINNER',
          lastAssessedAt: s.lastAssessedAt || new Date()
        });
      }
    });
  }

  if (quizEvaluation) {
    const answers = Array.isArray(quizEvaluation.answers) ? quizEvaluation.answers : [];

    if (answers.length > 0) {
      // Direct granular evaluation from actual quiz answers
      answers.forEach(ans => {
        const topicName = (ans.topic || '').trim().toLowerCase();
        const subtopicName = (ans.subtopic || '').trim().toLowerCase();

        // Match the answer to the most relevant skill in the knowledge graph.
        // IMPORTANT: never allow an empty topic/subtopic to match every skill.
        let matchedSkill = allSkills.find(s => ans.skillId && s.skillId === ans.skillId);

        if (!matchedSkill) {
          const answerText = [
            ans.skillName,
            ans.subtopic,
            ans.topic
          ]
            .map(v => String(v || '').trim().toLowerCase())
            .filter(Boolean);

          let bestScore = 0;

          for (const skill of allSkills) {
            const skillText = [
              skill.skillId,
              skill.skillName,
              skill.subtopicName,
              skill.topicName
            ]
              .map(v => String(v || '').trim().toLowerCase())
              .filter(Boolean);

            let score = 0;

            for (const query of answerText) {
              for (const candidate of skillText) {
                if (query === candidate) score = Math.max(score, 100);
                else if (candidate.includes(query) || query.includes(candidate)) score = Math.max(score, 70);
              }
            }

            if (score > bestScore) {
              bestScore = score;
              matchedSkill = skill;
            }
          }
        }

        // Never assign an unmatchable question to the first skill in the
        // domain. That old fallback polluted the profile and made different
        // learners look identical. If the quiz carries an exact skillId, use
        // it; otherwise require a meaningful taxonomy match.
        if (matchedSkill && skillStatsMap.has(matchedSkill.skillId)) {
          const stats = skillStatsMap.get(matchedSkill.skillId);
          stats.evidence.total += 1;
          if (ans.is_correct) stats.evidence.correct += 1;
        }
      });

      // Calculate score & confidence based on evidence
      skillStatsMap.forEach((stats) => {
        if (stats.evidence.total > 0) {
          const accuracyPct = Math.round((stats.evidence.correct / stats.evidence.total) * 100);
          stats.masteryScore = accuracyPct;
          stats.masteryTier = getMasteryTier(accuracyPct);
          stats.confidence = Math.min(1.0, 0.5 + stats.evidence.total * 0.1);
          if (accuracyPct >= 80) stats.level = 'ADVANCED';
          else if (accuracyPct >= 50) stats.level = 'INTERMEDIATE';
          else stats.level = 'BEGINNER';
        }
      });

    } else if (Array.isArray(quizEvaluation.topic_evaluations) && quizEvaluation.topic_evaluations.length > 0) {
      // Derived baseline from historical topic evaluations
      quizEvaluation.topic_evaluations.forEach(tEval => {
        const tName = String(tEval.topic || '').trim().toLowerCase();
        if (!tName) return;
        allSkills.filter(s => {
          const topic = String(s.topicName || '').trim().toLowerCase();
          return topic && (topic === tName || topic.includes(tName) || tName.includes(topic));
        }).forEach(s => {
          const stats = skillStatsMap.get(s.skillId);
          if (stats) {
            const score = Number(tEval.score_pct ?? tEval.accuracy_pct ?? tEval.accuracy ?? 50);
            const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 50;
            const totalQuestions = Number(tEval.total_questions ?? tEval.totalQuestions ?? 0);
            const correctCount = Number(tEval.correct_count ?? tEval.correctCount ?? 0);
            const evidenceTotal = Number.isFinite(totalQuestions) && totalQuestions > 0 ? totalQuestions : 1;
            const evidenceCorrect = Number.isFinite(correctCount)
              ? Math.max(0, Math.min(evidenceTotal, correctCount))
              : Math.round((safeScore / 100) * evidenceTotal);
            stats.masteryScore = safeScore;
            stats.masteryTier = getMasteryTier(safeScore);
            stats.confidence = 0.7;
            stats.evidence = { correct: evidenceCorrect, total: evidenceTotal };
            if (safeScore >= 80) stats.level = 'ADVANCED';
            else if (safeScore >= 50) stats.level = 'INTERMEDIATE';
            else stats.level = 'BEGINNER';
          }
        });
      });

    } else {
      // Fallback baseline from quiz overall score / declared skill level
      const overallScoreRaw = quizEvaluation.score_pct ?? quizEvaluation.scorePct;
      const overallScore = Number.isFinite(Number(overallScoreRaw)) ? Number(overallScoreRaw) : null;
      const overallLevel = String(quizEvaluation.skill_level || 'BEGINNER').toUpperCase();
      const levelRank = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3 };
      const declaredRank = levelRank[overallLevel] || 1;

      allSkills.forEach(s => {
        const stats = skillStatsMap.get(s.skillId);
        if (stats) {
          const skillRank = levelRank[String(s.difficulty || 'BEGINNER').toUpperCase()] || 1;
          let baseline;
          if (skillRank < declaredRank) baseline = 80;
          else if (skillRank === declaredRank) baseline = overallScore === null ? 60 : Math.max(40, Math.min(90, overallScore));
          else baseline = 10;

          stats.masteryScore = baseline;
          stats.masteryTier = getMasteryTier(baseline);
          stats.confidence = 0.5;
          stats.evidence = { correct: baseline >= 50 ? 1 : 0, total: 1 };
          stats.level = overallLevel;
        }
      });
    }
  }

  const skillsArray = Array.from(skillStatsMap.values());

  return {
    userId,
    domain: graph.domainName,
    domainId: graph.domainId,
    skills: skillsArray,
    updatedAt: new Date()
  };
}

/**
 * Update a specific skill's mastery after task / mini-quiz completion
 */
function updateSkillMastery(skillProfile, skillId, isCorrect, taskScorePct) {
  if (!skillProfile || !Array.isArray(skillProfile.skills)) return skillProfile;

  const skill = skillProfile.skills.find(s => s.skillId === skillId);
  if (skill) {
    if (!skill.evidence) skill.evidence = { correct: 0, total: 0 };
    skill.evidence.total += 1;
    if (isCorrect || taskScorePct >= 70) {
      skill.evidence.correct += 1;
    }

    // Exponential moving average for dynamic mastery adjustment
    const delta = (taskScorePct !== undefined ? taskScorePct : (isCorrect ? 100 : 0)) - skill.masteryScore;
    skill.masteryScore = Math.min(100, Math.max(0, Math.round(skill.masteryScore + delta * 0.35)));
    skill.masteryTier = getMasteryTier(skill.masteryScore);

    skill.confidence = Math.min(1.0, (skill.confidence || 0.5) + 0.05);
    if (skill.masteryScore >= 80) skill.level = 'ADVANCED';
    else if (skill.masteryScore >= 50) skill.level = 'INTERMEDIATE';
    else skill.level = 'BEGINNER';

    skill.lastAssessedAt = new Date();
  }

  skillProfile.updatedAt = new Date();
  return skillProfile;
}

module.exports = {
  getMasteryTier,
  buildUserSkillProfile,
  updateSkillMastery
};
