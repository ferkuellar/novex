import React from 'react';
import CTAButton from '../components/CTAButton';

const heroImage = '/placeholders/hero-countertop.svg';

function HeroSection() {
  return (
    <section
      id="inicio"
      className="hero-section"
      style={{ '--hero-image': `url(${heroImage})` }}
    >
      <div className="hero-overlay" />
      <div className="container hero-content">
        <p className="hero-kicker">Casa Pietra</p>
        <p className="eyebrow">Mármol, granito y cuarzo en Chihuahua</p>
        <h1 className="hero-title">
          <span className="hero-title-main">Superficies arquitectónicas</span>
          <span className="hero-title-subline">para proyectos residenciales y comerciales</span>
        </h1>
        <p className="hero-subtitle">
          <span className="hero-subtitle-full">
            Diseñamos, fabricamos e instalamos cubiertas con estética atemporal, precisión técnica
            y acabados que elevan la percepción de cada espacio.
          </span>
          <span className="hero-subtitle-mobile">
            Cotiza tu proyecto con asesoría experta en mármol, granito y cuarzo.
          </span>
        </p>

        <div className="hero-cta-group">
          <CTAButton href="#contacto">Solicitar cotización</CTAButton>
          <CTAButton href="#proyectos" variant="ghost" className="hero-cta-secondary">Ver proyectos</CTAButton>
          <CTAButton href="https://wa.me/526141777711" variant="light" className="hero-cta-whatsapp">Hablar por WhatsApp</CTAButton>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
