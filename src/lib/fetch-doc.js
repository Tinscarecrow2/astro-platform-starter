import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

export async function handler(docKey) {

    if (!docKey) throw new Error('docKey is required');

    const docId = process.env[`DOC_ID_${docKey.toUpperCase()}`];
    if (!docId) throw new Error(`No document ID found for key: ${docKey}`);

    
    const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
	refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

  const docs = google.docs({ version: 'v1', auth: oauth2Client });

  try {
    const res = await docs.documents.get({ documentId: docId });

    const plainText = res.data.body.content
      .map(block =>
        block.paragraph?.elements?.map(el => el.textRun?.content || '').join('') || ''
      )
      .join('\n');

    return {
      statusCode: 200,
      body: JSON.stringify({ content: plainText })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
