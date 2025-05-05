// app/api/auth/callback/route.ts
import { getAccessToken, listGmailLabels } from '../gmail';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing auth code', { status: 400 });
  }

  try {
    const auth = await getAccessToken(code);
    const labels = await listGmailLabels(auth);
    return Response.json({ labels });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
