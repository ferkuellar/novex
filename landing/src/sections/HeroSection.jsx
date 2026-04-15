import React from 'react';
import CTAButton from '../components/CTAButton';

const heroStats = ['Diseño a medida', 'Instalación profesional', 'Materiales de alta calidad'];

function HeroSection() {
  return (
    <section id="inicio" className="hero-section">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <p className="eyebrow">Cubiertas premium en Chihuahua</p>
        <h1>Cubiertas premium que elevan cada espacio</h1>
        <p className="hero-subtitle">
          Fabricación e instalación de mármol, granito y cuarzo en Chihuahua, con precisión,
          diseño y acabados de alto nivel.
        </p>

        <div className="hero-cta-group">
          <CTAButton href="#contacto">Solicitar cotización</CTAButton>
          <CTAButton href="#proyectos" variant="ghost">Ver proyectos</CTAButton>
          <CTAButton href="https://wa.me/52614177711" variant="light">WhatsApp 614177711</CTAButton>
        </div>

        <p className="hero-trust">Atención en Chihuahua y alrededores</p>

        <div className="hero-stats">
          {heroStats.map((stat) => (
            <span key={stat}>{stat}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
