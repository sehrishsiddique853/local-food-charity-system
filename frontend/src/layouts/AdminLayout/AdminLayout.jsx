import DonorNavbar from '../../components/DonorNavbar/DonorNavbar';
import Footer from '../../components/Footer';
import { adminNavItems } from '../../constants/adminNavigation';
import { ROUTES } from '../../constants/routes';

const AdminLayout = ({ activeKey, profile, onLogout, children, pageClassName = '' }) => {
  return (
    <main className={`donor-dashboard admin-dashboard ${pageClassName}`.trim()}>
      <DonorNavbar
        activeKey={activeKey}
        profile={profile}
        onLogout={onLogout}
        navItems={adminNavItems}
        notificationRoute={ROUTES.adminNotifications}
        roleLabel="Admin"
        fallbackName="Admin"
        navigationLabel="Admin navigation"
      />
      {children}
      <Footer />
    </main>
  );
};

export default AdminLayout;
