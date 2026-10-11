const fs = require('fs');

const updatedChatHandler = `      const rawMessage = (body.message || '').trim();
      const history = Array.isArray(body.history) ? body.history : [];
      const context = body.context || {};
      const userId = (body.userId || body.user_id || '').trim();
      const sessionId = (body.sessionId || body.session_id || '').trim();

      if (!rawMessage) {
        return sendJSON(res, 400, { success: false, error: 'Message cannot be empty.' });
      }

      // Sanitize & length limit message
      const sanitizedMessage = rawMessage.slice(0, 1000);

      // Verify user if provided to ensure private data isolation
      let userDoc = null;
      if (userId && mongoose.connection.readyState === 1) {
        try {
          const User = mongoose.model('User');
          userDoc = await User.findOne({ user_id: userId }).lean();
        } catch (e) {
          console.warn('[Chat Assistant] User lookup notice:', e.message);
        }
      }

      const activeDomain = context.domain || (userDoc && userDoc.chosen_domain) || 'Full-Stack Web Development';
      const activeLevel = context.details?.selectedProficiencyLevel || context.level || (userDoc && userDoc.current_skill_level) || 'Beginner';

      // Build context summary
      let contextSummary = \`User Target Domain: "\${activeDomain}" (Selected Proficiency / Skill Level: \${activeLevel})\\n\`;
      if (context.pageTitle || context.view) {
        contextSummary += \`Current Page: \${context.pageTitle || context.view} (Route: \${context.route || '/'})\n\`;
      }
      if (context.details && typeof context.details === 'object') {
        const d = context.details;
        if (d.phase) contextSummary += \`Current Phase: \${d.phase}\\n\`;
        if (d.availableDomains && Array.isArray(d.availableDomains)) {
          contextSummary += \`Available Tech Domains: \${d.availableDomains.join(', ')}\\n\`;
        }
        if (d.currentlySelectedDomain) {
          contextSummary += \`User Highlighted/Selected Domain: \${d.currentlySelectedDomain}\\n\`;
        }
        if (d.selectedProficiencyLevel) contextSummary += \`User-Selected Baseline Level: \${d.selectedProficiencyLevel}\\n\`;
        if (d.availableProficiencyLevels && Array.isArray(d.availableProficiencyLevels)) {
          contextSummary += \`Available Proficiency Levels:\\n\${d.availableProficiencyLevels.map(l => \`  - \${l}\`).join('\\n')}\\n\`;
        }
        if (d.syllabusTopics && Array.isArray(d.syllabusTopics) && d.syllabusTopics.length > 0) {
          contextSummary += \`Visible Roadmap Syllabus Topics for \${d.selectedProficiencyLevel || activeLevel} (\${d.syllabusTopicCount || d.syllabusTopics.length} topics):\\n\${d.syllabusTopics.map(t => \`  • \${t}\`).join('\\n')}\\n\`;
        }
        if (d.phaseTitle) contextSummary += \`Roadmap Phase: \${d.phaseTitle}\\n\`;
        if (d.focusTopic) contextSummary += \`Today's Focus Topic: \${d.focusTopic}\\n\`;
        if (d.tasks && Array.isArray(d.tasks) && d.tasks.length > 0) {
          contextSummary += \`Today's Tasks: \${d.tasks.slice(0, 4).join(', ')}\\n\`;
        }
        if (d.question) contextSummary += \`Current Interview Question: "\${d.question}"\\n\`;
        if (d.internshipCount !== undefined) contextSummary += \`Available Internships: \${d.internshipCount} openings found\\n\`;
        if (d.applicationsTotal !== undefined) contextSummary += \`Tracked Applications: \${d.applicationsTotal} submitted (\${d.applicationsApplied || 0} applied, \${d.applicationsAssessments || 0} assessments, \${d.applicationsInterviews || 0} interviews)\\n\`;
        if (d.analytics) contextSummary += \`Student Analytics: Level \${d.analytics.level || 1}, Streak \${d.analytics.streak || 0} days, XP \${d.analytics.xp || 0}\\n\`;
      }

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return sendJSON(res, 500, {
          success: false,
          error: 'Groq API key is not configured on the server.',
          reply: 'I am currently offline because the AI service is not configured. Please check back soon.'
        });
      }

      const client = new Groq({ apiKey });
      const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

      const isDetailRequested = /\\b(more detail|detailed|explain more|deep dive|in-depth|tutorial|step-by-step guide|elaborate|expand|thoroughly)\\b/i.test(sanitizedMessage);

      const systemPrompt = \`You are "Placify AI Assistant", a friendly, helpful, encouraging companion for computer science and engineering students preparing for technical placements, coding assessments, and modern tech careers.

CURRENT PAGE & STUDENT CONTEXT:
\${contextSummary}

STYLE & CONCISENESS RULES:
1. Tone: Friendly, natural, conversational, and direct. Use simple English that students can easily understand.
2. Direct Answers: Answer the user's exact question immediately. Do NOT include greetings ("Hello!", "Hi there!"), robotic preambles ("That's a great question!", "As an AI mentor..."), unnecessary summaries, or repetitive closing filler ("Hope this helps! Feel free to ask if you have any questions!").
3. Normal Question Length: Keep normal answers concise (strictly 1 to 4 short sentences).
4. Avoid Over-Explaining: Do NOT explain every related concept unless the user explicitly asks for details.
5. Bullet Points: Use short bullet points only when they make the answer genuinely easier to understand (max 3-4 items).
6. Step-by-Step Instructions: Give step-by-step instructions only when the user asks how to do something.
7. Code Questions: Provide only the relevant concise code snippet and a brief 1-2 sentence explanation rather than a long tutorial.
8. Page Context: For questions about the page, roadmap, tasks, or features, answer directly using the CURRENT PAGE & STUDENT CONTEXT provided above.
9. Missing Information: Ask at most one short clarifying question when essential information is missing.
10. Detail Expansion: If the user explicitly asks for more detail, a deeper explanation, or a tutorial, expand appropriately with clear, structured sections.

FEW-SHOT EXAMPLES:
User: What is my roadmap?
Assistant: Your roadmap is your personalized learning plan. Follow its phases in order to build your skills. Open a phase to see its topics and tasks.

User: How do I complete today's task?
Assistant: Open Daily Hub, study the assigned resources, and finish the task. Then click the existing task-completion button to update your progress.

User: What is React?
Assistant: React is a JavaScript library for building user interfaces using reusable components. It helps you create interactive web applications.\`;

      // Limit history to the last 6 messages
      const recentHistory = history.slice(-6).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content || '').slice(0, 1000)
      }));

      const messages = [
        { role: 'system', content: systemPrompt },
        ...recentHistory,
        { role: 'user', content: sanitizedMessage }
      ];

      const completion = await callGroqWithFallback(client, {
        model,
        messages,
        temperature: 0.5,
        max_tokens: isDetailRequested ? 800 : 350
      });

      let reply = completion.choices[0]?.message?.content || "I'm here to help with your placement preparation. What would you like to explore next?";
      reply = reply.trim();

      return sendJSON(res, 200, {
        success: true,
        reply,
        pageContext: {
          view: context.view || 'general',
          domain: activeDomain
        },
        sessionId: sessionId || null
      });`;

['server.js', 'backend/server.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  const startMarker = 'const rawMessage = (body.message || \'\').trim();';
  const endMarker = 'return sendJSON(res, 200, {';

  const startIndex = content.indexOf(startMarker);
  const endSubIndex = content.indexOf(endMarker, startIndex);
  if (startIndex === -1 || endSubIndex === -1) {
    console.error('Markers not found in', filePath);
    return;
  }

  const closeJsonIndex = content.indexOf('});', endSubIndex);
  const replaceEndIndex = closeJsonIndex + 3;

  const before = content.slice(0, startIndex);
  const after = content.slice(replaceEndIndex);

  const formattedReplacement = isCrlf ? updatedChatHandler.replace(/\r?\n/g, '\r\n') : updatedChatHandler.replace(/\r\n/g, '\n');
  const newContent = before + formattedReplacement + after;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Successfully updated', filePath);
});
