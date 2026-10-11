/**
 * Internship Controller - Handles GET /api/internships endpoint
 */

const mongoose = require('mongoose');
const { getRecommendedInternships } = require('../services/internship/internshipService');

async function handleGetInternships(req, res, parsedUrl, sendJSON) {
  try {
    // Robust parameter extraction supporting URLSearchParams, url.parse query object, or search string
    const getParam = (key) => {
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
    };

    const userId = getParam('userId') || getParam('user_id') || '';
    let domainParam = getParam('domain') || '';
    let skillsParam = getParam('skills') || '';
    const locationParam = getParam('location') || 'India';
    const remoteParam = getParam('remote') === 'true' || getParam('remote') === '1';
    const page = Math.max(1, parseInt(getParam('page'), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(getParam('limit'), 10) || 10));
    const customKeywords = getParam('keywords') || getParam('keyword') || '';

    let userSkills = [];

    // If userId provided and domain/skills not fully passed, auto-retrieve from MongoDB Atlas
    if (userId && mongoose.connection.readyState === 1) {
      try {
        const User = mongoose.model('User');
        const UserSkillProfile = mongoose.models.UserSkillProfile || mongoose.model('UserSkillProfile');

        const [userDoc, skillDoc] = await Promise.all([
          User.findOne({ user_id: userId }).lean().catch(() => null),
          UserSkillProfile.findOne({ user_id: userId }).lean().catch(() => null)
        ]);

        if (userDoc && !domainParam && userDoc.chosen_domain) {
          domainParam = userDoc.chosen_domain;
        }

        if (skillDoc) {
          if (Array.isArray(skillDoc.skills)) {
            userSkills = skillDoc.skills.map(s => s.skillName || s.name || s);
          } else if (Array.isArray(skillDoc.masteredTopics)) {
            userSkills = skillDoc.masteredTopics;
          }
        }
      } catch (dbErr) {
        console.warn('[InternshipController] User profile lookup warning:', dbErr.message);
      }
    }

    // Merge explicitly passed skills string
    if (skillsParam) {
      const splitSkills = skillsParam.split(',').map(s => s.trim()).filter(Boolean);
      userSkills = Array.from(new Set([...userSkills, ...splitSkills]));
    }

    const domain = domainParam || 'fullstack';

    // Call Internship Service to fetch and normalize listings
    const result = await getRecommendedInternships({
      domain,
      skills: userSkills,
      location: locationParam,
      remote: remoteParam,
      page,
      limit,
      customKeywords
    });

    return sendJSON(res, 200, {
      success: true,
      domain: result.domain,
      total: result.total,
      page: result.page,
      limit: result.limit,
      searchKeywords: result.searchKeywords,
      internships: result.internships,
      message: result.message || null
    });
  } catch (err) {
    console.error('❌ [InternshipController] Error fetching internships:', err);
    return sendJSON(res, 500, {
      success: false,
      error: 'Internship opportunities are temporarily unavailable. Please try again later.'
    });
  }
}

module.exports = {
  handleGetInternships
};
