import { useEffect, useRef, useState } from 'react';

const options = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'deactivated', label: 'Deactivated' },
];

const AdminUsersFilters = ({ statusFilter, onStatusFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === statusFilter) || options[0];

  return (
    <div className="admin-user-filters">
      <label className="admin-user-filter-label">
        <span>Filter by status</span>
        <div className="admin-user-select" ref={wrapperRef}>
          <button
            type="button"
            className="admin-user-select__button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {selected.label}
          </button>

          {isOpen && (
            <ul className="admin-user-select__menu" role="listbox">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`admin-user-select__item ${statusFilter === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      onStatusFilterChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </label>
    </div>
  );
};

export default AdminUsersFilters;
