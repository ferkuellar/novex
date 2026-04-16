import React from 'react';
import SectionHeading from '../components/SectionHeading';

const blocks = [
  {
    title: 'Selección experta de materiales',
    text: 'Te orientamos entre mármol, granito y cuarzo según estilo arquitectónico, uso diario y presupuesto.',
  },
  {
    title: 'Precisión en fabricación',
    text: 'Trabajamos con medidas exactas, uniones limpias y detalles que respetan la intención del diseño interior.',
  },
  {
    title: 'Instalación limpia y profesional',
    text: 'Nuestro equipo ejecuta con cuidado en sitio para proteger el espacio y entregar un resultado impecable.',
  },
  {
    title: 'Resultado duradero y elegante',
    text: 'Creamos cubiertas que combinan presencia estética, resistencia y desempeño para uso residencial o comercial.',
  },
];

function ValueSection() {
  return (
    <section className="section muted-section" id="nosotros">
      <div className="container">
        <SectionHeading
          eyebrow="Nuestra propuesta"
          title="Más que una cubierta: una pieza que define el espacio"
          subtitle="Combinamos dirección estética, criterio técnico y ejecución precisa para elevar el resultado final."
          centered
        />
        <div className="grid cards-4">
          {blocks.map((item) => (
            <article key={item.title} className="card reveal">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ValueSection;
