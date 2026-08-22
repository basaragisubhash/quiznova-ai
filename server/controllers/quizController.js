const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Generate Quiz via Gemini
const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, numberOfQuestions } = req.body;
    
    if (!topic || !difficulty || !numberOfQuestions) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `Generate a multiple choice quiz about "${topic}".
Difficulty level: ${difficulty}.
Number of questions: ${numberOfQuestions}.

The response MUST be a valid JSON object EXACTLY matching this structure, and NOTHING else. Do not include markdown formatting like \`\`\`json.
{
  "title": "${topic} Quiz",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question": "Question text here?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0, // Integer index of the correct option (0-3)
      "explanation": "Short explanation of the correct answer."
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown formatting if Gemini included it despite the prompt
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedQuiz = JSON.parse(text);
    
    // Validate parsed quiz
    if (!parsedQuiz.questions || parsedQuiz.questions.length !== parseInt(numberOfQuestions)) {
        return res.status(500).json({ message: 'AI returned an invalid number of questions' });
    }

    // Save generated quiz to database
    const newQuiz = await Quiz.create({
      title: parsedQuiz.title || `${topic} Quiz`,
      topic: parsedQuiz.topic || topic,
      difficulty: parsedQuiz.difficulty || difficulty,
      questions: parsedQuiz.questions,
      createdBy: req.user._id
    });

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: 'AI quiz generation is temporarily unavailable. Please try again.' });
  }
};

// Get Quiz by ID
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Quiz Attempt
const submitQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const { answers, timeTaken } = req.body; // answers is an array of selected option indices or null
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;
    const evaluatedAnswers = [];

    quiz.questions.forEach((q, index) => {
      const selectedOption = answers[index];
      let isCorrect = false;

      if (selectedOption === null || selectedOption === undefined) {
        unanswered++;
      } else if (selectedOption === q.correctAnswer) {
        correctAnswers++;
        isCorrect = true;
      } else {
        incorrectAnswers++;
      }

      evaluatedAnswers.push({
        questionIndex: index,
        selectedOption,
        isCorrect
      });
    });

    const totalQuestions = quiz.questions.length;
    const score = correctAnswers;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      quizId: quiz._id,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      score,
      percentage,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      timeTaken,
      answers: evaluatedAnswers
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQuiz, getQuiz, submitQuiz };
