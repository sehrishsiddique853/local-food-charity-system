import { useEffect, useState } from 'react';
import { changePassword, updateProfile } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const buildProfileForm = (profile) => ({
  ngoName: profile?.ngoName || '',
  email: profile?.email || '',
  phone: profile?.phone || '',
  city: profile?.location?.city || 'Islamabad',
  address: profile?.location?.address || '',
  ngoRegistrationNumber: profile?.ngoRegistrationNumber || '',
});

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const useNgoProfileSettings = (profile) => {
  const { refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState(buildProfileForm(profile));
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  useEffect(() => {
    setProfileForm(buildProfileForm(profile));
  }, [profile]);

  const updateProfileField = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const updatePasswordField = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    setIsProfileSaving(true);
    setProfileStatus({ type: '', message: '' });

    try {
      const result = await updateProfile({
        ngoName: profileForm.ngoName,
        location: {
          city: profileForm.city,
          address: profileForm.address,
        },
      });

      if (!result.ok) {
        const validationMessage = result.data.error?.details?.errors?.[0]?.message;
        throw new Error(validationMessage || result.data.error?.message || 'Unable to update profile.');
      }

      await refreshProfile();
      setProfileStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      setProfileStatus({
        type: 'error',
        message: error.message || 'Unable to update profile.',
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    setIsPasswordSaving(true);
    setPasswordStatus({ type: '', message: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      setIsPasswordSaving(false);
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (!result.ok) {
        const validationMessage = result.data.error?.details?.errors?.[0]?.message;
        throw new Error(validationMessage || result.data.error?.message || 'Unable to change password.');
      }

      setPasswordForm(initialPasswordForm);
      setPasswordStatus({ type: 'success', message: 'Password changed successfully.' });
    } catch (error) {
      setPasswordStatus({
        type: 'error',
        message: error.message || 'Unable to change password.',
      });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return {
    profileForm,
    passwordForm,
    profileStatus,
    passwordStatus,
    isProfileSaving,
    isPasswordSaving,
    updateProfileField,
    updatePasswordField,
    submitProfile,
    submitPassword,
  };
};
