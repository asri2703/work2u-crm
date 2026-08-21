const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const crypto = require('crypto');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const ROOT_RESOLVED = path.resolve(ROOT);
const { handleExpenseDashboard } = require('./lib/expense-dashboard');
const { handleExpenseReceipts } = require('./lib/expense-receipts');

loadEnvFile(path.join(ROOT, '.env.local'));
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers
  });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function redirect(res, location, status = 302) {
  res.writeHead(status, { Location: location });
  res.end();
}

function appBaseUrl() {
  return process.env.APP_BASE_URL || `http://localhost:${PORT}`;
}

function runtimeDataDir() {
  return process.env.VERCEL ? path.join('/tmp', 'work2u-crm') : path.join(ROOT, 'data');
}

function supabaseRestBase() {
  if (process.env.SUPABASE_URL) return String(process.env.SUPABASE_URL).replace(/\/+$/, '');
  if (process.env.SUPABASE_PROJECT_ID) {
    return `https://${String(process.env.SUPABASE_PROJECT_ID).replace(/[^a-z0-9-]/gi, '')}.supabase.co`;
  }
  return '';
}

function supabaseAuthBase() {
  return supabaseRestBase();
}

function supabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

function supabaseAdminHeaders(extra = {}) {
  const key = supabaseServiceRoleKey();
  if (!key) return null;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra
  };
}

async function supabaseRest(pathname, { method = 'GET', query = {}, body = null } = {}) {
  const base = supabaseRestBase();
  const headers = supabaseAdminHeaders();
  if (!base || !headers) return null;

  const url = new URL(`${base}/rest/v1/${pathname.replace(/^\/+/, '')}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Supabase REST ${response.status}`);
  }

  return data;
}

async function supabaseUpsert(table, row, conflict = 'id') {
  const base = supabaseRestBase();
  const headers = supabaseAdminHeaders({
    Prefer: 'resolution=merge-duplicates,return=representation'
  });
  if (!base || !headers) return null;

  const url = new URL(`${base}/rest/v1/${String(table).replace(/^\/+/, '')}`);
  url.searchParams.set('on_conflict', conflict);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(row)
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Supabase upsert failed for ${table}`);
  }

  return data;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });
}

const WORK2U_COMPANY = {
  name: 'Work2U',
  legalName: 'Saga X Ventures (NS0246319-H)',
  website: 'https://work2u.io',
  companyWebsite: 'https://sagaxventures.com',
  email: 'enquiry@work2u.io',
  phone: '+6013-773 2703',
  address: '136-1, Jalan Komersial Senawang, Taipan 1, 70450 Seremban, Negeri Sembilan'
};

function resendFromHeader() {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@work2u.io';
  const fromName = process.env.RESEND_FROM_NAME || 'Work2U';
  return `${fromName} <${fromEmail}>`;
}

function buildResendEmailShell({ preheader = '', title = 'Work2U', bodyHtml = '', footerNote = '' } = {}) {
  return `
    <div style="margin:0;padding:0;background:#f8fafc">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;line-height:1px">
        ${escapeHtml(preheader)}
      </div>
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;font-family:Inter,Arial,sans-serif;color:#0f172a">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:24px;padding:28px;box-shadow:0 18px 40px rgba(15,23,42,0.08)">
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#64748b;margin-bottom:12px">
            ${escapeHtml(WORK2U_COMPANY.name)}
          </div>
          <h1 style="margin:0 0 18px;font-size:28px;line-height:1.15">${escapeHtml(title)}</h1>
          <div style="font-size:16px;line-height:1.7;color:#334155">
            ${bodyHtml}
          </div>
          ${footerNote ? `<p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#64748b">${escapeHtml(footerNote)}</p>` : ''}
        </div>
        <div style="padding:18px 8px 0;font-size:13px;line-height:1.7;color:#64748b">
          <p style="margin:0 0 8px"><strong style="color:#0f172a">${escapeHtml(WORK2U_COMPANY.name)}</strong> ${escapeHtml(WORK2U_COMPANY.legalName)}</p>
          <p style="margin:0 0 8px">Website: <a href="${escapeHtml(WORK2U_COMPANY.website)}" style="color:#1d4ed8;text-decoration:none">${escapeHtml(WORK2U_COMPANY.website.replace('https://', ''))}</a></p>
          <p style="margin:0 0 8px">Company website: <a href="${escapeHtml(WORK2U_COMPANY.companyWebsite)}" style="color:#1d4ed8;text-decoration:none">${escapeHtml(WORK2U_COMPANY.companyWebsite.replace('https://', ''))}</a></p>
          <p style="margin:0 0 8px">Email: <a href="mailto:${escapeHtml(WORK2U_COMPANY.email)}" style="color:#1d4ed8;text-decoration:none">${escapeHtml(WORK2U_COMPANY.email)}</a></p>
          <p style="margin:0 0 8px">Phone: <a href="tel:${escapeHtml(WORK2U_COMPANY.phone.replace(/\s+/g, ''))}" style="color:#1d4ed8;text-decoration:none">${escapeHtml(WORK2U_COMPANY.phone)}</a></p>
          <p style="margin:0">Address: ${escapeHtml(WORK2U_COMPANY.address)}</p>
        </div>
      </div>
    </div>
  `;
}

function buildResendEmailCta(href = '', label = 'Open link') {
  const target = String(href || '').trim();
  if (!target) return '';
  return `
    <p style="margin:24px 0 0">
      <a href="${escapeHtml(target)}" style="display:inline-block;padding:12px 18px;background:#1d4ed8;color:#fff;border-radius:12px;text-decoration:none;font-weight:600">
        ${escapeHtml(label)}
      </a>
    </p>
  `;
}

function formatEmailMoney(amount, currency = 'MYR') {
  const value = Number(amount);
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${currency} ${safeValue.toFixed(2)}`;
}

function formatEmailDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

async function sendResendEmail({ to, subject, html, text, from, replyTo, tags, headers, idempotencyKey } = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { skipped: true, reason: 'RESEND_API_KEY not configured' };
  }

  const recipients = (Array.isArray(to) ? to : [to]).map((value) => String(value || '').trim()).filter(Boolean);
  if (!recipients.length) throw new Error('Missing recipient');
  if (!subject) throw new Error('Missing email subject');
  if (!html && !text) throw new Error('Missing email body');

  const payload = {
    from: from || resendFromHeader(),
    to: recipients.length === 1 ? recipients[0] : recipients,
    subject
  };

  if (html) payload.html = html;
  if (text) payload.text = text;
  if (replyTo || process.env.RESEND_REPLY_TO) payload.reply_to = replyTo || process.env.RESEND_REPLY_TO;
  if (Array.isArray(tags) && tags.length) payload.tags = tags;
  if (headers && typeof headers === 'object') payload.headers = headers;

  const requestHeaders = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  if (idempotencyKey) requestHeaders['Idempotency-Key'] = idempotencyKey;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(payload)
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Resend email failed with status ${response.status}`);
  }

  return {
    provider: 'resend',
    id: data?.id || null,
    to: recipients,
    subject
  };
}

async function generateSupabaseMagicLink({ email, redirectTo, shouldCreateUser = true } = {}) {
  const base = supabaseAuthBase();
  const headers = supabaseAdminHeaders();
  if (!base || !headers) {
    throw new Error('Supabase auth admin is not configured');
  }

  const recipient = String(email || '').trim();
  if (!recipient) throw new Error('Missing email');

  const response = await fetch(`${base}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'magiclink',
      email: recipient,
      options: {
        redirectTo: redirectTo || `${appBaseUrl()}/work2u`,
        shouldCreateUser
      }
    })
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    throw new Error(data?.msg || data?.message || data?.error_description || data?.error || `Supabase generate link failed with status ${response.status}`);
  }

  const link =
    data?.properties?.action_link ||
    data?.properties?.actionLink ||
    data?.action_link ||
    data?.actionLink ||
    data?.link ||
    data?.properties?.action_url ||
    data?.action_url ||
    '';

  return { data, link };
}

async function notifyBillingCheckoutEmail({ email, name, workspaceName, plan, provider, paymentUrl, region }) {
  const recipient = String(email || '').trim();
  const paymentLink = String(paymentUrl || '').trim();
  if (!recipient || !paymentLink) return { skipped: true, reason: 'Missing email or payment URL' };

  const planInfo = normalizeBillingPlan(plan);
  const customerName = String(name || workspaceName || 'there').trim() || 'there';
  const workspaceLabel = String(workspaceName || 'Work2U').trim() || 'Work2U';
  const regionLabel = String(region || 'Global').trim() || 'Global';
  const subject = `Your Work2U ${planInfo.code} checkout link is ready`;
  const html = buildResendEmailShell({
    preheader: `Complete your ${planInfo.code} checkout for ${workspaceLabel}.`,
    title: `Complete your ${planInfo.code} checkout`,
    bodyHtml: `
      <p style="margin-top:0">Hi ${escapeHtml(customerName)},</p>
      <p>Your Work2U <strong>${escapeHtml(planInfo.code)}</strong> checkout is ready.</p>
      <div style="margin:20px 0;padding:16px;border:1px solid #e5e7eb;border-radius:18px;background:#f8fafc">
        <div style="margin-bottom:8px"><strong>Workspace:</strong> ${escapeHtml(workspaceLabel)}</div>
        <div style="margin-bottom:8px"><strong>Region:</strong> ${escapeHtml(regionLabel)}</div>
        <div><strong>Billing provider:</strong> ${escapeHtml(provider || 'unknown')}</div>
      </div>
      ${buildResendEmailCta(paymentLink, 'Complete payment')}
      <p style="margin-bottom:0">If you did not request this checkout, you can ignore this email.</p>
    `,
    footerNote: 'Need help? Reply to this email and our team will help you continue the checkout.'
  });
  const text = [
    `Hi ${customerName},`,
    '',
    `Your Work2U ${planInfo.code} checkout is ready.`,
    `Workspace: ${workspaceLabel}`,
    `Region: ${regionLabel}`,
    `Billing provider: ${provider || 'unknown'}`,
    '',
    `Complete payment here: ${paymentLink}`,
    '',
    'If you did not request this checkout, you can ignore this email.',
    '',
    'Work2U'
  ].join('\n');

  return sendResendEmail({
    to: recipient,
    subject,
    html,
    text,
    replyTo: process.env.RESEND_REPLY_TO || 'enquiry@work2u.io',
    tags: [
      { name: 'source', value: 'billing_checkout' },
      { name: 'plan', value: planInfo.code }
    ],
    idempotencyKey: crypto.createHash('sha256').update(`${recipient}|${subject}|${paymentLink}`).digest('hex')
  });
}

async function notifyMagicLinkEmail({ email, name, loginLink, workspaceName, expiresInMinutes = 15 } = {}) {
  const recipient = String(email || '').trim();
  const signInLink = String(loginLink || '').trim();
  if (!recipient || !signInLink) return { skipped: true, reason: 'Missing email or sign-in link' };

  const customerName = String(name || 'there').trim() || 'there';
  const workspaceLabel = String(workspaceName || 'Work2U').trim() || 'Work2U';
  const subject = 'Your Work2U sign-in link';
  const html = buildResendEmailShell({
    preheader: `Use this magic link to sign in to ${workspaceLabel}.`,
    title: 'Sign in to Work2U',
    bodyHtml: `
      <p style="margin-top:0">Hi ${escapeHtml(customerName)},</p>
      <p>Your sign-in link for <strong>${escapeHtml(workspaceLabel)}</strong> is ready.</p>
      <div style="margin:20px 0;padding:16px;border:1px solid #e5e7eb;border-radius:18px;background:#f8fafc">
        <div style="margin-bottom:8px"><strong>Expires in:</strong> ${escapeHtml(String(expiresInMinutes))} minutes</div>
        <div style="word-break:break-all"><strong>Link:</strong> ${escapeHtml(signInLink)}</div>
      </div>
      ${buildResendEmailCta(signInLink, 'Sign in now')}
      <p style="margin-bottom:0">If you did not request this link, you can ignore this email.</p>
    `,
    footerNote: 'Need help signing in? Reply to this email and we will assist you.'
  });
  const text = [
    `Hi ${customerName},`,
    '',
    `Your Work2U sign-in link for ${workspaceLabel} is ready.`,
    `Expires in: ${expiresInMinutes} minutes`,
    `Link: ${signInLink}`,
    '',
    'If you did not request this link, you can ignore this email.',
    '',
    'Work2U'
  ].join('\n');

  return sendResendEmail({
    to: recipient,
    subject,
    html,
    text,
    replyTo: process.env.RESEND_REPLY_TO || 'enquiry@work2u.io',
    tags: [
      { name: 'source', value: 'auth_magic_link' }
    ],
    idempotencyKey: crypto.createHash('sha256').update(`${recipient}|${subject}|${signInLink}`).digest('hex')
  });
}

async function notifyInvoiceSentEmail({ email, name, invoiceNumber, amount, dueDate, documentUrl, workspaceName, currency = 'MYR' } = {}) {
  const recipient = String(email || '').trim();
  const docLink = String(documentUrl || '').trim();
  if (!recipient || !invoiceNumber) return { skipped: true, reason: 'Missing email or invoice number' };

  const customerName = String(name || 'there').trim() || 'there';
  const workspaceLabel = String(workspaceName || 'Work2U').trim() || 'Work2U';
  const amountLabel = formatEmailMoney(amount, currency);
  const dueDateLabel = formatEmailDate(dueDate);
  const subject = `Invoice ${invoiceNumber} from ${workspaceLabel}`;
  const html = buildResendEmailShell({
    preheader: `Invoice ${invoiceNumber} has been sent from ${workspaceLabel}.`,
    title: `Invoice ${invoiceNumber} sent`,
    bodyHtml: `
      <p style="margin-top:0">Hi ${escapeHtml(customerName)},</p>
      <p>Your invoice has been sent from <strong>${escapeHtml(workspaceLabel)}</strong>.</p>
      <div style="margin:20px 0;padding:16px;border:1px solid #e5e7eb;border-radius:18px;background:#f8fafc">
        <div style="margin-bottom:8px"><strong>Invoice number:</strong> ${escapeHtml(invoiceNumber)}</div>
        <div style="margin-bottom:8px"><strong>Amount:</strong> ${escapeHtml(amountLabel)}</div>
        ${dueDateLabel ? `<div style="margin-bottom:8px"><strong>Due date:</strong> ${escapeHtml(dueDateLabel)}</div>` : ''}
        ${docLink ? `<div style="word-break:break-all"><strong>Document:</strong> ${escapeHtml(docLink)}</div>` : ''}
      </div>
      ${buildResendEmailCta(docLink, 'View invoice')}
      <p style="margin-bottom:0">You can keep this email as a record or reply if you need help.</p>
    `,
    footerNote: 'Need a copy or adjustment? Reply to this email and we will help.'
  });
  const text = [
    `Hi ${customerName},`,
    '',
    `Your invoice ${invoiceNumber} has been sent from ${workspaceLabel}.`,
    `Amount: ${amountLabel}`,
    ...(dueDateLabel ? [`Due date: ${dueDateLabel}`] : []),
    ...(docLink ? [`Document: ${docLink}`] : []),
    '',
    'Work2U'
  ].join('\n');

  return sendResendEmail({
    to: recipient,
    subject,
    html,
    text,
    replyTo: process.env.RESEND_REPLY_TO || 'enquiry@work2u.io',
    tags: [
      { name: 'source', value: 'invoice_sent' },
      { name: 'invoice', value: String(invoiceNumber) }
    ],
    idempotencyKey: crypto.createHash('sha256').update(`${recipient}|${subject}|${invoiceNumber}`).digest('hex')
  });
}

async function notifyPaymentReminderEmail({ email, name, invoiceNumber, amount, dueDate, paymentUrl, workspaceName, currency = 'MYR' } = {}) {
  const recipient = String(email || '').trim();
  const paymentLink = String(paymentUrl || '').trim();
  if (!recipient || !invoiceNumber) return { skipped: true, reason: 'Missing email or invoice number' };

  const customerName = String(name || 'there').trim() || 'there';
  const workspaceLabel = String(workspaceName || 'Work2U').trim() || 'Work2U';
  const amountLabel = formatEmailMoney(amount, currency);
  const dueDateLabel = formatEmailDate(dueDate);
  const subject = `Payment reminder for invoice ${invoiceNumber}`;
  const html = buildResendEmailShell({
    preheader: `Reminder for invoice ${invoiceNumber} from ${workspaceLabel}.`,
    title: `Payment reminder`,
    bodyHtml: `
      <p style="margin-top:0">Hi ${escapeHtml(customerName)},</p>
      <p>This is a friendly reminder for <strong>invoice ${escapeHtml(invoiceNumber)}</strong> from <strong>${escapeHtml(workspaceLabel)}</strong>.</p>
      <div style="margin:20px 0;padding:16px;border:1px solid #e5e7eb;border-radius:18px;background:#f8fafc">
        <div style="margin-bottom:8px"><strong>Amount:</strong> ${escapeHtml(amountLabel)}</div>
        ${dueDateLabel ? `<div style="margin-bottom:8px"><strong>Due date:</strong> ${escapeHtml(dueDateLabel)}</div>` : ''}
        ${paymentLink ? `<div style="word-break:break-all"><strong>Payment link:</strong> ${escapeHtml(paymentLink)}</div>` : ''}
      </div>
      ${buildResendEmailCta(paymentLink, 'Pay now')}
      <p style="margin-bottom:0">If you already made the payment, please ignore this reminder.</p>
    `,
    footerNote: 'Need help with payment? Reply to this email and we will assist you.'
  });
  const text = [
    `Hi ${customerName},`,
    '',
    `This is a friendly reminder for invoice ${invoiceNumber} from ${workspaceLabel}.`,
    `Amount: ${amountLabel}`,
    ...(dueDateLabel ? [`Due date: ${dueDateLabel}`] : []),
    ...(paymentLink ? [`Payment link: ${paymentLink}`] : []),
    '',
    'If you already made the payment, please ignore this reminder.',
    '',
    'Work2U'
  ].join('\n');

  return sendResendEmail({
    to: recipient,
    subject,
    html,
    text,
    replyTo: process.env.RESEND_REPLY_TO || 'enquiry@work2u.io',
    tags: [
      { name: 'source', value: 'payment_reminder' },
      { name: 'invoice', value: String(invoiceNumber) }
    ],
    idempotencyKey: crypto.createHash('sha256').update(`${recipient}|${subject}|${invoiceNumber}`).digest('hex')
  });
}

function outboundRelayReady() {
  return {
    whatsappRelayReady: !!(process.env.WHATSAPP_BAILEYS_ENDPOINT || process.env.WHATSAPP_RELAY_URL),
    telegramBotReady: !!process.env.TELEGRAM_BOT_TOKEN
  };
}

async function sendWhatsAppOutboundMessage({ to, name, message, workspaceName, source, replyTo } = {}) {
  const relayUrl = process.env.WHATSAPP_BAILEYS_ENDPOINT || process.env.WHATSAPP_RELAY_URL || '';
  if (!relayUrl) {
    return { skipped: true, reason: 'WhatsApp relay endpoint is not configured' };
  }

  const recipient = String(to || '').trim();
  const body = String(message || '').trim();
  if (!recipient || !body) return { skipped: true, reason: 'Missing WhatsApp recipient or message' };

  const headers = { 'Content-Type': 'application/json' };
  const token = process.env.WHATSAPP_BAILEYS_TOKEN || '';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(relayUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      channel: 'whatsapp',
      to: recipient,
      name: String(name || '').trim(),
      message: body,
      workspaceName: String(workspaceName || 'Work2U').trim() || 'Work2U',
      source: String(source || 'work2u').trim() || 'work2u',
      replyTo: String(replyTo || '').trim()
    })
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `WhatsApp relay responded with ${response.status}`);
  }

  return { ok: true, provider: 'whatsapp', raw: data };
}

async function sendTelegramOutboundMessage({ chatId, username, name, message, workspaceName, source } = {}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  if (!botToken) {
    return { skipped: true, reason: 'Telegram bot token is not configured' };
  }

  const targetValue = String(chatId || username || '').trim();
  const recipientChatId = String(chatId || '').trim();
  const recipientUsername = String(username || '').trim().replace(/^@/, '');
  const body = String(message || '').trim();
  if (!body) return { skipped: true, reason: 'Missing Telegram message' };

  let resolvedChatId = recipientChatId;
  let resolvedUsername = recipientUsername;

  if (!resolvedChatId && targetValue && /^-?\d+$/.test(targetValue)) {
    resolvedChatId = targetValue;
  }

  if (!resolvedUsername && targetValue && !/^-?\d+$/.test(targetValue)) {
    resolvedUsername = targetValue.replace(/^@/, '');
  }

  if (!resolvedChatId && resolvedUsername) {
    const mapping = await resolveChannelContactMapping({
      channel: 'telegram',
      username: resolvedUsername
    }).catch(() => null);

    if (mapping?.chat_id) {
      resolvedChatId = String(mapping.chat_id).trim();
    }
  }

  if (!resolvedChatId) {
    return {
      skipped: true,
      reason: resolvedUsername
        ? `Telegram needs a chat_id for @${resolvedUsername}. Ask the client to start the bot first so we can map the conversation.`
        : 'Telegram needs a chat_id. Ask the client to start the bot first so we can map the conversation.'
    };
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: resolvedChatId,
      text: body,
      disable_web_page_preview: true
    })
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.description || data?.error || `Telegram sendMessage failed with status ${response.status}`);
  }

  return {
    ok: true,
    provider: 'telegram',
    raw: data,
    username: resolvedUsername || null,
    chatId: resolvedChatId,
    workspaceName: String(workspaceName || 'Work2U').trim() || 'Work2U',
    name: String(name || '').trim() || null,
    source: String(source || 'work2u').trim() || 'work2u'
  };
}

async function sendChannelOutboundMessage(channel, payload = {}) {
  const normalizedChannel = String(channel || '').toLowerCase();
  const message = String(payload.message || '').trim();
  if (normalizedChannel === 'whatsapp') {
    return sendWhatsAppOutboundMessage({
      to: payload.to || payload.phone || payload.whatsapp || payload.target,
      name: payload.name,
      message,
      workspaceName: payload.workspaceName,
      source: payload.source,
      replyTo: payload.replyTo
    });
  }

  if (normalizedChannel === 'telegram') {
    const target = String(payload.chatId || payload.telegramChatId || payload.target || '').trim();
    const username = String(payload.username || payload.telegramUsername || '').trim();
    return sendTelegramOutboundMessage({
      chatId: /^-?\d+$/.test(target) ? target : (payload.chatId || payload.telegramChatId || ''),
      username: username || (!/^-?\d+$/.test(target) ? target : ''),
      name: payload.name,
      message,
      workspaceName: payload.workspaceName,
      source: payload.source
    });
  }

  return { skipped: true, reason: `Unsupported channel ${normalizedChannel || 'unknown'}` };
}

function channelActivityStorePath() {
  return path.join(runtimeDataDir(), 'work2u-channel-activity.json');
}

function channelContactStorePath() {
  return path.join(runtimeDataDir(), 'work2u-channel-contacts.json');
}

function defaultChannelActivityStore() {
  return { events: [] };
}

function defaultChannelContactStore() {
  return { contacts: [] };
}

function normalizeChannelDirection(value, fallback = 'inbound') {
  const next = String(value || fallback || '').toLowerCase();
  return ['inbound', 'outbound'].includes(next) ? next : fallback;
}

function normalizeContactText(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizePhoneText(value) {
  return String(value || '').replace(/[^\d]/g, '');
}

function normalizeTelegramUsername(value) {
  return normalizeContactText(String(value || '').replace(/^@/, ''));
}

function contactValueMatches(entryValue, queryValue) {
  const nextEntry = String(entryValue || '').trim();
  const nextQuery = String(queryValue || '').trim();
  if (!nextEntry || !nextQuery) return false;
  if (normalizeContactText(nextEntry) === normalizeContactText(nextQuery)) return true;
  if (normalizePhoneText(nextEntry) && normalizePhoneText(nextEntry) === normalizePhoneText(nextQuery)) return true;
  if (normalizeTelegramUsername(nextEntry) && normalizeTelegramUsername(nextEntry) === normalizeTelegramUsername(nextQuery)) return true;
  return false;
}

function normalizeChannelActivity(entry = {}) {
  const now = entry.created_at || entry.createdAt || nowIso();
  return {
    id: String(entry.id || `channel-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`),
    direction: normalizeChannelDirection(entry.direction),
    channel: String(entry.channel || 'whatsapp').toLowerCase(),
    contact: String(entry.contact || entry.to || entry.from || entry.target || '').trim(),
    chat_id: String(entry.chat_id || entry.chatId || '').trim(),
    username: String(entry.username || entry.telegramUsername || '').trim().replace(/^@/, ''),
    phone: String(entry.phone || entry.whatsapp || '').trim(),
    name: String(entry.name || entry.contact_name || entry.contactName || '').trim(),
    message: String(entry.message || entry.text || entry.body || '').trim(),
    status: String(entry.status || 'received').trim(),
    event_type: String(entry.event_type || entry.eventType || entry.direction || 'message').trim(),
    thread_id: String(entry.thread_id || entry.threadId || '').trim(),
    created_at: now,
    updated_at: entry.updated_at || entry.updatedAt || now,
    payload: entry.payload && typeof entry.payload === 'object' ? entry.payload : {},
    metadata: entry.metadata && typeof entry.metadata === 'object' ? entry.metadata : {}
  };
}

async function ensureChannelActivityStoreDir() {
  await fsp.mkdir(path.dirname(channelActivityStorePath()), { recursive: true });
}

async function readChannelActivityStore() {
  try {
    const raw = await fsp.readFile(channelActivityStorePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...defaultChannelActivityStore(),
      ...parsed,
      events: Array.isArray(parsed?.events) ? parsed.events.map((item) => normalizeChannelActivity(item)) : []
    };
  } catch {
    return defaultChannelActivityStore();
  }
}

async function writeChannelActivityStore(store) {
  await ensureChannelActivityStoreDir();
  const nextStore = {
    ...defaultChannelActivityStore(),
    ...store,
    events: Array.isArray(store?.events) ? store.events.map((item) => normalizeChannelActivity(item)).slice(0, 500) : []
  };
  await fsp.writeFile(channelActivityStorePath(), `${JSON.stringify(nextStore, null, 2)}\n`, 'utf8');
}

function normalizeChannelContact(entry = {}) {
  const now = entry.created_at || entry.createdAt || nowIso();
  return {
    id: String(entry.id || `contact-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`),
    channel: String(entry.channel || 'whatsapp').toLowerCase(),
    contact: String(entry.contact || entry.target || entry.to || entry.phone || entry.username || entry.chat_id || '').trim(),
    chat_id: String(entry.chat_id || entry.chatId || '').trim(),
    username: String(entry.username || entry.telegramUsername || '').trim().replace(/^@/, ''),
    phone: String(entry.phone || entry.whatsapp || '').trim(),
    name: String(entry.name || entry.contactName || '').trim(),
    thread_id: String(entry.thread_id || entry.threadId || '').trim(),
    created_at: now,
    updated_at: entry.updated_at || entry.updatedAt || now,
    last_seen_at: entry.last_seen_at || entry.lastSeenAt || now,
    payload: entry.payload && typeof entry.payload === 'object' ? entry.payload : {},
    metadata: entry.metadata && typeof entry.metadata === 'object' ? entry.metadata : {}
  };
}

function contactEntryMatches(entry = {}, query = {}) {
  if (query.channel && String(entry.channel || '').toLowerCase() !== String(query.channel).toLowerCase()) {
    return false;
  }
  const values = [query.contact, query.chatId, query.chat_id, query.username, query.phone, query.name, query.target].filter(Boolean);
  if (!values.length) return true;
  return values.some((value) =>
    contactValueMatches(entry.contact, value)
    || contactValueMatches(entry.chat_id, value)
    || contactValueMatches(entry.username, value)
    || contactValueMatches(entry.phone, value)
    || contactValueMatches(entry.name, value)
  );
}

async function ensureChannelContactStoreDir() {
  await fsp.mkdir(path.dirname(channelContactStorePath()), { recursive: true });
}

async function readChannelContactStore() {
  try {
    const raw = await fsp.readFile(channelContactStorePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...defaultChannelContactStore(),
      ...parsed,
      contacts: Array.isArray(parsed?.contacts) ? parsed.contacts.map((item) => normalizeChannelContact(item)) : []
    };
  } catch {
    return defaultChannelContactStore();
  }
}

async function writeChannelContactStore(store) {
  await ensureChannelContactStoreDir();
  const nextStore = {
    ...defaultChannelContactStore(),
    ...store,
    contacts: Array.isArray(store?.contacts) ? store.contacts.map((item) => normalizeChannelContact(item)).slice(0, 1000) : []
  };
  await fsp.writeFile(channelContactStorePath(), `${JSON.stringify(nextStore, null, 2)}\n`, 'utf8');
}

async function appendChannelContactMapping(entry = {}) {
  const store = await readChannelContactStore();
  const nextContact = normalizeChannelContact(entry);
  const index = store.contacts.findIndex((item) => contactEntryMatches(item, {
    channel: nextContact.channel,
    contact: nextContact.contact,
    chatId: nextContact.chat_id,
    username: nextContact.username,
    phone: nextContact.phone,
    name: nextContact.name,
    target: nextContact.contact
  }));

  if (index >= 0) {
    store.contacts[index] = {
      ...store.contacts[index],
      ...nextContact,
      id: store.contacts[index].id || nextContact.id,
      created_at: store.contacts[index].created_at || nextContact.created_at
    };
  } else {
    store.contacts.unshift(nextContact);
  }

  await writeChannelContactStore(store);
  try {
    await appendBillingEvent({
      provider: nextContact.channel || 'whatsapp',
      event_type: `channel.contact.${nextContact.channel || 'unknown'}`,
      status: 'mapped',
      owner_id: nextContact.metadata?.owner_id || 'work2u',
      email: nextContact.metadata?.email || '',
      workspace_name: nextContact.metadata?.workspaceName || nextContact.metadata?.workspace_name || '',
      raw_payload: {
        channel: nextContact.channel,
        contact: nextContact.contact,
        chat_id: nextContact.chat_id,
        username: nextContact.username,
        phone: nextContact.phone,
        name: nextContact.name,
        thread_id: nextContact.thread_id,
        payload: nextContact.payload,
        metadata: nextContact.metadata
      }
    });
  } catch (error) {
    console.warn('Channel contact sync failed:', error.message);
  }
  return nextContact;
}

async function readChannelContactMappings() {
  const local = await readChannelContactStore();
  const supabaseSnapshot = await readSupabaseBillingSnapshot().catch(() => null);
  const remoteContacts = Array.isArray(supabaseSnapshot?.events)
    ? supabaseSnapshot.events
        .filter((event) => String(event.event_type || '').startsWith('channel.contact.'))
        .map((event) => normalizeChannelContact({
          id: event.id,
          channel: event.provider || event.raw_payload?.channel || 'whatsapp',
          contact: event.raw_payload?.contact || event.email || '',
          chat_id: event.raw_payload?.chat_id || '',
          username: event.raw_payload?.username || '',
          phone: event.raw_payload?.phone || '',
          name: event.raw_payload?.name || '',
          thread_id: event.raw_payload?.thread_id || '',
          created_at: event.created_at || event.updated_at || nowIso(),
          updated_at: event.updated_at || nowIso(),
          last_seen_at: event.updated_at || nowIso(),
          payload: event.raw_payload?.payload || {},
          metadata: { source: 'supabase' }
        }))
    : [];

  const merged = [...remoteContacts, ...(local.contacts || [])];
  const deduped = [];
  for (const item of merged) {
    const key = [
      String(item.channel || '').toLowerCase(),
      normalizeContactText(item.contact),
      normalizePhoneText(item.chat_id || item.phone || ''),
      normalizeTelegramUsername(item.username)
    ].join('|');
    if (deduped.some((entry) => entry.__key === key)) continue;
    deduped.push({ ...item, __key: key });
  }

  return deduped.map(({ __key, ...item }) => item).slice(0, 100);
}

async function resolveChannelContactMapping(query = {}) {
  const mappings = await readChannelContactMappings();
  return mappings.find((item) => contactEntryMatches(item, query)) || null;
}

async function appendChannelActivity(entry = {}) {
  const store = await readChannelActivityStore();
  const nextEvent = normalizeChannelActivity(entry);
  store.events = [nextEvent, ...(store.events || [])].slice(0, 500);
  await writeChannelActivityStore(store);
  try {
    await appendBillingEvent({
      id: nextEvent.id,
      provider: nextEvent.channel,
      event_type: `channel.${nextEvent.direction}.${nextEvent.event_type}`,
      status: nextEvent.status,
      owner_id: nextEvent.metadata?.owner_id || nextEvent.payload?.owner_id || nextEvent.payload?.workspaceName || nextEvent.metadata?.workspaceName || 'work2u',
      email: nextEvent.payload?.email || '',
      workspace_name: nextEvent.payload?.workspaceName || nextEvent.payload?.workspace_name || nextEvent.metadata?.workspaceName || '',
      raw_payload: {
        channel: nextEvent.channel,
        direction: nextEvent.direction,
        contact: nextEvent.contact,
        chat_id: nextEvent.chat_id,
        username: nextEvent.username,
        phone: nextEvent.phone,
        name: nextEvent.name,
        message: nextEvent.message,
        thread_id: nextEvent.thread_id,
        payload: nextEvent.payload,
        metadata: nextEvent.metadata
      }
    });
  } catch (error) {
    console.warn('Channel activity sync failed:', error.message);
  }
  return nextEvent;
}

async function listChannelActivity({ limit = 25, channel = '', direction = '', contact = '' } = {}) {
  const supabaseSnapshot = await readSupabaseBillingSnapshot().catch(() => null);
  const sourceEvents = Array.isArray(supabaseSnapshot?.events) && supabaseSnapshot.events.length
    ? supabaseSnapshot.events
        .filter((event) => String(event.event_type || '').startsWith('channel.') && !String(event.event_type || '').startsWith('channel.contact.'))
        .map((event) => normalizeChannelActivity({
          id: event.id,
          direction: String(event.event_type || '').includes('.outbound.') ? 'outbound' : 'inbound',
          channel: event.provider || 'whatsapp',
          contact: event.raw_payload?.contact || event.email || '',
          chat_id: event.raw_payload?.chat_id || '',
          username: event.raw_payload?.username || '',
          phone: event.raw_payload?.phone || '',
          name: event.raw_payload?.name || '',
          message: event.raw_payload?.message || '',
          status: event.status || 'received',
          event_type: event.event_type || 'channel.message',
          thread_id: event.raw_payload?.thread_id || '',
          created_at: event.created_at || event.updated_at || nowIso(),
          updated_at: event.updated_at || nowIso(),
          payload: event.raw_payload || {},
          metadata: { source: 'supabase' }
        }))
    : (await readChannelActivityStore()).events || [];
  const filtered = sourceEvents
    .filter((item) => !channel || String(item.channel || '').toLowerCase() === String(channel).toLowerCase())
    .filter((item) => !direction || String(item.direction || '').toLowerCase() === String(direction).toLowerCase())
    .filter((item) => {
      const contactQuery = String(contact || '').trim();
      if (!contactQuery) return true;
      return [
        item.contact,
        item.chat_id,
        item.username,
        item.phone,
        item.name,
        item.thread_id
      ].some((value) => contactValueMatches(value, contactQuery));
    });
  const events = filtered.slice(0, Math.max(1, Math.min(100, Number(limit) || 25)));
  const summary = events.reduce((acc, item) => {
    const key = String(item.direction || 'inbound').toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    const channelKey = String(item.channel || 'unknown').toLowerCase();
    acc.channels[channelKey] = (acc.channels[channelKey] || 0) + 1;
    return acc;
  }, { inbound: 0, outbound: 0, channels: {} });
  return {
    events,
    summary,
    total: sourceEvents.length
  };
}

function webhookSecretCandidates(channel = '') {
  const normalized = String(channel || '').toLowerCase();
  const candidates = [
    process.env.WORK2U_CHANNEL_WEBHOOK_SECRET,
    normalized === 'whatsapp' ? process.env.WHATSAPP_WEBHOOK_SECRET : '',
    normalized === 'telegram' ? process.env.TELEGRAM_WEBHOOK_SECRET : ''
  ].filter(Boolean);
  return Array.from(new Set(candidates));
}

function verifyChannelWebhookSecret(req, body, channel = '') {
  const candidates = webhookSecretCandidates(channel);
  if (!candidates.length) return true;
  const provided = String(body?.secret || req.headers['x-work2u-webhook-secret'] || req.headers['x-webhook-secret'] || '').trim();
  return candidates.includes(provided);
}

async function handleWork2uChannelWebhook(req, res, forcedChannel = '') {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const body = await readBody(req);
  const channel = String(forcedChannel || body?.channel || req.headers['x-work2u-channel'] || 'whatsapp').toLowerCase();
  if (!['whatsapp', 'telegram'].includes(channel)) {
    return send(res, 400, { error: 'channel must be whatsapp or telegram' });
  }

  if (!verifyChannelWebhookSecret(req, body, channel)) {
    return send(res, 401, { error: 'Invalid webhook secret' });
  }

  const eventType = String(body?.event || body?.type || body?.message_type || 'message').trim();
  const telegramMessage = channel === 'telegram'
    ? (body?.message && typeof body.message === 'object'
      ? body.message
      : (body?.update?.message && typeof body.update.message === 'object' ? body.update.message : null))
    : null;
  const whatsappMessage = channel === 'whatsapp'
    ? (body?.message && typeof body.message === 'object'
      ? body.message
      : (body?.data?.message && typeof body.data.message === 'object' ? body.data.message : null))
    : null;
  const chatId = String(
    body?.chatId
    || body?.chat_id
    || body?.data?.key?.remoteJid
    || body?.data?.remoteJid
    || telegramMessage?.chat?.id
    || whatsappMessage?.key?.remoteJid
    || ''
  ).trim();
  const username = String(
    body?.username
    || body?.telegramUsername
    || telegramMessage?.from?.username
    || telegramMessage?.chat?.username
    || ''
  ).trim().replace(/^@/, '');
  const phone = String(
    body?.phone
    || body?.waId
    || body?.wa_id
    || body?.from
    || body?.contact
    || whatsappMessage?.from
    || ''
  ).trim();
  const contact = String(
    body?.from
    || body?.contact
    || phone
    || username
    || chatId
    || telegramMessage?.chat?.title
    || telegramMessage?.chat?.first_name
    || body?.target
    || ''
  ).trim();
  const name = String(
    body?.name
    || body?.contactName
    || body?.chat_name
    || telegramMessage?.from?.first_name
    || telegramMessage?.from?.last_name
    || telegramMessage?.chat?.title
    || body?.data?.pushName
    || ''
  ).trim();
  const message = String(
    body?.text
    || (typeof body?.message === 'string' ? body.message : '')
    || body?.caption
    || telegramMessage?.text
    || telegramMessage?.caption
    || whatsappMessage?.conversation
    || whatsappMessage?.extendedTextMessage?.text
    || whatsappMessage?.imageMessage?.caption
    || whatsappMessage?.videoMessage?.caption
    || ''
  ).trim();
  const threadId = String(
    body?.threadId
    || body?.thread_id
    || telegramMessage?.message_id
    || body?.data?.key?.id
    || whatsappMessage?.key?.id
    || ''
  ).trim();
  const status = String(body?.status || eventType || 'received').trim();

  const event = await appendChannelActivity({
    direction: 'inbound',
    channel,
    contact,
    chat_id: chatId,
    username,
    phone,
    name,
    message,
    status,
    event_type: eventType,
    thread_id: threadId,
    payload: body || {},
    metadata: {
      source: 'webhook',
      rawChannel: channel,
      workspaceName: String(body?.workspaceName || body?.workspace_name || 'Work2U').trim() || 'Work2U'
    }
  }).catch((error) => ({
    id: `channel-error-${Date.now()}`,
    direction: 'inbound',
    channel,
    contact,
    chat_id: chatId,
    username,
    phone,
    name,
    message,
    status: 'log_failed',
    event_type: eventType,
    thread_id: threadId,
    created_at: nowIso(),
    updated_at: nowIso(),
    payload: { error: error.message || 'Channel activity log failed', body: body || {} },
    metadata: { source: 'webhook', rawChannel: channel, workspaceName: String(body?.workspaceName || body?.workspace_name || 'Work2U').trim() || 'Work2U' }
  }));

  await appendChannelContactMapping({
    channel,
    contact,
    chat_id: chatId,
    username,
    phone,
    name,
    thread_id: threadId,
    payload: body || {},
    metadata: {
      source: 'webhook',
      rawChannel: channel,
      workspaceName: String(body?.workspaceName || body?.workspace_name || 'Work2U').trim() || 'Work2U'
    }
  }).catch((error) => {
    console.warn('Channel contact mapping failed:', error.message);
  });

  return send(res, 200, {
    received: true,
    channel,
    event,
    message: 'Webhook event captured'
  });
}

function outboundQueueStorePath() {
  return path.join(runtimeDataDir(), 'work2u-outbound-jobs.json');
}

function defaultOutboundQueueStore() {
  return { jobs: [], events: [] };
}

function normalizeOutboundStatus(value, fallback = 'queued') {
  const next = String(value || fallback || '').toLowerCase();
  return ['queued', 'processing', 'sent', 'failed', 'skipped'].includes(next) ? next : fallback;
}

function normalizeOutboundJob(job = {}) {
  const now = job.created_at || job.createdAt || nowIso();
  const updatedAt = job.updated_at || job.updatedAt || now;
  const status = normalizeOutboundStatus(job.status);
  const history = Array.isArray(job.history) ? job.history : [];

  return {
    id: String(job.id || `outbound-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`),
    kind: String(job.kind || job.type || 'generic'),
    channel: String(job.channel || 'email').toLowerCase(),
    target: String(job.target || job.email || ''),
    subject: String(job.subject || ''),
    status,
    attempts: Math.max(0, Number(job.attempts || 0)),
    scheduled_at: job.scheduled_at || job.scheduledAt || null,
    created_at: now,
    updated_at: updatedAt,
    processed_at: job.processed_at || job.processedAt || null,
    error: String(job.error || ''),
    result: job.result ?? null,
    note: String(job.note || ''),
    idempotency_key: String(job.idempotency_key || job.idempotencyKey || ''),
    payload: job.payload && typeof job.payload === 'object' ? job.payload : {},
    metadata: job.metadata && typeof job.metadata === 'object' ? job.metadata : {},
    history: history.map((entry) => ({
      status: normalizeOutboundStatus(entry.status, status),
      at: entry.at || nowIso(),
      note: String(entry.note || ''),
      details: entry.details && typeof entry.details === 'object' ? entry.details : {}
    }))
  };
}

async function ensureOutboundQueueStoreDir() {
  await fsp.mkdir(path.dirname(outboundQueueStorePath()), { recursive: true });
}

async function readOutboundQueueStore() {
  try {
    const raw = await fsp.readFile(outboundQueueStorePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...defaultOutboundQueueStore(),
      ...parsed,
      jobs: Array.isArray(parsed?.jobs) ? parsed.jobs.map((job) => normalizeOutboundJob(job)) : [],
      events: Array.isArray(parsed?.events) ? parsed.events : []
    };
  } catch {
    return defaultOutboundQueueStore();
  }
}

async function writeOutboundQueueStore(store) {
  await ensureOutboundQueueStoreDir();
  const nextStore = {
    ...defaultOutboundQueueStore(),
    ...store,
    jobs: Array.isArray(store?.jobs) ? store.jobs.map((job) => normalizeOutboundJob(job)) : [],
    events: Array.isArray(store?.events) ? store.events.slice(0, 200) : []
  };
  await fsp.writeFile(outboundQueueStorePath(), `${JSON.stringify(nextStore, null, 2)}\n`, 'utf8');
}

function outboundQueueJobTitle(job) {
  const kind = String(job?.kind || 'generic').toLowerCase();
  return {
    magic_link_email: 'Magic link email',
    invoice_sent_email: 'Invoice sent email',
    payment_reminder_email: 'Payment reminder email',
    billing_checkout_email: 'Billing checkout email',
    generic: 'Outbound job'
  }[kind] || kind.replace(/_/g, ' ');
}

async function appendOutboundQueueEvent(jobId, eventType, message, details = {}) {
  const store = await readOutboundQueueStore();
  store.events = [
    {
      id: `evt-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      job_id: jobId || null,
      event_type: String(eventType || 'event'),
      message: String(message || ''),
      created_at: nowIso(),
      details: details && typeof details === 'object' ? details : {}
    },
    ...(store.events || [])
  ].slice(0, 200);
  await writeOutboundQueueStore(store);
}

async function enqueueOutboundJob(job = {}) {
  const store = await readOutboundQueueStore();
  const nextJob = normalizeOutboundJob(job);
  if (nextJob.idempotency_key) {
    const existing = store.jobs.find((item) => item.idempotency_key === nextJob.idempotency_key && !['failed'].includes(item.status));
    if (existing) return existing;
  }

  nextJob.status = normalizeOutboundStatus(nextJob.status);
  nextJob.history = [
    ...nextJob.history,
    { status: nextJob.status, at: nowIso(), note: nextJob.note || 'Queued', details: { channel: nextJob.channel, target: nextJob.target } }
  ];
  store.jobs = [nextJob, ...(store.jobs || [])].slice(0, 500);
  await writeOutboundQueueStore(store);
  await appendOutboundQueueEvent(nextJob.id, 'queued', `Queued ${outboundQueueJobTitle(nextJob)}`, {
    channel: nextJob.channel,
    target: nextJob.target,
    kind: nextJob.kind
  });
  return nextJob;
}

async function updateOutboundJob(jobId, patch = {}) {
  const store = await readOutboundQueueStore();
  const index = store.jobs.findIndex((job) => job.id === jobId);
  if (index === -1) return null;
  const current = store.jobs[index];
  const next = normalizeOutboundJob({
    ...current,
    ...patch,
    id: current.id,
    created_at: current.created_at,
    history: Array.isArray(patch.history) ? patch.history : current.history
  });
  store.jobs[index] = next;
  await writeOutboundQueueStore(store);
  return next;
}

async function processOutboundJob(jobId) {
  const store = await readOutboundQueueStore();
  const current = store.jobs.find((job) => job.id === jobId);
  if (!current) throw new Error('Outbound job not found');
  if (current.status === 'sent' || current.status === 'skipped') return current;

  await updateOutboundJob(jobId, {
    status: 'processing',
    attempts: Number(current.attempts || 0) + 1,
    updated_at: nowIso(),
    history: [
      ...(Array.isArray(current.history) ? current.history : []),
      { status: 'processing', at: nowIso(), note: 'Processing job', details: {} }
    ]
  });

  try {
    const result = await runOutboundJobHandler(current);
    const finalStatus = result?.skipped ? 'skipped' : 'sent';
    const next = await updateOutboundJob(jobId, {
      status: finalStatus,
      processed_at: nowIso(),
      updated_at: nowIso(),
      error: '',
      result,
      history: [
        ...(Array.isArray(current.history) ? current.history : []),
        { status: finalStatus, at: nowIso(), note: result?.skipped ? String(result.reason || 'Skipped') : 'Sent successfully', details: result && typeof result === 'object' ? result : {} }
      ]
    });
    await appendOutboundQueueEvent(jobId, finalStatus, `${outboundQueueJobTitle(current)} ${finalStatus}`, {
      kind: current.kind,
      channel: current.channel,
      target: current.target
    });
    return next;
  } catch (error) {
    const message = error?.message || 'Outbound job failed';
    const next = await updateOutboundJob(jobId, {
      status: 'failed',
      processed_at: nowIso(),
      updated_at: nowIso(),
      error: message,
      history: [
        ...(Array.isArray(current.history) ? current.history : []),
        { status: 'failed', at: nowIso(), note: message, details: {} }
      ]
    });
    await appendOutboundQueueEvent(jobId, 'failed', `${outboundQueueJobTitle(current)} failed`, {
      kind: current.kind,
      channel: current.channel,
      target: current.target,
      error: message
    });
    throw error;
  }
}

async function runOutboundJobHandler(job) {
  const payload = job.payload || {};
  switch (String(job.kind || '').toLowerCase()) {
    case 'magic_link_email': {
      const email = String(payload.email || job.target || '').trim();
      const name = String(payload.name || payload.workspaceName || 'there').trim() || 'there';
      const workspaceName = String(payload.workspaceName || 'Work2U').trim() || 'Work2U';
      const redirectTo = String(payload.redirectTo || process.env.SUPABASE_REDIRECT_TO || `${appBaseUrl()}/work2u`).trim();
      const shouldCreateUser = payload.shouldCreateUser !== false;
      const expiresInMinutes = Number(payload.expiresInMinutes || 60);
      const { link } = await generateSupabaseMagicLink({ email, redirectTo, shouldCreateUser });
      const result = await notifyMagicLinkEmail({
        email,
        name,
        loginLink: link,
        workspaceName,
        expiresInMinutes
      });
      return { ...result, link };
    }
    case 'whatsapp_message':
    case 'telegram_message':
    case 'channel_message':
      return sendChannelOutboundMessage(job.channel || payload.channel || job.kind.replace('_message', ''), {
        ...payload,
        target: job.target
      });
    case 'invoice_sent_email':
      return notifyInvoiceSentEmail({
        email: payload.email,
        name: payload.name,
        invoiceNumber: payload.invoiceNumber,
        amount: payload.amount,
        dueDate: payload.dueDate,
        documentUrl: payload.documentUrl,
        workspaceName: payload.workspaceName,
        currency: payload.currency || 'MYR'
      });
    case 'payment_reminder_email':
      return notifyPaymentReminderEmail({
        email: payload.email,
        name: payload.name,
        invoiceNumber: payload.invoiceNumber,
        amount: payload.amount,
        dueDate: payload.dueDate,
        paymentUrl: payload.paymentUrl,
        workspaceName: payload.workspaceName,
        currency: payload.currency || 'MYR'
      });
    case 'billing_checkout_email':
      return notifyBillingCheckoutEmail({
        email: payload.email,
        name: payload.name,
        workspaceName: payload.workspaceName,
        plan: payload.plan,
        provider: payload.provider,
        paymentUrl: payload.paymentUrl,
        region: payload.region
      });
    default:
      return { skipped: true, reason: 'Unsupported outbound job kind' };
  }
}

async function listOutboundJobs({ limit = 25, status = '' } = {}) {
  const store = await readOutboundQueueStore();
  const filtered = status ? store.jobs.filter((job) => String(job.status || '').toLowerCase() === String(status).toLowerCase()) : store.jobs;
  const jobs = filtered.slice(0, Math.max(1, Math.min(100, Number(limit) || 25)));
  const summary = jobs.reduce((acc, job) => {
    const key = String(job.status || 'queued').toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, { queued: 0, processing: 0, sent: 0, failed: 0, skipped: 0 });
  return {
    jobs,
    events: (store.events || []).slice(0, 50),
    summary,
    total: store.jobs.length
  };
}

async function processOutboundQueue({ limit = 10 } = {}) {
  const store = await readOutboundQueueStore();
  const queue = store.jobs
    .filter((job) => job.status === 'queued')
    .filter((job) => !job.scheduled_at || new Date(job.scheduled_at).getTime() <= Date.now())
    .slice(0, Math.max(1, Math.min(20, Number(limit) || 10)));

  const processed = [];
  for (const job of queue) {
    // Finish each job before moving to the next so retry/history stays readable.
    // eslint-disable-next-line no-await-in-loop
    processed.push(await processOutboundJob(job.id));
  }

  return {
    processed: processed.length,
    jobs: processed
  };
}

function work2uObjectCatalog() {
  return [
    {
      key: 'lead',
      title: 'Lead',
      role: 'Prospect',
      purpose: 'Capture interest before conversion.',
      relations: ['task', 'client', 'outbound job'],
      fields: ['name', 'company', 'stage', 'source', 'next follow-up', 'note']
    },
    {
      key: 'client',
      title: 'Client',
      role: 'Account',
      purpose: 'Store converted accounts and their service history.',
      relations: ['task', 'invoice', 'receipt', 'case', 'thread'],
      fields: ['name', 'company', 'email', 'phone', 'telegram username', 'status', 'service', 'timeline']
    },
    {
      key: 'task',
      title: 'Task',
      role: 'Work item',
      purpose: 'Track stage, progress, owner, and due date.',
      relations: ['lead', 'client', 'calendar', 'case'],
      fields: ['title', 'stage', 'progress', 'due', 'owner']
    },
    {
      key: 'case',
      title: 'Case',
      role: 'Support / exception',
      purpose: 'Handle service issues and exceptions with a clear owner.',
      relations: ['client', 'task', 'thread'],
      fields: ['title', 'type', 'status', 'client', 'summary']
    },
    {
      key: 'service',
      title: 'Service',
      role: 'Offer',
      purpose: 'Define what can later flow into billing.',
      relations: ['client', 'invoice'],
      fields: ['name', 'description', 'price', 'active']
    },
    {
      key: 'outbound-job',
      title: 'Outbound job',
      role: 'Queued action',
      purpose: 'Track every send attempt with retry and event history.',
      relations: ['email', 'WhatsApp', 'Telegram', 'invoice', 'magic link'],
      fields: ['kind', 'channel', 'target', 'status', 'attempts']
    }
  ];
}

async function handleWork2uMagicLinkEmail(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const body = await readBody(req);
  const email = String(body?.email || body?.emailAddress || '').trim();
  const name = String(body?.name || body?.workspaceName || 'there').trim() || 'there';
  const workspaceName = String(body?.workspaceName || 'Work2U').trim() || 'Work2U';
  const redirectTo = String(body?.redirectTo || process.env.SUPABASE_REDIRECT_TO || `${appBaseUrl()}/work2u`).trim();
  const shouldCreateUser = body?.shouldCreateUser !== false;

  try {
    const job = await enqueueOutboundJob({
      kind: 'magic_link_email',
      channel: 'email',
      target: email,
      subject: 'Your Work2U sign-in link',
      payload: {
        email,
        name,
        workspaceName,
        redirectTo,
        shouldCreateUser,
        expiresInMinutes: Number(body?.expiresInMinutes || 60)
      },
      metadata: {
        source: 'auth'
      },
      idempotencyKey: crypto.createHash('sha256').update(`${email}|${workspaceName}|${redirectTo}|magic_link`).digest('hex')
    });
    const result = await processOutboundJob(job.id);
    return send(res, 200, { sent: true, email, workspaceName, redirectTo, job: result });
  } catch (error) {
    return send(res, 500, { error: error.message || 'Failed to send magic link' });
  }
}

async function handleWork2uInvoiceSentEmail(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const body = await readBody(req);
  try {
    const job = await enqueueOutboundJob({
      kind: 'invoice_sent_email',
      channel: 'email',
      target: body?.email,
      subject: `Invoice ${body?.invoiceNumber || ''} from ${body?.workspaceName || 'Work2U'}`,
      payload: {
        email: body?.email,
        name: body?.name,
        invoiceNumber: body?.invoiceNumber,
        amount: body?.amount,
        dueDate: body?.dueDate,
        documentUrl: body?.documentUrl,
        workspaceName: body?.workspaceName,
        currency: body?.currency || 'MYR'
      },
      metadata: {
        source: 'billing'
      },
      idempotencyKey: crypto.createHash('sha256').update(`${body?.email}|${body?.invoiceNumber}|invoice_sent`).digest('hex')
    });
    const result = await processOutboundJob(job.id);
    return send(res, 200, { sent: true, result });
  } catch (error) {
    return send(res, 500, { error: error.message || 'Failed to send invoice email' });
  }
}

async function handleWork2uPaymentReminderEmail(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const body = await readBody(req);
  try {
    const job = await enqueueOutboundJob({
      kind: 'payment_reminder_email',
      channel: 'email',
      target: body?.email,
      subject: `Payment reminder for invoice ${body?.invoiceNumber || ''}`,
      payload: {
        email: body?.email,
        name: body?.name,
        invoiceNumber: body?.invoiceNumber,
        amount: body?.amount,
        dueDate: body?.dueDate,
        paymentUrl: body?.paymentUrl,
        workspaceName: body?.workspaceName,
        currency: body?.currency || 'MYR'
      },
      metadata: {
        source: 'billing'
      },
      idempotencyKey: crypto.createHash('sha256').update(`${body?.email}|${body?.invoiceNumber}|payment_reminder`).digest('hex')
    });
    const result = await processOutboundJob(job.id);
    return send(res, 200, { sent: true, result });
  } catch (error) {
    return send(res, 500, { error: error.message || 'Failed to send reminder email' });
  }
}

function surveyStorePath() {
  return path.join(runtimeDataDir(), 'work2u-surveys.json');
}

function defaultSurveyStore() {
  return { surveys: [] };
}

async function ensureSurveyStoreDir() {
  await fsp.mkdir(path.dirname(surveyStorePath()), { recursive: true });
}

async function readSurveyStore() {
  try {
    const raw = await fsp.readFile(surveyStorePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...defaultSurveyStore(),
      ...parsed,
      surveys: Array.isArray(parsed?.surveys) ? parsed.surveys : []
    };
  } catch {
    return defaultSurveyStore();
  }
}

async function writeSurveyStore(store) {
  await ensureSurveyStoreDir();
  await fsp.writeFile(surveyStorePath(), `${JSON.stringify(store, null, 2)}\n`, 'utf8');
}

function normalizeSurveyChannels(primaryChannel, secondaryChannels = []) {
  const list = [primaryChannel, ...(Array.isArray(secondaryChannels) ? secondaryChannels : [secondaryChannels])]
    .map((item) => String(item || '').trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set(list));
}

function parseSurveyTeamSize(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return 1;
  if (raw.includes('solo')) return 1;
  if (raw.includes('2-5') || raw.includes('2 to 5')) return 3;
  if (raw.includes('6+') || raw.includes('6 to 10')) return 6;
  const parsed = Number(raw);
  if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
  return 1;
}

function normalizeSurveyText(value, fallback = '') {
  const raw = String(value || '').trim();
  return raw || fallback;
}

function buildSurveyPackageProfile({ planCode = 'Starter', role = '', teamSize = 1, channels = [], aiMode = '', reminderMode = '', workflowComplexity = '', permissionNeeds = '', slaNeeds = '', region = 'Malaysia' } = {}) {
  const plan = normalizeBillingPlan(planCode).code;
  const planInfo = normalizeBillingPlan(plan);
  const channelList = Array.isArray(channels) ? channels.filter(Boolean) : [];
  const channelText = channelList.length ? channelList.join(', ') : 'one main channel';
  const roleText = normalizeSurveyText(role, 'solo operators');
  const teamText = teamSize > 1 ? `${teamSize} people` : 'a single user';
  const hasCustomControls = permissionNeeds === 'yes' || slaNeeds === 'yes' || workflowComplexity === 'high' || workflowComplexity === 'custom';

  if (plan === 'Enterprise') {
    return {
      tagline: 'Built for custom rollout, governance, and structured team control.',
      fitSummary: `Best for ${teamText} in ${region} that need custom permissions, SLA handling, and more controlled automation across ${channelText}.`,
      idealFor: ['6+ users', 'custom permissions', 'SLA support', 'enterprise rollout'],
      included: ['Dedicated onboarding', 'Role-based access', 'Automation guardrails', 'Advanced reporting'],
      nextStep: 'Use this when your process needs approvals, tighter governance, or a more tailored rollout.',
      priceHint: 'Custom pricing',
      billingLabel: planInfo.name
    };
  }

  if (plan === 'Elite') {
    return {
      tagline: 'Best-value plan for growing teams that need faster follow-up.',
      fitSummary: `Best for ${roleText} teams with ${teamText} who manage ${channelText} and want stronger AI assist, reminders, and shared workflows without Enterprise overhead.`,
      idealFor: ['2-5 users', 'multi-channel follow-up', 'AI suggestions', 'shared task flow'],
      included: ['Lead follow-up automation', 'Shared task pipeline', 'Calendar sync', 'Reporting insights'],
      nextStep: hasCustomControls ? 'Upgrade to Enterprise later if permissions or SLA needs become more complex.' : 'Great fit if you want more automation without custom rollout.',
      priceHint: `From RM${Math.round(planInfo.amountCents / 100).toLocaleString()}/month`,
      billingLabel: planInfo.name
    };
  }

  return {
    tagline: 'Lightweight setup for solo users who want to move faster.',
    fitSummary: `Best for ${roleText} workflows that stay simple, mostly use ${channelText}, and only need draft-level AI with manual or light reminders.`,
    idealFor: ['1 user', 'simple follow-up', 'manual reminders', 'low-friction setup'],
    included: ['Core CRM modules', 'Receipt keeping', 'Task stages', 'Basic reminders'],
    nextStep: 'Start here if you want a low-cost entry point and can upgrade once the workflow grows.',
    priceHint: `From RM${Math.round(planInfo.amountCents / 100).toLocaleString()}/month`,
    billingLabel: planInfo.name
  };
}

function surveyConfidenceFromInputs(survey, score, planCode) {
  const values = [
    survey.role,
    survey.industry,
    survey.teamSize,
    survey.mainChannel,
    survey.secondaryChannels,
    survey.aiMode,
    survey.reminderMode,
    survey.workflowComplexity,
    survey.permissionNeeds,
    survey.slaNeeds,
    survey.region,
    survey.language
  ];
  const answered = values.filter((value) => {
    if (Array.isArray(value)) return value.some((entry) => String(entry || '').trim().length > 0);
    return String(value || '').trim().length > 0;
  }).length;
  const base = planCode === 'Enterprise' ? 78 : planCode === 'Elite' ? 72 : 68;
  return Math.max(55, Math.min(96, Math.round(base + score * 1.4 + answered * 1.5)));
}

function resolveSurveyRecommendation(survey = {}) {
  const role = normalizeSurveyText(survey.role, 'Freelancer');
  const industry = normalizeSurveyText(survey.industry, 'General Business');
  const teamSize = parseSurveyTeamSize(survey.teamSize || survey.team_size || '1');
  const mainChannel = normalizeSurveyText(survey.mainChannel || survey.main_channel, 'whatsapp');
  const secondaryChannels = Array.isArray(survey.secondaryChannels || survey.secondary_channels)
    ? survey.secondaryChannels || survey.secondary_channels
    : String(survey.secondaryChannels || survey.secondary_channels || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
  const channels = normalizeSurveyChannels(mainChannel, secondaryChannels);
  const aiMode = normalizeSurveyText(survey.aiMode || survey.ai_mode, 'draft').toLowerCase();
  const reminderMode = normalizeSurveyText(survey.reminderMode || survey.reminder_mode, 'manual').toLowerCase();
  const workflowComplexity = normalizeSurveyText(survey.workflowComplexity || survey.workflow_complexity, 'standard').toLowerCase();
  const permissionNeeds = normalizeSurveyText(survey.permissionNeeds || survey.permission_needs, 'no').toLowerCase();
  const slaNeeds = normalizeSurveyText(survey.slaNeeds || survey.sla_needs, 'no').toLowerCase();
  const region = normalizeSurveyText(survey.region, 'Malaysia');
  const language = normalizeSurveyText(survey.language, 'BM + English');

  let score = 0;
  const reasons = [];

  if (teamSize >= 6) {
    score += 3;
    reasons.push('team size suggests enterprise-grade coordination');
  } else if (teamSize >= 2) {
    score += 2;
    reasons.push('team collaboration needs are above solo usage');
  } else {
    reasons.push('solo usage keeps the setup lightweight');
  }

  if (channels.length >= 4) {
    score += 2;
    reasons.push('multiple channels need broader automation');
  } else if (channels.length >= 2) {
    score += 2;
    reasons.push('multi-channel follow-up needs stronger orchestration');
  } else if (channels.length === 1) {
    score += 1;
    reasons.push(`focused on ${channels[0]} as the main workflow channel`);
  }

  if (['semi-auto', 'auto-send', 'workflow assist', 'routing', 'summary', 'assist'].some((keyword) => aiMode.includes(keyword))) {
    score += 2;
    reasons.push('AI assist is expected to do more than simple drafting');
  } else if (aiMode.includes('draft')) {
    score += 1;
    reasons.push('AI draft-only mode fits a lower-cost plan');
  }

  if (['semi-auto', 'auto', 'auto-send', 'reminder', 'follow-up'].some((keyword) => reminderMode.includes(keyword))) {
    score += 1;
    reasons.push('reminders and follow-up automation matter');
  }

  if (['high', 'complex', 'custom', 'approval'].some((keyword) => workflowComplexity.includes(keyword))) {
    score += 3;
    reasons.push('workflow complexity points to custom controls');
  } else if (['medium', 'moderate'].some((keyword) => workflowComplexity.includes(keyword))) {
    score += 1;
    reasons.push('workflow needs are above the simplest tier');
  }

  if (['yes', 'true', 'required', 'need'].some((keyword) => permissionNeeds.includes(keyword))) {
    score += 3;
    reasons.push('custom permissions are requested');
  }

  if (['yes', 'true', 'required', 'need'].some((keyword) => slaNeeds.includes(keyword))) {
    score += 3;
    reasons.push('SLA support is requested');
  }

  if (['corporate', 'enterprise', 'agency', 'team'].some((keyword) => `${role} ${industry}`.toLowerCase().includes(keyword))) {
    score += 1;
    reasons.push('role and industry lean toward a higher-touch plan');
  }

  if (['property', 'insurance', 'agency', 'sales', 'service'].some((keyword) => `${role} ${industry} ${normalizeSurveyText(survey.goal, '')}`.toLowerCase().includes(keyword))) {
    score += 1;
    reasons.push('prospect follow-up volume suggests a more structured workflow');
  }

  let planCode = 'Starter';
  if (score >= 9) planCode = 'Enterprise';
  else if (score >= 5) planCode = 'Elite';

  if (permissionNeeds === 'yes' || slaNeeds === 'yes' || workflowComplexity === 'high' || workflowComplexity === 'custom') {
    planCode = 'Enterprise';
  }

  const confidence = surveyConfidenceFromInputs(
    {
      role,
      industry,
      teamSize,
      mainChannel,
      secondaryChannels,
      aiMode,
      reminderMode,
      workflowComplexity,
      permissionNeeds,
      slaNeeds,
      region,
      language
    },
    score,
    planCode
  );
  const packageProfile = buildSurveyPackageProfile({
    planCode,
    role,
    teamSize,
    channels,
    aiMode,
    reminderMode,
    workflowComplexity,
    permissionNeeds,
    slaNeeds,
    region
  });

  return {
    planCode,
    score,
    confidence,
    reasons,
    channels,
    mainChannel: channels[0] || mainChannel || 'whatsapp',
    region,
    language,
    packageProfile
  };
}

async function updateSupabaseProfileFromSurvey({ ownerId = '', email = '', workspaceName = '', survey = {}, recommendation = {} } = {}) {
  const base = supabaseRestBase();
  const headers = supabaseAdminHeaders();
  if (!base || !headers) return null;

  const profile = await findSupabaseProfileByLookup({ ownerId, email, workspaceName });
  if (!profile?.id) return null;

  const channels = normalizeSurveyChannels(survey.mainChannel || survey.main_channel, survey.secondaryChannels || survey.secondary_channels);
  const response = await fetch(`${base}/rest/v1/profiles?id=eq.${encodeURIComponent(profile.id)}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      package: normalizeBillingPlan(recommendation.planCode || survey.package || 'Starter').code,
      workspace_name: normalizeSurveyText(survey.workspaceName || survey.workspace_name || workspaceName, profile.workspace_name || 'Work2U Studio'),
      persona: normalizeSurveyText(survey.role || profile.persona || 'Freelancer', 'Freelancer'),
      primary_goal: normalizeSurveyText(survey.goal || survey.primaryGoal || profile.primary_goal || 'Follow up prospects', 'Follow up prospects'),
      channels: channels.length ? channels : profile.channels || ['whatsapp', 'email', 'telegram'],
      access_role: normalizeSurveyText(survey.accessRole || profile.access_role || 'Admin', 'Admin'),
      auth_method: normalizeSurveyText(survey.authMethod || survey.loginMethod || profile.auth_method || 'Email', 'Email'),
      mailbox_type: normalizeSurveyText(survey.mailboxType || profile.mailbox_type || 'Own email', 'Own email'),
      ai_mode: normalizeSurveyText(survey.aiMode || profile.ai_mode || 'Suggest only', 'Suggest only'),
      ai_source: normalizeSurveyText(survey.aiSource || profile.ai_source || 'Work2U managed', 'Work2U managed'),
      language: normalizeSurveyText(survey.language || profile.language || 'BM + English', 'BM + English'),
      region: normalizeSurveyText(survey.region || profile.region || 'Malaysia', 'Malaysia'),
      team_size: normalizeSurveyText(String(survey.teamSize || survey.team_size || profile.team_size || '1'), '1'),
      onboarding_step: 'survey',
      setup_complete: false,
      notes: [
        `Survey score ${recommendation.score || 0}`,
        `recommended ${normalizeBillingPlan(recommendation.planCode || 'Starter').code}`,
        recommendation.packageProfile?.fitSummary || ''
      ].filter(Boolean).join(' | '),
      updated_at: nowIso()
    })
  });

  const text = await response.text();
  if (!response.ok) {
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    throw new Error(data?.message || data?.error || 'Supabase survey sync failed');
  }

  return profile.id;
}

async function storeSurveyResponse(record) {
  const store = await readSurveyStore();
  const nextRecord = {
    id: record.id || crypto.randomUUID(),
    created_at: record.created_at || nowIso(),
    updated_at: nowIso(),
    ...record
  };
  store.surveys.unshift(nextRecord);
  store.surveys = store.surveys.slice(0, 500);
  await writeSurveyStore(store);
  return nextRecord;
}

async function handleWork2uSurvey(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });

  const body = await readBody(req);
  const survey = {
    role: body?.role,
    industry: body?.industry,
    teamSize: body?.teamSize || body?.team_size,
    mainChannel: body?.mainChannel || body?.main_channel,
    secondaryChannels: body?.secondaryChannels || body?.secondary_channels,
    aiMode: body?.aiMode || body?.ai_mode,
    reminderMode: body?.reminderMode || body?.reminder_mode,
    workflowComplexity: body?.workflowComplexity || body?.workflow_complexity,
    permissionNeeds: body?.permissionNeeds || body?.permission_needs,
    slaNeeds: body?.slaNeeds || body?.sla_needs,
    region: body?.region,
    language: body?.language,
    workspaceName: body?.workspaceName || body?.workspace_name,
    email: body?.email,
    authMethod: body?.authMethod || body?.auth_method,
    mailboxType: body?.mailboxType || body?.mailbox_type,
    goal: body?.goal || body?.primaryGoal || body?.primary_goal,
    notes: body?.notes
  };

  const recommendation = resolveSurveyRecommendation(survey);
  const savedSurvey = await storeSurveyResponse({
    ...survey,
    recommendation,
    source: 'survey-popup',
    state: 'submitted'
  });

  let profileId = null;
  try {
    profileId = await updateSupabaseProfileFromSurvey({
      ownerId: body?.ownerId || body?.owner_id || '',
      email: survey.email || '',
      workspaceName: survey.workspaceName || '',
      survey,
      recommendation
    });
  } catch (error) {
    console.warn('Survey profile sync failed:', error.message);
  }

  return send(res, 200, {
    success: true,
    data: {
      survey: savedSurvey,
      recommendation,
      profileSync: {
        synced: Boolean(profileId),
        profileId
      }
    }
  });
}

async function findSupabaseProfileByLookup({ email = '', workspaceName = '', ownerId = '' } = {}) {
  const fields = 'id,email,login_email,workspace_name,package';
  if (ownerId) {
    const result = await supabaseRest('profiles', {
      query: { select: fields, id: `eq.${ownerId}`, limit: '1' }
    });
    return Array.isArray(result) ? result[0] || null : null;
  }

  const emailValue = String(email || '').trim();
  if (emailValue) {
    const result = await supabaseRest('profiles', {
      query: { select: fields, or: `(email.eq.${emailValue},login_email.eq.${emailValue})`, limit: '1' }
    });
    if (Array.isArray(result) && result[0]) return result[0];
  }

  const workspaceValue = String(workspaceName || '').trim();
  if (workspaceValue) {
    const result = await supabaseRest('profiles', {
      query: { select: fields, workspace_name: `eq.${workspaceValue}`, limit: '1' }
    });
    if (Array.isArray(result) && result[0]) return result[0];
  }

  return null;
}

async function updateSupabaseProfilePackage({ ownerId = '', email = '', workspaceName = '', planCode = 'Starter' } = {}) {
  const base = supabaseRestBase();
  const headers = supabaseAdminHeaders();
  if (!base || !headers) return null;

  const profile = await findSupabaseProfileByLookup({ ownerId, email, workspaceName });
  if (!profile?.id) return null;

  const response = await fetch(`${base}/rest/v1/profiles?id=eq.${encodeURIComponent(profile.id)}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      package: normalizeBillingPlan(planCode).code,
      updated_at: nowIso()
    })
  });

  const text = await response.text();
  if (!response.ok) {
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    throw new Error(data?.message || data?.error || 'Supabase profile sync failed');
  }

  return profile.id;
}

async function resolveBillingOwnerId(record = {}) {
  if (record.owner_id) return record.owner_id;
  const profile = await findSupabaseProfileByLookup({
    email: record.email || '',
    workspaceName: record.workspace_name || '',
    ownerId: record.owner_id || ''
  });
  return profile?.id || null;
}

function billingEntitlementRowsForPlan(planCode) {
  const plan = work2uPlanLimits()[normalizeBillingPlan(planCode).code] || work2uPlanLimits().Starter;
  const rows = [
    ['max_users', plan.maxUsers, 'count'],
    ['max_workspaces', plan.maxWorkspaces, 'count'],
    ['max_main_channels', plan.maxMainChannels, 'count'],
    ['max_leads_active', plan.maxLeadsActive, 'count'],
    ['max_clients_active', plan.maxClientsActive, 'count'],
    ['max_tasks_active', plan.maxTasksActive, 'count'],
    ['max_ai_actions_month', plan.maxAiActionsMonth, 'monthly_count'],
    ['max_automation_rules', plan.maxAutomationRules, 'count'],
    ['max_connectors', plan.maxConnectors, 'count'],
    ['max_storage_gb', plan.maxStorageGb, 'gb'],
    ['max_email_sends_month', plan.maxEmailSendsMonth, 'monthly_count'],
    ['max_shared_templates', plan.maxSharedTemplates, 'count'],
    ['allow_custom_branding', plan.allowCustomBranding, 'flag'],
    ['allow_custom_permissions', plan.allowCustomPermissions, 'flag'],
    ['allow_custom_workflow', plan.allowCustomWorkflow, 'flag'],
    ['allow_audit_log', plan.allowAuditLog, 'flag'],
    ['allow_priority_sla_support', plan.allowPrioritySlaSupport, 'flag'],
    ['allow_byo_ai_key', plan.allowByoAiKey, 'flag']
  ];

  return rows
    .map(([featureKey, limitValue, limitUnit]) => ({
      feature_key: featureKey,
      limit_value: Number(limitValue),
      limit_unit: limitUnit
    }))
    .filter((row) => Number.isFinite(row.limit_value));
}

async function syncBillingEntitlementsToSupabase({ ownerId = '', planCode = 'Starter' } = {}) {
  const base = supabaseRestBase();
  const headers = supabaseAdminHeaders();
  if (!base || !headers) return null;

  const cleanOwnerId = String(ownerId || '').trim();
  if (!cleanOwnerId) return null;

  const normalizedPlan = normalizeBillingPlan(planCode).code;
  const rows = billingEntitlementRowsForPlan(normalizedPlan);
  if (!rows.length) return null;

  const payloads = rows.map((row) => ({
    id: `${cleanOwnerId}:${row.feature_key}`,
    owner_id: cleanOwnerId,
    plan_code: normalizedPlan,
    feature_key: row.feature_key,
    limit_value: row.limit_value,
    limit_unit: row.limit_unit
  }));

  await Promise.all(payloads.map((payload) => supabaseUpsert('entitlements', payload)));
  return payloads;
}

async function syncBillingAccessState(record = {}, { statusOverride = null } = {}) {
  const normalizedStatus = billingNormalizeStatus(statusOverride || record.status || 'pending');
  const activePlanCode = normalizedStatus === 'active' ? normalizeBillingPlan(record.plan_code || record.plan || 'Starter').code : 'Starter';
  const ownerId = await resolveBillingOwnerId(record);

  if (ownerId) {
    await updateSupabaseProfilePackage({
      ownerId,
      email: record.email || '',
      workspaceName: record.workspace_name || '',
      planCode: activePlanCode
    }).catch((error) => {
      console.warn('Supabase profile package sync failed:', error.message);
    });

    await syncBillingEntitlementsToSupabase({
      ownerId,
      planCode: activePlanCode
    }).catch((error) => {
      console.warn('Supabase entitlement sync failed:', error.message);
    });
  }

  return {
    ownerId,
    planCode: activePlanCode,
    status: normalizedStatus
  };
}

async function syncBillingSubscriptionToSupabase(record) {
  const base = supabaseRestBase();
  const headers = supabaseAdminHeaders();
  if (!base || !headers) return null;

  const ownerId = await resolveBillingOwnerId(record);
  if (!ownerId) return null;

  const payload = {
    id: record.id,
    owner_id: ownerId,
    plan_code: normalizeBillingPlan(record.plan_code || record.plan || 'Starter').code,
    provider: record.provider || 'stripe',
    status: billingNormalizeStatus(record.status || 'pending'),
    email: record.email || '',
    workspace_name: record.workspace_name || '',
    name: record.name || record.workspace_name || 'Work2U Customer',
    region: record.region || 'Global',
    customer_id: record.customer_id || '',
    subscription_id: record.subscription_id || '',
    session_id: record.session_id || '',
    bill_id: record.bill_id || '',
    payment_url: record.payment_url || '',
    amount_cents: Number(record.amount_cents || 0),
    currency: record.currency || 'MYR',
    current_period_start: record.current_period_start || null,
    current_period_end: record.current_period_end || null,
    cancel_at_period_end: !!record.cancel_at_period_end,
    trial_ends_at: record.trial_ends_at || null,
    metadata: record.metadata && typeof record.metadata === 'object' ? record.metadata : {},
    raw_payload: record.raw_payload && typeof record.raw_payload === 'object' ? record.raw_payload : {},
    updated_at: record.updated_at || nowIso()
  };

  return supabaseUpsert('subscriptions', payload);
}

async function syncBillingEventToSupabase(event) {
  const base = supabaseRestBase();
  const headers = supabaseAdminHeaders();
  if (!base || !headers) return null;

  const ownerId = await resolveBillingOwnerId(event);
  if (!ownerId) return null;

  const payload = {
    id: event.id || `evt-${Date.now()}`,
    owner_id: ownerId,
    provider: event.provider || 'stripe',
    event_type: event.event_type || 'unknown',
    status: event.status || 'received',
    email: event.email || '',
    workspace_name: event.workspace_name || '',
    subscription_id: event.subscription_id || '',
    customer_id: event.customer_id || '',
    raw_payload: event.raw_payload && typeof event.raw_payload === 'object' ? event.raw_payload : {},
    updated_at: event.updated_at || nowIso()
  };

  return supabaseUpsert('billing_events', payload);
}

async function readSupabaseBillingSnapshot() {
  const base = supabaseRestBase();
  const headers = supabaseAdminHeaders();
  if (!base || !headers) return null;

  const [subscriptions, events] = await Promise.all([
    supabaseRest('subscriptions', { query: { select: '*', order: 'updated_at.desc', limit: '200' } }),
    supabaseRest('billing_events', { query: { select: '*', order: 'created_at.desc', limit: '50' } })
  ]);

  return {
    subscriptions: Array.isArray(subscriptions) ? subscriptions : [],
    events: Array.isArray(events) ? events : []
  };
}

function publicConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
  const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
  const relayReady = outboundRelayReady();
  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseRedirectTo: process.env.SUPABASE_REDIRECT_TO || `${appBaseUrl()}/work2u`,
    auth: {
      production: /^https:\/\//i.test(appBaseUrl()),
      supabaseReady: !!(supabaseUrl && supabaseAnonKey),
      googleReady: !!googleClientId
    },
    mail: {
      resendReady: !!process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL || 'noreply@work2u.io'
    },
    google: {
      clientId: googleClientId,
      redirectUri: process.env.GOOGLE_REDIRECT_URI || `${appBaseUrl()}/api/auth/google/callback`
    },
    billing: {
      billplzReady: !!(process.env.BILLPLZ_SECRET_KEY && process.env.BILLPLZ_COLLECTION_ID),
      stripeReady: !!process.env.STRIPE_SECRET_KEY
    },
    channels: {
      ...relayReady,
      webhookSecretReady: !!(process.env.WORK2U_CHANNEL_WEBHOOK_SECRET || process.env.WHATSAPP_WEBHOOK_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET)
    }
  };
}

function billingPlans() {
  return {
    Starter: {
      code: 'Starter',
      amountCents: 2900,
      name: 'Work2U Starter',
      description: 'Starter plan for freelancers and solo users who want a lightweight CRM'
    },
    Elite: {
      code: 'Elite',
      amountCents: 9900,
      name: 'Work2U Elite',
      description: 'Elite plan for growing teams that need stronger collaboration and automation'
    },
    Enterprise: {
      code: 'Enterprise',
      amountCents: 0,
      name: 'Work2U Enterprise',
      description: 'Enterprise plan for custom workflow, governance, and SLA support'
    }
  };
}

function normalizeBillingPlan(plan) {
  const key = String(plan || '').toLowerCase();
  if (key === 'elite') return billingPlans().Elite;
  if (key === 'enterprise') return billingPlans().Enterprise;
  return billingPlans().Starter;
}

function billingProviderForRegion(region) {
  return String(region || '').toLowerCase().includes('malaysia') ? 'billplz' : 'stripe';
}

function billingStorePath() {
  return path.join(runtimeDataDir(), 'work2u-billing-store.json');
}

function defaultBillingStore() {
  return {
    subscriptions: [],
    events: []
  };
}

async function ensureBillingStoreDir() {
  await fsp.mkdir(path.dirname(billingStorePath()), { recursive: true });
}

async function readBillingStore() {
  try {
    const raw = await fsp.readFile(billingStorePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...defaultBillingStore(),
      ...parsed,
      subscriptions: Array.isArray(parsed?.subscriptions) ? parsed.subscriptions : [],
      events: Array.isArray(parsed?.events) ? parsed.events : []
    };
  } catch {
    return defaultBillingStore();
  }
}

async function writeBillingStore(store) {
  await ensureBillingStoreDir();
  await fsp.writeFile(billingStorePath(), `${JSON.stringify(store, null, 2)}\n`, 'utf8');
}

function billingNormalizeStatus(status) {
  const value = String(status || '').toLowerCase();
  if (!value) return 'pending';
  if (['active', 'trialing', 'paid', 'succeeded', 'completed', 'verified'].includes(value)) return 'active';
  if (['past_due', 'unpaid', 'failed', 'payment_failed'].includes(value)) return 'past_due';
  if (['canceled', 'cancelled', 'incomplete_expired', 'expired'].includes(value)) return 'canceled';
  if (['pending', 'processing', 'open'].includes(value)) return 'pending';
  return value;
}

function billingMatchSubscription(subscription, lookup = {}) {
  if (!subscription) return false;
  if (lookup.provider && subscription.provider !== lookup.provider) return false;
  if (lookup.subscriptionId && subscription.subscription_id === lookup.subscriptionId) return true;
  if (lookup.sessionId && subscription.session_id === lookup.sessionId) return true;
  if (lookup.billId && subscription.bill_id === lookup.billId) return true;
  if (lookup.customerId && subscription.customer_id === lookup.customerId) return true;

  const hasEmail = !!lookup.email;
  const hasWorkspace = !!lookup.workspaceName;
  if (!hasEmail && !hasWorkspace) return true;

  const emailMatch = !hasEmail || String(subscription.email || '').toLowerCase() === String(lookup.email || '').toLowerCase();
  const workspaceMatch = !hasWorkspace || String(subscription.workspace_name || '').toLowerCase() === String(lookup.workspaceName || '').toLowerCase();
  return emailMatch && workspaceMatch;
}

function findBillingSubscription(store, lookup = {}) {
  return (store?.subscriptions || []).find((item) => billingMatchSubscription(item, lookup)) || null;
}

function billingSubscriptionId(record) {
  return [
    record.provider || 'stripe',
    record.subscription_id || record.customer_id || record.session_id || record.bill_id || '',
    record.email || '',
    record.workspace_name || ''
  ]
    .map((part) => String(part || '').toLowerCase().trim())
    .filter(Boolean)
    .join('|');
}

function normalizeBillingRecord(record = {}) {
  const now = nowIso();
  return {
    id: record.id || billingSubscriptionId(record) || `billing-${Date.now()}`,
    provider: record.provider || 'stripe',
    owner_id: record.owner_id || null,
    email: record.email || '',
    workspace_name: record.workspace_name || '',
    name: record.name || record.workspace_name || 'Work2U Customer',
    region: record.region || 'Global',
    plan_code: normalizeBillingPlan(record.plan_code || record.plan || 'Starter').code,
    status: billingNormalizeStatus(record.status || 'pending'),
    customer_id: record.customer_id || '',
    subscription_id: record.subscription_id || '',
    session_id: record.session_id || '',
    bill_id: record.bill_id || '',
    payment_url: record.payment_url || '',
    amount_cents: Number(record.amount_cents || 0),
    currency: record.currency || 'MYR',
    current_period_start: record.current_period_start || null,
    current_period_end: record.current_period_end || null,
    cancel_at_period_end: !!record.cancel_at_period_end,
    trial_ends_at: record.trial_ends_at || null,
    metadata: record.metadata && typeof record.metadata === 'object' ? record.metadata : {},
    raw_payload: record.raw_payload && typeof record.raw_payload === 'object' ? record.raw_payload : {},
    created_at: record.created_at || now,
    updated_at: now
  };
}

async function upsertBillingSubscription(record) {
  const store = await readBillingStore();
  const nextRecord = normalizeBillingRecord(record);
  const index = store.subscriptions.findIndex((item) =>
    billingMatchSubscription(item, {
      provider: nextRecord.provider,
      subscriptionId: nextRecord.subscription_id,
      sessionId: nextRecord.session_id,
      billId: nextRecord.bill_id,
      customerId: nextRecord.customer_id,
      email: nextRecord.email,
      workspaceName: nextRecord.workspace_name
    })
  );

  if (index >= 0) {
    store.subscriptions[index] = {
      ...store.subscriptions[index],
      ...nextRecord,
      id: store.subscriptions[index].id || nextRecord.id
    };
  } else {
    store.subscriptions.unshift(nextRecord);
  }

  await writeBillingStore(store);
  try {
    await syncBillingSubscriptionToSupabase(nextRecord);
  } catch (error) {
    console.warn('Supabase subscription sync failed:', error.message);
  }
  return nextRecord;
}

async function appendBillingEvent(event) {
  const store = await readBillingStore();
  store.events.unshift({
    id: event.id || `evt-${Date.now()}`,
    provider: event.provider || 'stripe',
    event_type: event.event_type || 'unknown',
    status: event.status || 'received',
    owner_id: event.owner_id || null,
    email: event.email || '',
    workspace_name: event.workspace_name || '',
    raw_payload: event.raw_payload && typeof event.raw_payload === 'object' ? event.raw_payload : {},
    created_at: event.created_at || nowIso(),
    updated_at: nowIso()
  });
  store.events = store.events.slice(0, 250);
  await writeBillingStore(store);
  try {
    await syncBillingEventToSupabase(store.events[0]);
  } catch (error) {
    console.warn('Supabase billing event sync failed:', error.message);
  }
  return store.events[0];
}

function billingPlanLimits(planCode) {
  return work2uPlanLimits()[normalizeBillingPlan(planCode).code] || work2uPlanLimits().Starter;
}

function parseStripeSignatureHeader(header) {
  return String(header || '')
    .split(',')
    .reduce((acc, part) => {
      const idx = part.indexOf('=');
      if (idx === -1) return acc;
      const key = part.slice(0, idx).trim();
      const value = part.slice(idx + 1).trim();
      if (!key || !value) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(value);
      return acc;
    }, {});
}

function verifyStripeSignature(rawBody, signatureHeader) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) return false;

  const parsed = parseStripeSignatureHeader(signatureHeader);
  const timestamp = parsed.t?.[0];
  const signatures = parsed.v1 || [];
  if (!timestamp || !signatures.length || !rawBody) return false;

  const toleranceSeconds = 300;
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;
  if (Math.abs(Date.now() / 1000 - timestampNumber) > toleranceSeconds) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', endpointSecret).update(payload, 'utf8').digest('hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return signatures.some((candidate) => {
    try {
      const candidateBuffer = Buffer.from(candidate, 'hex');
      return candidateBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(candidateBuffer, expectedBuffer);
    } catch {
      return false;
    }
  });
}

function stripeEventBillingState(eventType, data) {
  if (!eventType) return null;
  if (eventType === 'checkout.session.completed') {
    return data?.payment_status === 'paid' ? 'active' : 'pending';
  }
  if (eventType === 'customer.subscription.deleted') return 'canceled';
  if (eventType === 'invoice.payment_failed') return 'past_due';
  if (eventType === 'invoice.paid') return 'active';
  if (eventType === 'customer.subscription.created' || eventType === 'customer.subscription.updated') {
    return billingNormalizeStatus(data?.status);
  }
  return null;
}

async function createStripeCustomer({ email, name, workspaceName, planInfo, region }) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured');

  const params = new URLSearchParams();
  if (email) params.set('email', email);
  if (name) params.set('name', name);
  params.set('metadata[workspace_name]', workspaceName || 'Work2U');
  params.set('metadata[plan]', planInfo?.code || 'Starter');
  params.set('metadata[region]', region || 'Global');
  params.set('metadata[integration]', 'work2u');

  const response = await fetch('https://api.stripe.com/v1/customers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Stripe customer creation failed');
  }

  return {
    id: data.id,
    raw: data
  };
}

function billplzApiBase() {
  return process.env.BILLPLZ_API_BASE_URL || 'https://www.billplz.com/api';
}

function billplzAuthHeader() {
  return `Basic ${Buffer.from(`${process.env.BILLPLZ_SECRET_KEY || ''}:`).toString('base64')}`;
}

function billplzSourceString(payload) {
  const flatten = (value, prefix) => {
    if (Array.isArray(value)) {
      return value.flatMap((item) => flatten(item, prefix));
    }
    if (value && typeof value === 'object') {
      return Object.entries(value).flatMap(([key, nestedValue]) => flatten(nestedValue, `${prefix}${key}`));
    }
    return [[prefix, String(value ?? '')]];
  };

  return Object.keys(payload || {})
    .filter((key) => key !== 'x_signature')
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .flatMap((key) => flatten(payload[key], key))
    .map(([key, value]) => `${key}${value}`)
    .join('|');
}

function verifyBillplzSignature(payload, signature) {
  const xSignatureKey = process.env.BILLPLZ_X_SIGNATURE_KEY;
  if (!xSignatureKey) return false;
  const source = billplzSourceString(payload);
  const computed = crypto.createHmac('sha256', xSignatureKey).update(source).digest('hex');
  return computed === signature;
}

async function createBillplzBill({ plan, region, email, name, workspaceName }) {
  const billplzSecretKey = process.env.BILLPLZ_SECRET_KEY;
  const collectionId = process.env.BILLPLZ_COLLECTION_ID;
  if (!billplzSecretKey || !collectionId) {
    throw new Error('Billplz credentials are not configured');
  }

  const planInfo = normalizeBillingPlan(plan);
  const callbackUrl = `${appBaseUrl()}/api/billing/billplz/callback?plan=${encodeURIComponent(planInfo.code)}&workspace=${encodeURIComponent(workspaceName || '')}`;
  const redirectUrl = `${appBaseUrl()}/api/billing/billplz/redirect?plan=${encodeURIComponent(planInfo.code)}&workspace=${encodeURIComponent(workspaceName || '')}`;
  const body = new URLSearchParams({
    collection_id: collectionId,
    email: email || 'billing@work2u.io',
    name: name || workspaceName || 'Work2U Customer',
    amount: String(planInfo.amountCents),
    description: planInfo.description,
    callback_url: callbackUrl,
    redirect_url: redirectUrl,
    reference_1_label: 'Plan',
    reference_1: planInfo.code,
    reference_2_label: 'Workspace',
    reference_2: workspaceName || 'Work2U'
  });

  const response = await fetch(`${billplzApiBase()}/v3/bills`, {
    method: 'POST',
    headers: {
      Authorization: billplzAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || data?.error || 'Billplz checkout failed');
  }

  return {
    provider: 'billplz',
    plan: planInfo.code,
    amountCents: planInfo.amountCents,
    paymentUrl: data.url,
    paymentId: data.id,
    raw: data
  };
}

async function createStripeCheckout({ plan, region, email, name, workspaceName }) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured');

  const planInfo = normalizeBillingPlan(plan);
  const trialDays = 7;
  const store = await readBillingStore();
  const existing = findBillingSubscription(store, {
    provider: 'stripe',
    email,
    workspaceName
  });
  const customerId = existing?.customer_id || (await createStripeCustomer({ email, name, workspaceName, planInfo, region })).id;
  const params = new URLSearchParams();
  params.set('mode', 'subscription');
  params.set('customer', customerId);
  params.set('success_url', `${appBaseUrl()}/crm?billing=success&plan=${encodeURIComponent(planInfo.code)}&provider=stripe`);
  params.set('cancel_url', `${appBaseUrl()}/crm?billing=cancelled&plan=${encodeURIComponent(planInfo.code)}&provider=stripe`);
  params.set('customer_email', email || '');
  params.set('payment_method_collection', 'always');
  params.set('line_items[0][quantity]', '1');
  params.set('line_items[0][price_data][currency]', 'myr');
  params.set('line_items[0][price_data][product_data][name]', planInfo.name);
  params.set('line_items[0][price_data][product_data][description]', planInfo.description);
  params.set('line_items[0][price_data][unit_amount]', String(planInfo.amountCents));
  params.set('line_items[0][price_data][recurring][interval]', 'month');
  params.set('subscription_data[trial_period_days]', String(trialDays));
  params.set('customer_update[name]', 'auto');
  params.set('metadata[plan]', planInfo.code);
  params.set('metadata[customer_id]', customerId);
  params.set('metadata[email]', email || '');
  params.set('metadata[workspace_name]', workspaceName || 'Work2U');
  params.set('metadata[region]', region || 'Global');
  params.set('metadata[integration]', 'work2u');
  params.set('metadata[trial_days]', String(trialDays));

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Stripe checkout failed');
  }

  return {
    provider: 'stripe',
    plan: planInfo.code,
    amountCents: planInfo.amountCents,
    paymentUrl: data.url,
    paymentId: data.id,
    customerId,
    raw: data
  };
}

async function handleBillingCheckout(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const body = await readBody(req);
  const plan = normalizeBillingPlan(body?.plan || 'Starter');
  const region = String(body?.region || 'Malaysia');
  const provider = body?.provider || billingProviderForRegion(region);
  const email = String(body?.email || '');
  const name = String(body?.name || body?.workspaceName || 'Work2U Customer');
  const workspaceName = String(body?.workspaceName || 'Work2U');

  try {
    if (plan.code === 'Enterprise') {
      const manualCheckout = {
        provider: 'manual',
        plan: plan.code,
        amountCents: 0,
        paymentUrl: `${appBaseUrl()}/crm?billing=enterprise&plan=${encodeURIComponent(plan.code)}`,
        paymentId: `enterprise-${Date.now()}`,
        raw: {
          message: 'Enterprise plans require a custom quote and admin approval.'
        }
      };

      await upsertBillingSubscription({
        provider: 'manual',
        email,
        workspace_name: workspaceName,
        name,
        region,
        plan_code: plan.code,
        status: 'pending',
        payment_url: manualCheckout.paymentUrl,
        amount_cents: 0,
        currency: 'MYR',
        metadata: {
          provider: 'manual',
          region,
          plan: plan.code
        },
        raw_payload: manualCheckout.raw
      });

      await appendBillingEvent({
        provider: 'manual',
        event_type: 'checkout.manual_required',
        status: 'pending',
        email,
        workspace_name: workspaceName,
        raw_payload: manualCheckout.raw
      });

      return send(res, 200, manualCheckout);
    }

    const checkout =
      provider === 'billplz'
        ? await createBillplzBill({ plan: plan.code, region, email, name, workspaceName })
        : await createStripeCheckout({ plan: plan.code, region, email, name, workspaceName });

    await upsertBillingSubscription({
      provider: checkout.provider,
      email,
      workspace_name: workspaceName,
      name,
      region,
      plan_code: checkout.plan,
      status: 'pending',
      customer_id: checkout.customerId || '',
      session_id: checkout.paymentId || '',
      bill_id: checkout.provider === 'billplz' ? checkout.paymentId : '',
      payment_url: checkout.paymentUrl,
      amount_cents: checkout.amountCents,
      currency: checkout.provider === 'stripe' ? 'MYR' : 'MYR',
      metadata: {
        provider: checkout.provider,
        region,
        plan: checkout.plan
      },
      raw_payload: checkout.raw
    });

    await appendBillingEvent({
      provider: checkout.provider,
      event_type: 'checkout.created',
      status: 'received',
      email,
      workspace_name: workspaceName,
      raw_payload: checkout.raw
    });

    try {
      const job = await enqueueOutboundJob({
        kind: 'billing_checkout_email',
        channel: 'email',
        target: email,
        subject: `${workspaceName} checkout for ${plan.code}`,
        payload: {
          email,
          name,
          workspaceName,
          plan: plan.code,
          provider: checkout.provider,
          paymentUrl: checkout.paymentUrl,
          region
        },
        metadata: {
          source: 'billing'
        },
        idempotencyKey: crypto.createHash('sha256').update(`${email}|${workspaceName}|${plan.code}|billing_checkout`).digest('hex')
      });
      await processOutboundJob(job.id);
    } catch (mailError) {
      console.warn('Resend checkout email failed:', mailError.message);
      await appendBillingEvent({
        provider: checkout.provider,
        event_type: 'email.send_failed',
        status: 'failed',
        email,
        workspace_name: workspaceName,
        raw_payload: { error: mailError.message, stage: 'billing_checkout_email' }
      }).catch(() => {});
    }

    return send(res, 200, checkout);
  } catch (error) {
    return send(res, 500, { error: error.message || 'Failed to create checkout' });
  }
}

async function handleBillplzCallback(req, res, url) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const body = await readBody(req);
  const signature = body?.x_signature || body?.['billplz[x_signature]'];
  if (!verifyBillplzSignature(body || {}, signature)) {
    return send(res, 401, { error: 'Invalid Billplz signature' });
  }

  const plan = url?.searchParams?.get('plan') || body?.['reference_1'] || body?.['billplz[reference_1]'] || 'Starter';
  const workspaceName = url?.searchParams?.get('workspace') || body?.['reference_2'] || body?.['billplz[reference_2]'] || 'Work2U';
  const email = body?.email || body?.['billplz[email]'] || '';
  const paidFlag = String(body?.['billplz[paid]'] || body?.['billplz[transaction_status]'] || body?.paid || '').toLowerCase();
  const status = paidFlag === 'true' || paidFlag === '1' || paidFlag === 'paid' || paidFlag === 'verified' ? 'active' : 'pending';

  await upsertBillingSubscription({
    provider: 'billplz',
    email,
    workspace_name: workspaceName,
    name: body?.name || workspaceName,
    region: 'Malaysia',
    plan_code: normalizeBillingPlan(plan).code,
    status,
    bill_id: body?.['billplz[id]'] || body?.['id'] || '',
    payment_url: body?.url || '',
    amount_cents: Number(body?.amount || 0),
    currency: 'MYR',
    metadata: {
      plan: normalizeBillingPlan(plan).code,
      paid: paidFlag
    },
    raw_payload: body || {}
  });

  await appendBillingEvent({
    provider: 'billplz',
    event_type: 'billplz.callback',
    status,
    email,
    workspace_name: workspaceName,
    raw_payload: body || {}
  });

  await syncBillingAccessState({
    provider: 'billplz',
    status,
    email,
    workspace_name: workspaceName,
    plan_code: normalizeBillingPlan(plan).code,
    raw_payload: body || {}
  }, { statusOverride: status }).catch(async (error) => {
    await appendBillingEvent({
      provider: 'billplz',
      event_type: 'supabase.sync_failed',
      status: 'failed',
      email,
      workspace_name: workspaceName,
      raw_payload: { error: error.message || 'Supabase sync failed' }
    });
  });

  return send(res, 200, {
    received: true,
    provider: 'billplz',
    status
  });
}

async function handleBillplzRedirect(req, res, url) {
  const signature = url.searchParams.get('billplz[x_signature]') || url.searchParams.get('x_signature');
  const payload = {};
  for (const [key, value] of url.searchParams.entries()) {
    payload[key] = value;
  }
  if (signature && !verifyBillplzSignature(payload, signature)) {
    return redirect(res, `${appBaseUrl()}/crm?billing=error&provider=billplz`);
  }

  const plan = url.searchParams.get('plan') || 'Starter';
  const workspaceName = url.searchParams.get('workspace') || 'Work2U';
  const paidFlag = (url.searchParams.get('billplz[paid]') || url.searchParams.get('paid') || '').toLowerCase();
  const status = paidFlag === 'true' || paidFlag === '1' || paidFlag === 'paid' ? 'success' : 'pending';
  await upsertBillingSubscription({
    provider: 'billplz',
    workspace_name: workspaceName,
    plan_code: normalizeBillingPlan(plan).code,
    status: status === 'success' ? 'active' : 'pending',
    metadata: {
      redirect_status: status
    }
  });
  await syncBillingAccessState({
    provider: 'billplz',
    workspace_name: workspaceName,
    plan_code: normalizeBillingPlan(plan).code,
    status: status === 'success' ? 'active' : 'pending',
    raw_payload: payload
  }, { statusOverride: status === 'success' ? 'active' : 'pending' }).catch(() => {});
  return redirect(
    res,
    `${appBaseUrl()}/crm?billing=${status}&provider=billplz&plan=${encodeURIComponent(plan)}`
  );
}

async function handleStripeWebhook(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const rawBody = await readRawBody(req);
  const signature = req.headers['stripe-signature'];
  if (!verifyStripeSignature(rawBody, signature)) {
    return send(res, 401, { error: 'Invalid Stripe signature' });
  }

  let event = null;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return send(res, 400, { error: 'Invalid Stripe payload' });
  }

  const data = event?.data?.object || {};
  const store = await readBillingStore();
  const existing = findBillingSubscription(store, {
    provider: 'stripe',
    email: data?.customer_details?.email || data?.customer_email || data?.metadata?.email || '',
    workspaceName: data?.metadata?.workspace_name || data?.metadata?.workspace || 'Work2U',
    customerId: data?.customer || data?.customer_id || data?.metadata?.customer_id || '',
    subscriptionId: data?.subscription || data?.id || ''
  });
  const providerStatus = stripeEventBillingState(event?.type, data);
  const email =
    data?.customer_details?.email ||
    data?.customer_email ||
    data?.metadata?.email ||
    '';
  const workspaceName = data?.metadata?.workspace_name || data?.metadata?.workspace || 'Work2U';
  const planCode = normalizeBillingPlan(data?.metadata?.plan || data?.metadata?.plan_code || existing?.plan_code || 'Starter').code;
  const record = {
    provider: 'stripe',
    email,
    workspace_name: workspaceName,
    name: data?.customer_details?.name || data?.metadata?.name || workspaceName,
    region: data?.metadata?.region || 'Global',
    plan_code: planCode,
    status: providerStatus || 'pending',
    customer_id: data?.customer || data?.customer_id || data?.metadata?.customer_id || '',
    subscription_id: data?.subscription || data?.id || '',
    session_id: event?.type === 'checkout.session.completed' ? data?.id || '' : '',
    payment_url: '',
    amount_cents: Number(data?.amount_total || data?.plan?.amount || 0),
    currency: String(data?.currency || 'myr').toUpperCase(),
    current_period_start: data?.current_period_start ? new Date(data.current_period_start * 1000).toISOString() : null,
    current_period_end: data?.current_period_end ? new Date(data.current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: !!data?.cancel_at_period_end,
    trial_ends_at: data?.trial_end ? new Date(data.trial_end * 1000).toISOString() : null,
    metadata: data?.metadata || {},
    raw_payload: event
  };

  await upsertBillingSubscription(record);
  await appendBillingEvent({
    provider: 'stripe',
    event_type: event?.type || 'unknown',
    status: providerStatus || 'received',
    email,
    workspace_name: workspaceName,
    raw_payload: event
  });

  await syncBillingAccessState({
    provider: 'stripe',
    owner_id: data?.metadata?.owner_id || '',
    email,
    workspace_name: workspaceName,
    plan_code: planCode,
    status: providerStatus || 'received',
    raw_payload: event
  }, { statusOverride: providerStatus || 'received' }).catch(async (error) => {
    await appendBillingEvent({
      provider: 'stripe',
      event_type: 'supabase.sync_failed',
      status: 'failed',
      email,
      workspace_name: workspaceName,
      raw_payload: { error: error.message || 'Supabase sync failed' }
    });
  });

  return send(res, 200, { received: true, id: event?.id || null, type: event?.type || null });
}

async function createStripePortalSession({ customerId, returnUrl }) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured');
  if (!customerId) throw new Error('No Stripe customer found for portal access');

  const params = new URLSearchParams();
  params.set('customer', customerId);
  params.set('return_url', returnUrl || `${appBaseUrl()}/crm?billing=portal`);

  const response = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Stripe portal session failed');
  }

  return data;
}

async function handleBillingPortal(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const body = await readBody(req);
  const provider = String(body?.provider || billingProviderForRegion(body?.region || 'Global')).toLowerCase();
  const workspaceName = String(body?.workspaceName || body?.workspace_name || 'Work2U');
  const email = String(body?.email || '');
  const planCode = normalizeBillingPlan(body?.plan || 'Starter').code;

  if (provider === 'billplz') {
    return send(res, 200, {
      provider: 'billplz',
      portalUrl: `${appBaseUrl()}/crm?billing=manage&provider=billplz&plan=${encodeURIComponent(planCode)}`,
      message: 'Billplz uses the Work2U billing page for management.'
    });
  }

  try {
    const store = await readBillingStore();
    let record = findBillingSubscription(store, {
      provider: 'stripe',
      email,
      workspaceName
    });

    if (!record?.customer_id) {
      const customer = await createStripeCustomer({
        email,
        name: body?.name || workspaceName,
        workspaceName,
        planInfo: normalizeBillingPlan(planCode),
        region: body?.region || 'Global'
      });
      record = await upsertBillingSubscription({
        provider: 'stripe',
        email,
        workspace_name: workspaceName,
        name: body?.name || workspaceName,
        region: body?.region || 'Global',
        plan_code: planCode,
        status: 'pending',
        customer_id: customer.id,
        metadata: {
          portal: true
        }
      });
    }

    const portal = await createStripePortalSession({
      customerId: record?.customer_id,
      returnUrl: `${appBaseUrl()}/crm?billing=portal&provider=stripe&plan=${encodeURIComponent(planCode)}`
    });

    await appendBillingEvent({
      provider: 'stripe',
      event_type: 'portal.created',
      status: 'received',
      email,
      workspace_name: workspaceName,
      raw_payload: portal
    });

    return send(res, 200, {
      provider: 'stripe',
      portalUrl: portal.url,
      customerId: record?.customer_id || null
    });
  } catch (error) {
    return send(res, 500, { error: error.message || 'Could not create billing portal' });
  }
}

async function handleBillingState(req, res, url) {
  if (req.method !== 'GET') return send(res, 405, { error: 'GET only' });
  const scope = String(url.searchParams.get('scope') || '').toLowerCase();

  if (scope === 'admin') {
    const supabaseSnapshot = await readSupabaseBillingSnapshot().catch(() => null);
    const store = supabaseSnapshot || await readBillingStore();
    const subscriptions = store.subscriptions || [];
    const active = subscriptions.filter((item) => item.status === 'active').length;
    const pastDue = subscriptions.filter((item) => item.status === 'past_due').length;
    const pending = subscriptions.filter((item) => item.status === 'pending').length;
    const providers = subscriptions.reduce((acc, item) => {
      const key = item.provider || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return send(res, 200, {
      scope: 'admin',
      source: supabaseSnapshot ? 'supabase' : 'local',
      summary: {
        totalSubscriptions: subscriptions.length,
        activeSubscriptions: active,
        pastDueSubscriptions: pastDue,
        pendingSubscriptions: pending,
        providers
      },
      subscriptions,
      events: (store.events || []).slice(0, 50)
    });
  }

  const store = await readBillingStore();
  const lookup = {
    provider: String(url.searchParams.get('provider') || '').toLowerCase() || '',
    email: String(url.searchParams.get('email') || ''),
    workspaceName: String(url.searchParams.get('workspace') || url.searchParams.get('workspaceName') || ''),
    customerId: String(url.searchParams.get('customerId') || ''),
    subscriptionId: String(url.searchParams.get('subscriptionId') || '')
  };

  const subscription = findBillingSubscription(store, lookup);
  const planCode = subscription?.plan_code || 'Starter';
  return send(res, 200, {
    subscription,
    entitlement: billingPlanLimits(planCode),
    plan: planCode,
    status: subscription?.status || 'pending',
    provider: subscription?.provider || lookup.provider || billingProviderForRegion('Global'),
    lastUpdated: subscription?.updated_at || null
  });
}

function work2uPlanLimits() {
  return {
    Starter: {
      maxUsers: 1,
      maxWorkspaces: 1,
      maxMainChannels: 1,
      maxLeadsActive: 150,
      maxClientsActive: 100,
      maxTasksActive: 500,
      maxAiActionsMonth: 60,
      maxAutomationRules: 3,
      maxConnectors: 1,
      maxStorageGb: 1,
      maxEmailSendsMonth: 500,
      maxSharedTemplates: 5,
      allowCustomBranding: 0,
      allowCustomPermissions: 0,
      allowCustomWorkflow: 0,
      allowAuditLog: 0,
      allowPrioritySlaSupport: 0,
      allowByoAiKey: 1,
      aiQuota: 'Low',
      reporting: 'Basic'
    },
    Elite: {
      maxUsers: 5,
      maxWorkspaces: 1,
      maxMainChannels: 3,
      maxLeadsActive: 1000,
      maxClientsActive: 1000,
      maxTasksActive: 5000,
      maxAiActionsMonth: 300,
      maxAutomationRules: 15,
      maxConnectors: 3,
      maxStorageGb: 10,
      maxEmailSendsMonth: 5000,
      maxSharedTemplates: 50,
      allowCustomBranding: 0,
      allowCustomPermissions: 0,
      allowCustomWorkflow: 0,
      allowAuditLog: 0,
      allowPrioritySlaSupport: 0,
      allowByoAiKey: 1,
      aiQuota: 'Higher',
      reporting: 'Revenue + PnL'
    },
    Enterprise: {
      maxUsers: 25,
      maxWorkspaces: 5,
      maxMainChannels: 10,
      maxLeadsActive: 10000,
      maxClientsActive: 10000,
      maxTasksActive: 50000,
      maxAiActionsMonth: 2000,
      maxAutomationRules: 100,
      maxConnectors: 10,
      maxStorageGb: 100,
      maxEmailSendsMonth: 50000,
      maxSharedTemplates: 1000,
      allowCustomBranding: 1,
      allowCustomPermissions: 1,
      allowCustomWorkflow: 1,
      allowAuditLog: 1,
      allowPrioritySlaSupport: 1,
      allowByoAiKey: 1,
      aiQuota: 'Custom',
      reporting: 'Advanced analytics'
    }
  };
}

async function work2uBootstrap() {
  const queueSnapshot = await listOutboundJobs({ limit: 5 }).catch(() => null);
  return {
    version: 'v1',
    launchGoal: 'AI-powered business OS for CRM, communication, accounting, automation, and AI assist',
    roles: ['Super Admin', 'Admin', 'User'],
    packages: work2uPlanLimits(),
    objectCatalog: work2uObjectCatalog(),
    channels: {
      ...outboundRelayReady(),
      webhookSecretReady: !!(process.env.WORK2U_CHANNEL_WEBHOOK_SECRET || process.env.WHATSAPP_WEBHOOK_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET)
    },
    routing: {
      malaysia: 'Billplz',
      global: 'Stripe'
    },
    stack: ['Cloudflare', 'Supabase', 'Resend', 'Vercel(optional)', 'GitHub'],
    phases: [
      'foundation',
      'auth-and-onboarding',
      'workspace-core',
      'communication',
      'accounting',
      'automation-and-calendar',
      'AI-and-billing',
      'hardening'
    ],
    outboundQueue: queueSnapshot
  };
}

async function handleWork2uBootstrap(req, res) {
  return send(res, 200, await work2uBootstrap());
}

async function handleWork2uOutboundJobs(req, res, url) {
  if (req.method === 'GET') {
    const limit = Number(url.searchParams.get('limit') || 25);
    const status = String(url.searchParams.get('status') || '');
    return send(res, 200, await listOutboundJobs({ limit, status }));
  }

  if (req.method === 'POST') {
    const body = await readBody(req);
    const action = String(body?.action || '').toLowerCase();
    if (action === 'process') {
      return send(res, 200, await processOutboundQueue({ limit: Number(body?.limit || 10) }));
    }
    if (action === 'retry') {
      const jobId = String(body?.jobId || '').trim();
      if (!jobId) return send(res, 400, { error: 'jobId is required' });
      const job = await updateOutboundJob(jobId, {
        status: 'queued',
        error: '',
        processed_at: null,
        updated_at: nowIso(),
        note: 'Retried manually'
      });
      if (!job) return send(res, 404, { error: 'Outbound job not found' });
      return send(res, 200, { job: await processOutboundJob(jobId) });
    }
    return send(res, 400, { error: 'Unsupported action' });
  }

  return send(res, 405, { error: 'Method not allowed' });
}

async function handleWork2uChannelSend(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const body = await readBody(req);
  const channel = String(body?.channel || '').toLowerCase();
  if (!['whatsapp', 'telegram'].includes(channel)) {
    return send(res, 400, { error: 'channel must be whatsapp or telegram' });
  }

  const job = await enqueueOutboundJob({
    kind: `${channel}_message`,
    channel,
    target: body?.target || body?.to || body?.chatId || body?.telegramUsername || '',
    subject: String(body?.subject || body?.message || `${channel} message`).slice(0, 120),
    payload: {
      channel,
      to: body?.to || body?.phone || body?.target || '',
      chatId: body?.chatId || body?.telegramChatId || '',
      username: body?.username || body?.telegramUsername || '',
      phone: body?.phone || '',
      name: body?.name || '',
      message: body?.message || '',
      workspaceName: body?.workspaceName || 'Work2U',
      source: body?.source || 'work2u',
      replyTo: body?.replyTo || ''
    },
    metadata: {
      source: body?.source || 'api',
      channel,
      workspaceName: String(body?.workspaceName || 'Work2U').trim() || 'Work2U'
    },
    idempotencyKey: body?.idempotencyKey || crypto.createHash('sha256').update(`${channel}|${body?.target || body?.to || body?.chatId || body?.telegramUsername || ''}|${body?.message || ''}`).digest('hex')
  });

  const shouldProcess = body?.process !== false;
  const result = shouldProcess ? await processOutboundJob(job.id) : job;
  await appendChannelActivity({
    direction: 'outbound',
    channel,
    contact: String(body?.target || body?.to || body?.chatId || body?.telegramUsername || ''),
    chat_id: String(body?.chatId || body?.telegramChatId || '').trim(),
    username: String(body?.username || body?.telegramUsername || '').trim().replace(/^@/, ''),
    phone: String(body?.phone || body?.to || '').trim(),
    name: String(body?.name || '').trim(),
    message: String(body?.message || '').trim(),
    status: String(result?.status || 'queued'),
    event_type: 'message.sent',
    thread_id: String(body?.threadId || body?.thread_id || ''),
    payload: body || {},
    metadata: {
      source: body?.source || 'api',
      jobId: result?.id || job.id
    }
  }).catch((error) => {
    console.warn('Channel activity log failed:', error.message);
  });
  await appendChannelContactMapping({
    channel,
    contact: String(body?.target || body?.to || body?.chatId || body?.telegramUsername || ''),
    chat_id: String(body?.chatId || body?.telegramChatId || '').trim(),
    username: String(body?.username || body?.telegramUsername || '').trim().replace(/^@/, ''),
    phone: String(body?.phone || body?.to || '').trim(),
    name: String(body?.name || '').trim(),
    thread_id: String(body?.threadId || body?.thread_id || ''),
    payload: body || {},
    metadata: {
      source: body?.source || 'api',
      channel,
      workspaceName: String(body?.workspaceName || 'Work2U').trim() || 'Work2U'
    }
  }).catch((error) => {
    console.warn('Channel contact mapping failed:', error.message);
  });
  return send(res, 200, { queued: true, channel, job: result });
}

async function handleWork2uChannelActivity(req, res, url) {
  if (req.method !== 'GET') return send(res, 405, { error: 'GET only' });
  const limit = Number(url.searchParams.get('limit') || 25);
  const channel = String(url.searchParams.get('channel') || '').trim();
  const direction = String(url.searchParams.get('direction') || '').trim();
  const contact = String(url.searchParams.get('contact') || '').trim();
  return send(res, 200, await listChannelActivity({ limit, channel, direction, contact }));
}

function coreStorePath() {
  return path.join(runtimeDataDir(), 'work2u-core-data.json');
}

function defaultCoreStore() {
  return {
    leads: [],
    clients: [],
    tasks: [],
    cases: [],
    services: []
  };
}

async function ensureCoreStoreDir() {
  await fsp.mkdir(path.dirname(coreStorePath()), { recursive: true });
}

async function readCoreStore() {
  try {
    const raw = await fsp.readFile(coreStorePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return { ...defaultCoreStore(), ...parsed };
  } catch {
    return defaultCoreStore();
  }
}

async function writeCoreStore(store) {
  await ensureCoreStoreDir();
  await fsp.writeFile(coreStorePath(), `${JSON.stringify(store, null, 2)}\n`, 'utf8');
}

function isCoreCollection(name) {
  return ['leads', 'clients', 'tasks', 'cases', 'services'].includes(name);
}

function collectionPrefix(name) {
  return {
    leads: 'lead',
    clients: 'client',
    tasks: 'task',
    cases: 'case',
    services: 'svc'
  }[name] || 'item';
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeCoreContext(item) {
  return {
    workspace_name: item?.workspace_name !== undefined ? String(item.workspace_name) : null,
    workspace_id: item?.workspace_id !== undefined ? item.workspace_id || null : null,
    owner_id: item?.owner_id !== undefined ? item.owner_id || null : null,
    created_by: item?.created_by !== undefined ? item.created_by || null : null,
    updated_by: item?.updated_by !== undefined ? item.updated_by || null : null
  };
}

function normalizeCoreItem(collection, item, fallbackId = null) {
  const id = String(item?.id || fallbackId || `${collectionPrefix(collection)}-${Date.now()}`);
  const createdAt = item?.created_at || item?.createdAt || nowIso();
  const updatedAt = nowIso();
  const base = {
    id,
    created_at: createdAt,
    updated_at: updatedAt
  };

  switch (collection) {
    case 'leads':
      return {
        ...base,
        ...normalizeCoreContext(item),
        name: String(item?.name || 'New Lead'),
        company: String(item?.company || ''),
        stage: String(item?.stage || 'cold'),
        source: String(item?.source || 'WhatsApp'),
        value: Number(item?.value || 0),
        nextFollowUp: String(item?.nextFollowUp || ''),
        note: String(item?.note || '')
      };
    case 'clients':
      return {
        ...base,
        ...normalizeCoreContext(item),
        name: String(item?.name || 'New Client'),
        company: String(item?.company || ''),
        status: String(item?.status || 'active'),
        service: String(item?.service || ''),
        value: Number(item?.value || 0),
        timeline: Array.isArray(item?.timeline) ? item.timeline : []
      };
    case 'tasks':
      return {
        ...base,
        ...normalizeCoreContext(item),
        title: String(item?.title || 'New Task'),
        stage: String(item?.stage || 'todo'),
        progress: Math.max(0, Math.min(100, Number(item?.progress || 0))),
        due: String(item?.due || ''),
        owner: String(item?.owner || '')
      };
    case 'cases':
      return {
        ...base,
        ...normalizeCoreContext(item),
        title: String(item?.title || 'New Case'),
        type: String(item?.type || ''),
        status: String(item?.status || 'open'),
        clientName: String(item?.clientName || ''),
        summary: String(item?.summary || '')
      };
    case 'services':
      return {
        ...base,
        ...normalizeCoreContext(item),
        name: String(item?.name || 'New Service'),
        description: String(item?.description || ''),
        price: Number(item?.price || 0),
        active: item?.active !== false
      };
    default:
      return { ...base, ...normalizeCoreContext(item), ...item };
  }
}

async function handleCoreCollection(req, res, url) {
  const segments = url.pathname.split('/').filter(Boolean);
  const collection = segments[3];
  const itemId = segments[4] || null;
  if (!isCoreCollection(collection)) return false;

  const store = await readCoreStore();
  const list = store[collection] || [];

  if (req.method === 'GET' && !itemId) {
    return send(res, 200, { items: list });
  }

  if (req.method === 'POST' && !itemId) {
    const body = await readBody(req);
    const created = normalizeCoreItem(collection, body || {});
    store[collection] = [created, ...list];
    await writeCoreStore(store);
    return send(res, 201, { item: created });
  }

  if (req.method === 'PATCH' && itemId) {
    const body = await readBody(req);
    const index = list.findIndex((item) => item.id === itemId);
    if (index === -1) return send(res, 404, { error: 'Not found' });
    const updated = normalizeCoreItem(collection, { ...list[index], ...(body || {}) }, itemId);
    list[index] = updated;
    store[collection] = list;
    await writeCoreStore(store);
    return send(res, 200, { item: updated });
  }

  if (req.method === 'DELETE' && itemId) {
    const nextList = list.filter((item) => item.id !== itemId);
    if (nextList.length === list.length) return send(res, 404, { error: 'Not found' });
    store[collection] = nextList;
    await writeCoreStore(store);
    return send(res, 200, { deleted: true });
  }

  return send(res, 405, { error: 'Method not allowed' });
}

async function readBody(req) {
  const raw = await readRawBody(req);
  if (!raw) return null;
  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return null;
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return null;
  return raw;
}

async function serveFile(res, filePath) {
  try {
    const data = await fsp.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream'
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
}

async function handleGoogleLogin(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${appBaseUrl()}/api/auth/google/callback`;
  if (!clientId) return send(res, 500, { error: 'GOOGLE_CLIENT_ID not set' });

  const scopes = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/tasks'
  ].join(' ');

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', scopes);
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('include_granted_scopes', 'true');
  url.searchParams.set('prompt', 'consent');

  redirect(res, url.toString());
}

async function handleGoogleCallback(req, res, url) {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${appBaseUrl()}/api/auth/google/callback`;

  if (error) return redirect(res, `${appBaseUrl()}/crm?gmail_error=${encodeURIComponent(error)}`);
  if (!code || !clientId || !clientSecret) return send(res, 400, { error: 'Missing params' });

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    const tokens = await tokenRes.json();
    if (tokens.error) {
      return redirect(
        res,
        `${appBaseUrl()}/crm?gmail_error=${encodeURIComponent(tokens.error_description || tokens.error)}`
      );
    }

    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000)
    };
    const tokenStr = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    return redirect(res, `${appBaseUrl()}/crm#gmail_token=${tokenStr}`);
  } catch (e) {
    return redirect(res, `${appBaseUrl()}/crm?gmail_error=${encodeURIComponent(e.message)}`);
  }
}

async function handleGroq(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'POST only' }, { 'Access-Control-Allow-Origin': '*' });
  }

  const body = await readBody(req);
  const prompt = body && typeof body === 'object' ? body.prompt : '';
  if (!prompt) return send(res, 400, { error: 'Missing prompt' }, { 'Access-Control-Allow-Origin': '*' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return send(res, 500, { error: 'GROQ_API_KEY not configured' }, { 'Access-Control-Allow-Origin': '*' });

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
            content:
              'You are an AI assistant for Work2U CRM. Help users with task management, lead conversion, accounting, and business strategy. Be concise, friendly, and use Bahasa Malaysia when appropriate.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600
      })
    });

    if (!r.ok) {
      const err = await r.text();
      return send(res, r.status, { error: 'Groq error', detail: err }, { 'Access-Control-Allow-Origin': '*' });
    }

    const data = await r.json();
    return send(
      res,
      200,
      { text: data.choices?.[0]?.message?.content || 'No response' },
      { 'Access-Control-Allow-Origin': '*' }
    );
  } catch (e) {
    return send(res, 500, { error: e.message }, { 'Access-Control-Allow-Origin': '*' });
  }
}

async function handleWhatsAppWebhook(req, res) {
  return handleWork2uChannelWebhook(req, res, 'whatsapp');
}

/* Rewrites live in vercel.json, which only production reads. Local dev used
 * to hardcode a few of them here and miss the rest, so /login, /register,
 * /privacy-policy, and /terms-of-service returned 404 on localhost while
 * working fine once deployed. Reading the same file keeps the two from
 * drifting apart again. */
let vercelRewrites = null;

function loadVercelRewrites() {
  if (vercelRewrites) return vercelRewrites;
  try {
    const raw = fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8');
    const parsed = JSON.parse(raw);
    vercelRewrites = Array.isArray(parsed.rewrites) ? parsed.rewrites : [];
  } catch (err) {
    // A missing or malformed vercel.json must not stop the dev server.
    vercelRewrites = [];
  }
  return vercelRewrites;
}

function applyRewrites(pathname) {
  for (const rule of loadVercelRewrites()) {
    if (!rule || typeof rule.source !== 'string' || typeof rule.destination !== 'string') continue;

    if (rule.source === pathname) return rule.destination;

    // Wildcard form: "/crm/:path*" -> "/crm/:path*"
    const wildcard = rule.source.match(/^(.*?)\/:([A-Za-z_][A-Za-z0-9_]*)\*$/);
    if (wildcard) {
      const [, prefix, param] = wildcard;
      if (pathname.startsWith(prefix + '/')) {
        const rest = pathname.slice(prefix.length + 1);
        return rule.destination.replace(':' + param + '*', rest);
      }
    }
  }
  return pathname;
}

/* Nothing whose path contains a dot-segment may ever be served. Without
 * this, a plain GET /.env.local returned the file — Supabase service role
 * key, Stripe secret, Billplz secret, and Resend key included — and
 * /.git/HEAD exposed the repository. Vercel never shipped those files
 * because .vercelignore excludes them, but `npm start` runs this server,
 * so any plain Node host would have served them straight out. */
function isBlockedPath(pathname) {
  return pathname.split('/').some(
    // .well-known is the one dot-directory that is meant to be public — it
    // carries domain and certificate verification files.
    (segment) => segment.startsWith('.') && segment !== '' && segment !== '.well-known'
  );
}

async function routeStatic(urlPath, res) {
  const clean = applyRewrites(urlPath.split('?')[0]);
  if (isBlockedPath(clean)) return false;
  if (clean === '/' || clean === '') return serveFile(res, path.join(ROOT, 'index.html'));
  if (clean === '/docs' || clean === '/docs/') return serveFile(res, path.join(ROOT, 'docs', 'index.html'));
  if (clean === '/crm' || clean === '/crm/') return serveFile(res, path.join(ROOT, 'crm', 'dashboard.html'));
  if (clean === '/dashboard') return serveFile(res, path.join(ROOT, 'crm', 'dashboard.html'));
  if (clean === '/work2u' || clean === '/work2u/') return serveFile(res, path.join(ROOT, 'work2u', 'index.html'));
  if (clean.startsWith('/crm/')) {
    const rel = clean.replace('/crm/', '');
    /* path.join collapses "..", so this branch could reach outside crm/.
     * The generic branch below already checks containment; this one did
     * not, so it is checked here too rather than trusted. */
    const crmRoot = path.resolve(ROOT, 'crm');
    const target = path.resolve(crmRoot, rel);
    if (target !== crmRoot && !target.startsWith(crmRoot + path.sep)) return false;
    return serveFile(res, target);
  }
  const filePath = path.resolve(ROOT, '.' + clean);
  if (!filePath.startsWith(ROOT_RESOLVED)) return false;
  if (filePath.startsWith(path.join(ROOT_RESOLVED, 'api'))) return false;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(res, filePath);
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, appBaseUrl());
    const pathname = url.pathname;

    if (pathname === '/api/auth/google/login') return handleGoogleLogin(req, res);
    if (pathname === '/api/auth/google/callback') return handleGoogleCallback(req, res, url);
    if (pathname === '/api/ai/groq') return handleGroq(req, res);
    if (pathname === '/api/whatsapp/webhook') return handleWhatsAppWebhook(req, res);
    if (pathname === '/api/work2u/survey') return handleWork2uSurvey(req, res);
    if (pathname === '/api/expense-dashboard') return handleExpenseDashboard(req, res, url, send);
    if (pathname === '/api/expense-receipts') return handleExpenseReceipts(req, res, url, send);
    if (pathname === '/api/public-config') return send(res, 200, publicConfig());
    if (pathname === '/api/work2u/bootstrap') return handleWork2uBootstrap(req, res);
    if (pathname === '/api/work2u/plan-limits') return send(res, 200, work2uPlanLimits());
    if (pathname === '/api/work2u/outbound/jobs') return handleWork2uOutboundJobs(req, res, url);
    if (pathname === '/api/work2u/outbound/jobs/process') return handleWork2uOutboundJobs(req, res, url);
    if (pathname === '/api/work2u/channel/send') return handleWork2uChannelSend(req, res);
    if (pathname === '/api/work2u/channel/activity') return handleWork2uChannelActivity(req, res, url);
    if (pathname === '/api/work2u/channel/webhook') return handleWork2uChannelWebhook(req, res);
    if (pathname === '/api/telegram/webhook') return handleWork2uChannelWebhook(req, res, 'telegram');
    if (pathname === '/api/work2u/email/magic-link') return handleWork2uMagicLinkEmail(req, res);
    if (pathname === '/api/work2u/email/invoice-sent') return handleWork2uInvoiceSentEmail(req, res);
    if (pathname === '/api/work2u/email/payment-reminder') return handleWork2uPaymentReminderEmail(req, res);
    if (pathname === '/api/billing/state') return handleBillingState(req, res, url);
    if (pathname === '/api/billing/checkout') return handleBillingCheckout(req, res);
    if (pathname === '/api/billing/portal') return handleBillingPortal(req, res);
    if (pathname === '/api/billing/webhook') return handleStripeWebhook(req, res);
    if (pathname === '/api/billing/stripe/webhook') return handleStripeWebhook(req, res);
    if (pathname === '/api/billing/billplz/callback') return handleBillplzCallback(req, res, url);
    if (pathname === '/api/billing/billplz/redirect') return handleBillplzRedirect(req, res, url);
    if (pathname.startsWith('/api/work2u/core/')) {
      const handledCore = await handleCoreCollection(req, res, url);
      if (handledCore !== false) return;
    }

    const handled = await routeStatic(pathname, res);
    if (handled !== false) return;

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(err.stack || err.message || 'Server error');
  }
});

server.listen(PORT, () => {
  console.log(`Work2U CRM running at ${appBaseUrl()}`);
  console.log(`Open: ${appBaseUrl()}/ and ${appBaseUrl()}/crm`);
});
