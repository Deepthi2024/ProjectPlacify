const mongoose = require('mongoose');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {}
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ganavishekhar2005_db_user:ojsDMZQHcLKWNSVv@userdetails.mhhdnqw.mongodb.net/placify?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  salt: { type: String, required: true },
  chosen_domain: { type: String, default: 'fullstack' },
  timeline_months: { type: Number, default: 4 },
  daily_hours: { type: Number, default: 2.0 },
  current_skill_level: { type: String, default: 'UNASSESSED' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema, 'Registration');

async function initDatabase() {
  console.log('🔌 Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Insert initial record to populate database in Compass
    const existing = await User.findOne({ email: 'admin@placify.ai' });
    if (!existing) {
      await User.create({
        user_id: 'usr_system_init',
        name: 'Placify System Administrator',
        email: 'admin@placify.ai',
        password_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        salt: '00000000000000000000000000000000',
        chosen_domain: 'fullstack',
        timeline_months: 4,
        daily_hours: 2.0,
        current_skill_level: 'ADMIN'
      });
      console.log('🎉 Successfully created "placify" database and "users" collection in MongoDB Atlas!');
    } else {
      console.log('✅ "placify" database and "users" collection are already active in MongoDB Atlas!');
    }

    // Initialize quiz_evaluations collection
    const quizEvalSchema = new mongoose.Schema({
      user_id: String,
      domain: String,
      score_pct: Number,
      correct_count: Number,
      total_questions: Number,
      skill_level: String,
      level_description: String,
      mastered_topics: Array,
      knowledge_gaps: Array,
      answers: Array,
      createdAt: { type: Date, default: Date.now }
    });

    const QuizEvalPlural = mongoose.model('QuizEvalPlural', quizEvalSchema, 'quiz_evaluations');

    const evalExists = await QuizEvalPlural.findOne({ user_id: 'usr_system_init' });
    if (!evalExists) {
      await QuizEvalPlural.create({
        user_id: 'usr_system_init',
        domain: 'Full-Stack Web Development',
        score_pct: 100,
        correct_count: 5,
        total_questions: 5,
        skill_level: 'ADVANCED',
        level_description: 'System Initialization Initial Baseline Evaluation',
        mastered_topics: [{ topic: 'System Initialization', accuracy_pct: 100 }],
        knowledge_gaps: [],
        answers: []
      });
      console.log('🎉 Successfully initialized "quiz_evaluations" collection in MongoDB Atlas!');
    } else {
      console.log('✅ "quiz_evaluations" collection is already active in MongoDB Atlas!');
    }
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

initDatabase();
