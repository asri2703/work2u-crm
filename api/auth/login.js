// Email/Password login endpoint
// JWT-cookie based authentication with password verification
//
// Works fully for users registered in the same browser session.
// For cross-device login, use magic-link.

import { verifyPassword, generateToken, setSessionCookie, getSessionFromCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    const existingSession = getSessionFromCookie(req);
    
    if (existingSession && existingSession.email === normalizedEmail && existingSession.passwordHash && existingSession.passwordSalt) {
      const valid = verifyPassword(password, existingSession.passwordSalt, existingSession.passwordHash);
      if (valid) {
        // Refresh the session (extend expiry) - don't include hashed password in the refreshed token
        const tokenData = {
          id: existingSession.sub,
          email: existingSession.email,
          name: existingSession.name,
          firstName: existingSession.firstName,
          lastName: existingSession.lastName,
          company: existingSession.company,
          picture: existingSession.picture,
          passwordHash: existingSession.passwordHash,
          passwordSalt: existingSession.passwordSalt,
          provider: existingSession.provider,
          googleId: existingSession.googleId
        };
        const newToken = generateToken(tokenData);
        setSessionCookie(res, newToken);
        return res.status(200).json({
          success: true,
          user: {
            id: existingSession.sub,
            email: existingSession.email,
            name: existingSession.name,
            company: existingSession.company,
            picture: existingSession.picture
          }
        });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    }
    
    return res.status(401).json({
      error: 'No active session. Please register first, then sign in from the same browser.'
    });
    
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}