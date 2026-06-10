import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  activateAdminUser,
  deactivateAdminUser,
  getAdminUserById,
  getAdminUsers,
} from '../services/adminService';

const userTabs = [
  { key: 'all', label: 'All Users' },
  { key: 'donor', label: 'Donors' },
  { key: 'ngo', label: 'NGOs' },
];

const getUserStatus = (user) => (user?.isBlocked ? 'deactivated' : 'active');

export const useAdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [actionUserId, setActionUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleApiResult = (result, fallbackMessage) => {
    if (result.status === 401) {
      navigate(ROUTES.login);
      return false;
    }

    if (result.status === 403) {
      throw new Error(result.data.error?.message || 'Admin access is required.');
    }

    if (!result.ok) {
      throw new Error(result.data.error?.message || fallbackMessage);
    }

    return true;
  };

  const loadUsers = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getAdminUsers();
      if (!handleApiResult(result, 'Unable to load users.')) {
        return;
      }

      const manageableUsers = (result.data.data?.users || []).filter(
        (user) => user.role !== 'admin'
      );
      setUsers(manageableUsers);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabCounts = useMemo(() => ({
    all: users.length,
    donor: users.filter((user) => user.role === 'donor').length,
    ngo: users.filter((user) => user.role === 'ngo').length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = activeTab === 'all' || user.role === activeTab;
      const matchesStatus = !statusFilter || getUserStatus(user) === statusFilter;
      return matchesRole && matchesStatus;
    });
  }, [activeTab, statusFilter, users]);

  const openUserDetails = async (userId) => {
    setIsDetailsLoading(true);
    setErrorMessage('');

    try {
      const result = await getAdminUserById(userId);
      if (!handleApiResult(result, 'Unable to load user details.')) {
        return;
      }

      setSelectedUserDetails(result.data.data?.user || null);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load user details.');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeUserDetails = () => {
    setSelectedUserDetails(null);
  };

  const runUserAction = async (userId, action, successText) => {
    setActionUserId(userId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await action(userId);
      if (!handleApiResult(result, 'Unable to update user.')) {
        return;
      }

      setSuccessMessage(successText);
      await loadUsers();
      if (selectedUserDetails?._id === userId) {
        await openUserDetails(userId);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update user.');
    } finally {
      setActionUserId('');
    }
  };

  const activateUser = (userId) =>
    runUserAction(userId, activateAdminUser, 'User activated successfully.');

  const deactivateUser = (userId) =>
    runUserAction(userId, deactivateAdminUser, 'User deactivated successfully.');

  return {
    actionUserId,
    activeTab,
    activateUser,
    closeUserDetails,
    deactivateUser,
    errorMessage,
    filteredUsers,
    isDetailsLoading,
    isLoading,
    openUserDetails,
    selectedUserDetails,
    setActiveTab,
    setStatusFilter,
    statusFilter,
    successMessage,
    tabCounts,
    userTabs,
  };
};
