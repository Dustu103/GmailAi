import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

export function getOAuthClient(): OAuth2Client {
  const client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  return client;
}

export function getAuthUrl(): string {
  const client = getOAuthClient();
  return client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
}

export async function getAccessToken(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  return client;
}

export async function listGmailLabels(auth: OAuth2Client) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.labels.list({ userId: 'me' });
  return res.data.labels || [];
}


export async function watchGmailInbox(auth: OAuth2Client) {
    const gmail = google.gmail({ version: 'v1', auth });
  
    const res = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        topicName: process.env.TOPIC_NAME,
        labelIds: ['INBOX'],
        labelFilterAction: 'include',
      },
    });
  
    return res.data;
  }
