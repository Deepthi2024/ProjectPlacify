# Placify Roadmap V5 Changes

## Roadmap generation
- Monthly titles are now derived from the actual skills assigned to that month instead of repeating the same domain/level title.
- Monthly estimated hours are calculated from the four generated weeks.
- Week estimated hours are calculated from the actual daily task minutes.
- Every day contains 2-3 actionable tasks, including a separate assessment-review task on Day 7.
- Daily task minutes fill the configured daily study time (1-4+ hours) without dropping to a single 45-minute block.

## DSA curriculum
- Added a programming-fundamentals foundation before Big-O for DSA beginners.
- Beginner DSA sequence now starts with programming basics, conditionals/loops/basic problems, functions/arrays/strings, then Big-O and later DSA.
- Existing DSA language selection remains conditional: it is used only when DSA is selected.

## Task completion
- Added POST /api/task/status to persist individual task completion without forcing an adaptive replan.
- Daily task UI now has an individual Mark Task Complete / Completed control.
- Completion state is preserved in normalized roadmap data and local UI state.

## Verification
- All 8 domains tested at 6-month Beginner roadmaps.
- Month themes unique, month/week hours consistent, and every day has 2-3 tasks.
- DSA Beginner prerequisite order explicitly verified.
- DSA language propagation tested for C++, Java, Python, JavaScript, and C.
- Non-DSA domains verified to remain language-neutral.
- Existing weekly uniqueness acceptance passed.
- JavaScript syntax checks passed for engine, server, and frontend files.
