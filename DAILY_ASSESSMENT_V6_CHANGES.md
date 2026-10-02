# Placify Daily Assessment & Task Flow V6

## Implemented

1. Individual daily task completion
   - Each learning task has its own completion control.
   - Completion is persisted through `/api/task/status`.
   - The status endpoint accepts task context as a fallback when a client has a stale task id.

2. Optional NPTEL-style daily assessment
   - Assessment is not compulsory.
   - The generator creates 8 questions per day:
     - 4 MCQ
     - 2 MSQ
     - 1 NAT numerical answer
     - 1 SHORT_ANSWER written response
   - Questions are generated from the current day's task context and learner level.
   - DSA assessment examples respect the selected DSA programming language.

3. Assessment grading
   - MCQ, MSQ and NAT are deterministically graded.
   - Written answers are graded with a short-answer rubric through the configured Groq model, with a keyword fallback.
   - Score and detailed feedback are returned.

4. Optional interview practice
   - After submitting the daily assessment, the learner can optionally open 5 placement-oriented interview questions for the same day's topics.
   - Suggested answers can be revealed individually.
   - Interview practice can be skipped without blocking the next day.

5. Assessment skipping
   - The learner can skip the assessment from the Daily Hub or assessment page.
   - Skipping immediately continues to the next real roadmap day.
   - Day 7 correctly advances to the next week's Day 1 instead of attempting Day 8.

6. Unfinished-task rollover
   - When moving to the next day, unfinished learning/practice/implementation/revision tasks are carried forward.
   - Assessment tasks are not automatically carried forward because the assessment itself is optional.
   - Carried tasks are marked as `ROLLED_OVER` in the previous day for history.
   - If tomorrow would exceed the learner's daily-hours capacity, originally planned unfinished tasks are deferred forward to subsequent days.

## Validation performed

- All 8 domains x Beginner/Intermediate/Advanced roadmap generation.
- 2-3 daily tasks and exact duration totals across generated days.
- DSA language isolation.
- Assessment question type contract: MCQ/MSQ/NAT/SHORT_ANSWER.
- Written-answer grading path.
- Rollover capacity behavior.
- Existing V5 roadmap acceptance tests.
- Existing DSA language acceptance tests.
- JavaScript syntax checks for all modified JS files.
