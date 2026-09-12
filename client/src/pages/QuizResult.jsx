import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check, X, Clock, Trophy, RotateCcw, LayoutDashboard, BrainCircuit } from 'lucide-react';



const API_URL = import.meta.env.VITE_API_URL || 'https://quiznova-ai-5ynt.onrender.com/api';

const QuizResult = () => {
  const { id } = useParams(); // id of the attempt
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`${API_URL}/attempts/${id}`);
        setAttempt(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center">Calculating results...</div>;
  if (!attempt) return <div className="text-center p-8">Result not found</div>;

  const getMessage = (percent) => {
    if (percent >= 90) return { text: "Excellent! You're a master of this topic! 🏆", color: "text-yellow-500" };
    if (percent >= 70) return { text: "Great job! Keep improving! 🚀", color: "text-teal-500" };
    if (percent >= 50) return { text: "Good attempt! Keep practicing.", color: "text-blue-500" };
    return { text: "Needs improvement. Review the answers below.", color: "text-red-500" };
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const message = getMessage(attempt.percentage);
  const totalQuestions = attempt.correctAnswers + attempt.incorrectAnswers + attempt.unanswered;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-4">Quiz Completed! 🎉</h1>
        <p className={`text-xl font-medium ${message.color}`}>{message.text}</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Circular Score */}
        <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center shadow-lg md:col-span-1">
          <div className="relative w-40 h-40">
            {/* SVG Circle for progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="8" />
              <motion.circle 
                initial={{ strokeDasharray: "0, 300" }}
                animate={{ strokeDasharray: `${(attempt.percentage / 100) * 283}, 300` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
                className={attempt.percentage >= 70 ? 'text-teal-500' : attempt.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'} 
                strokeWidth="8" strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold">{attempt.percentage}%</span>
              <span className="text-slate-500 font-medium">{attempt.score} / {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="glass p-6 rounded-3xl shadow-lg md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl flex flex-col justify-center items-center border border-teal-100 dark:border-teal-900/50">
            <span className="text-teal-500 font-semibold mb-1 flex items-center"><Check className="w-4 h-4 mr-1"/> Correct</span>
            <span className="text-3xl font-bold">{attempt.correctAnswers}</span>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl flex flex-col justify-center items-center border border-red-100 dark:border-red-900/50">
            <span className="text-red-500 font-semibold mb-1 flex items-center"><X className="w-4 h-4 mr-1"/> Incorrect</span>
            <span className="text-3xl font-bold">{attempt.incorrectAnswers}</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl flex flex-col justify-center items-center">
            <span className="text-slate-500 font-semibold mb-1">Unanswered</span>
            <span className="text-3xl font-bold">{attempt.unanswered}</span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex flex-col justify-center items-center border border-blue-100 dark:border-blue-900/50">
            <span className="text-blue-500 font-semibold mb-1 flex items-center"><Clock className="w-4 h-4 mr-1"/> Time Taken</span>
            <span className="text-2xl font-bold">{formatTime(attempt.timeTaken)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4 py-4">
        <Link to={`/create-quiz?topic=${attempt.topic}`} className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-medium flex items-center hover:shadow-lg transition-all">
          <RotateCcw className="w-5 h-5 mr-2" /> Take Another Quiz
        </Link>
        <Link to="/history" className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium flex items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
          <LayoutDashboard className="w-5 h-5 mr-2 text-slate-500" /> View History
        </Link>
      </div>

      {/* Detailed Review */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center"><BrainCircuit className="w-6 h-6 mr-2 text-blue-500"/> Answer Review</h2>
        <div className="space-y-6">
          {attempt.quizId.questions.map((q, idx) => {
            const userAnswer = attempt.answers[idx];
            const isUnanswered = userAnswer.selectedOption === null;
            
            return (
              <div key={idx} className="glass p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold pr-4">{idx + 1}. {q.question}</h3>
                  {userAnswer.isCorrect ? (
                    <span className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-bold shrink-0 flex items-center">
                      <Check className="w-4 h-4 mr-1"/> Correct
                    </span>
                  ) : isUnanswered ? (
                    <span className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-bold shrink-0">
                      Unanswered
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 px-3 py-1 rounded-full text-sm font-bold shrink-0 flex items-center">
                      <X className="w-4 h-4 mr-1"/> Incorrect
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  {q.options.map((opt, i) => {
                    const isUserChoice = userAnswer.selectedOption === i;
                    const isActualCorrect = q.correctAnswer === i;
                    
                    let bgClass = "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700";
                    if (isActualCorrect) bgClass = "bg-teal-50 dark:bg-teal-900/20 border-teal-500 text-teal-800 dark:text-teal-200";
                    else if (isUserChoice && !isActualCorrect) bgClass = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200";

                    return (
                      <div key={i} className={`p-4 rounded-xl border ${bgClass} flex items-center justify-between`}>
                        <span>{opt}</span>
                        {isUserChoice && <span className="text-xs font-bold uppercase tracking-wider opacity-70">Your Answer</span>}
                        {isActualCorrect && !isUserChoice && <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Correct Answer</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 rounded-r-xl">
                  <p className="text-sm text-blue-900 dark:text-blue-100"><span className="font-bold">Explanation:</span> {q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
