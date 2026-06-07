import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  approveAdminNgo,
  getAdminNgoById,
  getAdminNgos,
  rejectAdminNgo,
} from '../services/adminService';

const statusTabs = [
  { key: 'all', label: 'All NGOs' },
  { key: 'pending', label: 'Pending NGOs' },
  { key: 'approved', label: 'Approved NGOs' },
  { key: 'rejected', label: 'Rejected NGOs' },
];

const normalizeStatus = (status) => status || 'pending';

export const useAdminNgos = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNgoDetails, setSelectedNgoDetails] = useState(null);
  const [rejectDialogNgoId, setRejectDialogNgoId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [actionNgoId, setActionNgoId] = useState('');
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

  const loadNgos = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getAdminNgos();
      if (!handleApiResult(result, 'Unable to load NGOs.')) {
        return;
      }

      setNgos(result.data.data?.ngos || []);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load NGOs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNgos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabCounts = useMemo(() => {
    const counts = {
      all: ngos.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    ngos.forEach((ngo) => {
      const status = normalizeStatus(ngo.ngoVerificationStatus);
      if (Object.prototype.hasOwnProperty.call(counts, status)) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [ngos]);

  const filteredNgos = useMemo(() => {
    if (activeTab === 'all') {
      return ngos;
    }

    return ngos.filter((ngo) => normalizeStatus(ngo.ngoVerificationStatus) === activeTab);
  }, [activeTab, ngos]);

  const openNgoDetails = async (ngoId) => {
    setIsDetailsLoading(true);
    setErrorMessage('');

    try {
      const result = await getAdminNgoById(ngoId);
      if (!handleApiResult(result, 'Unable to load NGO details.')) {
        return;
      }

      setSelectedNgoDetails(result.data.data || null);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load NGO details.');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeNgoDetails = () => {
    setSelectedNgoDetails(null);
  };

  const approveNgo = async (ngoId) => {
    setActionNgoId(ngoId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await approveAdminNgo(ngoId);
      if (!handleApiResult(result, 'Unable to approve NGO.')) {
        return;
      }

      setSuccessMessage('NGO approved successfully.');
      await loadNgos();
      if (selectedNgoDetails?.ngo?._id === ngoId) {
        await openNgoDetails(ngoId);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to approve NGO.');
    } finally {
      setActionNgoId('');
    }
  };

  const openRejectDialog = (ngoId) => {
    setRejectDialogNgoId(ngoId);
    setRejectReason('');
  };

  const closeRejectDialog = () => {
    setRejectDialogNgoId('');
    setRejectReason('');
  };

  const rejectNgo = async (ngoId, reason = '') => {
    setActionNgoId(ngoId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await rejectAdminNgo(ngoId, { reason });
      if (!handleApiResult(result, 'Unable to reject NGO.')) {
        return;
      }

      setSuccessMessage('NGO rejected successfully.');
      closeRejectDialog();
      await loadNgos();
      if (selectedNgoDetails?.ngo?._id === ngoId) {
        await openNgoDetails(ngoId);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to reject NGO.');
    } finally {
      setActionNgoId('');
    }
  };

  return {
    activeTab,
    actionNgoId,
    closeNgoDetails,
    closeRejectDialog,
    errorMessage,
    filteredNgos,
    isDetailsLoading,
    isLoading,
    openNgoDetails,
    openRejectDialog,
    approveNgo,
    rejectDialogNgoId,
    rejectNgo,
    rejectReason,
    selectedNgoDetails,
    setActiveTab,
    setRejectReason,
    statusTabs,
    successMessage,
    tabCounts,
  };
};
