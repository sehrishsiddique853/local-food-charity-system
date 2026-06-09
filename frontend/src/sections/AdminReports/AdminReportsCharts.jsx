import { DonationOverviewPanel } from '../DonorDashboard';

const AdminReportsCharts = ({ donationOverview, requestOverview, ngoOverview }) => (
  <section className="admin-chart-grid admin-reports-chart-grid" aria-label="Admin report charts">
    <DonationOverviewPanel
      rows={donationOverview.rows}
      total={donationOverview.total}
      title="Donation Report"
      centerLabel="Donations"
      ariaLabel="Donation report status distribution"
    />
    <DonationOverviewPanel
      rows={requestOverview.rows}
      total={requestOverview.total}
      title="Request Report"
      centerLabel="Requests"
      ariaLabel="Request report status distribution"
    />
    <DonationOverviewPanel
      rows={ngoOverview.rows}
      total={ngoOverview.total}
      title="NGO Report"
      centerLabel="NGOs"
      ariaLabel="NGO report verification distribution"
    />
  </section>
);

export default AdminReportsCharts;
