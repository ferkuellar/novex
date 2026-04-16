import React from 'react';
import CTAButton from '../components/CTAButton';

function LocalTrustSection() {
  return (
    <section className="section local-trust">
      <div className="container local-trust-wrap">
        <div className="local-trust-copy">
          <p className="eyebrow">Cobertura local</p>
          <h2>Cobertura en Chihuahua con atención cercana y ejecución profesional</h2>
          <p className="local-trust-lead">
            Atendemos proyectos residenciales y comerciales en Chihuahua y zonas cercanas,
            colaborando con propietarios, arquitectos, interioristas y desarrolladores que buscan
            acabados de alto nivel.
          </p>
          <ul className="local-trust-list">
            <li>Asesoría técnica y estética según tipo de espacio y ritmo de uso.</li>
            <li>Coordinación puntual con obra nueva, remodelación o proyecto de interiorismo.</li>
            <li>Seguimiento claro desde la selección del material hasta la instalación final.</li>
          </ul>
        </div>
        <aside className="local-trust-card">
          <p className="local-trust-label">Contacto directo</p>
          <p className="local-trust-phone">WhatsApp: (614) 177 7711</p>
          <p className="local-trust-note">Solicita atención y cotización personalizada para tu proyecto.</p>
          <CTAButton href="https://wa.me/526141777711" className="local-trust-cta">Iniciar conversación</CTAButton>
        </aside>
      </div>
    </section>
  );
}

export default LocalTrustSection;
