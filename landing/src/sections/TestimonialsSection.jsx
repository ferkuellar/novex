import React, { useEffect, useMemo, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import localTestimonialsData from '../../server/data/testimonials.json';

function resolveApiBase() {
  const fromEnv = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
  if (typeof window === 'undefined') {
    return fromEnv ? [fromEnv] : [''];
  }

  const { protocol, hostname } = window.location;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  const preferredLocal = isLocalHost ? `${protocol}//127.0.0.1:8787` : '';
  const directHostProtocol = `${protocol}//${hostname}:8787`;
  const directHostHttp = `http://${hostname}:8787`;
  const relativeApi = '';

  // Prefer direct API host first; relative path can be a false-positive on static hosts.
  return Array.from(new Set([fromEnv, preferredLocal, directHostProtocol, directHostHttp, relativeApi].filter(Boolean)));
}

function normalizeTestimonial(item, index) {
  return {
    id: item.id || `testimonial-${index}`,
    name: item.name || 'Cliente',
    project: item.project || 'Proyecto residencial',
    quote: item.quote || '',
    createdAt: item.createdAt || '',
  };
}

const localTestimonialsFallback = (Array.isArray(localTestimonialsData) ? localTestimonialsData : [])
  .map((item, index) => normalizeTestimonial(item, index))
  .filter((item) => item.quote)
  .sort((a, b) => {
    const aTs = Date.parse(String(a.createdAt || ''));
    const bTs = Date.parse(String(b.createdAt || ''));
    if (Number.isFinite(aTs) && Number.isFinite(bTs) && aTs !== bTs) return bTs - aTs;
    return String(b.id || '').localeCompare(String(a.id || ''));
  });

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(localTestimonialsFallback);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState('');
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
  }, [testimonials, visibleCount]);
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
      const apiBaseCandidates = resolveApiBase();
      const successfulResponses = [];

      for (const base of apiBaseCandidates) {
        try {
          const response = await fetch(`${base}/api/testimonials?ts=${Date.now()}`, {
            cache: 'no-store',
          });
          if (!response.ok) continue;

          const contentType = String(response.headers.get('content-type') || '').toLowerCase();
          if (!contentType.includes('application/json')) continue;

          const data = await response.json().catch(() => null);
          if (!data || !Array.isArray(data.items)) continue;

          const items = data.items;
          const normalizedItems = items
            .map((item, index) => normalizeTestimonial(item, index))
            .filter((item) => item.quote)
            .sort((a, b) => {
              const aTs = Date.parse(String(a.createdAt || ''));
              const bTs = Date.parse(String(b.createdAt || ''));
              if (Number.isFinite(aTs) && Number.isFinite(bTs) && aTs !== bTs) return bTs - aTs;
              return String(b.id || '').localeCompare(String(a.id || ''));
            });

          successfulResponses.push({ base, items: normalizedItems });
        } catch (error) {
          // try next base
        }
      }

      if (cancelled) return;

      if (successfulResponses.length > 0) {
        const best = successfulResponses.sort((a, b) => b.items.length - a.items.length)[0];
        setTestimonials(best.items.length ? best.items : localTestimonialsFallback);
        setTestimonialsError(best.items.length ? '' : 'Mostrando respaldo local de experiencias.');
        setLoadingTestimonials(false);
        return;
      }

      if (!cancelled) {
        setTestimonials(localTestimonialsFallback);
        setLoadingTestimonials(false);
        setTestimonialsError(localTestimonialsFallback.length ? 'Mostrando respaldo local de experiencias.' : 'No se pudieron cargar las experiencias.');
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
  }, [visibleCount, testimonials.length]);

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
          {loadingTestimonials ? <p className="carousel-status">Cargando experiencias...</p> : null}
          {!loadingTestimonials && testimonialsError ? <p className="carousel-status">{testimonialsError}</p> : null}
          {!loadingTestimonials && !testimonialsError && testimonials.length === 0 ? (
            <p className="carousel-status">Aún no hay experiencias publicadas.</p>
          ) : null}
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
                disabled={totalPages <= 1}
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
                disabled={totalPages <= 1}
                onClick={() => {
                  setTransitionEnabled(true);
                  setSlideIndex((prev) => prev + 1);
                }}
              >
                →
              </button>
            </div>
            <p className="carousel-status" aria-live="polite">{totalPages ? activePage + 1 : 0} de {totalPages}</p>
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
