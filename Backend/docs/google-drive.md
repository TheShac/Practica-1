# Integración con Google Drive (Backend)

Este documento explica cómo funciona la integración con Google Drive que permite guardar directamente en una carpeta de Drive los PDF que se suben desde el sistema. Cubre solo este tema; no es documentación general del backend.

## 1. Resumen

Cuando un usuario sube un PDF en el módulo **Publicaciones**, el backend lo envía a una carpeta fija de Google Drive usando una cuenta de Google configurada por variables de entorno (no hay login de Google por parte del usuario final). El backend guarda en la base de datos el `id` del archivo en Drive y el link para verlo.

## 2. Modelo de autenticación

Se usa **OAuth2 "de servidor" con refresh token pre-generado**, no una cuenta de servicio (service account) y no un flujo OAuth interactivo por usuario:

- No hay archivo de credenciales `.json` de service account.
- No hay endpoint `/auth/google` ni pantalla de "Conectar con Google" — el usuario nunca autoriza nada.
- El `refresh_token` se generó **una sola vez, manualmente, fuera de la app** (típicamente vía [OAuth Playground](https://developers.google.com/oauthplayground)) y se guarda como variable de entorno estática. Por eso la redirect URI hardcodeada en el código es `https://developers.google.com/oauthplayground`.
- Todos los archivos se suben siempre con la misma cuenta de Google (la que autorizó ese refresh token), independientemente de qué usuario del sistema haga la subida.

El paquete `googleapis` obtiene automáticamente un `access_token` nuevo a partir del `refresh_token` en cada request; no hay que renovarlo manualmente ni se persiste en base de datos.

> Nota: `package.json` incluye `passport` y `passport-google-oauth20`, pero no se usan en ningún archivo — no implementan login social con Google, solo están instaladas.

## 3. Archivos involucrados

| Archivo | Rol |
|---|---|
| [`src/config/googleDrive.js`](../src/config/googleDrive.js) | Crea el cliente `OAuth2` y el cliente `drive` de `googleapis`. Exporta `drive` y `FOLDER_ID`. |
| [`src/service/storage.service.js`](../src/service/storage.service.js) | Sube (`uploadToGoogleDrive`) y borra (`deleteFromGoogleDrive`) archivos en Drive. |
| [`src/controllers/publicaciones/publicacion.controller.js`](../src/controllers/publicaciones/publicacion.controller.js) | Orquesta la subida: llama al servicio y guarda el resultado en la BD. |
| [`src/routes/publicaciones/publicacion.routes.js`](../src/routes/publicaciones/publicacion.routes.js) | Define los endpoints con `multer` para recibir el PDF. |
| [`src/routes/upload.routes.js`](../src/routes/upload.routes.js) | Endpoint de prueba `POST /upload-pdf`. **No está montado en `app.js`**, no es alcanzable en producción; además importa `storage.service.js` desde una ruta (`services/`, plural) que no existe. Se deja como referencia/scaffold, no usar. |
| `test-drive.js` (raíz del backend) | Script manual (`node test-drive.js`) para validar que las credenciales de Drive siguen funcionando, fuera del servidor Express. |

## 4. Variables de entorno

Configurar en `Backend/.env` (no existe `.env.example` en el repo; crear el archivo localmente con estas claves):

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
DRIVE_FOLDER_ID=
```

| Variable | Descripción |
|---|---|
| `GOOGLE_CLIENT_ID` | Client ID del proyecto OAuth2 en Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | Client secret asociado. |
| `GOOGLE_REFRESH_TOKEN` | Refresh token de la cuenta de Google que tiene acceso a la carpeta destino (generado una vez, manualmente). |
| `DRIVE_FOLDER_ID` | ID de la carpeta de Google Drive donde se guardan todos los PDF (se obtiene de la URL de la carpeta en Drive). |

Los scopes de Google (p. ej. `drive` o `drive.file`) no están declarados en el código: se otorgaron al generar el refresh token, fuera del repositorio. Si hay que regenerarlo, hacerlo con un scope que permita crear archivos y modificar permisos (`https://www.googleapis.com/auth/drive`).

### Cómo regenerar el `GOOGLE_REFRESH_TOKEN` si expira o se revoca

1. Ir a [OAuth Playground](https://developers.google.com/oauthplayground).
2. En el ícono de configuración (⚙️), activar "Use your own OAuth credentials" e ingresar `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
3. Seleccionar el scope de Drive (`https://www.googleapis.com/auth/drive`), autorizar con la cuenta de Google dueña de la carpeta.
4. Intercambiar el authorization code por tokens y copiar el `refresh_token` al `.env`.
5. Verificar con `node test-drive.js` que la subida de prueba funciona.

## 5. Flujo de subida (end-to-end)

1. El frontend envía `POST /api/publicaciones` (o `PUT /api/publicaciones/:id`, o las variantes `/academico/:usuarioId` usadas por Secretaría) como `multipart/form-data`, con el archivo en el campo `pdf`.
2. `multer` (configurado con `memoryStorage`, ver `publicacion.routes.js`) intercepta el archivo y lo deja en `req.file.buffer` — **nunca se escribe a disco**.
3. Los middlewares `auth` (JWT) y, en las rutas `/academico/*`, `authorizeRoles("Secretaria")` validan al usuario.
4. El controlador llama a un helper (`handleDriveUpload`) que, si hay `req.file`, invoca `uploadToGoogleDrive(req.file)`.
5. `uploadToGoogleDrive` (en `storage.service.js`):
   - Convierte `file.buffer` en un stream (`Readable`).
   - Llama a `drive.files.create({ requestBody: { name: \`${Date.now()}-${file.originalname}\`, parents: [FOLDER_ID] }, media: { mimeType, body: stream }, supportsAllDrives: true })` — sube el archivo directamente dentro de la carpeta `DRIVE_FOLDER_ID`.
   - Llama a `drive.permissions.create({ fileId, requestBody: { role: "reader", type: "anyone" } })` — hace el archivo accesible por link sin necesitar sesión de Google (necesario porque el frontend arma el link directamente, sin pasar por una API autenticada).
   - Retorna `{ id, webViewLink }`.
6. El controlador guarda en la tabla `publicaciones`:
   - `google_drive_id` = `id` del archivo en Drive.
   - `link_verificacion` = `webViewLink`.
7. Si se edita una publicación sin subir un PDF nuevo, se conservan `google_drive_id`/`link_verificacion` existentes (no se vuelve a subir nada).

### Nombrado de archivos

Cada archivo se guarda en Drive con el nombre `Date.now()-<nombre-original>` para evitar colisiones entre archivos con el mismo nombre.

### Carpeta destino

Es una única carpeta fija (`DRIVE_FOLDER_ID`), sin subcarpetas por usuario, tipo de documento ni fecha. `supportsAllDrives: true` indica que puede ser una carpeta dentro de una Unidad Compartida (Shared Drive) institucional.

## 6. Base de datos

Columna añadida a la tabla `publicaciones` (ver `src/database/database_postgradoH.sql`):

```sql
ALTER TABLE publicaciones ADD COLUMN google_drive_id VARCHAR(255) AFTER link_verificacion;
```

- `link_verificacion` (ya existente): URL para ver el archivo (`webViewLink` de Drive).
- `google_drive_id`: ID del archivo en Drive, usado por el frontend para construir `https://drive.google.com/file/d/{id}/view`.

> La misma migración agregó `google_drive_id` también a las tablas `libro`, `cap_libro`, `investigacion`, `tesis`, `patente`, `proyectos_intervencion` y `consultorias`, dejando el esquema listo para extender la subida a Drive a esos módulos. **Actualmente solo Publicaciones tiene la lógica de subida implementada** — esos otros controladores no usan `multer` ni `storage.service.js`.

## 7. Limitaciones conocidas / pendientes

- **No hay limpieza de archivos huérfanos**: `deleteFromGoogleDrive` está implementada en `storage.service.js` pero no se llama desde ningún controlador. Al eliminar o reemplazar una publicación (subir un PDF nuevo), el archivo anterior queda en Drive sin borrarse.
- **Acceso público por link**: todo archivo subido queda con permiso `anyone/reader`. No hay control de acceso más granular a nivel de Drive (el control de acceso real ocurre en la capa de la aplicación, vía JWT, antes de mostrar el link).
- **Una sola cuenta / una sola carpeta**: no hay soporte para múltiples carpetas ni múltiples cuentas de Google.
- **Extensión pendiente a otros módulos**: Libros, Capítulos de Libro, Investigación, Tesis, Patentes, Proyectos de Intervención y Consultorías tienen la columna `google_drive_id` en BD pero no la lógica de subida a Drive.
- **`upload.routes.js` no usar**: es un endpoint de prueba no montado en `app.js` y con un import roto (`../services/storage.service.js` en vez de `../service/storage.service.js`).

## 8. Ver también

- Documentación del lado frontend: [`Frontend/docs/google-drive.md`](../../Frontend/docs/google-drive.md)
