# Sistema de Gestión Académica — Postgrado de Historia UTA

Sistema web de gestión de producción científica y académica para el programa de Postgrado en Historia de la Universidad de Tarapacá, el cual comprende los programas de **Magíster** y **Doctorado en Historia**.

El sistema está orientado al proceso de **acreditación** del programa. Los académicos registran su producción científica directamente en la plataforma, y el **Profesional de Apoyo** (secretaría) administra, verifica y descarga los recursos necesarios para sustentar la acreditación — todo ello basado en la producción académica acumulada por los docentes del programa.

> 📘 Este README cubre la visión general y la puesta en marcha del proyecto completo. Para el detalle técnico de cada parte, revisa:
>
> - [DOCUMENTATION.md](DOCUMENTATION.md) — arquitectura general, roles, seguridad y base de datos.
> - [Server/README.md](Server/README.md) — documentación específica del backend (módulos, API REST, colas de correo).
> - [Frontend/README.md](Frontend/README.md) — documentación específica del frontend (rutas, hooks, componentes).

---

## Características principales

- **Roles diferenciados**: Académico, Profesional de Apoyo y Administrador, cada uno con vistas y permisos propios.
- **Producción científica**: Registro y gestión de publicaciones, libros, capítulos de libro, tesis, investigaciones, patentes, proyectos de intervención y consultorías.
- **Gestión de usuarios**: Creación, edición y eliminación de usuarios con asignación de roles y programas.
- **Autenticación**: Login con RUT y contraseña, o con **Google OAuth**; JWT con access token (15 min) y refresh token (7 días, cookie HttpOnly); recuperación de contraseña por correo.
- **Correo organizacional**: Verificación del correo institucional por código, restringida a dominios permitidos configurables por el administrador.
- **Cola de correos**: Envío de correos (verificación, recuperación, notificaciones, bienvenida) desacoplado mediante BullMQ/Redis, con cuotas diarias/mensuales y reintentos automáticos.
- **Notificaciones en tiempo real** vía Server-Sent Events (SSE), con envío opcional por correo.
- **Panel de configuración** (Admin): dominios de correo permitidos, remitente de correo y parámetros del sistema.
- **Exportación a Excel** de fichas académicas y reportes consolidados.
- **Diseño responsivo**: Interfaz adaptada a escritorio y dispositivos móviles.

---

## Stack tecnológico

| Capa           | Tecnología                                                                      |
| -------------- | -------------------------------------------------------------------------------- |
| Frontend       | React 19, Vite, React Router v7, Bootstrap 5, Recharts                           |
| Backend        | Node.js, Express 5 (ejecutado con`tsx`)                                        |
| Base de datos  | MySQL 8                                                                          |
| Colas / caché | Redis, BullMQ (envío de correos), Bull Board (panel de monitoreo en desarrollo) |
| Autenticación | JWT, bcrypt, Passport.js (Google OAuth 2.0), express-session                     |
| Correo         | Resend, React Email (plantillas JSX)                                             |
| Reportes       | ExcelJS                                                                          |
| Seguridad      | Helmet, express-rate-limit, CORS                                                 |

---

## Estructura del proyecto

```
Practica-1/
├── Frontend/          # Aplicación React + Vite — ver Frontend/README.md
│   └── src/
│       ├── core/      # API client, auth, layouts, router
│       ├── features/  # Módulos por funcionalidad (academico, admin, etc.)
│       ├── pages/     # Páginas principales (Login, etc.)
│       └── shared/    # Componentes, hooks y utilidades reutilizables
├── Server/            # API REST con Express — ver Server/README.md
│   └── src/
│       ├── config/    # Configuración de base de datos
│       ├── core/      # Stores en memoria (SSE tickets, token revocation)
│       ├── middlewares/
│       ├── modules/   # Módulos por dominio (users, notificacion, etc.)
│       └── utils/
├── database/          # Scripts SQL del esquema de base de datos
├── README.md          # Este archivo
└── DOCUMENTATION.md   # Documentación técnica general
```

Ver la estructura interna detallada de cada parte en su README específico.

---

## Instalación y puesta en marcha

### Requisitos previos

- Node.js ≥ 18
- pnpm ≥ 8 (`npm install -g pnpm`)
- MySQL 8 en ejecución
- **Redis** en ejecución (usado para sesiones y la cola de correos con BullMQ)
- Cuenta de [Resend](https://resend.com) (para el envío real de correos) — opcional en desarrollo si no se necesita probar el envío
- Credenciales de OAuth de Google (opcional — solo si se habilita el login con Google)

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/TheShac/Practica-1.git
cd Practica-1
```

---

### 2. Base de datos

Crear la base de datos e importar el esquema más reciente:

```sql
CREATE DATABASE postgrado_historia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
mysql -u root -p postgrado_historia < database/Dump20260728.sql
```

> ⚠️ La carpeta `database/` contiene tres archivos `.sql`. **`Dump20260728.sql` es el esquema vigente** — incluye las tablas de verificación de correo, recuperación de contraseña, dominios permitidos, configuración del sistema y logs de correo (`verificacion_correo`, `password_reset_token`, `dominio_permitido`, `configuracion_sistema`, `correo_organizacional`, `email_logs`). Los otros dos (`database_postgradoH.sql`, `postgrado_historiaDB.sql`) son snapshots anteriores que no incluyen estas tablas; se conservan como referencia histórica pero no deben usarse para una instalación nueva.

---

### 3. Configurar el servidor (`Server/`)

```bash
cd Server
pnpm install
```

Crear el archivo `Server/.env`. Ver el detalle completo de cada variable en [Server/README.md](Server/README.md#variables-de-entorno):

```env
# Servidor
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=postgrado_historia

# Redis (sesiones + colas BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# Sesión (usada por Passport / login con Google)
SESSION_SECRET=cambia_esto_por_un_secreto_seguro

# JWT
JWT_SECRET=cambia_esto_por_un_secreto_seguro
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=cambia_esto_por_otro_secreto
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Correo (Resend)
RESEND_API_KEY=

# Google OAuth (opcional — solo si se usa login con Google)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Google Drive (opcional — para subida de archivos de respaldo)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
DRIVE_FOLDER_ID=
```

Iniciar Redis (si no está corriendo ya como servicio) y luego el servidor:

```bash
pnpm dev       # Desarrollo (tsx watch, con recarga automática)
pnpm start     # Producción
```

El servidor quedará disponible en `http://localhost:3000`.

---

### 4. Configurar el frontend (`Frontend/`)

```bash
cd ../Frontend
pnpm install
```

Crear el archivo `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Iniciar el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación quedará disponible en `http://localhost:5173`.

---

### 5. Resumen de comandos

```bash
# Terminal 1 — Backend (requiere Redis y MySQL activos)
cd Server && pnpm dev

# Terminal 2 — Frontend
cd Frontend && pnpm dev
```

En desarrollo, el panel de monitoreo de colas (Bull Board) queda disponible en `http://localhost:3000/admin/queues`.

---

## Variables de entorno requeridas

| Variable                                                                | Descripción                                       | Dónde   |
| ----------------------------------------------------------------------- | -------------------------------------------------- | -------- |
| `PORT`                                                                | Puerto del servidor                                | Server   |
| `NODE_ENV`                                                            | Entorno (`development` / `production`)         | Server   |
| `FRONTEND_URL`                                                        | URL del frontend (CORS, cookies, links en correos) | Server   |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`     | Conexión a MySQL                                  | Server   |
| `REDIS_HOST`, `REDIS_PORT`                                          | Conexión a Redis (sesiones + colas)               | Server   |
| `SESSION_SECRET`                                                      | Secreto de`express-session` (login Google)       | Server   |
| `JWT_SECRET`, `JWT_EXPIRES_IN`                                      | Firma y expiración del access token               | Server   |
| `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`                      | Firma y expiración del refresh token              | Server   |
| `BCRYPT_SALT_ROUNDS`                                                  | Costo de hashing de contraseñas                   | Server   |
| `RESEND_API_KEY`                                                      | API key de Resend para envío de correos           | Server   |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | OAuth de Google (opcional)                         | Server   |
| `VITE_API_URL`                                                        | URL base de la API                                 | Frontend |

> Las variables de Google OAuth son opcionales y solo se necesitan si se habilita el inicio de sesión con Google o la subida de archivos a Google Drive. Sin `RESEND_API_KEY`, los correos fallarán al enviarse pero la cola los reintentará según su configuración (ver [Server/README.md](Server/README.md)).
