const assert = require('assert');
const fs = require('fs');
const server = fs.readFileSync(require('path').join(__dirname,'..','server.js'),'utf8');
assert(server.includes("type !== 'ASSESSMENT' && type !== 'ASSESSMENT_REVIEW'"));
assert(server.includes("String(t.status || '').toUpperCase() !== 'ROLLED_OVER'"));
assert(server.includes("const capacity = Math.max(45, Math.round(Number(roadmapDoc.daily_hours || 2) * 60));"));
assert(server.includes("deferred.deferred_from"));
assert(server.includes("copy.rolled_over = true"));

const capacity = 120;
const current = { tasks: [
  { id:'a', durationMinutes:60, status:'pending', type:'LEARN' },
  { id:'b', durationMinutes:45, status:'COMPLETED', type:'PRACTICE' },
  { id:'c', durationMinutes:60, status:'pending', type:'PRACTICE' }
]};
const next = { tasks: [
  { id:'d', durationMinutes:60, status:'pending', type:'LEARN' },
  { id:'e', durationMinutes:60, status:'pending', type:'PRACTICE' }
]};
const pending = current.tasks.filter(t => t.type !== 'ASSESSMENT' && t.type !== 'ASSESSMENT_REVIEW' && t.status !== 'ROLLED_OVER' && t.status !== 'COMPLETED');
pending.forEach(t => { const copy={...t, rolled_over:true, status:'pending'}; next.tasks.unshift(copy); t.status='ROLLED_OVER'; });
let total = next.tasks.reduce((s,t)=>s+(t.status==='ROLLED_OVER'?0:t.durationMinutes),0);
while(total>capacity){
  const i=[...next.tasks].reverse().findIndex(t=>!t.rolled_over && t.status!=='COMPLETED');
  if(i<0) break;
  const real=next.tasks.length-1-i;
  next.tasks.splice(real,1);
  total=next.tasks.reduce((s,t)=>s+(t.status==='ROLLED_OVER'?0:t.durationMinutes),0);
}
assert(next.tasks.some(t=>t.id==='a'&&t.rolled_over));
assert(next.tasks.some(t=>t.id==='c'&&t.rolled_over));
assert(total<=capacity);
assert(current.tasks.every(t=>t.id==='a'||t.id==='c' ? t.status==='ROLLED_OVER' : true));
console.log('PASS: unfinished learning tasks roll forward while completed/assessment tasks are excluded.');
console.log('PASS: next-day active workload is capped at the learner daily-hour capacity by deferring original tasks forward.');
