const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },
  unanswered: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  answers: [{
    questionIndex: Number,
    selectedOption: Number, // null if unanswered
    isCorrect: Boolean
  }],
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
module.exports = QuizAttempt;
