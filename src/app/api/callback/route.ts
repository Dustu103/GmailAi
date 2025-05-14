// app/api/auth/callback/route.ts
import { getAccessToken, watchGmailInbox } from '../gmail';
import {db} from '../config/sperbaseClient'; // assumes your db() function is here
import { google } from 'googleapis';




export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing auth code', { status: 400 });
  }

  try {
    const auth = await getAccessToken(code);
    const gmail = google.gmail({ version: 'v1', auth });
  const { access_token, refresh_token, expiry_date } = auth.credentials;


    const profile = await gmail.users.getProfile({ userId: 'me' });
    const email = profile.data.emailAddress;

    // Save user credentials to Supabase


    // Setup Gmail watch
    const watchResponse = await watchGmailInbox(auth);
    const historyId = watchResponse.historyId;
    await db(email!, access_token!, refresh_token!, expiry_date!,historyId!);
    console.log('Watch response:', watchResponse);
    // Redirect to main page
    return new Response('Success! You can close this window.')
    return Response.redirect('https://gmailauto.netlify.app/', 302);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
