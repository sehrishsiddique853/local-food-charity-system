import AdminDonationDetailsModal from './AdminDonationDetailsModal';
import AdminDonationsList from './AdminDonationsList';
import AdminDonationsTabs from './AdminDonationsTabs';

const AdminDonationsPanel = ({
  activeTab,
  actionDonationId,
  filteredDonations,
  isDetailsLoading,
  isLoading,
  onCancelBooking,
  onCancelDonation,
  onCloseDetails,
  onDelete,
  onMarkCollected,
  onMarkExpired,
  onOpenDetails,
  onStatusChange,
  selectedDonationDetails,
  setActiveTab,
  statusTabs,
  tabCounts,
}) => (
  <>
    <section className="my-donations-panel admin-donations-panel">
      <div className="my-donations-heading">
        <div>
          <h2>Donation Management</h2>
          <p>Monitor food donations and review their current lifecycle status.</p>
        </div>
      </div>

      <AdminDonationsTabs
        activeTab={activeTab}
        tabs={statusTabs}
        counts={tabCounts}
        onChange={setActiveTab}
      />

      <AdminDonationsList
        donations={filteredDonations}
        isLoading={isLoading}
        actionDonationId={actionDonationId}
        onOpenDetails={onOpenDetails}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </section>

    {(selectedDonationDetails || isDetailsLoading) && (
      <AdminDonationDetailsModal
        details={selectedDonationDetails}
        isLoading={isDetailsLoading}
        actionDonationId={actionDonationId}
        onClose={onCloseDetails}
        onCancelBooking={onCancelBooking}
        onCancelDonation={onCancelDonation}
        onDelete={onDelete}
        onMarkCollected={onMarkCollected}
        onMarkExpired={onMarkExpired}
      />
    )}
  </>
);

export default AdminDonationsPanel;
