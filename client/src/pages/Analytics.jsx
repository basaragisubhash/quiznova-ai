import { useState, useEffect } from 'react';
import axios from 'axios';
import { 


  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Target, BookOpen } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_URL}/analytics`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading analytics...</div>;

  if (!data || data.totalQuizzes === 0) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-[70vh]">
        <TrendingUp className="w-20 h-20 text-slate-300 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Not Enough Data</h2>
        <p className="text-slate-500 text-lg text-center max-w-lg">Complete some quizzes to generate your personalized performance analytics and charts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Deep dive into your learning metrics.</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Line Chart: Score Trend */}
        <div className="glass p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-teal-500"/> Score Trend</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={4} dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Topic Performance */}
        <div className="glass p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center"><BookOpen className="w-5 h-5 mr-2 text-blue-500"/> Topic Mastery</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topicPerformance.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="topic" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="averageScore" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-3xl border-t-4 border-t-teal-500">
          <h3 className="text-lg font-bold mb-4 flex items-center text-teal-600 dark:text-teal-400">
            <Target className="w-5 h-5 mr-2"/> Strong Areas (&gt;70%)
          </h3>
          <ul className="space-y-3">
            {data.strongTopics.length > 0 ? data.strongTopics.map((t, i) => (
              <li key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl">
                <span className="font-medium">{t.topic}</span>
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-bold">{t.averageScore}%</span>
              </li>
            )) : <li className="text-slate-500">No strong areas yet. Keep learning!</li>}
          </ul>
        </div>

        <div className="glass p-6 rounded-3xl border-t-4 border-t-red-500">
          <h3 className="text-lg font-bold mb-4 flex items-center text-red-600 dark:text-red-400">
            <Target className="w-5 h-5 mr-2"/> Areas for Improvement (&lt;70%)
          </h3>
          <ul className="space-y-3">
            {data.weakTopics.length > 0 ? data.weakTopics.map((t, i) => (
              <li key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl">
                <span className="font-medium">{t.topic}</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">{t.averageScore}%</span>
              </li>
            )) : <li className="text-slate-500">Excellent! You don't have any weak areas right now.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
