import { useState } from 'react';
import { Link } from 'react-router-dom';
import { donorNavItems } from '../../constants/donorNavigation';
import { getInitials } from '../../utils/profileUtils';
import { ROUTES } from '../../constants/routes';
import './DonorNavbar.css';

const DonorNavbar = ({ activeKey, profile, onLogout }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayName = profile?.name || 'Donor';

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="dashboard-header">
      <Link className="dashboard-logo" to={ROUTES.home}>
        <span className="dashboard-logo-mark">🥗</span>
        <strong>
          Local <span>Food</span>
          <small>Charity System</small>
        </strong>
      </Link>

      <button
        className={`dashboard-menu-button ${mobileMenuOpen ? 'active' : ''}`}
        type="button"
        onClick={() => setMobileMenuOpen((current) => !current)}
        aria-label="Toggle dashboard navigation"
        aria-expanded={mobileMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`dashboard-nav ${mobileMenuOpen ? 'active' : ''}`} aria-label="Donor navigation">
        {donorNavItems.map((item) => (
          <Link
            className={activeKey === item.key ? 'active' : ''}
            to={item.href}
            key={item.key}
            onClick={closeMobileMenu}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="dashboard-user-actions">
        <button className="notification-button" type="button" aria-label="Notifications">
          🔔
          <span>3</span>
        </button>
        <div className="header-divider"></div>
        <div className="profile-menu">
          <button
            className="profile-avatar-button"
            type="button"
            onClick={() => setProfileMenuOpen((current) => !current)}
            aria-expanded={profileMenuOpen}
            aria-label="Open profile menu"
          >
            <span className="donor-avatar" aria-hidden="true">{getInitials(displayName)}</span>
          </button>

          {profileMenuOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <span className="donor-avatar large" aria-hidden="true">{getInitials(displayName)}</span>
                <div>
                  <strong>{displayName}</strong>
                  <p>Donor</p>
                </div>
              </div>
              <button className="profile-logout" type="button" onClick={onLogout}>
                <span>↪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DonorNavbar;
