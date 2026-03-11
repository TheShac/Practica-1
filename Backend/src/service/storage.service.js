import { drive, FOLDER_ID } from "../config/googleDrive.js";
import { Readable } from "stream";

/**
 * Sube un archivo a Google Drive y otorga permisos de lectura.
 */
export async function uploadToGoogleDrive(file) {
  try {
    // Convertimos el buffer de Multer en un Readable Stream
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    // 1. Crear el archivo en la carpeta especificada
    const response = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.originalname}`,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.mimetype,
        body: stream,
      },
      fields: "id, webViewLink",
      supportsAllDrives: true, // Requerido para carpetas institucionales/compartidas
    });

    const fileId = response.data.id;

    // 2. CAMBIO DE PERMISOS: Hacer que el archivo sea visible para cualquiera con el link
    // Esto es vital para que tus académicos puedan abrir el PDF desde la tabla
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return {
      id: fileId,
      webViewLink: response.data.webViewLink,
    };
  } catch (error) {
    console.error("Error en Google Drive Service (Upload):", error);
    throw new Error("Error al subir el archivo a Google Drive");
  }
}

/**
 * Elimina un archivo de Google Drive por su ID.
 */
export async function deleteFromGoogleDrive(fileId) {
  try {
    if (!fileId) return;
    
    await drive.files.delete({
      fileId: fileId,
      supportsAllDrives: true,
    });
    
    console.log(`Archivo eliminado de Drive: ${fileId}`);
  } catch (error) {
    // Si el archivo ya no existe en Drive, no lanzamos error para no romper el flujo
    console.error("Error al eliminar de Drive (puede que el archivo no exista):", error.message);
  }
}