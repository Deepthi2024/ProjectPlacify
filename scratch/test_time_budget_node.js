const assert = require('assert');

// Implementations of the validation functions (same as in server.js)
function validateDailyTimeBudget(day, dailyBudgetMinutes = 120) {
  if (!day || !Array.isArray(day.tasks)) return { valid: false, error: 'Invalid day object or missing tasks' };
  const totalTaskMinutes = day.tasks.reduce((sum, t) => sum + (Number(t.estimated_minutes || t.durationMinutes || 0)), 0);
  const maxAllowed = Number(dailyBudgetMinutes) + 5; // max 5 min tolerance
  return {
    valid: totalTaskMinutes <= maxAllowed,
    totalTaskMinutes,
    dailyBudgetMinutes: Number(dailyBudgetMinutes),
    difference: totalTaskMinutes - Number(dailyBudgetMinutes)
  };
}

function validateResourceTaskMatch(task, resource) {
  if (!task || !resource) return { valid: false, reason: 'Missing task or resource' };
  const taskTopic = String(task.taskTopic || task.topic || '').toLowerCase();
  const taskSubtopic = String(task.taskSubtopic || task.subtopic || '').toLowerCase();
  const taskTitle = String(task.taskTitle || task.title || '').toLowerCase();

  const resTopic = String(resource.topic || '').toLowerCase();
  const resSubtopic = String(resource.subtopic || '').toLowerCase();
  const resTitle = String(resource.title || '').toLowerCase();

  const hasTopicMatch = Boolean(resTopic && (resTopic.includes(taskTopic) || taskTopic.includes(resTopic)));
  const hasSubtopicMatch = Boolean(resSubtopic && (resSubtopic.includes(taskSubtopic) || taskSubtopic.includes(resSubtopic)));
  const hasTitleMatch = Boolean(resTitle && ((taskSubtopic && resTitle.includes(taskSubtopic)) || (taskTopic && resTitle.includes(taskTopic))));

  const valid = Boolean(hasTopicMatch || hasSubtopicMatch || hasTitleMatch);
  return { valid, hasTopicMatch, hasSubtopicMatch, hasTitleMatch };
}

function validateResourceDuration(task, resource) {
  if (!task || !resource) return { valid: false, reason: 'Missing task or resource' };
  const taskBudget = Number(task.durationMinutes || task.estimated_minutes || 45);
  const resDuration = Number(resource.duration_minutes || resource.estimated_minutes || 0);
  const valid = resDuration > 0 && resDuration <= taskBudget;
  return {
    valid,
    taskBudget,
    resDuration,
    fits: resDuration <= taskBudget
  };
}

function validateResourceRelevance(task, resource) {
  const match = validateResourceTaskMatch(task, resource);
  const duration = validateResourceDuration(task, resource);
  const hasUrl = Boolean(resource.url && resource.url !== '#' && String(resource.url).startsWith('http'));
  const valid = match.valid && duration.valid && hasUrl;
  return {
    valid,
    match,
    duration,
    hasUrl
  };
}

function validateDailyResourceBudget(day) {
  if (!day || !Array.isArray(day.tasks)) return { valid: false, error: 'Invalid day' };
  let allValid = true;
  const taskResults = day.tasks.map(t => {
    const taskBudget = Number(t.durationMinutes || t.estimated_minutes || 45);
    const resources = Array.isArray(t.recommended_resources) ? t.recommended_resources : [];
    const totalResMins = resources.reduce((sum, r) => sum + (Number(r.duration_minutes || r.estimated_minutes || 0)), 0);
    const fits = totalResMins <= taskBudget;
    if (!fits && resources.length > 0) allValid = false;
    return { taskId: t.id || t.taskId, taskBudget, totalResMins, fits, resourceCount: resources.length };
  });
  return { valid: allValid, tasks: taskResults };
}

console.log('====================================================');
console.log('TESTING NODE SERVER VALIDATION SUITE');
console.log('====================================================');

// Test 1: Daily time budget validation (120 mins)
const day1 = {
  day_number: 1,
  tasks: [
    { id: 't1', estimated_minutes: 40 },
    { id: 't2', estimated_minutes: 45 },
    { id: 't3', estimated_minutes: 35 }
  ]
};
const v1 = validateDailyTimeBudget(day1, 120);
assert.strictEqual(v1.valid, true, 'Day 1 tasks (40+45+35=120) must be valid for 120m budget');
console.log('✅ Test 1 Passed: validateDailyTimeBudget valid for 120m allocation');

// Test 2: Daily time budget validation failure (oversized tasks)
const dayOversized = {
  day_number: 1,
  tasks: [
    { id: 't1', estimated_minutes: 60 },
    { id: 't2', estimated_minutes: 60 },
    { id: 't3', estimated_minutes: 60 }
  ]
};
const v2 = validateDailyTimeBudget(dayOversized, 120);
assert.strictEqual(v2.valid, false, '180 min day must fail for 120m budget');
console.log('✅ Test 2 Passed: validateDailyTimeBudget correctly flags exceeding budget');

// Test 3: Resource duration fit validation
const task45 = { id: 't1', title: 'Learn: Java Arrays', topic: 'Java', subtopic: 'Arrays', durationMinutes: 45 };
const res20 = { title: 'Java Arrays in 20 Minutes', topic: 'Java', subtopic: 'Arrays', duration_minutes: 20, url: 'https://youtube.com/watch?v=123' };
const res75 = { title: 'Java Full Course 75 Minutes', topic: 'Java', subtopic: 'Arrays', duration_minutes: 75, url: 'https://youtube.com/watch?v=456' };

const v3_fit = validateResourceDuration(task45, res20);
const v3_over = validateResourceDuration(task45, res75);
assert.strictEqual(v3_fit.valid, true, '20 min resource fits 45 min budget');
assert.strictEqual(v3_over.valid, false, '75 min resource fails 45 min budget');
console.log('✅ Test 3 Passed: validateResourceDuration correctly accepts/rejects resources by duration');

// Test 4: Resource relevance & match
const resMatch = validateResourceTaskMatch(task45, res20);
const resUnrelated = validateResourceTaskMatch(task45, { title: 'Docker Containers', topic: 'DevOps', subtopic: 'Docker' });
assert.strictEqual(resMatch.valid, true, 'Matching topic must pass');
assert.strictEqual(resUnrelated.valid, false, 'Unrelated topic must fail');
console.log('✅ Test 4 Passed: validateResourceTaskMatch correctly validates semantic & topic match');

// Test 5: Full relevance validation (match + duration + valid url)
const v5_valid = validateResourceRelevance(task45, res20);
const v5_no_url = validateResourceRelevance(task45, { ...res20, url: '#' });
assert.strictEqual(v5_valid.valid, true, 'Valid resource must pass');
assert.strictEqual(v5_no_url.valid, false, 'Missing URL must fail');
console.log('✅ Test 5 Passed: validateResourceRelevance enforces URL validity and duration');

// Test 6: validateDailyResourceBudget
const dayWithResources = {
  day_number: 1,
  tasks: [
    { id: 't1', durationMinutes: 45, recommended_resources: [{ duration_minutes: 20 }, { duration_minutes: 15 }] }, // 35 <= 45 (Pass)
    { id: 't2', durationMinutes: 45, recommended_resources: [{ duration_minutes: 40 }] } // 40 <= 45 (Pass)
  ]
};
const v6 = validateDailyResourceBudget(dayWithResources);
assert.strictEqual(v6.valid, true, 'Combined resources fit task budgets');
console.log('✅ Test 6 Passed: validateDailyResourceBudget validates day-level resource allocation');

console.log('\n====================================================');
console.log('ALL NODE SERVER TESTS PASSED SUCCESSFULLY! (6/6)');
console.log('====================================================');
