import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import YesWeCan from '../sections/YesWeCan';
import HowItWorks from '../sections/HowItWorks';
import Statistics from '../sections/Statistics';
import AboutUs from '../sections/AboutUs';
import Footer from '../components/Footer';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <YesWeCan />
      <HowItWorks />
      <Statistics />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default HomePage;
