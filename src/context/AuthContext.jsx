import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('carepulse_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData) => {
    const userObj = { name: userData.name || userData.email.split('@')[0], email: userData.email };
    localStorage.setItem('carepulse_user', JSON.stringify(userObj));
    setUser(userObj);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('carepulse_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
