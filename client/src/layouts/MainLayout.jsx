import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, History, BarChart2, User, LogOut, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const MainLayout = ({ toggleTheme, darkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Quiz', path: '/create-quiz', icon: PlusCircle },
    { name: 'My History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass flex flex-col justify-between hidden md:flex border-r border-slate-200 dark:border-slate-700 relative z-20">
        <div>
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
              QuizNova AI
            </h1>
          </div>
          <nav className="mt-6 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-teal-500/10 to-blue-500/10 text-teal-600 dark:text-teal-400 font-medium' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-500' : ''}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        {/* Decorative background blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[100px] -z-10 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] -z-10 animate-blob animation-delay-2000"></div>
        
        {/* Mobile Header */}
        <header className="md:hidden glass p-4 flex items-center justify-between sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
            QuizNova AI
          </h1>
          <button onClick={toggleTheme} className="p-2">
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-10 min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Bottom Nav - simplified */}
      <nav className="md:hidden fixed bottom-0 w-full glass border-t border-slate-200 dark:border-slate-700 z-30 flex justify-around p-3">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link key={item.name} to={item.path} className={`p-2 rounded-xl flex flex-col items-center ${isActive ? 'text-teal-500' : 'text-slate-500'}`}>
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MainLayout;
