import { useState } from 'react';
import { register } from '../services/authService';

const initialRegisterForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
  ngoName: '',
  ngoRegistrationNumber: '',
  ngoDocument: null,
};

const allowedDocumentTypes = ['application/pdf', 'image/jpeg', 'image/png'];
const maxDocumentSize = 5 * 1024 * 1024;

export const useRegisterForm = (defaultRole = 'donor') => {
  const [accountType, setAccountType] = useState(defaultRole);
  const [formData, setFormData] = useState(initialRegisterForm);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const updateDocumentFile = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setFormData((current) => ({
        ...current,
        ngoDocument: null,
      }));
      return;
    }

    if (!allowedDocumentTypes.includes(file.type)) {
      setFormStatus({ type: 'error', message: 'Please upload a PDF, JPG, or PNG document.' });
      event.target.value = '';
      return;
    }

    if (file.size > maxDocumentSize) {
      setFormStatus({ type: 'error', message: 'Document must be 5MB or smaller.' });
      event.target.value = '';
      return;
    }

    setFormData((current) => ({
      ...current,
      ngoDocument: file,
    }));
    setFormStatus({ type: '', message: '' });
  };

  const handleAccountTypeChange = (role) => {
    setAccountType(role);
    setFormStatus({ type: '', message: '' });

    if (role === 'donor') {
      setFormData((current) => ({
        ...current,
        ngoName: '',
        ngoRegistrationNumber: '',
        ngoDocument: null,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });

    if (formData.password !== formData.confirmPassword) {
      setFormStatus({ type: 'error', message: 'Password and confirm password must match.' });
      return;
    }

    if (!acceptedTerms) {
      setFormStatus({ type: 'error', message: 'Please agree to the terms and privacy policy.' });
      return;
    }

    if (accountType === 'ngo' && !formData.ngoDocument) {
      setFormStatus({ type: 'error', message: 'Please upload your NGO verification document.' });
      return;
    }

    const payload = new FormData();
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('phone', formData.phone);
    payload.append('role', accountType);
    payload.append('address', formData.address);

    if (accountType === 'donor') {
      payload.append('name', formData.name);
    }

    if (accountType === 'ngo') {
      payload.append('ngoName', formData.ngoName);
      payload.append('ngoRegistrationNumber', formData.ngoRegistrationNumber);
      payload.append('ngoDocument', formData.ngoDocument);
    }

    setIsSubmitting(true);

    try {
      const result = await register(payload);

      if (!result.ok) {
        const validationMessage = result.data.error?.details?.errors?.[0]?.message;
        throw new Error(validationMessage || result.data.error?.message || 'Registration failed.');
      }

      setFormStatus({
        type: 'success',
        message: 'Account created successfully. Your registration is now saved.',
      });
      setFormData(initialRegisterForm);
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    accountType,
    formData,
    acceptedTerms,
    formStatus,
    isSubmitting,
    showPassword,
    showConfirmPassword,
    updateField,
    updateDocumentFile,
    setAcceptedTerms,
    handleAccountTypeChange,
    toggleShowPassword: () => setShowPassword((value) => !value),
    toggleShowConfirmPassword: () => setShowConfirmPassword((value) => !value),
    handleSubmit,
  };
};
