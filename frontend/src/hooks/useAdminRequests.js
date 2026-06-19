import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  approveAdminRequest,
  getAdminRequestById,
  getAdminRequests,
  rejectAdminRequest,
} from '../services/adminService';

const statusTabs = [
  { key: 'all', label: 'All Requests' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
];

const normalizeStatus = (status) => status || 'pending';
const visibleRequestStatuses = ['pending', 'approved'];

export const useAdminRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [actionRequestId, setActionRequestId] = useState('');
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

  const loadRequests = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getAdminRequests();
      if (!handleApiResult(result, 'Unable to load donation requests.')) {
        return;
      }

      setRequests(result.data.data?.requests || []);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load donation requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabCounts = useMemo(() => {
    const counts = {
      all: 0,
      pending: 0,
      approved: 0,
    };

    requests.forEach((request) => {
      const status = normalizeStatus(request.requestStatus);
      if (!visibleRequestStatuses.includes(status)) {
        return;
      }

      counts.all += 1;
      if (Object.prototype.hasOwnProperty.call(counts, status)) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const status = normalizeStatus(request.requestStatus);

      if (!visibleRequestStatuses.includes(status)) {
        return false;
      }

      return activeTab === 'all' || status === activeTab;
    });
  }, [activeTab, requests]);

  const openRequestDetails = async (requestId) => {
    setIsDetailsLoading(true);
    setErrorMessage('');

    try {
      const result = await getAdminRequestById(requestId);
      if (!handleApiResult(result, 'Unable to load request details.')) {
        return;
      }

      setSelectedRequestDetails(result.data.data?.request || null);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load request details.');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeRequestDetails = () => {
    setSelectedRequestDetails(null);
  };

  const approveRequest = async (requestId) => {
    setActionRequestId(requestId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await approveAdminRequest(requestId);
      if (!handleApiResult(result, 'Unable to approve request.')) {
        return;
      }

      setSuccessMessage('Donation request approved successfully.');
      await loadRequests();
      if (selectedRequestDetails?._id === requestId) {
        await openRequestDetails(requestId);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to approve request.');
    } finally {
      setActionRequestId('');
    }
  };

  const rejectRequest = async (requestId) => {
    setActionRequestId(requestId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await rejectAdminRequest(requestId);
      if (!handleApiResult(result, 'Unable to reject request.')) {
        return;
      }

      setSuccessMessage('Donation request rejected successfully.');
      await loadRequests();
      if (selectedRequestDetails?._id === requestId) {
        await openRequestDetails(requestId);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to reject request.');
    } finally {
      setActionRequestId('');
    }
  };

  return {
    activeTab,
    actionRequestId,
    approveRequest,
    closeRequestDetails,
    errorMessage,
    filteredRequests,
    isDetailsLoading,
    isLoading,
    openRequestDetails,
    rejectRequest,
    selectedRequestDetails,
    setActiveTab,
    statusTabs,
    successMessage,
    tabCounts,
  };
};
