import { google } from 'googleapis';
import 'dotenv/config';

// Configuramos el cliente OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // URI obligatoria
);

// Le pasamos el refresh token para que sepa quién eres
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

export const drive = google.drive({ version: 'v3', auth: oauth2Client });
export const FOLDER_ID = process.env.DRIVE_FOLDER_ID;