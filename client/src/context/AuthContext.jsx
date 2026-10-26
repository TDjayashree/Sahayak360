import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sahayak_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [demoUsers, setDemoUsers] = useState([]);
  const [citizenDemoUsers, setCitizenDemoUsers] = useState([]);
  const [officialDemoUsers, setOfficialDemoUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load demo users
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.getDemoUsers();
        if (res.success && res.users) {
          setDemoUsers(res.users);
          setCitizenDemoUsers(res.citizens || res.users.filter(u => u.role === 'citizen'));
          setOfficialDemoUsers(res.officials || res.users.filter(u => u.role === 'admin' || u.role === 'department_officer'));

          // Keep user as null if no saved session so the standalone Google-style Login Page displays
          if (!api.activeUser) {
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Failed to load demo users:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const switchDemoUser = (targetUser) => {
    const token = `demo-token-${targetUser.role}-${targetUser.id}`;
    api.setAuth(token, targetUser);
    setUser(targetUser);
  };

  // Dedicated Citizen Login
  const citizenLogin = async (email, password) => {
    const res = await api.citizenLogin(email, password);
    if (res.success) {
      api.setAuth(res.token, res.user);
      setUser(res.user);
      return res.user;
    }
  };

  // Dedicated Citizen Registration
  const citizenRegister = async (userData) => {
    const res = await api.citizenRegister(userData);
    if (res.success) {
      api.setAuth(res.token, res.user);
      setUser(res.user);
      return res.user;
    }
  };

  // Dedicated Admin & Official Personnel Login
  const adminLogin = async (email, password, badgeId) => {
    const res = await api.adminLogin(email, password, badgeId);
    if (res.success) {
      api.setAuth(res.token, res.user);
      setUser(res.user);
      return res.user;
    }
  };

  const logout = () => {
    api.setAuth(null, null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        demoUsers,
        citizenDemoUsers,
        officialDemoUsers,
        loading,
        citizenLogin,
        citizenRegister,
        adminLogin,
        login: citizenLogin,
        register: citizenRegister,
        logout,
        switchDemoUser,
        isCitizen: user?.role === 'citizen',
        isOfficer: user?.role === 'department_officer',
        isAdmin: user?.role === 'admin',
        isOfficial: user?.role === 'admin' || user?.role === 'department_officer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
