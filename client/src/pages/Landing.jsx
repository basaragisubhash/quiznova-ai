import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, BarChart, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-blob animation-delay-2000"></div>
      
      {/* Navbar */}
      <nav className="relative z-10 glass border-b border-slate-200/50 dark:border-slate-800/50 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
          QuizNova AI
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-teal-500 font-medium transition-colors">Log In</Link>
          <Link to="/register" className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-teal-500/25">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-teal-500"></span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">AI-Powered Education 2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Your AI-Powered <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500">
              Quiz Companion
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate personalized quizzes on any topic, challenge your knowledge, and track your learning journey with advanced AI analytics. Learn. Challenge. Master.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-teal-500/30 transition-all flex items-center justify-center">
              Start Quiz <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-lg text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all">
              Explore Features
            </a>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto px-4">
          {[
            { icon: Brain, title: 'AI Quiz Generation', desc: 'Instantly generate high-quality quizzes on any topic you can imagine.' },
            { icon: Target, title: 'Smart Timer', desc: 'Challenge yourself against the clock to improve recall speed and accuracy.' },
            { icon: BarChart, title: 'Performance Analytics', desc: 'Track your strong and weak areas with detailed visual charts.' },
            { icon: Zap, title: 'AI Recommendations', desc: 'Get smart suggestions on what to study next based on your performance.' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass p-8 rounded-3xl text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 text-center py-8 text-slate-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} QuizNova AI. Learn. Challenge. Master.</p>
      </footer>
    </div>
  );
};

export default Landing;
