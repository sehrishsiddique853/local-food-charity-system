const AdminUsersFilters = ({ statusFilter, onStatusFilterChange }) => (
  <div className="admin-user-filters">
    <label>
      <span>Filter by status</span>
      <select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
      >
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="deactivated">Deactivated</option>
      </select>
    </label>
  </div>
);

export default AdminUsersFilters;
