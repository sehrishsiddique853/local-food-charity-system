import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/DonorDashboard.css';

const statusLabels = {
  available: 'Available',
  requested: 'Requested',
  booked: 'Booked',
  collected: 'Collected',
  completed: 'Completed',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

const statusClass = {
  available: 'available',
  requested: 'requested',
  booked: 'booked',
  collected: 'collected',
  completed: 'collected',
  expired: 'expired',
  cancelled: 'expired',
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'No date';
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue));
};

const formatQuantity = (quantity) => {
  if (!quantity?.value || !quantity?.unit) return 'Quantity not set';
  return `${quantity.value} ${quantity.unit}`;
};

const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'D';
  return words.slice(0, 2).map((word) => word[0].toUpperCase()).join('');
};

const buildDonutGradient = (rows, total) => {
  if (!total) {
    return 'radial-gradient(circle, #ffffff 0 39%, transparent 40%), conic-gradient(#e5e7eb 0 100%)';
  }

  let current = 0;
  const segments = rows
    .filter((row) => row.value > 0)
    .map((row) => {
      const start = current;
      current += (row.value / total) * 100;
      return `${row.color} ${start}% ${current}%`;
    });

  return `radial-gradient(circle, #ffffff 0 39%, transparent 40%), conic-gradient(${segments.join(', ')})`;
};

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    requested: 0,
    booked: 0,
    collected: 0,
  });
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [profileResponse, statsResponse, donationsResponse] = await Promise.all([
          fetch('/api/auth/profile', { credentials: 'include' }),
          fetch('/api/donations/my/stats', { credentials: 'include' }),
          fetch('/api/donations/history', { credentials: 'include' }),
        ]);

        if (profileResponse.status === 401) {
          navigate('/login');
          return;
        }

        if (!profileResponse.ok) {
          throw new Error('Unable to load your profile.');
        }

        const profileResult = await profileResponse.json();
        const loadedProfile = profileResult.data?.user;

        if (loadedProfile?.role !== 'donor') {
          navigate('/login');
          return;
        }

        setProfile(loadedProfile);

        if (statsResponse.ok) {
          const statsResult = await statsResponse.json();
          setStats((current) => ({
            ...current,
            ...statsResult.data,
          }));
        }

        if (donationsResponse.ok) {
          const donationsResult = await donationsResponse.json();
          setDonations(donationsResult.data?.donations || []);
        }
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const donationSummary = useMemo(() => {
    const expiredCancelled = donations.filter((donation) =>
      ['expired', 'cancelled'].includes(donation.status)
    ).length;
    const requestedBooked = (stats.requested || 0) + (stats.booked || 0);
    const total = stats.total || donations.length || 0;

    return {
      total,
      available: stats.available || 0,
      requestedBooked,
      collected: stats.collected || 0,
      expiredCancelled,
    };
  }, [donations, stats]);

  const overviewRows = [
    { label: 'Available', value: donationSummary.available, color: '#27ae60' },
    { label: 'Requested / Booked', value: donationSummary.requestedBooked, color: '#f59e0b' },
    { label: 'Collected', value: donationSummary.collected, color: '#3b82f6' },
    { label: 'Expired / Cancelled', value: donationSummary.expiredCancelled, color: '#8b5cf6' },
  ];

  const recentDonations = donations.slice(0, 4);
  const displayName = profile?.name || 'Donor';

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/login');
  };

  return (
    <main className="donor-dashboard">
      <header className="dashboard-header">
        <a className="dashboard-logo" href="/">
          <span className="dashboard-logo-mark">🥗</span>
          <strong>
            Local <span>Food</span>
            <small>Charity System</small>
          </strong>
        </a>

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
          <a className="active" href="#dashboard" onClick={() => setMobileMenuOpen(false)}><span>⌂</span>Dashboard</a>
          <a href="#post-donation" onClick={() => setMobileMenuOpen(false)}><span>＋</span>Post Donation</a>
          <a href="#my-donations" onClick={() => setMobileMenuOpen(false)}><span>▣</span>My Donations</a>
          <a href="#history" onClick={() => setMobileMenuOpen(false)}><span>↺</span>Donation History</a>
          <a href="#profile" onClick={() => setMobileMenuOpen(false)}><span>♙</span>My Profile</a>
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
                <button className="profile-logout" type="button" onClick={handleLogout}>
                  <span>↪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="donor-content" id="dashboard">
        <section className="welcome-band">
          <div>
            <p>Welcome back,</p>
            <h1>{profile?.name || 'Donor'} <span>👋</span></h1>
            <p>Thank you for supporting the community!</p>
          </div>
          <img src="/home-page-ani.png" alt="Fresh food donation box" />
        </section>

        {errorMessage && <p className="dashboard-alert">{errorMessage}</p>}

        <section className="stats-grid" aria-label="Donation statistics">
          <article className="stat-card green">
            <span className="stat-icon">🎁</span>
            <div>
              <strong>{donationSummary.total}</strong>
              <p>Total Donations</p>
            </div>
            <small>All time</small>
          </article>
          <article className="stat-card orange">
            <span className="stat-icon">📦</span>
            <div>
              <strong>{donationSummary.available}</strong>
              <p>Available</p>
            </div>
            <small>Currently available</small>
          </article>
          <article className="stat-card blue">
            <span className="stat-icon">🤝</span>
            <div>
              <strong>{donationSummary.requestedBooked}</strong>
              <p>Requested / Booked</p>
            </div>
            <small>Awaiting approval / pickup</small>
          </article>
          <article className="stat-card purple">
            <span className="stat-icon">✓</span>
            <div>
              <strong>{donationSummary.collected}</strong>
              <p>Collected</p>
            </div>
            <small>Successfully collected</small>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel recent-panel" id="my-donations">
            <div className="panel-heading">
              <h2>Recent Donations</h2>
              <a href="#my-donations">View All</a>
            </div>

            <div className="donation-list">
              {isLoading && <p className="empty-state">Loading your donations...</p>}
              {!isLoading && recentDonations.length === 0 && (
                <p className="empty-state">No donations yet. Post your first donation.</p>
              )}
              {recentDonations.map((donation) => (
                <article className="donation-row" key={donation._id}>
                  <img src={donation.images?.[0] || '/hero-image.JPG'} alt={donation.foodTitle} />
                  <div className="donation-copy">
                    <strong>{donation.foodTitle}</strong>
                    <p>
                      {formatQuantity(donation.quantity)}
                      <span>•</span>
                      {donation.pickupAddress?.address || 'Address not available'}
                    </p>
                  </div>
                  <span className={`status-pill ${statusClass[donation.status] || 'available'}`}>
                    {statusLabels[donation.status] || donation.status}
                  </span>
                  <time>{formatDate(donation.createdAt)}</time>
                </article>
              ))}
            </div>
          </article>

          <div className="dashboard-side">
            <article className="dashboard-panel overview-panel">
              <div className="panel-heading">
                <h2>Donations Overview</h2>
                <button type="button">This Month <span>⌄</span></button>
              </div>

              <div className="overview-body">
                <div
                  className="donut-chart"
                  style={{ '--donut-gradient': buildDonutGradient(overviewRows, donationSummary.total) }}
                  aria-label={`${donationSummary.total} total donations`}
                >
                  <strong>{donationSummary.total}</strong>
                  <span>Total</span>
                </div>

                <div className="overview-list">
                  {overviewRows.map((row) => {
                    const percent = donationSummary.total
                      ? Math.round((row.value / donationSummary.total) * 1000) / 10
                      : 0;

                    return (
                      <div className="overview-row" key={row.label}>
                        <span style={{ '--dot-color': row.color }}></span>
                        <p>{row.label}</p>
                        <strong>{row.value} ({percent}%)</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            <section className="surplus-card" id="post-donation">
              <span className="surplus-icon">♡</span>
              <div>
                <h2>Make a Difference Today!</h2>
                <p>Every donation brings hope and happiness to someone in need.</p>
              </div>
              <a className="surplus-button" href="#post-donation">
                <span>＋</span>
                Post New Donation
              </a>
            </section>
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default DonorDashboard;
