require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const candidateModels = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.6-27b',
  'groq/compound-mini',
  'groq/compound'
];

async function checkModels() {
  const systemPrompt = `You are the AI Domain Selection Advisor for AgPlacify.
The 8 Canonical Domains are:
1. "fullstack" -> "Full-Stack Web Development"
2. "datascience" -> "Data Science & Machine Learning"
3. "dsa" -> "Data Structures & Algorithms (Interview Prep)"
4. "devops" -> "Cloud Engineering & DevOps"
5. "cybersecurity" -> "Cybersecurity & Ethical Hacking"
6. "mobile" -> "Mobile App Development (React Native & Flutter)"
7. "ai_llm" -> "AI & LLM Systems Engineering"
8. "system_design" -> "System Design & Distributed Architecture"
Return JSON: {"reply": "Hello!", "recommendation": null, "isComplete": false}`;

  for (const model of candidateModels) {
    try {
      console.log(`Testing model: ${model}...`);
      const res = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'I like AI' }
        ],
        model: model,
        response_format: { type: 'json_object' },
        max_tokens: 500
      });
      console.log(`✅ SUCCESS with model ${model}! Response:`, res.choices[0]?.message?.content);
    } catch (err) {
      console.log(`❌ Failed model ${model}:`, err.message);
    }
  }
}

checkModels();
