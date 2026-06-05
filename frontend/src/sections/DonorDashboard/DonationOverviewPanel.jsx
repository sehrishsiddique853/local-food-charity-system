import { buildDonutGradient } from '../../utils/donationUtils';

const DonationOverviewPanel = ({ rows, total }) => (
  <article className="dashboard-panel overview-panel">
    <div className="panel-heading">
      <h2>Donations Overview</h2>
    </div>

    <div className="overview-body">
      <div
        className="donut-chart"
        style={{ '--donut-gradient': buildDonutGradient(rows, total) }}
        aria-label="Donation status distribution"
      >
        <strong>{total ? '100%' : '0%'}</strong>
        <span>Status Mix</span>
      </div>

      <div className="overview-list">
        {rows.map((row) => {
          const percent = total ? Math.round((row.value / total) * 1000) / 10 : 0;

          return (
            <div className="overview-row" key={row.label}>
              <span style={{ '--dot-color': row.color }}></span>
              <p>{row.label}</p>
              <small>{row.value}</small>
              <strong>{percent}%</strong>
            </div>
          );
        })}
      </div>
    </div>
  </article>
);

export default DonationOverviewPanel;
