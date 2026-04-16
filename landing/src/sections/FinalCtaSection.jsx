import React from 'react';
import CTAButton from '../components/CTAButton';

function FinalCtaSection() {
  return (
    <section className="section final-cta">
      <div className="container final-cta-wrap">
        <p className="eyebrow">Listo para iniciar</p>
        <h2>Haz que tu cocina, baño o proyecto destaque con una cubierta de alto nivel</h2>
        <p>
          Solicita una cotización y recibe atención personalizada para elegir la mejor opción
          en mármol, granito o cuarzo.
        </p>
        <div className="final-cta-points">
          <span>Asesoría personalizada</span>
          <span>Diseño y fabricación a medida</span>
          <span>Instalación profesional</span>
        </div>
        <div className="hero-cta-group">
          <CTAButton href="#contacto">Cotizar ahora</CTAButton>
          <CTAButton href="https://wa.me/526141777711" variant="light">Enviar WhatsApp</CTAButton>
        </div>
      </div>
    </section>
  );
}

export default FinalCtaSection;
