import React from 'react';
import CTAButton from '../components/CTAButton';

function LocalTrustSection() {
  return (
    <section className="section local-trust">
      <div className="container local-trust-wrap">
        <div className="local-trust-copy">
          <p className="eyebrow">Cobertura local</p>
          <h2>
            <span className="section-title-main">Cobertura en Chihuahua</span>
            <span className="section-title-subline">con atención cercana y ejecución profesional</span>
          </h2>
          <p className="local-trust-lead">
            Atendemos proyectos residenciales y comerciales en Chihuahua y zonas cercanas,
            colaborando con propietarios, arquitectos, interioristas y desarrolladores que buscan
            acabados de alto nivel.
          </p>
          <p className="local-trust-detail">
            Participamos en obra nueva y remodelación para cocinas, baños, barras, islas,
            recepciones y espacios comerciales, coordinando levantamiento, validación de medidas,
            fabricación e instalación con una comunicación clara en cada etapa.
          </p>
          <ul className="local-trust-list">
            <li>Asesoría técnica y estética según tipo de espacio, nivel de uso y presupuesto.</li>
            <li>Coordinación puntual con obra nueva, remodelación o proyecto de interiorismo.</li>
            <li>Seguimiento claro desde la selección del material hasta la instalación final en sitio.</li>
            <li>Atención cercana en Chihuahua y zonas próximas con respuesta ágil por WhatsApp.</li>
          </ul>
        </div>
        <aside className="local-trust-card">
          <p className="local-trust-label">Contacto directo</p>
          <p className="local-trust-phone">WhatsApp: (614) 177 7711</p>
          <p className="local-trust-note">Solicita atención y cotización personalizada para tu proyecto.</p>
          <CTAButton href="https://wa.me/526141777711" className="local-trust-cta">Hablar por WhatsApp</CTAButton>
          <figure className="local-trust-media">
            <img
              src="/placeholders/hero-countertop.svg"
              alt="Detalle de cubierta en proyecto local"
              loading="lazy"
            />
          </figure>
        </aside>
      </div>
    </section>
  );
}

export default LocalTrustSection;
