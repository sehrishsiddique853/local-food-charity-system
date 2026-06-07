import { DonationOverviewPanel } from '../DonorDashboard';

const AdminOverviewCharts = ({ donationOverview, requestOverview, ngoOverview }) => (
  <section className="admin-chart-grid" aria-label="System overview charts">
    <DonationOverviewPanel
      rows={donationOverview.rows}
      total={donationOverview.total}
      title="Donation Status Overview"
      centerLabel="Donations"
      ariaLabel="Donation status distribution"
    />
    <DonationOverviewPanel
      rows={requestOverview.rows}
      total={requestOverview.total}
      title="Request Status Overview"
      centerLabel="Requests"
      ariaLabel="Request status distribution"
    />
    <DonationOverviewPanel
      rows={ngoOverview.rows}
      total={ngoOverview.total}
      title="NGO Verification Overview"
      centerLabel="NGOs"
      ariaLabel="NGO verification distribution"
    />
  </section>
);

export default AdminOverviewCharts;
