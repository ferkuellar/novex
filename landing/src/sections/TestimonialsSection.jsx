import React, { useEffect, useMemo, useState } from 'react';
import SectionHeading from '../components/SectionHeading';

function resolveApiBase() {
  const fromEnv = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
  if (typeof window === 'undefined') {
    return fromEnv ? [fromEnv] : [''];
  }

  const { protocol, hostname } = window.location;
  const directHostProtocol = `${protocol}//${hostname}:8787`;
  const directHostHttp = `http://${hostname}:8787`;
  const relativeApi = '';

  return Array.from(new Set([fromEnv, relativeApi, directHostProtocol, directHostHttp].filter(Boolean)));
}

const API_BASE_CANDIDATES = resolveApiBase();

const fallbackTestimonials = [
  { id: 'fallback-t-1', name: 'Laura M.', project: 'Remodelación de cocina', quote: 'El acabado en cuarzo quedó impecable. Cumplieron en tiempo y cuidaron cada detalle de la instalación.' },
  { id: 'fallback-t-2', name: 'Arq. Rodrigo S.', project: 'Proyecto residencial', quote: 'Nos apoyaron desde la selección del material hasta la entrega final. Trabajo serio y bien ejecutado.' },
  { id: 'fallback-t-3', name: 'Daniela P.', project: 'Baño principal', quote: 'La atención fue clara y profesional. El resultado se integró perfecto con el diseño interior que buscábamos.' },
  { id: 'fallback-t-4', name: 'Mónica R.', project: 'Cocina integral', quote: 'Desde la primera visita nos explicaron todo con claridad. El resultado superó por mucho lo que imaginábamos.' },
  { id: 'fallback-t-5', name: 'Ing. Javier C.', project: 'Casa nueva', quote: 'Gran nivel de detalle en cortes, cantos y uniones. Se nota el cuidado en cada fase del proceso.' },
  { id: 'fallback-t-6', name: 'Sofía L.', project: 'Isla y barra social', quote: 'La propuesta de material fue exacta para nuestro estilo. Instalación limpia y muy bien coordinada.' },
  { id: 'fallback-t-7', name: 'Carlos T.', project: 'Remodelación completa', quote: 'Cumplieron tiempos y cuidaron la obra. La cubierta quedó impecable y elevó todo el espacio.' },
  { id: 'fallback-t-8', name: 'Mariana G.', project: 'Proyecto comercial', quote: 'Nos ayudaron a balancear imagen y funcionalidad. Excelente comunicación durante todo el proyecto.' },
  { id: 'fallback-t-9', name: 'Arq. Fernanda P.', project: 'Interiorismo residencial', quote: 'Su ejecución respeta por completo la intención de diseño. Equipo profesional y puntual.' },
  { id: 'fallback-t-10', name: 'Luis A.', project: 'Cocina campestre', quote: 'Muy buena asesoría para elegir entre granito y cuarzo. El acabado final luce premium.' },
  { id: 'fallback-t-11', name: 'Patricia V.', project: 'Baño y tocador', quote: 'Atención cercana y respuesta rápida. El resultado se integró perfecto con nuestro mobiliario.' },
  { id: 'fallback-t-12', name: 'Eduardo N.', project: 'Departamento nuevo', quote: 'Trabajo serio, ordenado y con gran presentación. Recomendables para proyectos exigentes.' },
  { id: 'fallback-t-13', name: 'Claudia H.', project: 'Renovación de cocina', quote: 'La diferencia está en los detalles. Se ve elegante, sólido y de alta calidad.' },
  { id: 'fallback-t-14', name: 'Arq. Iván D.', project: 'Desarrollo residencial', quote: 'Coordinación excelente con obra y entregas puntuales. Muy buen estándar de instalación.' },
  { id: 'fallback-t-15', name: 'Gabriela S.', project: 'Proyecto familiar', quote: 'Recibimos acompañamiento de principio a fin. Quedamos felices con el material y la terminación.' },
  { id: 'fallback-t-16', name: 'Renata M.', project: 'Cocina contemporánea', quote: 'Nos orientaron muy bien para elegir el acabado. El resultado final se ve limpio, elegante y funcional.' },
  { id: 'fallback-t-17', name: 'Miguel Á.', project: 'Barra para terraza', quote: 'Excelente ejecución en cortes y cantos. La pieza quedó firme, bien nivelada y lista para uso diario.' },
  { id: 'fallback-t-18', name: 'Arq. Paola R.', project: 'Remodelación integral', quote: 'Aportaron soluciones prácticas durante obra y cuidaron tiempos. La instalación fue ordenada y profesional.' },
  { id: 'fallback-t-19', name: 'Héctor B.', project: 'Recepción comercial', quote: 'Necesitábamos una imagen sobria y resistente. Cumplieron con calidad, detalle y muy buena comunicación.' },
  { id: 'fallback-t-20', name: 'Valeria C.', project: 'Baño secundario', quote: 'El equipo llegó puntual, trabajó con cuidado y dejó todo limpio. Quedamos muy satisfechos con el acabado.' },
];

function normalizeTestimonial(item, index) {
  return {
    id: item.id || `testimonial-${index}`,
    name: item.name || 'Cliente',
    project: item.project || 'Proyecto residencial',
    quote: item.quote || '',
  };
}

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [visibleCount, setVisibleCount] = useState(4);
  const [slideIndex, setSlideIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [paused, setPaused] = useState(false);
  const pages = useMemo(() => {
    const grouped = [];
    for (let i = 0; i < testimonials.length; i += visibleCount) {
      grouped.push(testimonials.slice(i, i + visibleCount));
    }
    return grouped;
  }, [visibleCount]);
  const totalPages = pages.length;

  const activePage = useMemo(() => {
    if (!totalPages) return 0;
    if (slideIndex === 0) return totalPages - 1;
    if (slideIndex === totalPages + 1) return 0;
    return slideIndex - 1;
  }, [slideIndex, totalPages]);

  const infinitePages = useMemo(() => {
    if (!totalPages) return [];
    return [pages[totalPages - 1], ...pages, pages[0]];
  }, [pages, totalPages]);

  const goTo = (index) => {
    if (!totalPages) return;
    const normalized = (index + totalPages) % totalPages;
    setTransitionEnabled(true);
    setSlideIndex(normalized + 1);
  };

  useEffect(() => {
    let cancelled = false;

    const loadTestimonials = async () => {
      let loaded = false;

      for (const base of API_BASE_CANDIDATES) {
        try {
          const response = await fetch(`${base}/api/testimonials?ts=${Date.now()}`, { cache: 'no-store' });
          if (!response.ok) continue;

          const data = await response.json();
          const items = Array.isArray(data.items)
            ? data.items.map((item, index) => normalizeTestimonial(item, index))
            : [];

          if (!cancelled) {
            setTestimonials(items.length ? items : fallbackTestimonials);
          }
          loaded = true;
          break;
        } catch (error) {
          // try next base
        }
      }

      if (!loaded && !cancelled) {
        setTestimonials(fallbackTestimonials);
      }
    };

    loadTestimonials();
    const refreshInterval = window.setInterval(loadTestimonials, 15000);
    const onFocus = () => loadTestimonials();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') loadTestimonials();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(refreshInterval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

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
    setTransitionEnabled(false);
    setSlideIndex(1);
  }, [visibleCount]);

  useEffect(() => {
    if (paused || totalPages <= 1) return undefined;
    const interval = setInterval(() => {
      setTransitionEnabled(true);
      setSlideIndex((prev) => prev + 1);
    }, 5200);
    return () => clearInterval(interval);
  }, [paused, totalPages]);

  const handleTransitionEnd = () => {
    if (!totalPages) return;
    if (slideIndex === 0) {
      setTransitionEnabled(false);
      setSlideIndex(totalPages);
      return;
    }

    if (slideIndex === totalPages + 1) {
      setTransitionEnabled(false);
      setSlideIndex(1);
    }
  };

  useEffect(() => {
    if (transitionEnabled) return;
    const frame = window.requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [transitionEnabled]);

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
              style={{
                transform: `translateX(-${slideIndex * 100}%)`,
                transition: transitionEnabled ? undefined : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {infinitePages.map((page, pageIndex) => (
                <div key={`page-${pageIndex}-${page[0]?.id || 'empty'}`} className="carousel-page">
                  {page.map((item) => (
                    <article key={item.id} className="testimonial-card carousel-card">
                      <p>“{item.quote}”</p>
                      <h3>{item.name}</h3>
                      <small>{item.project}</small>
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
                onClick={() => {
                  setTransitionEnabled(true);
                  setSlideIndex((prev) => prev - 1);
                }}
              >
                ←
              </button>
              <button
                type="button"
                className="carousel-arrow"
                aria-label="Siguiente testimonio"
                onClick={() => {
                  setTransitionEnabled(true);
                  setSlideIndex((prev) => prev + 1);
                }}
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
