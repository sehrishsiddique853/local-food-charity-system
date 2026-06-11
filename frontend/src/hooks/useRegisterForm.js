import { useState } from 'react';
import { register, sendRegistrationOtp } from '../services/authService';

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
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingPayload, setPendingPayload] = useState(null);
  const [otpMessage, setOtpMessage] = useState('');
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
    setOtpDialogOpen(false);
    setOtpCode('');
    setPendingPayload(null);
    setOtpMessage('');

    if (role === 'donor') {
      setFormData((current) => ({
        ...current,
        ngoName: '',
        ngoRegistrationNumber: '',
        ngoDocument: null,
      }));
    }
  };

  const validateClientForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setFormStatus({ type: 'error', message: 'Password and confirm password must match.' });
      return false;
    }

    if (accountType === 'ngo' && !formData.ngoDocument) {
      setFormStatus({ type: 'error', message: 'Please upload your NGO verification document.' });
      return false;
    }

    return true;
  };

  const buildRegistrationPayload = () => {
    const payload = new FormData();
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('role', accountType);
    payload.append('address', formData.address);

    if (formData.phone) {
      payload.append('phone', formData.phone);
    }

    if (accountType === 'donor') {
      payload.append('name', formData.name);
    }

    if (accountType === 'ngo') {
      payload.append('ngoName', formData.ngoName);
      payload.append('ngoRegistrationNumber', formData.ngoRegistrationNumber);
      payload.append('ngoDocument', formData.ngoDocument);
    }

    return payload;
  };

  const getApiErrorMessage = (result, fallback) => {
    const validationMessage = result.data.error?.details?.errors?.[0]?.message;
    return validationMessage || result.data.error?.message || fallback;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });
    setOtpMessage('');

    if (!validateClientForm()) {
      return;
    }

    const payload = buildRegistrationPayload();

    setIsSubmitting(true);

    try {
      const result = await sendRegistrationOtp(payload);

      if (!result.ok) {
        throw new Error(getApiErrorMessage(result, 'Could not send verification code.'));
      }

      setPendingPayload(payload);
      setOtpDialogOpen(true);
      setOtpCode('');
      setFormStatus({
        type: 'success',
        message: 'Verification code sent. Please check your email.',
      });
      setOtpMessage(result.data.data?.message || 'Enter the 6 digit code sent to your email.');
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Could not send verification code. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (event) => {
    setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6));
  };

  const closeOtpDialog = () => {
    if (isVerifyingOtp) {
      return;
    }

    setOtpDialogOpen(false);
    setOtpCode('');
    setOtpMessage('');
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setFormStatus({ type: '', message: '' });
    setOtpMessage('');

    if (!pendingPayload) {
      setOtpMessage('Please request a new verification code.');
      return;
    }

    if (otpCode.length !== 6) {
      setOtpMessage('Enter the 6 digit verification code.');
      return;
    }

    const payload = buildRegistrationPayload();
    payload.append('otp', otpCode);

    setIsVerifyingOtp(true);

    try {
      const result = await register(payload);

      if (!result.ok) {
        throw new Error(getApiErrorMessage(result, 'Registration failed.'));
      }

      setFormStatus({
        type: 'success',
        message: result.data.data?.message || 'Account created successfully. Your registration is now saved.',
      });
      setFormData(initialRegisterForm);
      setOtpDialogOpen(false);
      setOtpCode('');
      setPendingPayload(null);
      setOtpMessage('');
    } catch (error) {
      setOtpMessage(error.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return {
    accountType,
    formData,
    formStatus,
    isSubmitting,
    isVerifyingOtp,
    otpDialogOpen,
    otpCode,
    otpMessage,
    showPassword,
    showConfirmPassword,
    updateField,
    updateDocumentFile,
    handleAccountTypeChange,
    closeOtpDialog,
    handleOtpChange,
    handleVerifyOtp,
    toggleShowPassword: () => setShowPassword((value) => !value),
    toggleShowConfirmPassword: () => setShowConfirmPassword((value) => !value),
    handleSubmit,
  };
};
