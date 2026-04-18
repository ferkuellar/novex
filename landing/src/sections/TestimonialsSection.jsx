import React, { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';

const testimonials = [
  ['Laura M.', 'Remodelación de cocina', 'El acabado en cuarzo quedó impecable. Cumplieron en tiempo y cuidaron cada detalle de la instalación.'],
  ['Arq. Rodrigo S.', 'Proyecto residencial', 'Nos apoyaron desde la selección del material hasta la entrega final. Trabajo serio y bien ejecutado.'],
  ['Daniela P.', 'Baño principal', 'La atención fue clara y profesional. El resultado se integró perfecto con el diseño interior que buscábamos.'],
  ['Mónica R.', 'Cocina integral', 'Desde la primera visita nos explicaron todo con claridad. El resultado superó por mucho lo que imaginábamos.'],
  ['Ing. Javier C.', 'Casa nueva', 'Gran nivel de detalle en cortes, cantos y uniones. Se nota el cuidado en cada fase del proceso.'],
  ['Sofía L.', 'Isla y barra social', 'La propuesta de material fue exacta para nuestro estilo. Instalación limpia y muy bien coordinada.'],
  ['Carlos T.', 'Remodelación completa', 'Cumplieron tiempos y cuidaron la obra. La cubierta quedó impecable y elevó todo el espacio.'],
  ['Mariana G.', 'Proyecto comercial', 'Nos ayudaron a balancear imagen y funcionalidad. Excelente comunicación durante todo el proyecto.'],
  ['Arq. Fernanda P.', 'Interiorismo residencial', 'Su ejecución respeta por completo la intención de diseño. Equipo profesional y puntual.'],
  ['Luis A.', 'Cocina campestre', 'Muy buena asesoría para elegir entre granito y cuarzo. El acabado final luce premium.'],
  ['Patricia V.', 'Baño y tocador', 'Atención cercana y respuesta rápida. El resultado se integró perfecto con nuestro mobiliario.'],
  ['Eduardo N.', 'Departamento nuevo', 'Trabajo serio, ordenado y con gran presentación. Recomendables para proyectos exigentes.'],
  ['Claudia H.', 'Renovación de cocina', 'La diferencia está en los detalles. Se ve elegante, sólido y de alta calidad.'],
  ['Arq. Iván D.', 'Desarrollo residencial', 'Coordinación excelente con obra y entregas puntuales. Muy buen estándar de instalación.'],
  ['Gabriela S.', 'Proyecto familiar', 'Recibimos acompañamiento de principio a fin. Quedamos felices con el material y la terminación.'],
  ['Renata M.', 'Cocina contemporánea', 'Nos orientaron muy bien para elegir el acabado. El resultado final se ve limpio, elegante y funcional.'],
  ['Miguel Á.', 'Barra para terraza', 'Excelente ejecución en cortes y cantos. La pieza quedó firme, bien nivelada y lista para uso diario.'],
  ['Arq. Paola R.', 'Remodelación integral', 'Aportaron soluciones prácticas durante obra y cuidaron tiempos. La instalación fue ordenada y profesional.'],
  ['Héctor B.', 'Recepción comercial', 'Necesitábamos una imagen sobria y resistente. Cumplieron con calidad, detalle y muy buena comunicación.'],
  ['Valeria C.', 'Baño secundario', 'El equipo llegó puntual, trabajó con cuidado y dejó todo limpio. Quedamos muy satisfechos con el acabado.'],
];

function TestimonialsSection() {
  const total = testimonials.length;
  const [visibleCount, setVisibleCount] = useState(4);
  const [activePage, setActivePage] = useState(0);
  const [paused, setPaused] = useState(false);
  const pages = [];
  for (let i = 0; i < total; i += visibleCount) {
    pages.push(testimonials.slice(i, i + visibleCount));
  }
  const totalPages = pages.length;

  const goTo = (index) => {
    const next = (index + totalPages) % totalPages;
    setActivePage(next);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 759px)');
    const syncVisibleCount = () => {
      setVisibleCount(mediaQuery.matches ? 1 : 4);
    };

    syncVisibleCount();
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncVisibleCount);
      return () => mediaQuery.removeEventListener('change', syncVisibleCount);
    }

    mediaQuery.addListener(syncVisibleCount);
    return () => mediaQuery.removeListener(syncVisibleCount);
  }, []);

  useEffect(() => {
    if (activePage >= totalPages) {
      setActivePage(Math.max(0, totalPages - 1));
    }
  }, [activePage, totalPages]);

  useEffect(() => {
    if (paused) return undefined;
    const interval = setInterval(() => {
      setActivePage((prev) => (prev + 1) % totalPages);
    }, 6500);
    return () => clearInterval(interval);
  }, [paused, totalPages]);

  return (
    <section className="section muted-section">
      <div className="container">
        <SectionHeading
          eyebrow="Testimonios"
          title={
            <>
              <span className="section-title-main">Experiencias reales</span>
              <span className="section-title-subline">de clientes en Chihuahua</span>
            </>
          }
        />
        <div
          className="testimonials-carousel reveal"
          style={{ '--cards-per-view': visibleCount }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="testimonials-viewport">
            <div
              className="testimonials-track"
              style={{ transform: `translateX(-${activePage * 100}%)` }}
            >
              {pages.map((page, pageIndex) => (
                <div key={`page-${pageIndex}`} className="carousel-page">
                  {page.map(([name, project, quote]) => (
                    <article key={name + project} className="testimonial-card carousel-card">
                      <p>“{quote}”</p>
                      <h3>{name}</h3>
                      <small>{project}</small>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="testimonials-nav">
            <div className="testimonials-arrows">
              <button
                type="button"
                className="carousel-arrow"
                aria-label="Testimonio anterior"
                onClick={() => goTo(activePage - 1)}
              >
                ←
              </button>
              <button
                type="button"
                className="carousel-arrow"
                aria-label="Siguiente testimonio"
                onClick={() => goTo(activePage + 1)}
              >
                →
              </button>
            </div>
            <p className="carousel-status" aria-live="polite">{activePage + 1} de {totalPages}</p>
          </div>

          <div className="carousel-dots" role="tablist" aria-label="Navegación de testimonios">
            {pages.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                role="tab"
                aria-label={`Ir al bloque ${index + 1}`}
                aria-selected={activePage === index}
                className={`carousel-dot ${activePage === index ? 'active' : ''}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
