// === SELF-CONTAINED AUTH using JWT + no persistent DB ===
// 
// Strategy:
// - All user data is stored IN the JWT (encrypted+signed)
// - Server has NO database (works on Vercel free tier with no KV/Redis)
// - Trade-off: can't list users, can't reset passwords without a token
// - All identity lives in the JWT cookie
//
// For production, swap to Supabase/Vercel KV by replacing the 2 functions below.

import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'work2u_dev_secret_change_in_production_properly';

const COOKIE_NAME = 'work2u_session';

// Hash password using PBKDF2 with SHA-512 (built-in Node)
function hashPassword(password, salt) {
  if (!salt) salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(expectedHash)
  );
}

// Generate JWT — user data goes IN the payload
function generateToken(userData) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userData.id,
    email: userData.email,
    name: userData.name,
    firstName: userData.firstName,
    lastName: userData.lastName,
    company: userData.company,
    picture: userData.picture,
    passwordHash: userData.passwordHash,
    passwordSalt: userData.passwordSalt,
    provider: userData.provider,
    googleId: userData.googleId,
    iat: now,
    exp: now + (30 * 24 * 60 * 60) // 30 days
  };
  const base64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const headerB64 = base64url(header);
  const payloadB64 = base64url(payload);
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');
  return `${headerB64}.${payloadB64}.${signature}`;
}

function verifyToken(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function setSessionCookie(res, token, secure = true) {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${30 * 24 * 60 * 60}`,
    'SameSite=Lax'
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax` +
    (process.env.VERCEL_ENV ? '; Secure' : '')
  );
}

function getSessionFromCookie(req) {
  const cookies = (req.headers.cookie || '').split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) return verifyToken(value);
  }
  return null;
}

export {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionFromCookie
};