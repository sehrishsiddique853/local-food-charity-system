import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { cancelNgoRequest, getNgoRequests } from '../services/ngoService';

const activeRequestStatuses = ['pending', 'approved'];

export const useNgoRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancellingRequestId, setCancellingRequestId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadRequests = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getNgoRequests();

      if (result.status === 401) {
        navigate(ROUTES.login);
        return;
      }

      if (result.status === 403) {
        throw new Error(result.data.error?.message || 'Your NGO account is not approved yet.');
      }

      if (!result.ok) {
        throw new Error(result.data.error?.message || 'Unable to load requests.');
      }

      setRequests(result.data.data?.requests || []);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [navigate]);

  const activeRequests = useMemo(
    () =>
      requests.filter((request) => activeRequestStatuses.includes(request.requestStatus)),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    if (!statusFilter) {
      return activeRequests;
    }

    return activeRequests.filter((request) => request.requestStatus === statusFilter);
  }, [activeRequests, statusFilter]);

  const summary = useMemo(() => ({
    pending: activeRequests.filter((request) => request.requestStatus === 'pending').length,
    approved: activeRequests.filter((request) => request.requestStatus === 'approved').length,
  }), [activeRequests]);

  const handleCancelRequest = async (requestId) => {
    setCancellingRequestId(requestId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await cancelNgoRequest(requestId);

      if (result.status === 401) {
        navigate(ROUTES.login);
        return;
      }

      if (!result.ok) {
        throw new Error(result.data.error?.message || 'Unable to cancel request.');
      }

      setSuccessMessage(result.data.data?.message || 'Request cancelled successfully.');
      setSelectedRequest(null);
      await loadRequests();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to cancel request.');
    } finally {
      setCancellingRequestId('');
    }
  };

  return {
    requests: filteredRequests,
    summary,
    statusFilter,
    selectedRequest,
    cancellingRequestId,
    isLoading,
    errorMessage,
    successMessage,
    setStatusFilter,
    setSelectedRequest,
    handleCancelRequest,
  };
};
