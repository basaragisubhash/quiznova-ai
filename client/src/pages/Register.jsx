import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Brain, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setErrorMsg("Passwords do not match");
    }
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row-reverse w-full max-w-5xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl">
      {/* Right Side: Creative (Now on left visually via row-reverse) */}
      <div className="w-full md:w-1/2 p-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
            <Brain className="w-8 h-8" />
            <span>QuizNova AI</span>
          </Link>
          <div className="mt-20">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Start mastering <br/> any subject.</h2>
            <p className="text-indigo-100 text-lg">Generate endless AI quizzes tailored exactly to what you want to learn.</p>
          </div>
          <div className="mt-12 pt-6 border-t border-white/20">
            <p className="text-sm font-semibold tracking-wider text-indigo-100">Developed By - Subhash Basaragi</p>
          </div>
        </div>
      </div>

      {/* Left Side: Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-white dark:bg-slate-800">
        <div className="max-w-sm mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Join us to start your AI learning journey.</p>
          
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-200 dark:border-red-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex justify-center items-center mt-6"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Sign Up <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
            Already have an account? <Link to="/login" className="text-blue-500 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
