# NOVEX Landing Page

Este proyecto es una landing page profesional, moderna y responsiva creada con React y Vite.

## Desarrollo

Para iniciar el entorno de desarrollo ejecuta:

```bash
npm install
npm run dev:api
npm run dev
```

`npm run dev:api` levanta el backend de portafolio en `http://localhost:8787`.
El frontend de Vite usa proxy para `/api` y `/uploads`, así que no necesitas cambiar el diseño ni rutas.

## Panel Admin

Abre el panel en:

- `http://localhost:5173/admin`

Funciones del panel:

- Crear proyecto (título, material, zona e imagen por archivo o URL)
- Editar proyecto
- Eliminar proyecto

Nota: En producción, si entras directo a `/admin`, tu hosting debe tener fallback de SPA para servir `index.html`.
Nota de seguridad: este panel ya incluye login básico; en producción usa una contraseña robusta y restringe el acceso por IP o VPN.

### Login básico admin

El panel `/admin` usa contraseña + token de sesión.

Variables opcionales del backend:

- `ADMIN_PASSWORD` (default: `casa-pietra-admin`)
- `ADMIN_TOKEN_SECRET` (default interno; cámbialo en producción)
- `ADMIN_TOKEN_TTL_HOURS` (default: `24`)

Ejemplo:

```bash
ADMIN_PASSWORD="tu-clave-segura" ADMIN_TOKEN_SECRET="otro-secreto" npm run dev:api
```

## Backend de Portafolio

El backend incluye:

- `GET /api/projects?limit=6&cursor=0` (paginado)
- `POST /api/projects` (crear proyecto con imagen)
- `PATCH /api/projects/:id` (editar)
- `DELETE /api/projects/:id` (eliminar)
- `POST /api/admin/login` (obtener token)
- `GET /api/admin/session` (validar sesión)

Archivos:

- `server/index.js`: API Express
- `server/data/projects.json`: catálogo persistente
- `server/uploads/`: imágenes subidas

### Subir un proyecto por API

```bash
curl -X POST http://localhost:8787/api/projects \
  -F "title=Cocina negra" \
  -F "material=Granito" \
  -F "zone=Chihuahua" \
  -F "image=@/ruta/a/tu-imagen.jpg"
```

## Construcción

Para generar los archivos de producción ejecuta:

```bash
npm run build
```

Luego puedes desplegarlos en SiteGround o cualquier otro hosting.
