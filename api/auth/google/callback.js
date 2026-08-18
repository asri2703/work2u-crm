// Google OAuth Callback — exchange code for tokens, create session
import crypto from 'crypto';
import { generateToken, setSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://crm.work2u.io/api/auth/google/callback';
  const isProd = process.env.VERCEL_ENV === 'production';
  
  const appOrigin = isProd || process.env.NODE_ENV === 'production'
    ? 'https://crm.work2u.io'
    : (req.headers.origin || 'http://localhost:3000');
  
  const { code, error } = req.query;
  
  if (error) {
    return res.redirect(302, `${appOrigin}/login?error=${encodeURIComponent(error)}`);
  }
  
  if (!code || !clientId || !clientSecret) {
    return res.redirect(302, `${appOrigin}/login?error=Missing%20authorization%20parameters`);
  }
  
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    
    const tokens = await tokenRes.json();
    if (tokens.error) {
      return res.redirect(302, `${appOrigin}/login?error=${encodeURIComponent(tokens.error_description || tokens.error)}`);
    }
    
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const googleUser = await userInfoRes.json();
    
    if (!googleUser.email) {
      return res.redirect(302, `${appOrigin}/login?error=No%20email%20from%20Google`);
    }
    
    const normalizedEmail = googleUser.email.toLowerCase().trim();
    
    const sessionData = {
      id: 'usr_' + crypto.randomBytes(8).toString('hex'),
      email: normalizedEmail,
      firstName: googleUser.given_name || '',
      lastName: googleUser.family_name || '',
      name: googleUser.name || normalizedEmail.split('@')[0],
      company: '',
      picture: googleUser.picture || null,
      provider: 'google',
      googleId: googleUser.id,
      passwordHash: null,
      passwordSalt: null
    };
    
    const sessionToken = generateToken(sessionData);
    setSessionCookie(res, sessionToken);
    
    return res.redirect(302, `${appOrigin}/dashboard?welcome=true`);
    
  } catch (e) {
    console.error('Google callback error:', e);
    return res.redirect(302, `${appOrigin}/login?error=${encodeURIComponent(e.message)}`);
  }
}