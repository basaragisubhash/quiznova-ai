import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Mail, Calendar, Shield, Loader2, Save } from 'lucide-react';



const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user, login } = useAuth(); // Assuming login updates the user state if we re-fetch, or we can just update local context
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
    
    // Fetch quick stats for profile
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/analytics`);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const data = { name };
      if (password) data.password = password;
      
      const res = await axios.put(`${API_URL}/auth/profile`, data);
      
      // Update local storage and context manually since our login function might just be for logging in
      localStorage.setItem('user', JSON.stringify(res.data));
      // In a real app we'd dispatch an update to AuthContext here, but for now a reload works or we can just rely on state
      window.location.reload(); 
      
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to update profile', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg shadow-teal-500/30">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{user?.email}</p>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 flex flex-col space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center"><Shield className="w-4 h-4 mr-2"/> Role</span>
                <span className="font-semibold capitalize text-teal-600">{user?.role || 'Student'}</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h4 className="font-bold mb-4 text-slate-700 dark:text-slate-300">Quick Stats</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Quizzes Taken</p>
                <p className="text-xl font-bold">{stats?.totalQuizzes || 0}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Average Score</p>
                <p className="text-xl font-bold">{stats?.averageScore || 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="md:col-span-2 glass p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">Edit Details</h2>
          
          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email (Cannot be changed)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Change Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold bg-teal-500 text-white hover:bg-teal-600 transition-colors flex items-center shadow-lg shadow-teal-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
