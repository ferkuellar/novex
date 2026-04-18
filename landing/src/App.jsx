import React from 'react';
import Navbar from './components/Navbar';
import CookieConsentBanner from './components/CookieConsentBanner';
import BackToTopButton from './components/BackToTopButton';
import MobileWhatsAppFab from './components/MobileWhatsAppFab';
import HeroSection from './sections/HeroSection';
import ValueSection from './sections/ValueSection';
import MaterialsSection from './sections/MaterialsSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ProcessSection from './sections/ProcessSection';
import WhyUsSection from './sections/WhyUsSection';
import LocalTrustSection from './sections/LocalTrustSection';
import TestimonialsSection from './sections/TestimonialsSection';
import FinalCtaSection from './sections/FinalCtaSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main className="site-main">
        <HeroSection />
        <ValueSection />
        <MaterialsSection />
        <ServicesSection />
        <ProjectsSection />
        <ProcessSection />
        <WhyUsSection />
        <LocalTrustSection />
        <TestimonialsSection />
        <FinalCtaSection />
        <ContactSection />
      </main>
      <Footer />
      <CookieConsentBanner />
      <BackToTopButton />
      <MobileWhatsAppFab />
    </>
  );
}

export default App;
