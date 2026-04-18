import React, { useCallback, useEffect, useMemo, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const PAGE_LIMIT = 24;
const AUTH_STORAGE_KEY = 'novex_admin_token_v1';

const initialCreateState = {
  title: '',
  material: '',
  zone: '',
  imageUrl: '',
  imageFile: null,
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

function AdminPage() {
  const [token, setToken] = useState(getStoredToken);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createForm, setCreateForm] = useState(initialCreateState);
  const [editingId, setEditingId] = useState('');
  const [editForm, setEditForm] = useState(initialCreateState);

  const editingProject = useMemo(
    () => projects.find((item) => item.id === editingId) || null,
    [editingId, projects],
  );

  const logout = useCallback((message = '') => {
    saveToken('');
    setToken('');
    setIsAuthenticated(false);
    setProjects([]);
    setEditingId('');
    setEditForm(initialCreateState);
    if (message) setAuthError(message);
  }, []);

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllProjects();
      setProjects(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Error cargando portafolio.');
    } finally {
      setLoading(false);
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

        if (!response.ok) throw new Error('Sesión inválida o expirada.');

        if (!cancelled) {
          setIsAuthenticated(true);
          await refreshProjects();
        }
      } catch (sessionError) {
        if (!cancelled) {
          logout(sessionError.message || 'Inicia sesión para continuar.');
        }
      } finally {
        if (!cancelled) setAuthChecking(false);
      }
    };

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [logout, refreshProjects, token]);

  const onCreateChange = (key, value) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  };

  const onEditChange = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetCreateForm = () => {
    setCreateForm(initialCreateState);
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

  const handleUnauthorizedIfNeeded = async (response) => {
    if (response.status !== 401) return false;
    logout('Tu sesión expiró. Vuelve a iniciar sesión.');
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
        throw new Error(data.error || 'No se pudo iniciar sesión.');
      }

      saveToken(data.token);
      setToken(data.token);
      setLoginPassword('');
    } catch (loginError) {
      setAuthError(loginError.message || 'Error de autenticación.');
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
    const accepted = window.confirm(`¿Eliminar "${project.title}" del portafolio?`);
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

  if (authChecking) {
    return (
      <div className="admin-page">
        <div className="admin-shell">
          <section className="admin-card">
            <p className="admin-status">Verificando sesión...</p>
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
              <p className="admin-subtitle">Ingresa la contraseña para administrar el portafolio.</p>
            </div>
            <a className="admin-back-link" href="/">Volver al sitio</a>
          </header>

          <section className="admin-card">
            <form className="admin-form-grid" onSubmit={login}>
              <label htmlFor="admin-password" className="admin-span-2">
                Contraseña
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
                  {submitting ? 'Entrando...' : 'Iniciar sesión'}
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
              Agrega, edita o elimina proyectos sin tocar el código del sitio.
            </p>
          </div>
          <div className="admin-header-actions">
            <a className="admin-back-link" href="/">Volver al sitio</a>
            <button type="button" className="admin-btn admin-btn-ghost" onClick={() => logout()}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <section className="admin-card">
          <h2>Nuevo proyecto</h2>
          <form className="admin-form-grid" onSubmit={createProject}>
            <label htmlFor="new-title">
              Título
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
          {loading ? <p className="admin-status">Cargando proyectos...</p> : null}
          {!loading && !projects.length ? <p className="admin-status">Aún no hay proyectos.</p> : null}
          {error ? <p className="admin-error">{error}</p> : null}

          <div className="admin-projects-list">
            {projects.map((project) => (
              <article key={project.id} className="admin-project-row">
                <img
                  src={toImageSrc(project.imageUrl)}
                  alt={project.title}
                  className="admin-thumb"
                  loading="lazy"
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
                Título
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
      </div>
    </div>
  );
}

export default AdminPage;
