import React from 'react';
import SectionHeading from '../components/SectionHeading';

const reasons = [
  ['Atención personalizada', 'Seguimiento directo durante cada fase, desde la idea inicial hasta la entrega final.'],
  ['Acabados precisos', 'Cantos, uniones y superficies ejecutadas con estándar premium y control de detalle.'],
  ['Cumplimiento en tiempos', 'Planificación realista y coordinación puntual para respetar tus fechas de proyecto.'],
  ['Imagen y funcionalidad en equilibrio', 'Superficies que se ven impecables y responden bien al uso diario.'],
];

function WhyUsSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          centered
          title={
            <>
              <span className="section-title-main">Por qué nuestros clientes</span>
              <span className="section-title-subline">nos eligen</span>
            </>
          }
        />
        <div className="grid cards-4">
          {reasons.map(([title, text]) => (
            <article key={title} className="feature-card reveal">
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyUsSection;
