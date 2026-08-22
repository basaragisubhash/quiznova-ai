import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import QuizInterface from './pages/QuizInterface';
import QuizResult from './pages/QuizResult';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className="min-h-screen font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <MainLayout toggleTheme={toggleTheme} darkMode={darkMode} />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/quiz/:id" element={<QuizInterface />} />
            <Route path="/result/:id" element={<QuizResult />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
