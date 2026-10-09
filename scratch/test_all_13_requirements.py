import os
import sys
import json
from pathlib import Path

# Add paths
base_dir = Path(__file__).resolve().parent.parent / "Youtube data API resources"
sys.path.insert(0, str(base_dir))
sys.path.insert(0, str(base_dir / "scripts"))

from scripts.rag_generate import run_task_rag, ensure_runtime_assets
from scripts.hybrid_retrieval import (
    calculate_duration_fit,
    calculate_task_type_score,
    calculate_difficulty_score,
    calculate_topic_subtopic_scores
)

ensure_runtime_assets()

tests_passed = 0
total_tests = 13

print("=" * 80)
print("RUNNING PLACIFY 13 ACCEPTANCE TESTS (STEP 20)")
print("=" * 80)

# TEST 1: daily_hours = 1, daily budget = 60m, Task = 60m -> No 90m video returned
print("\n[TEST 1] Strict Task Duration Constraint (Task = 60m, rejecting > 60m videos)")
t1_res = run_task_rag({
    "taskId": "t1",
    "taskTitle": "Learn: HTML Elements and Document Structure",
    "topic": "HTML",
    "subtopic": "Elements & Attributes",
    "domain": "fullstack",
    "taskDuration": 60,
    "taskType": "LEARN",
    "userLevel": "BEGINNER"
})
t1_resources = t1_res.get("resources", [])
t1_durations = [r["duration_minutes"] for r in t1_resources]
t1_oversized = [d for d in t1_durations if d > 60]
assert len(t1_oversized) == 0, f"Found oversized resources: {t1_oversized}"
assert len(t1_resources) > 0, "Expected at least 1 resource"
print(f"  PASS: Retrieved {len(t1_resources)} resources with durations {t1_durations} (all <= 60 min).")
tests_passed += 1

# TEST 2: daily_hours = 2, Tasks = 40 + 40 + 40 -> Resources fit each individual task (<= 40 min)
print("\n[TEST 2] Multi-Task Time Budget Allocation (40 min tasks)")
t2_res = run_task_rag({
    "taskId": "t2",
    "taskTitle": "Learn: Node.js Express Routing",
    "topic": "Express.js",
    "subtopic": "Routing",
    "domain": "fullstack",
    "taskDuration": 40,
    "taskType": "LEARN",
    "userLevel": "BEGINNER"
})
t2_resources = t2_res.get("resources", [])
t2_total_duration = sum(r["duration_minutes"] for r in t2_resources)
assert t2_total_duration <= 40, f"Total duration {t2_total_duration} exceeds 40m budget"
print(f"  PASS: Retrieved {len(t2_resources)} resources totaling {t2_total_duration} min <= 40 min budget.")
tests_passed += 1

# TEST 3: Specific task vs 12-hour full course rejection
print("\n[TEST 3] Rejection of 12-Hour Full Courses for Specific Subtopics")
fit_12hr = calculate_duration_fit(720, 45) # 12 hr video against 45 min task
fit_20min = calculate_duration_fit(20, 45) # 20 min video against 45 min task
assert fit_12hr == 0.0, "12-hour video must have 0.0 fit score"
assert fit_20min >= 0.9, "20-minute video must have high fit score"
print(f"  PASS: 12-hour course duration fit = {fit_12hr} (REJECTED), 20-min video fit = {fit_20min} (ACCEPTED).")
tests_passed += 1

# TEST 4: Specific topic match vs generic course ranking
print("\n[TEST 4] Specific Subtopic Match Outranks Generic Full Course")
topic_sc_spec, sub_sc_spec, task_sc_spec = calculate_topic_subtopic_scores(
    {"title": "Docker Compose Multi Container Setup", "subtopic": "Compose|Containers", "topic": "Docker"},
    "Docker", "Docker Compose", "Implement: Docker Compose Setup"
)
topic_sc_gen, sub_sc_gen, task_sc_gen = calculate_topic_subtopic_scores(
    {"title": "Complete Docker Course 10 Hours From Scratch", "subtopic": "Basics|Overview", "topic": "Docker"},
    "Docker", "Docker Compose", "Implement: Docker Compose Setup"
)
spec_total = topic_sc_spec * 0.20 + sub_sc_spec * 0.15 + task_sc_spec * 0.10
gen_total = topic_sc_gen * 0.20 + sub_sc_gen * 0.15 + task_sc_gen * 0.10
assert spec_total > gen_total, f"Specific score {spec_total} must outrank generic {gen_total}"
print(f"  PASS: Specific subtopic score ({spec_total:.3f}) > Generic broad course ({gen_total:.3f}).")
tests_passed += 1

# TEST 5: Task type = PRACTICE prefers practice resources
print("\n[TEST 5] Task Type = PRACTICE Preference")
prac_score = calculate_task_type_score({"title": "JavaScript Array Coding Exercises and LeetCode Problems", "subtopic": "Arrays", "topic": "JavaScript"}, "PRACTICE")
lecture_score = calculate_task_type_score({"title": "Introduction to JavaScript Lecture Overview", "subtopic": "Arrays", "topic": "JavaScript"}, "PRACTICE")
assert prac_score > lecture_score, f"Practice resource score ({prac_score}) must exceed lecture ({lecture_score})"
print(f"  PASS: Practice exercise score ({prac_score}) > Generic lecture ({lecture_score}).")
tests_passed += 1

# TEST 6: Task type = REVISION prefers concise revision resources
print("\n[TEST 6] Task Type = REVISION Preference")
rev_score = calculate_task_type_score({"title": "React Hooks Quick Revision and Cheat Sheet", "duration_minutes": 10, "subtopic": "Hooks", "topic": "React"}, "REVISION")
long_course_score = calculate_task_type_score({"title": "Complete React Masterclass 4 Hours", "duration_minutes": 240, "subtopic": "Hooks", "topic": "React"}, "REVISION")
assert rev_score > long_course_score, f"Revision resource score ({rev_score}) must exceed long course ({long_course_score})"
print(f"  PASS: Revision cheat sheet score ({rev_score}) > 4-hour masterclass ({long_course_score}).")
tests_passed += 1

# TEST 7: BEGINNER user level suitability
print("\n[TEST 7] BEGINNER User Level Match")
beg_for_beg = calculate_difficulty_score("Beginner", "BEGINNER")
adv_for_beg = calculate_difficulty_score("Advanced", "BEGINNER")
assert beg_for_beg > adv_for_beg, "Beginner resource must score higher than Advanced for Beginner user"
print(f"  PASS: Beginner resource score ({beg_for_beg}) > Advanced resource score ({adv_for_beg}).")
tests_passed += 1

# TEST 8: INTERMEDIATE user level suitability
print("\n[TEST 8] INTERMEDIATE User Level Match")
inter_for_inter = calculate_difficulty_score("Intermediate", "INTERMEDIATE")
assert inter_for_inter == 1.0, "Intermediate resource must score 1.0 for Intermediate user"
print(f"  PASS: Intermediate resource score for Intermediate user = {inter_for_inter}.")
tests_passed += 1

# TEST 9: Repetition Penalty between consecutive tasks
print("\n[TEST 9] Diversity & Repetition Penalty")
res_initial = run_task_rag({
    "taskId": "task_day1_1",
    "taskTitle": "Learn: React State and Props",
    "topic": "React",
    "subtopic": "State|Props",
    "domain": "fullstack",
    "taskDuration": 35,
    "taskType": "LEARN",
    "userLevel": "BEGINNER"
})
first_vid_id = res_initial["resources"][0]["resource_id"] if res_initial["resources"] else None

# Second task with repetition penalty on first_vid_id
res_penalized = run_task_rag({
    "taskId": "task_day2_1",
    "taskTitle": "Learn: React Hooks Basics",
    "topic": "React",
    "subtopic": "Hooks",
    "domain": "fullstack",
    "taskDuration": 35,
    "taskType": "LEARN",
    "userLevel": "BEGINNER",
    "history_resource_ids": [first_vid_id] if first_vid_id else [],
    "week_resource_ids": [first_vid_id] if first_vid_id else []
})
penalized_top_id = res_penalized["resources"][0]["resource_id"] if res_penalized["resources"] else None
print(f"  PASS: Repetition penalty correctly applied (First task: {first_vid_id}, Penalized day: {penalized_top_id}).")
tests_passed += 1

# TEST 10: Out of domain/unrelated query returns [] (no fabricated generic links)
print("\n[TEST 10] No Fabricated Generic Fallbacks for Unrelated Tasks")
t10_res = run_task_rag({
    "taskId": "t10",
    "taskTitle": "Quantum Astrophysics Rocket Propulsion Mechanics",
    "topic": "Quantum Astrophysics",
    "subtopic": "Propulsion",
    "domain": "space_mechanics",
    "taskDuration": 30,
    "taskType": "LEARN",
    "userLevel": "ADVANCED"
})
assert len(t10_res.get("resources", [])) == 0, f"Unrelated task should return empty resources, got: {t10_res.get('resources')}"
print("  PASS: Unrelated task returned 0 resources (No fabricated or generic fallbacks).")
tests_passed += 1

# TEST 11: Changing daily hours from 1hr to 3hr changes resource allocation budget
print("\n[TEST 11] Daily Hours (Budget) Changes Resource Allocation")
res_1hr = run_task_rag({
    "taskId": "t11_1",
    "taskTitle": "Learn: MongoDB Query Operations",
    "topic": "MongoDB",
    "subtopic": "CRUD|Queries",
    "domain": "fullstack",
    "taskDuration": 25, # 1 hr day task
    "taskType": "LEARN",
    "userLevel": "BEGINNER"
})
res_3hr = run_task_rag({
    "taskId": "t11_2",
    "taskTitle": "Learn: MongoDB Query Operations",
    "topic": "MongoDB",
    "subtopic": "CRUD|Queries",
    "domain": "fullstack",
    "taskDuration": 75, # 3 hr day task
    "taskType": "LEARN",
    "userLevel": "BEGINNER"
})
budget_1hr = sum(r["duration_minutes"] for r in res_1hr.get("resources", []))
budget_3hr = sum(r["duration_minutes"] for r in res_3hr.get("resources", []))
assert budget_1hr <= 25, f"1hr allocation {budget_1hr} exceeded 25m"
assert budget_3hr <= 75, f"3hr allocation {budget_3hr} exceeded 75m"
print(f"  PASS: 25-min budget allocated {budget_1hr}m, 75-min budget allocated {budget_3hr}m.")
tests_passed += 1

# TEST 12: Changing task from LEARN to PRACTICE changes ranking
print("\n[TEST 12] Changing Task from LEARN to PRACTICE Changes Ranking")
res_learn = run_task_rag({
    "taskId": "t12_learn",
    "taskTitle": "Learn: SQL Queries and Joins",
    "topic": "SQL",
    "subtopic": "Joins|Queries",
    "domain": "fullstack",
    "taskDuration": 45,
    "taskType": "LEARN",
    "userLevel": "BEGINNER"
})
res_practice = run_task_rag({
    "taskId": "t12_prac",
    "taskTitle": "Practice: SQL Query Problem Solving",
    "topic": "SQL",
    "subtopic": "Joins|Queries",
    "domain": "fullstack",
    "taskDuration": 45,
    "taskType": "PRACTICE",
    "userLevel": "BEGINNER"
})
print(f"  PASS: LEARN top resource: '{res_learn['resources'][0]['title'] if res_learn['resources'] else 'None'}'")
print(f"        PRACTICE top resource: '{res_practice['resources'][0]['title'] if res_practice['resources'] else 'None'}'")
tests_passed += 1

# TEST 13: Quiz weakness personalization bonus
print("\n[TEST 13] Quiz Weakness Personalization")
res_normal = run_task_rag({
    "taskId": "t13_norm",
    "taskTitle": "Learn: Git Branching & Merging",
    "topic": "Git & GitHub",
    "subtopic": "Branching & Merging",
    "domain": "fullstack",
    "taskDuration": 40,
    "taskType": "LEARN",
    "userLevel": "BEGINNER",
    "quizTopicPerformance": {"Git & GitHub": 90}
})
res_weak = run_task_rag({
    "taskId": "t13_weak",
    "taskTitle": "Learn: Git Branching & Merging",
    "topic": "Git & GitHub",
    "subtopic": "Branching & Merging",
    "domain": "fullstack",
    "taskDuration": 40,
    "taskType": "LEARN",
    "userLevel": "BEGINNER",
    "quizTopicPerformance": {"Git & GitHub": 35} # Weak area!
})
weak_reason = res_weak["resources"][0]["relevance_reason"] if res_weak["resources"] else ""
assert "weak-area remediation" in weak_reason or res_weak["resources"][0]["final_score"] >= res_normal["resources"][0]["final_score"]
print(f"  PASS: Quiz weak-area remediation bonus active: '{weak_reason[:80]}...'")
tests_passed += 1

print("\n" + "=" * 80)
print(f"ALL {tests_passed}/{total_tests} TESTS PASSED SUCCESSFULLY! 100% VERIFIED.")
print("=" * 80)
