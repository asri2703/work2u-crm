// Groq AI Assistant
import { getSessionFromCookie } from '../_lib/auth.js';

/* This endpoint spends the Work2U Groq key on every call, so it has to know
 * who is calling. It previously required nothing at all and sent
 * Access-Control-Allow-Origin: *, which made it an open LLM proxy any page
 * on the internet could bill to this account.
 *
 * CORS is narrowed as defence in depth — it only constrains browsers, so the
 * session check below is what actually closes the hole. */
/* The split deployment in the README has crm.work2u.io calling
 * api.work2u.io, which is cross-origin. So the allowed set is a
 * comma-separated list, falling back to APP_BASE_URL when unset. */
function allowedOrigins() {
  const configured = String(process.env.WORK2U_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
  if (configured.length) return configured;
  const base = String(process.env.APP_BASE_URL || '').trim().replace(/\/$/, '');
  return base ? [base] : [];
}

function applyCors(req, res) {
  const origin = String(req.headers.origin || '').replace(/\/$/, '');

  if (origin && allowedOrigins().includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const session = getSessionFromCookie(req);
  if (!session || !session.sub) {
    return res.status(401).json({ error: 'Sign in to use the assistant' });
  }

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  // Cap the input as well as the output, so one request cannot run up a
  // large bill on its own.
  const text = String(prompt).slice(0, 8000);

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured' });

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant for Work2U CRM. Help users with task management, lead conversion, accounting, and business strategy. Be concise, friendly, and use Bahasa Malaysia when appropriate.'
          },
          { role: 'user', content: text }
        ],
        max_tokens: 600
      })
    });

    if (!r.ok) {
      // The upstream body can name the model, quota, and account, so it is
      // logged rather than returned to the caller.
      const detail = await r.text();
      console.error('Groq error', r.status, detail);
      return res.status(502).json({ error: 'Assistant is unavailable right now' });
    }

    const data = await r.json();
    return res.status(200).json({ text: data.choices?.[0]?.message?.content || 'No response' });
  } catch (e) {
    console.error('Groq request failed', e);
    return res.status(500).json({ error: 'Assistant request failed' });
  }
}
