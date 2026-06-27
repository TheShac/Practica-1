# Documentación Técnica — Sistema de Gestión Académica Postgrado de Historia UTA

## Tabla de contenidos

1. [Visión general](#1-visión-general)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Roles y permisos](#3-roles-y-permisos)
4. [Autenticación y seguridad](#4-autenticación-y-seguridad)
5. [Base de datos](#5-base-de-datos)
6. [API REST — Referencia de endpoints](#6-api-rest--referencia-de-endpoints)
7. [Frontend — Estructura y páginas](#7-frontend--estructura-y-páginas)
8. [Hooks compartidos](#8-hooks-compartidos)
9. [Componentes compartidos](#9-componentes-compartidos)

---

## 1. Visión general

El sistema es una aplicación web full-stack diseñada para gestionar y centralizar la producción científica y académica del programa de Postgrado en Historia de la Universidad de Tarapacá (UTA), el cual comprende los programas de **Magíster** y **Doctorado en Historia**.

Su propósito principal es dar soporte al proceso de **acreditación** del programa. Los académicos registran su producción directamente en la plataforma; el **Profesional de Apoyo** (secretaría) administra los datos, supervisa los perfiles y descarga los reportes e informes necesarios para sustentar la acreditación ante los organismos evaluadores.

### Stack tecnológico

| Capa                          | Tecnología                                          |
| ----------------------------- | ---------------------------------------------------- |
| Frontend                      | React 19, React Router v7, Vite, Bootstrap 5         |
| Backend                       | Node.js, Express 5                                   |
| Base de datos                 | MySQL 8                                              |
| Autenticación                | JWT (access token) + Refresh token (HttpOnly cookie) |
| Seguridad                     | bcrypt, Helmet, express-rate-limit, CORS             |
| Notificaciones en tiempo real | Server-Sent Events (SSE)                             |
| Exportación                  | ExcelJS                                              |

---

## 2. Arquitectura del sistema

```
┌──────────────────────────────────────────────────┐
│                   CLIENTE                        │
│          React 19 + Vite (puerto 5173)           │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │ Academico│  │ Prof.    │  │ Administrador │   │
│  │ Layout   │  │ Apoyo    │  │ Layout        │   │
│  │          │  │ Layout   │  │               │   │
│  └──────────┘  └──────────┘  └───────────────┘   │
│         │            │               │           │
│         └────────────┴───────────────┘           │
│                      │                           │
│              fetcher.js (API client)             │
│          Authorization: Bearer {JWT}             │
└──────────────────────┬───────────────────────────┘
                       │ HTTP / SSE
┌──────────────────────▼───────────────────────────┐
│                   SERVIDOR                       │
│          Express 5 + Node.js (puerto 3000)       │
│                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  auth    │  │ rate limiter │  │   helmet   │  │
│  │middleware│  │ middleware   │  │ middleware │  │
│  └──────────┘  └──────────────┘  └────────────┘  │
│                                                  │
│  /api/auth   /api/users   /api/publicaciones     │
│  /api/tesis  /api/libros  /api/investigacion     │
│  /api/ficha  /api/notificaciones   ...           │
└──────────────────────┬───────────────────────────┘
                       │ mysql2 (pool)
┌──────────────────────▼───────────────────────────┐
│               BASE DE DATOS                      │
│                  MySQL 8                         │
│   postgrado_historia (utf8mb4_unicode_ci)        │
└──────────────────────────────────────────────────┘
```

### Estructura de carpetas

```
Practica-1/
├── Frontend/
│   └── src/
│       ├── core/
│       │   ├── api/          # fetcher.js — cliente HTTP con refresh automático
│       │   ├── auth/         # ProtectedRoute, auth.service.js
│       │   ├── layouts/      # AcademicLayout, SecretariaLayout, AdminLayout
│       │   └── router/       # AppRouter.jsx — definición de rutas
│       ├── features/
│       │   ├── academico/    # Páginas y servicios del académico
│       │   ├── profesional-apoyo/  # Páginas y servicios del Prof. de Apoyo
│       │   └── admin/        # Páginas y servicios del administrador
│       ├── pages/
│       │   └── Login.jsx
│       └── shared/
│           ├── components/   # Componentes reutilizables (UI, modales, navegación)
│           ├── context/      # NotificacionContext
│           ├── hooks/        # Hooks reutilizables
│           └── utils/        # sanitize.js y utilidades varias
├── Server/
│   └── src/
│       ├── config/           # Conexión a MySQL (pool)
│       ├── core/             # sseTicketStore.js, tokenRevocationStore.js
│       ├── middlewares/      # auth.js, rateLimiter.js
│       ├── modules/
│       │   ├── users/        # auth, user (CRUD, perfil, roles)
│       │   └── profesional-apoyo/  # notificacion, ficha, reportes, dashboard
│       └── utils/
└── database/
    └── database_postgradoH.sql   # Esquema completo de la base de datos
```

---

## 3. Roles y permisos

El sistema define tres roles de sistema y dos tipos de rol académico.

### Roles de sistema

| Rol                  | Descripción                                                                                                                  | Rutas de acceso   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **Academico**  | Docente del programa. Registra y gestiona su propia producción científica.                                                  | `/academico/*`  |
| **Secretaria** | Profesional de Apoyo. Administra datos de todos los académicos, envía notificaciones y exporta reportes para acreditación. | `/secretaria/*` |
| **Admin**      | Administrador del sistema. Gestiona usuarios, roles y configuración general.                                                 | `/admin/*`      |

### Tipos de rol académico

Cada académico puede pertenecer a uno o ambos programas (Magíster / Doctorado) con un tipo de participación:

| Tipo                  | Descripción                                     |
| --------------------- | ------------------------------------------------ |
| **Claustro**    | Académico de planta, miembro pleno del programa |
| **Colaborador** | Académico colaborador o asociado al programa    |

Esta distinción es relevante para los reportes de acreditación, donde los promedios de producción científica se calculan de forma separada para Claustro y Colaboradores.

### Matriz de acceso a endpoints

| Recurso                                        | Academico | Secretaria | Admin |
| ---------------------------------------------- | --------- | ---------- | ----- |
| CRUD producción propia                        | ✅        | —         | —    |
| Ver/editar producción de cualquier académico | —        | ✅         | —    |
| Enviar notificaciones                          | —        | ✅         | —    |
| Exportar reportes / fichas                     | —        | ✅         | ✅    |
| Gestión de usuarios                           | —        | —         | ✅    |
| Gestión de roles                              | —        | —         | ✅    |
| Dashboard de actualizaciones                   | —        | ✅         | —    |

---

## 4. Autenticación y seguridad

### Flujo de autenticación

```
[Login]
   │
   ▼
POST /api/auth/login { rut, password }
   │
   ├─ Backend verifica RUT → bcrypt.compare(password, hash)
   │
   ├─ Genera access token (JWT, 15 min) → retorna en body
   │
   └─ Genera refresh token (JWT, 7 días) → retorna en HttpOnly SameSite:Strict cookie

[Petición autenticada]
   │
   ▼
Authorization: Bearer {access_token}
   │
   ├─ middleware auth() → jwt.verify(token, JWT_SECRET)
   │
   └─ req.user = { usuario_id, rol }

[Token expirado — refresh automático]
   │
   ▼
fetcher.js recibe 401 en cualquier ruta (excepto /auth/login)
   │
   ├─ POST /api/auth/refresh (cookie enviada automáticamente)
   │
   ├─ Backend valida refresh token + revocationStore
   │
   ├─ Emite nuevo access token → almacenado en localStorage
   │
   └─ Reintenta la petición original

[Logout]
   │
   ▼
POST /api/auth/logout
   │
   ├─ Backend registra revocación del refresh token en tokenRevocationStore
   │
   └─ Limpia cookie HttpOnly
```

### Notificaciones SSE (Server-Sent Events)

Para evitar exponer el JWT en URLs (y por tanto en logs del servidor):

```
1. Frontend solicita un ticket de un solo uso:
   POST /api/auth/sse-ticket  →  { ticket: "uuid-v4" }

2. Abre la conexión SSE con el ticket:
   GET /api/notificaciones/stream?ticket={uuid}

3. El middleware authSSE() canjea el ticket (válido 30 s, uso único)
   y establece req.user sin necesidad de JWT en la URL.
```

### Medidas de seguridad implementadas

| Medida                     | Implementación                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------- |
| Hashing de contraseñas    | bcrypt, cost factor 10                                                             |
| Tokens JWT                 | Firmados con`JWT_SECRET`, access 15 min, refresh 7 días                         |
| Revocación de tokens      | In-memory Map`tokenRevocationStore` (invalida todos los refresh al hacer logout) |
| Tickets SSE de un solo uso | In-memory Map`sseTicketStore`, TTL 30 s, uso único                              |
| CORS restringido           | Solo acepta peticiones desde`FRONTEND_URL`                                       |
| Rate limiting              | `express-rate-limit` en rutas sensibles                                          |
| Cabeceras de seguridad     | Helmet.js                                                                          |
| SQL Injection              | `mysql2` con prepared statements en todas las queries                            |
| Inyección de columnas     | Allowlist`ALLOWED_USER_UPDATE_FIELDS` en `updateUser()`                        |
| IDOR (notificaciones)      | DELETE valida`remitente_id = req.user.usuario_id`                                |
| Open redirect              | `fetcher.js` valida que la URL de redirect empiece por `/` y no por `//`     |
| Sanitización de inputs    | `sanitize.js` aplica `DOMPurify`-style stripping en campos de texto libres     |

---

## 5. Base de datos

El esquema completo se encuentra en [`database/database_postgradoH.sql`](database/database_postgradoH.sql).

### Diagrama de tablas principales

```
rol ──────────────────────── usuario ──────────────── mail
                               │  │
                    programa ──┘  └── grado_academico
                       │               titulacion
              usuario_programa
              rol_academico ──┘

usuario ──┬── publicaciones ── categoria
          ├── libro
          ├── cap_libro
          ├── tesis
          ├── investigacion
          ├── patente
          ├── proyectos_intervencion
          ├── consultorias
          └── reporte_academico ── programa
                                       │
                              reporte_promedios
                              reporte_wos_global

notificacion ─────── notificacion_destinatario ── usuario
     │
     └─────────── notificacion_global_leido ───── usuario
```

### Descripción de tablas

#### Usuarios y roles

| Tabla                | Columnas relevantes                                                                                                                                         | Descripción                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `rol`              | `rol_id`, `nombre`                                                                                                                                      | Roles del sistema: Admin, Academico, Secretaria |
| `usuario`          | `usuario_id`, `rut`, `primer_nombre`, `primer_apellido`, `contrasena` (hash), `lineas_investigacion`, `ano_ingreso`, `telefono`, `rol_id` | Cuenta de usuario                               |
| `programa`         | `programa_id`, `nombre` (ENUM: MAGISTER, DOCTORADO)                                                                                                     | Programas del postgrado                         |
| `rol_academico`    | `rolaca_id`, `tipo_academico` (Claustro, Colaborador)                                                                                                   | Tipos de participación académica              |
| `usuario_programa` | `usuario_id`, `programa_id`, `rolaca_id`                                                                                                              | Relación usuario ↔ programa ↔ tipo           |
| `grado_academico`  | `grado_id`, `usuario_id`, `nombre_grado`, `institucion_grado`, `pais_grado`, `ano_grado`                                                        | Grado académico del docente                    |
| `titulacion`       | `titulo_id`, `usuario_id`, `titulo`, `institucion_titulacion`, `pais_titulacion`, `ano_titulacion`                                              | Títulos adicionales                            |
| `mail`             | `mail_id`, `mail` (UNIQUE), `usuario_id`                                                                                                              | Correos electrónicos                           |

#### Producción científica

Todas las tablas de producción tienen `CASCADE DELETE` en `usuario_id` y columnas `created_at` / `updated_at`.

| Tabla                      | Columnas clave                                                                                                                                                                                        | Descripción                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `publicaciones`          | `publicacion_id`, `usuario_id`, `categoria_id`, `titulo_articulo`, `nombre_revista`, `ISSN`, `ano`, `autores`, `autor_principal`, `estado`, `link_verificacion`                 | Artículos en revistas indexadas                        |
| `categoria`              | `categoria_id`, `nombre`                                                                                                                                                                          | Categorías de publicación (WOS, Scielo, Scopus, etc.) |
| `libro`                  | `libro_id`, `usuario_id`, `nombre_libro`, `editorial`, `lugar`, `ano`, `autores`, `autor_principal`, `estado`, `link_verificacion`                                                | Libros publicados                                       |
| `cap_libro`              | `cap_id`, `usuario_id`, `nombre_capitulo`, `nombre_libro`, `editorial`, `lugar`, `ano`, `autores`, `autor_principal`, `estado`, `link_verificacion`                             | Capítulos de libro                                     |
| `tesis`                  | `tesis_id`, `usuario_id`, `titulo_tesis`, `nombre_programa`, `institucion`, `nivel_programa` (MAGISTER/DOCTORADO), `rol_guia` (GUIA/CO_GUIA), `ano`, `autor`, `link_verificacion` | Tesis dirigidas o co-dirigidas                          |
| `investigacion`          | `investigacion_id`, `usuario_id`, `titulo`, `fuente_financiamiento`, `ano_adjudicacion`, `periodo_ejecucion`, `rol_proyecto`, `link_verificacion`                                     | Proyectos de investigación                             |
| `patente`                | `patente_id`, `usuario_id`, `inventores`, `nombre_patente`, `num_registro`, `fecha_solicitud`, `fecha_publicacion`, `estado`, `link_verificacion`                                   | Patentes                                                |
| `proyectos_intervencion` | `proyecto_id`, `usuario_id`, `titulo`, `fuente_financiamiento`, `ano_adjudicacion`, `periodo_ejecucion`, `rol_proyecto`, `link_verificacion`                                          | Proyectos de intervención                              |
| `consultorias`           | `consultoria_id`, `usuario_id`, `titulo`, `institucion_contratante`, `ano_adjudicacion`, `periodo_ejecucion`, `objetivo`, `link_verificacion`                                         | Consultorías                                           |

#### Reportes

| Tabla                  | Columnas clave                                                                                                                                                             | Descripción                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `reporte_academico`  | `usuario_id`, `programa_id`, `total_wos_scopus_5_anios`, `total_scielo_5_anios`, `otros_articulos`, `libros_area`, `proyectos_fondecyt`, `otros_proyectos` | Métricas por académico y por programa     |
| `reporte_promedios`  | `programa_id`, `prom_wos_claustro`, `prom_wos_cuerpo`, `prom_libros_claustro`, `prom_fondecyt_claustro`                                                          | Promedios agregados por programa            |
| `reporte_wos_global` | `programa_id`, `tipo_academico`, `total_wos`                                                                                                                         | Total WOS/Scopus global por tipo y programa |

#### Notificaciones

| Tabla                         | Columnas clave                                                                                     | Descripción                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `notificacion`              | `notificacion_id`, `remitente_id`, `asunto`, `mensaje`, `es_global` (0/1), `creado_en` | Notificación creada por Profesional de Apoyo    |
| `notificacion_destinatario` | `notificacion_id`, `usuario_id`, `leido`, `leido_en`                                       | Destinatarios específicos + estado de lectura   |
| `notificacion_global_leido` | `notificacion_id`, `usuario_id`, `leido_en`                                                  | Registro de lectura para notificaciones globales |

---

## 6. API REST — Referencia de endpoints

**Base URL:** `http://localhost:3000/api`

Las siguientes abreviaturas se usan en la columna **Auth**:

- `🔓` — Público, sin autenticación
- `🔑` — Requiere JWT válido (cualquier rol)
- `👤 [Rol]` — Requiere JWT + rol específico

---

### Autenticación `/api/auth`

| Método  | Ruta                 | Auth        | Descripción                                                                                                    |
| -------- | -------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `POST` | `/auth/login`      | 🔓          | Inicia sesión con RUT y contraseña. Retorna access token (body) y refresh token (cookie HttpOnly).            |
| `POST` | `/auth/refresh`    | 🔓 (cookie) | Emite un nuevo access token usando el refresh token de la cookie.                                               |
| `POST` | `/auth/logout`     | 🔑          | Revoca el refresh token del usuario y borra la cookie de sesión.                                               |
| `POST` | `/auth/sse-ticket` | 🔑          | Genera un ticket de un solo uso (UUID, TTL 30 s) para autenticar la conexión SSE sin exponer el JWT en la URL. |

---

### Usuarios `/api/users`

| Método    | Ruta                             | Auth                               | Descripción                                                                            |
| ---------- | -------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| `GET`    | `/users`                       | 👤 Admin                           | Lista todos los usuarios del sistema.                                                   |
| `POST`   | `/users`                       | 👤 Admin                           | Crea un nuevo usuario con rol y programas asignados.                                    |
| `GET`    | `/users/:id`                   | 👤 Admin                           | Obtiene los datos de un usuario por ID.                                                 |
| `PUT`    | `/users/:id`                   | 👤 Admin                           | Actualiza datos básicos del usuario (RUT, nombres, rol, programas).                    |
| `PUT`    | `/users/:id/password`          | 👤 Admin                           | Cambia la contraseña de un usuario.                                                    |
| `DELETE` | `/users/:id`                   | 👤 Admin                           | Elimina un usuario y toda su producción asociada (CASCADE).                            |
| `GET`    | `/users/roles`                 | 👤 Admin                           | Lista los roles del sistema.                                                            |
| `POST`   | `/users/roles`                 | 👤 Admin                           | Crea un nuevo rol.                                                                      |
| `PUT`    | `/users/roles/:id`             | 👤 Admin                           | Actualiza un rol.                                                                       |
| `DELETE` | `/users/roles/:id`             | 👤 Admin                           | Elimina un rol.                                                                         |
| `GET`    | `/users/roles-academico`       | 👤 Admin                           | Lista los tipos de rol académico (Claustro, Colaborador).                              |
| `POST`   | `/users/roles-academico`       | 👤 Admin                           | Crea un tipo de rol académico.                                                         |
| `PUT`    | `/users/roles-academico/:id`   | 👤 Admin                           | Actualiza un tipo de rol académico.                                                    |
| `DELETE` | `/users/roles-academico/:id`   | 👤 Admin                           | Elimina un tipo de rol académico.                                                      |
| `GET`    | `/users/academicos`            | 👤 Secretaria                      | Lista todos los académicos con sus programas y roles.                                  |
| `GET`    | `/users/academicos/:id/perfil` | 👤 Admin\| Secretaria \| Academico | Retorna el perfil completo: datos personales, correos, grado académico y titulaciones. |
| `PUT`    | `/users/academicos/:id/perfil` | 👤 Admin\| Academico               | Actualiza el perfil completo (transaccional: correos, grado, titulaciones).             |

---

### Publicaciones `/api/publicaciones`

| Método    | Ruta                                        | Auth          | Descripción                                       |
| ---------- | ------------------------------------------- | ------------- | -------------------------------------------------- |
| `GET`    | `/publicaciones/mias`                     | 🔑            | Lista las publicaciones del usuario autenticado.   |
| `POST`   | `/publicaciones`                          | 🔑            | Crea una publicación para el usuario autenticado. |
| `PUT`    | `/publicaciones/:id`                      | 🔑            | Actualiza una publicación propia.                 |
| `DELETE` | `/publicaciones/:id`                      | 🔑            | Elimina una publicación propia.                   |
| `GET`    | `/publicaciones/academico/:usuarioId`     | 👤 Secretaria | Lista publicaciones de un académico específico.  |
| `POST`   | `/publicaciones/academico/:usuarioId`     | 👤 Secretaria | Crea una publicación para un académico.          |
| `PUT`    | `/publicaciones/academico/:usuarioId/:id` | 👤 Secretaria | Actualiza publicación de un académico.           |
| `DELETE` | `/publicaciones/academico/:usuarioId/:id` | 👤 Secretaria | Elimina publicación de un académico.             |

> El mismo patrón (`/mias` + `/academico/:usuarioId`) se repite para todos los recursos de producción científica.

---

### Tesis `/api/tesis`

| Método    | Ruta                                   | Auth          | Descripción                                                   |
| ---------- | -------------------------------------- | ------------- | -------------------------------------------------------------- |
| `GET`    | `/tesis/:nivel`                      | 🔑            | Lista tesis propias.`:nivel` = `MAGISTER` o `DOCTORADO`. |
| `POST`   | `/tesis`                             | 🔑            | Crea una tesis para el usuario autenticado.                    |
| `PUT`    | `/tesis/:id`                         | 🔑            | Actualiza una tesis propia.                                    |
| `DELETE` | `/tesis/:id`                         | 🔑            | Elimina una tesis propia.                                      |
| `GET`    | `/tesis/academico/:usuarioId/:nivel` | 👤 Secretaria | Lista tesis de un académico por nivel.                        |
| `POST`   | `/tesis/academico/:usuarioId`        | 👤 Secretaria | Crea una tesis para un académico.                             |
| `PUT`    | `/tesis/academico/:usuarioId/:id`    | 👤 Secretaria | Actualiza tesis de un académico.                              |
| `DELETE` | `/tesis/academico/:usuarioId/:id`    | 👤 Secretaria | Elimina tesis de un académico.                                |

---

### Libros `/api/libros` · Capítulos `/api/cap-libro` · Investigación `/api/investigacion` · Patentes `/api/patente` · Proyectos de intervención `/api/proyectos-intervencion` · Consultorías `/api/consultorias`

Todos siguen el mismo patrón de endpoints que Publicaciones:

| Método    | Ruta                                    | Auth          | Descripción                        |
| ---------- | --------------------------------------- | ------------- | ----------------------------------- |
| `GET`    | `/{recurso}/mios` (o raíz)           | 🔑            | Lista registros propios             |
| `POST`   | `/{recurso}`                          | 🔑            | Crea registro propio                |
| `PUT`    | `/{recurso}/:id`                      | 🔑            | Actualiza registro propio           |
| `DELETE` | `/{recurso}/:id`                      | 🔑            | Elimina registro propio             |
| `GET`    | `/{recurso}/academico/:usuarioId`     | 👤 Secretaria | Lista registros de un académico    |
| `POST`   | `/{recurso}/academico/:usuarioId`     | 👤 Secretaria | Crea registro para un académico    |
| `PUT`    | `/{recurso}/academico/:usuarioId/:id` | 👤 Secretaria | Actualiza registro de un académico |
| `DELETE` | `/{recurso}/academico/:usuarioId/:id` | 👤 Secretaria | Elimina registro de un académico   |

---

### Categorías `/api/categorias`

| Método | Ruta            | Auth | Descripción                                                                   |
| ------- | --------------- | ---- | ------------------------------------------------------------------------------ |
| `GET` | `/categorias` | 🔓   | Lista las categorías de publicación disponibles (WOS, Scielo, Scopus, etc.). |

---

### Ficha Académica `/api/ficha`

| Método | Ruta                                  | Auth                  | Descripción                                                                      |
| ------- | ------------------------------------- | --------------------- | --------------------------------------------------------------------------------- |
| `GET` | `/ficha/:usuarioId`                 | 👤 Secretaria\| Admin | Retorna el perfil académico completo: datos personales, producción y métricas. |
| `GET` | `/ficha/:usuarioId/export`          | 👤 Secretaria\| Admin | Descarga la ficha académica completa en formato Excel (.xlsx).                   |
| `GET` | `/ficha/:usuarioId/export-magister` | 👤 Secretaria\| Admin | Descarga la ficha filtrada por nivel Magíster en formato Excel (.xlsx).          |

---

### Reportes `/api/profesional-apoyo`

| Método | Ruta                                   | Auth                  | Descripción                                                                       |
| ------- | -------------------------------------- | --------------------- | ---------------------------------------------------------------------------------- |
| `GET` | `/profesional-apoyo/reporte-general` | 🔑                    | Retorna el reporte general agregado por programa (Magíster / Doctorado).          |
| `PUT` | `/profesional-apoyo/reporte-general` | 🔑                    | Actualiza las métricas del reporte de un académico.                              |
| `GET` | `/profesional-apoyo/promedios`       | 👤 Secretaria\| Admin | Obtiene los promedios de producción por programa y tipo (Claustro / Colaborador). |
| `PUT` | `/profesional-apoyo/promedios`       | 👤 Secretaria\| Admin | Actualiza los promedios de producción.                                            |
| `GET` | `/profesional-apoyo/export-excel`    | 👤 Secretaria\| Admin | Descarga el reporte general consolidado en formato Excel (.xlsx).                  |

---

### Notificaciones `/api/notificaciones`

| Método    | Ruta                          | Auth            | Descripción                                                                                            |
| ---------- | ----------------------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| `POST`   | `/notificaciones`           | 👤 Secretaria   | Envía una notificación. Puede ser global (`es_global: true`) o dirigida a académicos específicos. |
| `GET`    | `/notificaciones/enviadas`  | 👤 Secretaria   | Lista las notificaciones enviadas por el Profesional de Apoyo autenticado.                              |
| `DELETE` | `/notificaciones/:id`       | 👤 Secretaria   | Elimina una notificación propia (valida autoría para prevenir IDOR).                                  |
| `GET`    | `/notificaciones/mis`       | 🔑              | Lista todas las notificaciones recibidas por el usuario autenticado.                                    |
| `PUT`    | `/notificaciones/:id/leida` | 🔑              | Marca una notificación como leída.                                                                    |
| `GET`    | `/notificaciones/no-leidas` | 🔑              | Retorna el conteo de notificaciones no leídas del usuario autenticado.                                 |
| `GET`    | `/notificaciones/stream`    | 🎟️ ticket SSE | Abre el stream SSE de notificaciones en tiempo real. Requiere`?ticket={uuid}` en lugar de JWT.        |

---

### Dashboard Profesional de Apoyo `/api/home-profesional`

| Método | Ruta                                  | Auth          | Descripción                                                                                                                 |
| ------- | ------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `GET` | `/home-profesional/actualizaciones` | 👤 Secretaria | Lista los cambios recientes en perfiles académicos (módulo, fecha, académico) para el dashboard del Profesional de Apoyo. |

---

## 7. Frontend — Estructura y páginas

### Rutas y acceso por rol

| Ruta                                  | Componente                   | Rol requerido | Descripción                                                                             |
| ------------------------------------- | ---------------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `/`                                 | `Login.jsx`                | Público      | Formulario de inicio de sesión (RUT + contraseña)                                      |
| `/academico/dashboard`              | `Dashboard.jsx`            | Academico     | Bandeja de notificaciones recibidas del Profesional de Apoyo                             |
| `/academico/perfil`                 | `Perfil.jsx`               | Academico     | Edición del perfil personal: nombres, contacto, grado académico, titulaciones, correos |
| `/academico/publicaciones`          | `Publicaciones.jsx`        | Academico     | CRUD de publicaciones en revistas indexadas                                              |
| `/academico/libros`                 | `Libros.jsx`               | Academico     | CRUD de libros publicados                                                                |
| `/academico/cap-libro`              | `CapLibro.jsx`             | Academico     | CRUD de capítulos de libro                                                              |
| `/academico/tesis`                  | `Tesis.jsx`                | Academico     | CRUD de tesis dirigidas por nivel (Magíster / Doctorado)                                |
| `/academico/investigacion`          | `Investigacion.jsx`        | Academico     | CRUD de proyectos de investigación                                                      |
| `/academico/patente`                | `Patente.jsx`              | Academico     | CRUD de patentes                                                                         |
| `/academico/proyectos-intervencion` | `ProyectoIntervencion.jsx` | Academico     | CRUD de proyectos de intervención                                                       |
| `/academico/consultorias`           | `Consultorias.jsx`         | Academico     | CRUD de consultorías                                                                    |
| `/secretaria/dashboard`             | `Dashboard.jsx`            | Secretaria    | Actividad reciente: qué académico actualizó qué módulo y cuándo                    |
| `/secretaria/fichas`                | `Ficha-Academicas.jsx`     | Secretaria    | Listado de académicos con acceso rápido a perfiles y exportación                      |
| `/secretaria/fichas/:id`            | `EditarFicha.jsx`          | Secretaria    | Perfil completo y edición de la producción de un académico                            |
| `/secretaria/reportes`              | `ReportesSecretaria.jsx`   | Secretaria    | Reporte agregado por programa con promedios; exportación a Excel                        |
| `/secretaria/notificaciones`        | `Notificaciones.jsx`       | Secretaria    | Envío de notificaciones globales o dirigidas; gestión de enviadas                      |
| `/admin/dashboard`                  | `Dashboard.jsx`            | Admin         | Panel principal del administrador                                                        |
| `/admin/usuarios`                   | `Usuarios.jsx`             | Admin         | CRUD de usuarios, asignación de roles y programas, cambio de contraseña                |
| `/admin/roles`                      | `Roles.jsx`                | Admin         | Gestión de roles del sistema y tipos de rol académico                                  |

### Protección de rutas

`ProtectedRoute.jsx` verifica la existencia de un token válido en `localStorage` antes de renderizar cualquier página protegida. Si no existe o ha expirado, redirige a `/` con el parámetro `?expired=1`.

### Cliente HTTP (`fetcher.js`)

Todas las peticiones al servidor pasan por `fetcher.js`, que provee:

- Cabecera `Authorization: Bearer {token}` automática en cada petición.
- Intercepción de respuestas `401`: intenta refrescar el token con `POST /auth/refresh` antes de reintentar la petición original.
- Si el refresh falla, limpia `localStorage` y redirige al login con `?expired=1&redirect={rutaActual}`.
- Validación de redirect para prevenir open redirects.

---

## 8. Hooks compartidos

Los hooks se ubican en `Frontend/src/shared/hooks/`.

### `usePagination(data, perPage = 10)`

Gestiona paginación del lado del cliente para tablas.

```js
const { pageRows, page, setPage, total, totalPages, perPage } = usePagination(rows);
```

| Retorno        | Tipo       | Descripción                                    |
| -------------- | ---------- | ----------------------------------------------- |
| `pageRows`   | `Array`  | Subconjunto de elementos para la página actual |
| `page`       | `number` | Página actual (comienza en 1)                  |
| `setPage`    | `fn`     | Cambia la página activa                        |
| `total`      | `number` | Total de elementos                              |
| `totalPages` | `number` | Total de páginas                               |
| `perPage`    | `number` | Elementos por página                           |

Se resetea automáticamente a la página 1 cuando cambia el array `data`.

---

### `useMobile(breakpoint = 768)`

Detecta si el viewport es menor al breakpoint indicado.

```js
const isMobile = useMobile(); // true si window.innerWidth < 768
```

Registra un listener en `resize` y lo limpia al desmontar.

---

### `useConfirm()`

Provee estado para el modal de confirmación reutilizable.

```js
const { confirmState, confirm, closeConfirm } = useConfirm();

// Uso:
confirm({
  title: "¿Eliminar registro?",
  message: "Esta acción no se puede deshacer.",
  confirmText: "Eliminar",
  onConfirm: async () => { await deleteItem(id); },
});
```

---

### `useSessionExpiry({ warningMs, onWarning })`

Calcula el tiempo restante del JWT activo y llama a `onWarning` 2 minutos antes de que expire, para mostrar el modal de advertencia de sesión.

---

### `useNotificacionesSSE(onNotificacion)`

Gestiona la conexión SSE de notificaciones en tiempo real:

1. Solicita un ticket al backend (`POST /auth/sse-ticket`).
2. Abre un `EventSource` con el ticket en la URL.
3. Invoca el callback `onNotificacion` al recibir cada evento.
4. Cierra la conexión al desmontar el componente.

---

## 9. Componentes compartidos

Los componentes se ubican en `Frontend/src/shared/components/`.

### Navegación

| Componente      | Descripción                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Sidebar.jsx` | Menú lateral con navegación adaptada al rol del usuario. En móvil actúa como drawer con overlay. Acepta props`collapsed`, `mobileOpen`, `onClose`. |
| `Topbar.jsx`  | Barra superior con logo, nombre de usuario, rol y botón de cierre de sesión. En móvil oculta elementos no esenciales.                                     |

### UI general

| Componente            | Props principales                                                  | Descripción                                                                                                              |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `Pagination.jsx`    | `page`, `totalPages`, `total`, `perPage`, `onPageChange` | Controles de paginación con ventana deslizante de 5 páginas y contador de registros. Se oculta si hay una sola página. |
| `Toast.jsx`         | `show`, `message`, `type`, `onClose`                       | Notificación temporal tipo snackbar (success / error / info).                                                            |
| `ActionButtons.jsx` | `onEdit`, `onDelete`                                           | Botones de acción (editar / eliminar) para filas de tabla.                                                               |
| `BtnCreate.jsx`     | `label`, `onClick`, `disabled`                               | Botón primario "Nuevo registro".                                                                                         |

### Modales

| Componente                 | Descripción                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `FormModal.jsx`          | Contenedor genérico para formularios modales. Acepta`title`, `onSubmit`, `onClose`, `submitText`, `submitDisabled`. |
| `ConfirmModal.jsx`       | Modal de confirmación para acciones destructivas. Se integra con`useConfirm()`.                                             |
| `SessionExpiryModal.jsx` | Modal de advertencia de expiración de sesión. Ofrece renovar sesión o cerrar sesión.                                       |

### Inputs de formulario

| Componente                    | Descripción                                                             |
| ----------------------------- | ------------------------------------------------------------------------ |
| `AutoresInput.jsx`          | Campo de texto para lista de autores (separados por coma o punto y coma) |
| `AutorPrincipalInput.jsx`   | Campo para el autor o autora principal                                   |
| `TituloInput.jsx`           | Campo de título con sanitización                                       |
| `YearInput.jsx`             | Selector de año con rango configurable                                  |
| `IssnInput.jsx`             | Campo de ISSN con formato validado                                       |
| `EstadoSelect.jsx`          | Selector de estado: Aceptado, En revisión, Publicado                    |
| `EditorialInput.jsx`        | Campo para nombre de editorial                                           |
| `LugarInput.jsx`            | Campo para lugar de publicación                                         |
| `PeriodoEjecucionInput.jsx` | Campo para período de ejecución de proyectos                           |
| `RespaldoInput.jsx`         | Campo para URL de verificación o enlace a Google Drive                  |
