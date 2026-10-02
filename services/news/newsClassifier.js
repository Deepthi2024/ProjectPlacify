/**
 * News Classifier - Classifies technology articles into topics/skills and generates short summaries.
 * Uses Groq LLM when available, with a robust keyword pattern matching fallback.
 */

const Groq = require('groq-sdk');

// Centralized Tech Taxonomy configuration
const TECH_TAXONOMY = {
  topics: [
    'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Data Analytics',
    'Software Development', 'Web Development', 'Cybersecurity', 'Cloud Computing',
    'DevOps', 'Databases', 'Programming', 'Python', 'Java', 'C++', 'JavaScript',
    'React', 'Node.js', 'Blockchain', 'Computer Science', 'Startups', 'Open Source',
    'Developer Tools', 'Cloud', 'Big Data', 'LLMs', 'Generative AI', 'System Design'
  ],

  skills: [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'MongoDB',
    'HTML/CSS', 'Git', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Machine Learning',
    'Deep Learning', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Java', 'C++',
    'Algorithms', 'Data Structures', 'REST API', 'GraphQL', 'Linux', 'Security'
  ],

  categories: {
    'AI': ['ai', 'machine learning', 'deep learning', 'llm', 'generative ai', 'chatgpt', 'openai', 'claude', 'neural', 'nlp', 'pytorch', 'tensorflow'],
    'WebDev': ['react', 'javascript', 'typescript', 'node.js', 'express', 'frontend', 'backend', 'web', 'css', 'html', 'next.js', 'vue', 'angular'],
    'Cybersecurity': ['cybersecurity', 'security', 'hack', 'vulnerability', 'breach', 'encryption', 'malware', 'zero-day', 'firewall', 'ransomware'],
    'Cloud/DevOps': ['cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'devops', 'ci/cd', 'terraform', 'serverless', 'microservices'],
    'Data Science': ['data science', 'sql', 'big data', 'pandas', 'analytics', 'data pipeline', 'database', 'postgres', 'mongodb']
  }
};

/**
 * Fallback Keyword Classifier
 */
function classifyWithKeywords(title, description) {
  const combinedText = `${title || ''} ${description || ''}`.toLowerCase();
  
  const matchedTopics = new Set();
  const matchedSkills = new Set();
  let assignedCategory = 'General Tech';

  // Check topics
  TECH_TAXONOMY.topics.forEach(topic => {
    if (combinedText.includes(topic.toLowerCase())) {
      matchedTopics.add(topic);
    }
  });

  // Check skills
  TECH_TAXONOMY.skills.forEach(skill => {
    if (combinedText.includes(skill.toLowerCase())) {
      matchedSkills.add(skill);
    }
  });

  // Check category
  for (const [categoryName, keywords] of Object.entries(TECH_TAXONOMY.categories)) {
    if (keywords.some(kw => combinedText.includes(kw))) {
      assignedCategory = categoryName;
      break;
    }
  }

  // Fallback summary generation
  let summary = description ? description.trim() : title;
  if (summary.length > 250) {
    summary = summary.substring(0, 247) + '...';
  }

  return {
    topics: Array.from(matchedTopics),
    skills: Array.from(matchedSkills),
    category: assignedCategory,
    summary: summary || title
  };
}

/**
 * AI Classification using Groq
 */
async function classifyWithGroq(title, description) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const groq = new Groq({ apiKey });
    const prompt = `You are a technology news classifier. Analyze the following tech article metadata and extract relevant information.
Return ONLY valid JSON matching this schema, with no markdown formatting or commentary:
{
  "topics": ["list of matching high-level tech topics from: Artificial Intelligence, Machine Learning, Data Science, Web Development, Software Development, Cybersecurity, Cloud Computing, DevOps, Databases, Startups, Open Source, LLMs, Generative AI"],
  "skills": ["list of specific technical skills mentioned or required e.g. Python, JavaScript, React, Node.js, SQL, Docker, AWS, C++, Machine Learning"],
  "category": "one of: AI, WebDev, Cybersecurity, Cloud/DevOps, Data Science, General Tech",
  "summary": "Concise 2-3 sentence factual summary strictly grounded in the title and description provided below."
}

Article Title: ${title}
Article Description: ${description || 'N/A'}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      temperature: 0.2,
      max_tokens: 300
    });


    const content = chatCompletion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      topics: Array.isArray(parsed.topics) ? parsed.topics : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      category: parsed.category || 'General Tech',
      summary: parsed.summary || (description ? description.substring(0, 240) : title)
    };
  } catch (err) {
    console.warn('[NewsClassifier] Groq classification failed/bypassed, using keyword fallback:', err.message);
    return null;
  }
}

/**
 * Main Classify Function
 */
async function classifyArticle(title, description) {
  // Try Groq classification first if key is present
  if (process.env.GROQ_API_KEY) {
    const aiResult = await classifyWithGroq(title, description);
    if (aiResult) {
      return aiResult;
    }
  }

  // Fallback to keyword classifier
  return classifyWithKeywords(title, description);
}

module.exports = {
  TECH_TAXONOMY,
  classifyArticle,
  classifyWithKeywords
};
