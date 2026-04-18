import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
const AUTH_STORAGE_KEY = 'novex_admin_token_v1';

const initialCreateState = {
  title: '',
  material: '',
  zone: '',
  imageUrl: '',
  imageFile: null,
};

const initialTestimonialState = {
  name: '',
  project: '',
  quote: '',
};

function toApiPath(pathname) {
  if (API_BASE) return `${API_BASE}${pathname}`;
  return pathname;
}

function toImageSrc(url) {
  if (!url) return '/placeholders/project-1.svg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (API_BASE && url.startsWith('/uploads/')) return `${API_BASE}${url}`;
  return url;
}

function fallbackImage(event) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = '/placeholders/project-1.svg';
}

function getStoredToken() {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) || '';
  } catch (error) {
    return '';
  }
}

function saveToken(token) {
  if (typeof window === 'undefined') return;
  try {
    if (!token) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(AUTH_STORAGE_KEY, token);
  } catch (error) {
    // no-op
  }
}

function authHeaders(token) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function fetchAllProjects() {
  const all = [];
  let cursor = 0;
  let guard = 0;

  while (guard < 100) {
    const response = await fetch(toApiPath(`/api/projects?limit=${PAGE_LIMIT}&cursor=${cursor}`));
    if (!response.ok) throw new Error('No se pudieron cargar proyectos.');
    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    all.push(...items);

    if (typeof data.nextCursor !== 'number') break;
    cursor = data.nextCursor;
    guard += 1;
  }

  return all;
}

async function fetchAllTestimonials() {
  const response = await fetch(toApiPath('/api/testimonials'));
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('API de experiencias no disponible. Reinicia el backend (npm run dev:api).');
    }
    throw new Error('No se pudieron cargar experiencias.');
  }
  const data = await response.json().catch(() => ({}));
  return Array.isArray(data.items) ? data.items : [];
}

function AdminPage() {
  const [token, setToken] = useState(getStoredToken);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeSection, setActiveSection] = useState('projects');

  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [testimonialsError, setTestimonialsError] = useState('');

  const [createForm, setCreateForm] = useState(initialCreateState);
  const [editingId, setEditingId] = useState('');
  const [editForm, setEditForm] = useState(initialCreateState);

  const [createTestimonialForm, setCreateTestimonialForm] = useState(initialTestimonialState);
  const [editingTestimonialId, setEditingTestimonialId] = useState('');
  const [editTestimonialForm, setEditTestimonialForm] = useState(initialTestimonialState);

  const editingProject = useMemo(
    () => projects.find((item) => item.id === editingId) || null,
    [editingId, projects],
  );

  const editingTestimonial = useMemo(
    () => testimonials.find((item) => item.id === editingTestimonialId) || null,
    [editingTestimonialId, testimonials],
  );

  const logout = useCallback((message = '') => {
    saveToken('');
    setToken('');
    setIsAuthenticated(false);
    setProjects([]);
    setTestimonials([]);
    setEditingId('');
    setEditForm(initialCreateState);
    setEditingTestimonialId('');
    setEditTestimonialForm(initialTestimonialState);
    setCreateForm(initialCreateState);
    setCreateTestimonialForm(initialTestimonialState);
    setActiveSection('projects');
    if (message) setAuthError(message);
  }, []);

  const refreshProjects = useCallback(async () => {
    setProjectsLoading(true);
    setError('');
    try {
      const data = await fetchAllProjects();
      setProjects(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Error cargando portafolio.');
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const refreshTestimonials = useCallback(async () => {
    setTestimonialsLoading(true);
    setTestimonialsError('');
    try {
      const data = await fetchAllTestimonials();
      setTestimonials(data);
    } catch (fetchError) {
      setTestimonialsError(fetchError.message || 'Error cargando experiencias.');
    } finally {
      setTestimonialsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      if (!token) {
        if (!cancelled) {
          setIsAuthenticated(false);
          setAuthChecking(false);
        }
        return;
      }

      setAuthChecking(true);
      setAuthError('');

      try {
        const response = await fetch(toApiPath('/api/admin/session'), {
          headers: authHeaders(token),
        });

        if (!response.ok) throw new Error('Sesion invalida o expirada.');

        if (!cancelled) {
          setIsAuthenticated(true);
          await Promise.all([refreshProjects(), refreshTestimonials()]);
        }
      } catch (sessionError) {
        if (!cancelled) {
          logout(sessionError.message || 'Inicia sesion para continuar.');
        }
      } finally {
        if (!cancelled) setAuthChecking(false);
      }
    };

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [logout, refreshProjects, refreshTestimonials, token]);

  const onCreateChange = (key, value) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  };

  const onEditChange = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const onCreateTestimonialChange = (key, value) => {
    setCreateTestimonialForm((prev) => ({ ...prev, [key]: value }));
  };

  const onEditTestimonialChange = (key, value) => {
    setEditTestimonialForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetCreateForm = () => {
    setCreateForm(initialCreateState);
  };

  const resetCreateTestimonialForm = () => {
    setCreateTestimonialForm(initialTestimonialState);
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditForm({
      title: project.title || '',
      material: project.material || '',
      zone: project.zone || '',
      imageUrl: project.imageUrl || '',
      imageFile: null,
    });
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditForm(initialCreateState);
  };

  const startEditTestimonial = (testimonial) => {
    setEditingTestimonialId(testimonial.id);
    setEditTestimonialForm({
      name: testimonial.name || '',
      project: testimonial.project || '',
      quote: testimonial.quote || '',
    });
  };

  const cancelEditTestimonial = () => {
    setEditingTestimonialId('');
    setEditTestimonialForm(initialTestimonialState);
  };

  const handleUnauthorizedIfNeeded = async (response) => {
    if (response.status !== 401) return false;
    logout('Tu sesion expiro. Vuelve a iniciar sesion.');
    return true;
  };

  const login = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setAuthError('');

    try {
      const response = await fetch(toApiPath('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.token) {
        throw new Error(data.error || 'No se pudo iniciar sesion.');
      }

      saveToken(data.token);
      setToken(data.token);
      setLoginPassword('');
    } catch (loginError) {
      setAuthError(loginError.message || 'Error de autenticacion.');
    } finally {
      setSubmitting(false);
    }
  };

  const createProject = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('title', createForm.title.trim());
      payload.append('material', createForm.material.trim());
      payload.append('zone', createForm.zone.trim());

      if (createForm.imageFile) {
        payload.append('image', createForm.imageFile);
      } else if (createForm.imageUrl.trim()) {
        payload.append('imageUrl', createForm.imageUrl.trim());
      }

      const response = await fetch(toApiPath('/api/projects'), {
        method: 'POST',
        headers: authHeaders(token),
        body: payload,
      });

      if (await handleUnauthorizedIfNeeded(response)) return;

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo crear el proyecto.');
      }

      resetCreateForm();
      await refreshProjects();
    } catch (createError) {
      setError(createError.message || 'Error creando proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateProject = async (event) => {
    event.preventDefault();
    if (!editingProject) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('title', editForm.title.trim());
      payload.append('material', editForm.material.trim());
      payload.append('zone', editForm.zone.trim());

      if (editForm.imageFile) {
        payload.append('image', editForm.imageFile);
      } else if (editForm.imageUrl.trim()) {
        payload.append('imageUrl', editForm.imageUrl.trim());
      }

      const response = await fetch(toApiPath(`/api/projects/${editingProject.id}`), {
        method: 'PATCH',
        headers: authHeaders(token),
        body: payload,
      });

      if (await handleUnauthorizedIfNeeded(response)) return;

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar el proyecto.');
      }

      cancelEdit();
      await refreshProjects();
    } catch (updateError) {
      setError(updateError.message || 'Error actualizando proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeProject = async (project) => {
    const accepted = window.confirm(`Eliminar "${project.title}" del portafolio?`);
    if (!accepted) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(toApiPath(`/api/projects/${project.id}`), {
        method: 'DELETE',
        headers: authHeaders(token),
      });

      if (await handleUnauthorizedIfNeeded(response)) return;

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo eliminar el proyecto.');
      }

      if (editingId === project.id) cancelEdit();
      await refreshProjects();
    } catch (deleteError) {
      setError(deleteError.message || 'Error eliminando proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  const createTestimonial = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setTestimonialsError('');

    try {
      const payload = {
        name: createTestimonialForm.name.trim(),
        project: createTestimonialForm.project.trim(),
        quote: createTestimonialForm.quote.trim(),
      };

      const response = await fetch(toApiPath('/api/testimonials'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(token),
        },
        body: JSON.stringify(payload),
      });

      if (await handleUnauthorizedIfNeeded(response)) return;

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API de experiencias no disponible. Reinicia el backend (npm run dev:api).');
        }
        throw new Error(data.error || 'No se pudo crear la experiencia.');
      }

      resetCreateTestimonialForm();
      await refreshTestimonials();
    } catch (createError) {
      setTestimonialsError(createError.message || 'Error creando experiencia.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateTestimonial = async (event) => {
    event.preventDefault();
    if (!editingTestimonial) return;

    setSubmitting(true);
    setTestimonialsError('');

    try {
      const payload = {
        name: editTestimonialForm.name.trim(),
        project: editTestimonialForm.project.trim(),
        quote: editTestimonialForm.quote.trim(),
      };

      const response = await fetch(toApiPath(`/api/testimonials/${editingTestimonial.id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(token),
        },
        body: JSON.stringify(payload),
      });

      if (await handleUnauthorizedIfNeeded(response)) return;

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API de experiencias no disponible. Reinicia el backend (npm run dev:api).');
        }
        throw new Error(data.error || 'No se pudo actualizar la experiencia.');
      }

      cancelEditTestimonial();
      await refreshTestimonials();
    } catch (updateError) {
      setTestimonialsError(updateError.message || 'Error actualizando experiencia.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeTestimonial = async (testimonial) => {
    const accepted = window.confirm(`Eliminar la experiencia de "${testimonial.name}"?`);
    if (!accepted) return;

    setSubmitting(true);
    setTestimonialsError('');

    try {
      const response = await fetch(toApiPath(`/api/testimonials/${testimonial.id}`), {
        method: 'DELETE',
        headers: authHeaders(token),
      });

      if (await handleUnauthorizedIfNeeded(response)) return;

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 404) {
          throw new Error('API de experiencias no disponible. Reinicia el backend (npm run dev:api).');
        }
        throw new Error(data.error || 'No se pudo eliminar la experiencia.');
      }

      if (editingTestimonialId === testimonial.id) cancelEditTestimonial();
      await refreshTestimonials();
    } catch (deleteError) {
      setTestimonialsError(deleteError.message || 'Error eliminando experiencia.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authChecking) {
    return (
      <div className="admin-page">
        <div className="admin-shell">
          <section className="admin-card">
            <p className="admin-status">Verificando sesion...</p>
          </section>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-shell">
          <header className="admin-header">
            <div>
              <p className="admin-kicker">Panel interno</p>
              <h1>Acceso Admin</h1>
              <p className="admin-subtitle">Ingresa la contrasena para administrar el portafolio.</p>
            </div>
            <a className="admin-back-link" href="/">Volver al sitio</a>
          </header>

          <section className="admin-card">
            <form className="admin-form-grid" onSubmit={login}>
              <label htmlFor="admin-password" className="admin-span-2">
                Contrasena
                <input
                  id="admin-password"
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="********"
                  autoComplete="current-password"
                  required
                />
              </label>

              <div className="admin-actions admin-span-2">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                  {submitting ? 'Entrando...' : 'Iniciar sesion'}
                </button>
              </div>
              {authError ? <p className="admin-error admin-span-2">{authError}</p> : null}
            </form>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">Panel interno</p>
            <h1>Administrar Portafolio</h1>
            <p className="admin-subtitle">
              Elige Proyectos o Experiencias para capturar informacion sin saturar la vista.
            </p>
          </div>
          <div className="admin-header-actions">
            <a className="admin-back-link" href="/">Volver al sitio</a>
            <button type="button" className="admin-btn admin-btn-ghost" onClick={() => logout()}>
              Cerrar sesion
            </button>
          </div>
          <div className="admin-section-switch" role="tablist" aria-label="Secciones de administracion">
            <button
              type="button"
              role="tab"
              className={`admin-section-tab ${activeSection === 'projects' ? 'active' : ''}`}
              aria-selected={activeSection === 'projects'}
              onClick={() => setActiveSection('projects')}
            >
              Proyectos
            </button>
            <button
              type="button"
              role="tab"
              className={`admin-section-tab ${activeSection === 'testimonials' ? 'active' : ''}`}
              aria-selected={activeSection === 'testimonials'}
              onClick={() => setActiveSection('testimonials')}
            >
              Experiencias
            </button>
          </div>
        </header>

        {activeSection === 'projects' ? (
          <>
            <section className="admin-card">
              <h2>Nuevo proyecto</h2>
              <form className="admin-form-grid" onSubmit={createProject}>
                <label htmlFor="new-title">
                  Titulo
                  <input
                    id="new-title"
                    type="text"
                    value={createForm.title}
                    onChange={(event) => onCreateChange('title', event.target.value)}
                    placeholder="Ej. Cocina de autor"
                    required
                  />
                </label>

                <label htmlFor="new-material">
                  Material
                  <input
                    id="new-material"
                    type="text"
                    value={createForm.material}
                    onChange={(event) => onCreateChange('material', event.target.value)}
                    placeholder="Ej. Cuarzo"
                    required
                  />
                </label>

                <label htmlFor="new-zone">
                  Zona
                  <input
                    id="new-zone"
                    type="text"
                    value={createForm.zone}
                    onChange={(event) => onCreateChange('zone', event.target.value)}
                    placeholder="Ej. Chihuahua Norte"
                    required
                  />
                </label>

                <label htmlFor="new-image-url">
                  URL de imagen (opcional)
                  <input
                    id="new-image-url"
                    type="url"
                    value={createForm.imageUrl}
                    onChange={(event) => onCreateChange('imageUrl', event.target.value)}
                    placeholder="https://..."
                  />
                </label>

                <label htmlFor="new-image-file" className="admin-span-2">
                  Subir imagen
                  <input
                    id="new-image-file"
                    type="file"
                    accept="image/*"
                    onChange={(event) => onCreateChange('imageFile', event.target.files?.[0] || null)}
                  />
                </label>

                <div className="admin-actions admin-span-2">
                  <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                    {submitting ? 'Guardando...' : 'Agregar proyecto'}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={resetCreateForm}
                    disabled={submitting}
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </section>

            <section className="admin-card">
              <h2>Proyectos existentes</h2>
              {projectsLoading ? <p className="admin-status">Cargando proyectos...</p> : null}
              {!projectsLoading && !projects.length ? <p className="admin-status">Aun no hay proyectos.</p> : null}
              {error ? <p className="admin-error">{error}</p> : null}

              <div className="admin-projects-list admin-scroll-grid">
                {projects.map((project) => (
                  <article key={project.id} className="admin-project-row">
                    <img
                      src={toImageSrc(project.imageUrl)}
                      alt={project.title}
                      className="admin-thumb"
                      loading="lazy"
                      onError={fallbackImage}
                    />

                    <div className="admin-project-meta">
                      <p className="admin-project-title">{project.title}</p>
                      <p className="admin-project-detail">{project.material} · {project.zone}</p>
                      <small className="admin-project-id">{project.id}</small>
                    </div>

                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost"
                        onClick={() => startEdit(project)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => removeProject(project)}
                        disabled={submitting}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {editingProject ? (
              <section className="admin-card">
                <h2>Editar proyecto</h2>
                <form className="admin-form-grid" onSubmit={updateProject}>
                  <label htmlFor="edit-title">
                    Titulo
                    <input
                      id="edit-title"
                      type="text"
                      value={editForm.title}
                      onChange={(event) => onEditChange('title', event.target.value)}
                      required
                    />
                  </label>

                  <label htmlFor="edit-material">
                    Material
                    <input
                      id="edit-material"
                      type="text"
                      value={editForm.material}
                      onChange={(event) => onEditChange('material', event.target.value)}
                      required
                    />
                  </label>

                  <label htmlFor="edit-zone">
                    Zona
                    <input
                      id="edit-zone"
                      type="text"
                      value={editForm.zone}
                      onChange={(event) => onEditChange('zone', event.target.value)}
                      required
                    />
                  </label>

                  <label htmlFor="edit-image-url">
                    URL de imagen (opcional)
                    <input
                      id="edit-image-url"
                      type="url"
                      value={editForm.imageUrl}
                      onChange={(event) => onEditChange('imageUrl', event.target.value)}
                      placeholder="https://..."
                    />
                  </label>

                  <label htmlFor="edit-image-file" className="admin-span-2">
                    Reemplazar imagen
                    <input
                      id="edit-image-file"
                      type="file"
                      accept="image/*"
                      onChange={(event) => onEditChange('imageFile', event.target.files?.[0] || null)}
                    />
                  </label>

                  <div className="admin-actions admin-span-2">
                    <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                      {submitting ? 'Actualizando...' : 'Guardar cambios'}
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      onClick={cancelEdit}
                      disabled={submitting}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </section>
            ) : null}
          </>
        ) : (
          <>
            <section className="admin-card">
              <h2>Nueva experiencia</h2>
              <form className="admin-form-grid" onSubmit={createTestimonial}>
                <label htmlFor="new-testimonial-name">
                  Nombre
                  <input
                    id="new-testimonial-name"
                    type="text"
                    value={createTestimonialForm.name}
                    onChange={(event) => onCreateTestimonialChange('name', event.target.value)}
                    placeholder="Ej. Laura M."
                    required
                  />
                </label>

                <label htmlFor="new-testimonial-project">
                  Tipo de proyecto
                  <input
                    id="new-testimonial-project"
                    type="text"
                    value={createTestimonialForm.project}
                    onChange={(event) => onCreateTestimonialChange('project', event.target.value)}
                    placeholder="Ej. Remodelacion de cocina"
                    required
                  />
                </label>

                <label htmlFor="new-testimonial-quote" className="admin-span-2">
                  Experiencia
                  <textarea
                    id="new-testimonial-quote"
                    value={createTestimonialForm.quote}
                    onChange={(event) => onCreateTestimonialChange('quote', event.target.value)}
                    placeholder="Comparte la experiencia del cliente..."
                    required
                  />
                </label>

                <div className="admin-actions admin-span-2">
                  <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                    {submitting ? 'Guardando...' : 'Agregar experiencia'}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={resetCreateTestimonialForm}
                    disabled={submitting}
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </section>

            <section className="admin-card">
              <h2>Experiencias existentes</h2>
              {testimonialsLoading ? <p className="admin-status">Cargando experiencias...</p> : null}
              {!testimonialsLoading && !testimonials.length ? <p className="admin-status">Aun no hay experiencias.</p> : null}
              {testimonialsError ? <p className="admin-error">{testimonialsError}</p> : null}

              <div className="admin-testimonials-list admin-scroll-grid">
                {testimonials.map((testimonial) => (
                  <article key={testimonial.id} className="admin-testimonial-row">
                    <div className="admin-testimonial-meta">
                      <p className="admin-project-title">{testimonial.name}</p>
                      <p className="admin-project-detail">{testimonial.project}</p>
                      <p className="admin-testimonial-quote">"{testimonial.quote}"</p>
                      <small className="admin-project-id">{testimonial.id}</small>
                    </div>

                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost"
                        onClick={() => startEditTestimonial(testimonial)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => removeTestimonial(testimonial)}
                        disabled={submitting}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {editingTestimonial ? (
              <section className="admin-card">
                <h2>Editar experiencia</h2>
                <form className="admin-form-grid" onSubmit={updateTestimonial}>
                  <label htmlFor="edit-testimonial-name">
                    Nombre
                    <input
                      id="edit-testimonial-name"
                      type="text"
                      value={editTestimonialForm.name}
                      onChange={(event) => onEditTestimonialChange('name', event.target.value)}
                      required
                    />
                  </label>

                  <label htmlFor="edit-testimonial-project">
                    Tipo de proyecto
                    <input
                      id="edit-testimonial-project"
                      type="text"
                      value={editTestimonialForm.project}
                      onChange={(event) => onEditTestimonialChange('project', event.target.value)}
                      required
                    />
                  </label>

                  <label htmlFor="edit-testimonial-quote" className="admin-span-2">
                    Experiencia
                    <textarea
                      id="edit-testimonial-quote"
                      value={editTestimonialForm.quote}
                      onChange={(event) => onEditTestimonialChange('quote', event.target.value)}
                      required
                    />
                  </label>

                  <div className="admin-actions admin-span-2">
                    <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                      {submitting ? 'Actualizando...' : 'Guardar cambios'}
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      onClick={cancelEditTestimonial}
                      disabled={submitting}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
