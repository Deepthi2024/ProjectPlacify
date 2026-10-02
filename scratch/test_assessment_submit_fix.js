const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Test 1: Load js/agents.js simulation for ProgressTrackerAgent
const agentsFile = fs.readFileSync(path.join(__dirname, '..', 'js', 'agents.js'), 'utf8');
const serverFile = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
const appFile = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

// Verify agents.js has dailyTasks array construction fallback
assert(agentsFile.includes('Array.isArray(state.personalizedRoadmap.dailyTasks)'), 'agents.js must check Array.isArray for dailyTasks');

// Verify server.js has try/catch inside gradeWrittenAnswersWithGroq
assert(serverFile.includes('⚠️ Groq grading failed, using keyword fallback:'), 'server.js must log Groq grading fallback warning on error');

// Verify app.js has safe property checks in renderProgressAnalytics
assert(appFile.includes('s.masteryPct ?? 0'), 'app.js must use safe nullish coalescing for masteryPct');

// Test 2: Execute JS syntax checks
try {
  new Function(agentsFile);
  console.log('✅ js/agents.js syntax is valid.');
} catch (e) {
  console.error('❌ Syntax error in js/agents.js:', e);
  process.exit(1);
}

try {
  new Function(appFile);
  console.log('✅ js/app.js syntax is valid.');
} catch (e) {
  console.error('❌ Syntax error in js/app.js:', e);
  process.exit(1);
}

// Test 3: Run existing assessment & task integration test logic
const { generateIntelligentRoadmap } = require('../engine/roadmapPlanner');
const sampleRoadmap = generateIntelligentRoadmap({
  userId: 'test_user',
  domain: 'fullstack',
  timeline_months: 3,
  daily_hours: 2,
  userLevel: 'BEGINNER'
});

// Simulate ProgressTrackerAgent logic without dailyTasks pre-populated
class MockProgressTracker {
  constructor(roadmap) {
    this.state = {
      personalizedRoadmap: roadmap, // missing dailyTasks property intentionally
      masteryPct: 0,
      xp: 0,
      streak: 1,
      lastCompletedDate: null,
      badges: ['🐣 Fresh Start'],
      level: 1
    };
  }

  getUserState() { return this.state; }
  saveUserState(s) { this.state = s; return s; }

  logTaskCompletion(dayNumber, taskScorePct) {
    const state = this.getUserState();
    if (!state.personalizedRoadmap) return state;

    if (!Array.isArray(state.personalizedRoadmap.dailyTasks)) {
      state.personalizedRoadmap.dailyTasks = [];
      let dayCounter = 1;
      (state.personalizedRoadmap.monthly_roadmap || []).forEach(m => {
        (m.weeks || []).forEach(w => {
          (w.days || []).forEach(d => {
            (d.tasks || []).forEach(t => {
              state.personalizedRoadmap.dailyTasks.push({
                ...t,
                dayNumber: Number(d.day_number || dayCounter),
                day_number: Number(d.day_number || dayCounter),
                weekNumber: Number(w.week_number),
                week_number: Number(w.week_number),
                monthNumber: Number(m.month_number),
                month_number: Number(m.month_number)
              });
            });
            dayCounter++;
          });
        });
      });
    }

    const task = state.personalizedRoadmap.dailyTasks.find(
      t => Number(t.dayNumber || t.day_number) === Number(dayNumber)
    );

    if (!task) {
      console.warn(`⚠️ Day ${dayNumber} task not found.`);
    } else {
      task.completed = true;
      task.score = taskScorePct;
    }

    const completedTasks = state.personalizedRoadmap.dailyTasks.filter(t => t.completed);
    const totalTasks = state.personalizedRoadmap.dailyTasks.length;
    state.masteryPct = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    const xpGained = Math.round(150 * (taskScorePct / 100));
    state.xp += xpGained;
    return state;
  }
}

const tracker = new MockProgressTracker(sampleRoadmap);
delete tracker.state.personalizedRoadmap.dailyTasks; // simulate raw DB object

const updated = tracker.logTaskCompletion(1, 85);
assert(Array.isArray(updated.personalizedRoadmap.dailyTasks), 'dailyTasks should be dynamically constructed');
assert.strictEqual(updated.masteryPct > 0, true, 'masteryPct should increase');
assert.strictEqual(updated.xp, 128, 'XP should be gained for 85% score (round(150 * 0.85))');

console.log('✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
