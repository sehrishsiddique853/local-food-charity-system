import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

export const useNgoProfile = ({ redirectTo = ROUTES.login, onProfileLoaded } = {}) => {
  const navigate = useNavigate();
  const { user, isAuthLoading, authError, signOut } = useAuth();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || user.role !== 'ngo') {
        navigate(redirectTo);
      } else {
        onProfileLoaded?.(user);
      }
    }
  }, [isAuthLoading, navigate, onProfileLoaded, redirectTo, user]);

  const handleLogout = async () => {
    await signOut();
    navigate(redirectTo);
  };

  return {
    profile: user,
    isProfileLoading: isAuthLoading,
    profileError: authError,
    handleLogout,
  };
};
