import React from 'react';
import SectionHeading from '../components/SectionHeading';

const steps = [
  ['1', 'Asesoría y levantamiento', 'Revisamos tu espacio, medidas y objetivos para definir la mejor solución.'],
  ['2', 'Selección de material', 'Te guiamos en textura, tono y prestaciones según estilo y exigencia de uso.'],
  ['3', 'Fabricación a medida', 'Cortamos y preparamos piezas con precisión para lograr un ensamble impecable.'],
  ['4', 'Instalación final', 'Realizamos montaje profesional, limpieza y entrega lista para disfrutar.'],
];

function ProcessSection() {
  return (
    <section className="section muted-section" id="proceso">
      <div className="container">
        <SectionHeading title="Un proceso claro, preciso y sin improvisaciones" centered />
        <div className="timeline">
          {steps.map(([num, title, text]) => (
            <article key={num} className="timeline-step reveal">
              <span className="step-number">{num}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
