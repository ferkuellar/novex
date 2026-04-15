import React from 'react';
import SectionHeading from '../components/SectionHeading';

const testimonials = [
  ['Laura M.', 'Remodelación de cocina', 'El acabado en cuarzo quedó impecable. Cumplieron en tiempo y cuidaron cada detalle de la instalación.'],
  ['Arq. Rodrigo S.', 'Proyecto residencial', 'Nos apoyaron desde la selección del material hasta la entrega final. Trabajo serio y bien ejecutado.'],
  ['Daniela P.', 'Baño principal', 'La atención fue clara y profesional. El resultado se integró perfecto con el diseño interior que buscábamos.'],
];

function TestimonialsSection() {
  return (
    <section className="section muted-section">
      <div className="container">
        <SectionHeading eyebrow="Testimonios" title="Experiencias reales de clientes en Chihuahua" />
        <div className="grid cards-3">
          {testimonials.map(([name, project, quote]) => (
            <article key={name} className="testimonial-card reveal">
              <p>“{quote}”</p>
              <h3>{name}</h3>
              <small>{project}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
