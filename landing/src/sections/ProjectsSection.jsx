import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const PAGE_SIZE = 6;

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

function ProjectsSection() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiActive, setApiActive] = useState(false);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  const loadProjects = useCallback(async (cursor = 0) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/projects?limit=${PAGE_SIZE}&cursor=${cursor}`);
      if (!response.ok) throw new Error('No se pudo consultar el portafolio.');

      const data = await response.json();
      const incoming = Array.isArray(data.items)
        ? data.items.map((item, index) => normalizeProject(item, cursor + index))
        : [];

      if (!incoming.length && cursor === 0) {
        setApiActive(false);
        setNextCursor(null);
        setProjects(fallbackProjects);
        return;
      }

      setApiActive(true);
      setProjects((previous) => {
        if (cursor === 0) return incoming;
        const merged = [...previous];
        const knownIds = new Set(previous.map((item) => item.id));
        incoming.forEach((item) => {
          if (!knownIds.has(item.id)) merged.push(item);
        });
        return merged;
      });
      setNextCursor(typeof data.nextCursor === 'number' ? data.nextCursor : null);
    } catch (error) {
      if (cursor === 0) {
        setApiActive(false);
        setProjects(fallbackProjects);
        setNextCursor(null);
      }
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects(0);
  }, [loadProjects]);

  useEffect(() => {
    if (!apiActive || nextCursor === null || !sentinelRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) loadProjects(nextCursor);
      },
      { rootMargin: '140px 0px' },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [apiActive, loadProjects, nextCursor]);

  const visibleProjects = useMemo(() => projects, [projects]);

  return (
    <section className="section" id="proyectos">
      <div className="container">
        <SectionHeading
          title="Proyectos que hablan por sí solos"
          subtitle="Una selección curada de espacios residenciales y comerciales con composición, materialidad y acabado premium."
          centered
        />
        <div className="gallery-grid">
          {visibleProjects.map((project, index) => (
            <article key={`${project.id}-${project.zone}`} className={`project-card p${index + 1} reveal`}>
              <div className="project-image">
                <img src={toImageSrc(project.imageUrl)} alt={`${project.title} en ${project.zone}`} loading="lazy" />
              </div>
              <div className="project-info">
                <p>{project.title}</p>
                <span>{project.material}</span>
                <small>{project.zone}</small>
              </div>
            </article>
          ))}
        </div>
        <div ref={sentinelRef} className="projects-sentinel" aria-hidden="true" />
        {isLoading && apiActive ? <p className="projects-loading">Cargando más proyectos...</p> : null}
      </div>
    </section>
  );
}

export default ProjectsSection;
