import React from 'react';
import SectionHeading from '../components/SectionHeading';

const projects = [
  ['Cocina de autor', 'Cuarzo', 'Chihuahua Norte', '/placeholders/project-1.svg'],
  ['Baño en suite', 'Mármol', 'Distrito Uno', '/placeholders/project-2.svg'],
  ['Isla escultural', 'Granito', 'Campestre', '/placeholders/project-3.svg'],
  ['Barra social', 'Cuarzo', 'San Felipe', '/placeholders/project-2.svg'],
  ['Recibidor residencial', 'Mármol', 'Reliz', '/placeholders/project-1.svg'],
  ['Cocina familiar', 'Granito', 'Cantera', '/placeholders/project-3.svg'],
  ['Vanity principal', 'Cuarzo', 'Quintas del Sol', '/placeholders/project-1.svg'],
  ['Área lounge', 'Mármol', 'Zona Centro', '/placeholders/project-2.svg'],
  ['Baño de visitas', 'Granito', 'Arboledas', '/placeholders/project-3.svg'],
  ['Cocina premium', 'Cuarzo', 'Bosques del Valle', '/placeholders/project-2.svg'],
  ['Comedor integrado', 'Mármol', 'Valle Escondido', '/placeholders/project-1.svg'],
  ['Isla monolítica', 'Granito', 'Presa Rejón', '/placeholders/project-3.svg'],
  ['Barra desayunador', 'Cuarzo', 'El Saucito', '/placeholders/project-2.svg'],
  ['Lobby comercial', 'Granito', 'Distrito 1', '/placeholders/project-1.svg'],
  ['Baño master', 'Mármol', 'Puerta de Hierro', '/placeholders/project-3.svg'],
];

function ProjectsSection() {
  return (
    <section className="section" id="proyectos">
      <div className="container">
        <SectionHeading
          title="Proyectos que hablan por sí solos"
          subtitle="Una selección curada de espacios residenciales y comerciales con composición, materialidad y acabado premium."
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
