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


      this.setActiveSession(
        data.profile
      );


      console.log(
        '✅ User registered successfully:',
        data.profile
      );


      return data.profile;


    } catch (error) {

      console.error(
        '❌ Registration failed:',
        error
      );

      /*
       * MongoDB Atlas is the ONLY authentication source.
       *
       * Do NOT create a localStorage user here.
       */

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

          /*
           * Send original password.
           *
           * Backend retrieves the stored salt
           * and performs PBKDF2 verification.
           */

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

      /*
       * MongoDB Atlas is the ONLY authentication source.
       */

      throw error;
    }
  }


  /* ==========================================================
     SAVE ACTIVE SESSION
     ========================================================== */

  setActiveSession(profile) {

    localStorage.setItem(
      this.sessionKey,
      JSON.stringify(profile)
    );
  }


  /* ==========================================================
     GET ACTIVE SESSION
     ========================================================== */

  getActiveSession() {

    try {

      const raw =
        localStorage.getItem(
          this.sessionKey
        );


      if (!raw) {
        return null;
      }


      return JSON.parse(raw);


    } catch (error) {

      console.error(
        '❌ Could not read active session:',
        error
      );

      return null;
    }
  }


  /* ==========================================================
     LOGOUT
     ========================================================== */

  clearSession() {

    localStorage.removeItem(
      this.sessionKey
    );
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


  async suggestResources(topic, skillTier, taskContext = {}) {
    const payload = {
      taskId: taskContext.id || taskContext.taskId,
      taskTitle: taskContext.title || taskContext.taskTitle || taskContext.conceptTitle || topic || 'Learning Task',
      taskType: taskContext.type || taskContext.taskType || 'LEARN',
      taskDifficulty: skillTier || taskContext.difficulty || 'BEGINNER',
      taskDuration: taskContext.durationMinutes || taskContext.estimated_minutes || taskContext.taskDuration || 30,
      dailyTopic: taskContext.dailyTopic || topic,
      subtopic: taskContext.taskSubtopic || taskContext.subtopic || taskContext.subskillName || topic,
      topic: taskContext.taskTopic || taskContext.topic || topic,
      domain: taskContext.domain || taskContext.domainId || taskContext.chosen_domain || 'fullstack',
      userLevel: skillTier || taskContext.userLevel || taskContext.difficulty || 'BEGINNER',
      user_id: taskContext.user_id
    };

    console.log('[POST /api/resources/recommend - DYNAMIC RAG]', payload);

    try {
      const res = await fetch('http://localhost:5000/api/resources/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.resources)) return data.resources;
      console.warn('Dynamic resource API returned no resources:', data.message || data.error);
    } catch (err) {
      console.warn('Dynamic resource retrieval failed:', err.message);
    }

    return [];
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

  async gradeAssessment(questions, userAnswers) {
    const response = await fetch('http://localhost:5000/api/daily-assessment/grade', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions, user_answers: userAnswers })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.error || 'Daily assessment grading failed.');
    return { score: data.earned_points, total: data.max_points, scorePct: data.score_pct, passed: data.passed, detailedFeedback: data.detailed_feedback };
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

    this.storageKey =
      'placify_user_state';
  }


  /* ==========================================================
     DEFAULT STATE
     ========================================================== */

  getDefaultState() {

    return {

      isOnboarded:
        false,

      userProfile:
        null,

      evaluation:
        null,

      personalizedRoadmap:
        null,

      currentDayIndex:
        0,

      masteryPct:
        0,

      xp:
        0,

      streak:
        1,

      lastCompletedDate:
        null,

      badges:
        ['🐣 Fresh Start'],

      level:
        1,

      levelUpEligible:
        false,

      history:
        []

    };
  }


  /* ==========================================================
     GET USER STATE
     ========================================================== */

  getUserState() {

    try {

      const raw =
        localStorage.getItem(
          this.storageKey
        );


      if (!raw) {

        return this.getDefaultState();
      }


      const state =
        JSON.parse(raw);


      /*
       * Protect against missing properties
       * when an older local state exists.
       */

      return {

        ...this.getDefaultState(),

        ...state,

        badges:
          Array.isArray(state.badges)
            ? state.badges
            : ['🐣 Fresh Start'],

        history:
          Array.isArray(state.history)
            ? state.history
            : []

      };


    } catch (error) {

      console.error(
        '❌ Could not read progress state:',
        error
      );

      return this.getDefaultState();
    }
  }


  /* ==========================================================
     SAVE USER STATE
     ========================================================== */

  saveUserState(state) {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(state)
    );

    return state;
  }


  /* ==========================================================
     TASK COMPLETION
     ========================================================== */

  logTaskCompletion(
    dayNumber,
    taskScorePct
  ) {

    const state =
      this.getUserState();


    if (
      !state.personalizedRoadmap
    ) {

      return state;
    }


    if (!Array.isArray(state.personalizedRoadmap.dailyTasks)) {
      state.personalizedRoadmap.dailyTasks = [];
      let dayCounter = 1;
      (state.personalizedRoadmap.monthly_roadmap || []).forEach(m => {
        (m.weeks || []).forEach(w => {
          (w.days || []).forEach(d => {
            (d.tasks || []).forEach(t => {
              state.personalizedRoadmap.dailyTasks.push({
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

    const task = state.personalizedRoadmap.dailyTasks.find(
      t => Number(t.dayNumber || t.day_number) === Number(dayNumber)
    );

    if (!task) {
      console.warn(`⚠️ Day ${dayNumber} task not found.`);
    } else {
      task.completed = true;
      task.score = taskScorePct;
    }


    // -------------------------------
    // Mark Task Complete
    // -------------------------------

    task.completed =
      true;

    task.score =
      taskScorePct;


    // -------------------------------
    // Calculate Mastery
    // -------------------------------

    const completedTasks =
      state.personalizedRoadmap
        .dailyTasks
        .filter(
          t => t.completed
        );


    const totalTasks =
      state.personalizedRoadmap
        .dailyTasks
        .length;


    state.masteryPct =
      totalTasks > 0
        ? Math.round(
          (completedTasks.length /
            totalTasks) *
          100
        )
        : 0;


    // -------------------------------
    // XP
    // -------------------------------

    const xpGained =
      Math.round(
        150 *
        (taskScorePct / 100)
      );


    state.xp += xpGained;


    // -------------------------------
    // Update Current Day
    // -------------------------------

    state.currentDayIndex =
      Math.max(
        state.currentDayIndex || 0,
        dayNumber
      );


    // -------------------------------
    // Streak
    // -------------------------------

    const today =
      new Date()
        .toISOString()
        .split('T')[0];


    if (
      state.lastCompletedDate !==
      today
    ) {

      /*
       * Keep existing project behavior:
       * first completed task changes
       * the streak from 1 to 2.
       */

      state.streak =
        Math.max(
          1,
          state.streak + 1
        );

      state.lastCompletedDate =
        today;
    }


    // -------------------------------
    // Badges
    // -------------------------------

    if (
      completedTasks.length === 1 &&
      !state.badges.includes(
        '🚀 First Step'
      )
    ) {

      state.badges.push(
        '🚀 First Step'
      );
    }


    if (
      state.streak >= 3 &&
      !state.badges.includes(
        '🔥 3-Day Streak'
      )
    ) {

      state.badges.push(
        '🔥 3-Day Streak'
      );
    }


    if (
      state.masteryPct >= 50 &&
      !state.badges.includes(
        '⚡ Halfway Master'
      )
    ) {

      state.badges.push(
        '⚡ Halfway Master'
      );
    }


    if (
      state.masteryPct >= 100 &&
      !state.badges.includes(
        '🏆 Domain Conqueror'
      )
    ) {

      state.badges.push(
        '🏆 Domain Conqueror'
      );
    }


    // -------------------------------
    // Level Calculation
    // -------------------------------

    const newLevel =
      Math.floor(
        state.xp / 300
      ) + 1;


    if (
      newLevel > state.level
    ) {

      state.level =
        newLevel;

      state.levelUpEligible =
        true;
    }


    // -------------------------------
    // History
    // -------------------------------

    state.history.push({

      timestamp:
        new Date().toISOString(),

      dayNumber,

      taskScorePct,

      masteryPct:
        state.masteryPct,

      xpGained

    });


    return this.saveUserState(
      state
    );
  }


  /* ==========================================================
     CONSUME LEVEL UP
     ========================================================== */

  consumeLevelUp(
    tierChoice
  ) {

    const state =
      this.getUserState();


    state.levelUpEligible =
      false;


    if (
      state.personalizedRoadmap
    ) {

      state.personalizedRoadmap.skillTier =
        tierChoice;
    }


    return this.saveUserState(
      state
    );
  }


  /* ==========================================================
     RESET
     ========================================================== */

  resetState() {

    localStorage.removeItem(
      this.storageKey
    );

    return this.getUserState();
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

      // Priority 2: If quiz_completed is true, quiz must NEVER be shown again! Check existing roadmap.
      let roadmap = null;
      try {
        const rmRes = await fetch(`http://localhost:5000/api/roadmap/user/${userId}`);
        const rmData = await rmRes.json();
        if (rmData.success && rmData.roadmap) {
          roadmap = rmData.roadmap;
        }
      } catch (rmErr) {
        console.warn('Could not fetch user roadmap:', rmErr);
      }

      // Priority 3: If roadmap missing for quiz_completed user, auto-generate roadmap
      if (!roadmap) {
        console.log(`⚡ Quiz completed for ${userId} but roadmap missing. Auto-generating...`);
        const genRes = await fetch('http://localhost:5000/api/roadmap/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
        const genData = await genRes.json();
        if (genData.success && genData.roadmap) {
          roadmap = genData.roadmap;
        }
      }

      // Save state
      const state = this.progressTracker.getUserState();
      state.isOnboarded = true;
      state.userProfile = profile;
      if (roadmap) {
        state.personalizedRoadmap = roadmap;
      }
      this.progressTracker.saveUserState(state);

      // Target route priority: resume last_route (if not quiz or auth route), else 'roadmap'
      const targetRoute = (profile.last_route && profile.last_route !== 'diagnosticQuiz' && profile.last_route !== 'login' && profile.last_route !== 'onboarding')
        ? profile.last_route
        : 'roadmap';

      return {
        action: 'RESUME',
        route: targetRoute,
        profile,
        roadmap
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