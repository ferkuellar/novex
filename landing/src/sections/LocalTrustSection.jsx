import React from 'react';
import CTAButton from '../components/CTAButton';

function LocalTrustSection() {
  return (
    <section className="section local-trust">
      <div className="container local-trust-wrap">
        <div>
          <p className="eyebrow">Cobertura local</p>
          <h2>Servicio en Chihuahua con atención cercana y ejecución profesional</h2>
          <p>
            Atendemos proyectos en Chihuahua, Chihuahua, y zonas cercanas, colaborando con propietarios,
            arquitectos, interioristas y desarrolladores que buscan acabados de alto nivel.
          </p>
        </div>
        <aside>
          <p><strong>WhatsApp: 614177711</strong></p>
          <p>Solicita atención y cotización</p>
          <CTAButton href="https://wa.me/52614177711">Iniciar conversación</CTAButton>
        </aside>
      </div>
    </section>
  );
}

export default LocalTrustSection;
