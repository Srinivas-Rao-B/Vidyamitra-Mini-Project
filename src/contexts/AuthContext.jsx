import React, { createContext, useState, useEffect } from 'react';
// Make sure this path is correct for your project
import { login as apiLogin, logout as apiLogout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session only if valid data is present
    try {
      const savedUser = localStorage.getItem('vidyamitra_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.role && parsedUser?.id) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('vidyamitra_user');
        }
      }
    } catch (err) {
      console.error('Failed to restore user from storage:', err);
      localStorage.removeItem('vidyamitra_user');
    }
    setLoading(false);
  }, []);

  // --- THIS IS THE NEW, CORRECTED LOGIN FUNCTION ---
  const login = async (username, password) => {
    try {
      // apiLogin returns the full response: { user: {...}, token: "..." }
      const apiResponse = await apiLogin(username, password);

      // We must check for apiResponse AND apiResponse.user
      if (apiResponse && apiResponse.user) {
        const userObject = apiResponse.user; // <-- This is the fix
        
        setUser(userObject);
        localStorage.setItem('vidyamitra_user', JSON.stringify(userObject));
        
        // Return *only* the user object to the Login page
        return userObject; 
      }
      return null;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };
  // --------------------------------------------------

  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem('vidyamitra_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};