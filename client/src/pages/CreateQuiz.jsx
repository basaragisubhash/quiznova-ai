import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Loader2 } from 'lucide-react';



const API_URL = import.meta.env.VITE_API_URL || 'https://quiznova-ai-5ynt.onrender.com/api';

const CreateQuiz = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTopic = searchParams.get('topic') || '';

  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(10);
  const [timer, setTimer] = useState(10); // minutes
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return setError('Please enter a topic');
    
    setIsGenerating(true);
    setError('');
    
    try {
      const res = await axios.post(`${API_URL}/quiz/generate`, {
        topic,
        difficulty,
        numberOfQuestions: numQuestions
      });
      // Pass the timer along with navigation state so the quiz interface knows the limit
      navigate(`/quiz/${res.data._id}`, { state: { timeLimitMinutes: timer } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quiz. Please try again.');
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 mb-8 bg-gradient-to-tr from-teal-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-teal-500/50"
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-4">Gemini AI is creating your quiz...</h2>
        <div className="space-y-3 text-slate-500 dark:text-slate-400">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" /> <span>Understanding "{topic}"</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" /> <span>Formulating {difficulty} questions</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }} className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" /> <span>Finalizing quiz structure</span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">What do you want to learn today?</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Configure your AI-generated quiz.</p>
      </div>

      <div className="glass p-8 rounded-3xl shadow-xl">
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error}</div>}
        
        <form onSubmit={handleGenerate} className="space-y-8">
          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Topic</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., JavaScript, World War II, Quantum Physics..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all text-lg dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Questions */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-5 py-4 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            {/* Timer */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Timer</label>
              <select
                value={timer}
                onChange={(e) => setTimer(Number(e.target.value))}
                className="w-full px-5 py-4 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 text-white py-4 rounded-2xl font-bold text-xl hover:shadow-xl hover:shadow-teal-500/40 transition-all flex justify-center items-center group"
          >
            <Sparkles className="mr-3 w-6 h-6 group-hover:animate-pulse" />
            Generate Quiz with Gemini AI
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
