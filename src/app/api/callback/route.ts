// app/api/auth/callback/route.ts
import { getAccessToken, watchGmailInbox } from '../gmail';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing auth code', { status: 400 });
  }

  try {
    const auth = await getAccessToken(code);
    const watchResponse = await watchGmailInbox(auth);
    console.log('Watch response:', watchResponse);
    // const labels = await listGmailLabels(auth);
    return Response.redirect('/api/notifications', 302);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
