require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const candidateModels = [
  'groq/compound',
  'groq/compound-mini',
  'qwen/qwen3.6-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b'
];

async function checkModels() {
  for (const model of candidateModels) {
    try {
      console.log(`Testing model: ${model}...`);
      const res = await groq.chat.completions.create({
        messages: [{ role: 'user', content: 'Hi! Reply in JSON format: {"reply":"Hello"}' }],
        model: model,
        response_format: { type: 'json_object' },
        max_tokens: 100
      });
      console.log(`✅ SUCCESS with model ${model}! Response:`, res.choices[0]?.message?.content);
      return model;
    } catch (err) {
      console.log(`❌ Failed model ${model}:`, err.message);
    }
  }
}

checkModels();
