// WhatsApp Webhook Receiver - receives events from WhatsApp service
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Verify secret (set in WhatsApp service .env)
  const expectedSecret = process.env.WHATSAPP_WEBHOOK_SECRET || 'work2u_webhook_secret_change_me';
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