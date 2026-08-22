const express = require('express');
const router = express.Router();
const { generateQuiz, getQuiz, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;
