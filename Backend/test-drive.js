import 'dotenv/config';
import { google } from 'googleapis';

async function finalTest() {
    try {
        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );
        auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

        const drive = google.drive({ version: 'v3', auth });

        console.log("📤 Subiendo archivo final a través de OAuth2...");

        const res = await drive.files.create({
            requestBody: {
                name: 'EXITO_TOTAL.txt',
                parents: [process.env.DRIVE_FOLDER_ID],
            },
            media: {
                mimeType: 'text/plain',
                body: 'Si este archivo subió, ya no hay límites de cuota. ¡Felicidades!',
            },
            fields: 'id, name'
        });

        console.log("🚀 ¡SUBIDA EXITOSA!");
        console.log("🆔 ID del archivo:", res.data.id);

    } catch (error) {
        console.error("❌ Error final:", error.response ? error.response.data : error.message);
    }
}

finalTest();