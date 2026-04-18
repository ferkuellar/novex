import React from 'react';
import CTAButton from '../components/CTAButton';

function FinalCtaSection() {
  return (
    <section className="section final-cta">
      <div className="container">
        <div className="final-cta-wrap">
          <p className="eyebrow">Listo para iniciar</p>
          <h2 className="final-cta-title">
            <span className="final-cta-title-main">Haz que tu cocina, baño o proyecto destaque</span>
            <span className="final-cta-title-subline">con una cubierta de alto nivel</span>
          </h2>
          <p className="final-cta-copy">
            Solicita una cotización y recibe atención personalizada para elegir la mejor opción
            en mármol, granito o cuarzo.
          </p>
          <ul className="final-cta-points">
            <li>Asesoría personalizada</li>
            <li>Diseño y fabricación a medida</li>
            <li>Instalación profesional</li>
          </ul>
          <div className="final-cta-actions">
            <CTAButton href="#contacto">Solicitar cotización</CTAButton>
            <CTAButton href="https://wa.me/526141777711" variant="light">Hablar por WhatsApp</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCtaSection;
