import React, { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';

function resolveApiBase() {
  const fromEnv = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window === 'undefined') return '';

  const { protocol, hostname } = window.location;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  if (isLocalHost) return `${protocol}//127.0.0.1:8787`;
  return '';
}

const API_BASE = resolveApiBase();
const PAGE_LIMIT = 24;

const fallbackProjects = [
  { id: 'fallback-1', title: 'Cocina de autor', material: 'Cuarzo', zone: 'Chihuahua Norte', imageUrl: '/placeholders/project-1.svg' },
  { id: 'fallback-2', title: 'Baño en suite', material: 'Mármol', zone: 'Distrito Uno', imageUrl: '/placeholders/project-2.svg' },
  { id: 'fallback-3', title: 'Isla escultural', material: 'Granito', zone: 'Campestre', imageUrl: '/placeholders/project-3.svg' },
  { id: 'fallback-4', title: 'Barra social', material: 'Cuarzo', zone: 'San Felipe', imageUrl: '/placeholders/project-2.svg' },
  { id: 'fallback-5', title: 'Recibidor residencial', material: 'Mármol', zone: 'Reliz', imageUrl: '/placeholders/project-1.svg' },
  { id: 'fallback-6', title: 'Cocina familiar', material: 'Granito', zone: 'Cantera', imageUrl: '/placeholders/project-3.svg' },
  { id: 'fallback-7', title: 'Vanity principal', material: 'Cuarzo', zone: 'Quintas del Sol', imageUrl: '/placeholders/project-1.svg' },
  { id: 'fallback-8', title: 'Área lounge', material: 'Mármol', zone: 'Zona Centro', imageUrl: '/placeholders/project-2.svg' },
  { id: 'fallback-9', title: 'Baño de visitas', material: 'Granito', zone: 'Arboledas', imageUrl: '/placeholders/project-3.svg' },
  { id: 'fallback-10', title: 'Cocina premium', material: 'Cuarzo', zone: 'Bosques del Valle', imageUrl: '/placeholders/project-2.svg' },
  { id: 'fallback-11', title: 'Comedor integrado', material: 'Mármol', zone: 'Valle Escondido', imageUrl: '/placeholders/project-1.svg' },
  { id: 'fallback-12', title: 'Isla monolítica', material: 'Granito', zone: 'Presa Rejón', imageUrl: '/placeholders/project-3.svg' },
  { id: 'fallback-13', title: 'Barra desayunador', material: 'Cuarzo', zone: 'El Saucito', imageUrl: '/placeholders/project-2.svg' },
  { id: 'fallback-14', title: 'Lobby comercial', material: 'Granito', zone: 'Distrito 1', imageUrl: '/placeholders/project-1.svg' },
  { id: 'fallback-15', title: 'Baño master', material: 'Mármol', zone: 'Puerta de Hierro', imageUrl: '/placeholders/project-3.svg' },
];

function normalizeProject(item, index) {
  return {
    id: item.id || `project-${index}`,
    title: item.title || item.category || 'Proyecto',
    material: item.material || 'Material',
    zone: item.zone || 'Chihuahua',
    imageUrl: item.imageUrl || item.image || '/placeholders/project-1.svg',
  };
}

function toImageSrc(imageUrl) {
  if (!imageUrl) return '/placeholders/project-1.svg';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (API_BASE && imageUrl.startsWith('/uploads/')) return `${API_BASE}${imageUrl}`;
  return imageUrl;
}

function fallbackImage(event) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = '/placeholders/project-1.svg';
}

function ProjectsSection() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadAllProjects = async () => {
      setIsLoading(true);
      try {
        const all = [];
        let cursor = 0;
        let guard = 0;
        const base = API_BASE || '';

        while (guard < 100) {
          const response = await fetch(`${base}/api/projects?limit=${PAGE_LIMIT}&cursor=${cursor}`);
          if (!response.ok) throw new Error('No se pudo consultar el portafolio.');

          const data = await response.json();
          const batch = Array.isArray(data.items)
            ? data.items.map((item, index) => normalizeProject(item, cursor + index))
            : [];

          if (batch.length) all.push(...batch);
          if (typeof data.nextCursor !== 'number') break;
          cursor = data.nextCursor;
          guard += 1;
        }

        if (!cancelled) {
          setProjects(all.length ? all : fallbackProjects);
        }
      } catch (error) {
        if (!cancelled) {
          setProjects(fallbackProjects);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadAllProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedProject]);

  return (
    <section className="section" id="proyectos">
      <div className="container">
        <SectionHeading
          title={<span className="section-title-main section-title-single-line">Proyectos que hablan por sí solos</span>}
          subtitle="Una selección curada de espacios residenciales y comerciales con composición, materialidad y acabado premium."
          centered
        />
        <div className="projects-marquee reveal" aria-label="Galería continua de proyectos">
          <div className="projects-lane lane-left">
            <div className="projects-track">
              {[0, 1].map((loop) => (
                <React.Fragment key={`top-loop-${loop}`}>
                  {projects.map((project, index) => (
                    <article
                      key={`top-${loop}-${project.id}-${index}`}
                      className="projects-slide"
                      aria-hidden={loop === 1}
                    >
                      <button
                        type="button"
                        className="projects-slide-button"
                        onClick={() => setSelectedProject(project)}
                        tabIndex={loop === 1 ? -1 : 0}
                        aria-label={`Ver detalles de ${project.title}`}
                        data-hover-label="Haz click para ver el proyecto"
                        title="Haz click para ver el proyecto"
                      >
                        <img
                          src={toImageSrc(project.imageUrl)}
                          alt={`${project.title} en ${project.zone}`}
                          loading="lazy"
                          onError={fallbackImage}
                        />
                      </button>
                    </article>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="projects-lane lane-right">
            <div className="projects-track">
              {[0, 1].map((loop) => (
                <React.Fragment key={`bottom-loop-${loop}`}>
                  {projects.map((project, index) => (
                    <article
                      key={`bottom-${loop}-${project.id}-${index}`}
                      className="projects-slide"
                      aria-hidden={loop === 1}
                    >
                      <button
                        type="button"
                        className="projects-slide-button"
                        onClick={() => setSelectedProject(project)}
                        tabIndex={loop === 1 ? -1 : 0}
                        aria-label={`Ver detalles de ${project.title}`}
                        data-hover-label="Haz click para ver el proyecto"
                        title="Haz click para ver el proyecto"
                      >
                        <img
                          src={toImageSrc(project.imageUrl)}
                          alt={`${project.title} en ${project.zone}`}
                          loading="lazy"
                          onError={fallbackImage}
                        />
                      </button>
                    </article>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {isLoading ? <p className="projects-loading">Cargando portafolio...</p> : null}
      </div>
      {selectedProject ? (
        <div
          className="project-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalles de ${selectedProject.title}`}
          onClick={() => setSelectedProject(null)}
        >
          <div className="project-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="project-modal-close"
              aria-label="Cerrar detalles del proyecto"
              onClick={() => setSelectedProject(null)}
            >
              ×
            </button>
            <div className="project-modal-image-wrap">
              <img
                src={toImageSrc(selectedProject.imageUrl)}
                alt={`${selectedProject.title} en ${selectedProject.zone}`}
                className="project-modal-image"
                onError={fallbackImage}
              />
            </div>
            <div className="project-modal-info">
              <p className="project-modal-title">{selectedProject.title}</p>
              <span className="project-modal-material">{selectedProject.material}</span>
              <small className="project-modal-zone">{selectedProject.zone}</small>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ProjectsSection;
