const QuizAttempt = require('../models/QuizAttempt');

// Get all attempts for a user
const getAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id })
      .populate('quizId', 'title')
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single attempt by ID
const getAttemptById = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id).populate('quizId');
    if (!attempt || attempt.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Attempt not found or unauthorized' });
    }
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Analytics data
const getAnalytics = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id }).sort({ createdAt: 1 });
    
    if (attempts.length === 0) {
      return res.json({
        totalQuizzes: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalQuestions: 0,
        currentStreak: 0,
        scoreTrend: [],
        topicPerformance: [],
        strongTopics: [],
        weakTopics: []
      });
    }

    const totalQuizzes = attempts.length;
    let totalScorePercent = 0;
    let highestScore = 0;
    let lowestScore = 100;
    let totalQuestions = 0;

    const topicStats = {};
    const scoreTrend = [];

    // Calculate basic stats and group by topic
    attempts.forEach(attempt => {
      totalScorePercent += attempt.percentage;
      totalQuestions += (attempt.correctAnswers + attempt.incorrectAnswers + attempt.unanswered);
      
      if (attempt.percentage > highestScore) highestScore = attempt.percentage;
      if (attempt.percentage < lowestScore) lowestScore = attempt.percentage;

      // Trend data (e.g. format date mm/dd)
      const dateStr = new Date(attempt.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      scoreTrend.push({
        date: dateStr,
        score: attempt.percentage,
        topic: attempt.topic
      });

      // Topic data
      if (!topicStats[attempt.topic]) {
        topicStats[attempt.topic] = { totalPercentage: 0, count: 0 };
      }
      topicStats[attempt.topic].totalPercentage += attempt.percentage;
      topicStats[attempt.topic].count++;
    });

    const averageScore = Math.round(totalScorePercent / totalQuizzes);

    // Format topic performance for charts
    const topicPerformance = Object.keys(topicStats).map(topic => {
      const avg = Math.round(topicStats[topic].totalPercentage / topicStats[topic].count);
      return { topic, averageScore: avg };
    }).sort((a, b) => b.averageScore - a.averageScore); // Sort high to low

    const strongTopics = topicPerformance.filter(t => t.averageScore >= 70);
    const weakTopics = topicPerformance.filter(t => t.averageScore < 70);

    // Calculate streak (consecutive days of taking quizzes)
    let currentStreak = 0;
    if (attempts.length > 0) {
      currentStreak = 1; // Simplistic streak calculation for demo purposes
      let lastDate = new Date(attempts[attempts.length - 1].createdAt).toDateString();
      for (let i = attempts.length - 2; i >= 0; i--) {
        const d = new Date(attempts[i].createdAt).toDateString();
        // Check if d is exactly 1 day before lastDate
        const expectedPrev = new Date(new Date(lastDate).getTime() - 86400000).toDateString();
        if (d === expectedPrev) {
          currentStreak++;
          lastDate = d;
        } else if (d === lastDate) {
          // Same day, streak continues
        } else {
          break; // Streak broken
        }
      }
    }

    res.json({
      totalQuizzes,
      averageScore,
      highestScore,
      lowestScore,
      totalQuestions,
      currentStreak,
      scoreTrend,
      topicPerformance,
      strongTopics,
      weakTopics
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAttempts, getAttemptById, getAnalytics };
