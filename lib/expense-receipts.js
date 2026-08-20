const crypto = require('crypto');
const path = require('path');
const { URL } = require('url');
const { rebuildMonthlyExpenseSnapshot } = require('./expense-dashboard');

const DEFAULT_CURRENCY = 'MYR';

function getSupabaseRestBase() {
  if (process.env.SUPABASE_URL) return String(process.env.SUPABASE_URL).replace(/\/+$/, '');
  if (process.env.SUPABASE_PROJECT_ID) {
    return `https://${String(process.env.SUPABASE_PROJECT_ID).replace(/[^a-z0-9-]/gi, '')}.supabase.co`;
  }
  return '';
}

function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

function getSupabaseStorageBase() {
  if (process.env.SUPABASE_URL) return String(process.env.SUPABASE_URL).replace(/\/+$/, '');
  if (process.env.SUPABASE_PROJECT_ID) {
    return `https://${String(process.env.SUPABASE_PROJECT_ID).replace(/[^a-z0-9-]/gi, '')}.supabase.co`;
  }
  return '';
}

function getStorageBucketName() {
  return String(process.env.SUPABASE_STORAGE_BUCKET_RECEIPTS || 'expense-receipts').trim() || 'expense-receipts';
}

function isTruthyEnv(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());
}

function isPublicReceiptBucket() {
  return isTruthyEnv(process.env.SUPABASE_STORAGE_BUCKET_RECEIPTS_PUBLIC);
}

function getOpenAiApiKey() {
  return String(process.env.OPENAI_API_KEY || '').trim();
}

function getOpenAiReceiptModel() {
  return String(process.env.OPENAI_RECEIPT_MODEL || 'gpt-4.1-mini').trim() || 'gpt-4.1-mini';
}

function supabaseAdminHeaders(extra = {}) {
  const key = getSupabaseServiceRoleKey();
  if (!key) return null;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...extra
  };
}

async function supabaseRest(pathname, { method = 'GET', query = {}, body = null } = {}) {
  const base = getSupabaseRestBase();
  const headers = supabaseAdminHeaders(body ? { Prefer: 'return=representation' } : {});
  if (!base || !headers) return null;

  const url = new URL(`${base}/rest/v1/${String(pathname).replace(/^\/+/, '')}`);
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
    const detail = data?.message || data?.error || text || `Supabase REST ${response.status}`;
    throw new Error(detail);
  }

  return data;
}

async function supabaseStorageUpload({ bucket, objectPath, fileBuffer, mimeType }) {
  const base = getSupabaseStorageBase();
  const headers = supabaseAdminHeaders({
    'Content-Type': mimeType || 'application/octet-stream',
    'x-upsert': 'true'
  });
  if (!base || !headers) return null;

  const uploadUrl = `${base}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath.split('/').map(encodeURIComponent).join('/')}`;
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers,
    body: fileBuffer
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const detail = data?.message || data?.error || text || `Supabase Storage ${response.status}`;
    throw new Error(detail);
  }

  return {
    data,
    uploadUrl
  };
}

function decodeDataUrl(input) {
  const raw = String(input || '').trim();
  if (!raw) return null;

  const dataUrlMatch = raw.match(/^data:([^;]+);base64,(.+)$/i);
  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1] || 'application/octet-stream',
      buffer: Buffer.from(dataUrlMatch[2], 'base64')
    };
  }

  const base64Only = raw.replace(/\s+/g, '');
  if (/^[A-Za-z0-9+/=]+$/.test(base64Only) && base64Only.length % 4 === 0) {
    return {
      mimeType: 'application/octet-stream',
      buffer: Buffer.from(base64Only, 'base64')
    };
  }

  return null;
}

function sanitizeFileName(fileName) {
  const base = path.basename(String(fileName || 'receipt').trim() || 'receipt');
  return base.replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-').replace(/^\-+|\-+$/g, '') || 'receipt';
}

function buildReceiptStoragePath({ workspaceId, fileName }) {
  const now = new Date();
  const datePrefix = now.toISOString().slice(0, 10);
  const random = crypto.randomBytes(4).toString('hex');
  const safeName = sanitizeFileName(fileName);
  return `${String(workspaceId || 'workspace').replace(/[^a-z0-9_-]/gi, '').slice(0, 64)}/${datePrefix}/${now.getTime()}-${random}-${safeName}`;
}

function buildReceiptFileUrl({ bucket, objectPath }) {
  const base = getSupabaseStorageBase();
  const encodedPath = objectPath.split('/').map(encodeURIComponent).join('/');
  if (!base) return `storage://${bucket}/${objectPath}`;
  if (isPublicReceiptBucket()) {
    return `${base}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
  }
  return `${base}/storage/v1/object/authenticated/${encodeURIComponent(bucket)}/${encodedPath}`;
}

function parseReceiptStorageReference(fileUrl) {
  const raw = String(fileUrl || '').trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const pathname = url.pathname.replace(/\/+$/, '');
    const authMatch = pathname.match(/\/storage\/v1\/object\/(?:authenticated|public)\/([^/]+)\/(.+)$/i);
    if (authMatch) {
      const bucket = decodeURIComponent(authMatch[1] || '').trim();
      const objectPath = authMatch[2].split('/').map((segment) => decodeURIComponent(segment)).join('/');
      return bucket && objectPath ? { bucket, objectPath } : null;
    }

    const signMatch = pathname.match(/\/storage\/v1\/object\/sign\/([^/]+)\/(.+)$/i);
    if (signMatch) {
      const bucket = decodeURIComponent(signMatch[1] || '').trim();
      const objectPath = signMatch[2].split('/').map((segment) => decodeURIComponent(segment)).join('/');
      return bucket && objectPath ? { bucket, objectPath } : null;
    }
  } catch {
    return null;
  }

  return null;
}

async function supabaseStorageSign({ bucket, objectPath, expiresIn = 600 }) {
  const base = getSupabaseStorageBase();
  const headers = supabaseAdminHeaders({
    'Content-Type': 'application/json'
  });
  if (!base || !headers) return null;

  const signUrl = `${base}/storage/v1/object/sign/${encodeURIComponent(bucket)}/${objectPath.split('/').map(encodeURIComponent).join('/')}`;
  const response = await fetch(signUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      expiresIn
    })
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const detail = data?.message || data?.error || text || `Supabase Storage sign ${response.status}`;
    throw new Error(detail);
  }

  return data;
}

async function supabaseStorageDelete({ bucket, objectPath }) {
  const base = getSupabaseStorageBase();
  const headers = supabaseAdminHeaders();
  if (!base || !headers) return null;

  const deleteUrl = `${base}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath.split('/').map(encodeURIComponent).join('/')}`;
  const response = await fetch(deleteUrl, {
    method: 'DELETE',
    headers
  });

  if (!response.ok && response.status !== 200 && response.status !== 204) {
    const text = await response.text();
    throw new Error(text || `Supabase Storage delete ${response.status}`);
  }

  return true;
}

function buildSignedDownloadUrl(fileUrl, signedUrl) {
  const target = String(signedUrl || '').trim();
  if (!target) return '';
  if (target.includes('?')) return `${target}&download=1`;
  return `${target}?download=1`;
}

function normalizeTagList(input) {
  const raw = Array.isArray(input) ? input.join(' ') : String(input || '');
  return [...new Set(
    raw
      .split(/[\s,]+/)
      .map((item) => item.replace(/^#+/, '').trim().toLowerCase())
      .filter(Boolean)
  )];
}

function mergeReceiptNotesWithTags(notes, tags) {
  const cleanTags = normalizeTagList(tags);
  const base = String(notes || '').trim();
  if (!cleanTags.length) return base || null;

  const lines = base
    ? base.split('\n').map((line) => line.trim()).filter(Boolean).filter((line) => !/^tags\s*:/i.test(line))
    : [];
  lines.push(`Tags: ${cleanTags.map((tag) => `#${tag}`).join(' ')}`);
  return lines.join('\n');
}

function getFileInputFromBody(body) {
  const rawData = body.fileDataUrl || body.file_data_url || body.fileBase64 || body.file_base64 || body.fileData || body.file_data || '';
  const decoded = decodeDataUrl(rawData);
  if (!decoded) return null;
  const mimeType = String(body.mimeType || body.mime_type || decoded.mimeType || 'application/octet-stream').trim() || decoded.mimeType;
  return {
    mimeType,
    buffer: decoded.buffer
  };
}

function isImageMimeType(mimeType) {
  return /^image\//i.test(String(mimeType || '').trim());
}

function isPdfMimeType(mimeType) {
  return String(mimeType || '').toLowerCase() === 'application/pdf';
}

function extractJsonFromText(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function extractOpenAiText(response) {
  if (!response || typeof response !== 'object') return '';
  if (typeof response.output_text === 'string' && response.output_text.trim()) return response.output_text;
  const parts = [];
  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === 'string') parts.push(content.text);
    }
  }
  return parts.join('\n').trim();
}

function normalizeAiExtraction(result = {}) {
  const vendorName = normalizeText(result.vendorName || result.vendor_name || result.merchantName || result.merchant_name || '');
  const receiptDate = String(result.receiptDate || result.receipt_date || '').trim();
  const totalAmount = toNumber(result.totalAmount ?? result.total_amount ?? result.amount ?? 0);
  const taxAmount = toNumber(result.taxAmount ?? result.tax_amount ?? 0);
  const currency = String(result.currency || DEFAULT_CURRENCY).trim() || DEFAULT_CURRENCY;
  const expenseType = String(result.expenseType || result.expense_type || '').trim();
  const receiptNumber = String(result.receiptNumber || result.receipt_number || '').trim();
  const notes = String(result.notes || result.summary || '').trim();
  const rawText = normalizeText(result.rawText || result.ocrText || result.text || '');
  const confidenceScore = clampConfidence(result.confidenceScore ?? result.confidence ?? 0);

  return {
    vendorName,
    receiptDate,
    totalAmount,
    taxAmount,
    currency,
    expenseType,
    receiptNumber,
    notes,
    rawText,
    confidenceScore,
    extractedJson: result.extractedJson && typeof result.extractedJson === 'object' ? result.extractedJson : { ...result }
  };
}

async function callOpenAiReceiptExtraction({ fileName, mimeType, fileBuffer }) {
  const apiKey = getOpenAiApiKey();
  if (!apiKey || !fileBuffer || !fileBuffer.length) return null;

  const model = getOpenAiReceiptModel();
  const isImage = isImageMimeType(mimeType);
  const isPdf = isPdfMimeType(mimeType);
  if (!isImage && !isPdf) return null;

  const dataUrl = `data:${mimeType || 'application/octet-stream'};base64,${fileBuffer.toString('base64')}`;
  const schema = {
    type: 'object',
    additionalProperties: true,
    properties: {
      vendorName: { type: 'string' },
      receiptDate: { type: 'string' },
      receiptNumber: { type: 'string' },
      currency: { type: 'string' },
      totalAmount: { type: 'number' },
      taxAmount: { type: 'number' },
      expenseType: { type: 'string' },
      notes: { type: 'string' },
      rawText: { type: 'string' },
      confidenceScore: { type: 'number' },
      extractedJson: { type: 'object' }
    }
  };

  const content = [
    {
      type: 'input_text',
      text:
        'You are an OCR assistant for Work2U receipts. Read the file and return strict JSON with vendorName, receiptDate in YYYY-MM-DD if possible, receiptNumber, currency, totalAmount, taxAmount, expenseType, notes, rawText, confidenceScore from 0 to 100, and extractedJson. Prefer conservative values. If a field is missing, return an empty string or 0.'
    }
  ];

  if (isImage) {
    content.push({
      type: 'input_image',
      detail: 'high',
      image_url: dataUrl
    });
  } else if (isPdf) {
    content.push({
      type: 'input_file',
      detail: 'high',
      file_data: fileBuffer.toString('base64'),
      filename: fileName || 'receipt.pdf'
    });
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      store: false,
      input: [
        {
          role: 'user',
          content
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'work2u_receipt_extraction',
          strict: true,
          schema
        }
      },
      max_output_tokens: 900
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
    const detail = data?.error?.message || data?.message || raw || `OpenAI OCR failed with status ${response.status}`;
    throw new Error(detail);
  }

  const outputText = extractOpenAiText(data);
  const parsed = extractJsonFromText(outputText) || {};
  return normalizeAiExtraction(parsed);
}

async function readBody(req) {
  if (req && typeof req.body === 'object' && req.body !== null) return req.body;
  if (req && typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return await new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 2 * 1024 * 1024) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function normalizeMonthKey(input) {
  const raw = String(input || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) return null;
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return `${match[1]}-${match[2]}-01`;
}

function currentMonthKey() {
  return new Date().toISOString().slice(0, 7) + '-01';
}

function currentDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function round2(value) {
  const num = Number(value);
  return Math.round((Number.isFinite(num) ? num : 0) * 100) / 100;
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function clampConfidence(value) {
  return Math.max(0, Math.min(100, round2(value)));
}

function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function guessVendor(body, rawText) {
  const direct = normalizeText(body.vendorName || body.vendor_name || '');
  if (direct) return direct;

  const text = normalizeText(rawText);
  if (!text) return 'Unknown';
  const words = text.split(' ').filter(Boolean);
  if (!words.length) return 'Unknown';
  return words.slice(0, Math.min(words.length, 3)).join(' ');
}

function guessDate(body, rawText) {
  const direct = String(body.receiptDate || body.receipt_date || '').trim();
  if (normalizeMonthKey(direct)) return direct.slice(0, 10);

  const text = String(rawText || '');
  const patterns = [
    /\b(\d{4}-\d{2}-\d{2})\b/,
    /\b(\d{2}\/\d{2}\/\d{4})\b/,
    /\b(\d{2}-\d{2}-\d{4})\b/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = match[1];
      if (value.includes('/')) {
        const [d, m, y] = value.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
      if (value.includes('-') && value.length === 10) {
        const parts = value.split('-');
        if (parts[0].length === 4) return value;
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return value;
    }
  }

  return currentDateKey();
}

function guessAmount(body, rawText) {
  const direct = toNumber(body.totalAmount ?? body.total_amount ?? body.amount);
  if (direct > 0) return round2(direct);

  const text = String(rawText || '');
  const matches = [];
  const moneyRegex = /(?:RM|MYR|S\$|\$)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/gi;
  let match;
  while ((match = moneyRegex.exec(text))) {
    const value = toNumber(match[1].replace(/,/g, ''));
    if (value > 0) matches.push(value);
  }
  if (!matches.length) return 0;
  return round2(Math.max(...matches));
}

function guessTax(body, rawText, totalAmount) {
  const direct = toNumber(body.taxAmount ?? body.tax_amount);
  if (direct >= 0) return round2(direct);

  const text = String(rawText || '');
  const taxMatch = text.match(/(?:tax|sst|gst)\s*[:=]?\s*(?:RM|MYR)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i);
  if (taxMatch) return round2(toNumber(taxMatch[1].replace(/,/g, '')));

  if (totalAmount > 0) return 0;
  return 0;
}

function buildDuplicateHash({ workspaceId, vendorName, receiptDate, totalAmount, fileName }) {
  return crypto
    .createHash('sha256')
    .update([workspaceId, vendorName, receiptDate, totalAmount, fileName].join('|'))
    .digest('hex');
}

function inferExpenseType(body, vendorName, rawText) {
  const direct = String(body.expenseType || body.expense_type || '').trim();
  if (direct) return direct;

  const text = `${vendorName} ${rawText || ''}`.toLowerCase();
  if (text.includes('travel') || text.includes('grab') || text.includes('fuel') || text.includes('petrol')) return 'travel';
  if (text.includes('software') || text.includes('subscription') || text.includes('license')) return 'subscription';
  if (text.includes('marketing') || text.includes('ads')) return 'marketing';
  if (text.includes('office') || text.includes('stationery')) return 'other';
  return 'direct';
}

function buildExtraction(body, receiptDate, vendorName, totalAmount, taxAmount, currency, rawText, options = {}) {
  const confidenceScore = Number.isFinite(Number(options.confidenceScore))
    ? clampConfidence(options.confidenceScore)
    : null;
  const confidenceBits = [
    vendorName && vendorName !== 'Unknown' ? 25 : 0,
    totalAmount > 0 ? 25 : 0,
    receiptDate ? 15 : 0,
    rawText ? Math.min(20, Math.round(String(rawText).length / 20)) : 0,
    body.fileName ? 5 : 0
  ];

  const finalConfidence = confidenceScore === null ? clampConfidence(confidenceBits.reduce((sum, item) => sum + item, 0)) : confidenceScore;
  const subtotalAmount = round2(Math.max(0, totalAmount - taxAmount));
  const vendorNormalizedName = normalizeText(vendorName).toLowerCase();

  return {
    vendorName,
    vendorNormalizedName,
    receiptDate,
    subtotalAmount,
    taxAmount,
    totalAmount,
    currency,
    confidenceScore: finalConfidence,
    rawText: normalizeText(rawText),
    extractedJson: {
      vendorName,
      vendorNormalizedName,
      receiptDate,
      subtotalAmount,
      taxAmount,
      totalAmount,
      currency,
      confidenceScore: finalConfidence,
      source: options.source || 'heuristic-scaffold'
    }
  };
}

async function loadWorkspaceContext(workspaceId) {
  try {
    const rows = await supabaseRest('workspaces', {
      query: {
        select: 'id,owner_id,name,region,package',
        id: `eq.${workspaceId}`,
        limit: '1'
      }
    });
    return Array.isArray(rows) ? rows[0] || null : null;
  } catch (error) {
    if (!/workspaces/i.test(error.message || '')) throw error;
    return {
      id: workspaceId,
      owner_id: String(process.env.WORK2U_DEFAULT_OWNER_ID || '').trim() || null,
      name: String(process.env.WORK2U_DEFAULT_WORKSPACE_NAME || 'Work2U Studio').trim() || 'Work2U Studio',
      region: String(process.env.WORK2U_DEFAULT_REGION || 'Malaysia').trim() || 'Malaysia',
      package: String(process.env.WORK2U_DEFAULT_PACKAGE || 'Starter').trim() || 'Starter'
    };
  }
}

function normalizeFileUrl(body, fileName) {
  const explicit = String(body.fileUrl || body.file_url || '').trim();
  if (explicit) return explicit;
  return `pending://${encodeURIComponent(fileName || 'receipt')}`;
}

async function persistExtraction({ receiptId, workspaceId, ownerId, extracted, provider = 'work2u', modelName = 'receipt-scaffold' }) {
  const extractionRow = {
    id: crypto.randomUUID(),
    workspace_id: workspaceId,
    expense_receipt_id: receiptId,
    model_provider: String(provider || process.env.EXPENSE_OCR_PROVIDER || 'work2u'),
    model_name: String(modelName || 'receipt-scaffold'),
    prompt_version: 'v1',
    raw_text: extracted.rawText || '',
    extracted_json: extracted.extractedJson,
    confidence_score: extracted.confidenceScore,
    review_status: 'draft',
    applied_by: null,
    applied_at: null,
    created_by: ownerId
  };

  const inserted = await supabaseRest('expense_receipt_extractions', {
    method: 'POST',
    query: { select: '*' },
    body: extractionRow
  });

  return Array.isArray(inserted) ? inserted[0] || extractionRow : extractionRow;
}

async function persistReceiptEvent({
  receiptId,
  workspaceId,
  ownerId = null,
  eventType = 'receipt.updated',
  eventLabel = null,
  eventStatus = null,
  eventSource = 'system',
  eventDetails = {},
  createdAt = null
}) {
  const eventRow = {
    id: crypto.randomUUID(),
    workspace_id: workspaceId,
    expense_receipt_id: receiptId,
    event_type: String(eventType || 'receipt.updated').trim() || 'receipt.updated',
    event_label: eventLabel ? String(eventLabel).trim() : null,
    event_status: eventStatus ? String(eventStatus).trim() : null,
    event_source: String(eventSource || 'system').trim() || 'system',
    event_details: eventDetails && typeof eventDetails === 'object' ? eventDetails : {},
    created_by: ownerId || null,
    created_at: createdAt || new Date().toISOString()
  };

  try {
    const inserted = await supabaseRest('expense_receipt_events', {
      method: 'POST',
      query: { select: '*' },
      body: eventRow
    });
    return Array.isArray(inserted) ? inserted[0] || eventRow : eventRow;
  } catch (error) {
    return {
      ...eventRow,
      _error: error?.message || 'Unable to persist receipt event'
    };
  }
}

async function storeReceiptFile({ workspaceId, body, fileName }) {
  const fileInput = getFileInputFromBody(body);
  if (!fileInput || !fileInput.buffer || !fileInput.buffer.length) {
    const explicitUrl = String(body.fileUrl || body.file_url || '').trim();
    return {
      fileName: fileName || sanitizeFileName(explicitUrl.split('/').pop() || 'receipt'),
      fileUrl: normalizeFileUrl(body, fileName),
      storagePath: null,
      mimeType: String(body.mimeType || body.mime_type || 'application/octet-stream').trim() || 'application/octet-stream',
      fileSize: Number(body.fileSize || body.file_size || 0) || null,
      uploaded: false
    };
  }

  const bucket = getStorageBucketName();
  const storagePath = buildReceiptStoragePath({
    workspaceId,
    fileName: fileName || body.fileName || body.file_name || 'receipt'
  });
  let uploaded = false;
  let uploadError = null;
  try {
    const uploadResult = await supabaseStorageUpload({
      bucket,
      objectPath: storagePath,
      fileBuffer: fileInput.buffer,
      mimeType: fileInput.mimeType
    });
    uploaded = Boolean(uploadResult);
  } catch (error) {
    uploadError = error.message || 'Storage upload failed';
  }

  return {
    fileName: fileName || sanitizeFileName(body.fileName || body.file_name || 'receipt'),
    fileUrl: uploaded ? buildReceiptFileUrl({ bucket, objectPath: storagePath }) : normalizeFileUrl(body, fileName),
    storagePath,
    mimeType: fileInput.mimeType,
    fileSize: fileInput.buffer.length,
    uploaded,
    uploadError,
    fileBuffer: fileInput.buffer
  };
}

function mergeReceiptValues({ body, aiExtraction, rawText, fallbackVendor, fallbackDate, fallbackAmount, fallbackTax, fallbackCurrency }) {
  const ai = aiExtraction || {};
  const vendorName = normalizeText(body.vendorName || body.vendor_name || ai.vendorName || fallbackVendor || 'Unknown') || 'Unknown';
  const receiptDate = String(body.receiptDate || body.receipt_date || ai.receiptDate || fallbackDate || currentDateKey()).trim().slice(0, 10);
  const totalAmount = toNumber(body.totalAmount ?? body.total_amount ?? ai.totalAmount ?? fallbackAmount ?? 0);
  const taxAmount = toNumber(body.taxAmount ?? body.tax_amount ?? ai.taxAmount ?? fallbackTax ?? 0);
  const currency = String(body.currency || ai.currency || fallbackCurrency || DEFAULT_CURRENCY).trim() || DEFAULT_CURRENCY;
  const expenseType = String(body.expenseType || body.expense_type || ai.expenseType || inferExpenseType(body, vendorName, rawText)).trim() || 'direct';
  const receiptNumber = String(body.receiptNumber || body.receipt_number || ai.receiptNumber || '').trim() || null;
  const notes = String(body.notes || ai.notes || '').trim() || null;
  const ocrText = normalizeText(body.ocrText || body.rawText || ai.rawText || '');
  const confidenceScore = Number.isFinite(Number(ai.confidenceScore)) && Number(ai.confidenceScore) > 0
    ? clampConfidence(ai.confidenceScore)
    : null;

  return {
    vendorName,
    receiptDate,
    totalAmount,
    taxAmount,
    currency,
    expenseType,
    receiptNumber,
    notes,
    ocrText,
    confidenceScore
  };
}

function buildReceiptTimeline(receipt, events = []) {
  const timeline = [];
  const pushTimelineEvent = (item) => {
    if (!item || !item.at) return;
    timeline.push({
      id: item.id || null,
      type: item.type || 'receipt.updated',
      label: item.label || 'Receipt update',
      status: item.status || null,
      source: item.source || 'system',
      at: item.at,
      details: item.details && typeof item.details === 'object' ? item.details : {}
    });
  };
  const hasEventType = (type) => Array.isArray(events)
    ? events.some((event) => String(event?.event_type || '').trim() === type)
    : false;

  const sortedEvents = Array.isArray(events)
    ? events.slice().sort((a, b) => new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0))
    : [];

  sortedEvents.forEach((event) => {
    pushTimelineEvent({
      id: event.id,
      type: event.event_type,
      label: event.event_label || event.event_type,
      status: event.event_status,
      source: event.event_source,
      at: event.created_at,
      details: event.event_details || {}
    });
  });

  if (!hasEventType('receipt.created') && receipt) {
    pushTimelineEvent({
      id: receipt.id,
      type: 'receipt.created',
      label: 'Receipt created',
      status: receipt.review_status || 'pending',
      source: 'system',
      at: receipt.created_at,
      details: {
        fileName: receipt.file_name || null,
        vendorName: receipt.vendor_name || null
      }
    });
  }

  if (receipt && receipt.file_url && !hasEventType('receipt.uploaded')) {
    pushTimelineEvent({
      id: `${receipt.id}:file`,
      type: 'receipt.uploaded',
      label: 'Receipt file attached',
      status: receipt.ocr_status || 'pending',
      source: 'system',
      at: receipt.updated_at || receipt.created_at,
      details: {
        fileName: receipt.file_name || null,
        mimeType: receipt.mime_type || null
      }
    });
  }

  if (receipt && receipt.raw_text && !hasEventType('receipt.ocr_completed')) {
    pushTimelineEvent({
      id: `${receipt.id}:ocr`,
      type: 'receipt.ocr_completed',
      label: 'OCR completed',
      status: receipt.ocr_status || 'complete',
      source: 'work2u',
      at: receipt.updated_at || receipt.created_at,
      details: {
        ocrConfidence: receipt.ocr_confidence || 0
      }
    });
  }

  if (receipt && receipt.review_status && receipt.review_status !== 'pending' && !hasEventType('receipt.reviewed')) {
    pushTimelineEvent({
      id: `${receipt.id}:review`,
      type: 'receipt.reviewed',
      label: `Receipt ${receipt.review_status}`,
      status: receipt.review_status,
      source: 'review',
      at: receipt.reviewed_at || receipt.updated_at || receipt.created_at,
      details: {
        reviewedBy: receipt.reviewed_by || null
      }
    });
  }

  return timeline
    .filter((item, index, list) => list.findIndex((candidate) => candidate.type === item.type && candidate.at === item.at && candidate.label === item.label) === index)
    .sort((a, b) => new Date(a.at) - new Date(b.at));
}

async function createReceipt(body) {
  const workspaceId = String(body.workspaceId || body.workspace_id || '').trim();
  if (!workspaceId) {
    return {
      status: 400,
      body: { success: false, error: { code: 'MISSING_WORKSPACE', message: 'workspaceId is required' } }
    };
  }

  const workspace = await loadWorkspaceContext(workspaceId);
  if (!workspace) {
    return {
      status: 404,
      body: { success: false, error: { code: 'WORKSPACE_NOT_FOUND', message: 'workspace not found in Supabase' } }
    };
  }

  const ownerId = String(body.ownerId || body.owner_id || workspace.owner_id || '').trim();
  if (!ownerId) {
    return {
      status: 400,
      body: { success: false, error: { code: 'MISSING_OWNER', message: 'ownerId is required or must exist on workspace' } }
    };
  }

  const fileName = sanitizeFileName(body.fileName || body.file_name || 'receipt');
  const storedFile = await storeReceiptFile({ workspaceId, body, fileName });
  const aiExtraction = storedFile.fileBuffer
    ? await callOpenAiReceiptExtraction({
        fileName: storedFile.fileName,
        mimeType: storedFile.mimeType,
        fileBuffer: storedFile.fileBuffer
      }).catch(() => null)
    : null;
  const fallbackRawText = normalizeText(body.ocrText || body.rawText || body.receiptText || aiExtraction?.rawText || '');
  const fallbackVendor = guessVendor(body, fallbackRawText);
  const fallbackDate = guessDate(body, fallbackRawText);
  const fallbackAmount = guessAmount(body, fallbackRawText);
  const fallbackTax = guessTax(body, fallbackRawText, fallbackAmount);
  const fallbackCurrency = String(body.currency || aiExtraction?.currency || DEFAULT_CURRENCY).trim() || DEFAULT_CURRENCY;
  const merged = mergeReceiptValues({
    body,
    aiExtraction,
    rawText: fallbackRawText,
    fallbackVendor,
    fallbackDate,
    fallbackAmount,
    fallbackTax,
    fallbackCurrency
  });
  const receiptDate = merged.receiptDate;
  const vendorName = merged.vendorName;
  const totalAmount = merged.totalAmount;
  const taxAmount = merged.taxAmount;
  const currency = merged.currency;
  const expenseType = merged.expenseType;
  const categoryId = String(body.categoryId || body.category_id || '').trim() || null;
  const expenseMonth = normalizeMonthKey(body.expenseMonth || body.expense_month || receiptDate) || currentMonthKey();
  const sourceChannel = String(body.sourceChannel || body.source_channel || 'upload').trim() || 'upload';
  const paymentMethod = String(body.paymentMethod || body.payment_method || '').trim() || null;
  const reviewStatus = String(body.reviewStatus || body.review_status || 'pending').trim() || 'pending';
  const duplicateHash = String(body.duplicateHash || body.duplicate_hash || buildDuplicateHash({
    workspaceId,
    vendorName,
    receiptDate,
    totalAmount,
    fileName
  })).trim();

  const rawText = merged.ocrText || fallbackRawText || '';
  const extracted = buildExtraction(
    body,
    receiptDate,
    vendorName,
    totalAmount,
    taxAmount,
    currency,
    rawText,
    {
      confidenceScore: merged.confidenceScore || aiExtraction?.confidenceScore || undefined,
      source: aiExtraction ? 'openai-responses' : 'heuristic-scaffold'
    }
  );
  const receiptRow = {
    id: crypto.randomUUID(),
    workspace_id: workspaceId,
    owner_id: ownerId,
    category_id: categoryId,
    source_channel: sourceChannel,
    expense_month: expenseMonth,
    vendor_name: vendorName,
    vendor_normalized_name: extracted.vendorNormalizedName,
    receipt_number: String(body.receiptNumber || body.receipt_number || '').trim() || null,
    receipt_date: receiptDate,
    currency,
    subtotal_amount: extracted.subtotalAmount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    payment_method: paymentMethod,
    expense_type: expenseType,
    ocr_status: rawText ? 'complete' : 'pending',
    review_status,
    ocr_provider: String(body.ocrProvider || body.ocr_provider || (aiExtraction ? 'openai' : 'work2u')).trim(),
    ocr_confidence: extracted.confidenceScore,
    raw_text: rawText || null,
    extracted_data: extracted.extractedJson,
    duplicate_hash: duplicateHash,
    file_name: storedFile.fileName || fileName,
    file_url: storedFile.fileUrl || normalizeFileUrl(body, fileName),
    mime_type: String(body.mimeType || body.mime_type || storedFile.mimeType || 'application/octet-stream').trim(),
    file_size: Number(body.fileSize || body.file_size || storedFile.fileSize || 0) || null,
    notes: merged.notes,
    reviewed_by: reviewStatus !== 'pending' ? ownerId : null,
    reviewed_at: reviewStatus !== 'pending' ? new Date().toISOString() : null,
    created_by: ownerId,
    updated_by: ownerId
  };

  const inserted = await supabaseRest('expense_receipts', {
    method: 'POST',
    query: { select: '*' },
    body: receiptRow
  });

  const savedReceipt = Array.isArray(inserted) ? inserted[0] || receiptRow : receiptRow;
  await persistReceiptEvent({
    receiptId: savedReceipt.id,
    workspaceId,
    ownerId,
    eventType: 'receipt.created',
    eventLabel: 'Receipt created',
    eventStatus: savedReceipt.review_status || 'pending',
    eventSource: storedFile.uploaded ? 'upload' : 'manual',
    eventDetails: {
      vendorName: savedReceipt.vendor_name,
      fileName: savedReceipt.file_name,
      fileUrl: storedFile.fileUrl || null,
      uploaded: Boolean(storedFile.uploaded)
    }
  });
  if (storedFile.uploaded) {
    await persistReceiptEvent({
      receiptId: savedReceipt.id,
      workspaceId,
      ownerId,
      eventType: 'receipt.uploaded',
      eventLabel: 'Receipt file uploaded',
      eventStatus: savedReceipt.ocr_status || 'pending',
      eventSource: 'upload',
      eventDetails: {
        storagePath: storedFile.storagePath || null,
        fileName: savedReceipt.file_name,
        mimeType: savedReceipt.mime_type || null,
        fileSize: savedReceipt.file_size || null
      }
    });
  }
  const savedExtraction = rawText
    ? await persistExtraction({
        receiptId: savedReceipt.id,
        workspaceId,
        ownerId,
        extracted,
        provider: aiExtraction ? 'openai' : 'work2u',
        modelName: aiExtraction ? getOpenAiReceiptModel() : 'heuristic-scaffold'
      })
    : null;
  if (savedExtraction) {
    await persistReceiptEvent({
      receiptId: savedReceipt.id,
      workspaceId,
      ownerId,
      eventType: 'receipt.ocr_completed',
      eventLabel: 'OCR extraction saved',
      eventStatus: savedReceipt.ocr_status || 'complete',
      eventSource: aiExtraction ? 'openai' : 'work2u',
      eventDetails: {
        modelProvider: savedExtraction.model_provider || null,
        modelName: savedExtraction.model_name || null,
        confidenceScore: extracted.confidenceScore || savedExtraction.confidence_score || 0
      }
    });
  }
  await rebuildMonthlyExpenseSnapshot({
    workspaceId,
    monthInput: savedReceipt.expense_month || expenseMonth || receiptDate,
    includeInsights: false,
    generatedBy: ownerId || 'system'
  }).catch(() => {});

  return {
    status: 200,
    body: {
      success: true,
      data: {
        receipt: savedReceipt,
        extraction: savedExtraction,
        storage: {
          uploaded: Boolean(storedFile.uploaded),
          storagePath: storedFile.storagePath || null,
          uploadError: storedFile.uploadError || null
        },
        nextSteps: rawText
          ? ['review extracted values', 'approve receipt if values are correct']
          : ['upload receipt file to storage', 'trigger OCR extraction when text is available']
      }
    }
  };
}

async function extractReceipt(body) {
  const workspaceId = String(body.workspaceId || body.workspace_id || '').trim();
  const receiptId = String(body.receiptId || body.receipt_id || body.id || '').trim();
  if (!workspaceId || !receiptId) {
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: 'MISSING_ARGS',
          message: 'workspaceId and receiptId are required for extraction'
        }
      }
    };
  }

  const workspace = await loadWorkspaceContext(workspaceId);
  if (!workspace) {
    return {
      status: 404,
      body: { success: false, error: { code: 'WORKSPACE_NOT_FOUND', message: 'workspace not found in Supabase' } }
    };
  }

  const receiptRows = await supabaseRest('expense_receipts', {
    query: {
      select: '*',
      id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`,
      limit: '1'
    }
  });
  const receipt = Array.isArray(receiptRows) ? receiptRows[0] || null : null;
  if (!receipt) {
    return {
      status: 404,
      body: { success: false, error: { code: 'NOT_FOUND', message: 'receipt not found' } }
    };
  }

  const ownerId = String(body.ownerId || body.owner_id || receipt.owner_id || workspace.owner_id || '').trim();
  const fileName = sanitizeFileName(body.fileName || receipt.file_name || 'receipt');
  const storedFile = await storeReceiptFile({
    workspaceId,
    body: {
      ...body,
      fileName,
      fileUrl: receipt.file_url
    },
    fileName
  }).catch(() => ({
    fileName,
    fileUrl: receipt.file_url,
    storagePath: null,
    mimeType: receipt.mime_type || 'application/octet-stream',
    fileSize: receipt.file_size || null,
    uploaded: false,
    fileBuffer: null
  }));
  const aiExtraction = storedFile.fileBuffer
    ? await callOpenAiReceiptExtraction({
        fileName: storedFile.fileName,
        mimeType: storedFile.mimeType,
        fileBuffer: storedFile.fileBuffer
      }).catch(() => null)
    : null;
  const rawText = normalizeText(body.ocrText || body.rawText || body.receiptText || aiExtraction?.rawText || receipt.raw_text || '');
  const merged = mergeReceiptValues({
    body: { ...body, vendorName: body.vendorName || receipt.vendor_name, currency: body.currency || receipt.currency },
    aiExtraction,
    rawText,
    fallbackVendor: guessVendor({ vendorName: body.vendorName || receipt.vendor_name }, rawText),
    fallbackDate: guessDate(body, rawText) || receipt.receipt_date || currentMonthKey(),
    fallbackAmount: guessAmount({ totalAmount: body.totalAmount ?? receipt.total_amount }, rawText) || toNumber(receipt.total_amount),
    fallbackTax: guessTax(body, rawText, toNumber(receipt.total_amount)),
    fallbackCurrency: String(body.currency || receipt.currency || DEFAULT_CURRENCY).trim() || DEFAULT_CURRENCY
  });
  const vendorName = merged.vendorName;
  const receiptDate = merged.receiptDate || receipt.receipt_date || currentMonthKey();
  const totalAmount = merged.totalAmount || toNumber(receipt.total_amount);
  const taxAmount = merged.taxAmount;
  const currency = merged.currency;
  const extracted = buildExtraction(body, receiptDate, vendorName, totalAmount, taxAmount, currency, rawText, {
    confidenceScore: merged.confidenceScore || aiExtraction?.confidenceScore || undefined,
    source: aiExtraction ? 'openai-responses' : 'heuristic-scaffold'
  });

  const reviewStatus = String(body.reviewStatus || receipt.review_status || 'pending').trim() || 'pending';
  const updatedRow = {
    vendor_name: vendorName,
    vendor_normalized_name: extracted.vendorNormalizedName,
    receipt_date: receiptDate,
    currency,
    subtotal_amount: extracted.subtotalAmount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    expense_type: inferExpenseType(body, vendorName, rawText || receipt.raw_text),
    ocr_status: rawText ? 'complete' : 'pending',
    review_status: String(body.autoApprove).toLowerCase() === 'true' && extracted.confidenceScore >= 85 ? 'approved' : reviewStatus,
    ocr_provider: String(body.ocrProvider || receipt.ocr_provider || (aiExtraction ? 'openai' : 'work2u')),
    ocr_confidence: extracted.confidenceScore,
    raw_text: rawText || receipt.raw_text || null,
    extracted_data: extracted.extractedJson,
    updated_by: ownerId || receipt.updated_by || null
  };

  const updated = await supabaseRest('expense_receipts', {
    method: 'PATCH',
    query: {
      select: '*',
      id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`
    },
    body: updatedRow
  });

  const savedReceipt = Array.isArray(updated) ? updated[0] || receipt : receipt;
  const savedExtraction = await persistExtraction({
    receiptId: savedReceipt.id,
    workspaceId,
    ownerId: ownerId || workspace.owner_id,
    extracted,
    provider: aiExtraction ? 'openai' : 'work2u',
    modelName: aiExtraction ? getOpenAiReceiptModel() : 'heuristic-scaffold'
  });
  await persistReceiptEvent({
    receiptId: savedReceipt.id,
    workspaceId,
    ownerId: ownerId || workspace.owner_id,
    eventType: 'receipt.ocr_refreshed',
    eventLabel: 'Receipt OCR refreshed',
    eventStatus: savedReceipt.ocr_status || 'complete',
    eventSource: aiExtraction ? 'openai' : 'work2u',
    eventDetails: {
      modelProvider: savedExtraction.model_provider || null,
      modelName: savedExtraction.model_name || null,
      confidenceScore: extracted.confidenceScore || savedExtraction.confidence_score || 0
    }
  });
  await rebuildMonthlyExpenseSnapshot({
    workspaceId,
    monthInput: savedReceipt.expense_month || receipt.expense_month || receiptDate,
    includeInsights: false,
    generatedBy: ownerId || workspace.owner_id || 'system'
  }).catch(() => {});

  return {
    status: 200,
    body: {
      success: true,
      data: {
        receipt: savedReceipt,
        extraction: savedExtraction,
        storage: {
          uploaded: Boolean(storedFile.uploaded),
          storagePath: storedFile.storagePath || null,
          uploadError: storedFile.uploadError || null
        },
        nextSteps: ['review extracted values', 'approve receipt if correct']
      }
    }
  };
}

async function reviewReceipt(body) {
  const workspaceId = String(body.workspaceId || body.workspace_id || '').trim();
  const receiptId = String(body.receiptId || body.receipt_id || body.id || '').trim();
  const reviewStatus = String(body.reviewStatus || body.review_status || '').trim().toLowerCase();
  if (!workspaceId || !receiptId || !reviewStatus) {
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: 'MISSING_ARGS',
          message: 'workspaceId, receiptId, and reviewStatus are required for review updates'
        }
      }
    };
  }
  if (!['pending', 'approved', 'flagged', 'rejected'].includes(reviewStatus)) {
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: 'INVALID_REVIEW_STATUS',
          message: 'reviewStatus must be pending, approved, flagged, or rejected'
        }
      }
    };
  }

  const workspace = await loadWorkspaceContext(workspaceId);
  if (!workspace) {
    return {
      status: 404,
      body: { success: false, error: { code: 'WORKSPACE_NOT_FOUND', message: 'workspace not found in Supabase' } }
    };
  }

  const receiptRows = await supabaseRest('expense_receipts', {
    query: {
      select: '*',
      id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`,
      limit: '1'
    }
  });
  const receipt = Array.isArray(receiptRows) ? receiptRows[0] || null : null;
  if (!receipt) {
    return {
      status: 404,
      body: { success: false, error: { code: 'NOT_FOUND', message: 'receipt not found' } }
    };
  }

  const reviewerId = String(body.reviewedBy || body.reviewed_by || body.ownerId || body.owner_id || workspace.owner_id || '').trim() || null;
  const updatedRow = {
    review_status: reviewStatus,
    reviewed_by: reviewStatus === 'pending' ? null : reviewerId || receipt.reviewed_by || null,
    reviewed_at: reviewStatus === 'pending' ? null : new Date().toISOString(),
    notes: String(body.notes || receipt.notes || '').trim() || null,
    updated_by: reviewerId || receipt.updated_by || null
  };

  const updated = await supabaseRest('expense_receipts', {
    method: 'PATCH',
    query: {
      select: '*',
      id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`
    },
    body: updatedRow
  });

  const savedReceipt = Array.isArray(updated) ? updated[0] || receipt : receipt;
  await persistReceiptEvent({
    receiptId: savedReceipt.id,
    workspaceId,
    ownerId: reviewerId || workspace.owner_id,
    eventType: 'receipt.reviewed',
    eventLabel: `Receipt ${reviewStatus}`,
    eventStatus: reviewStatus,
    eventSource: 'review',
    eventDetails: {
      notes: updatedRow.notes || null,
      reviewedBy: reviewerId || null
    }
  });
  await rebuildMonthlyExpenseSnapshot({
    workspaceId,
    monthInput: savedReceipt.expense_month || receipt.expense_month || receipt.receipt_date || currentMonthKey(),
    includeInsights: false,
    generatedBy: reviewerId || workspace.owner_id || 'system'
  }).catch(() => {});

  return {
    status: 200,
    body: {
      success: true,
      data: {
        receipt: savedReceipt
      }
    }
  };
}

async function tagReceipt(body) {
  const workspaceId = String(body.workspaceId || body.workspace_id || '').trim();
  const receiptId = String(body.receiptId || body.receipt_id || body.id || '').trim();
  const tags = normalizeTagList(body.tags || body.tag || body.label || body.labels);
  if (!workspaceId || !receiptId || !tags.length) {
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: 'MISSING_ARGS',
          message: 'workspaceId, receiptId, and tags are required for tag updates'
        }
      }
    };
  }

  const workspace = await loadWorkspaceContext(workspaceId);
  if (!workspace) {
    return {
      status: 404,
      body: { success: false, error: { code: 'WORKSPACE_NOT_FOUND', message: 'workspace not found in Supabase' } }
    };
  }

  const receiptRows = await supabaseRest('expense_receipts', {
    query: {
      select: '*',
      id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`,
      limit: '1'
    }
  });
  const receipt = Array.isArray(receiptRows) ? receiptRows[0] || null : null;
  if (!receipt) {
    return {
      status: 404,
      body: { success: false, error: { code: 'NOT_FOUND', message: 'receipt not found' } }
    };
  }

  const updaterId = String(body.updatedBy || body.updated_by || body.ownerId || body.owner_id || workspace.owner_id || '').trim() || null;
  const mergedNotes = mergeReceiptNotesWithTags(receipt.notes || '', tags);
  const updated = await supabaseRest('expense_receipts', {
    method: 'PATCH',
    query: {
      select: '*',
      id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`
    },
    body: {
      notes: mergedNotes,
      updated_by: updaterId || receipt.updated_by || null
    }
  });

  const savedReceipt = Array.isArray(updated) ? updated[0] || receipt : receipt;
  await persistReceiptEvent({
    receiptId: savedReceipt.id,
    workspaceId,
    ownerId: updaterId || workspace.owner_id,
    eventType: 'receipt.tagged',
    eventLabel: 'Receipt tags updated',
    eventStatus: savedReceipt.review_status || 'pending',
    eventSource: 'tag',
    eventDetails: {
      tags
    }
  });

  return {
    status: 200,
    body: {
      success: true,
      data: {
        receipt: savedReceipt,
        tags
      }
    }
  };
}

async function deleteReceipt(body) {
  const workspaceId = String(body.workspaceId || body.workspace_id || '').trim();
  const receiptId = String(body.receiptId || body.receipt_id || body.id || '').trim();
  if (!workspaceId || !receiptId) {
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: 'MISSING_ARGS',
          message: 'workspaceId and receiptId are required for deletion'
        }
      }
    };
  }

  const workspace = await loadWorkspaceContext(workspaceId);
  if (!workspace) {
    return {
      status: 404,
      body: { success: false, error: { code: 'WORKSPACE_NOT_FOUND', message: 'workspace not found in Supabase' } }
    };
  }

  const receiptRows = await supabaseRest('expense_receipts', {
    query: {
      select: '*',
      id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`,
      limit: '1'
    }
  });
  const receipt = Array.isArray(receiptRows) ? receiptRows[0] || null : null;
  if (!receipt) {
    return {
      status: 404,
      body: { success: false, error: { code: 'NOT_FOUND', message: 'receipt not found' } }
    };
  }

  const reference = parseReceiptStorageReference(receipt.file_url);
  if (reference) {
    await supabaseStorageDelete({ bucket: reference.bucket, objectPath: reference.objectPath }).catch(() => {});
  }

  await supabaseRest('expense_receipt_events', {
    method: 'DELETE',
    query: {
      expense_receipt_id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`
    }
  }).catch(() => {});
  await supabaseRest('expense_receipt_extractions', {
    method: 'DELETE',
    query: {
      expense_receipt_id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`
    }
  }).catch(() => {});
  await supabaseRest('expense_receipts', {
    method: 'DELETE',
    query: {
      id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`
    }
  });

  await rebuildMonthlyExpenseSnapshot({
    workspaceId,
    monthInput: receipt.expense_month || receipt.receipt_date || currentMonthKey(),
    includeInsights: false,
    generatedBy: String(body.deletedBy || body.deleted_by || workspace.owner_id || '').trim() || workspace.owner_id || 'system'
  }).catch(() => {});

  return {
    status: 200,
    body: {
      success: true,
      data: {
        deleted: true,
        receiptId,
        workspaceId
      }
    }
  };
}

async function signReceiptAsset(body) {
  const workspaceId = String(body.workspaceId || body.workspace_id || '').trim();
  const receiptId = String(body.receiptId || body.receipt_id || body.id || '').trim();
  if (!workspaceId || !receiptId) {
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: 'MISSING_ARGS',
          message: 'workspaceId and receiptId are required for receipt preview'
        }
      }
    };
  }

  const workspace = await loadWorkspaceContext(workspaceId);
  if (!workspace) {
    return {
      status: 404,
      body: { success: false, error: { code: 'WORKSPACE_NOT_FOUND', message: 'workspace not found in Supabase' } }
    };
  }

  const receiptRows = await supabaseRest('expense_receipts', {
    query: {
      select: 'id,workspace_id,file_name,file_url,mime_type,total_amount,currency,review_status,receipt_date,vendor_name,ocr_status,ocr_confidence,raw_text,reviewed_by,reviewed_at,created_at,updated_at',
      id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`,
      limit: '1'
    }
  });
  const receipt = Array.isArray(receiptRows) ? receiptRows[0] || null : null;
  if (!receipt) {
    return {
      status: 404,
      body: { success: false, error: { code: 'NOT_FOUND', message: 'receipt not found' } }
    };
  }

  const receiptEvents = await supabaseRest('expense_receipt_events', {
    query: {
      select: 'id,workspace_id,expense_receipt_id,event_type,event_label,event_status,event_source,event_details,created_by,created_at',
      expense_receipt_id: `eq.${receiptId}`,
      workspace_id: `eq.${workspaceId}`,
      order: 'created_at.asc'
    }
  }).catch(() => []);
  const timeline = buildReceiptTimeline(receipt, Array.isArray(receiptEvents) ? receiptEvents : []);

  const reference = parseReceiptStorageReference(receipt.file_url);
  if (!reference) {
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: 'NO_STORAGE_REFERENCE',
          message: 'receipt does not point to a Supabase storage object'
        }
      }
    };
  }

  if (isPublicReceiptBucket()) {
    return {
      status: 200,
      body: {
        success: true,
        data: {
          receipt,
          timeline,
          signedUrl: buildReceiptFileUrl({ bucket: reference.bucket, objectPath: reference.objectPath }),
          downloadUrl: buildSignedDownloadUrl(receipt.file_url, buildReceiptFileUrl({ bucket: reference.bucket, objectPath: reference.objectPath })),
          mode: 'public'
        }
      }
    };
  }

  const signed = await supabaseStorageSign({
    bucket: reference.bucket,
    objectPath: reference.objectPath,
    expiresIn: Number(body.expiresIn || body.expires_in || 900) || 900
  });
  const signedUrl = String(signed?.signedURL || signed?.signedUrl || '').trim();
  if (!signedUrl) {
    return {
      status: 500,
      body: {
        success: false,
        error: {
          code: 'SIGN_FAILED',
          message: 'Unable to create a signed URL for this receipt'
        }
      }
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      data: {
        receipt,
        timeline,
        signedUrl,
        downloadUrl: buildSignedDownloadUrl(receipt.file_url, signedUrl),
        expiresIn: Number(body.expiresIn || body.expires_in || 900) || 900,
        mode: 'private'
      }
    }
  };
}

async function handleExpenseReceipts(req, res, url, send) {
  const responder =
    typeof send === 'function'
      ? send
      : (status, body, headers = {}) => {
          res.writeHead(status, {
            'Content-Type': 'application/json; charset=utf-8',
            ...headers
          });
          res.end(JSON.stringify(body));
        };

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Workspace-Id');

  if (req.method === 'OPTIONS') return responder(200, {});
  if (req.method === 'GET') {
    try {
      const query = url instanceof URL ? url.searchParams : new URL(req.url, `http://${req.headers.host || 'localhost'}`).searchParams;
      const workspaceId = String(query.get('workspaceId') || req.headers['x-workspace-id'] || '').trim();
      const limit = Math.max(1, Math.min(20, Number(query.get('limit') || 8) || 8));
      if (!workspaceId) {
        return responder(400, {
          success: false,
          error: { code: 'MISSING_WORKSPACE', message: 'workspaceId is required to list receipts' }
        });
      }

      const rows = await supabaseRest('expense_receipts', {
        query: {
          select: 'id,workspace_id,owner_id,category_id,source_channel,expense_month,vendor_name,vendor_normalized_name,receipt_number,receipt_date,currency,subtotal_amount,tax_amount,total_amount,payment_method,expense_type,ocr_status,review_status,ocr_confidence,file_name,file_url,mime_type,file_size,notes,reviewed_by,reviewed_at,created_at,updated_at',
          workspace_id: `eq.${workspaceId}`,
          order: 'created_at.desc',
          limit: String(limit)
        }
      });

      const receipts = Array.isArray(rows) ? rows : [];
      return responder(200, {
        success: true,
        data: {
          workspaceId,
          limit,
          receipts
        }
      });
    } catch (error) {
      return responder(500, {
        success: false,
        error: {
          code: 'RECEIPT_LIST_FAILED',
          message: error.message || 'Failed to load recent receipts'
        }
      });
    }
  }

  if (req.method !== 'POST') {
    return responder(405, {
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'POST only' }
    });
  }

  try {
    const body = await readBody(req);
    const action = String(body.action || 'create').trim().toLowerCase();
    let result;
    if (action === 'extract') result = await extractReceipt(body);
    else if (action === 'review') result = await reviewReceipt(body);
    else if (action === 'tag') result = await tagReceipt(body);
    else if (action === 'delete') result = await deleteReceipt(body);
    else if (action === 'sign') result = await signReceiptAsset(body);
    else result = await createReceipt(body);
    return responder(result.status, result.body);
  } catch (error) {
    return responder(500, {
      success: false,
      error: {
        code: 'EXPENSE_RECEIPT_FAILED',
        message: error.message || 'Failed to process expense receipt'
      }
    });
  }
}

module.exports = {
  handleExpenseReceipts,
  normalizeMonthKey
};
