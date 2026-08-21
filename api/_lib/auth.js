// === SELF-CONTAINED AUTH using JWT + no persistent DB ===
// 
// Strategy:
// - All user data is stored IN the JWT (encrypted+signed)
// - Server has NO database (works on Vercel free tier with no KV/Redis)
// - Trade-off: can't list users, can't reset passwords without a token
// - All identity lives in the JWT cookie
//
// For production, swap to Supabase/Vercel KV by replacing the 2 functions below.
//
// KNOWN LIMITATION: because there is no store, the password hash and salt
// travel inside the JWT payload (see generateToken). The payload is signed
// but only base64-encoded, not encrypted, so anyone who captures the cookie
// can read the PBKDF2 hash and attempt to crack it offline. The hash is
// PBKDF2-SHA512 at 10k iterations, which slows that down but does not make it
// safe to publish. Moving identity into Supabase (the anon key and RLS are
// already set up) would let the hash stay server-side and should be the next
// step for this file.

import crypto from 'crypto';

/* This secret signs every session cookie. The old fallback here was a
 * literal string committed to a public repo, and JWT_SECRET was set in no
 * env file, so production ran on it. Anyone could read the string from
 * GitHub, sign a cookie with any sub/email/role, and log in as any user —
 * super admin included. There is no way to make an app secret safe once it
 * is public, so there is no safe default: an unset secret is a hard error,
 * not a fallback.
 *
 * A dev-only fallback is allowed, generated fresh each start so it is never
 * a known value. It changes on restart, which logs dev sessions out — the
 * correct trade-off, and the nudge to set JWT_SECRET in .env.local. */
function resolveJwtSecret() {
  const configured = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (configured && configured.length >= 32) return configured;

  if (configured) {
    throw new Error('JWT_SECRET is set but too short — use at least 32 random characters.');
  }

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    throw new Error(
      'JWT_SECRET is not set. Refusing to start with a default signing secret. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64url\'))"'
    );
  }

  if (!globalThis.__W2U_DEV_JWT_SECRET) {
    globalThis.__W2U_DEV_JWT_SECRET = crypto.randomBytes(48).toString('base64url');
    console.warn('[auth] JWT_SECRET not set — using a random dev secret. Sessions reset on restart. Set JWT_SECRET in .env.local.');
  }
  return globalThis.__W2U_DEV_JWT_SECRET;
}

const JWT_SECRET = resolveJwtSecret();

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