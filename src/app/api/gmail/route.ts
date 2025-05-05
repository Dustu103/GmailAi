import { NextRequest, NextResponse } from 'next/server';
import { getOAuthClient, watchGmailInbox } from '../gmail';

export async function POST(req: NextRequest) {
  const { accessToken, refreshToken } = await req.json();

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
  }

  const client = getOAuthClient();
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  try {
    const result = await watchGmailInbox(client);
    console.log('Watch result:', result);
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
