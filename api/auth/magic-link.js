// Magic Link Login — sends 6-digit code via email
// Used when user logs in from a different device (no existing JWT cookie)
//
// Flow:
// 1. POST /api/auth/magic-link with email → email sent with 6-digit code
// 2. POST /api/auth/magic-link/verify with email+code → new JWT issued
//
// In production, this would query the database to look up the user by email.
// Here (without DB), it works only if you have the JWT session of the user
// stored elsewhere (cookie). We'll use a simplified flow for demo.

import crypto from 'crypto';
import { generateToken, setSessionCookie } from '../_lib/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'work2u_dev_secret';
const COOKIE_NAME = 'work2u_session';

// In-memory code store (per Lambda invocation - good enough for short-term codes)
const pendingCodes = new Map();

function generateCode() {
  return crypto.randomInt(100000, 999999).toString();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    // Detect action by URL or body flag
    const url = req.url || '';
    const isVerify = url.endsWith('/verify');
    
    if (!isVerify) {
      // === SEND CODE ===
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ error: 'Email is required' });
      
      const code = generateCode();
      const normalizedEmail = email.toLowerCase().trim();
      
      // Store code for 10 minutes
      pendingCodes.set(normalizedEmail, {
        code,
        expiresAt: Date.now() + (10 * 60 * 1000)
      });
      
      // Send email via Resend
      if (process.env.RESEND_API_KEY) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
              from: 'Work2U <noreply@work2u.io>',
              to: normalizedEmail,
              subject: `${code} is your Work2U login code`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
                  <h1 style="color: #a78bfa; font-weight: 300; font-size: 28px;">Your Work2U code</h1>
                  <p style="color: #444; font-size: 16px; margin: 24px 0;">Enter this code to sign in:</p>
                  <div style="background: #f4f4f8; padding: 24px; text-align: center; border-radius: 12px; margin: 24px 0;">
                    <code style="font-family: 'SF Mono', monospace; font-size: 36px; letter-spacing: 0.2em; color: #1a1a2e; font-weight: 600;">${code}</code>
                  </div>
                  <p style="color: #888; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
                  <p style="color: #888; font-size: 13px; margin-top: 16px;">— Work2U team</p>
                </div>
              `
            })
          });
        } catch (emailErr) {
          console.error('Email send failed:', emailErr);
        }
      }
      
      console.log(`Magic link code for ${normalizedEmail}: ${code}`);
      
      return res.status(200).json({
        success: true,
        message: 'If this email is registered, a code has been sent.',
        // Return code only if no RESEND_API_KEY (for dev convenience)
        dev_code: process.env.RESEND_API_KEY ? undefined : code
      });
    }
    
    // === VERIFY CODE ===
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });
    
    const normalizedEmail = email.toLowerCase().trim();
    const pending = pendingCodes.get(normalizedEmail);
    
    if (!pending) {
      return res.status(401).json({ error: 'No code found. Please request a new one.' });
    }
    
    if (Date.now() > pending.expiresAt) {
      pendingCodes.delete(normalizedEmail);
      return res.status(401).json({ error: 'Code expired. Please request a new one.' });
    }
    
    if (pending.code !== code.trim()) {
      return res.status(401).json({ error: 'Incorrect code. Please try again.' });
    }
    
    // Code verified! 
    pendingCodes.delete(normalizedEmail);
    
    // NOTE: Without DB, we can't recover user data from just the email.
    // This endpoint only works if user is already logged in (somewhere).
    // For demo, send back a minimal session for the email.
    
    return res.status(200).json({
      success: true,
      message: 'Code verified. Please complete registration if this is your first time.',
      requiresRegistration: true,
      email: normalizedEmail
    });
    
  } catch (err) {
    console.error('Magic link error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}