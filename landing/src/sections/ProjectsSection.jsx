import React from 'react';
import SectionHeading from '../components/SectionHeading';

const projects = [
  ['Cocina residencial', 'Cuarzo', 'Chihuahua Norte', '/placeholders/project-1.svg'],
  ['Isla central', 'Granito', 'Distrito Uno', '/placeholders/project-2.svg'],
  ['Baño principal', 'Mármol', 'San Felipe', '/placeholders/project-3.svg'],
  ['Barra social', 'Cuarzo', 'Quintas del Sol', '/placeholders/project-1.svg'],
  ['Recepción comercial', 'Granito', 'Zona Centro', '/placeholders/project-3.svg'],
  ['Cocina premium', 'Mármol', 'Campestre', '/placeholders/project-2.svg'],
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
          {projects.map(([category, material, zone, image], index) => (
            <article key={category + zone} className={`project-card p${index + 1} reveal`}>
              <div className="project-image">
                <img src={image} alt={`${category} en ${zone}`} loading="lazy" />
              </div>
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
