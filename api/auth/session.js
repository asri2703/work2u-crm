// Session check endpoint — returns current user info from JWT cookie
import { getSessionFromCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  
  if (req.method === 'OPTIONS') return res.status(204).end();
  
  const session = getSessionFromCookie(req);
  
  if (!session || !session.sub) {
    return res.status(200).json({ authenticated: false });
  }
  
  return res.status(200).json({
    authenticated: true,
    user: {
      id: session.sub,
      email: session.email,
      name: session.name,
      company: session.company,
      picture: session.picture
    }
  });
}