import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProfile, login as loginRequest, logout as logoutRequest } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const refreshProfile = useCallback(async () => {
    setIsAuthLoading(true);
    setAuthError('');

    try {
      const response = await getProfile();

      if (!response.ok || response.status === 401) {
        setUser(null);
        return response;
      }

      setUser(response.data?.data?.user || null);
      return response;
    } catch (error) {
      setAuthError('Unable to load profile.');
      setUser(null);
      return {
        ok: false,
        status: 500,
        data: {},
      };
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const signIn = async (credentials) => {
    const response = await loginRequest(credentials);
    if (response.ok) {
      await refreshProfile();
    }
    return response;
  };

  const signOut = async () => {
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        authError,
        refreshProfile,
        signIn,
        signOut,
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
