import express from 'express';
import multer from 'multer';
import { uploadToGoogleDrive } from '../services/storage.service.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    // 1. Subir a Google Drive
    const driveFile = await uploadToGoogleDrive(req.file);

    // 2. Aquí guardarías driveFile.id en tu Base de Datos (MySQL/Mongo)
    // const dbResponse = await MiModelo.create({ googleId: driveFile.id, nombre: driveFile.name });

    res.status(200).json({
      message: 'Archivo guardado con éxito',
      fileId: driveFile.id,
      link: driveFile.webViewLink
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;