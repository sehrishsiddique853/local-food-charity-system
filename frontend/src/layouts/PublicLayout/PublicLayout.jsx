import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PublicLayout = ({ children, pageClassName = '', navbarVariant = 'transparent' }) => {
  return (
    <div className={`public-layout ${pageClassName}`.trim()}>
      <Navbar variant={navbarVariant} />
      {children}
      <Footer />
    </div>
  );
};

export default PublicLayout;
