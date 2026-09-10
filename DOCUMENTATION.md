# Documentación Técnica General — Sistema de Gestión Académica Postgrado de Historia UTA

Esta documentación cubre la **visión general, arquitectura, roles y seguridad** del sistema completo (frontend + backend). Para el detalle específico de cada parte, revisa:

- [Server/README.md](Server/README.md) — módulos del backend, referencia completa de la API REST, sistema de colas de correo.
- [Frontend/README.md](Frontend/README.md) — rutas, páginas, hooks y componentes del frontend.

## Tabla de contenidos

1. [Visión general](#1-visión-general)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Roles y permisos](#3-roles-y-permisos)
4. [Autenticación y seguridad](#4-autenticación-y-seguridad)
5. [Sistema de correo y colas](#5-sistema-de-correo-y-colas)
6. [Base de datos](#6-base-de-datos)

---

## 1. Visión general

El sistema es una aplicación web full-stack diseñada para gestionar y centralizar la producción científica y académica del programa de Postgrado en Historia de la Universidad de Tarapacá (UTA), el cual comprende los programas de **Magíster** y **Doctorado en Historia**.

Su propósito principal es dar soporte al proceso de **acreditación** del programa. Los académicos registran su producción directamente en la plataforma; el **Profesional de Apoyo** (secretaría) administra los datos, supervisa los perfiles y descarga los reportes e informes necesarios para sustentar la acreditación ante los organismos evaluadores. El **Administrador** gestiona usuarios, roles y la configuración general del sistema (dominios de correo permitidos, remitente, parámetros de expiración, etc.).

### Stack tecnológico

| Capa                          | Tecnología                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| Frontend                      | React 19, React Router v7, Vite, Bootstrap 5, Recharts                             |
| Backend                       | Node.js, Express 5 (ejecutado con`tsx`)                                          |
| Base de datos                 | MySQL 8                                                                            |
| Colas / caché                | Redis, BullMQ (cola`email`), Bull Board (monitoreo, solo dev)                    |
| Autenticación                | JWT (access token) + Refresh token (cookie HttpOnly) + Google OAuth 2.0 (Passport) |
| Correo                        | Resend (envío), React Email (plantillas JSX)                                      |
| Seguridad                     | bcrypt, Helmet, express-rate-limit, CORS, express-session                          |
| Notificaciones en tiempo real | Server-Sent Events (SSE)                                                           |
| Exportación                  | ExcelJS                                                                            |

---

## 2. Arquitectura del sistema

```
┌──────────────────────────────────────────────────────────┐
│                       CLIENTE                            │
│              React 19 + Vite (puerto 5173)               │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐           │
│  │ Academico│  │ Prof.    │  │ Administrador │           │
│  │ Layout   │  │ Apoyo    │  │ Layout        │           │
│  │          │  │ Layout   │  │               │           │
│  └──────────┘  └──────────┘  └───────────────┘           │
│         │            │               │                   │
│         └────────────┴───────────────┘                   │
│                      │                                   │
│              fetcher.js (API client)                     │
│          Authorization: Bearer {JWT}                     │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP / SSE
┌──────────────────────▼───────────────────────────────────────────┐
│                       SERVIDOR                                   │
│              Express 5 + Node.js (puerto 3000)                   │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌─────────┐     │
│  │  auth    │  │ rate limiter │  │   helmet   │  │ passport│     │
│  │middleware│  │ middleware   │  │ middleware │  │ (Google)│     │
│  └──────────┘  └──────────────┘  └────────────┘  └─────────┘     │
│                                                                  │
│  /api/auth   /api/users        /api/publicaciones                │
│  /api/tesis  /api/libros       /api/investigacion                │
│  /api/ficha  /api/notificaciones   /api/configuracion  ...       │
└──────────┬───────────────────────────────────┬───────────────────┘
           │ mysql2 (pool)                     │ BullMQ (cola "email")
┌──────────▼───────────────────┐      ┌───────────▼──────────────────┐
│      BASE DE DATOS           │      │     REDIS                    │
│         MySQL 8              │      │  sesiones · cola de correo   │
│ postgrado_historia           │      │  (BullMQ worker → Resend)    │
└──────────────────────────────┘      └──────────────────────────────┘
```

### Estructura de carpetas (resumen)

```
Practica-1/
├── Frontend/
│   └── src/            # Ver Frontend/README.md para el detalle completo
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
│   └── src/             # Ver Server/README.md para el detalle completo
│       ├── config/           # Conexión a MySQL (pool)
│       ├── core/             # sseTicketStore.js, tokenRevocationStore.js
│       ├── middlewares/      # auth.js, rateLimiter.js
│       ├── modules/
│       │   ├── users/        # auth, user (CRUD, perfil, roles)
│       │   └── profesional-apoyo/  # notificacion, ficha, reportes, dashboard
│       └── utils/
└── database/
    └── Dump20260728.sql   # Esquema vigente de la base de datos
```

---

## 3. Roles y permisos

El sistema define tres roles de sistema y dos tipos de rol académico.

### Roles de sistema

| Rol                  | Descripción                                                                                                                  | Rutas de acceso   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **Academico**  | Docente del programa. Registra y gestiona su propia producción científica.                                                  | `/academico/*`  |
| **Secretaria** | Profesional de Apoyo. Administra datos de todos los académicos, envía notificaciones y exporta reportes para acreditación. | `/secretaria/*` |
| **Admin**      | Administrador del sistema. Gestiona usuarios, roles, configuración general y dominios de correo permitidos.                  | `/admin/*`      |

### Tipos de rol académico

Cada académico puede pertenecer a uno o ambos programas (Magíster / Doctorado) con un tipo de participación:

| Tipo                  | Descripción                                     |
| --------------------- | ------------------------------------------------ |
| **Claustro**    | Académico de planta, miembro pleno del programa |
| **Colaborador** | Académico colaborador o asociado al programa    |

Esta distinción es relevante para los reportes de acreditación, donde los promedios de producción científica se calculan de forma separada para Claustro y Colaboradores.

### Matriz de acceso funcional

| Recurso                                         | Academico | Secretaria | Admin |
| ----------------------------------------------- | --------- | ---------- | ----- |
| CRUD producción propia                         | ✅        | —         | —    |
| Ver/editar producción de cualquier académico  | —        | ✅         | —    |
| Enviar notificaciones                           | —        | ✅         | —    |
| Exportar reportes / fichas                      | —        | ✅         | ✅    |
| Gestión de usuarios y roles                    | —        | —         | ✅    |
| Configuración del sistema y dominios de correo | —        | —         | ✅    |
| Verificar correo organizacional manualmente     | —        | —         | ✅    |
| Dashboard de actualizaciones (secretaría)      | —        | ✅         | —    |
| Dashboard de correos/notificaciones (admin)     | —        | —         | ✅    |

Ver la referencia completa de endpoints y qué rol accede a cada uno en [Server/README.md](Server/README.md#referencia-de-endpoints).

---

## 4. Autenticación y seguridad

### Flujo de autenticación (RUT + contraseña)

```
[Login]
   │
   ▼
POST /api/auth/login { rut, password }
   │
   ├─ Backend verifica RUT → bcrypt.compare(password, hash)
   ├─ Genera access token (JWT, 15 min) → retorna en body
   └─ Genera refresh token (JWT, 7 días) → retorna en HttpOnly SameSite:Strict cookie

[Petición autenticada]
   │
   ▼
Authorization: Bearer {access_token}
   │
   ├─ middleware auth() → jwt.verify(token, JWT_SECRET)
   └─ req.user = { usuario_id, rol }

[Token expirado — refresh automático]
   │
   ▼
fetcher.js recibe 401 en cualquier ruta (excepto /auth/login)
   │
   ├─ POST /api/auth/refresh (cookie enviada automáticamente)
   ├─ Backend valida refresh token + revocationStore
   ├─ Emite nuevo access token → almacenado en localStorage
   └─ Reintenta la petición original

[Logout]
   │
   ▼
POST /api/auth/logout
   ├─ Backend registra revocación del refresh token en tokenRevocationStore
   └─ Limpia cookie HttpOnly
```

### Login con Google (OAuth 2.0)

`GET /api/auth/google` inicia el flujo vía Passport (`passport-google-oauth20`), respaldado por una sesión efímera en Redis (`express-session` + `connect-redis`, 5 min de expiración). `GET /api/auth/google/callback` recibe el perfil de Google, resuelve o vincula el usuario y redirige al frontend (`/auth/google/success?token=...`) con el mismo par access/refresh token que el login tradicional.

### Recuperación de contraseña

1. `POST /api/password-reset/solicitar { rut }` — genera un token de un solo uso (hash SHA-256 almacenado, expira según `expiracion_reset_min`, configurable) y envía un correo de recuperación **solo si** el usuario tiene su correo organizacional verificado. La respuesta es siempre el mismo mensaje genérico, para no filtrar si el RUT existe.
2. `POST /api/password-reset/confirmar { token, nuevaPassword }` — valida el token, actualiza la contraseña (bcrypt) y lo invalida.

### Verificación de correo organizacional

1. El académico registra su correo institucional (`POST /api/email-verification/registrar`) — se valida contra la lista de dominios permitidos (`dominio_permitido`, administrable desde `/admin/configuracion`).
2. Se genera un código de 6 dígitos (hash bcrypt), con expiración configurable (`expiracion_codigo_min`) y límite de reenvíos (`limite_reenvios`).
3. El usuario confirma el código (`POST /api/email-verification/confirmar`); si es la primera verificación, se envía un correo de bienvenida.
4. El Admin puede verificar manualmente a un usuario (`POST /api/email-verification/:usuarioId/verificar-manual`) si el correo falla.

El correo organizacional verificado es un requisito para poder recibir notificaciones por correo y para poder solicitar recuperación de contraseña.

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

| Medida                        | Implementación                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| Hashing de contraseñas       | bcrypt (cost factor 10)                                                                     |
| Tokens JWT                    | Firmados con`JWT_SECRET`, access 15 min, refresh 7 días                                  |
| Revocación de tokens         | In-memory Map`tokenRevocationStore` (invalida todos los refresh al hacer logout)          |
| Tickets SSE de un solo uso    | In-memory Map`sseTicketStore`, TTL 30 s, uso único                                       |
| Sesión OAuth                 | `express-session` respaldada por Redis, cookie de 5 min, solo para el handshake de Google |
| CORS restringido              | Solo acepta peticiones desde`FRONTEND_URL`                                                |
| Rate limiting                 | `express-rate-limit`: global (300 req/15 min) y login/reset/verificación (10 req/5 min)  |
| Cabeceras de seguridad        | Helmet.js                                                                                   |
| SQL Injection                 | `mysql2` con prepared statements en todas las queries                                     |
| Inyección de columnas        | Allowlist en la actualización de usuarios                                                  |
| IDOR (notificaciones)         | DELETE valida`remitente_id = req.user.usuario_id`                                         |
| Open redirect                 | `fetcher.js` valida que la URL de redirect empiece por `/` y no por `//`              |
| Sanitización de inputs       | `sanitize.js` en el frontend, para campos de texto libres                                 |
| Dominios de correo permitidos | El correo organizacional solo se acepta si su dominio está en`dominio_permitido`         |
| Tokens de un solo uso         | Los tokens de recuperación de contraseña se hashean (SHA-256) y se invalidan tras su uso  |

---

## 5. Sistema de correo y colas

Todos los correos salientes (verificación, recuperación de contraseña, notificaciones, bienvenida) se **encolan** en BullMQ (cola `email`, sobre Redis) en vez de enviarse de forma síncrona:

- `email.queue.js` agrega el job con reintentos (3 intentos, backoff exponencial desde 5 s).
- `email.worker.js` consume la cola (concurrencia 5), respeta una **cuota diaria/mensual** (`quota.service.js`: 100/día, 3000/mes) y reencola el correo para el día siguiente si se alcanza el límite.
- El envío real ocurre vía **Resend** (`email.service.js`); el remitente (`correo`/`nombre`) es configurable desde `configuracion_sistema`.
- Cada intento de envío se registra en `email_logs` (estado `enviado` / `error`).
- En desarrollo, `http://localhost:3000/admin/queues` expone **Bull Board** para inspeccionar los jobs de la cola.
- Las plantillas de correo (`Server/src/emails/*.jsx`) usan React Email; pueden previsualizarse con `pnpm email:dev` (ver [Server/README.md](Server/README.md)).

El Admin puede consultar el estado agregado de este sistema (enviados hoy/mes, fallidos, pendientes, historial) desde `/admin/dashboard` → `GET /api/dashboard/correos`.

---

## 6. Base de datos

El esquema vigente se encuentra en [`database/Dump20260728.sql`](database/Dump20260728.sql).

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

usuario ──┬── correo_organizacional ── verificacion_correo
          └── password_reset_token

dominio_permitido          configuracion_sistema          email_logs

notificacion ─────── notificacion_destinatario ── usuario
     │
     └─────────── notificacion_global_leido ───── usuario
```

### Grupos de tablas

| Grupo                             | Tablas                                                                                                                                              | Descripción                                                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Usuarios y roles                  | `usuario`, `rol`, `rol_academico`, `programa`, `usuario_programa`, `grado_academico`, `titulacion`, `mail`                          | Cuentas, roles del sistema, tipo de participación académica y datos de perfil.                                 |
| Producción científica           | `publicaciones`, `categoria`, `libro`, `cap_libro`, `tesis`, `investigacion`, `patente`, `proyectos_intervencion`, `consultorias` | Registros de producción de cada académico. Todas con`CASCADE DELETE` sobre `usuario_id`.                   |
| Reportes                          | `reporte_academico`, `reporte_promedios`, `reporte_wos_global`                                                                                | Métricas y promedios agregados por programa y tipo académico, usados en acreditación.                         |
| Notificaciones                    | `notificacion`, `notificacion_destinatario`, `notificacion_global_leido`                                                                      | Notificaciones globales o dirigidas, con estado de lectura y de envío por correo.                               |
| Correo organizacional y seguridad | `correo_organizacional`, `verificacion_correo`, `password_reset_token`, `dominio_permitido`                                                 | Registro y verificación del correo institucional, tokens de recuperación de contraseña y dominios permitidos. |
| Sistema                           | `configuracion_sistema`, `email_logs`                                                                                                           | Parámetros configurables (remitente, expiraciones, límites) y auditoría de cada correo enviado.               |

Para el detalle columna por columna de cada tabla, revisa directamente el esquema en [`database/Dump20260728.sql`](database/Dump20260728.sql).
