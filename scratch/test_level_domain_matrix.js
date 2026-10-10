const { getKnowledgeGraph } = require('../engine/knowledgeGraph');
const { buildUserSkillProfile } = require('../engine/skillProfiler');
const { generateIntelligentRoadmap, validateRoadmap } = require('../engine/roadmapPlanner');

const DOMAINS = [
  'fullstack',
  'datascience',
  'dsa',
  'devops',
  'cybersecurity',
  'mobile',
  'ai_llm',
  'system_design'
];

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const TIMELINES = [3, 6]; // 3 months (12 weeks) and 6 months (24 weeks)

console.log('========================================================================');
console.log('STARTING PLACIFY LEVEL x DOMAIN MATRIX TEST (8 Domains x 3 Levels x 2 Timelines)');
console.log('Total Combinations: 8 x 3 x 2 = 48 Roadmap Configurations');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;
const failureDetails = [];

for (const domain of DOMAINS) {
  const graph = getKnowledgeGraph(domain);
  const skillMap = new Map();
  (graph.skills || []).forEach(s => skillMap.set(s.skillId, s));

  for (const userLevel of LEVELS) {
    for (const timeline_months of TIMELINES) {
      totalTests++;
      const totalWeeks = timeline_months * 4;
      const testTag = `[${domain.padEnd(13)}] Level: ${userLevel.padEnd(12)} | Timeline: ${timeline_months}m (${totalWeeks}w)`;

      try {
        const mockQuizEval = {
          domain,
          score_pct: userLevel === 'BEGINNER' ? 15 : (userLevel === 'INTERMEDIATE' ? 55 : 88),
          skill_level: userLevel
        };

        const skillProfile = buildUserSkillProfile({
          userId: `test_matrix_${domain}_${userLevel}_${timeline_months}`,
          domain,
          quizEvaluation: mockQuizEval
        });

        const roadmap = generateIntelligentRoadmap({
          userId: `test_matrix_${domain}_${userLevel}_${timeline_months}`,
          domain,
          timeline_months,
          daily_hours: 2.0,
          skillProfile,
          userLevel
        });

        const valResult = validateRoadmap(roadmap);
        if (!valResult.valid) {
          throw new Error(`Roadmap validation failed: ${valResult.errors.join('; ')}`);
        }

        // Collect all weeks across all months
        const allWeeks = [];
        (roadmap.monthly_roadmap || []).forEach(m => {
          (m.weeks || []).forEach(w => allWeeks.push(w));
        });

        if (allWeeks.length !== totalWeeks) {
          throw new Error(`Expected ${totalWeeks} weeks, got ${allWeeks.length}`);
        }

        const seenSkillIds = new Set();
        let integrationWeeksCount = 0;
        const violations = [];

        allWeeks.forEach((week, wIdx) => {
          const wNum = wIdx + 1;
          const sId = week.skillId || week.focusSkillId;
          const isIntegration = week.phase === 'INTEGRATION' ||
                                (week.title && week.title.includes('Integration Lab')) ||
                                (week.title && week.title.includes('Capstone Integration')) ||
                                (sId && sId.startsWith('capstone_'));

          if (isIntegration) {
            integrationWeeksCount++;
          }

          // Rule 3: No repeated skills across weeks
          if (seenSkillIds.has(sId)) {
            violations.push(`Week ${wNum} repeats skillId "${sId}" (already used)`);
          } else {
            seenSkillIds.add(sId);
          }

          // Check skill level boundary
          const skillDef = skillMap.get(sId);
          if (skillDef) {
            const skillLevel = (skillDef.level || '').toUpperCase();

            // Rule 1: Advanced roadmap MUST NEVER contain a beginner skill
            if (userLevel === 'ADVANCED' && skillLevel === 'BEGINNER') {
              violations.push(`Week ${wNum} [${sId}] is BEGINNER level in an ADVANCED roadmap`);
            }

            // Rule 2: Beginner roadmap MUST NEVER contain an advanced skill
            if (userLevel === 'BEGINNER' && skillLevel === 'ADVANCED') {
              violations.push(`Week ${wNum} [${sId}] is ADVANCED level in a BEGINNER roadmap`);
            }
          }
        });

        // Rule 4: Integration weeks must not exceed 10%
        const integrationRatio = integrationWeeksCount / totalWeeks;
        if (integrationRatio > 0.10) {
          violations.push(`Integration weeks exceed 10%: ${integrationWeeksCount}/${totalWeeks} (${(integrationRatio * 100).toFixed(1)}%)`);
        }

        if (violations.length > 0) {
          failureDetails.push({ testTag, violations });
          console.log(`❌ FAIL ${testTag}`);
          violations.forEach(v => console.log(`      -> ${v}`));
        } else {
          passedTests++;
          const integrationPct = ((integrationWeeksCount / totalWeeks) * 100).toFixed(0);
          console.log(`✅ PASS ${testTag} | Unique: ${seenSkillIds.size}/${totalWeeks} | Integration: ${integrationWeeksCount} (${integrationPct}%)`);
        }

      } catch (err) {
        failureDetails.push({ testTag, violations: [err.message] });
        console.log(`❌ FAIL ${testTag}: ${err.message}`);
      }
    }
  }
}

console.log('\n========================================================================');
console.log(`MATRIX TEST EXECUTION COMPLETE: ${passedTests} / ${totalTests} COMBINATIONS PASSED`);
console.log('========================================================================');

if (failureDetails.length > 0) {
  console.error(`\n❌ FAILED COMBINATIONS SUMMARY (${failureDetails.length}):`);
  failureDetails.forEach(f => {
    console.error(`  - ${f.testTag}:`);
    f.violations.forEach(v => console.error(`      * ${v}`));
  });
  process.exit(1);
} else {
  console.log('🎉 100% OF LEVEL x DOMAIN MATRIX TESTS PASSED WITH STRICT LEVEL & UNIQUENESS CONSTRAINTS!');
  process.exit(0);
}
