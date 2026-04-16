import React from 'react';
import SectionHeading from '../components/SectionHeading';

const services = [
  {
    title: 'Cubiertas para cocina',
    text: 'Diseños funcionales con estética premium para cocinas residenciales y de autor.',
    icon: 'kitchen',
  },
  {
    title: 'Cubiertas para baño',
    text: 'Superficies elegantes con soluciones adaptadas a humedad, uso y formato.',
    icon: 'bathroom',
  },
  {
    title: 'Barras e islas',
    text: 'Piezas protagonistas para integrar cocina, comedor y áreas sociales con carácter.',
    icon: 'island',
  },
  {
    title: 'Cubiertas para espacios comerciales',
    text: 'Acabados de alto nivel para recepciones, bares, retail y hospitalidad.',
    icon: 'commercial',
  },
  {
    title: 'Fabricación a medida',
    text: 'Cada proyecto se corta y prepara de acuerdo con medidas reales en obra.',
    icon: 'fabrication',
  },
  {
    title: 'Instalación profesional',
    text: 'Montaje preciso, limpieza en sitio y atención al detalle en cada unión.',
    icon: 'installation',
  },
];

function ServiceSymbol({ type }) {
  const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.75',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };

  switch (type) {
    case 'kitchen':
      return (
        <svg {...iconProps}>
          <path d="M4 10h16v8H4z" />
          <path d="M8 10V7h8v3" />
          <circle cx="9" cy="14" r="1.1" />
          <path d="M15 12.5v3" />
        </svg>
      );
    case 'bathroom':
      return (
        <svg {...iconProps}>
          <path d="M6 13h12v2.3a2.7 2.7 0 0 1-2.7 2.7H8.7A2.7 2.7 0 0 1 6 15.3z" />
          <path d="M8.4 13V9.6a2.1 2.1 0 0 1 4.2 0V11" />
          <path d="M12.6 11h3.2" />
        </svg>
      );
    case 'island':
      return (
        <svg {...iconProps}>
          <path d="M3.5 9h17" />
          <path d="M5.5 9v5.2a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9" />
          <path d="M8.5 18.2v2M15.5 18.2v2" />
        </svg>
      );
    case 'commercial':
      return (
        <svg {...iconProps}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M9 20v-5h6v5" />
          <path d="M8 10h.01M12 10h.01M16 10h.01" />
        </svg>
      );
    case 'fabrication':
      return (
        <svg {...iconProps}>
          <path d="M4 7h16v10H4z" />
          <path d="M8 7v10M12 7v6M16 7v10" />
          <path d="M4 12h16" />
        </svg>
      );
    case 'installation':
      return (
        <svg {...iconProps}>
          <path d="M12 3l7 3v5c0 4.4-2.9 7.5-7 10-4.1-2.5-7-5.6-7-10V6z" />
          <path d="M9 12.2l2 2 4-4" />
        </svg>
      );
    default:
      return null;
  }
}

function ServicesSection() {
  return (
    <section className="section muted-section">
      <div className="container">
        <SectionHeading eyebrow="Servicios" title="Soluciones completas para proyectos residenciales y comerciales" />
        <div className="grid cards-3">
          {services.map(({ title, text, icon }) => (
            <article key={title} className="service-card reveal">
              <div className="service-icon" aria-hidden="true">
                <ServiceSymbol type={icon} />
              </div>
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
