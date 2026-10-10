const { orchestrateTaskResources } = require('../services/resources/resourcePipeline');

async function runTests() {
  console.log('=== TEST 1: DOM Selection (Should hit Level 1 Verified Video Chapters) ===');
  const res1 = await orchestrateTaskResources({
    taskId: 'task_dom_1',
    taskTitle: 'DOM Selection & Event Handling',
    topic: 'JavaScript',
    subtopic: 'DOM element selection, querySelector, addEventListener, event bubbling, and event delegation',
    domain: 'fullstack',
    difficulty: 'INTERMEDIATE',
    taskDuration: 45
  });
  console.log('Level used:', res1.levelUsed);
  console.log('Resources count:', res1.resources.length);
  res1.resources.forEach((r, i) => {
    console.log(` ${i+1}. [${r.resource_type} | ${r.verificationStatus}] ${r.title}`);
    console.log(`    URL: ${r.url}`);
    if (r.startTimestamp) console.log(`    Timestamp: ${r.startTimestamp} to ${r.endTimestamp}`);
  });

  console.log('\n=== TEST 2: C++ Graph BFS/DFS (Not in YouTube index -> Should hit Level 2 Tavily or Level 3/4) ===');
  const res2 = await orchestrateTaskResources({
    taskId: 'task_dsa_graph_1',
    taskTitle: 'Graph Traversal: BFS & DFS Implementation',
    topic: 'Data Structures & Algorithms',
    subtopic: 'Adjacency list, Breadth First Search, Depth First Search, Cycle Detection',
    domain: 'dsa',
    difficulty: 'INTERMEDIATE',
    taskDuration: 45
  });
  console.log('Level used:', res2.levelUsed);
  console.log('Resources count:', res2.resources.length);
  res2.resources.forEach((r, i) => {
    console.log(` ${i+1}. [${r.resource_type} | ${r.verificationStatus}] ${r.title}`);
    console.log(`    URL: ${r.url}`);
  });

  console.log('\n=== TEST 3: All 8 Domains Have Guaranteed Level 4 Fallback ===');
  const domains = ['fullstack', 'frontend', 'backend', 'datascience', 'dsa', 'devops', 'cybersecurity', 'ai_llm'];
  for (const d of domains) {
    const res = await orchestrateTaskResources({
      taskId: `task_${d}_fallback`,
      taskTitle: 'Core Engineering Milestone',
      topic: 'Technical Foundations',
      subtopic: 'Placement Preparation Track',
      domain: d,
      difficulty: 'INTERMEDIATE',
      taskDuration: 45
    });
    console.log(`- Domain '${d}': ${res.resources.length} resources | Level: ${res.levelUsed}`);
  }
}

runTests().catch(console.error);
