import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const togglePassword = () => {
    setShowPassword((value) => !value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const result = await signIn(formData);

      if (!result.ok) {
        throw new Error(result.data.error?.message || 'Sign in failed.');
      }

      setFormStatus({
        type: 'success',
        message: 'Logged in successfully.',
      });

      if (result.data.data?.user?.role === 'donor') {
        navigate(ROUTES.donorDashboard);
      } else if (result.data.data?.user?.role === 'ngo') {
        navigate(ROUTES.ngoDashboard);
      } else if (result.data.data?.user?.role === 'admin') {
        navigate(ROUTES.adminDashboard);
      } else {
        navigate(ROUTES.home);
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Sign in failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    showPassword,
    formStatus,
    isSubmitting,
    updateField,
    togglePassword,
    handleSubmit,
  };
};
