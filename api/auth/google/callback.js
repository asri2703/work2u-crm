// Google OAuth Callback
export default async function handler(req, res) {
  const { code, error } = req.query;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || appBaseUrl + '/api/auth/google/callback';

  if (error) return res.redirect(302, appBaseUrl + '/crm?gmail_error=' + encodeURIComponent(error));
  if (!code || !clientId || !clientSecret) return res.status(400).json({ error: 'Missing params' });

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: clientId, client_secret: clientSecret,
        redirect_uri: redirectUri, grant_type: 'authorization_code'
      })
    });
    const tokens = await tokenRes.json();
    if (tokens.error) return res.redirect(302, appBaseUrl + '/crm?gmail_error=' + encodeURIComponent(tokens.error_description || tokens.error));

    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000)
    };
    const tokenStr = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    return res.redirect(302, appBaseUrl + '/crm#gmail_token=' + tokenStr);
  } catch (e) {
    return res.redirect(302, appBaseUrl + '/crm?gmail_error=' + encodeURIComponent(e.message));
  }
}
