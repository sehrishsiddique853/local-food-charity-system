import AdminRequestDetailsModal from './AdminRequestDetailsModal';
import AdminRequestsList from './AdminRequestsList';
import AdminRequestsTabs from './AdminRequestsTabs';

const AdminRequestsPanel = ({
  activeTab,
  actionRequestId,
  filteredRequests,
  isDetailsLoading,
  isLoading,
  onApprove,
  onCloseDetails,
  onOpenDetails,
  onReject,
  selectedRequestDetails,
  setActiveTab,
  statusTabs,
  tabCounts,
}) => (
  <>
    <section className="my-donations-panel admin-requests-panel">
      <div className="my-donations-heading">
        <div>
          <h2>Request Management</h2>
          <p>Review NGO donation requests and decide which organization receives each donation.</p>
        </div>
      </div>

      <AdminRequestsTabs
        activeTab={activeTab}
        tabs={statusTabs}
        counts={tabCounts}
        onChange={setActiveTab}
      />

      <AdminRequestsList
        requests={filteredRequests}
        isLoading={isLoading}
        actionRequestId={actionRequestId}
        onOpenDetails={onOpenDetails}
        onApprove={onApprove}
        onReject={onReject}
      />
    </section>

    {(selectedRequestDetails || isDetailsLoading) && (
      <AdminRequestDetailsModal
        request={selectedRequestDetails}
        isLoading={isDetailsLoading}
        actionRequestId={actionRequestId}
        onClose={onCloseDetails}
        onApprove={onApprove}
        onReject={onReject}
      />
    )}
  </>
);

export default AdminRequestsPanel;
