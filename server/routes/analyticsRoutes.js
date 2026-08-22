const express = require('express');
const router = express.Router();
const { getAttempts, getAttemptById, getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/attempts', protect, getAttempts);
router.get('/attempts/:id', protect, getAttemptById);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
