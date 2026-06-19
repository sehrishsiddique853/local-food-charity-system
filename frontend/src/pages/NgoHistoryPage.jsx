import { useNgoHistory } from '../hooks/useNgoHistory';
import { useNgoProfile } from '../hooks/useNgoProfile';
import NgoLayout from '../layouts/NgoLayout/NgoLayout';
import { NgoHistoryList } from '../sections/NgoHistory';
import { NgoWelcome } from '../sections/NgoDashboard';
import { NgoRequestDetailsModal } from '../sections/NgoRequests';
import '../styles/DonorDashboard.css';
import '../styles/MyDonationsPage.css';
import '../styles/PostDonationPage.css';
import '../styles/NgoDashboard.css';
import '../styles/NgoAvailableDonationsPage.css';
import '../styles/NgoRequestsPage.css';
import '../styles/NgoHistoryPage.css';

const NgoHistoryPage = () => {
  const { profile, profileError, handleLogout } = useNgoProfile();
  const {
    historyRequests,
    totals,
    statusFilter,
    selectedRequest,
    isLoading,
    errorMessage,
    setStatusFilter,
    setSelectedRequest,
  } = useNgoHistory();

  return (
    <NgoLayout activeKey="history" profile={profile} onLogout={handleLogout} pageClassName="my-donations-page">
      <section className="my-donations-shell ngo-available-shell">
        <NgoWelcome
          profile={profile}
          eyebrow="Donation History"
          title="Review donation outcomes"
          description="View collected donations from your NGO activity."
        />

        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        <NgoHistoryList
          requests={historyRequests}
          totals={totals}
          statusFilter={statusFilter}
          isLoading={isLoading}
          onStatusChange={setStatusFilter}
          onViewDetails={setSelectedRequest}
        />

        <NgoRequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      </section>
    </NgoLayout>
  );
};

export default NgoHistoryPage;
