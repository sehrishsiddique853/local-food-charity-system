import { useNgoHistory } from '../hooks/useNgoHistory';
import { useNgoProfile } from '../hooks/useNgoProfile';
import NgoLayout from '../layouts/NgoLayout/NgoLayout';
import { NgoHistoryList } from '../sections/NgoHistory';
import '../styles/DonorDashboard.css';
import '../styles/NgoAvailableDonationsPage.css';
import '../styles/NgoRequestsPage.css';
import '../styles/NgoHistoryPage.css';

const NgoHistoryPage = () => {
  const { profile, profileError, handleLogout } = useNgoProfile();
  const { historyRequests, totals, isLoading, errorMessage } = useNgoHistory();

  return (
    <NgoLayout activeKey="history" profile={profile} onLogout={handleLogout}>
      <section className="donor-content ngo-content">
        {(profileError || errorMessage) && (
          <p className="dashboard-alert">{profileError || errorMessage}</p>
        )}

        <NgoHistoryList
          requests={historyRequests}
          totals={totals}
          isLoading={isLoading}
        />
      </section>
    </NgoLayout>
  );
};

export default NgoHistoryPage;
