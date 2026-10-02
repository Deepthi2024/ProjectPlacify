const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const src = fs.readFileSync(require('path').join(__dirname, '..', 'server.js'), 'utf8');
const start = src.indexOf('// ============================================================\n// ASSESSMENT + INTERVIEW HELPERS');
const end = src.indexOf('// ============================================================\n// 7. GENERATE USER ID', start);
assert(start >= 0 && end > start);
const helperCode = src.slice(start, end);
class FakeGroq {
  constructor() { this.chat = { completions: { create: async () => ({ choices: [{ message: { content: JSON.stringify({results:[{id:'written',points:2,max_points:2,feedback:'Correctly explained the concept.'}]}) } }] }) } }; }
}
const context = { Groq: FakeGroq, process: { env: { GROQ_API_KEY: 'test', GROQ_MODEL: 'test-model' } }, console };
vm.createContext(context);
vm.runInContext(helperCode, context);

const q1 = context.normalizeAssessmentQuestion({id:'q1',type:'MCQ',question:'x',options:['a','b','c','d'],correct:1},0);
const q2 = context.normalizeAssessmentQuestion({id:'q2',type:'MSQ',question:'x',options:['a','b','c','d'],correct:[0,2]},1);
const q3 = context.normalizeAssessmentQuestion({id:'q3',type:'NAT',question:'x',correct:42},2);
const q4 = context.normalizeAssessmentQuestion({id:'written',type:'SHORT_ANSWER',question:'Explain loops',model_answer:'Loops repeat a block while a condition is true.',expected_keywords:['repeat','condition','block']},3);
assert.deepStrictEqual(q1.options, ['a','b','c','d']);
assert.deepStrictEqual(q2.correct, [0,2]);
assert.strictEqual(q3.correct, 42);
assert.strictEqual(q4.points, 2);

(async () => {
  const result = await context.gradeWrittenAnswersWithGroq({ writtenQuestions:[q4], userAnswers:{written:'A loop repeats a block while a condition is checked.'} });
  assert.strictEqual(result.written.points, 2);
  console.log('PASS: assessment question normalization supports MCQ/MSQ/NAT/SHORT_ANSWER.');
  console.log('PASS: written-answer grading path returns scored feedback.');
})();
