import AdminNgoDetailsModal from './AdminNgoDetailsModal';
import AdminNgosList from './AdminNgosList';
import AdminNgosTabs from './AdminNgosTabs';

const AdminNgosPanel = ({
  activeTab,
  actionNgoId,
  filteredNgos,
  isDetailsLoading,
  isLoading,
  onApprove,
  onCloseDetails,
  onOpenDetails,
  onReject,
  selectedNgoDetails,
  setActiveTab,
  statusTabs,
  tabCounts,
}) => (
  <>
    <section className="my-donations-panel admin-ngos-panel">
      <div className="my-donations-heading">
        <div>
          <h2>NGO Management</h2>
          <p>Review registrations, verification status, and organization details.</p>
        </div>
      </div>

      <AdminNgosTabs
        activeTab={activeTab}
        tabs={statusTabs}
        counts={tabCounts}
        onChange={setActiveTab}
      />

      <AdminNgosList
        ngos={filteredNgos}
        isLoading={isLoading}
        actionNgoId={actionNgoId}
        onOpenDetails={onOpenDetails}
        onApprove={onApprove}
        onReject={onReject}
      />
    </section>

    {(selectedNgoDetails || isDetailsLoading) && (
      <AdminNgoDetailsModal
        details={selectedNgoDetails}
        isLoading={isDetailsLoading}
        actionNgoId={actionNgoId}
        onClose={onCloseDetails}
        onApprove={onApprove}
        onReject={onReject}
      />
    )}
  </>
);

export default AdminNgosPanel;
