const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
