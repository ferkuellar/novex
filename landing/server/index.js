const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const PORT = Number(process.env.PORT || 8787);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'casa-pietra-admin';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'novex-admin-secret-change-me';
const ADMIN_TOKEN_TTL_HOURS = Math.min(Math.max(Number(process.env.ADMIN_TOKEN_TTL_HOURS || 24), 1), 168);

const seededProjects = [
  { id: 'seed-1', title: 'Cocina de autor', material: 'Cuarzo', zone: 'Chihuahua Norte', imageUrl: '/placeholders/project-1.svg' },
  { id: 'seed-2', title: 'Baño en suite', material: 'Mármol', zone: 'Distrito Uno', imageUrl: '/placeholders/project-2.svg' },
  { id: 'seed-3', title: 'Isla escultural', material: 'Granito', zone: 'Campestre', imageUrl: '/placeholders/project-3.svg' },
  { id: 'seed-4', title: 'Barra social', material: 'Cuarzo', zone: 'San Felipe', imageUrl: '/placeholders/project-2.svg' },
  { id: 'seed-5', title: 'Recibidor residencial', material: 'Mármol', zone: 'Reliz', imageUrl: '/placeholders/project-1.svg' },
  { id: 'seed-6', title: 'Cocina familiar', material: 'Granito', zone: 'Cantera', imageUrl: '/placeholders/project-3.svg' },
  { id: 'seed-7', title: 'Vanity principal', material: 'Cuarzo', zone: 'Quintas del Sol', imageUrl: '/placeholders/project-1.svg' },
  { id: 'seed-8', title: 'Área lounge', material: 'Mármol', zone: 'Zona Centro', imageUrl: '/placeholders/project-2.svg' },
  { id: 'seed-9', title: 'Baño de visitas', material: 'Granito', zone: 'Arboledas', imageUrl: '/placeholders/project-3.svg' },
  { id: 'seed-10', title: 'Cocina premium', material: 'Cuarzo', zone: 'Bosques del Valle', imageUrl: '/placeholders/project-2.svg' },
  { id: 'seed-11', title: 'Comedor integrado', material: 'Mármol', zone: 'Valle Escondido', imageUrl: '/placeholders/project-1.svg' },
  { id: 'seed-12', title: 'Isla monolítica', material: 'Granito', zone: 'Presa Rejón', imageUrl: '/placeholders/project-3.svg' },
  { id: 'seed-13', title: 'Barra desayunador', material: 'Cuarzo', zone: 'El Saucito', imageUrl: '/placeholders/project-2.svg' },
  { id: 'seed-14', title: 'Lobby comercial', material: 'Granito', zone: 'Distrito 1', imageUrl: '/placeholders/project-1.svg' },
  { id: 'seed-15', title: 'Baño master', material: 'Mármol', zone: 'Puerta de Hierro', imageUrl: '/placeholders/project-3.svg' },
].map((project, index) => {
  const createdAt = new Date(Date.UTC(2026, 0, 1, 12, index, 0)).toISOString();
  return { ...project, createdAt, updatedAt: createdAt };
});

const seededTestimonials = [
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
].map(([name, project, quote], index) => {
  const createdAt = new Date(Date.UTC(2026, 0, 2, 12, index, 0)).toISOString();
  return {
    id: `seed-testimonial-${index + 1}`,
    name,
    project,
    quote,
    createdAt,
    updatedAt: createdAt,
  };
});

function ensureArrayFile(filePath, fallbackItems) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallbackItems, null, 2));
    return;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(parsed)) {
      fs.writeFileSync(filePath, JSON.stringify(fallbackItems, null, 2));
    }
  } catch (error) {
    fs.writeFileSync(filePath, JSON.stringify(fallbackItems, null, 2));
  }
}

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  ensureArrayFile(PROJECTS_FILE, seededProjects);
  ensureArrayFile(TESTIMONIALS_FILE, seededTestimonials);
}

function readProjects() {
  try {
    const raw = fs.readFileSync(PROJECTS_FILE, 'utf8');
    const projects = JSON.parse(raw);
    return Array.isArray(projects) ? projects : [];
  } catch (error) {
    return [];
  }
}

function writeProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

function readTestimonials() {
  try {
    const raw = fs.readFileSync(TESTIMONIALS_FILE, 'utf8');
    const testimonials = JSON.parse(raw);
    return Array.isArray(testimonials) ? testimonials : [];
  } catch (error) {
    return [];
  }
}

function writeTestimonials(testimonials) {
  fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(testimonials, null, 2));
}

function parseLimit(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 6;
  return Math.min(Math.max(Math.trunc(parsed), 1), 24);
}

function parseCursor(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(Math.trunc(parsed), 0);
}

function toTimestamp(value) {
  const parsed = Date.parse(String(value || ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function isInternalUpload(url) {
  return typeof url === 'string' && url.startsWith('/uploads/');
}

function removeUploadIfExists(imageUrl) {
  if (!isInternalUpload(imageUrl)) return;
  const filePath = path.join(ROOT_DIR, imageUrl.replace(/^\//, ''));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function toBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function signValue(value) {
  return crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(value).digest('base64url');
}

function signToken(payload) {
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = toBase64Url(JSON.stringify(payload));
  const signature = signValue(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expected = signValue(`${header}.${body}`);

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return null;
  if (!crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload || payload.sub !== 'admin') return null;
    if (!Number.isFinite(payload.exp) || payload.exp <= Date.now()) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

function normalizePassword(value) {
  return String(value || '');
}

function passwordsMatch(inputPassword) {
  const input = Buffer.from(normalizePassword(inputPassword));
  const expected = Buffer.from(normalizePassword(ADMIN_PASSWORD));
  if (input.length !== expected.length) return false;
  return crypto.timingSafeEqual(input, expected);
}

function readAdminToken(req) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer') return '';
  return token || '';
}

function requireAdminAuth(req, res, next) {
  const payload = verifyToken(readAdminToken(req));
  if (!payload) {
    res.status(401).json({ error: 'Sesión inválida o expirada.' });
    return;
  }
  req.admin = payload;
  next();
}

ensureStorage();

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname || '').toLowerCase();
      const safeExtension = extension && extension.length <= 5 ? extension : '.jpg';
      cb(null, `${Date.now()}-${crypto.randomUUID()}${safeExtension}`);
    },
  }),
  limits: {
    fileSize: 12 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      cb(new Error('Solo se permiten archivos de imagen.'));
      return;
    }
    cb(null, true);
  },
});

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!passwordsMatch(password)) {
    res.status(401).json({ error: 'Contraseña incorrecta.' });
    return;
  }

  const expiresAt = Date.now() + (ADMIN_TOKEN_TTL_HOURS * 60 * 60 * 1000);
  const token = signToken({
    sub: 'admin',
    exp: expiresAt,
  });

  res.json({
    token,
    expiresAt,
  });
});

app.get('/api/admin/session', requireAdminAuth, (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/projects', (req, res) => {
  const limit = parseLimit(req.query.limit);
  const cursor = parseCursor(req.query.cursor);

  const projects = [...readProjects()].sort((a, b) => {
    const diff = toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
    if (diff !== 0) return diff;
    return String(b.id || '').localeCompare(String(a.id || ''));
  });
  const total = projects.length;
  const items = projects.slice(cursor, cursor + limit);
  const nextCursor = cursor + items.length < total ? cursor + items.length : null;

  res.json({
    items,
    total,
    nextCursor,
  });
});

app.get('/api/testimonials', (_req, res) => {
  const items = [...readTestimonials()].sort((a, b) => {
    const diff = toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
    if (diff !== 0) return diff;
    return String(b.id || '').localeCompare(String(a.id || ''));
  });

  res.json({
    items,
    total: items.length,
  });
});

app.post('/api/projects', requireAdminAuth, upload.single('image'), (req, res) => {
  const { title, material, zone, imageUrl } = req.body || {};
  const uploadedImagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const resolvedImageUrl = uploadedImagePath || (typeof imageUrl === 'string' ? imageUrl.trim() : '');

  if (!resolvedImageUrl) {
    res.status(400).json({ error: 'Debes enviar una imagen (archivo o imageUrl).' });
    return;
  }

  const now = new Date().toISOString();
  const newProject = {
    id: crypto.randomUUID(),
    title: (title || 'Proyecto destacado').trim(),
    material: (material || 'Material premium').trim(),
    zone: (zone || 'Chihuahua').trim(),
    imageUrl: resolvedImageUrl,
    createdAt: now,
    updatedAt: now,
  };

  const projects = readProjects();
  projects.unshift(newProject);
  writeProjects(projects);

  res.status(201).json(newProject);
});

app.patch('/api/projects/:id', requireAdminAuth, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, material, zone, imageUrl } = req.body || {};

  const projects = readProjects();
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Proyecto no encontrado.' });
    return;
  }

  const current = projects[index];
  const next = { ...current };

  if (typeof title === 'string' && title.trim()) next.title = title.trim();
  if (typeof material === 'string' && material.trim()) next.material = material.trim();
  if (typeof zone === 'string' && zone.trim()) next.zone = zone.trim();

  if (req.file) {
    const newImageUrl = `/uploads/${req.file.filename}`;
    removeUploadIfExists(current.imageUrl);
    next.imageUrl = newImageUrl;
  } else if (typeof imageUrl === 'string' && imageUrl.trim()) {
    if (current.imageUrl !== imageUrl.trim()) removeUploadIfExists(current.imageUrl);
    next.imageUrl = imageUrl.trim();
  }

  next.updatedAt = new Date().toISOString();
  projects[index] = next;
  writeProjects(projects);

  res.json(next);
});

app.delete('/api/projects/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const projects = readProjects();
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Proyecto no encontrado.' });
    return;
  }

  const [removed] = projects.splice(index, 1);
  removeUploadIfExists(removed.imageUrl);
  writeProjects(projects);

  res.status(204).send();
});

app.post('/api/testimonials', requireAdminAuth, (req, res) => {
  const { name, project, quote } = req.body || {};
  const cleanQuote = String(quote || '').trim();

  if (!cleanQuote) {
    res.status(400).json({ error: 'La experiencia no puede ir vacía.' });
    return;
  }

  const now = new Date().toISOString();
  const newTestimonial = {
    id: crypto.randomUUID(),
    name: String(name || '').trim() || 'Cliente',
    project: String(project || '').trim() || 'Proyecto residencial',
    quote: cleanQuote,
    createdAt: now,
    updatedAt: now,
  };

  const testimonials = readTestimonials();
  testimonials.unshift(newTestimonial);
  writeTestimonials(testimonials);

  res.status(201).json(newTestimonial);
});

app.patch('/api/testimonials/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { name, project, quote } = req.body || {};
  const testimonials = readTestimonials();
  const index = testimonials.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Experiencia no encontrada.' });
    return;
  }

  const current = testimonials[index];
  const next = { ...current };

  if (typeof name === 'string' && name.trim()) next.name = name.trim();
  if (typeof project === 'string' && project.trim()) next.project = project.trim();
  if (typeof quote === 'string' && quote.trim()) next.quote = quote.trim();

  next.updatedAt = new Date().toISOString();
  testimonials[index] = next;
  writeTestimonials(testimonials);

  res.json(next);
});

app.delete('/api/testimonials/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const testimonials = readTestimonials();
  const index = testimonials.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Experiencia no encontrada.' });
    return;
  }

  testimonials.splice(index, 1);
  writeTestimonials(testimonials);
  res.status(204).send();
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(400).json({ error: error.message || 'Solicitud inválida.' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Portfolio API activa en http://localhost:${PORT}`);
});
