import { useNgoProfile } from '../hooks/useNgoProfile';
import { useNgoRequests } from '../hooks/useNgoRequests';
import NgoLayout from '../layouts/NgoLayout/NgoLayout';
import { NgoWelcome } from '../sections/NgoDashboard';
import { NgoRequestDetailsModal, NgoRequestsList } from '../sections/NgoRequests';
import '../styles/DonorDashboard.css';
import '../styles/MyDonationsPage.css';
import '../styles/PostDonationPage.css';
import '../styles/NgoDashboard.css';
import '../styles/NgoAvailableDonationsPage.css';
import '../styles/NgoRequestsPage.css';

const NgoRequestsPage = () => {
  const { profile, profileError, handleLogout } = useNgoProfile();
  const {
    requests,
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
  } = useNgoRequests();

  return (
    <NgoLayout activeKey="requests" profile={profile} onLogout={handleLogout} pageClassName="my-donations-page">
      <section className="my-donations-shell ngo-requests-shell">
        <NgoWelcome
          profile={profile}
          eyebrow="My Requests"
          title="Track requested donations"
          description="Review pending requests, monitor booked donations, and cancel pending requests when needed."
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}
        {successMessage && <p className="dashboard-alert success">{successMessage}</p>}

        <NgoRequestsList
          requests={requests}
          summary={summary}
          statusFilter={statusFilter}
          isLoading={isLoading}
          cancellingRequestId={cancellingRequestId}
          onStatusChange={setStatusFilter}
          onViewDetails={setSelectedRequest}
          onCancelRequest={handleCancelRequest}
        />

        <NgoRequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onCancelRequest={handleCancelRequest}
          isCancelling={cancellingRequestId === selectedRequest?._id}
        />
      </section>
    </NgoLayout>
  );
};

export default NgoRequestsPage;
