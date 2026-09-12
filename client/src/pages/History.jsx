import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, BrainCircuit, Target, Clock, ArrowRight } from 'lucide-react';



const API_URL = import.meta.env.VITE_API_URL || 'https://quiznova-ai-5ynt.onrender.com/api';

const History = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/analytics/attempts`);
        setAttempts(res.data);
      } catch (err) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading history...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Quiz History</h1>
        <p className="text-slate-500 dark:text-slate-400">Review your past performance and track your progress over time.</p>
      </div>

      {attempts.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl flex flex-col items-center">
          <BrainCircuit className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold mb-2">No quizzes taken yet</h3>
          <p className="text-slate-500 mb-6">Start your learning journey by generating your first AI quiz.</p>
          <Link to="/create-quiz" className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors">
            Generate Quiz
          </Link>
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-5 font-semibold text-slate-600 dark:text-slate-300">Topic</th>
                  <th className="p-5 font-semibold text-slate-600 dark:text-slate-300">Difficulty</th>
                  <th className="p-5 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="p-5 font-semibold text-slate-600 dark:text-slate-300">Score</th>
                  <th className="p-5 font-semibold text-slate-600 dark:text-slate-300">Time</th>
                  <th className="p-5 font-semibold text-slate-600 dark:text-slate-300 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-5">
                      <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center">
                        {attempt.topic}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        attempt.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                        attempt.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                      }`}>
                        {attempt.difficulty}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 dark:text-slate-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(attempt.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center">
                        <Target className={`w-4 h-4 mr-2 ${attempt.percentage >= 70 ? 'text-teal-500' : 'text-slate-400'}`} />
                        <span className="font-bold">{attempt.percentage}%</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <Link 
                        to={`/result/${attempt._id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        View <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
