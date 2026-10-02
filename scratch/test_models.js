require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const candidateModels = [
  'llama-3.1-8b-instant',
  'llama3-8b-8192',
  'llama3-70b-8192',
  'mixtral-8x7b-32768',
  'gemma2-9b-it'
];

async function checkModels() {
  for (const model of candidateModels) {
    try {
      console.log(`Testing model: ${model}...`);
      const res = await groq.chat.completions.create({
        messages: [{ role: 'user', content: 'Hi' }],
        model: model,
        max_tokens: 10
      });
      console.log(`✅ SUCCESS with model: ${model}! Response:`, res.choices[0]?.message?.content);
      return model;
    } catch (err) {
      console.log(`❌ Failed model ${model}:`, err.message);
    }
  }
}

checkModels();
