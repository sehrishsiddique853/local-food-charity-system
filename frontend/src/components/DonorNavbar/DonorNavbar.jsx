import { useState } from 'react';
import { Link } from 'react-router-dom';
import { donorNavItems } from '../../constants/donorNavigation';
import { getInitials } from '../../utils/profileUtils';
import { ROUTES } from '../../constants/routes';
import { useNotifications } from '../../hooks/useNotifications';
import './DonorNavbar.css';

const DonorNavbar = ({
  activeKey,
  profile,
  onLogout,
  navItems = donorNavItems,
  notificationRoute = ROUTES.notifications,
  roleLabel = 'Donor',
  fallbackName = 'Donor',
  navigationLabel = 'Dashboard navigation',
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { unreadCount } = useNotifications({ loadList: false });
  const displayName = profile?.name || profile?.ngoName || profile?.organizationName || fallbackName;

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

      <nav className={`dashboard-nav ${mobileMenuOpen ? 'active' : ''}`} aria-label={navigationLabel}>
        {navItems.map((item) => (
          <Link
            className={activeKey === item.key ? 'active' : ''}
            to={item.href}
            key={item.key}
            onClick={closeMobileMenu}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="dashboard-user-actions">
        <Link
          className={`notification-button ${unreadCount > 0 ? 'has-unread' : ''}`}
          to={notificationRoute}
          aria-label={`${unreadCount} unread notifications`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
            <path d="M10 20a2 2 0 0 0 4 0" />
          </svg>
          {unreadCount > 0 && <span>{unreadCount}</span>}
        </Link>
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
                  <p>{roleLabel}</p>
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
