import React from 'react';
import SectionHeading from '../components/SectionHeading';

const projects = [
  ['Cocina residencial', 'Cuarzo', 'Chihuahua Norte'],
  ['Isla central', 'Granito', 'Distrito Uno'],
  ['Baño principal', 'Mármol', 'San Felipe'],
  ['Barra social', 'Cuarzo', 'Quintas del Sol'],
  ['Recepción comercial', 'Granito', 'Zona Centro'],
  ['Cocina premium', 'Mármol', 'Campestre'],
];

function ProjectsSection() {
  return (
    <section className="section" id="proyectos">
      <div className="container">
        <SectionHeading
          title="Proyectos que hablan por sí solos"
          subtitle="Acabados pensados para integrarse con el diseño y destacar por su presencia."
          centered
        />
        <div className="gallery-grid">
          {projects.map(([category, material, zone], index) => (
            <article key={category + zone} className={`project-card p${index + 1} reveal`}>
              <div className="project-image" aria-hidden="true" />
              <div className="project-info">
                <p>{category}</p>
                <span>{material}</span>
                <small>{zone}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
