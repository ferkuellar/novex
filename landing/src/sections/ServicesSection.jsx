import React from 'react';
import SectionHeading from '../components/SectionHeading';

const services = [
  ['Cubiertas para cocina', 'Diseños funcionales con estética premium para cocinas residenciales y de autor.'],
  ['Cubiertas para baño', 'Superficies elegantes con soluciones adaptadas a humedad, uso y formato.'],
  ['Barras e islas', 'Piezas protagonistas para integrar cocina, comedor y áreas sociales con carácter.'],
  ['Cubiertas para espacios comerciales', 'Acabados de alto nivel para recepciones, bares, retail y hospitalidad.'],
  ['Fabricación a medida', 'Cada proyecto se corta y prepara de acuerdo con medidas reales en obra.'],
  ['Instalación profesional', 'Montaje preciso, limpieza en sitio y atención al detalle en cada unión.'],
];

function ServicesSection() {
  return (
    <section className="section muted-section">
      <div className="container">
        <SectionHeading eyebrow="Servicios" title="Soluciones completas para proyectos residenciales y comerciales" />
        <div className="grid cards-3">
          {services.map(([title, text]) => (
            <article key={title} className="service-card reveal">
              <div className="service-icon" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
