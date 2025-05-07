import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pubsubMessage = body.message;
    const data = pubsubMessage?.data
      ? JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString())
      : null;

    console.log('📩 New Gmail Notification:', data);

    // Optionally: Use data.historyId to fetch emails with stored OAuth tokens

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('❌ Error handling Pub/Sub message:', error);
    return NextResponse.json({ error: 'Invalid Pub/Sub message' }, { status: 400 });
  }
}
