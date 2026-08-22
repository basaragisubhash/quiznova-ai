import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';



const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const QuizInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const timeLimitMinutes = location.state?.timeLimitMinutes || 10;
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Timer Ref to avoid dependency issues
  const timerRef = useRef(timeLeft);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${API_URL}/quiz/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error("Failed to fetch quiz");
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRef.current > 0) {
        timerRef.current -= 1;
        setTimeLeft(timerRef.current);
      } else {
        clearInterval(interval);
        handleAutoSubmit();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Run once on mount

  const handleAutoSubmit = () => {
    // We cannot wait for state in async closures easily, use ref or current state
    submitQuizData();
  };

  const handleOptionSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const submitQuizData = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formattedAnswers = Array(quiz.questions.length).fill(null);
      Object.keys(answers).forEach(key => {
        formattedAnswers[key] = answers[key];
      });

      const timeTaken = (timeLimitMinutes * 60) - timerRef.current;
      
      const res = await axios.post(`${API_URL}/quiz/${id}/submit`, {
        answers: formattedAnswers,
        timeTaken
      });
      
      navigate(`/result/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (!quiz) return <div className="flex h-screen items-center justify-center">Loading quiz...</div>;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <div className="flex space-x-2 text-sm text-slate-500">
            <span className="capitalize text-teal-500 font-medium">{quiz.difficulty}</span>
            <span>•</span>
            <span>{quiz.topic}</span>
          </div>
        </div>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <div className="text-center">
            <p className="text-sm text-slate-500">Question</p>
            <p className="font-bold text-lg">{currentQuestion + 1} <span className="text-slate-400">/ {quiz.questions.length}</span></p>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-teal-50 text-teal-600 dark:bg-teal-900/30'}`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <motion.div 
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8 md:p-12 rounded-3xl shadow-lg flex-1 mb-8"
      >
        <h3 className="text-2xl font-semibold mb-8 leading-snug">
          {currentQuestion + 1}. {quiz.questions[currentQuestion].question}
        </h3>

        <div className="space-y-4">
          {quiz.questions[currentQuestion].options.map((option, index) => {
            const isSelected = answers[currentQuestion] === index;
            const letters = ['A', 'B', 'C', 'D'];
            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center group ${
                  isSelected 
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 bg-white dark:bg-slate-800'
                }`}
              >
                <span className={`w-10 h-10 flex items-center justify-center rounded-xl mr-4 font-bold text-lg ${
                  isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40'
                }`}>
                  {letters[index]}
                </span>
                <span className="text-lg">{option}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-xl font-medium flex items-center disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Previous
        </button>

        {/* Question Navigator */}
        <div className="flex space-x-2 my-4 md:my-0 overflow-x-auto max-w-xs md:max-w-md">
          {quiz.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm transition-colors ${
                currentQuestion === idx 
                  ? 'bg-blue-500 text-white ring-2 ring-blue-500/50 ring-offset-2 dark:ring-offset-slate-800' 
                  : answers[idx] !== undefined 
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' 
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-6 py-3 rounded-xl font-bold flex items-center bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:shadow-lg hover:shadow-teal-500/30 transition-all"
          >
            Submit Quiz <CheckCircle className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            className="px-6 py-3 rounded-xl font-medium flex items-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-blue-600 dark:text-blue-400"
          >
            Next <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-4">Submit Quiz?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Are you sure you want to submit? You have answered {Object.keys(answers).length} of {quiz.questions.length} questions.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl font-medium bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors"
              >
                Continue Quiz
              </button>
              <button 
                onClick={submitQuizData}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-teal-500 text-white hover:bg-teal-600 transition-colors flex justify-center items-center"
              >
                {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Submit'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QuizInterface;
