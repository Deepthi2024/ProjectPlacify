/**
 * ============================================================
 * PLACIFY AGENTS
 * ============================================================
 *
 * Sub-Agents:
 * 1. AuthAgent
 * 2. QuizEvaluatorAgent
 * 3. RoadmapGeneratorAgent
 * 4. PersonalizedRoadmapAgent
 * 5. ResourceSuggesterAgent
 * 6. ResourceFetcherAgent
 * 7. ProgressTrackerAgent
 *
 * Supervisor:
 * PlacifySupervisorAgent
 *
 * IMPORTANT:
 * Authentication uses MongoDB Atlas through the backend API.
 * There is NO localStorage authentication fallback.
 * ============================================================
 */


/* ============================================================
   1. AUTHENTICATION AGENT
   ============================================================ */

class AuthAgent {

  constructor() {
    this.sessionKey = 'placify_active_session';
    this.activeSession = null;
  }


  /* ==========================================================
     REGISTER USER
     ========================================================== */

  async registerUser({
    name,
    email,
    password,
    chosen_domain,
    timeline_months,
    daily_hours
  }) {

    // -------------------------------
    // Validate Name
    // -------------------------------

    if (!name || !name.trim()) {

      const err = new Error(
        'Full Name is required.'
      );

      err.status = 400;
      throw err;
    }


    // -------------------------------
    // Validate Email
    // -------------------------------

    const cleanEmail =
      (email || '').trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !cleanEmail ||
      !emailRegex.test(cleanEmail)
    ) {

      const err = new Error(
        'A valid Email Address is required.'
      );

      err.status = 400;
      throw err;
    }


    // -------------------------------
    // Validate Password
    // -------------------------------

    if (!password || password.length < 6) {

      const err = new Error(
        'Password must be at least 6 characters long.'
      );

      err.status = 400;
      throw err;
    }


    // -------------------------------
    // Normalize Data
    // -------------------------------

    const domain = chosen_domain || null;

    const months =
      parseInt(timeline_months, 10) || 4;

    const hours =
      parseFloat(daily_hours) || 2.0;


    // -------------------------------
    // Send Request to Backend
    // -------------------------------

    try {

      console.log(
        '📡 Sending registration request to backend...'
      );


      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            name: name.trim(),

            email: cleanEmail,

            password: password,

            chosen_domain: domain,

            timeline_months: months,

            daily_hours: hours

          })
        }
      );


      // -------------------------------
      // Parse Response
      // -------------------------------

      const data =
        await response.json();


      console.log(
        '📥 Registration API response:',
        data
      );


      // -------------------------------
      // Backend Error
      // -------------------------------

      if (!response.ok) {

        const err = new Error(
          data.error ||
          'Registration failed.'
        );

        err.status = response.status;

        throw err;
      }


      // -------------------------------
      // Registration Successful
      // -------------------------------

      if (!data.profile) {

        throw new Error(
          'Registration succeeded but no user profile was returned by the server.'
        );
      }


      console.log(
        '✅ User registered successfully in MongoDB Atlas:',
        data.profile
      );


      return data.profile;


    } catch (error) {

      console.error(
        '❌ Registration failed:',
        error
      );

      throw error;
    }
  }


  /* ==========================================================
     LOGIN USER
     ========================================================== */

  async loginUser(email, password) {

    const cleanEmail =
      (email || '').trim().toLowerCase();


    // -------------------------------
    // Validate Credentials
    // -------------------------------

    if (!cleanEmail || !password) {

      const err = new Error(
        'HTTP 401 Unauthorized: Email and password are required credentials.'
      );

      err.status = 401;

      throw err;
    }


    try {

      console.log(
        '📡 Sending login request to backend...'
      );


      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            email: cleanEmail,

            password: password

          })
        }
      );


      const data =
        await response.json();


      console.log(
        '📥 Login API response:',
        data
      );


      // -------------------------------
      // Login Error
      // -------------------------------

      if (!response.ok) {

        const err = new Error(
          data.error ||
          'HTTP 401 Unauthorized: Invalid email or password credentials.'
        );

        err.status = response.status;

        throw err;
      }


      // -------------------------------
      // Login Successful
      // -------------------------------

      if (!data.profile) {

        throw new Error(
          'Login succeeded but no user profile was returned by the server.'
        );
      }


      this.setActiveSession(
        data.profile
      );


      console.log(
        '✅ Login successful:',
        data.profile
      );


      return data.profile;


    } catch (error) {

      console.error(
        '❌ Login failed:',
        error
      );

      throw error;
    }
  }


  /* ==========================================================
     SAVE ACTIVE SESSION
     ========================================================== */

  setActiveSession(profile) {
    this.activeSession = profile;
    if (window.placifySupervisor?.progressTracker && profile?.user_id) {
      window.placifySupervisor.progressTracker.setActiveUser(profile.user_id);
    }
    try {
      if (profile) {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(profile));
      } else {
        sessionStorage.removeItem(this.sessionKey);
      }
    } catch (e) {}
  }


  /* ==========================================================
     GET ACTIVE SESSION
     ========================================================== */

  getActiveSession() {
    if (this.activeSession) return this.activeSession;
    try {
      const raw = sessionStorage.getItem(this.sessionKey);
      if (raw) {
        this.activeSession = JSON.parse(raw);
        if (window.placifySupervisor?.progressTracker && this.activeSession?.user_id) {
          window.placifySupervisor.progressTracker.setActiveUser(this.activeSession.user_id);
        }
        return this.activeSession;
      }
    } catch (e) {}
    return null;
  }


  /* ==========================================================
     LOGOUT
     ========================================================== */

  clearSession() {
    this.activeSession = null;
    if (window.placifySupervisor?.progressTracker) {
      window.placifySupervisor.progressTracker.clearActiveUser();
    }
    try {
      localStorage.removeItem(this.sessionKey);
      sessionStorage.removeItem(this.sessionKey);
    } catch (err) {}
  }

}


/* ============================================================
   2. QUIZ EVALUATOR AGENT
   ============================================================ */

function evaluateQuestionClient(q, userSelectionInput) {
  const qId = q.id || q._id || 'unknown';
  const qType = (q.type || 'MCQ').toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  const options = Array.isArray(q.options) ? q.options : [];
  const rawCorrect = q.correct !== undefined ? q.correct : q.correct_answer;

  let userSelection = userSelectionInput;
  if (userSelection === undefined && q.user_answer !== undefined) {
    userSelection = q.user_answer;
  }
  if (userSelection === undefined && q.userAnswer !== undefined) {
    userSelection = q.userAnswer;
  }

  const rawCorrectType = Array.isArray(rawCorrect) ? 'array' : typeof rawCorrect;
  const rawUserType = Array.isArray(userSelection) ? 'array' : typeof userSelection;

  let isCorrect = false;
  let normalizedCorrect = '';
  let normalizedUser = '';

  function getOptionInfo(val) {
    if (val === undefined || val === null || val === '' || val === 'Unanswered') {
      return { index: -1, text: '', raw: 'Unanswered' };
    }
    if (typeof val === 'number' && !isNaN(val)) {
      const idx = Math.floor(val);
      if (idx >= 0 && options[idx] !== undefined) {
        return { index: idx, text: String(options[idx]), raw: String(val) };
      }
      return { index: idx, text: String(val), raw: String(val) };
    }

    const strVal = String(val).trim();
    if (!strVal || strVal === 'Unanswered') {
      return { index: -1, text: '', raw: 'Unanswered' };
    }

    if (/^\d+$/.test(strVal)) {
      const idx = parseInt(strVal, 10);
      if (idx >= 0 && options[idx] !== undefined) {
        return { index: idx, text: String(options[idx]), raw: strVal };
      }
    }

    if (/^[a-zA-Z]$/.test(strVal)) {
      const idx = strVal.toUpperCase().charCodeAt(0) - 65;
      if (idx >= 0 && idx < options.length) {
        return { index: idx, text: String(options[idx]), raw: strVal };
      }
    }

    if (options.length > 0) {
      const matchedIdx = options.findIndex(opt => String(opt).trim().toLowerCase() === strVal.toLowerCase());
      if (matchedIdx !== -1) {
        return { index: matchedIdx, text: String(options[matchedIdx]), raw: strVal };
      }
    }

    return { index: -1, text: strVal, raw: strVal };
  }

  if (qType === 'MSQ' || qType === 'MULTIPLE_SELECT' || qType === 'MULTIPLE_CHOICE_MULTI') {
    let corrArray = [];
    if (Array.isArray(rawCorrect)) {
      corrArray = rawCorrect;
    } else if (typeof rawCorrect === 'string' && rawCorrect.trim()) {
      corrArray = rawCorrect.split(/;|,/).map(s => s.trim()).filter(Boolean);
    } else if (rawCorrect !== undefined && rawCorrect !== null) {
      corrArray = [rawCorrect];
    }

    let userArray = [];
    if (Array.isArray(userSelection)) {
      userArray = userSelection;
    } else if (typeof userSelection === 'string' && userSelection.trim() && userSelection !== 'Unanswered') {
      userArray = userSelection.split(/;|,/).map(s => s.trim()).filter(Boolean);
    } else if (userSelection !== undefined && userSelection !== null && userSelection !== 'Unanswered') {
      userArray = [userSelection];
    }

    const normCorrSet = corrArray.map(getOptionInfo).filter(i => i.raw !== 'Unanswered');
    const normUserSet = userArray.map(getOptionInfo).filter(i => i.raw !== 'Unanswered');

    const corrKeys = normCorrSet.map(i => i.index >= 0 ? `idx:${i.index}` : `txt:${i.text.toLowerCase()}`).sort();
    const userKeys = normUserSet.map(i => i.index >= 0 ? `idx:${i.index}` : `txt:${i.text.toLowerCase()}`).sort();

    normalizedCorrect = corrKeys.join(', ');
    normalizedUser = userKeys.join(', ');

    if (userKeys.length > 0 && userKeys.length === corrKeys.length) {
      isCorrect = userKeys.every((val, idx) => val === corrKeys[idx]);
    } else {
      isCorrect = false;
    }
  } else if (qType === 'TRUE_FALSE' || qType === 'TRUE/FALSE' || qType === 'BOOLEAN') {
    const parseBool = (val) => {
      if (val === true) return 'true';
      if (val === false) return 'false';
      if (val === undefined || val === null || val === '' || val === 'Unanswered') return '';
      const str = String(val).trim().toLowerCase();
      if (str === 'true' || str === 't' || str === '1' || str === 'yes') return 'true';
      if (str === 'false' || str === 'f' || str === '0' || str === 'no') return 'false';
      const info = getOptionInfo(val);
      if (info.text.toLowerCase().includes('true')) return 'true';
      if (info.text.toLowerCase().includes('false')) return 'false';
      return str;
    };

    normalizedCorrect = parseBool(rawCorrect);
    normalizedUser = parseBool(userSelection);
    isCorrect = (normalizedUser !== '' && normalizedUser === normalizedCorrect);
  } else if (qType === 'NUMERICAL') {
    const corrNum = parseFloat(rawCorrect);
    const userNum = parseFloat(userSelection);

    if (!isNaN(corrNum) && !isNaN(userNum)) {
      normalizedCorrect = String(corrNum);
      normalizedUser = String(userNum);
      isCorrect = Math.abs(userNum - corrNum) < 0.01;
    } else {
      normalizedCorrect = String(rawCorrect || '').trim().toLowerCase();
      normalizedUser = String(userSelection || '').trim().toLowerCase();
      isCorrect = (normalizedUser !== '' && normalizedUser !== 'unanswered' && normalizedUser === normalizedCorrect);
    }
  } else {
    if (options.length > 0) {
      const corrOpt = getOptionInfo(rawCorrect);
      const userOpt = getOptionInfo(userSelection);

      if (userSelection === undefined || userSelection === null || userSelection === '' || userSelection === 'Unanswered' || userOpt.raw === 'Unanswered') {
        normalizedCorrect = corrOpt.index >= 0 ? `[Index ${corrOpt.index}] ${corrOpt.text}` : corrOpt.text;
        normalizedUser = 'Unanswered';
        isCorrect = false;
      } else if (corrOpt.index >= 0 && userOpt.index >= 0) {
        normalizedCorrect = `[Index ${corrOpt.index}] ${corrOpt.text}`;
        normalizedUser = `[Index ${userOpt.index}] ${userOpt.text}`;
        isCorrect = (corrOpt.index === userOpt.index);
      } else {
        normalizedCorrect = corrOpt.text.trim().toLowerCase();
        normalizedUser = userOpt.text.trim().toLowerCase();
        isCorrect = (normalizedUser !== '' && normalizedUser !== 'unanswered' && normalizedUser === normalizedCorrect);
      }
    } else {
      if (userSelection === undefined || userSelection === null || userSelection === '' || userSelection === 'Unanswered') {
        normalizedCorrect = String(rawCorrect || '').trim().toLowerCase();
        normalizedUser = 'Unanswered';
        isCorrect = false;
      } else {
        normalizedCorrect = String(rawCorrect || '').trim().toLowerCase();
        normalizedUser = String(userSelection || '').trim().toLowerCase();
        isCorrect = (normalizedUser !== '' && normalizedUser !== 'unanswered' && normalizedUser === normalizedCorrect);
      }
    }
  }

  const debugLog = {
    questionId: qId,
    type: qType,
    correctAnswer: rawCorrect,
    correctAnswerType: rawCorrectType,
    userAnswer: userSelection !== undefined ? userSelection : 'Unanswered',
    userAnswerType: rawUserType,
    normalizedCorrect,
    normalizedUser,
    isCorrect
  };

  console.log(`[QUIZ EVALUATION DEBUG (CLIENT)]`, JSON.stringify(debugLog, null, 2));

  return {
    isCorrect,
    debugLog,
    normalizedCorrect,
    normalizedUser
  };
}

class QuizEvaluatorAgent {

  async evaluateDiagnostic(
    domainIdOrObject,
    rawAnswers = {},
    userId = null
  ) {
    let user_id = userId;
    let answersInput = rawAnswers;
    let explicitDomain = null;

    // Check if called with a structured input payload object
    if (typeof domainIdOrObject === 'object' && domainIdOrObject !== null) {
      user_id = domainIdOrObject.user_id || user_id;
      explicitDomain = domainIdOrObject.domainId || domainIdOrObject.chosen_domain || domainIdOrObject.domain;
      answersInput = domainIdOrObject.answers || rawAnswers;
    } else {
      explicitDomain = domainIdOrObject;
    }

    if (!user_id && window.currentDraftProfile) {
      user_id = window.currentDraftProfile.user_id || window.currentDraftProfile.email;
    }
    if (!user_id && window.placifySupervisor && window.placifySupervisor.authAgent) {
      const activeSession = window.placifySupervisor.authAgent.getActiveSession();
      if (activeSession) {
        user_id = activeSession.user_id;
      }
    }
    if (!user_id) {
      user_id = 'usr_guest_' + Date.now();
    }

    // Resolve domain object robustly using findDomain
    let domainCandidate = explicitDomain;
    if (!domainCandidate && window.currentDraftProfile) {
      domainCandidate = window.currentDraftProfile.domainId || window.currentDraftProfile.chosen_domain;
    }
    if (!domainCandidate && window.placifySupervisor && window.placifySupervisor.authAgent) {
      const activeSession = window.placifySupervisor.authAgent.getActiveSession();
      if (activeSession) {
        domainCandidate = activeSession.chosen_domain;
      }
    }

    const domainObj = window.PLACIFY_DATA.findDomain(domainCandidate);
    const domainName = domainObj.name;
    const domainId = domainObj.id;

    // Check if user selected manual self-assessment
    const isSelfAssessed = !!(answersInput && (answersInput.isSelfAssessed || answersInput.is_self_assessed));
    if (isSelfAssessed) {
      const selfLevel = (answersInput.skillTier || answersInput.skill_level || 'BEGINNER').toUpperCase();
      let selfScore = 40;
      if (selfLevel === 'ADVANCED') selfScore = 85;
      else if (selfLevel === 'INTERMEDIATE') selfScore = 65;

      const weakTopicNames = answersInput.weakTopicNames || [];
      const domainTopics = domainObj.topics || Array.from(new Set((domainObj.diagnostics || []).map(d => d.topic))).filter(Boolean);
      
      const knowledgeGaps = weakTopicNames.map(t => ({
        topic: t,
        accuracy_pct: 30,
        reason: 'User self-identified this topic as needing practice.'
      }));

      const weakTopics = weakTopicNames.map(t => ({
        topic: t,
        score_pct: 30,
        reason: 'User self-identified topic for remediation.'
      }));

      const masteredTopics = domainTopics.filter(t => !weakTopicNames.includes(t)).map(t => ({
        topic: t,
        accuracy_pct: selfScore
      }));

      const topicEvaluations = domainTopics.map(t => ({
        topic: t,
        correct_count: weakTopicNames.includes(t) ? 0 : 1,
        total_questions: 1,
        score_pct: weakTopicNames.includes(t) ? 30 : selfScore,
        proficiency_level: weakTopicNames.includes(t) ? 'WEAK' : (selfLevel === 'ADVANCED' ? 'STRONG' : 'INTERMEDIATE')
      }));

      const evaluationResult = {
        user_id,
        domain: domainName,
        domainId,
        scorePct: selfScore,
        score_pct: selfScore,
        correctCount: 0,
        correct_count: 0,
        totalQuestions: 0,
        total_questions: 0,
        unansweredCount: 0,
        skillTier: selfLevel,
        skill_tier: selfLevel,
        skill_level: selfLevel,
        levelDescription: `User manually self-assessed proficiency as ${selfLevel}.`,
        level_description: `User manually self-assessed proficiency as ${selfLevel}.`,
        masteredTopics,
        mastered_topics: masteredTopics,
        knowledgeGaps,
        knowledge_gaps: knowledgeGaps,
        topicEvaluations,
        topic_evaluations: topicEvaluations,
        weakTopics,
        intermediateTopics: [],
        strongTopics: masteredTopics,
        gaps: knowledgeGaps,
        mastered: masteredTopics,
        answers: [],
        isSelfAssessed: true,
        evaluatedAt: new Date().toISOString()
      };

      try {
        const res = await fetch('http://localhost:5000/api/quiz/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id,
            domain: domainName,
            answers: [],
            is_self_assessed: true,
            skill_level: selfLevel,
            topic_evaluations: topicEvaluations
          })
        });
        const data = await res.json();
        console.log('✅ Self-Assessment evaluation persisted to MongoDB Atlas:', data);
      } catch (err) {
        console.warn('⚠️ Could not persist self-assessment to backend server:', err.message);
      }

      return evaluationResult;
    }

    // Build structured answers array with required fields
    let formattedQuestions = [];
    let userAnswersMap = answersInput;
    if (answersInput && typeof answersInput === 'object' && !Array.isArray(answersInput) && answersInput.answers) {
      userAnswersMap = answersInput.answers;
    }

    if (Array.isArray(answersInput)) {
      formattedQuestions = answersInput;
    } else if (domainObj && (domainObj.activeDiagnostics || domainObj.diagnostics)) {
      const qList = (domainObj.activeDiagnostics && domainObj.activeDiagnostics.length > 0) ? domainObj.activeDiagnostics : domainObj.diagnostics;
      formattedQuestions = qList.map((q, idx) => {
        let userSelection = userAnswersMap[q.id];
        if (userSelection === undefined) {
          userSelection = userAnswersMap[idx] !== undefined ? userAnswersMap[idx] : userAnswersMap[`q_${idx + 1}`];
        }

        const evalRes = evaluateQuestionClient(q, userSelection);
        const options = Array.isArray(q.options) ? q.options : [];

        let correctText = '';
        const rawCorr = q.correct !== undefined ? q.correct : q.correct_answer;
        if (Array.isArray(rawCorr)) {
          correctText = rawCorr.map(i => typeof i === 'number' && options[i] !== undefined ? options[i] : String(i)).join('; ');
        } else if (typeof rawCorr === 'number' && options[rawCorr] !== undefined) {
          correctText = options[rawCorr];
        } else {
          correctText = String(rawCorr !== undefined ? rawCorr : '');
        }

        let userAnswerText = 'Unanswered';
        if (userSelection !== undefined && userSelection !== null && userSelection !== '' && userSelection !== -1 && userSelection !== '-1') {
          if (Array.isArray(userSelection)) {
            userAnswerText = userSelection.map(i => typeof i === 'number' && options[i] !== undefined ? options[i] : String(i)).join('; ');
          } else if (typeof userSelection === 'number' && options[userSelection] !== undefined) {
            userAnswerText = options[userSelection];
          } else {
            userAnswerText = String(userSelection);
          }
        }

        return {
          id: q.id,
          question: q.question,
          codeSnippet: q.codeSnippet || null,
          options: options,
          type: q.type || 'MCQ',
          topic: q.topic || 'General Knowledge',
          subtopic: q.subtopic || 'Core Concepts',
          difficulty: q.difficulty || 'INTERMEDIATE',
          user_answer: userAnswerText,
          correct_answer: correctText,
          is_correct: evalRes.isCorrect,
          normalized_correct: evalRes.normalizedCorrect,
          normalized_user: evalRes.normalizedUser,
          explanation: q.explanation || ''
        };
      });
    }

    // Calculate detailed topic-wise accuracy & difficulty breakdown
    let correctCount = 0;
    let unansweredTotal = 0;
    const totalQuestions = formattedQuestions.length;
    const topicStats = {};
    const gaps = [];
    const mastered = [];

    formattedQuestions.forEach(q => {
      if (q.user_answer === 'Unanswered') unansweredTotal++;
      if (q.is_correct) {
        correctCount++;
        mastered.push({
          topic: q.topic,
          question: q.question
        });
      } else {
        gaps.push({
          topic: q.topic,
          question: q.question,
          userAnswer: q.user_answer,
          correctAnswer: q.correct_answer,
          difficulty: q.difficulty,
          explanation: q.explanation
        });
      }

      const topic = q.topic || 'General Knowledge';
      if (!topicStats[topic]) {
        topicStats[topic] = {
          total: 0,
          correct: 0,
          incorrect: 0,
          unanswered: 0,
          beginnerTotal: 0,
          beginnerCorrect: 0,
          intermediateTotal: 0,
          intermediateCorrect: 0,
          advancedTotal: 0,
          advancedCorrect: 0,
          weakConcepts: new Set()
        };
      }

      const stats = topicStats[topic];
      stats.total++;
      if (q.user_answer === 'Unanswered') stats.unanswered++;

      if (q.difficulty === 'BEGINNER') {
        stats.beginnerTotal++;
        if (q.is_correct) stats.beginnerCorrect++;
      } else if (q.difficulty === 'ADVANCED') {
        stats.advancedTotal++;
        if (q.is_correct) stats.advancedCorrect++;
      } else {
        stats.intermediateTotal++;
        if (q.is_correct) stats.intermediateCorrect++;
      }

      if (q.is_correct) {
        stats.correct++;
      } else {
        stats.incorrect++;
        if (q.subtopic) stats.weakConcepts.add(q.subtopic);
      }
    });

    const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const topicEvaluations = [];
    const weakTopics = [];
    const intermediateTopics = [];
    const strongTopics = [];
    const masteredTopics = [];
    const knowledgeGaps = [];

    Object.keys(topicStats).forEach(topic => {
      const stats = topicStats[topic];
      const accuracyPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

      const begAcc = stats.beginnerTotal > 0 ? Math.round((stats.beginnerCorrect / stats.beginnerTotal) * 100) : 100;
      const intAcc = stats.intermediateTotal > 0 ? Math.round((stats.intermediateCorrect / stats.intermediateTotal) * 100) : 100;
      const advAcc = stats.advancedTotal > 0 ? Math.round((stats.advancedCorrect / stats.advancedTotal) * 100) : 0;

      // Strict NPTEL Difficulty-Weighted Proficiency Logic
      let proficiencyLevel = 'INTERMEDIATE';
      let reason = '';

      if (accuracyPct >= 80 && (stats.intermediateTotal === 0 || intAcc >= 50) && (stats.advancedTotal === 0 || advAcc > 0)) {
        proficiencyLevel = 'STRONG';
        reason = `High overall accuracy (${accuracyPct}%) with strong intermediate/advanced problem solving.`;
      } else if (accuracyPct < 50 || (stats.beginnerTotal > 0 && begAcc < 50)) {
        proficiencyLevel = 'WEAK';
        if (stats.beginnerTotal > 0 && begAcc < 50) {
          reason = `Failed foundational beginner questions (${begAcc}% accuracy). Fundamental concepts missing.`;
        } else {
          reason = `Low topic accuracy (${accuracyPct}%). Needs targeted remedial practice.`;
        }
      } else {
        proficiencyLevel = 'INTERMEDIATE';
        if (advAcc === 0 && stats.advancedTotal > 0) {
          reason = `Solid baseline (${accuracyPct}%), but struggled with advanced application/code tracing questions.`;
        } else {
          reason = `Practical understanding solid (${accuracyPct}% accuracy). Ready for applied project work.`;
        }
      }

      const evalItem = {
        topic,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        incorrectAnswers: stats.incorrect,
        unanswered: stats.unanswered,
        accuracy: accuracyPct,
        score_pct: accuracyPct,
        beginnerAccuracy: begAcc,
        intermediateAccuracy: intAcc,
        advancedAccuracy: advAcc,
        proficiencyLevel,
        proficiency_level: proficiencyLevel,
        reason,
        weakConcepts: Array.from(stats.weakConcepts),
        recommendedFocus: Array.from(stats.weakConcepts).join(', ') || `${topic} Foundations`
      };

      topicEvaluations.push(evalItem);

      if (proficiencyLevel === 'STRONG') {
        strongTopics.push(evalItem);
        masteredTopics.push({ topic, accuracy_pct: accuracyPct });
      } else if (proficiencyLevel === 'INTERMEDIATE') {
        intermediateTopics.push(evalItem);
      } else {
        weakTopics.push(evalItem);
        knowledgeGaps.push({
          topic,
          accuracy_pct: accuracyPct,
          reason,
          weakConcepts: Array.from(stats.weakConcepts)
        });
      }
    });

    // Determine Overall Skill Tier (Score + Topic Distribution)
    let skillTier = 'BEGINNER';
    let levelDescription = '';

    if (scorePct >= 80 && weakTopics.length <= 1) {
      skillTier = 'ADVANCED';
      levelDescription = 'High technical proficiency across domain topics. Ready for advanced system design and production trade-offs.';
    } else if (scorePct >= 50 && weakTopics.length <= 3) {
      skillTier = 'INTERMEDIATE';
      levelDescription = 'Solid practical foundation. Identified specific weak concepts for targeted remediation.';
    } else {
      skillTier = 'BEGINNER';
      levelDescription = 'Foundational gaps identified across core topics. Focus on fundamental conceptual modules.';
    }

    const evaluationResult = {
      user_id,
      domain: domainName,
      domainId: domainId,
      scorePct,
      score_pct: scorePct,
      correctCount,
      correct_count: correctCount,
      totalQuestions,
      total_questions: totalQuestions,
      unansweredCount: unansweredTotal,
      skillTier,
      skill_tier: skillTier,
      skill_level: skillTier,
      levelDescription,
      level_description: levelDescription,
      masteredTopics,
      mastered_topics: masteredTopics,
      knowledgeGaps,
      knowledge_gaps: knowledgeGaps,
      topicEvaluations,
      topic_evaluations: topicEvaluations,
      weakTopics,
      intermediateTopics,
      strongTopics,
      gaps,
      mastered,
      answers: formattedQuestions,
      evaluatedAt: new Date().toISOString()
    };

    // Async save to MongoDB Atlas backend (awaited)
    try {
      const res = await fetch('http://localhost:5000/api/quiz/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id,
          domain: domainName,
          answers: formattedQuestions,
          topic_evaluations: topicEvaluations
        })
      });
      const data = await res.json();
      console.log('✅ Quiz Evaluation persisted to MongoDB Atlas collection quiz_evaluations:', data);
    } catch (err) {
      console.warn('⚠️ Could not persist quiz evaluation to backend server:', err.message);
    }

    return evaluationResult;
  }
}


/* ============================================================
   3. ROADMAP GENERATOR AGENT
   ============================================================ */

class RoadmapGeneratorAgent {

  generateBaseRoadmap(
    domainId,
    timelineMonths,
    dailyHours
  ) {

    const domain =
      window.PLACIFY_DATA.findDomain(domainId);


    if (!domain) {

      throw new Error(
        'Domain not found'
      );
    }


    const months = timelineMonths || 4;
    const internalWeeks = months * 4;


    // -------------------------------
    // Calculate Total Learning Hours
    // -------------------------------

    const totalHours =
      internalWeeks *
      7 *
      dailyHours;


    // -------------------------------
    // Generate Milestones
    // -------------------------------

    const baseMilestones =
      domain.milestones.map(
        (m, index) => {

          const targetWeek =
            Math.max(
              1,
              Math.round(
                ((index + 1) /
                  domain.milestones.length) *
                internalWeeks
              )
            );


          return {

            id:
              `bm_${index + 1}`,

            title:
              m.title,

            topic:
              m.topic,

            targetWeek,

            estHours:
              Math.max(
                1,
                Math.round(
                  totalHours /
                  domain.milestones.length
                )
              ),

            status:
              'PENDING',

            type:
              'STANDARD'

          };
        }
      );


    return {

      domainId:
        domain.id,

      domainName:
        domain.name,

      timelineMonths: months,

      dailyHours,

      totalHours,

      milestones:
        baseMilestones

    };
  }
}


/* ============================================================
   4. PERSONALIZED ROADMAP AGENT
   ============================================================ */

class PersonalizedRoadmapAgent {

  customizeRoadmap(
    baseRoadmap,
    evaluationResult
  ) {

    const customizedMilestones = [];


    const masteredTopics =
      evaluationResult.mastered.map(
        m => m.topic
      );


    // ==========================================================
    // STEP 1: INJECT REMEDIAL MODULES
    // ==========================================================

    evaluationResult.gaps.forEach(
      (gap, index) => {

        customizedMilestones.push({

          id:
            `remedial_${index + 1}`,

          title:
            `⚡ Remedial Foundation: ${gap.topic} Boost`,

          topic:
            gap.topic,

          targetWeek:
            1,

          estHours:
            6,

          status:
            'INJECTED',

          type:
            'REMEDIAL',

          reason:
            `Knowledge gap detected in diagnostic evaluation: "${gap.question.slice(0, 45)}..."`

        });
      }
    );


    // ==========================================================
    // STEP 2: PROCESS STANDARD MILESTONES
    // ==========================================================

    baseRoadmap.milestones.forEach(
      milestone => {

        const isMastered =
          masteredTopics.includes(
            milestone.topic
          ) &&
          evaluationResult.skillTier !==
          'BEGINNER';


        customizedMilestones.push({

          ...milestone,

          status:
            isMastered
              ? 'SKIPPED'
              : 'PENDING',

          skipReason:
            isMastered
              ? `Topic "${milestone.topic}" mastered in diagnostic quiz`
              : null

        });
      }
    );


    // ==========================================================
    // STEP 3: SORT BY WEEK
    // ==========================================================

    customizedMilestones.sort(
      (a, b) =>
        a.targetWeek -
        b.targetWeek
    );


    // ==========================================================
    // STEP 4: CREATE DAILY TASKS
    // ==========================================================

    const dailyTasks = [];

    let dayCounter = 1;


    customizedMilestones.forEach(
      milestone => {

        /*
         * Skipped topics are not added
         * to daily learning tasks.
         */

        if (
          milestone.status ===
          'SKIPPED'
        ) {
          return;
        }


        const daysForMilestone =
          Math.max(
            2,
            Math.round(
              milestone.estHours /
              baseRoadmap.dailyHours
            )
          );


        for (
          let day = 1;
          day <= daysForMilestone;
          day++
        ) {

          dailyTasks.push({

            dayNumber:
              dayCounter++,

            milestoneId:
              milestone.id,

            milestoneTitle:
              milestone.title,

            topic:
              milestone.topic,

            conceptTitle:
              `${milestone.topic} - Core Deep Dive (Part ${day})`,

            type:
              milestone.type,

            completed:
              false,

            score:
              null

          });
        }
      }
    );


    return {

      ...baseRoadmap,

      quiz_score: evaluationResult.scorePct !== undefined ? evaluationResult.scorePct : evaluationResult.score_pct,

      skillTier:
        evaluationResult.skillTier,

      gapsCount:
        evaluationResult.gaps.length,

      skippedCount:
        customizedMilestones.filter(
          m => m.status === 'SKIPPED'
        ).length,

      injectedCount:
        customizedMilestones.filter(
          m => m.type === 'REMEDIAL'
        ).length,

      milestones:
        customizedMilestones,

      dailyTasks

    };
  }
}


/* ============================================================
   5. RESOURCE SUGGESTER AGENT
   ============================================================ */

class ResourceSuggesterAgent {
  constructor() {
    this.ragCache = new Map();
  }

  getCuratedTopicFallbacks(topic, taskHeading, domain, subtopic = '') {
    const headingLower = (taskHeading || '').toLowerCase();
    const topicLower = (topic || '').toLowerCase();
    const domainLower = (domain || '').toLowerCase();
    const subLower = (subtopic || '').toLowerCase();

    const text = `${headingLower} ${topicLower} ${domainLower} ${subLower}`;

    // 1. DOM & Events Specific
    if (text.includes('dom') || (text.includes('event') && !text.includes('loop') && !text.includes('kafka'))) {
      return [
        {
          resource_id: 'dom_mdn_intro',
          title: 'MDN Web Docs: Introduction to the DOM & Manipulation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
          platform: 'MDN Web Docs',
          resource_type: 'documentation',
          description: 'Official MDN guide explaining the Document Object Model tree structure, nodes, and element access.',
          estimated_minutes: 25,
          duration_minutes: 25,
          relevance_reason: 'Directly teaches DOM tree representation and element access.',
          category_label: 'PRIMARY',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        },
        {
          resource_id: 'dom_mdn_query',
          title: 'MDN Web Docs: Document.querySelector() & Element Selection',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector',
          platform: 'MDN Web Docs',
          resource_type: 'documentation',
          description: 'Technical specification and practical examples of querySelector and querySelectorAll matching.',
          estimated_minutes: 20,
          duration_minutes: 20,
          relevance_reason: 'Deep dive on CSS selectors for DOM node matching.',
          category_label: 'ALTERNATIVE',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        },
        {
          resource_id: 'dom_mdn_events',
          title: 'MDN Web Docs: EventTarget.addEventListener() & Event Handling',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener',
          platform: 'MDN Web Docs',
          resource_type: 'documentation',
          description: 'Authoritative guide to attaching event handlers, event objects, bubbling, and delegation.',
          estimated_minutes: 30,
          duration_minutes: 30,
          relevance_reason: 'Explains modern event listeners and bubbling propagation.',
          category_label: 'PRACTICE',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        }
      ];
    }

    // 2. React
    if (text.includes('react') || text.includes('jsx') || text.includes('hook') || text.includes('usestate')) {
      return [
        {
          resource_id: 'react_docs_quickstart',
          title: 'React Official Documentation: Quick Start & Core Concepts',
          url: 'https://react.dev/learn',
          platform: 'React Docs',
          resource_type: 'documentation',
          description: 'Official React guide for components, props, state, and declarative UI rendering.',
          estimated_minutes: 35,
          duration_minutes: 35,
          relevance_reason: 'Authoritative React core documentation.',
          category_label: 'PRIMARY',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        },
        {
          resource_id: 'react_docs_state',
          title: 'React Official Documentation: Managing State & Hooks',
          url: 'https://react.dev/learn/managing-state',
          platform: 'React Docs',
          resource_type: 'documentation',
          description: 'Step-by-step documentation on React state management and hooks.',
          estimated_minutes: 30,
          duration_minutes: 30,
          relevance_reason: 'In-depth guide to modern stateful React components.',
          category_label: 'ALTERNATIVE',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        }
      ];
    }

    // 3. Node.js & Express
    if (text.includes('node') || text.includes('express') || text.includes('backend api') || text.includes('event loop')) {
      return [
        {
          resource_id: 'node_docs_getting_started',
          title: 'Node.js Official Documentation: Getting Started Guide',
          url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
          platform: 'Node.js Official',
          resource_type: 'documentation',
          description: 'Official guide to Node.js asynchronous runtime, event loop, and modules.',
          estimated_minutes: 30,
          duration_minutes: 30,
          relevance_reason: 'Authoritative documentation for Node.js runtime fundamentals.',
          category_label: 'PRIMARY',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        },
        {
          resource_id: 'express_guide',
          title: 'Express.js Official Guide: Routing & Middleware',
          url: 'https://expressjs.com/en/starter/basic-routing.html',
          platform: 'Express.js',
          resource_type: 'documentation',
          description: 'Official tutorial on building RESTful API endpoints and middleware in Express.',
          estimated_minutes: 25,
          duration_minutes: 25,
          relevance_reason: 'Essential guide for server-side Express routing.',
          category_label: 'ALTERNATIVE',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        }
      ];
    }

    // 4. HTML
    if (text.includes('html') || text.includes('doctype') || text.includes('boilerplate')) {
      return [
        {
          resource_id: 'html_mdn_doc',
          title: 'MDN Web Docs: HTML Introduction & Document Structure',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started',
          platform: 'MDN Web Docs',
          resource_type: 'documentation',
          description: 'Official MDN guide covering HTML document syntax, DOCTYPE declarations, head/body organization, and boilerplate structure.',
          estimated_minutes: 25,
          duration_minutes: 25,
          relevance_reason: 'Directly covers HTML document structure, DOCTYPE, and fundamental elements.',
          category_label: 'PRIMARY',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        },
        {
          resource_id: 'html_w3_guide',
          title: 'W3Schools: HTML Basics & DOCTYPE Reference',
          url: 'https://www.w3schools.com/html/html_basic.asp',
          platform: 'W3Schools',
          resource_type: 'tutorial',
          description: 'Interactive reference guide for core HTML elements and document tags.',
          estimated_minutes: 20,
          duration_minutes: 20,
          relevance_reason: 'Interactive practice environment for basic HTML structure.',
          category_label: 'ALTERNATIVE',
          is_official: false,
          verificationStatus: 'VERIFIED_URL',
          isFallback: true,
          fallback_level: 3
        }
      ];
    }

    // 5. CSS
    if (text.includes('css') || text.includes('flexbox') || text.includes('grid') || text.includes('style')) {
      return [
        {
          resource_id: 'css_mdn_flex',
          title: 'MDN Web Docs: CSS Layouts & Flexbox Guide',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox',
          platform: 'MDN Web Docs',
          resource_type: 'documentation',
          description: 'Comprehensive documentation on CSS flexbox, alignment, and modern layout techniques.',
          estimated_minutes: 30,
          duration_minutes: 30,
          relevance_reason: 'Authoritative guide for CSS layouts, flex container properties, and alignment.',
          category_label: 'PRIMARY',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        },
        {
          resource_id: 'css_w3_flex',
          title: 'W3Schools: CSS Flexbox Reference and Interactive Practice',
          url: 'https://www.w3schools.com/css/css3_flexbox.asp',
          platform: 'W3Schools',
          resource_type: 'tutorial',
          description: 'Interactive tutorial with live code examples for CSS Flexbox layouts.',
          estimated_minutes: 25,
          duration_minutes: 25,
          relevance_reason: 'Interactive hands-on practice for CSS flex layouts.',
          category_label: 'ALTERNATIVE',
          is_official: false,
          verificationStatus: 'VERIFIED_URL',
          isFallback: true,
          fallback_level: 3
        }
      ];
    }

    // 6. DSA
    if (text.includes('dsa') || text.includes('tree') || text.includes('graph') || text.includes('bfs') || text.includes('dfs') || text.includes('algorithm') || text.includes('complexity')) {
      return [
        {
          resource_id: 'dsa_gfg_guide',
          title: 'GeeksforGeeks: Data Structures & Algorithms Roadmap',
          url: 'https://www.geeksforgeeks.org/data-structures/',
          platform: 'GeeksforGeeks',
          resource_type: 'article',
          description: 'Detailed tutorial covering data structure operations, time/space complexity analysis, and coding problems.',
          estimated_minutes: 40,
          duration_minutes: 40,
          relevance_reason: 'In-depth explanation of core DSA concepts and problem-solving patterns.',
          category_label: 'PRIMARY',
          is_official: false,
          verificationStatus: 'VERIFIED_URL',
          isFallback: true,
          fallback_level: 3
        },
        {
          resource_id: 'dsa_w3_algorithms',
          title: 'W3Schools: Data Structures and Algorithms Tutorial',
          url: 'https://www.w3schools.com/dsa/',
          platform: 'W3Schools',
          resource_type: 'tutorial',
          description: 'Structured visual explanations and implementation guides for algorithms and complexity analysis.',
          estimated_minutes: 30,
          duration_minutes: 30,
          relevance_reason: 'Visual algorithm demonstrations and practice coding problems.',
          category_label: 'ALTERNATIVE',
          is_official: false,
          verificationStatus: 'VERIFIED_URL',
          isFallback: true,
          fallback_level: 3
        }
      ];
    }

    // 7. SQL
    if (text.includes('sql') || text.includes('database') || text.includes('postgres') || text.includes('mysql')) {
      return [
        {
          resource_id: 'sql_w3_tutorial',
          title: 'W3Schools: SQL Tutorial & Interactive Queries',
          url: 'https://www.w3schools.com/sql/',
          platform: 'W3Schools',
          resource_type: 'tutorial',
          description: 'Interactive SQL reference covering SELECT, JOIN, GROUP BY, indexes, and database manipulation.',
          estimated_minutes: 30,
          duration_minutes: 30,
          relevance_reason: 'Hands-on interactive practice with standard SQL queries.',
          category_label: 'PRIMARY',
          is_official: false,
          verificationStatus: 'VERIFIED_URL',
          isFallback: true,
          fallback_level: 3
        },
        {
          resource_id: 'pg_docs_tutorial',
          title: 'PostgreSQL Official Documentation: SQL Language Tutorial',
          url: 'https://www.postgresql.org/docs/current/tutorial-sql.html',
          platform: 'PostgreSQL Official',
          resource_type: 'documentation',
          description: 'Authoritative guide to relational queries, constraints, transactions, and performance.',
          estimated_minutes: 35,
          duration_minutes: 35,
          relevance_reason: 'Authoritative documentation for relational SQL concepts.',
          category_label: 'ALTERNATIVE',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        }
      ];
    }

    // 8. General JS Fallback
    if (text.includes('js') || text.includes('javascript') || text.includes('async') || text.includes('es6')) {
      return [
        {
          resource_id: 'js_mdn_guide',
          title: 'MDN Web Docs: JavaScript Fundamentals & Core Concepts',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps',
          platform: 'MDN Web Docs',
          resource_type: 'documentation',
          description: 'Essential guide covering JavaScript syntax, data types, functions, and control flow.',
          estimated_minutes: 35,
          duration_minutes: 35,
          relevance_reason: 'Core MDN guide for modern JavaScript programming.',
          category_label: 'PRIMARY',
          is_official: true,
          verificationStatus: 'OFFICIAL_DOCS',
          isFallback: true,
          fallback_level: 3
        },
        {
          resource_id: 'js_gfg_tutorial',
          title: 'GeeksforGeeks: Modern JavaScript Tutorial',
          url: 'https://www.geeksforgeeks.org/javascript-tutorial/',
          platform: 'GeeksforGeeks',
          resource_type: 'article',
          description: 'Structured programming examples and exercises for JavaScript fundamentals.',
          estimated_minutes: 30,
          duration_minutes: 30,
          relevance_reason: 'Practical tutorial covering JavaScript concepts.',
          category_label: 'ALTERNATIVE',
          is_official: false,
          verificationStatus: 'VERIFIED_URL',
          isFallback: true,
          fallback_level: 3
        }
      ];
    }

    // 9. Default Verified Documentation
    return [
      {
        resource_id: 'gen_mdn_docs',
        title: `MDN Web Docs: ${taskHeading} Reference Guide`,
        url: 'https://developer.mozilla.org/en-US/docs/Web',
        platform: 'MDN Web Docs',
        resource_type: 'documentation',
        description: `Authoritative web development reference covering standards, syntax, and APIs for ${taskHeading}.`,
        estimated_minutes: 30,
        duration_minutes: 30,
        relevance_reason: `Curated documentation reference for ${taskHeading}.`,
        category_label: 'PRIMARY',
        is_official: true,
        verificationStatus: 'OFFICIAL_DOCS',
        isFallback: true,
        fallback_level: 4
      },
      {
        resource_id: 'gen_gfg_ref',
        title: `GeeksforGeeks: ${taskHeading} Overview & Tutorials`,
        url: 'https://www.geeksforgeeks.org/',
        platform: 'GeeksforGeeks',
        resource_type: 'article',
        description: `Comprehensive technical reference and code examples for ${taskHeading}.`,
        estimated_minutes: 25,
        duration_minutes: 25,
        relevance_reason: `Tutorial and problem-solving guide for ${taskHeading}.`,
        category_label: 'ALTERNATIVE',
        is_official: false,
        verificationStatus: 'VERIFIED_URL',
        isFallback: true,
        fallback_level: 4
      }
    ];
  }

  getRecentlyUsedResourceIds(userId) {
    try {
      const key = `placify_history_res_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch(e) { return []; }
  }

  getWeekResourceIds(userId, weekNum) {
    try {
      const key = `placify_week_res_${userId}_w${weekNum}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch(e) { return []; }
  }

  recordUsedResourceIds(userId, weekNum, resourceIds) {
    if (!Array.isArray(resourceIds) || resourceIds.length === 0) return;
    try {
      const histKey = `placify_history_res_${userId}`;
      const curHist = this.getRecentlyUsedResourceIds(userId);
      const updatedHist = Array.from(new Set([...resourceIds, ...curHist])).slice(0, 50);
      localStorage.setItem(histKey, JSON.stringify(updatedHist));

      if (weekNum) {
        const weekKey = `placify_week_res_${userId}_w${weekNum}`;
        const curWeek = this.getWeekResourceIds(userId, weekNum);
        const updatedWeek = Array.from(new Set([...resourceIds, ...curWeek]));
        localStorage.setItem(weekKey, JSON.stringify(updatedWeek));
      }
    } catch(e) {}
  }

  async suggestResources(topic, skillTier, taskContext = {}) {
    const rawTask = taskContext.taskItem || {};
    const taskTitle =
      rawTask.taskTitle ||
      rawTask.title ||
      taskContext.taskTitle ||
      taskContext.title ||
      topic ||
      'Daily Learning Task';

    const session = window.placifySupervisor?.authAgent?.getActiveSession?.() || window.activeSession;
    const userId = taskContext.user_id || session?.user_id || (window.currentDraftProfile ? window.currentDraftProfile.user_id : null) || 'anonymous_user';

    const dayNum = taskContext.dayNumber || rawTask.dayNumber || rawTask.day_number || 1;
    const weekNum = taskContext.weekNumber || rawTask.weekNumber || rawTask.week_number || 1;
    const taskId = taskContext.taskId || rawTask.taskId || rawTask.id || taskContext.id || `task_${dayNum}_1`;

    const taskType = (rawTask.taskType || rawTask.type || taskContext.taskType || 'LEARN').toUpperCase();
    const taskDifficulty = rawTask.difficulty || taskContext.difficulty || skillTier || 'BEGINNER';
    const taskDuration = parseInt(rawTask.durationMinutes || rawTask.estimated_minutes || taskContext.durationMinutes || 45, 10);
    const taskTopic = rawTask.taskTopic || rawTask.topic || taskContext.taskTopic || taskContext.topic || topic || 'Core Learning';
    const taskSubtopic = rawTask.taskSubtopic || rawTask.subtopic || taskContext.taskSubtopic || taskContext.subtopic || taskTopic;
    const domain = taskContext.domain || taskContext.chosen_domain || rawTask.domain || 'fullstack';
    const userLevel = taskContext.userLevel || taskContext.skillLevel || skillTier || 'BEGINNER';
    const roadmapId = taskContext.roadmapId || 'active_roadmap';

    // 1. Task-Specific Cache Key Fingerprint
    const cacheKey = `placify_rag_res_${roadmapId}_${domain}_${taskTopic}_${taskSubtopic}_${taskId}_${userLevel}_${taskDuration}`;

    // Check in-memory cache
    if (this.ragCache.has(cacheKey)) {
      return this.ragCache.get(cacheKey);
    }

    // Check localStorage cache
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.ragCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (e) {}

    console.log('[POST /api/rag/day-resources - RAG Query]', {
      taskId,
      taskTitle,
      taskTopic,
      taskSubtopic,
      taskDuration,
      userLevel,
      domain
    });

    const structuredQuery = `${domain} ${taskTopic} ${taskSubtopic}. ${taskType}: ${taskTitle}. Level: ${userLevel}. Duration: ${taskDuration} mins`;

    const payload = {
      user_id: userId,
      query: structuredQuery,
      taskId,
      taskTitle,
      taskType,
      taskDifficulty,
      taskDuration,
      dailyTopic: taskTopic,
      subtopic: taskSubtopic,
      topic: taskTopic,
      domain,
      userLevel,
      topK: 3,
      dailyHours: taskContext.dailyHours || session?.daily_hours || 2.0,
      dailyBudgetMinutes: Math.round((parseFloat(taskContext.dailyHours || session?.daily_hours || 2.0)) * 60),
      taskDescription: rawTask.description || taskContext.description || '',
      weekNumber: weekNum,
      dayNumber: dayNum,
      quizTopicPerformance: taskContext.quizTopicPerformance || {},
      history_resource_ids: this.getRecentlyUsedResourceIds(userId),
      week_resource_ids: this.getWeekResourceIds(userId, weekNum)
    };

    // 2. Attempt RAG API call with 30s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const baseUrl = (typeof window !== 'undefined' && window.PLACIFY_API_BASE_URL) ? window.PLACIFY_API_BASE_URL : 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/rag/day-resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(payload)
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success && Array.isArray(data.resources) && data.resources.length > 0) {
        const mappedResources = data.resources.map((r, idx) => ({
          resource_id: r.resource_id || `res_${taskId}_${idx}`,
          title: r.title || 'Recommended Resource',
          url: r.url || '#',
          platform: r.platform || r.channel || (r.resource_type === 'video' ? 'YouTube' : 'Web Resource'),
          description: r.description || (r.subtopic ? `${r.topic || ''} — ${r.subtopic}` : 'Recommended learning resource'),
          estimated_minutes: r.duration_minutes || r.estimated_minutes || 20,
          duration_minutes: r.duration_minutes || r.estimated_minutes || 20,
          task_budget_minutes: taskDuration,
          relevance_reason: r.relevance_reason || `Matches topic '${taskTopic}' and task '${taskTitle}' within ${taskDuration} min budget.`,
          category_label: r.category_label || (idx === 0 ? 'PRIMARY' : (idx === 1 ? 'ALTERNATIVE' : 'PRACTICE')),
          duration_fit_score: r.duration_fit_score || 0.9,
          relevance_score: r.relevance_score || 0.85,
          final_score: r.final_score || 0.85,
          resource_type: r.resource_type || (r.url && r.url.includes('youtube') ? 'video' : 'article'),
          is_official: Boolean(r.is_official),
          is_chapter: Boolean(r.is_chapter),
          startTimestamp: r.startTimestamp || null,
          endTimestamp: r.endTimestamp || null,
          start_seconds: r.start_seconds || null,
          end_seconds: r.end_seconds || null,
          verificationStatus: r.verificationStatus || (r.is_chapter ? 'VERIFIED_CHAPTER' : (r.is_official ? 'OFFICIAL_DOCS' : 'CURATED_RESOURCE')),
          isFallback: Boolean(r.isFallback),
          fallback_level: r.fallback_level || 1,
          matchedSubtopics: r.matchedSubtopics || []
        }));

        mappedResources.coverage = data.coverage || 'full';
        mappedResources.message = data.message || 'Curated resources retrieved successfully.';

        this.ragCache.set(cacheKey, mappedResources);
        try { localStorage.setItem(cacheKey, JSON.stringify(mappedResources)); } catch(e) {}
        this.recordUsedResourceIds(userId, weekNum, mappedResources.map(r => r.resource_id));
        return mappedResources;
      }

      console.warn('Backend resource API yielded no items, using curated fallback:', data?.message);
      const fallbackList = this.getCuratedTopicFallbacks(taskTopic, taskTitle, domain, taskSubtopic);
      fallbackList.coverage = 'fallback';
      fallbackList.message = 'Displaying verified educational references.';
      this.ragCache.set(cacheKey, fallbackList);
      return fallbackList;
    } catch (err) {
      console.warn('Resource retrieval error/timeout, using curated fallback:', err.message);
      const fallbackList = this.getCuratedTopicFallbacks(taskTopic, taskTitle, domain, taskSubtopic);
      fallbackList.coverage = 'fallback';
      fallbackList.message = 'Displaying verified educational references.';
      return fallbackList;
    }
  }
}



/* ============================================================
   6. RESOURCE FETCHER / ASSESSMENT AGENT
   ============================================================ */

class ResourceFetcherAgent {
  async fetchContentAndBuildAssessment(conceptTitle, topic, taskContext = {}) {
    const session = window.placifySupervisor?.authAgent?.getActiveSession?.();
    const tasks = Array.isArray(taskContext.tasks) ? taskContext.tasks : (taskContext.task ? [taskContext.task] : []);
    const response = await fetch('http://localhost:5000/api/daily-assessment/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: session?.user_id || taskContext.user_id,
        domain: taskContext.domain,
        skill_level: taskContext.skillLevel || taskContext.userLevel || taskContext.difficulty || 'BEGINNER',
        dsa_language: taskContext.dsaLanguage || null,
        day_number: taskContext.dayNumber || window.currentActiveDay || 1,
        tasks
      })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Daily assessment generation failed.');
    return { conceptTitle, topic, retrievedContentSummary: `NPTEL-style assessment covering today's ${tasks.length} task${tasks.length === 1 ? '' : 's'}.`, questions: data.questions };
  }

  async gradeAssessment(questions, userAnswers, userId) {
    const session = window.placifySupervisor?.authAgent?.getActiveSession?.();
    const uid = userId || session?.user_id;
    const response = await fetch('http://localhost:5000/api/daily-assessment/grade', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions, user_answers: userAnswers, user_id: uid })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Daily assessment grading failed.');
    return { score: data.earned_points, total: data.max_points, scorePct: data.score_pct, passed: data.passed, detailedFeedback: data.detailed_feedback, userStats: data.userStats };
  }

  async generateInterviewQuestions(taskContext = {}) {
    const session = window.placifySupervisor?.authAgent?.getActiveSession?.();
    const response = await fetch('http://localhost:5000/api/interview-questions/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: session?.user_id || taskContext.user_id, domain: taskContext.domain, skill_level: taskContext.skillLevel || taskContext.userLevel || 'BEGINNER', dsa_language: taskContext.dsaLanguage || null, day_number: taskContext.dayNumber || window.currentActiveDay || 1, tasks: taskContext.tasks || [] })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Interview question generation failed.');
    return data.questions || [];
  }
}


/* ============================================================
   7. PROGRESS TRACKER AGENT
   ============================================================ */

class ProgressTrackerAgent {

  constructor() {
    this.activeUserId = null;
    this.storagePrefix = 'placify_user_state_';
    this.memoryState = {};
    this.cleanupLegacyStorage();
  }

  /**
   * Cleans up legacy oversized localStorage state objects to prevent QuotaExceededError
   */
  cleanupLegacyStorage() {
    try {
      if (typeof localStorage === 'undefined') return;
      const keysToRemove = [];
      const keysToSanitize = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith('placify_rag_res_')) {
          keysToRemove.push(key);
        } else if (key.startsWith('placify_user_state') || key === 'placify_user_state') {
          const val = localStorage.getItem(key);
          if (val && (val.length > 4000 || val.includes('monthly_roadmap') || val.includes('dailyTasks') || val.includes('quizEvaluation'))) {
            keysToSanitize.push(key);
          }
        }
      }

      keysToRemove.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      keysToSanitize.forEach(k => {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            const minimal = {
              userId: parsed.userId || null,
              isOnboarded: Boolean(parsed.isOnboarded),
              streak: Number(parsed.streak) || 0,
              xp: Number(parsed.xp) || 0,
              level: Number(parsed.level) || 1,
              badges: Array.isArray(parsed.badges) ? parsed.badges : ['🐣 Fresh Start'],
              masteryPct: Number(parsed.masteryPct) || 0,
              lastCompletedDate: parsed.lastCompletedDate || null,
              currentDayIndex: Number(parsed.currentDayIndex) || 0,
              levelUpEligible: Boolean(parsed.levelUpEligible)
            };
            localStorage.setItem(k, JSON.stringify(minimal));
          }
        } catch (e) {
          try { localStorage.removeItem(k); } catch (rErr) {}
        }
      });
    } catch (err) {
      console.warn('Notice during storage cleanup:', err.message);
    }
  }

  setActiveUser(userId) {
    this.activeUserId = userId ? String(userId).trim() : null;
  }

  clearActiveUser() {
    this.activeUserId = null;
  }

  getStorageKey(userId) {
    const uid = userId || this.activeUserId;
    return uid ? `${this.storagePrefix}${uid}` : 'placify_user_state_guest';
  }

  /* ==========================================================
     DEFAULT STATE
     ========================================================== */

  getDefaultState(userId) {
    const uid = userId || this.activeUserId || null;
    return {
      isOnboarded: false,
      userId: uid,
      userProfile: null,
      evaluation: null,
      personalizedRoadmap: null,
      currentDayIndex: 0,
      masteryPct: 0,
      xp: 0,
      streak: 0,
      lastCompletedDate: null,
      badges: ['🐣 Fresh Start'],
      level: 1,
      levelUpEligible: false,
      history: []
    };
  }

  /* ==========================================================
     GET USER STATE
     ========================================================== */

  getUserState(userId) {
    const uid = userId || this.activeUserId;
    const mem = uid ? this.memoryState[uid] : this.memoryState['guest'];

    try {
      const key = this.getStorageKey(userId);
      const raw = localStorage.getItem(key);
      const persisted = raw ? JSON.parse(raw) : {};

      const base = this.getDefaultState(userId);
      const merged = {
        ...base,
        ...(mem || {}),
        ...persisted,
        streak: persisted.streak !== undefined ? persisted.streak : (mem?.streak ?? 0),
        xp: persisted.xp !== undefined ? persisted.xp : (mem?.xp ?? 0),
        level: persisted.level !== undefined ? persisted.level : (mem?.level ?? 1),
        badges: Array.isArray(persisted.badges) ? persisted.badges : (mem?.badges || ['🐣 Fresh Start']),
        masteryPct: persisted.masteryPct !== undefined ? persisted.masteryPct : (mem?.masteryPct ?? 0),
        personalizedRoadmap: mem?.personalizedRoadmap || window.activePersonalizedRoadmap || null,
        history: Array.isArray(mem?.history) ? mem.history : []
      };

      if (uid) {
        this.memoryState[uid] = merged;
      }
      return merged;
    } catch (error) {
      console.error('❌ Could not read progress state:', error);
      return mem || this.getDefaultState(userId);
    }
  }

  /* ==========================================================
     SAVE USER STATE
     Stores rich state in memory and saves strictly minimal metadata to localStorage
     ========================================================== */

  saveUserState(state, userId) {
    const uid = userId || state?.userId || this.activeUserId;
    if (!state) return this.getDefaultState(uid);

    // Keep rich state in-memory
    if (uid) {
      this.memoryState[uid] = state;
    } else {
      this.memoryState['guest'] = state;
    }

    if (state.personalizedRoadmap) {
      window.activePersonalizedRoadmap = state.personalizedRoadmap;
    }

    // Persist only lightweight metrics to localStorage
    const minimalState = {
      userId: uid,
      isOnboarded: Boolean(state.isOnboarded),
      streak: Number(state.streak) || 0,
      xp: Number(state.xp) || 0,
      level: Number(state.level) || 1,
      badges: Array.isArray(state.badges) ? state.badges : ['🐣 Fresh Start'],
      masteryPct: Number(state.masteryPct) || 0,
      lastCompletedDate: state.lastCompletedDate || null,
      currentDayIndex: Number(state.currentDayIndex) || 0,
      levelUpEligible: Boolean(state.levelUpEligible)
    };

    try {
      const key = this.getStorageKey(uid);
      localStorage.setItem(key, JSON.stringify(minimalState));
    } catch (storageErr) {
      console.warn('⚠️ LocalStorage write warning (handled safely):', storageErr.message);
      // Attempt cleanup and retry once
      try {
        this.cleanupLegacyStorage();
        const key = this.getStorageKey(uid);
        localStorage.setItem(key, JSON.stringify(minimalState));
      } catch (retryErr) {
        console.warn('⚠️ Storage quota full, state maintained safely in memory:', retryErr.message);
      }
    }

    return state;
  }

  /* ==========================================================
     SYNC WITH BACKEND SOURCE OF TRUTH (MongoDB Atlas)
     ========================================================== */

  async syncWithBackend(userId) {
    const uid = userId || this.activeUserId;
    if (!uid) return this.getUserState();
    this.setActiveUser(uid);
    try {
      const baseUrl = (typeof window !== 'undefined' && window.PLACIFY_API_BASE_URL) ? window.PLACIFY_API_BASE_URL : 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/progress/${encodeURIComponent(uid)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          const currentState = this.getUserState(uid);
          currentState.userId = uid;
          currentState.streak = data.streak !== undefined ? data.streak : 0;
          currentState.xp = data.xp !== undefined ? data.xp : 0;
          currentState.level = data.level !== undefined ? data.level : 1;
          currentState.badges = Array.isArray(data.badges) ? data.badges : ['🐣 Fresh Start'];
          currentState.masteryPct = data.masteryPct !== undefined ? data.masteryPct : 0;
          this.saveUserState(currentState, uid);
          return currentState;
        }
      }
    } catch (err) {
      console.warn('Could not sync progress with backend:', err.message);
    }
    return this.getUserState(uid);
  }

  /* ==========================================================
     TASK COMPLETION
     ========================================================== */

  logTaskCompletion(dayNumber, taskScorePct, userId) {
    const uid = userId || this.activeUserId;
    const state = this.getUserState(uid);

    const roadmap = state.personalizedRoadmap || window.activePersonalizedRoadmap;
    if (!roadmap) {
      return state;
    }

    if (!Array.isArray(roadmap.dailyTasks)) {
      roadmap.dailyTasks = [];
      let dayCounter = 1;
      (roadmap.monthly_roadmap || []).forEach(m => {
        (m.weeks || []).forEach(w => {
          (w.days || []).forEach(d => {
            (d.tasks || []).forEach(t => {
              roadmap.dailyTasks.push({
                ...t,
                dayNumber: Number(d.day_number || dayCounter),
                day_number: Number(d.day_number || dayCounter),
                weekNumber: Number(w.week_number),
                week_number: Number(w.week_number),
                monthNumber: Number(m.month_number),
                month_number: Number(m.month_number),
                milestoneId: `m${m.month_number}_w${w.week_number}_d${d.day_number}`,
                milestoneTitle: w.title || 'Weekly Module',
                topic: t.taskTopic || t.topic || d.topic || (w.topics && w.topics[0]) || 'General',
                taskTopic: t.taskTopic || t.topic || d.topic || (w.topics && w.topics[0]) || 'General',
                taskSubtopic: t.taskSubtopic || t.subtopic || t.subskillName || d.topic || 'General',
                conceptTitle: t.title || t.taskTitle || 'Learning Task',
                type: t.type || t.taskType || 'LEARN',
                durationMinutes: t.durationMinutes || t.estimated_minutes || 60,
                completed: t.completed === true || String(t.status || '').toUpperCase() === 'COMPLETED'
              });
            });
            dayCounter++;
          });
        });
      });
    }

    const task = roadmap.dailyTasks.find(
      t => Number(t.dayNumber || t.day_number) === Number(dayNumber)
    );

    if (task) {
      task.completed = true;
      task.score = taskScorePct;
    }

    const completedTasks = roadmap.dailyTasks.filter(t => t.completed);
    const totalTasks = roadmap.dailyTasks.length;

    state.masteryPct = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    const xpGained = Math.round(150 * (taskScorePct / 100));
    state.xp = (state.xp || 0) + xpGained;

    state.currentDayIndex = Math.max(state.currentDayIndex || 0, dayNumber);

    const today = new Date().toISOString().split('T')[0];
    if (state.lastCompletedDate !== today) {
      state.streak = Math.max(1, (state.streak || 0) + 1);
      state.lastCompletedDate = today;
    }

    if (completedTasks.length === 1 && !state.badges.includes('🚀 First Step')) {
      state.badges.push('🚀 First Step');
    }
    if (state.streak >= 3 && !state.badges.includes('🔥 3-Day Streak')) {
      state.badges.push('🔥 3-Day Streak');
    }
    if (state.masteryPct >= 50 && !state.badges.includes('⚡ Halfway Master')) {
      state.badges.push('⚡ Halfway Master');
    }
    if (state.masteryPct >= 100 && !state.badges.includes('🏆 Domain Conqueror')) {
      state.badges.push('🏆 Domain Conqueror');
    }

    state.level = Math.floor(state.xp / 300) + 1;

    state.history.push({
      timestamp: new Date().toISOString(),
      dayNumber,
      taskScorePct,
      masteryPct: state.masteryPct,
      xpGained
    });

    state.personalizedRoadmap = roadmap;
    window.activePersonalizedRoadmap = roadmap;

    return this.saveUserState(state, uid);
  }

  /* ==========================================================
     CONSUME LEVEL UP
     ========================================================== */

  consumeLevelUp(tierChoice, userId) {
    const uid = userId || this.activeUserId;
    const state = this.getUserState(uid);
    state.levelUpEligible = false;
    if (state.personalizedRoadmap) {
      state.personalizedRoadmap.skillTier = tierChoice;
    }
    return this.saveUserState(state, uid);
  }

  /* ==========================================================
     RESET
     ========================================================== */

  resetState(userId) {
    const uid = userId || this.activeUserId;
    const key = this.getStorageKey(uid);
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    if (uid) {
      delete this.memoryState[uid];
    }
    return this.getUserState(uid);
  }
}


/* ============================================================
   8. PLACIFY SUPERVISOR AGENT
   ============================================================ */

class PlacifySupervisorAgent {

  constructor() {

    /*
     * IMPORTANT:
     *
     * These names MUST match what app.js uses.
     */

    this.authAgent =
      new AuthAgent();

    this.quizEvaluator =
      new QuizEvaluatorAgent();

    this.roadmapGenerator =
      new RoadmapGeneratorAgent();

    this.personalizedRoadmap =
      new PersonalizedRoadmapAgent();

    this.resourceSuggester =
      new ResourceSuggesterAgent();

    this.resourceFetcher =
      new ResourceFetcherAgent();

    this.progressTracker =
      new ProgressTrackerAgent();


    this.logs = [];
  }


  /* ==========================================================
     LOG AGENT ACTION
     ========================================================== */

  logAgentAction(
    agentName,
    action,
    details
  ) {

    const entry = {

      timestamp:
        new Date().toLocaleTimeString(),

      agentName,

      action,

      details

    };


    this.logs.unshift(
      entry
    );


    if (
      typeof window.onAgentLog ===
      'function'
    ) {

      window.onAgentLog(
        entry
      );
    }
  }


  /* ==========================================================
     REGISTER USER
     ========================================================== */

  async registerUser(
    userData
  ) {

    this.logAgentAction(

      'auth_specialist',

      'User Registration Request',

      `Processing registration for ${userData.name} (${userData.email})`

    );


    try {

      const profile =
        await this.authAgent.registerUser(
          userData
        );


      this.logAgentAction(

        'auth_specialist',

        'Registration & Password Authentication Success',

        `User ${profile.name} registered successfully. Assigned user_id: ${profile.user_id}`

      );


      this.logAgentAction(

        'SupervisorAgent',

        'POST-AUTH ACTION: Handoff to Quiz Evaluator',

        `Passing user_id: ${profile.user_id} & chosen_domain: ${profile.chosen_domain} to quiz_evaluator agent.`

      );


      return profile;


    } catch (error) {

      this.logAgentAction(

        'auth_specialist',

        'Registration Failed',

        error.message

      );


      throw error;
    }
  }


  /* ==========================================================
     AUTHENTICATE USER
     ========================================================== */

  async authenticateUser(
    email,
    password
  ) {

    this.logAgentAction(

      'auth_specialist',

      'Login Request',

      `Authenticating credentials for email: ${email}`

    );


    try {

      const profile =
        await this.authAgent.loginUser(
          email,
          password
        );


      this.logAgentAction(

        'auth_specialist',

        'Login Authentication Success',

        `User ${profile.name} (${profile.user_id}) verified against MongoDB Atlas.`

      );


      this.logAgentAction(

        'SupervisorAgent',

        'POST-AUTH ACTION: Handoff to Quiz Evaluator',

        `Passing user_id: ${profile.user_id} & chosen_domain: ${profile.chosen_domain} to quiz_evaluator agent.`

      );


      return profile;


    } catch (error) {

      this.logAgentAction(

        'auth_specialist',

        'Authentication Failure (HTTP 401)',

        error.message

      );


      throw error;
    }
  }


  /* ==========================================================
     CHECK USER ONBOARDING STATE (MONGODB AUTHORITATIVE)
     ========================================================== */

  async checkUserOnboardingState(userId) {
    if (!userId) {
      return { action: 'QUIZ', route: 'diagnosticQuiz' };
    }

    try {
      const userRes = await fetch(`http://localhost:5000/api/user/${userId}`);
      const userData = await userRes.json();

      if (!userData.success || !userData.profile) {
        return { action: 'QUIZ', route: 'diagnosticQuiz' };
      }

      const profile = userData.profile;

      // Priority 0: If chosen_domain is null/missing, user hasn't selected domain yet
      if (!profile.chosen_domain) {
        return { action: 'DOMAIN_SELECT', route: 'domainSelection', profile };
      }

      // Priority 1: If quiz_completed is false, new/incomplete onboarding user -> Diagnostic Quiz
      if (!profile.quiz_completed) {
        return { action: 'QUIZ', route: 'diagnosticQuiz', profile };
      }

    // Priority 2: If quiz_completed is true, quiz must NEVER be shown again! Check existing evaluation and roadmap.
    let evaluation = null;
    try {
      const evalRes = await fetch(`http://localhost:5000/api/quiz/evaluation/${encodeURIComponent(userId)}`);
      if (evalRes.ok) {
        const evalData = await evalRes.json();
        if (evalData && evalData.success && evalData.evaluation) {
          evaluation = evalData.evaluation;
        }
      }
    } catch (evalErr) {
      console.warn('Could not fetch user quiz evaluation:', evalErr.message);
    }

    let roadmap = null;
    try {
      const rmRes = await fetch(`http://localhost:5000/api/roadmap/user/${encodeURIComponent(userId)}`);
      if (rmRes.ok) {
        const rmData = await rmRes.json();
        if (rmData && rmData.success && rmData.roadmap) {
          roadmap = rmData.roadmap;
        }
      }
    } catch (rmErr) {
      console.warn('Could not fetch user roadmap:', rmErr.message);
    }

    // Priority 3: If roadmap missing for quiz_completed user, auto-generate roadmap
    if (!roadmap) {
      console.log(`⚡ Quiz completed for ${userId} but roadmap missing. Auto-generating...`);
      try {
        const genRes = await fetch('http://localhost:5000/api/roadmap/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, quizEvaluation: evaluation })
        });
        const genData = await genRes.json();
        if (genData && genData.success && genData.roadmap) {
          roadmap = genData.roadmap;
        }
      } catch (genErr) {
        console.warn('Could not auto-generate roadmap:', genErr.message);
      }
    }

    // Save state
    const state = this.progressTracker.getUserState();
    state.isOnboarded = true;
    state.userProfile = profile;
    if (roadmap) {
      state.personalizedRoadmap = roadmap;
    }
    if (evaluation) {
      state.quizEvaluation = evaluation;
    }
    this.progressTracker.saveUserState(state);

    // Target route priority: resume last_route (if not quiz or auth route), else 'assessmentReport' if never started journey, else 'roadmap'
    let targetRoute = 'roadmap';
    if (profile.last_route === 'assessmentReport') {
      targetRoute = 'assessmentReport';
    } else if (profile.last_route && profile.last_route !== 'diagnosticQuiz' && profile.last_route !== 'login' && profile.last_route !== 'onboarding' && profile.last_route !== 'diagnostic') {
      targetRoute = profile.last_route;
    } else if (evaluation && !profile.journey_started) {
      targetRoute = 'assessmentReport';
    }

    return {
      action: 'RESUME',
      route: targetRoute,
      profile,
      roadmap,
      evaluation
    };

    } catch (err) {
      console.error('Error checking user onboarding state:', err);
      return { action: 'RESUME', route: 'roadmap' };
    }
  }


  /* ==========================================================
     START LEARNING JOURNEY
     ========================================================== */

  async startLearningJourney(
    userProfile,
    diagnosticAnswers
  ) {

    if (!userProfile) {

      throw new Error(
        'User profile is missing.'
      );
    }


    this.logAgentAction(

      'SupervisorAgent',

      'Initiating Onboarding Workflow',

      `Received user domain: ${userProfile.domainId}, timeline: ${userProfile.timelineMonths}m, hours: ${userProfile.dailyHours}h/day`

    );


    // ========================================================
    // STEP 1: QUIZ EVALUATION
    // ========================================================

    const domainToEval = userProfile.domainId || userProfile.chosen_domain;

    this.logAgentAction(

      'quiz_evaluator',

      'Evaluating Diagnostic Answers',

      `Processing diagnostic questions for domain: ${domainToEval}`

    );


    const evaluation =
      await this.quizEvaluator.evaluateDiagnostic(

        domainToEval,

        diagnosticAnswers,

        userProfile.user_id

      );


    this.logAgentAction(

      'quiz_evaluator',

      'Skill Baseline Established',

      `Skill Tier: ${evaluation.skillTier} (${evaluation.scorePct}% score). Detected Gaps: ${evaluation.gaps.length}`

    );


    // ========================================================
    // STEP 2: GENERATE HIERARCHICAL PERSONALIZED ROADMAP FROM BACKEND
    // ========================================================

    this.logAgentAction(

      'personalized_roadmap',

      'Generating Hierarchical Personalized Roadmap',

      `Requesting server pipeline for user ${userProfile.user_id} (${userProfile.timelineMonths}m, ${userProfile.dailyHours}h/day)`

    );


    let finalRoadmap = null;
    try {
      const res = await fetch('http://localhost:5000/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userProfile.user_id,
          quizEvaluation: evaluation
        })
      });
      const data = await res.json();
      if (data.success && data.roadmap) {
        finalRoadmap = data.roadmap;
        finalRoadmap.dailyTasks = [];
        let dayCounter = 1;
        (finalRoadmap.monthly_roadmap || []).forEach(m => {
          (m.weeks || []).forEach(w => {
            (w.days || []).forEach(d => {
              (d.tasks || []).forEach(t => {
                finalRoadmap.dailyTasks.push({
                  ...t,
                  dayNumber: Number(d.day_number || dayCounter),
                  day_number: Number(d.day_number || dayCounter),
                  weekNumber: Number(w.week_number),
                  week_number: Number(w.week_number),
                  monthNumber: Number(m.month_number),
                  month_number: Number(m.month_number),
                  milestoneId: `m${m.month_number}_w${w.week_number}_d${d.day_number}`,
                  milestoneTitle: w.title || 'Weekly Module',
                  topic: t.taskTopic || t.topic || d.topic || (w.topics && w.topics[0]) || 'General',
                  taskTopic: t.taskTopic || t.topic || d.topic || (w.topics && w.topics[0]) || 'General',
                  taskSubtopic: t.taskSubtopic || t.subtopic || t.subskillName || d.topic || 'General',
                  conceptTitle: t.title || t.taskTitle || 'Learning Task',
                  type: t.type || t.taskType || 'LEARN',
                  completed: Boolean(t.completed),
                  score: t.score ?? null
                });
              });
              dayCounter++;
            });
          });
        });
      }
    } catch (err) {
      console.warn('Backend API roadmap generation offline, generating fallback:', err);
    }

    if (!finalRoadmap) {
      const baseRoadmap =
        this.roadmapGenerator.generateBaseRoadmap(
          userProfile.domainId,
          userProfile.timelineMonths || userProfile.timelineWeeks,
          userProfile.dailyHours
        );
      finalRoadmap =
        this.personalizedRoadmap.customizeRoadmap(
          baseRoadmap,
          evaluation
        );
    }


    // ========================================================
    // STEP 3: SAVE STATE
    // ========================================================

    const state =
      this.progressTracker.getUserState();


    state.isOnboarded =
      true;

    state.userProfile =
      userProfile;

    state.evaluation =
      evaluation;

    state.personalizedRoadmap =
      finalRoadmap;

    state.currentDayIndex =
      0;


    this.progressTracker.saveUserState(
      state
    );


    this.logAgentAction(

      'SupervisorAgent',

      'Journey Initialized Successfully',

      `Personalized roadmap ready with ${finalRoadmap.monthly_roadmap ? finalRoadmap.monthly_roadmap.length + ' months' : (finalRoadmap.milestones ? finalRoadmap.milestones.length + ' milestones' : 'roadmap tasks')}.`

    );


    return {

      userProfile,

      evaluation,

      personalizedRoadmap:
        finalRoadmap

    };
  }


  /* ==========================================================
     DAILY LEARNING LOOP
     ========================================================== */

  getDailyTaskAndResources(dayNumber) {
    const state = this.progressTracker.getUserState();
    const roadmap = state?.personalizedRoadmap || window.activePersonalizedRoadmap;
    if (!roadmap) {
      return null;
    }

    const daySpec = typeof dayNumber === 'object' && dayNumber !== null ? dayNumber : { day: parseInt(dayNumber, 10) || 1 };
    const targetDayNum = parseInt(daySpec.day, 10) || 1;
    const reqMonth = daySpec.month !== undefined && daySpec.month !== null ? parseInt(daySpec.month, 10) : null;
    const reqWeek = daySpec.week !== undefined && daySpec.week !== null ? parseInt(daySpec.week, 10) : null;
    const reqDayId = daySpec.dayId || null;

    let foundDay = null;
    let foundTask = null;

    if (Array.isArray(roadmap.monthly_roadmap)) {
      for (const month of roadmap.monthly_roadmap) {
        if (reqMonth !== null && parseInt(month.month_number, 10) !== reqMonth) continue;
        if (Array.isArray(month.weeks)) {
          for (const week of month.weeks) {
            if (reqWeek !== null && parseInt(week.week_number, 10) !== reqWeek) continue;
            if (Array.isArray(week.days)) {
              for (const day of week.days) {
                const dNum = parseInt(day.day_number, 10);
                const dId = day.id || day.day_id || '';
                if ((reqDayId && dId === reqDayId) || dNum === targetDayNum) {
                  foundDay = day;
                  if (Array.isArray(day.tasks) && day.tasks.length > 0) {
                    foundTask = day.tasks[0];
                  }
                  break;
                }
              }
            }
            if (foundDay) break;
          }
        }
        if (foundDay) break;
      }

      if (!foundDay) {
        for (const month of roadmap.monthly_roadmap) {
          if (Array.isArray(month.weeks)) {
            for (const week of month.weeks) {
              if (Array.isArray(week.days)) {
                for (const day of week.days) {
                  const dNum = parseInt(day.day_number, 10);
                  const dId = day.id || day.day_id || '';
                  if ((reqDayId && dId === reqDayId) || dNum === targetDayNum) {
                    foundDay = day;
                    if (Array.isArray(day.tasks) && day.tasks.length > 0) {
                      foundTask = day.tasks[0];
                    }
                    break;
                  }
                }
              }
              if (foundDay) break;
            }
          }
          if (foundDay) break;
        }
      }
    }

    if (!foundTask && Array.isArray(roadmap.dailyTasks)) {
      foundTask = roadmap.dailyTasks.find(t => (reqDayId && (t.id === reqDayId || t.day_id === reqDayId)) || parseInt(t.dayNumber || t.day_number, 10) === targetDayNum) || roadmap.dailyTasks[0];
    }

    const normTask = (foundTask && window.normalizeDailyTask) ? window.normalizeDailyTask(foundTask, { dayNumber: targetDayNum, topic: (foundDay && foundDay.topic) || 'Core Learning', domain: roadmap.domain || roadmap.domain_id || 'fullstack' }) : null;

    const skillTier = (normTask && normTask.difficulty) || roadmap.overall_level || roadmap.skillTier || 'BEGINNER';
    const domain = (normTask && normTask.domain) || roadmap.domain_id || roadmap.domain || 'fullstack';
    const topic = (foundDay && foundDay.topic) || (normTask && (normTask.taskTopic || normTask.taskSubtopic || normTask.taskTitle)) || (foundTask && (foundTask.topic || foundTask.title)) || 'Core Learning';

    const task = {
      dayNumber: targetDayNum,
      conceptTitle: (normTask && normTask.taskTitle) || (foundTask && foundTask.title) || `Day ${targetDayNum}: ${topic}`,
      topic: topic,
      type: (normTask && normTask.taskType) || (foundTask && foundTask.type) || 'LEARN',
      estHours: normTask ? (normTask.durationMinutes / 60) : (foundTask ? ((foundTask.estimated_minutes || 45) / 60) : 1),
      tasks: (foundDay && Array.isArray(foundDay.tasks)) ? foundDay.tasks.map(t => window.normalizeDailyTask ? window.normalizeDailyTask(t, { dayNumber: targetDayNum, topic, domain }) : t) : (normTask ? [normTask] : (foundTask ? [foundTask] : []))
    };

    const taskContext = {
      id: (normTask && normTask.taskId) || (foundTask && foundTask.id) || `task_day_${targetDayNum}`,
      taskId: (normTask && normTask.taskId) || (foundTask && foundTask.id) || `task_day_${targetDayNum}`,
      title: task.conceptTitle,
      taskTitle: task.conceptTitle,
      type: task.type,
      taskType: task.type,
      estimated_minutes: Math.round(task.estHours * 60),
      durationMinutes: Math.round(task.estHours * 60),
      domain: domain,
      user_id: roadmap.user_id,
      topic: topic,
      taskTopic: topic,
      subtopic: (normTask && normTask.taskSubtopic) || topic,
      taskSubtopic: (normTask && normTask.taskSubtopic) || topic,
      difficulty: skillTier
    };

    let resources = [];
    if (foundTask && Array.isArray(foundTask.recommended_resources) && foundTask.recommended_resources.length > 0) {
      const isDomainValid = foundTask.recommended_resources.every(r => {
        if (!r.url || !r.title) return false;
        const rDom = (r.domain || '').toLowerCase();
        const tDom = (domain || '').toLowerCase();
        if (rDom && tDom && !rDom.includes(tDom) && !tDom.includes(rDom) && rDom !== 'all') {
          return false;
        }
        return true;
      });
      if (isDomainValid) {
        resources = foundTask.recommended_resources;
      }
    }

    if (!resources || resources.length === 0) {
      resources = [];
    }

    return {
      task,
      skillTier,
      resources
    };
  }


  /* ==========================================================
     FETCH TASK ASSESSMENT
     ========================================================== */

  async fetchTaskAssessment(conceptTitle, topic, taskContext = {}) {
    this.logAgentAction('resource_fetcher', 'Generating NPTEL-Style Daily Assessment', `Generating a mixed-format assessment for Day ${taskContext.dayNumber || 1}`);
    return this.resourceFetcher.fetchContentAndBuildAssessment(conceptTitle, topic, taskContext);
  }

  /* ==========================================================
     SUBMIT TASK ASSESSMENT
     ========================================================== */

  async submitTaskAssessment(dayNumber, questions, userAnswers) {
    this.logAgentAction('resource_fetcher', 'Grading NPTEL-Style Assessment', `Evaluating Day ${dayNumber} assessment`);
    const grade = await this.resourceFetcher.gradeAssessment(questions, userAnswers);
    const updatedState = this.progressTracker.logTaskCompletion(dayNumber, grade.scorePct);
    return { grade, updatedState };
  }

  async generateInterviewQuestions(taskContext = {}) {
    this.logAgentAction('interview_preparation', 'Generating Interview Questions', `Preparing optional interview questions for Day ${taskContext.dayNumber || 1}`);
    return this.resourceFetcher.generateInterviewQuestions(taskContext);
  }
}


/* ============================================================
   GLOBAL SUPERVISOR INITIALIZATION
   ============================================================
 *
 * THIS LINE FIXES:
 *
 * "Cannot read properties of undefined
 *  (reading 'registerUser')"
 *
 * app.js expects:
 *
 * window.placifySupervisor
 *
 * ============================================================ */

window.placifySupervisor =
  new PlacifySupervisorAgent();


/* ============================================================
   DEBUG CONFIRMATION
   ============================================================ */

console.log(
  '✅ Placify Agent Network initialized successfully.'
);

console.log(
  '🤖 Supervisor:',
  window.placifySupervisor
);

console.log(
  '🔐 AuthAgent:',
  window.placifySupervisor.authAgent
);

console.log(
  '🧠 QuizEvaluator:',
  window.placifySupervisor.quizEvaluator
);

console.log(
  '🗺️ RoadmapGenerator:',
  window.placifySupervisor.roadmapGenerator
);

console.log(
  '🎯 PersonalizedRoadmap:',
  window.placifySupervisor.personalizedRoadmap
);

console.log(
  '📚 ResourceSuggester:',
  window.placifySupervisor.resourceSuggester
);

console.log(
  '📝 ResourceFetcher:',
  window.placifySupervisor.resourceFetcher
);

console.log(
  '📈 ProgressTracker:',
  window.placifySupervisor.progressTracker
);