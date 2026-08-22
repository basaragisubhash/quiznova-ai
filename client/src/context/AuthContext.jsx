import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Setup axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(storedUser).token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
