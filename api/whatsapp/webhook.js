// WhatsApp Webhook Receiver - receives events from WhatsApp service
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Fail closed: with no secret configured, the endpoint is not enabled. The
  // old fallback here was a literal string committed to a public repo, so
  // "unset" silently accepted a secret anyone could read.
  const expectedSecret = process.env.WHATSAPP_WEBHOOK_SECRET;
  if (!expectedSecret) {
    return res.status(503).json({ error: 'Webhook secret not configured' });
  }
  const { event, data, secret } = req.body || {};

  if (secret !== expectedSecret) {
    return res.status(401).json({ error: 'Invalid secret' });
  }
  
  // For now, just acknowledge. In production, store in database or push via SSE
  console.log('WhatsApp event:', event, data?.from);
  
  return res.status(200).json({ 
    received: true, 
    event,
    at: Date.now()
  });
}