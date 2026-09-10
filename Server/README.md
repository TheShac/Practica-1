# Server — API REST (Postgrado de Historia UTA)

Backend en Node.js + Express 5 del [Sistema de Gestión Académica — Postgrado de Historia UTA](../README.md). Expone la API REST consumida por el [Frontend](../Frontend/README.md), gestiona autenticación, producción científica, reportes de acreditación, notificaciones en tiempo real y el envío de correo a través de una cola respaldada por Redis.

> Documentación relacionada: [README general](../README.md) · [DOCUMENTATION.md](../DOCUMENTATION.md) · [Frontend/README.md](../Frontend/README.md)

## Tabla de contenidos

1. [Requisitos e instalación](#1-requisitos-e-instalación)
2. [Scripts](#2-scripts)
3. [Variables de entorno](#3-variables-de-entorno)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [Módulos](#5-módulos)
6. [Sistema de colas de correo (BullMQ)](#6-sistema-de-colas-de-correo-bullmq)
7. [Middlewares](#7-middlewares)
8. [Referencia de endpoints](#8-referencia-de-endpoints)

---

## 1. Requisitos e instalación

- Node.js ≥ 18
- pnpm ≥ 8
- MySQL 8 con el esquema importado (ver [`../database/Dump20260728.sql`](../database/Dump20260728.sql))
- Redis en ejecución (sesiones OAuth + cola BullMQ)

```bash
cd Server
pnpm install
```

Crear `Server/.env` (ver [sección de variables](#3-variables-de-entorno)) y luego:

```bash
pnpm dev
```

El servidor queda disponible en `http://localhost:3000` (o el `PORT` configurado). El punto de entrada único de la API es `/api` (ver [`src/app.js`](src/app.js)).

---

## 2. Scripts

| Script             | Comando                                    | Descripción                                                                                                                       |
| ------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`       | `tsx watch src/server.js`                | Desarrollo, con recarga automática.                                                                                               |
| `pnpm start`     | `node --import tsx/esm src/server.js`    | Producción.                                                                                                                       |
| `pnpm email:dev` | `email dev --dir src/emails --port 3001` | Previsualiza en`http://localhost:3001` las plantillas de correo de [`src/emails/`](src/emails/) con React Email, sin enviarlas. |

> El proyecto usa `tsx` como runtime (no hay build/compilación de TypeScript real, pero `tsconfig.json` habilita JSX en archivos `.jsx` para las plantillas de correo).

---

## 3. Variables de entorno

| Variable                                                                  | Descripción                                                                                                                               | Ejemplo                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `PORT`                                                                  | Puerto del servidor                                                                                                                        | `3000`                                           |
| `NODE_ENV`                                                              | `development` o `production`. Controla `secure` de cookies, y si se monta Bull Board (`/admin/queues`, solo fuera de producción). | `development`                                    |
| `FRONTEND_URL`                                                          | URL del frontend — usada en CORS, cookies y enlaces de los correos (recuperación, error de login Google)                                 | `http://localhost:5173`                          |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME`   | Conexión al pool de MySQL (`src/config/db.js`)                                                                                          | —                                                 |
| `REDIS_HOST` / `REDIS_PORT`                                           | Conexión a Redis, usada por`express-session` (login Google) y por BullMQ (cola de correo)                                               | `localhost` / `6379`                           |
| `SESSION_SECRET`                                                        | Secreto de`express-session`, respaldada por `connect-redis`                                                                            | cadena aleatoria larga                             |
| `JWT_SECRET` / `JWT_EXPIRES_IN`                                       | Firma y expiración del access token                                                                                                       | `15m`                                            |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRES_IN`                       | Firma y expiración del refresh token (cookie HttpOnly)                                                                                    | `7d`                                             |
| `RESEND_API_KEY`                                                        | API key de[Resend](https://resend.com), usada por `email.service.js` para el envío real                                                  | —                                                 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | Credenciales OAuth 2.0 para el login con Google (`passport-google-oauth20`). Opcionales — solo si se habilita ese flujo.                | `http://localhost:3000/api/auth/google/callback` |

No hay `.env.example` en el repositorio — usa la plantilla de variables del [README general](../README.md#3-configurar-el-servidor-server).

---

## 4. Estructura de carpetas

```
Server/
└── src/
    ├── app.js                # Configuración de Express: middlewares, sesión, Bull Board, montaje de /api
    ├── server.js              # Arranque del servidor HTTP
    ├── config/
    │   ├── db.js               # Pool de conexión MySQL
    │   └── cron.js             # Tareas programadas
    ├── core/
    │   ├── sse.manager.js         # Registro de conexiones SSE activas por usuario
    │   ├── sseTicketStore.js      # Tickets SSE de un solo uso (in-memory)
    │   └── tokenRevocationStore.js # Revocación de refresh tokens (in-memory)
    ├── middlewares/
    │   ├── auth.js             # auth(), authSSE(), authorizeRoles()
    │   └── rateLimiter.js      # loginLimiter, globalLimiter
    ├── emails/                # Plantillas de correo (React Email, .jsx) + renderEmails.jsx
    ├── modules/
    │   ├── users/
    │   │   ├── auth/               # Login RUT+password, refresh, logout, Google OAuth, ticket SSE
    │   │   ├── email-verification/ # Registro y verificación del correo organizacional
    │   │   └── user/                # CRUD de usuarios, roles, roles académicos, perfiles
    │   ├── password-reset/     # Solicitud y confirmación de recuperación de contraseña
    │   ├── email/                # Envío de correos (Resend) + registro en email_logs
    │   ├── queue/                # Cola BullMQ: email.queue.js, email.worker.js, quota.service.js, redis.client.js, bull-board.js
    │   ├── configuration/       # Configuración del sistema y dominios de correo permitidos (Admin)
    │   ├── dashboard/            # Dashboard del Admin: métricas de correos y notificaciones
    │   ├── produccion-cientifica/  # publicaciones, libro, cap-libro, tesis, investigacion, patente,
    │   │                            # proyectos-intervenciones, consultorias, categorias
    │   └── profesional-apoyo/
    │       ├── notificacion/    # Notificaciones (creación, SSE, lectura, envío por correo)
    │       ├── ficha/            # Ficha académica y exportación a Excel
    │       ├── reporte/          # Reporte general y promedios por programa
    │       └── dashboard/        # Dashboard de la secretaría: actividad reciente
    ├── routes/
    │   ├── index.routes.js      # Punto de entrada: monta /categorias, /notificaciones y los 4 "portales"
    │   └── portals/
    │       ├── public.routes.js             # /auth, /password-reset, /email-verification
    │       ├── admin.routes.js              # /users, /dashboard, /configuracion (requiere auth)
    │       ├── academico.routes.js          # /tesis, /publicaciones, /libros, ... (rutas propias del académico)
    │       └── profesional-apoyo.routes.js  # /profesional-apoyo, /ficha, /home-profesional, + módulos compartidos
    └── utils/
        ├── dominio.util.js       # Valida el dominio de un correo contra dominio_permitido
        └── rut.js                 # Utilidades de validación/formato de RUT
```

---

## 5. Módulos

| Módulo                            | Responsabilidad                                                                                                                                                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users/auth`                     | Login con RUT/contraseña, refresh de access token, logout (revocación), login con Google (Passport), emisión de tickets SSE.                                                                                                                                                       |
| `users/email-verification`       | Registro del correo organizacional, envío/confirmación de código de verificación, reenvío con límite, verificación manual por un Admin.                                                                                                                                        |
| `users/user`                     | CRUD de usuarios, roles del sistema, roles académicos (Claustro/Colaborador), perfil completo del académico (datos, grados, titulaciones, correos).                                                                                                                                 |
| `password-reset`                 | Solicitud de recuperación (solo si el correo organizacional está verificado) y confirmación con token de un solo uso.                                                                                                                                                              |
| `email`                          | Envío efectivo de correos vía Resend, resolución del remitente configurado y registro de cada intento en`email_logs`.                                                                                                                                                            |
| `queue`                          | Cola`email` sobre BullMQ/Redis: encolado con reintentos, worker con control de cuota diaria/mensual, cliente Redis y panel Bull Board (dev).                                                                                                                                        |
| `configuration`                  | Parámetros del sistema (`configuracion_sistema`: remitente, expiraciones, límites) y gestión de `dominio_permitido`. Solo Admin.                                                                                                                                               |
| `dashboard`                      | Métricas para el panel del Admin: estado de correos (cuota, fallidos, pendientes, historial) y de notificaciones.                                                                                                                                                                    |
| `produccion-cientifica/*`        | Un submódulo por tipo de producción (publicaciones, libro, cap-libro, tesis, investigacion, patente, proyectos-intervenciones, consultorias) y`categorias` (catálogo de categorías de publicación). Cada uno sigue el mismo patrón CRUD `mías` / `academico/:usuarioId`. |
| `profesional-apoyo/notificacion` | Notificaciones globales o dirigidas, con emisión SSE en vivo y envío opcional por correo.                                                                                                                                                                                           |
| `profesional-apoyo/ficha`        | Ficha académica consolidada por usuario y su exportación a Excel (completa o filtrada por Magíster).                                                                                                                                                                               |
| `profesional-apoyo/reporte`      | Reporte general agregado por programa y promedios de producción (Claustro/Colaborador), con exportación a Excel.                                                                                                                                                                    |
| `profesional-apoyo/dashboard`    | Actividad reciente de los académicos (qué módulo actualizaron y cuándo), para el dashboard de la secretaría.                                                                                                                                                                     |

---

## 6. Sistema de colas de correo (BullMQ)

Todos los correos (verificación, recuperación de contraseña, notificación, bienvenida) pasan por la cola `email` en vez de enviarse directamente:

```
email.service.js (ej. enviarCorreoVerificacion)
        │
        ▼
email.queue.js → encolarEmail()      # 3 intentos, backoff exponencial desde 5s
        │  (BullMQ sobre Redis)
        ▼
email.worker.js                       # concurrencia 5
        │
        ├─ haySpaceParaEnviar()?  ──No──▶ reencola el job para el día siguiente (00:05h)
        │
        Sí
        ▼
enviarCorreoCrudo()  →  Resend API  →  registrarLog() en `email_logs`
```

- **Cuota** (`quota.service.js`): 100 correos/día y 3000/mes, contados sobre `email_logs` con `estado = 'enviado'`. Si se alcanza el límite, el job se reencola automáticamente para el día siguiente en vez de fallar.
- **Remitente**: resuelto dinámicamente desde `configuracion_sistema` (`remitente_correo`, `remitente_nombre`), con `onboarding@resend.dev` como fallback.
- **Plantillas** (`src/emails/*.jsx`): `Verificacion`, `RecuperarPassword`, `Notificacion`, `Bienvenida`, `CambioCorreo`, sobre un `Layout` común, renderizadas con `@react-email/render`. Previsualízalas con `pnpm email:dev`.
- **Monitoreo** (solo fuera de producción): `GET /admin/queues` (Bull Board) muestra el estado de los jobs de la cola.
- **Dashboard del Admin**: `GET /api/dashboard/correos` expone cuota usada, fallidos, pendientes y el historial más reciente.

---

## 7. Middlewares

| Middleware                   | Ubicación                     | Descripción                                                                                                             |
| ---------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `auth`                     | `middlewares/auth.js`        | Exige`Authorization: Bearer <token>` válido; expone `req.user = { usuario_id, rol }`.                               |
| `authSSE`                  | `middlewares/auth.js`        | Autentica la conexión SSE vía`?ticket=<uuid>` de un solo uso (30 s), sin exponer el JWT en la URL.                   |
| `authorizeRoles(...roles)` | `middlewares/auth.js`        | Restringe una ruta a los roles indicados (`Admin`, `Secretaria`, `Academico`).                                     |
| `loginLimiter`             | `middlewares/rateLimiter.js` | 10 intentos / 5 min, sin contar los exitosos. Aplicado a login, solicitud de reset y registro/reenvío de verificación. |
| `globalLimiter`            | `middlewares/rateLimiter.js` | 300 solicitudes / 15 min, aplicado a toda la API.                                                                        |
| `helmet`                   | `app.js`                     | Cabeceras de seguridad HTTP.                                                                                             |
| `cors`                     | `app.js`                     | Restringido a`FRONTEND_URL`, con credenciales habilitadas.                                                             |

---

## 8. Referencia de endpoints

**Base URL:** `http://localhost:3000/api`

Abreviaturas de la columna **Auth**: 

- `🔓` público
- `🔑` requiere JWT (cualquier rol)
- `👤 [Rol]` requiere JWT + rol específico
- `🎟️` ticket SSE

### Autenticación `/api/auth`

| Método  | Ruta                      | Auth        | Descripción                                                                                |
| -------- | ------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `POST` | `/auth/login`           | 🔓          | Login con RUT y contraseña. Retorna access token (body) y refresh token (cookie HttpOnly). |
| `POST` | `/auth/refresh`         | 🔓 (cookie) | Emite un nuevo access token usando el refresh token de la cookie.                           |
| `GET`  | `/auth/google`          | 🔓          | Inicia el flujo OAuth con Google.                                                           |
| `GET`  | `/auth/google/callback` | 🔓          | Callback de Google; crea/vincula el usuario y redirige al frontend con el access token.     |
| `GET`  | `/auth/me`              | 🔑          | Retorna los datos del usuario autenticado.                                                  |
| `POST` | `/auth/logout`          | 🔑          | Revoca los refresh tokens del usuario y borra la cookie de sesión.                         |
| `POST` | `/auth/sse-ticket`      | 🔑          | Genera un ticket de un solo uso (30 s) para autenticar la conexión SSE.                    |

### Recuperación de contraseña `/api/password-reset`

| Método  | Ruta                          | Auth | Descripción                                                                                                                        |
| -------- | ----------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/password-reset/solicitar` | 🔓   | Envía un correo con enlace de recuperación si el RUT existe y su correo está verificado. Mensaje de respuesta siempre genérico. |
| `POST` | `/password-reset/confirmar` | 🔓   | Confirma el token recibido por correo y actualiza la contraseña.                                                                   |

### Verificación de correo organizacional `/api/email-verification`

| Método  | Ruta                                                | Auth     | Descripción                                                                                       |
| -------- | --------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `POST` | `/email-verification/registrar`                   | 🔑       | Registra el correo organizacional (valida dominio permitido) y envía el código de verificación. |
| `POST` | `/email-verification/confirmar`                   | 🔑       | Confirma el código de 6 dígitos recibido por correo.                                             |
| `POST` | `/email-verification/reenviar`                    | 🔑       | Reenvía el código (respeta el límite de reenvíos configurado).                                 |
| `GET`  | `/email-verification/estado`                      | 🔑       | Retorna el correo registrado y si está verificado.                                                |
| `POST` | `/email-verification/:usuarioId/verificar-manual` | 👤 Admin | Marca el correo de un usuario como verificado manualmente.                                         |

### Usuarios `/api/users`

| Método                                   | Ruta                             | Auth                            | Descripción                                                                 |
| ----------------------------------------- | -------------------------------- | ------------------------------- | ---------------------------------------------------------------------------- |
| `GET`                                   | `/users`                       | 👤 Admin                        | Lista todos los usuarios del sistema.                                        |
| `POST`                                  | `/users`                       | 👤 Admin                        | Crea un nuevo usuario con rol y programas asignados.                         |
| `GET`                                   | `/users/:id`                   | 👤 Admin                        | Obtiene los datos de un usuario por ID.                                      |
| `PUT`                                   | `/users/:id`                   | 👤 Admin                        | Actualiza datos básicos del usuario (RUT, nombres, rol, programas).         |
| `PUT`                                   | `/users/:id/password`          | 👤 Admin                        | Cambia la contraseña de un usuario.                                         |
| `DELETE`                                | `/users/:id`                   | 👤 Admin                        | Elimina un usuario y toda su producción asociada (CASCADE).                 |
| `GET`                                   | `/users/roles`                 | 👤 Admin                        | Lista los roles del sistema.                                                 |
| `POST` / `PUT` / `DELETE`           | `/users/roles[/:id]`           | 👤 Admin                        | CRUD de roles del sistema.                                                   |
| `GET` / `POST` / `PUT` / `DELETE` | `/users/roles-academico[/:id]` | 👤 Admin                        | CRUD de tipos de rol académico (Claustro, Colaborador).                     |
| `GET`                                   | `/users/academicos`            | 👤 Secretaria, Admin            | Lista todos los académicos con sus programas y roles.                       |
| `GET`                                   | `/users/academicos/:id/perfil` | 👤 Admin, Secretaria, Academico | Perfil completo: datos personales, correos, grado académico y titulaciones. |
| `PUT`                                   | `/users/academicos/:id/perfil` | 👤 Admin, Academico             | Actualiza el perfil completo (transaccional).                                |

### Configuración del sistema `/api/configuracion`

| Método    | Ruta                            | Auth     | Descripción                                                             |
| ---------- | ------------------------------- | -------- | ------------------------------------------------------------------------ |
| `GET`    | `/configuracion`              | 👤 Admin | Lista los parámetros configurables (remitente, expiraciones, límites). |
| `PUT`    | `/configuracion`              | 👤 Admin | Actualiza un parámetro (`clave`/`valor`).                           |
| `GET`    | `/configuracion/dominios`     | 👤 Admin | Lista los dominios de correo permitidos.                                 |
| `POST`   | `/configuracion/dominios`     | 👤 Admin | Agrega un dominio permitido.                                             |
| `DELETE` | `/configuracion/dominios/:id` | 👤 Admin | Elimina un dominio permitido.                                            |

### Dashboard del Admin `/api/dashboard`

| Método | Ruta                          | Auth     | Descripción                                                                                         |
| ------- | ----------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `GET` | `/dashboard/correos`        | 👤 Admin | Cuota diaria/mensual usada, fallidos, pendientes, envíos por tipo/día/mes e historial reciente.    |
| `GET` | `/dashboard/notificaciones` | 👤 Admin | Totales de notificaciones, envíos hoy, solo web vs. con correo, por remitente y las más recientes. |

### Producción científica

Publicaciones, Libros (`/api/libros`), Capítulos de libro (`/api/cap-libro`), Tesis (`/api/tesis`), Investigación (`/api/investigacion`), Patentes (`/api/patente`), Proyectos de intervención (`/api/proyectos-intervencion`) y Consultorías (`/api/consultorias`) siguen todos el mismo patrón de endpoints:

| Método    | Ruta                                                  | Auth          | Descripción                         |
| ---------- | ----------------------------------------------------- | ------------- | ------------------------------------ |
| `GET`    | `/{recurso}/mias` (o raíz / `:nivel` para tesis) | 🔑            | Lista registros propios.             |
| `POST`   | `/{recurso}`                                        | 🔑            | Crea registro propio.                |
| `PUT`    | `/{recurso}/:id`                                    | 🔑            | Actualiza registro propio.           |
| `DELETE` | `/{recurso}/:id`                                    | 🔑            | Elimina registro propio.             |
| `GET`    | `/{recurso}/academico/:usuarioId`                   | 👤 Secretaria | Lista registros de un académico.    |
| `POST`   | `/{recurso}/academico/:usuarioId`                   | 👤 Secretaria | Crea registro para un académico.    |
| `PUT`    | `/{recurso}/academico/:usuarioId/:id`               | 👤 Secretaria | Actualiza registro de un académico. |
| `DELETE` | `/{recurso}/academico/:usuarioId/:id`               | 👤 Secretaria | Elimina registro de un académico.   |

`GET /api/categorias` (🔓) lista las categorías de publicación disponibles (WOS, Scielo, Scopus, etc.).

### Ficha académica `/api/ficha`

| Método | Ruta                                  | Auth                 | Descripción                                                           |
| ------- | ------------------------------------- | -------------------- | ---------------------------------------------------------------------- |
| `GET` | `/ficha/:usuarioId`                 | 👤 Secretaria, Admin | Perfil académico completo: datos personales, producción y métricas. |
| `GET` | `/ficha/:usuarioId/export`          | 👤 Secretaria, Admin | Descarga la ficha completa en Excel (.xlsx).                           |
| `GET` | `/ficha/:usuarioId/export-magister` | 👤 Secretaria, Admin | Descarga la ficha filtrada por Magíster en Excel (.xlsx).             |

### Reportes `/api/profesional-apoyo`

| Método           | Ruta                                   | Auth                 | Descripción                                                           |
| ----------------- | -------------------------------------- | -------------------- | ---------------------------------------------------------------------- |
| `GET` / `PUT` | `/profesional-apoyo/reporte-general` | 🔑                   | Consulta / actualiza el reporte general agregado por programa.         |
| `GET` / `PUT` | `/profesional-apoyo/promedios`       | 👤 Secretaria, Admin | Consulta / actualiza los promedios de producción por programa y tipo. |
| `GET`           | `/profesional-apoyo/export-excel`    | 👤 Secretaria, Admin | Descarga el reporte general consolidado en Excel.                      |

### Notificaciones `/api/notificaciones`

| Método    | Ruta                            | Auth            | Descripción                                                                                          |
| ---------- | ------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| `POST`   | `/notificaciones`             | 👤 Secretaria   | Envía una notificación (global o dirigida), con opción de reenviar por correo (`enviar_correo`). |
| `GET`    | `/notificaciones/enviadas`    | 👤 Secretaria   | Lista las notificaciones enviadas por el remitente autenticado.                                       |
| `GET`    | `/notificaciones/:id/lectura` | 👤 Secretaria   | Detalle de quién ha leído una notificación.                                                        |
| `DELETE` | `/notificaciones/:id`         | 👤 Secretaria   | Elimina una notificación propia (valida autoría).                                                   |
| `GET`    | `/notificaciones/mis`         | 🔑              | Lista las notificaciones recibidas por el usuario autenticado.                                        |
| `PUT`    | `/notificaciones/:id/leida`   | 🔑              | Marca una notificación como leída.                                                                  |
| `GET`    | `/notificaciones/no-leidas`   | 🔑              | Conteo de notificaciones no leídas.                                                                  |
| `GET`    | `/notificaciones/stream`      | 🎟️ ticket SSE | Stream SSE de notificaciones en tiempo real.                                                          |

### Dashboard Profesional de Apoyo `/api/home-profesional`

| Método | Ruta                                  | Auth          | Descripción                                                            |
| ------- | ------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| `GET` | `/home-profesional/actualizaciones` | 👤 Secretaria | Cambios recientes en perfiles académicos (módulo, fecha, académico). |
