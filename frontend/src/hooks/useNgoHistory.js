import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { getNgoHistory } from '../services/ngoService';

const historyRequestStatuses = ['rejected', 'collected'];
const ngoCancelledMessage = 'Cancelled by NGO';

export const useNgoHistory = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await getNgoHistory();

        if (result.status === 401) {
          navigate(ROUTES.login);
          return;
        }

        if (result.status === 403) {
          throw new Error(result.data.error?.message || 'Your NGO account is not approved yet.');
        }

        if (!result.ok) {
          throw new Error(result.data.error?.message || 'Unable to load NGO history.');
        }

        setRequests(result.data.data?.requests || []);
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load NGO history.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [navigate]);

  const historyRequests = useMemo(
    () =>
      requests
        .filter((request) => historyRequestStatuses.includes(request.requestStatus))
        .filter(
          (request) =>
            request.requestStatus !== 'rejected' ||
            request.adminMessage !== ngoCancelledMessage
        ),
    [requests]
  );

  const totals = useMemo(() => ({
    all: historyRequests.length,
    rejected: historyRequests.filter((request) => request.requestStatus === 'rejected').length,
    collected: historyRequests.filter((request) => request.requestStatus === 'collected').length,
  }), [historyRequests]);

  return {
    historyRequests,
    totals,
    isLoading,
    errorMessage,
  };
};
