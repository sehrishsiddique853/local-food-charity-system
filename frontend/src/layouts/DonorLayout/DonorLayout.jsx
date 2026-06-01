import DonorNavbar from '../../components/DonorNavbar/DonorNavbar';
import Footer from '../../components/Footer';

const DonorLayout = ({ activeKey, profile, onLogout, children, pageClassName = '' }) => {
  return (
    <main className={`donor-dashboard ${pageClassName}`.trim()}>
      <DonorNavbar activeKey={activeKey} profile={profile} onLogout={onLogout} />
      {children}
      <Footer />
    </main>
  );
};

export default DonorLayout;
