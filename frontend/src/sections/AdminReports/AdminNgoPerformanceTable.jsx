const AdminNgoPerformanceTable = ({ rows }) => {
  if (!rows.length) {
    return (
      <section className="my-donations-panel admin-ngo-performance-panel">
        <div className="my-donations-heading">
          <div>
            <h2>NGO Performance Report</h2>
            <p>Request and collection activity by NGO.</p>
          </div>
        </div>
        <div className="my-donations-empty">
          <h3>No NGO activity found</h3>
          <p>NGO performance data will appear after organizations request donations.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-donations-panel admin-ngo-performance-panel">
      <div className="my-donations-heading">
        <div>
          <h2>NGO Performance Report</h2>
          <p>Request and collection activity by NGO.</p>
        </div>
      </div>

      <div className="admin-report-table" role="table" aria-label="NGO performance report table">
        <div className="admin-report-table-head" role="row">
          <span>NGO</span>
          <span>Total Requests</span>
          <span>Pending</span>
          <span>Approved</span>
          <span>Rejected</span>
          <span>Collected</span>
        </div>

        <div className="admin-report-list">
          {rows.map((row) => (
            <article className="admin-report-row" key={row.ngoId}>
              <strong>{row.ngoName || row.email || 'NGO'}</strong>
              <span data-label="Total Requests">{row.totalRequests || 0}</span>
              <span data-label="Pending">{row.pendingRequests || 0}</span>
              <span data-label="Approved">{row.approvedRequests || 0}</span>
              <span data-label="Rejected">{row.rejectedRequests || 0}</span>
              <span data-label="Collected">{row.collectedRequests || 0}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminNgoPerformanceTable;
