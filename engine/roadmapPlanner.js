/**
 * Personalized Roadmap Planner for Placify
 *
 * Roadmap decisions are driven by:
 * 1. User's selected domain
 * 2. User's timeline and daily hours
 * 3. Declared/assessed overall level
 * 4. Granular quiz mastery from UserSkillProfile
 * 5. Knowledge-graph prerequisites
 *
 * If a quiz exists, weak and partially-mastered skills are prioritized while
 * already-mastered prerequisites are allowed to be skipped/condensed.
 */

const {
  getKnowledgeGraph,
  getAllSkillsInGraph,
  normalizeDomainKey
} = require('./knowledgeGraph');

const LEVEL_RANK = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  MASTERED: 4
};

function normalizeLevel(level) {
  const value = String(level || '').toUpperCase();
  if (value.includes('MASTER')) return 'MASTERED';
  if (value.includes('ADVANCED') || value.includes('EXPERT')) return 'ADVANCED';
  if (value.includes('INTERMEDIATE')) return 'INTERMEDIATE';
  return 'BEGINNER';
}

function masteryTier(score, assessed) {
  if (!assessed) return 'NOT_ASSESSED';
  if (score >= 80) return 'MASTERED';
  if (score >= 60) return 'STRONG';
  if (score >= 40) return 'PARTIAL';
  if (score >= 20) return 'WEAK';
  return 'NOT_LEARNED';
}

function skillDifficulty(skill) {
  return normalizeLevel(skill?.difficulty || 'BEGINNER');
}

function prerequisiteIds(skill) {
  return Array.isArray(skill?.prerequisites) ? skill.prerequisites : [];
}

function buildMasteryMap(skillProfile) {
  const map = new Map();
  const skills = Array.isArray(skillProfile?.skills) ? skillProfile.skills : [];

  for (const skill of skills) {
    const score = Number(skill.masteryScore);
    const evidenceTotal = Number(skill?.evidence?.total || 0);
    map.set(skill.skillId, {
      score: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0,
      assessed: evidenceTotal > 0,
      tier: masteryTier(
        Number.isFinite(score) ? score : 0,
        evidenceTotal > 0
      )
    });
  }

  return map;
}

function fallbackProfileFromQuiz(quizEvaluation, skills) {
  const map = new Map();
  const topicEvals = quizEvaluation?.topic_evaluations || quizEvaluation?.topicEvaluations || [];

  for (const skill of skills) {
    let score = null;
    const skillName = String(skill.skillName || '').toLowerCase();
    const topicName = String(skill.topicName || '').toLowerCase();
    const subtopicName = String(skill.subtopicName || '').toLowerCase();

    for (const evaluation of topicEvals) {
      const name = String(evaluation.topic || '').toLowerCase();
      const evaluationScore = Number(
        evaluation.score_pct ?? evaluation.accuracy_pct ?? evaluation.accuracy
      );
      if (!Number.isFinite(evaluationScore)) continue;

      if (
        name === skillName ||
        name === topicName ||
        name === subtopicName ||
        skillName.includes(name) ||
        name.includes(skillName) ||
        topicName.includes(name) ||
        name.includes(topicName) ||
        subtopicName.includes(name) ||
        name.includes(subtopicName)
      ) {
        score = evaluationScore;
        break;
      }
    }

    if (score !== null) {
      map.set(skill.skillId, {
        score: Math.max(0, Math.min(100, score)),
        assessed: true,
        tier: masteryTier(score, true)
      });
    }
  }

  return map;
}

/**
 * Select skills without breaking prerequisite order.
 * A prerequisite is considered satisfied when it is already selected OR the
 * quiz shows strong/mastered knowledge of it.
 */
function selectPersonalizedSkills(skills, masteryMap, overallLevel, weeksNeeded, quizTaken = false) {
  const selected = [];
  const selectedIds = new Set();
  const maxWeeks = Math.min(Math.max(1, weeksNeeded), Math.max(1, skills.length));
  const targetRank = LEVEL_RANK[overallLevel] || 1;

  const prerequisiteSatisfied = (skill, prereqId) => {
    if (selectedIds.has(prereqId)) return true;
    const prereq = skills.find(s => s.skillId === prereqId);
    const mastery = masteryMap.get(prereqId);

    // The declared/assessed overall level is important. A quiz usually covers
    // only a subset of skills, so an UNASSESSED prerequisite must NOT force an
    // Advanced/Intermediate learner all the way back to the beginning.
    // Only an explicitly assessed weak prerequisite should block advancement.
    if (!quizTaken) {
      return prereq && (LEVEL_RANK[skillDifficulty(prereq)] || 1) < targetRank;
    }

    if (!prereq) return true;
    if (!mastery?.assessed) {
      return (LEVEL_RANK[skillDifficulty(prereq)] || 1) < targetRank;
    }

    return mastery.score >= 80;
  };

  const prerequisitesSatisfied = skill =>
    prerequisiteIds(skill).every(id => prerequisiteSatisfied(skill, id));

  const candidateScore = skill => {
    const mastery = masteryMap.get(skill.skillId) || {
      score: 0,
      assessed: false,
      tier: 'NOT_ASSESSED'
    };
    const rank = LEVEL_RANK[skillDifficulty(skill)] || 1;
    const isTarget = rank === targetRank;
    const isOneBelow = rank === targetRank - 1;
    const isAbove = rank > targetRank;

    let score = 0;

    // LEVEL IS A HARD CURRICULUM SIGNAL, not merely a label.
    // Target-level skills dominate unassessed lower-level skills.
    if (isTarget) score += 1000;
    else if (isOneBelow) score += 430;
    else if (rank < targetRank) score += 120;
    else if (isAbove) score -= 1000;

    if (quizTaken) {
      if (mastery.assessed) {
        // Weak/partial target-level skills are the highest-priority gaps.
        const gap = 100 - mastery.score;
        // A directly measured weak/partial skill is a stronger personalization
        // signal than an unassessed target-level skill. This is what makes two
        // learners at the same declared level receive different roadmaps.
        if (mastery.score < 60) score += 1400 + gap * 8;
        else score += gap * (isTarget ? 7 : 2.5);

        if (mastery.score >= 80) {
          // Do not waste roadmap weeks reteaching mastered material.
          score -= isTarget ? 850 : 700;
        }
      } else {
        // Unassessed target-level skills are still relevant, but they should
        // not outrank a directly measured weak target-level skill.
        score += isTarget ? 120 : 40;
      }
    }

    // Skills that unlock many later skills get a modest dependency bonus.
    const dependentCount = skills.filter(s =>
      prerequisiteIds(s).includes(skill.skillId)
    ).length;
    score += Math.min(dependentCount, 8) * 15;

    return score;
  };

  while (selected.length < maxWeeks) {
    const candidates = skills.filter(skill =>
      skill.skillId && !selectedIds.has(skill.skillId) && prerequisitesSatisfied(skill)
    );

    if (!candidates.length) break;

    candidates.sort((a, b) => {
      const diff = candidateScore(b) - candidateScore(a);
      if (diff !== 0) return diff;
      return skills.indexOf(a) - skills.indexOf(b);
    });


    const chosen = candidates[0];
    selected.push(chosen);
    selectedIds.add(chosen.skillId);
  }

  // Safety fallback for malformed/disconnected graphs.
  if (selected.length < maxWeeks) {
    for (const skill of skills) {
      if (selected.length >= maxWeeks) break;
      if (!selectedIds.has(skill.skillId)) {
        selected.push(skill);
        selectedIds.add(skill.skillId);
      }
    }
  }

  return selected;
}

function makeTask({ monthNumber, weekNumber, dayNumber, taskIndex = 1, skill, subskill, mode, domain, overallLevel, mastery, durationMinutes = 45, dsaLanguage = null }) {
  const skillName = skill.skillName || skill.name || 'Core Skill';
  const subskillName = subskill?.subskillName || subskill?.skillName || subskill?.name || skillName;
  const difficulty = normalizeLevel(
    subskill?.difficulty ||
    (mastery?.assessed && mastery.score >= 80 ? 'ADVANCED' : skill.difficulty || overallLevel)
  );

  let title;
  let description;

  if (mode === 'LEARN') {
    title = `Learn: ${subskillName}`;
    description = `Build the required understanding of ${subskillName} under ${skillName}.`;
  } else if (mode === 'PRACTICE') {
    title = `Practice: ${subskillName}`;
    description = `Solve placement-oriented problems focused on ${subskillName}.`;
  } else if (mode === 'IMPLEMENT') {
    title = `Implement: ${subskillName}`;
    description = `Apply ${subskillName} in a small practical implementation and explain the design choices.`;
  } else {
    title = `Revise: ${subskillName}`;
    description = `Review ${subskillName}, then verify retention with targeted questions.`;
  }

  const id = `m${monthNumber}_w${weekNumber}_d${dayNumber}_task${taskIndex}`;
  const isDsa = domain === 'dsa';
  const languageSuffix = isDsa && dsaLanguage ? ` in ${dsaLanguage}` : '';
  if (isDsa && dsaLanguage) {
    description = `${description.replace(/\.$/, '')}${languageSuffix}. Use ${dsaLanguage} syntax for every implementation example and practice solution.`;
  }

  return {
    id,
    taskId: id,
    monthNumber,
    month_number: monthNumber,
    weekNumber,
    week_number: weekNumber,
    dayNumber,
    day_number: dayNumber,
    title,
    taskTitle: title,
    type: mode === 'IMPLEMENT' ? 'IMPLEMENT' : mode === 'PRACTICE' ? 'PRACTICE' : mode === 'REVISION' ? 'REVISION' : 'LEARN',
    taskType: mode === 'IMPLEMENT' ? 'IMPLEMENT' : mode === 'PRACTICE' ? 'PRACTICE' : mode === 'REVISION' ? 'REVISION' : 'LEARN',
    taskStage: mode === 'LEARN' ? 'NEW_LEARNING' : mode,
    difficulty,
    durationMinutes,
    estimated_minutes: durationMinutes,
    completed: false,
    status: 'pending',
    domain,
    domainId: domain,
    dsaLanguage: isDsa ? dsaLanguage : null,
    programmingLanguage: isDsa ? dsaLanguage : null,
    skillId: skill.skillId,
    baseSkillId: skill.skillId,
    parentSkillId: skill.skillId,
    subskillId: subskill?.subskillId || null,
    subskillName,
    taskTopic: skill.topicName || skillName,
    topic: skill.topicName || skillName,
    taskSubtopic: subskillName,
    subtopic: subskillName,
    userLevel: overallLevel,
    masteryScore: mastery?.score ?? null,
    masteryTier: mastery?.tier || 'NOT_ASSESSED',
    description,
    practice_details: isDsa && dsaLanguage
      ? `Use interview-style DSA questions and implementation exercises in ${dsaLanguage}. Write and analyze the solution in ${dsaLanguage}.`
      : `Use interview-style questions and practical exercises for ${subskillName}.`
  };
}

function buildWeek({ monthNumber, weekNumber, skill, domain, overallLevel, mastery, minutesPerDay, dsaLanguage = null, integrationWeek = false, integrationIndex = 0 }) {
  const allSubskills = Array.isArray(skill.subskills) && skill.subskills.length
    ? skill.subskills
    : [{
        subskillId: `${skill.skillId}_core`,
        subskillName: skill.skillName,
        difficulty: skill.difficulty || overallLevel,
        estimatedMinutes: 45
      }];

  // A mastered skill should not receive six days of beginner teaching.
  // Strong/partial/weak skills get progressively different treatment.
  const score = mastery?.assessed ? mastery.score : null;
  let startIndex = 0;
  if (score !== null && score >= 80) startIndex = Math.max(0, allSubskills.length - 3);
  else if (score !== null && score >= 60) startIndex = Math.min(1, Math.max(0, allSubskills.length - 1));

  const subskills = [];
  for (let i = 0; i < 6; i++) {
    const index = (startIndex + i) % allSubskills.length;
    const sub = allSubskills[index];
    if (!subskills.some(x => x.subskillId === sub.subskillId)) subskills.push(sub);
  }
  while (subskills.length < 6) subskills.push(...allSubskills);

  const mastered = score !== null && score >= 80;
  const strong = score !== null && score >= 60;
  const modes = mastered
    ? ['REVISION', 'PRACTICE', 'PRACTICE', 'IMPLEMENT', 'IMPLEMENT', 'REVISION']
    : strong
      ? ['REVISION', 'LEARN', 'PRACTICE', 'PRACTICE', 'IMPLEMENT', 'REVISION']
      : ['LEARN', 'LEARN', 'PRACTICE', 'PRACTICE', 'IMPLEMENT', 'REVISION'];

  const days = [];

  // Turn the user's daily-hours setting into an actual daily workload.
  // The old roadmap always created one 45-minute task even for learners who
  // committed 2–4 hours/day. Each day now gets a small sequence of tasks that
  // fits the available time instead of pretending 45 minutes equals the day.
  const buildDailyTaskPlan = (dayNumber) => {
    const target = Math.max(45, minutesPerDay);
    const baseSubskill = subskills[(dayNumber - 1) % subskills.length];
    const nextSubskill = subskills[dayNumber % subskills.length] || baseSubskill;

    // Every learning day is intentionally split into at least two actionable
    // tasks. Larger study commitments get a third task instead of one large
    // undifferentiated block.
    if (target <= 60) {
      const first = Math.max(20, Math.floor(target * 0.5));
      return [
        { subskill: baseSubskill, mode: modes[dayNumber - 1], minutes: first },
        { subskill: nextSubskill, mode: 'PRACTICE', minutes: Math.max(20, target - first) }
      ];
    }

    if (target <= 120) {
      return [
        { subskill: baseSubskill, mode: modes[dayNumber - 1], minutes: 45 },
        { subskill: nextSubskill, mode: 'PRACTICE', minutes: target - 45 }
      ];
    }

    const remaining = target - 120;
    return [
      { subskill: baseSubskill, mode: modes[dayNumber - 1], minutes: 60 },
      { subskill: nextSubskill, mode: 'PRACTICE', minutes: 60 },
      { subskill: baseSubskill, mode: 'IMPLEMENT', minutes: Math.max(30, remaining) }
    ];
  };

  for (let dayNumber = 1; dayNumber <= 6; dayNumber++) {
    const plan = buildDailyTaskPlan(dayNumber);
    const tasks = plan.map((item, index) => makeTask({
      monthNumber,
      weekNumber,
      dayNumber,
      taskIndex: index + 1,
      skill,
      subskill: item.subskill,
      mode: item.mode,
      domain,
      overallLevel,
      mastery,
      durationMinutes: item.minutes,
      dsaLanguage
    }));

    const totalMinutes = tasks.reduce((sum, t) => sum + Number(t.durationMinutes || 0), 0);
    days.push({
      id: `m${monthNumber}_w${weekNumber}_d${dayNumber}`,
      dayId: `m${monthNumber}_w${weekNumber}_d${dayNumber}`,
      dayNumber,
      day_number: dayNumber,
      topic: tasks[0]?.title || tasks[0]?.taskSubtopic || skill.skillName,
      estimated_minutes: totalMinutes,
      total_minutes: totalMinutes,
      tasks
    });
  }

  const assessmentId = `m${monthNumber}_w${weekNumber}_d7_assessment`;
  const assessmentMinutes = Math.min(60, Math.max(30, Math.floor(minutesPerDay * 0.4)));
  const reviewMinutes = Math.max(20, minutesPerDay - assessmentMinutes);
  days.push({
    id: `m${monthNumber}_w${weekNumber}_d7`,
    dayId: `m${monthNumber}_w${weekNumber}_d7`,
    dayNumber: 7,
    day_number: 7,
    topic: skill.topicName || skill.skillName,
    estimated_minutes: assessmentMinutes + reviewMinutes,
    total_minutes: assessmentMinutes + reviewMinutes,
    tasks: [{
      id: assessmentId,
      taskId: assessmentId,
      monthNumber,
      month_number: monthNumber,
      weekNumber,
      week_number: weekNumber,
      dayNumber: 7,
      day_number: 7,
      title: `Weekly Assessment: ${skill.skillName}`,
      taskTitle: `Weekly Assessment: ${skill.skillName}`,
      type: 'ASSESSMENT',
      taskType: 'ASSESSMENT',
      taskStage: 'ASSESSMENT',
      difficulty: overallLevel,
      durationMinutes: assessmentMinutes,
      estimated_minutes: assessmentMinutes,
      completed: false,
      status: 'pending',
      domain,
      domainId: domain,
      skillId: skill.skillId,
      baseSkillId: skill.skillId,
      parentSkillId: skill.skillId,
      taskTopic: skill.topicName || skill.skillName,
      topic: skill.topicName || skill.skillName,
      taskSubtopic: skill.skillName,
      subtopic: skill.skillName,
      userLevel: overallLevel,
      masteryScore: mastery?.score ?? null,
      masteryTier: mastery?.tier || 'NOT_ASSESSED',
      dsaLanguage: domain === 'dsa' ? dsaLanguage : null,
      programmingLanguage: domain === 'dsa' ? dsaLanguage : null,
      description: domain === 'dsa' && dsaLanguage
        ? `Assess retention of ${skill.skillName} using ${dsaLanguage} coding questions and decide whether to deepen, reinforce, or advance this skill.`
        : `Assess retention of ${skill.skillName} and decide whether to deepen, reinforce, or advance this skill.`,
      practice_details: domain === 'dsa' && dsaLanguage
        ? `Review every incorrect answer and re-solve the exact subskill in ${dsaLanguage}.`
        : `Review every incorrect answer and target the exact subskill that needs reinforcement.`
    }, {
      id: `${assessmentId}_review`,
      taskId: `${assessmentId}_review`,
      monthNumber, month_number: monthNumber, weekNumber, week_number: weekNumber, dayNumber: 7, day_number: 7,
      title: `Review: ${skill.skillName} Assessment Mistakes`,
      taskTitle: `Review: ${skill.skillName} Assessment Mistakes`,
      type: 'REVISION',
      taskType: 'REVISION',
      taskStage: 'ASSESSMENT_REVIEW',
      difficulty: overallLevel,
      durationMinutes: reviewMinutes,
      estimated_minutes: reviewMinutes,
      completed: false,
      status: 'pending',
      domain, domainId: domain, skillId: skill.skillId, baseSkillId: skill.skillId, parentSkillId: skill.skillId,
      taskTopic: skill.topicName || skill.skillName, topic: skill.topicName || skill.skillName,
      taskSubtopic: skill.skillName, subtopic: skill.skillName, userLevel: overallLevel,
      masteryScore: mastery?.score ?? null, masteryTier: mastery?.tier || 'NOT_ASSESSED',
      dsaLanguage: domain === 'dsa' ? dsaLanguage : null,
      programmingLanguage: domain === 'dsa' ? dsaLanguage : null,
      description: `Review the weekly assessment, correct mistakes, and record the concepts that need reinforcement.`,
      practice_details: `Re-solve missed questions without looking at the solution, then note the rule or pattern that caused the mistake.`
    }]
  });

  const baseIntegrationFocus = subskills[(integrationIndex || 0) % subskills.length]?.subskillName || skill.skillName;
  const integrationFocus = integrationWeek
    ? `${baseIntegrationFocus} — Integration Lab ${integrationIndex}`
    : baseIntegrationFocus;
  return {
    weekNumber,
    week_number: weekNumber,
    month_number: monthNumber,
    skillId: skill.skillId,
    focusSkillId: skill.skillId,
    focusSubskill: integrationFocus,
    phase: integrationWeek ? 'INTEGRATION' : (mastered ? 'MASTERY' : strong ? 'REINFORCEMENT' : 'FOUNDATION'),
    title: integrationWeek
      ? `${skill.skillName} — Integration Lab ${integrationIndex}: ${integrationFocus}`
      : `${skill.skillName} — ${mastered ? 'Advanced Application & Mastery' : strong ? 'Reinforcement & Application' : 'Foundation & Skill Building'}`,
    objective: integrationWeek
      ? `Integrate ${skill.skillName} with previously learned concepts using ${integrationFocus}, mixed interview practice, revision, and application.`
      : mastered
      ? `Maintain mastery of ${skill.skillName} through advanced application and interview practice.`
      : strong
        ? `Strengthen ${skill.skillName} through targeted practice and implementation.`
        : `Build ${skill.skillName} from the learner's current ${mastery?.tier || 'not-assessed'} level.`,
    topics: [skill.topicName || skill.skillName],
    subtopics: integrationWeek
      ? [integrationFocus, ...subskills.map(s => s.subskillName || s.skillName).filter(Boolean)]
      : subskills.map(s => s.subskillName || s.skillName).filter(Boolean),
    estimated_hours: Math.round((days.reduce((sum, day) => sum + Number(day.estimated_minutes || 0), 0)) / 60 * 10) / 10,
    practice: `Placement-focused practice for ${skill.skillName}.`,
    revision: `End-of-week revision and retention check for ${skill.skillName}.`,
    assessment: `Weekly assessment of ${skill.skillName}.`,
    expected_outcomes: [
      `Demonstrate understanding of ${skill.skillName}.`,
      `Solve placement-oriented questions related to ${skill.skillName}.`
    ],
    days
  };
}

function generateIntelligentRoadmap({
  userId,
  domain,
  timeline_months,
  daily_hours,
  skillProfile,
  userLevel,
  quizEvaluation,
  dsaLanguage = null
}) {
  const domainKey = normalizeDomainKey(domain);
  const graph = getKnowledgeGraph(domainKey);
  const skills = getAllSkillsInGraph(graph);

  if (!skills.length) {
    throw new Error(`No skills found for domain "${domainKey}".`);
  }

  const months = Math.max(1, Number(timeline_months) || 1);
  const hoursPerDay = Math.max(1, Number(daily_hours) || 2);
  const minutesPerDay = Math.round(hoursPerDay * 60);
  const totalWeeks = months * 4;
  const overallLevel = normalizeLevel(userLevel || quizEvaluation?.skill_level || 'BEGINNER');

  const masteryMap = buildMasteryMap(skillProfile);
  const fallbackMap = fallbackProfileFromQuiz(quizEvaluation, skills);

  for (const [skillId, value] of fallbackMap.entries()) {
    if (!masteryMap.has(skillId) || !masteryMap.get(skillId).assessed) {
      masteryMap.set(skillId, value);
    }
  }

  const quizTaken = Array.from(masteryMap.values()).some(v => v.assessed);
  const selectedSkills = selectPersonalizedSkills(
    skills,
    masteryMap,
    overallLevel,
    totalWeeks,
    quizTaken
  );

  const monthlyRoadmap = [];
  let skillCursor = 0;
  let integrationIndex = 1;

  for (let monthNumber = 1; monthNumber <= months; monthNumber++) {
    const weeks = [];
    const monthSkills = [];

    for (let weekNumber = 1; weekNumber <= 4; weekNumber++) {
      const skill = selectedSkills[skillCursor];
      skillCursor += 1;

      // If the graph has fewer unique skills than the requested timeline,
      // reuse the highest-priority skill only as a final revision/integration
      // week instead of silently cycling the entire roadmap from Week 1.
      if (!skill) {
        const reviewSkill = selectedSkills[selectedSkills.length - 1];
        if (!reviewSkill) throw new Error('Unable to construct roadmap skills.');
        monthSkills.push(reviewSkill);
        weeks.push(buildWeek({
          monthNumber,
          weekNumber,
          skill: reviewSkill,
          domain: domainKey,
          overallLevel,
          mastery: masteryMap.get(reviewSkill.skillId) || { score: 0, assessed: false, tier: 'NOT_ASSESSED' },
          minutesPerDay,
          dsaLanguage,
          integrationWeek: true,
          integrationIndex: integrationIndex++
        }));
        continue;
      }

      monthSkills.push(skill);

      const mastery = masteryMap.get(skill.skillId) || {
        score: 0,
        assessed: false,
        tier: 'NOT_ASSESSED'
      };

      weeks.push(
        buildWeek({
          monthNumber,
          weekNumber,
          skill,
          domain: domainKey,
          overallLevel,
          mastery,
          minutesPerDay,
          dsaLanguage
        })
      );
    }

    const monthSkillNames = monthSkills.map(skill => skill.skillName).filter(Boolean);
    const monthTopics = [...new Set(monthSkills.map(skill => skill.topicName).filter(Boolean))];
    const monthStart = monthSkillNames[0] || `${graph.domainName} Foundations`;
    const monthEnd = monthSkillNames[monthSkillNames.length - 1] || monthStart;
    const allWeeksAreIntegration = weeks.every(week => week.phase === 'INTEGRATION');
    const phaseTitle = allWeeksAreIntegration
      ? `Integration & Consolidation — ${monthStart}`
      : (monthStart === monthEnd ? monthStart : `${monthStart} → ${monthEnd}`);
    const monthHours = Math.round((weeks.reduce((sum, week) => sum + Number(week.estimated_hours || 0), 0)) * 10) / 10;

    monthlyRoadmap.push({
      monthNumber,
      month_number: monthNumber,
      title: `Month ${monthNumber}: ${phaseTitle}`,
      objective: quizTaken
        ? `Close the learner's highest-priority gaps while progressing from ${monthStart} toward ${monthEnd}.`
        : `Progress through ${monthStart} toward ${monthEnd} using the learner's ${overallLevel.toLowerCase()} entry point.`,
      topics: monthTopics,
      subtopics: [...new Set(monthSkills.flatMap(skill => (skill.subskills || []).map(s => s.subskillName).filter(Boolean)))],
      estimated_hours: monthHours,
      difficulty: overallLevel === 'MASTERED' ? 'ADVANCED' : overallLevel,
      expected_outcomes: [
        `Build practical mastery of ${monthEnd}.`,
        `Complete the weekly practice and assessment tasks for Month ${monthNumber}.`
      ],
      weeks,
      personalized: quizTaken,
      focus_skills: monthSkills.map(skill => ({
        skillId: skill.skillId,
        name: skill.skillName,
        masteryScore: masteryMap.get(skill.skillId)?.score ?? null,
        masteryTier: masteryMap.get(skill.skillId)?.tier || 'NOT_ASSESSED'
      }))
    });
  }

  return {
    userId,
    user_id: userId,
    domain: domainKey,
    domainId: domainKey,
    domainName: graph.domainName,
    timeline_months: months,
    daily_hours: hoursPerDay,
    dsa_language: domainKey === 'dsa' ? dsaLanguage : null,
    programming_language: domainKey === 'dsa' ? dsaLanguage : null,
    userLevel: overallLevel,
    overall_level: overallLevel,
    quiz_aligned: quizTaken,
    quiz_score: quizEvaluation?.score_pct ?? null,
    totalWeeks,
    curriculum_version: 'v4_quiz_aligned_personalized',
    monthly_roadmap: monthlyRoadmap,
    generatedAt: new Date().toISOString(),
    generated_at: new Date()
  };
}

function validateDailyTasks(roadmap) {
  const errors = [];
  if (!roadmap || !Array.isArray(roadmap.monthly_roadmap)) {
    return { valid: false, errors: ['Roadmap must contain monthly_roadmap.'] };
  }
  for (const month of roadmap.monthly_roadmap) {
    for (const week of (month.weeks || [])) {
      for (const day of (week.days || [])) {
        if (!Array.isArray(day.tasks) || day.tasks.length === 0) {
          errors.push(`Month ${month.month_number}, Week ${week.week_number}, Day ${day.day_number}: no tasks.`);
          continue;
        }
        const total = day.tasks.reduce((sum, task) => sum + Number(task.durationMinutes || task.estimated_minutes || 0), 0);
        if (total <= 0) errors.push(`Month ${month.month_number}, Week ${week.week_number}, Day ${day.day_number}: invalid duration.`);
        for (const task of day.tasks) {
          if (!task.skillId) errors.push(`Task ${task.taskId || task.id}: missing skillId.`);
          if (!task.subtopic) errors.push(`Task ${task.taskId || task.id}: missing subtopic.`);
        }
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

function validateRoadmap(roadmap) {
  const errors = [];
  if (!roadmap || !Array.isArray(roadmap.monthly_roadmap)) {
    return { valid: false, errors: ['Roadmap must contain monthly_roadmap.'] };
  }

  for (const month of roadmap.monthly_roadmap) {
    if (!Array.isArray(month.weeks) || month.weeks.length !== 4) {
      errors.push(`Invalid roadmap month ${month.month_number}: expected 4 weeks.`);
      continue;
    }
    for (const week of month.weeks) {
      if (!Array.isArray(week.days) || week.days.length !== 7) {
        errors.push(`Invalid roadmap week ${week.week_number}: expected 7 days.`);
        continue;
      }
      const weekValidation = validateDailyTasks({ monthly_roadmap: [{ weeks: [week] }] });
      errors.push(...weekValidation.errors);
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  generateIntelligentRoadmap,
  validateRoadmap,
  validateDailyTasks
};
