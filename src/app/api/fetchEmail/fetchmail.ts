import { google } from 'googleapis';
import { updateHistoryId } from '../config/helper';

export async function fetchNewEmails(email: string, historyId: string, accessToken: string) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    const response = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: historyId,
      historyTypes: ['messageAdded'], // Optional: filter for new messages
      maxResults: 20, // Optional: limit results
    });

    const historyRecords = response.data.history || [];

    for (const record of historyRecords) {
      if (record.messagesAdded) {
        for (const added of record.messagesAdded) {
          const msgId = added.message?.id;
          console.log(`📩 New message ID: ${msgId}`);
          // Optional: fetch full message here if needed
        }
      }
    }

    // ✅ SAFELY get the new historyId and update DB
    const newHistoryId = response.data.historyId;
    if (newHistoryId) {
      await updateHistoryId(email, newHistoryId);
      console.log(`✅ Updated historyId for ${email} → ${newHistoryId}`);
    } else {
      console.warn('⚠️ No new historyId returned from Gmail.');
    }

  } catch (err) {
    console.error('❌ Error fetching new emails:', err);
  }
}
