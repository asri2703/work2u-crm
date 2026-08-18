// Groq AI Assistant
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

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
          { role: 'user', content: prompt }
        ],
        max_tokens: 600
      })
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).json({ error: 'Groq error', detail: err });
    }

    const data = await r.json();
    return res.status(200).json({ text: data.choices?.[0]?.message?.content || 'No response' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}