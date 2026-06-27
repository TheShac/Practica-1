# Sistema de Gestión Académica — Postgrado de Historia UTA

Sistema web de gestión de producción científica y académica para el programa de Postgrado en Historia de la Universidad de Tarapacá, el cual comprende los programas de **Magíster** y **Doctorado en Historia**.

El sistema está orientado al proceso de **acreditación** del programa. Los académicos registran su producción científica directamente en la plataforma, y el **Profesional de Apoyo** (secretaría) administra, verifica y descarga los recursos necesarios para sustentar la acreditación — todo ello basado en la producción académica acumulada por los docentes del programa.

---

## Características principales

- **Roles diferenciados**: Académico, Profesional de Apoyo y Administrador, cada uno con vistas y permisos propios.
- **Producción científica**: Registro y gestión de publicaciones, libros, capítulos de libro, tesis, investigaciones, patentes, proyectos de intervención y consultorías.
- **Gestión de usuarios**: Creación, edición y eliminación de usuarios con asignación de roles y programas.
- **Notificaciones en tiempo real** vía Server-Sent Events (SSE).
- **Exportación a Excel** de los registros académicos.
- **Autenticación segura**: JWT con access token (15 min) y refresh token (7 días, HttpOnly cookie), bcrypt para contraseñas.
- **Diseño responsivo**: Interfaz adaptada a escritorio y dispositivos móviles.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Vite, React Router v7, Bootstrap 5 |
| Backend | Node.js, Express 5 |
| Base de datos | MySQL 8 |
| Autenticación | JWT, bcrypt, Passport.js (Google OAuth) |
| Reportes | ExcelJS |
| Seguridad | Helmet, express-rate-limit |

---

## Estructura del proyecto

```
Practica-1/
├── Frontend/          # Aplicación React + Vite
│   └── src/
│       ├── core/      # API client, auth, layouts, router
│       ├── features/  # Módulos por funcionalidad (academico, admin, etc.)
│       ├── pages/     # Páginas principales (Login, etc.)
│       └── shared/    # Componentes, hooks y utilidades reutilizables
├── Server/            # API REST con Express
│   └── src/
│       ├── config/    # Configuración de base de datos
│       ├── core/      # Stores en memoria (SSE tickets, token revocation)
│       ├── middlewares/
│       ├── modules/   # Módulos por dominio (users, notificacion, etc.)
│       └── utils/
└── database/          # Scripts SQL de creación del esquema
```

---

## Instalación y puesta en marcha

### Requisitos previos

- Node.js ≥ 18
- pnpm ≥ 8 (`npm install -g pnpm`)
- MySQL 8 en ejecución

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/TheShac/Practica-1.git
cd Practica-1
```

---

### 2. Base de datos

Crear la base de datos e importar el esquema:

```sql
CREATE DATABASE postgrado_historia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
mysql -u root -p postgrado_historia < database/database_postgradoH.sql
```

---

### 3. Configurar el servidor (`Server/`)

```bash
cd Server
pnpm install
```

Crear el archivo `Server/.env` con las siguientes variables:

```env
# Servidor
PORT=3000
FRONTEND_URL=http://localhost:5173

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=postgrado_historia

# JWT
JWT_SECRET=cambia_esto_por_un_secreto_seguro
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=cambia_esto_por_otro_secreto
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Google OAuth (opcional — solo si se usa login con Google)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Google Drive (opcional — para subida de archivos de respaldo)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
DRIVE_FOLDER_ID=
```

Iniciar el servidor:

```bash
pnpm dev       # Desarrollo (nodemon)
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
# Terminal 1 — Backend
cd Server && pnpm dev

# Terminal 2 — Frontend
cd Frontend && pnpm dev
```

---

## Variables de entorno requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `FRONTEND_URL` | URL del frontend (CORS) | `http://localhost:5173` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | — |
| `DB_NAME` | Nombre de la base de datos | `postgrado_historia` |
| `JWT_SECRET` | Secreto para access tokens | cadena aleatoria larga |
| `JWT_EXPIRES_IN` | Expiración del access token | `15m` |
| `JWT_REFRESH_SECRET` | Secreto para refresh tokens | cadena aleatoria larga |
| `JWT_REFRESH_EXPIRES_IN` | Expiración del refresh token | `7d` |
| `BCRYPT_SALT_ROUNDS` | Costo de hashing de contraseñas | `10` |
| `VITE_API_URL` | URL base de la API (frontend) | `http://localhost:3000/api` |

> Las variables de Google OAuth y Drive son opcionales y solo se necesitan si se habilita el inicio de sesión con Google o la subida de archivos a Google Drive.
