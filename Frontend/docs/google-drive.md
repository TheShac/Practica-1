# Integración con Google Drive (Frontend)

Este documento cubre únicamente la parte del frontend relacionada con la subida de PDF que terminan guardados en Google Drive. La lógica de conexión con la API de Google vive en el backend; ver [`Backend/docs/google-drive.md`](../../Backend/docs/google-drive.md) para ese lado.

## 1. Resumen

No existe ningún flujo de "Conectar con Google" ni pantalla de configuración de Google en el frontend. El usuario simplemente selecciona un archivo PDF en un formulario normal; el frontend lo envía al backend como `multipart/form-data`, y es el backend quien lo sube a Drive (con una cuenta de Google fija, configurada por variables de entorno del servidor). El frontend solo se encarga de:

1. Capturar el archivo en el formulario.
2. Enviarlo al backend dentro de un `FormData`.
3. Mostrar, tras guardar, un link para ver el PDF directamente en Google Drive.

## 2. Archivos involucrados

| Archivo | Rol |
|---|---|
| [`src/pages/academico/Publicaciones.jsx`](../src/pages/academico/Publicaciones.jsx) | Única página conectada a este flujo: formulario de alta/edición de publicaciones con input de archivo PDF y columna "PDF Drive" en la tabla. |
| [`src/services/api.js`](../src/services/api.js) | `createPublicacion(formData)` / `updatePublicacion(id, formData)` — usadas por académicos para su propio perfil. |
| [`src/services/api.service.js`](../src/services/api.service.js) | `createPublicacionParaAcademico(usuarioId, formData)` / variante de edición — usadas por Secretaría para publicar a nombre de un académico. |
| [`src/components/forms/backupLink/RespaldoInput.jsx`](../src/components/forms/backupLink/RespaldoInput.jsx) | Input de texto libre para pegar manualmente un `link_verificacion` externo, como alternativa a subir el PDF a Drive. |

## 3. Formulario de subida (`Publicaciones.jsx`)

- Input de archivo: `<input type="file" accept=".pdf">`, cuyo valor se guarda en el estado del formulario como `form.archivoPdf`.
- Al enviar (crear o editar), se arma un `FormData`:
  ```js
  const formData = new FormData();
  // ...otros campos del formulario...
  if (form.archivoPdf) {
    formData.append("pdf", form.archivoPdf);
  }
  ```
- Si no se selecciona un archivo nuevo al editar, no se agrega `pdf` al `FormData` — el backend conserva el `link_verificacion`/`google_drive_id` ya guardados.
- El nombre del campo (`pdf`) debe coincidir exactamente con el que espera `multer` en el backend (`upload.single('pdf')`).

## 4. Listado y visualización del PDF guardado en Drive

Al recibir la lista de publicaciones del backend, cada registro se mapea agregando:

```js
driveId: p.google_drive_id || ""
```

En la tabla, la columna **"PDF Drive"** renderiza, cuando `driveId` existe:

```jsx
<a href={`https://drive.google.com/file/d/${driveId}/view`} target="_blank" rel="noreferrer">
  Ver PDF
</a>
```

Este link se construye directamente en el frontend a partir del `google_drive_id` que devuelve el backend — no hay ninguna llamada a la API de Google desde el frontend; el archivo ya es público por link (permiso configurado en el backend al subirlo), por lo que abre directamente en una pestaña nueva sin requerir login de Google.

## 5. Comunicación con el backend

- `src/services/api.js` usa `fetch` nativo (no axios). `createPublicacion`/`updatePublicacion` hacen `POST`/`PUT` a `${VITE_API_URL}/publicaciones[...]` con `body: formData` — **sin fijar manualmente `Content-Type`**, para que el navegador agregue el `boundary` correcto de `multipart/form-data`. Se agrega el header `Authorization: Bearer <token>`.
- `src/services/api.service.js` implementa las variantes usadas por Secretaría (`.../publicaciones/academico/:usuarioId`). ⚠️ **Punto a verificar**: estas funciones fijan `"Content-Type": "application/json"` explícitamente aunque el `body` enviado es un `FormData`; esto puede impedir que `multer` en el backend parsee correctamente el archivo en las rutas "para académico". Si al usar el flujo de Secretaría el PDF no llega a Drive, revisar primero este header.

## 6. Variables de entorno del frontend

```
VITE_API_URL=
```

Debe apuntar a la URL base del backend (ej. `http://localhost:3000/api` en desarrollo). No hay variables de entorno de Google en el frontend: toda la configuración de Google (credenciales, carpeta destino) vive únicamente en el backend.

## 7. Qué NO hace el frontend

- No pide permisos de Google al usuario ni maneja tokens de Google.
- No sube el archivo directamente a la API de Drive; siempre pasa por el backend.
- No permite elegir carpeta de destino en Drive (es fija, definida en el backend).
- No borra archivos de Drive al eliminar/editar una publicación (limitación también presente en el backend, ver su documentación).

## 8. Ver también

- Documentación del lado backend (autenticación OAuth2, endpoints, variables de entorno del servidor): [`Backend/docs/google-drive.md`](../../Backend/docs/google-drive.md)
