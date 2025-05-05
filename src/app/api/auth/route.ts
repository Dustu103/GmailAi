import { getAuthUrl } from '../gmail'

export async function GET() {
  const url = getAuthUrl();
  return Response.redirect(url, 302);
}
