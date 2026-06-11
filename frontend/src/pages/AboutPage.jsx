import PublicLayout from '../layouts/PublicLayout';
import AboutMissionSection from '../sections/AboutMissionSection';
import AboutPageHero from '../sections/AboutPageHero';
import AboutProcessSection from '../sections/AboutProcessSection';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <PublicLayout pageClassName="about-page" navbarVariant="light">
      <main className="about-page-main">
        <AboutPageHero />
        <AboutMissionSection />
        <AboutProcessSection />
      </main>
    </PublicLayout>
  );
};

export default AboutPage;
