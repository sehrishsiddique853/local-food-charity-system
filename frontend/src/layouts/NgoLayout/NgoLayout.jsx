import DonorNavbar from '../../components/DonorNavbar/DonorNavbar';
import Footer from '../../components/Footer';
import { ngoNavItems } from '../../constants/ngoNavigation';
import { ROUTES } from '../../constants/routes';

const NgoLayout = ({ activeKey, profile, onLogout, children, pageClassName = '' }) => {
  return (
    <main className={`donor-dashboard ngo-dashboard ${pageClassName}`.trim()}>
      <DonorNavbar
        activeKey={activeKey}
        profile={profile}
        onLogout={onLogout}
        navItems={ngoNavItems}
        notificationRoute={ROUTES.ngoNotifications}
        roleLabel="NGO"
        fallbackName="NGO"
        navigationLabel="NGO navigation"
      />
      {children}
      <Footer />
    </main>
  );
};

export default NgoLayout;
