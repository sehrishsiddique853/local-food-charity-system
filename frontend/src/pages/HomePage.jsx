import Hero from '../sections/Hero';
import YesWeCan from '../sections/YesWeCan';
import HowItWorks from '../sections/HowItWorks';
import Statistics from '../sections/Statistics';
import AboutUs from '../sections/AboutUs';
import PublicLayout from '../layouts/PublicLayout';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <PublicLayout pageClassName="home-page">
      <Hero />
      <YesWeCan />
      <HowItWorks />
      <Statistics />
      <AboutUs />
    </PublicLayout>
  );
};

export default HomePage;
