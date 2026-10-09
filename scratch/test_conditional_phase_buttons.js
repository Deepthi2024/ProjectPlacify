const assert = require('assert');

// Simulate the button decision logic from app.js
function evaluatePhaseButtons(dayObj, monthNum, weekNum, userState) {
  const rawTasks = Array.isArray(dayObj.tasks) ? dayObj.tasks : [];
  const totalTasks = rawTasks.length;
  const completedTasks = rawTasks.filter(t => t.completed === true || String(t.status || '').toUpperCase() === 'COMPLETED').length;
  const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;

  const phaseKey = `m${monthNum}_w${weekNum}_d${dayObj.day_number}`;
  const assessmentTaken = Boolean(
    dayObj.assessment_taken === true ||
    dayObj.assessmentTaken === true ||
    dayObj.assessment_completed === true ||
    (userState?.phaseAssessments && (userState.phaseAssessments[phaseKey] || (dayObj.id && userState.phaseAssessments[dayObj.id]) || (dayObj.day_id && userState.phaseAssessments[dayObj.day_id]))) ||
    (Array.isArray(userState?.history) && userState.history.some(h => 
      h.phaseKey === phaseKey ||
      (dayObj.id && h.dayId === dayObj.id) ||
      (dayObj.day_id && h.dayId === dayObj.day_id) ||
      (Number(h.monthNumber) === Number(monthNum) && Number(h.weekNumber) === Number(weekNum) && Number(h.dayNumber) === Number(dayObj.day_number))
    ))
  );

  if (allTasksCompleted && !assessmentTaken) {
    return ['Review Phase', 'Take Assessment'];
  } else if (completedTasks > 0 && !allTasksCompleted) {
    return ['Continue Phase'];
  } else if (allTasksCompleted && assessmentTaken) {
    return ['Review Phase'];
  } else {
    return ['Launch Phase'];
  }
}

console.log('=== RUNNING CONDITIONAL PHASE BUTTONS TEST SUITE ===\n');

// 1. Scenario 1: No tasks completed -> Launch Phase
const phase1 = {
  day_number: 1,
  tasks: [
    { taskId: 't1', title: 'Task 1', completed: false },
    { taskId: 't2', title: 'Task 2', completed: false }
  ]
};
const buttons1 = evaluatePhaseButtons(phase1, 1, 1, { phaseAssessments: {} });
assert.deepStrictEqual(buttons1, ['Launch Phase'], 'Scenario 1 failed: Should show Launch Phase');
console.log('✅ Scenario 1 Passed: No tasks completed -> Launch Phase');

// 2. Scenario 2: Some tasks completed -> Continue Phase
const phase2 = {
  day_number: 2,
  tasks: [
    { taskId: 't3', title: 'Task 3', completed: true },
    { taskId: 't4', title: 'Task 4', completed: false }
  ]
};
const buttons2 = evaluatePhaseButtons(phase2, 1, 1, { phaseAssessments: {} });
assert.deepStrictEqual(buttons2, ['Continue Phase'], 'Scenario 2 failed: Should show Continue Phase');
console.log('✅ Scenario 2 Passed: Some tasks completed -> Continue Phase');

// 3. Scenario 3: All tasks completed, assessment not taken -> Review Phase + Take Assessment
const phase3 = {
  day_number: 3,
  tasks: [
    { taskId: 't5', title: 'Task 5', completed: true },
    { taskId: 't6', title: 'Task 6', completed: true }
  ]
};
const buttons3 = evaluatePhaseButtons(phase3, 1, 1, { phaseAssessments: {} });
assert.deepStrictEqual(buttons3, ['Review Phase', 'Take Assessment'], 'Scenario 3 failed: Should show Review Phase + Take Assessment');
console.log('✅ Scenario 3 Passed: All tasks completed, assessment not taken -> Review Phase + Take Assessment');

// 4. Scenario 4: All tasks completed, assessment taken -> Review Phase
const phase4 = {
  day_number: 4,
  tasks: [
    { taskId: 't7', title: 'Task 7', completed: true },
    { taskId: 't8', title: 'Task 8', completed: true }
  ]
};
const userStateWithAssessment = {
  phaseAssessments: {
    'm1_w1_d4': { taken: true, score: 85 }
  }
};
const buttons4 = evaluatePhaseButtons(phase4, 1, 1, userStateWithAssessment);
assert.deepStrictEqual(buttons4, ['Review Phase'], 'Scenario 4 failed: Should show Review Phase only');
console.log('✅ Scenario 4 Passed: All tasks completed, assessment taken -> Review Phase');

// 5. Scenario 5: Phase with 0 tasks -> Launch Phase
const phaseEmpty = { day_number: 5, tasks: [] };
const buttonsEmpty = evaluatePhaseButtons(phaseEmpty, 1, 1, { phaseAssessments: {} });
assert.deepStrictEqual(buttonsEmpty, ['Launch Phase'], 'Scenario 5 failed: Empty phase should show Launch Phase');
console.log('✅ Scenario 5 Passed: Empty phase -> Launch Phase');

// 6. Scenario 6: User Isolation (User A's assessment does not affect User B)
const userAState = { phaseAssessments: { 'm1_w1_d3': { taken: true } } };
const userBState = { phaseAssessments: {} };
const buttonsUserA = evaluatePhaseButtons(phase3, 1, 1, userAState);
const buttonsUserB = evaluatePhaseButtons(phase3, 1, 1, userBState);
assert.deepStrictEqual(buttonsUserA, ['Review Phase'], 'User A should see Review Phase');
assert.deepStrictEqual(buttonsUserB, ['Review Phase', 'Take Assessment'], 'User B should see Review Phase + Take Assessment');
console.log('✅ Scenario 6 Passed: User A and User B maintain isolated assessment button states');

// 7. Scenario 7: Independent Phase Evaluation within same week
const weekPhases = [
  { day_number: 1, tasks: [{ completed: true }], assessment_taken: true }, // Review Phase
  { day_number: 2, tasks: [{ completed: true }], assessment_taken: false }, // Review Phase + Take Assessment
  { day_number: 3, tasks: [{ completed: true }, { completed: false }] }, // Continue Phase
  { day_number: 4, tasks: [{ completed: false }, { completed: false }] }, // Launch Phase
  { day_number: 5, tasks: [{ completed: false }] }, // Launch Phase
  { day_number: 6, tasks: [{ completed: false }] }, // Launch Phase
  { day_number: 7, tasks: [{ completed: false }] }  // Launch Phase
];

const weekButtons = weekPhases.map(p => evaluatePhaseButtons(p, 1, 1, { phaseAssessments: {} }));
assert.deepStrictEqual(weekButtons[0], ['Review Phase']);
assert.deepStrictEqual(weekButtons[1], ['Review Phase', 'Take Assessment']);
assert.deepStrictEqual(weekButtons[2], ['Continue Phase']);
assert.deepStrictEqual(weekButtons[3], ['Launch Phase']);
assert.deepStrictEqual(weekButtons[4], ['Launch Phase']);
assert.deepStrictEqual(weekButtons[5], ['Launch Phase']);
assert.deepStrictEqual(weekButtons[6], ['Launch Phase']);
console.log('✅ Scenario 7 Passed: All 7 phases in week evaluated independently');

console.log('\n🎉 ALL CONDITIONAL PHASE BUTTON TESTS PASSED SUCCESSFULLY!');
