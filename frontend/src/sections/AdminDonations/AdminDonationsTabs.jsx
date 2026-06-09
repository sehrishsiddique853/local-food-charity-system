const AdminDonationsTabs = ({ activeTab, tabs, counts, onChange }) => (
  <div className="admin-tabs" role="tablist" aria-label="Donation status filters">
    {tabs.map((tab) => (
      <button
        className={activeTab === tab.key ? 'active' : ''}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.key}
        key={tab.key}
        onClick={() => onChange(tab.key)}
      >
        <span>{tab.label}</span>
        <strong>{counts[tab.key] || 0}</strong>
      </button>
    ))}
  </div>
);

export default AdminDonationsTabs;
