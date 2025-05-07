import { google } from 'googleapis';
import { NextResponse } from 'next/server';
// import { buffer } from 'micro';

// Disable Next.js body parsing to access raw request body
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const rawBody = await req.text(); // Google Pub/Sub sends a JSON string
  const message = JSON.parse(rawBody);

  const data = message.message?.data
    ? JSON.parse(Buffer.from(message.message.data, 'base64').toString())
    : null;

  console.log('📩 New Gmail Notification:', data);

  // You should now fetch messages using `data.historyId` and stored credentials

  return NextResponse.json({ status: 'success' });
}
