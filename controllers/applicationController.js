/**
 * Application Controller - Handles REST endpoints for Application Tracking System (ATS)
 */

const mongoose = require('mongoose');
const Application = require('../models/Application');

/**
 * Robust parameter extractor helper
 */
function getQueryParam(parsedUrl, key) {
  if (!parsedUrl) return null;
  if (parsedUrl.searchParams && typeof parsedUrl.searchParams.get === 'function') {
    return parsedUrl.searchParams.get(key);
  }
  if (parsedUrl.query && typeof parsedUrl.query === 'object') {
    const val = parsedUrl.query[key];
    return Array.isArray(val) ? val[0] : val;
  }
  if (parsedUrl.search) {
    const sp = new URLSearchParams(parsedUrl.search);
    return sp.get(key);
  }
  return null;
}

/**
 * Generate Placify Intelligence Preparation Connection
 */
function buildPrepRecommendations(app) {
  const domain = app.domain || 'fullstack';
  const status = app.status || 'Applied';
  const skills = Array.isArray(app.skills) && app.skills.length > 0 ? app.skills : ['Core Principles', 'Problem Solving'];

  if (status === 'Assessment') {
    return {
      type: 'ASSESSMENT_PREP',
      title: `${app.jobTitle} — Assessment Preparation`,
      subtitle: `Tailored technical revision for ${app.company}`,
      actionPlan: [
        `Revise core technical topics: ${skills.slice(0, 4).join(', ')}`,
        `Practice time-bound NPTEL-style technical MCQs & coding questions`,
        `Review syntax edge cases and memory layouts for ${skills[0] || 'domain concepts'}`,
        `Solve daily practice drills on your Placify Daily Hub`
      ],
      topicsToRevise: skills,
      targetView: 'conceptQuiz',
      ctaLabel: 'Take Technical Assessment'
    };
  } else if (status === 'Interview') {
    return {
      type: 'INTERVIEW_PREP',
      title: `${app.jobTitle} — Interview Preparation`,
      subtitle: `Technical & architectural interview preparation for ${app.company}`,
      actionPlan: [
        `Practice top placement interview questions for ${skills.slice(0, 3).join(', ')}`,
        `Prepare STAR-method responses for past project experience & system design`,
        `Review Data Structures, Algorithms & Domain Fundamentals`,
        `Conduct mock interview practice on Placify`
      ],
      topicsToRevise: skills,
      targetView: 'interviewQuestions',
      ctaLabel: 'Practice Interview Questions'
    };
  } else if (status === 'Offer') {
    return {
      type: 'OFFER_CELEBRATION',
      title: `${app.jobTitle} — Offer Received! 🎉`,
      subtitle: `Congratulations on receiving an offer from ${app.company}!`,
      actionPlan: [
        `Review offer terms, stipend/salary, start date, and location requirements`,
        `Keep sharpening advanced concepts on your Placify roadmap to excel on Day 1`
      ],
      topicsToRevise: skills,
      targetView: 'roadmap',
      ctaLabel: 'Continue Learning Roadmap'
    };
  }

  return {
    type: 'GENERAL_ROADMAP',
    title: `${app.jobTitle} — Skill Roadmap Connection`,
    subtitle: `Stay sharp while your application is under review by ${app.company}`,
    actionPlan: [
      `Maintain daily study hours on your personalized ${domain.toUpperCase()} roadmap`,
      `Complete daily learning modules and task reviews`
    ],
    topicsToRevise: skills,
    targetView: 'roadmap',
    ctaLabel: 'View Placify Roadmap'
  };
}

/**
 * Handler Router for Application API Endpoints
 */
async function handleApplicationRequests(req, res, parsedUrl, sendJSON, readRequestBody) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendJSON(res, 503, {
        success: false,
        error: 'Database is not connected. Please try again.'
      });
    }

    const pathname = parsedUrl.pathname || '';
    const method = req.method.toUpperCase();

    // -----------------------------------------------------------------------
    // 1. POST /api/applications -> Track New Application
    // -----------------------------------------------------------------------
    if (method === 'POST' && pathname === '/api/applications') {
      const payload = await readRequestBody(req);
      const userId = payload.userId || payload.user_id;
      const jobTitle = (payload.jobTitle || payload.title || '').trim();
      const company = (payload.company || '').trim();
      let applicationUrl = (payload.applicationUrl || payload.url || '').trim();

      if (!userId || !jobTitle || !company || !applicationUrl) {
        return sendJSON(res, 400, {
          success: false,
          error: 'userId, jobTitle, company, and applicationUrl are required.'
        });
      }

      // Sanitize URL protocol
      if (applicationUrl.startsWith('http://')) {
        applicationUrl = 'https://' + applicationUrl.substring(7);
      }
      if (!applicationUrl.startsWith('https://')) {
        return sendJSON(res, 400, {
          success: false,
          error: 'Application URL must be a valid secure HTTPS link.'
        });
      }

      const internshipId = payload.internshipId || payload.id || '';

      // Check for duplicate application for this user
      const duplicateQuery = {
        userId,
        $or: [
          ...(internshipId ? [{ internshipId }] : []),
          { applicationUrl },
          { jobTitle: new RegExp(`^${jobTitle.replace(/[-[\]{}()*+?.:\\^$|#\s]/g, '\\$&')}$`, 'i'), company: new RegExp(`^${company.replace(/[-[\]{}()*+?.:\\^$|#\s]/g, '\\$&')}$`, 'i') }
        ]
      };

      const existing = await Application.findOne(duplicateQuery);
      if (existing) {
        return sendJSON(res, 409, {
          success: false,
          duplicate: true,
          existingId: existing._id,
          message: 'This opportunity is already in your applications.',
          application: existing
        });
      }

      const initialStatus = payload.status && ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'].includes(payload.status)
        ? payload.status
        : 'Applied';

      const initialNotes = payload.notes || 'Application created in Placify.';

      const newApp = await Application.create({
        user_id: userId,
        userId: userId,
        internshipId,
        jobTitle,
        company,
        domain: payload.domain || 'fullstack',
        source: payload.source || 'Placify Jobs Partner',
        applicationUrl,
        externalListingUrl: payload.externalListingUrl || applicationUrl,
        trackingUrl: payload.trackingUrl || '', // Only set if explicitly provided
        location: payload.location || 'India',
        workMode: payload.workMode || 'Hybrid',
        stipend: payload.stipend || 'Disclosed on Application',
        skills: Array.isArray(payload.skills) ? payload.skills : [],
        appliedDate: payload.appliedDate ? new Date(payload.appliedDate) : new Date(),
        status: initialStatus,
        statusHistory: [
          {
            status: initialStatus,
            date: new Date(),
            notes: initialNotes
          }
        ],
        notes: initialNotes,
        interviewDetails: payload.interviewDetails || {},
        lastUpdated: new Date()
      });

      console.log(`📌 [ATS] Created application for user ${userId}: ${jobTitle} at ${company} (${initialStatus})`);

      return sendJSON(res, 201, {
        success: true,
        message: 'Application tracked successfully!',
        application: newApp
      });
    }

    // -----------------------------------------------------------------------
    // 2. GET /api/applications -> Get All Applications & Summary for User
    // -----------------------------------------------------------------------
    if (method === 'GET' && pathname === '/api/applications') {
      const userId = getQueryParam(parsedUrl, 'userId') || getQueryParam(parsedUrl, 'user_id');
      const filterStatus = getQueryParam(parsedUrl, 'status');

      if (!userId) {
        return sendJSON(res, 400, {
          success: false,
          error: 'userId parameter is required.'
        });
      }

      const query = { userId };
      if (filterStatus && ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'].includes(filterStatus)) {
        query.status = filterStatus;
      }

      const [allUserApps, filteredApps] = await Promise.all([
        Application.find({ userId }).lean(),
        Application.find(query).sort({ lastUpdated: -1 }).lean()
      ]);

      // Calculate total submitted application count
      const totalSubmitted = allUserApps.length;

      // Compute dynamic status counts
      const statusCounts = {
        Applied: 0,
        Assessment: 0,
        Interview: 0,
        Offer: 0,
        Rejected: 0,
        Withdrawn: 0
      };

      allUserApps.forEach(app => {
        if (statusCounts[app.status] !== undefined) {
          statusCounts[app.status]++;
        } else {
          statusCounts[app.status] = 1;
        }
      });

      // Backward compatible summary object
      const summary = {
        total: totalSubmitted,
        totalSubmitted,
        applied: statusCounts.Applied || 0,
        assessments: statusCounts.Assessment || 0,
        interviews: statusCounts.Interview || 0,
        offers: statusCounts.Offer || 0,
        rejected: statusCounts.Rejected || 0,
        saved: statusCounts.Saved || 0,
        withdrawn: statusCounts.Withdrawn || 0
      };

      // Add follow-up reminder flags (applied > 7 days ago without status update)
      const now = new Date();
      const SevenDaysMs = 7 * 24 * 60 * 60 * 1000;

      const formattedApps = filteredApps.map(app => {
        const timeSinceApplied = now - new Date(app.appliedDate || app.createdAt);
        const needsFollowUp = app.status === 'Applied' && timeSinceApplied > SevenDaysMs;

        return {
          ...app,
          needsFollowUp,
          reminderMessage: needsFollowUp ? "You haven't updated the application status yet." : null
        };
      });

      return sendJSON(res, 200, {
        success: true,
        totalSubmitted,
        statusCounts,
        summary,
        total: formattedApps.length,
        applications: formattedApps
      });
    }

    // -----------------------------------------------------------------------
    // 3. GET /api/applications/:id -> Get Single Application Detail & Prep
    // -----------------------------------------------------------------------
    if (method === 'GET' && pathname.startsWith('/api/applications/')) {
      const id = pathname.replace('/api/applications/', '').trim();
      const userId = getQueryParam(parsedUrl, 'userId') || getQueryParam(parsedUrl, 'user_id');

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return sendJSON(res, 400, { success: false, error: 'Invalid application ID.' });
      }

      const app = await Application.findById(id).lean();
      if (!app) {
        return sendJSON(res, 404, { success: false, error: 'Application record not found.' });
      }

      if (userId && app.userId !== userId) {
        return sendJSON(res, 403, { success: false, error: 'Unauthorized access to this application record.' });
      }

      const preparationRecommendations = buildPrepRecommendations(app);

      return sendJSON(res, 200, {
        success: true,
        application: app,
        preparationRecommendations
      });
    }

    // -----------------------------------------------------------------------
    // 4. PATCH /api/applications/:id/status -> Update Status & Status History
    // -----------------------------------------------------------------------
    if (method === 'PATCH' && pathname.endsWith('/status')) {
      const parts = pathname.split('/');
      const id = parts[parts.length - 2];
      const payload = await readRequestBody(req);
      const userId = payload.userId || payload.user_id;
      const newStatus = payload.status;
      const notes = payload.notes || '';

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return sendJSON(res, 400, { success: false, error: 'Invalid application ID.' });
      }

      if (!userId || !newStatus) {
        return sendJSON(res, 400, { success: false, error: 'userId and status are required.' });
      }

      if (!['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'].includes(newStatus)) {
        return sendJSON(res, 400, { success: false, error: 'Invalid status value.' });
      }

      const app = await Application.findById(id);
      if (!app) {
        return sendJSON(res, 404, { success: false, error: 'Application record not found.' });
      }

      if (app.userId !== userId) {
        return sendJSON(res, 403, { success: false, error: 'Unauthorized access to this application.' });
      }

      // Update current status & append to timeline history
      app.status = newStatus;
      app.lastUpdated = new Date();

      const historyNote = notes ? notes : `Status updated to ${newStatus}`;
      app.statusHistory.push({
        status: newStatus,
        date: new Date(),
        notes: historyNote
      });

      if (notes) {
        app.notes = notes;
      }

      if (payload.interviewDetails) {
        app.interviewDetails = {
          ...app.interviewDetails,
          ...payload.interviewDetails
        };
      }

      await app.save();

      console.log(`🔄 [ATS] Updated status for app ${id} to ${newStatus}`);

      const prep = buildPrepRecommendations(app.toObject ? app.toObject() : app);

      return sendJSON(res, 200, {
        success: true,
        message: `Application status updated to ${newStatus}`,
        application: app,
        preparationRecommendations: prep
      });
    }

    // -----------------------------------------------------------------------
    // 5. PATCH /api/applications/:id -> Update Notes / Interview Details
    // -----------------------------------------------------------------------
    if (method === 'PATCH' && pathname.startsWith('/api/applications/')) {
      const id = pathname.replace('/api/applications/', '').trim();
      const payload = await readRequestBody(req);
      const userId = payload.userId || payload.user_id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return sendJSON(res, 400, { success: false, error: 'Invalid application ID.' });
      }

      const app = await Application.findById(id);
      if (!app) {
        return sendJSON(res, 404, { success: false, error: 'Application record not found.' });
      }

      if (app.userId !== userId) {
        return sendJSON(res, 403, { success: false, error: 'Unauthorized access to this application.' });
      }

      if (payload.notes !== undefined) app.notes = payload.notes;
      if (payload.location) app.location = payload.location;
      if (payload.workMode) app.workMode = payload.workMode;
      if (payload.stipend) app.stipend = payload.stipend;

      if (payload.interviewDetails) {
        app.interviewDetails = {
          date: payload.interviewDetails.date || app.interviewDetails?.date || '',
          time: payload.interviewDetails.time || app.interviewDetails?.time || '',
          round: payload.interviewDetails.round || app.interviewDetails?.round || '',
          type: payload.interviewDetails.type || app.interviewDetails?.type || 'Online',
          notes: payload.interviewDetails.notes || app.interviewDetails?.notes || ''
        };
      }

      app.lastUpdated = new Date();
      await app.save();

      return sendJSON(res, 200, {
        success: true,
        message: 'Application details updated.',
        application: app
      });
    }

    // -----------------------------------------------------------------------
    // 6. DELETE /api/applications/:id -> Delete Application Record
    // -----------------------------------------------------------------------
    if (method === 'DELETE' && pathname.startsWith('/api/applications/')) {
      const id = pathname.replace('/api/applications/', '').trim();
      const payload = await readRequestBody(req).catch(() => ({}));
      const userId = payload.userId || payload.user_id || getQueryParam(parsedUrl, 'userId') || getQueryParam(parsedUrl, 'user_id');

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return sendJSON(res, 400, { success: false, error: 'Invalid application ID.' });
      }

      const app = await Application.findById(id);
      if (!app) {
        return sendJSON(res, 404, { success: false, error: 'Application record not found.' });
      }

      if (userId && app.userId !== userId) {
        return sendJSON(res, 403, { success: false, error: 'Unauthorized access to delete this application.' });
      }

      await Application.findByIdAndDelete(id);

      return sendJSON(res, 200, {
        success: true,
        message: 'Application tracking record deleted successfully.'
      });
    }

    return sendJSON(res, 404, { success: false, error: 'Application API endpoint not found.' });

  } catch (err) {
    console.error('❌ [ApplicationController] Error:', err);
    return sendJSON(res, 500, {
      success: false,
      error: 'Application tracking operation failed: ' + err.message
    });
  }
}

module.exports = {
  handleApplicationRequests
};
