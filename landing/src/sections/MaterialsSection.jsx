import React from 'react';
import SectionHeading from '../components/SectionHeading';

const materials = [
  {
    name: 'Mármol',
    desc: 'Vetas únicas y presencia escultórica para proyectos que buscan sofisticación atemporal.',
    label: 'Elegancia natural',
    tone: 'marble',
  },
  {
    name: 'Granito',
    desc: 'Material de carácter sólido y alta resistencia, ideal para cocinas de uso intenso.',
    label: 'Alta resistencia',
    tone: 'granite',
  },
  {
    name: 'Cuarzo',
    desc: 'Estética contemporánea con amplia variedad de tonos y una superficie de fácil cuidado.',
    label: 'Bajo mantenimiento',
    tone: 'quartz',
  },
];

function MaterialsSection() {
  return (
    <section className="section" id="materiales">
      <div className="container">
        <SectionHeading eyebrow="Materiales" title="Mármol, granito y cuarzo para espacios de alto nivel" />
        <div className="grid cards-3">
          {materials.map((item) => (
            <article key={item.name} className="material-card reveal">
              <div className={`material-media ${item.tone}`} aria-hidden="true" />
              <div className="material-body">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <span>{item.label}</span>
              </div>
            </article>
          ))}
        </div>
        <p className="advisory">
          Te ayudamos a elegir el material correcto según diseño, uso y presupuesto.
        </p>
      </div>
    </section>
  );
}

export default MaterialsSection;
