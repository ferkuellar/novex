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
        <h1 className="hero-title">Superficies arquitectónicas para proyectos residenciales y comerciales</h1>
        <p className="hero-subtitle">
          Diseñamos, fabricamos e instalamos cubiertas con estética atemporal, precisión técnica
          y acabados que elevan la percepción de cada espacio.
        </p>

        <div className="hero-cta-group">
          <CTAButton href="#contacto">Solicitar cotización</CTAButton>
          <CTAButton href="#proyectos" variant="ghost">Ver proyectos</CTAButton>
          <CTAButton href="https://wa.me/526141777711" variant="light">WhatsApp (614) 177 7711</CTAButton>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
