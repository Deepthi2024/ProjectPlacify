/**
 * Application Model - MongoDB Schema for Placify Application Tracking System (ATS)
 */

const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
      required: true
    },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  },
  { _id: false }
);

const interviewDetailsSchema = new mongoose.Schema(
  {
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    round: { type: String, default: '' },
    type: { type: String, default: 'Online' },
    notes: { type: String, default: '' }
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    internshipId: { type: String, default: '', index: true },
    jobTitle: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    domain: { type: String, default: 'fullstack' },
    source: { type: String, default: 'Placify Jobs Partner' },
    applicationUrl: { type: String, required: true, trim: true },
    externalListingUrl: { type: String, default: '' },
    trackingUrl: { type: String, default: '' },
    location: { type: String, default: 'India' },
    workMode: { type: String, default: 'Hybrid' },
    stipend: { type: String, default: 'Disclosed on Application' },
    skills: [{ type: String }],
    appliedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
      default: 'Applied',
      index: true
    },
    statusHistory: [statusHistorySchema],
    notes: { type: String, default: '' },
    interviewDetails: { type: interviewDetailsSchema, default: () => ({}) },
    lastUpdated: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

// Compound indexes for user queries and deduplication
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, internshipId: 1 });
applicationSchema.index({ userId: 1, applicationUrl: 1 });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema, 'applications');

module.exports = Application;
