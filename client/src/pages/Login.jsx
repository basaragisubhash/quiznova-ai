import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Brain, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl">
      {/* Left Side: Creative */}
      <div className="w-full md:w-1/2 p-12 bg-gradient-to-br from-teal-500 to-blue-600 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
            <Brain className="w-8 h-8" />
            <span>QuizNova AI</span>
          </Link>
          <div className="mt-20">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Welcome back to <br/> your learning journey.</h2>
            <p className="text-teal-100 text-lg">Continue tracking your progress and challenging your knowledge with AI.</p>
          </div>
        </div>
        <div className="relative z-10 mt-10">
          <div className="flex -space-x-4">
             {/* decorative elements */}
             <div className="w-12 h-12 rounded-full border-2 border-teal-500 bg-white/20 backdrop-blur-md"></div>
             <div className="w-12 h-12 rounded-full border-2 border-teal-500 bg-white/30 backdrop-blur-md"></div>
             <div className="w-12 h-12 rounded-full border-2 border-teal-500 bg-white/40 backdrop-blur-md"></div>
          </div>
          <p className="mt-4 text-sm font-medium">Join 10,000+ students mastering new topics every day.</p>
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm font-semibold tracking-wider text-teal-100">Developed By - Subhash Basaragi</p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-white dark:bg-slate-800">
        <div className="max-w-sm mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Log In</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your credentials to access your account.</p>
          
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-200 dark:border-red-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm text-teal-500 hover:text-teal-600 font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:text-white pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 text-teal-500 border-slate-300 rounded focus:ring-teal-500" />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-600 dark:text-slate-400">Remember me</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-teal-500/30 transition-all flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Log In <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
            Don't have an account? <Link to="/register" className="text-teal-500 font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
