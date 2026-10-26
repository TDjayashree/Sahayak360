const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public & Citizen retrieval
router.get('/', complaintController.getAllComplaints);
router.get('/:id', complaintController.getComplaintByIdOrTracking);

// Create new grievance (authenticated or guest)
router.post('/', authenticate, complaintController.createComplaint);

// File attachments upload
router.post('/upload', upload.array('files', 5), complaintController.uploadFiles);

// Action workflows
router.patch('/:id/status', authenticate, complaintController.updateStatus);
router.patch('/:id/assign', authenticate, complaintController.assignOfficer);
router.post('/:id/feedback', authenticate, complaintController.submitFeedback);
router.patch('/:id/reroute', authenticate, complaintController.rerouteDepartment);

module.exports = router;
