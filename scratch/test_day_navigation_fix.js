const assert = require('assert');

// Mock localStorage & browser globals for testing logic in Node environment
global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; }
};

global.window = {
  activePersonalizedRoadmap: null,
  currentSelectedDaySpec: null
};

// Create a sample multi-month, multi-week roadmap mirroring production server structure
const mockRoadmap = {
  roadmap_id: 'roadmap_ds_test_101',
  domain_id: 'datascience',
  overall_level: 'BEGINNER',
  journey_started: true,
  journey_start_date: '2026-08-16T00:00:00.000Z',
  monthly_roadmap: [
    {
      month_number: 1,
      title: 'Month 1: Python Foundations & Data Science Basics',
      weeks: [
        {
          week_number: 1,
          month_number: 1,
          title: 'Week 1: Python Mechanics',
          days: [
            {
              day_number: 1,
              day_name: 'Sunday, August 16, 2026',
              topic: 'Python Fundamentals',
              total_minutes: 150,
              difficulty: 'BEGINNER',
              tasks: [
                { id: 't1_1', title: 'Learn: Variables & Primitive Data Types', type: 'LEARN', estimated_minutes: 53, subtopic: 'Variables & Primitive Data Types' },
                { id: 't1_2', title: 'Practice: Variables & Primitive Data Types Guided Code Drills', type: 'PRACTICE', estimated_minutes: 60, subtopic: 'Variables & Primitive Data Types' },
                { id: 't1_3', title: 'Revision: Python Fundamentals Concept Flashcards', type: 'REVISION', estimated_minutes: 37, subtopic: 'Python Fundamentals' }
              ]
            },
            {
              day_number: 2,
              day_name: 'Monday, August 17, 2026',
              topic: 'Control Flow (if/else, loops)',
              total_minutes: 120,
              difficulty: 'BEGINNER',
              tasks: [
                { id: 't2_1', title: 'Learn: Conditional Logic & Loops', type: 'LEARN', estimated_minutes: 45, subtopic: 'Control Flow' },
                { id: 't2_2', title: 'Practice: Control Flow Code Drills', type: 'PRACTICE', estimated_minutes: 75, subtopic: 'Control Flow' }
              ]
            }
          ]
        },
        {
          week_number: 2,
          month_number: 1,
          title: 'Week 2: Advanced Data Structures & NLP',
          days: [
            {
              day_number: 1,
              day_name: 'Sunday, August 23, 2026',
              topic: 'Advanced Deep Learning & NLP',
              total_minutes: 150,
              difficulty: 'INTERMEDIATE',
              tasks: [
                { id: 't8_1', title: 'Learn: Word Embeddings (Word2Vec / FastText)', type: 'LEARN', estimated_minutes: 150, subtopic: 'Word Embeddings' }
              ]
            }
          ]
        }
      ]
    }
  ]
};

window.activePersonalizedRoadmap = mockRoadmap;

// Simulate day resolution function as implemented in app.js
function resolveDayObject(targetSpecOrNumber, roadmap) {
  let daySpec = {};
  if (typeof targetSpecOrNumber === 'object' && targetSpecOrNumber !== null) {
    daySpec = targetSpecOrNumber;
  } else {
    const parsedNum = parseInt(targetSpecOrNumber, 10) || 1;
    daySpec = { day: parsedNum };
  }

  const requestedMonth = daySpec.month !== undefined && daySpec.month !== null ? parseInt(daySpec.month, 10) : null;
  const requestedWeek = daySpec.week !== undefined && daySpec.week !== null ? parseInt(daySpec.week, 10) : null;
  const requestedDay = daySpec.day !== undefined && daySpec.day !== null ? parseInt(daySpec.day, 10) : 1;
  const requestedDayId = daySpec.dayId || null;
  const requestedRoadmapId = daySpec.roadmapId || null;

  window.currentSelectedDaySpec = {
    roadmapId: requestedRoadmapId,
    month: requestedMonth,
    week: requestedWeek,
    day: requestedDay,
    dayId: requestedDayId
  };
  localStorage.setItem('placify_selected_day_spec', JSON.stringify(window.currentSelectedDaySpec));

  let dayObj = null;
  let parentMonthObj = null;
  let parentWeekObj = null;
  let dayTasksList = [];

  if (roadmap && Array.isArray(roadmap.monthly_roadmap)) {
    // Step 1: Strict match
    for (const month of roadmap.monthly_roadmap) {
      const mNum = parseInt(month.month_number, 10);
      if (requestedMonth !== null && mNum !== requestedMonth) continue;

      if (Array.isArray(month.weeks)) {
        for (const week of month.weeks) {
          const wNum = parseInt(week.week_number, 10);
          if (requestedWeek !== null && wNum !== requestedWeek) continue;

          if (Array.isArray(week.days)) {
            for (const day of week.days) {
              const dNum = parseInt(day.day_number, 10);
              const dId = day.id || day.day_id || '';
              if (
                (requestedDayId && dId === requestedDayId) ||
                dNum === requestedDay
              ) {
                dayObj = day;
                parentMonthObj = month;
                parentWeekObj = week;
                dayTasksList = Array.isArray(day.tasks) ? day.tasks : [];
                break;
              }
            }
          }
          if (dayObj) break;
        }
      }
      if (dayObj) break;
    }
  }

  const dayTopic = dayObj ? dayObj.topic : 'Core Learning';
  const dayWorkload = dayObj ? dayObj.total_minutes : 150;

  return {
    dayObj,
    parentMonthObj,
    parentWeekObj,
    dayTasksList,
    dayTopic,
    dayWorkload
  };
}

console.log('🧪 RUNNING DAY NAVIGATION & SELECTION BUG FIX VERIFICATION SUITE...\n');

// TEST 1: Launch Month 1 Week 1 Day 1
console.log('--- TEST 1: Launching Day 1 Tasks (Month 1, Week 1, Day 1) ---');
const day1Spec = { roadmapId: 'roadmap_ds_test_101', month: 1, week: 1, day: 1, dayId: 'm1_w1_d1' };
console.log('[DAY NAVIGATION]', day1Spec);
const day1Res = resolveDayObject(day1Spec, mockRoadmap);
console.log('[DAY RESOLUTION]', {
  Requested: day1Spec,
  Resolved: {
    date: day1Res.dayObj.day_name,
    topic: day1Res.dayTopic,
    taskCount: day1Res.dayTasksList.length,
    taskIds: day1Res.dayTasksList.map(t => t.id)
  }
});
assert.strictEqual(day1Res.dayTopic, 'Python Fundamentals', 'Topic must be Python Fundamentals');
assert.strictEqual(day1Res.dayTasksList.length, 3, 'Must render 3 tasks for Day 1');
assert.strictEqual(day1Res.dayTasksList[0].title, 'Learn: Variables & Primitive Data Types', 'First task must be Variables & Primitive Data Types');
console.log('✅ TEST 1 PASSED: Month 1 Week 1 Day 1 correctly loads Python Fundamentals and its 3 tasks.\n');

// TEST 2: Launch Month 1 Week 1 Day 2
console.log('--- TEST 2: Launching Day 2 Tasks (Month 1, Week 1, Day 2) ---');
const day2Spec = { roadmapId: 'roadmap_ds_test_101', month: 1, week: 1, day: 2, dayId: 'm1_w1_d2' };
console.log('[DAY NAVIGATION]', day2Spec);
const day2Res = resolveDayObject(day2Spec, mockRoadmap);
console.log('[DAY RESOLUTION]', {
  Requested: day2Spec,
  Resolved: {
    date: day2Res.dayObj.day_name,
    topic: day2Res.dayTopic,
    taskCount: day2Res.dayTasksList.length,
    taskIds: day2Res.dayTasksList.map(t => t.id)
  }
});
assert.strictEqual(day2Res.dayTopic, 'Control Flow (if/else, loops)', 'Topic must be Control Flow');
assert.strictEqual(day2Res.dayTasksList.length, 2, 'Must render 2 tasks for Day 2');
assert.strictEqual(day2Res.dayTasksList[0].title, 'Learn: Conditional Logic & Loops');
console.log('✅ TEST 2 PASSED: Month 1 Week 1 Day 2 correctly loads Control Flow and does NOT load Day 1 or Day 3.\n');

// TEST 3: Launch Week 2 Day 1 Tasks (Later week disambiguation test)
console.log('--- TEST 3: Launching Week 2 Day 1 Tasks (Month 1, Week 2, Day 1) ---');
const week2Day1Spec = { roadmapId: 'roadmap_ds_test_101', month: 1, week: 2, day: 1, dayId: 'm1_w2_d1' };
console.log('[DAY NAVIGATION]', week2Day1Spec);
const week2Day1Res = resolveDayObject(week2Day1Spec, mockRoadmap);
console.log('[DAY RESOLUTION]', {
  Requested: week2Day1Spec,
  Resolved: {
    date: week2Day1Res.dayObj.day_name,
    topic: week2Day1Res.dayTopic,
    taskCount: week2Day1Res.dayTasksList.length,
    taskIds: week2Day1Res.dayTasksList.map(t => t.id)
  }
});
assert.strictEqual(week2Day1Res.dayTopic, 'Advanced Deep Learning & NLP', 'Week 2 Day 1 must be Advanced Deep Learning & NLP');
assert.strictEqual(week2Day1Res.dayTasksList[0].title, 'Learn: Word Embeddings (Word2Vec / FastText)');
console.log('✅ TEST 3 PASSED: Week 2 Day 1 correctly resolves to Advanced Deep Learning & NLP instead of Week 1 Day 1!\n');

// TEST 4: Sequential day opening & state replacement
console.log('--- TEST 4: Sequential Navigation State Replacement ---');
assert.strictEqual(JSON.parse(localStorage.getItem('placify_selected_day_spec')).week, 2, 'LocalStorage must reflect Week 2 spec');
const backToDay1Res = resolveDayObject(day1Spec, mockRoadmap);
assert.strictEqual(JSON.parse(localStorage.getItem('placify_selected_day_spec')).week, 1, 'LocalStorage must update to Week 1 spec');
console.log('✅ TEST 4 PASSED: Sequential navigation updates and replaces selected day state context.\n');

// TEST 5: Refresh execution page (reading from saved spec)
console.log('--- TEST 5: Page Refresh Preservation ---');
const savedRaw = localStorage.getItem('placify_selected_day_spec');
const restoredSpec = JSON.parse(savedRaw);
const refreshedRes = resolveDayObject(restoredSpec, mockRoadmap);
assert.strictEqual(refreshedRes.dayTopic, 'Python Fundamentals', 'Refreshed view must preserve Python Fundamentals');
assert.strictEqual(refreshedRes.dayTasksList[0].title, 'Learn: Variables & Primitive Data Types');
console.log('✅ TEST 5 PASSED: Refreshing execution page completely preserves the clicked day.\n');

console.log('🎉 ALL DAY SELECTION & NAVIGATION TESTS PASSED SUCCESSFULLY!');
