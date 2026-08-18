// Email/Password registration endpoint
// Self-contained auth using JWT with embedded user data
// No database required — works on Vercel free tier

import crypto from 'crypto';
import { hashPassword, generateToken, setSessionCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { email, password, firstName, lastName, company } = req.body || {};
    
    // Validation
    if (!email || !password || !firstName || !lastName || !company) {
      return res.status(400).json({ error: 'All fields are required: email, password, firstName, lastName, company' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Hash password
    const { salt, hash } = hashPassword(password);
    
    const user = {
      id: 'usr_' + crypto.randomBytes(8).toString('hex'),
      email: normalizedEmail,
      name: `${firstName} ${lastName}`.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company.trim(),
      picture: null,
      provider: 'email',
      passwordHash: hash,
      passwordSalt: salt,
      googleId: null,
      createdAt: new Date().toISOString()
    };
    
    // Issue token — user data goes IN JWT (no DB needed)
    const token = generateToken(user);
    setSessionCookie(res, token);
    
    // Return user info (no password)
    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        picture: user.picture
      },
      message: 'Account created successfully'
    });
    
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}