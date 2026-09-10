# Frontend — Sistema de Gestión Académica Postgrado de Historia UTA

Aplicación cliente en React 19 + Vite del [Sistema de Gestión Académica — Postgrado de Historia UTA](../README.md). Consume la API del [Server](../Server/README.md) y ofrece tres portales según el rol del usuario autenticado: Académico, Profesional de Apoyo (Secretaría) y Administrador.

> Documentación relacionada: [README general](../README.md) · [DOCUMENTATION.md](../DOCUMENTATION.md) · [Server/README.md](../Server/README.md)

## Tabla de contenidos

1. [Requisitos e instalación](#1-requisitos-e-instalación)
2. [Scripts](#2-scripts)
3. [Variables de entorno](#3-variables-de-entorno)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [Rutas y páginas](#5-rutas-y-páginas)
6. [Autenticación en el cliente](#6-autenticación-en-el-cliente)
7. [Hooks compartidos](#7-hooks-compartidos)
8. [Componentes compartidos](#8-componentes-compartidos)

---

## 1. Requisitos e instalación

- Node.js ≥ 18
- pnpm ≥ 8
- El [Server](../Server/README.md) corriendo (o accesible) en la URL configurada en `VITE_API_URL`

```bash
cd Frontend
pnpm install
pnpm dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## 2. Scripts

| Script | Comando | Descripción |
| ------ | ------- | ----------- |
| `pnpm dev` | `vite` | Servidor de desarrollo con HMR. |
| `pnpm build` | `vite build` | Build de producción. |
| `pnpm preview` | `vite preview` | Sirve el build de producción localmente. |
| `pnpm lint` | `eslint .` | Linting del proyecto. |

---

## 3. Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:3000/api` |

Crear `Frontend/.env` con esta variable antes de levantar el proyecto.

---

## 4. Estructura de carpetas

```
Frontend/
└── src/
    ├── core/
    │   ├── api/
    │   │   └── fetcher.js         # Cliente HTTP: adjunta el JWT, refresca en 401, maneja sesión expirada
    │   ├── auth/
    │   │   ├── auth.service.js              # login, logout, me, google, password-reset
    │   │   ├── email-verification.service.js # registro/confirmación de correo organizacional
    │   │   └── ProtectedRoute.jsx            # Bloquea rutas sin token en localStorage
    │   ├── layouts/
    │   │   ├── AcademicLayout.jsx    # Layout con Sidebar + Topbar para el rol Academico
    │   │   ├── SecretariaLayout.jsx  # Layout para el rol Secretaria
    │   │   └── AdminLayout.jsx       # Layout para el rol Admin
    │   └── router/
    │       └── AppRouter.jsx         # Definición de todas las rutas de la app
    ├── pages/
    │   ├── Login.jsx              # Login con RUT/contraseña + botón de login con Google
    │   ├── GoogleSuccess.jsx      # Recibe el token tras el callback de Google y completa el login
    │   ├── ForgotPassword.jsx     # Solicita el enlace de recuperación de contraseña
    │   ├── ResetPassword.jsx      # Confirma el token y define la nueva contraseña
    │   └── VerificarCorreo.jsx    # Registro y verificación del correo organizacional (código de 6 dígitos)
    ├── features/
    │   ├── academico/
    │   │   ├── pages/             # Dashboard, Perfil, Tesis, Publicaciones, Libros, CapLibro,
    │   │   │                      # Investigacion, Patente, ProyectoIntervencion, Consultorias
    │   │   └── services/          # perfil.service.js, notificacion.service.js,
    │   │                          # produccion-cientifica/*.service.js (uno por recurso)
    │   ├── profesional-apoyo/
    │   │   ├── pages/             # Dashboard, Notificaciones, ficha/, reports/
    │   │   ├── components/        # FichaAcademicaModal
    │   │   └── services/          # ficha, home, notificacion, reporte, produccion-cientifica/*
    │   └── admin/
    │       ├── pages/             # Dashboard, Usuarios, Roles, Configuracion + components/ (modales)
    │       └── services/          # configuracion, dashboard, roles, usuario
    └── shared/
        ├── components/
        │   ├── navigation/         # Sidebar.jsx, Topbar.jsx
        │   ├── modals/             # FormModal, ConfirmModal, SessionExpiryModal
        │   ├── forms/              # Inputs específicos: autores, libro, backup link, estado
        │   └── ui/                 # Pagination, Toast, ActionButtons, BtnCreate, CorreoOrganizacionalCard, inputs/
        ├── context/
        │   └── NotificacionContext.jsx  # Estado global de notificaciones (badge, SSE)
        ├── hooks/                  # usePagination, useMobile, useConfirm, useSessionExpiry, useNotificacionesSSE
        ├── services/
        │   └── categorias.service.js
        ├── styles/                 # theme.css, excel.css
        └── utils/                  # fecha.js, rut.js, sanitize.js
```

---

## 5. Rutas y páginas

### Rutas públicas / de autenticación

| Ruta | Componente | Descripción |
| ---- | ---------- | ----------- |
| `/` | `Login.jsx` | Login con RUT + contraseña, o botón "Continuar con Google". |
| `/auth/google/success` | `GoogleSuccess.jsx` | Recibe el `token` en query string tras el callback de Google y completa el login. |
| `/olvide-password` | `ForgotPassword.jsx` | Formulario para solicitar el enlace de recuperación por RUT. |
| `/reset-password` | `ResetPassword.jsx` | Define la nueva contraseña usando el token recibido por correo. |
| `/verificar-correo` | `VerificarCorreo.jsx` (protegida) | Registro del correo organizacional y confirmación por código. Accesible desde cualquier rol vía el Sidebar. |

### Académico (`/academico/*`, requiere rol Academico)

| Ruta | Componente | Descripción |
| ---- | ---------- | ----------- |
| `dashboard` | `Dashboard.jsx` | Bandeja de notificaciones recibidas del Profesional de Apoyo. |
| `perfil` | `Perfil.jsx` | Edición del perfil personal: nombres, contacto, grado académico, titulaciones, correos. |
| `tesis/:nivel` | `Tesis.jsx` | CRUD de tesis dirigidas, filtrado por `magister` o `doctorado`. |
| `publicaciones` | `Publicaciones.jsx` | CRUD de publicaciones en revistas indexadas. |
| `libros` | `Libros.jsx` | CRUD de libros publicados. |
| `cap-libro` | `CapLibro.jsx` | CRUD de capítulos de libro. |
| `investigacion` | `Investigacion.jsx` | CRUD de proyectos de investigación. |
| `patentes` | `Patente.jsx` | CRUD de patentes. |
| `intervencion` | `ProyectoIntervencion.jsx` | CRUD de proyectos de intervención. |
| `consultorias` | `Consultorias.jsx` | CRUD de consultorías. |

### Secretaría / Profesional de Apoyo (`/secretaria/*`, requiere rol Secretaria)

| Ruta | Componente | Descripción |
| ---- | ---------- | ----------- |
| `dashboard` | `Dashboard.jsx` | Actividad reciente: qué académico actualizó qué módulo y cuándo. |
| `ficha-academicas` | `Ficha-Academicas.jsx` | Listado de académicos con acceso rápido a perfiles y exportación. |
| `ficha/:usuarioId/editar` | `EditarFicha.jsx` | Perfil completo y edición de la producción de un académico. |
| `reportes` | `ReportesSecretaria.jsx` | Reporte agregado por programa con promedios; exportación a Excel. |
| `notificaciones` | `Notificaciones.jsx` | Envío de notificaciones globales o dirigidas (con opción de reenvío por correo) y gestión de enviadas. |

### Admin (`/admin/*`, requiere rol Admin)

| Ruta | Componente | Descripción |
| ---- | ---------- | ----------- |
| `dashboard` | `Dashboard.jsx` | Métricas de correos (cuota, fallidos, pendientes, historial) y de notificaciones. |
| `usuarios` | `Usuarios.jsx` | CRUD de usuarios, asignación de roles y programas, cambio de contraseña. |
| `roles` | `Roles.jsx` | Gestión de roles del sistema y tipos de rol académico. |
| `configuracion` | `Configuracion.jsx` | Parámetros del sistema (remitente de correo, expiraciones, límites) y dominios de correo permitidos. |

### Protección de rutas

`ProtectedRoute.jsx` verifica la existencia de un `token` en `localStorage` antes de renderizar cualquier página protegida (no valida el rol en el cliente — cada layout usa el rol devuelto por `/auth/me` / guardado en `localStorage.user` para armar el menú, y el backend es quien realmente autoriza cada endpoint). Si no hay token, redirige a `/`.

---

## 6. Autenticación en el cliente

### Cliente HTTP (`fetcher.js`)

Todas las peticiones al servidor pasan por `fetcher.js`, que provee:

- Cabecera `Authorization: Bearer {token}` automática (token leído de `localStorage`).
- `credentials: "include"` en cada request, para enviar la cookie HttpOnly del refresh token.
- Intercepción de respuestas `401` (excepto en `/auth/login`): intenta refrescar con `POST /auth/refresh` y reintenta la petición original.
- Si el refresh falla, limpia `localStorage` (`token`, `user`, `role`) y redirige a `/?expired=1&redirect={rutaActual}`, validando que el redirect sea un path relativo seguro (previene open redirect).

### Flujos de autenticación

- **Login con RUT/contraseña**: `Login.jsx` → `loginRequest()` → guarda `token` y `user` en `localStorage`.
- **Login con Google**: el botón en `Login.jsx` navega a `googleLoginUrl()` (`GET {VITE_API_URL}/auth/google`); tras el callback del backend, `GoogleSuccess.jsx` recibe el `token` por query string, lo persiste y redirige según el rol.
- **Recuperar contraseña**: `ForgotPassword.jsx` → `passwordResetSolicitarRequest({ rut })`; `ResetPassword.jsx` (con el `token` de la URL) → `passwordResetConfirmarRequest({ token, nuevaPassword })`.
- **Verificación de correo organizacional**: `VerificarCorreo.jsx` usa `email-verification.service.js` para registrar el correo, confirmar el código de 6 dígitos y reenviarlo si expira. El estado (verificado / pendiente) se muestra también en `CorreoOrganizacionalCard.jsx`, reutilizado en `Perfil.jsx` y en el Sidebar de Secretaría/Admin.

---

## 7. Hooks compartidos

Los hooks se ubican en `src/shared/hooks/`.

### `usePagination(data, perPage = 10)`

Gestiona paginación del lado del cliente para tablas.

```js
const { pageRows, page, setPage, total, totalPages, perPage } = usePagination(rows);
```

Se resetea automáticamente a la página 1 cuando cambia el array `data`.

### `useMobile(breakpoint = 768)`

Detecta si el viewport es menor al breakpoint indicado (`window.innerWidth < 768` por defecto). Registra un listener en `resize` y lo limpia al desmontar.

### `useConfirm()`

Provee estado para el modal de confirmación reutilizable.

```js
const { confirmState, confirm, closeConfirm } = useConfirm();

confirm({
  title: "¿Eliminar registro?",
  message: "Esta acción no se puede deshacer.",
  confirmText: "Eliminar",
  onConfirm: async () => { await deleteItem(id); },
});
```

### `useSessionExpiry({ warningMs, onWarning })`

Calcula el tiempo restante del JWT activo y llama a `onWarning` antes de que expire, para mostrar el modal de advertencia de sesión.

### `useNotificacionesSSE(onNotificacion)`

Gestiona la conexión SSE de notificaciones en tiempo real:

1. Solicita un ticket al backend (`POST /auth/sse-ticket`).
2. Abre un `EventSource` con el ticket en la URL (`VITE_API_URL` + `/notificaciones/stream?ticket=...`).
3. Invoca el callback `onNotificacion` al recibir cada evento.
4. Cierra la conexión al desmontar el componente.

---

## 8. Componentes compartidos

Los componentes se ubican en `src/shared/components/`.

### Navegación

| Componente | Descripción |
| ---------- | ----------- |
| `Sidebar.jsx` | Menú lateral con navegación adaptada al rol del usuario (leído de `localStorage.user`). En móvil actúa como drawer con overlay. Acepta `collapsed`, `mobileOpen`, `onClose`. |
| `Topbar.jsx` | Barra superior con logo, nombre de usuario, rol y botón de cierre de sesión. En móvil oculta elementos no esenciales. |

### UI general

| Componente | Props principales | Descripción |
| ---------- | ------------------ | ----------- |
| `Pagination.jsx` | `page`, `totalPages`, `total`, `perPage`, `onPageChange` | Controles de paginación con ventana deslizante de 5 páginas. Se oculta si hay una sola página. |
| `Toast.jsx` | `show`, `message`, `type`, `onClose` | Notificación temporal tipo snackbar (success / error / info). |
| `ActionButtons.jsx` | `onEdit`, `onDelete` | Botones de acción para filas de tabla. |
| `BtnCreate.jsx` | `label`, `onClick`, `disabled` | Botón primario "Nuevo registro". |
| `CorreoOrganizacionalCard.jsx` | — | Tarjeta de estado del correo organizacional (verificado / pendiente), con enlace a `/verificar-correo`. |

### Modales

| Componente | Descripción |
| ---------- | ----------- |
| `FormModal.jsx` | Contenedor genérico para formularios modales (`title`, `onSubmit`, `onClose`, `submitText`, `submitDisabled`). |
| `ConfirmModal.jsx` | Modal de confirmación para acciones destructivas. Se integra con `useConfirm()`. |
| `SessionExpiryModal.jsx` | Modal de advertencia de expiración de sesión. Ofrece renovar sesión o cerrar sesión. |

### Inputs de formulario

| Componente | Descripción |
| ---------- | ----------- |
| `AutoresInput.jsx` | Campo de texto para lista de autores (separados por coma o punto y coma). |
| `AutorPrincipalInput.jsx` | Campo para el autor o autora principal. |
| `TituloInput.jsx` | Campo de título con sanitización. |
| `YearInput.jsx` | Selector de año con rango configurable. |
| `IssnInput.jsx` | Campo de ISSN con formato validado. |
| `EstadoSelect.jsx` | Selector de estado: Aceptado, En revisión, Publicado. |
| `EditorialInput.jsx` / `NombreLibroInput.jsx` / `LugarInput.jsx` | Campos específicos para libros. |
| `PeriodoEjecucionInput.jsx` | Campo para período de ejecución de proyectos. |
| `RespaldoInput.jsx` | Campo para URL de verificación o enlace de respaldo. |
