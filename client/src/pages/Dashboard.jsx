import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Trophy, Target, Flame, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';



const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_URL}/analytics`);
        setAnalytics(res.data);
      } catch (error) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const popularTopics = ['JavaScript', 'Python', 'Machine Learning', 'Data Structures', 'React'];

  if (loading) {
    return <div className="flex h-64 items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's an overview of your learning journey.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Quizzes', value: analytics?.totalQuizzes || 0, icon: BrainCircuit, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Average Score', value: `${analytics?.averageScore || 0}%`, icon: Target, color: 'text-teal-500', bg: 'bg-teal-500/10' },
          { title: 'Best Score', value: `${analytics?.highestScore || 0}%`, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { title: 'Current Streak', value: `${analytics?.currentStreak || 0} Days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl flex items-center space-x-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Quick Start */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Quick Start</h2>
            <Link to="/create-quiz" className="text-sm font-medium text-teal-500 hover:text-teal-600">Custom Topic &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {popularTopics.map((topic, i) => (
              <Link 
                key={i} 
                to={`/create-quiz?topic=${topic}`}
                className="group relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 relative z-10">{topic}</h3>
                <div className="mt-4 flex items-center text-teal-500 text-sm font-medium relative z-10">
                  <PlayCircle className="w-4 h-4 mr-1" /> Start Quiz
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass p-6 rounded-3xl">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <BrainCircuit className="w-5 h-5 mr-2 text-teal-500" /> AI Insights
          </h2>
          {analytics?.weakTopics?.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Based on your recent performance, we recommend focusing on these topics:</p>
              {analytics.weakTopics.slice(0, 3).map((topic, i) => (
                <div key={i} className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">{topic.topic}</h4>
                    <p className="text-xs text-red-500 font-medium">Avg Score: {topic.averageScore}%</p>
                  </div>
                  <Link to={`/create-quiz?topic=${topic.topic}`} className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">Take more quizzes to get personalized AI recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
