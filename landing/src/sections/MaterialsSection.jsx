import React from 'react';
import SectionHeading from '../components/SectionHeading';

const materials = [
  {
    name: 'Mármol',
    desc: 'Vetas irrepetibles y presencia escultórica para interiores que buscan sofisticación atemporal.',
    label: 'Sofisticación atemporal',
    tone: 'marble',
    image: '/placeholders/material-marble.svg',
  },
  {
    name: 'Granito',
    desc: 'Superficie de gran dureza y desempeño estructural, ideal para cocinas de uso exigente.',
    label: 'Máxima durabilidad',
    tone: 'granite',
    image: '/placeholders/material-granite.svg',
  },
  {
    name: 'Cuarzo',
    desc: 'Acabado uniforme y contemporáneo con amplia variedad de tonos para proyectos de diseño limpio.',
    label: 'Diseño versátil',
    tone: 'quartz',
    image: '/placeholders/material-quartz.svg',
  },
];

function MaterialsSection() {
  return (
    <section className="section" id="materiales">
      <div className="container">
        <SectionHeading
          eyebrow="Materiales"
          title={
            <>
              <span className="section-title-main">Materiales que combinan estética y desempeño:</span>
              <span className="section-title-subline">valor a largo plazo</span>
            </>
          }
          subtitle="Seleccionamos mármol, granito y cuarzo según el lenguaje arquitectónico del proyecto, nivel de uso y mantenimiento esperado."
          centered
        />
        <div className="grid cards-3">
          {materials.map((item) => (
            <article key={item.name} className="material-card reveal">
              <div className={`material-media ${item.tone}`}>
                <img src={item.image} alt={`${item.name} en aplicación interior`} loading="lazy" />
              </div>
              <div className="material-body">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <span>{item.label}</span>
              </div>
            </article>
          ))}
        </div>
        <p className="advisory">
          Te asesoramos para elegir la superficie ideal según estilo, presupuesto y ritmo de uso diario.
        </p>
      </div>
    </section>
  );
}

export default MaterialsSection;
