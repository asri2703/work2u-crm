const { URL } = require('url');

const DEFAULT_TIMEZONE = 'Asia/Kuala_Lumpur';

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
  const headers = supabaseAdminHeaders();
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

async function supabaseUpsert(pathname, row, conflict = 'id') {
  const base = getSupabaseRestBase();
  const headers = supabaseAdminHeaders({
    Prefer: 'resolution=merge-duplicates,return=representation'
  });
  if (!base || !headers) return null;

  const url = new URL(`${base}/rest/v1/${String(pathname).replace(/^\/+/, '')}`);
  if (conflict) url.searchParams.set('on_conflict', conflict);

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
    const detail = data?.message || data?.error || text || `Supabase upsert ${response.status}`;
    throw new Error(detail);
  }

  return data;
}

function nowIso() {
  return new Date().toISOString();
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
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

function parseBool(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  return fallback;
}

function monthRange(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const next = new Date(Date.UTC(year, month, 1));
  return {
    startDate: start.toISOString().slice(0, 10),
    nextStartDate: next.toISOString().slice(0, 10)
  };
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function round2(value) {
  return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
}

function normalizeRows(rows) {
  return Array.isArray(rows) ? rows : [];
}

function isOverheadReceipt(receipt, categoryMap) {
  const category = categoryMap.get(receipt.category_id);
  if (category?.is_overhead) return true;
  return String(receipt.expense_type || '').toLowerCase() === 'overhead';
}

function normalizeBreakdownValue(value, kind) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => {
      const totalAmount = toNumber(item.totalAmount ?? item.total_amount ?? item.amount ?? 0);
      if (kind === 'vendor') {
        return {
          vendorName: String(item.vendorName ?? item.vendor_name ?? item.name ?? 'Unknown'),
          totalAmount,
          receiptCount: Number(item.receiptCount ?? item.receipt_count ?? 0),
          currency: String(item.currency || 'MYR')
        };
      }
      return {
        categoryName: String(item.categoryName ?? item.category_name ?? item.name ?? 'Uncategorized'),
        isOverhead: Boolean(item.isOverhead ?? item.is_overhead ?? false),
        totalAmount,
        receiptCount: Number(item.receiptCount ?? item.receipt_count ?? 0),
        currency: String(item.currency || 'MYR')
      };
    });
  }

  if (typeof value === 'object') {
    return Object.entries(value).map(([label, amount]) => {
      const totalAmount = toNumber(typeof amount === 'object' ? amount.totalAmount ?? amount.total_amount ?? amount.amount : amount);
      if (kind === 'vendor') {
        return {
          vendorName: String(label || 'Unknown'),
          totalAmount,
          receiptCount: Number(amount?.receiptCount ?? amount?.receipt_count ?? 0),
          currency: String(amount?.currency || 'MYR')
        };
      }
      return {
        categoryName: String(label || 'Uncategorized'),
        isOverhead: Boolean(amount?.isOverhead ?? amount?.is_overhead ?? false),
        totalAmount,
        receiptCount: Number(amount?.receiptCount ?? amount?.receipt_count ?? 0),
        currency: String(amount?.currency || 'MYR')
      };
    });
  }

  return [];
}

function enrichBreakdown(rows, kind, currency) {
  const list = normalizeBreakdownValue(rows, kind);
  const total = list.reduce((sum, item) => sum + toNumber(item.totalAmount), 0);
  return list
    .map((item) => ({
      ...item,
      currency: item.currency || currency || 'MYR',
      sharePct: total > 0 ? round2((toNumber(item.totalAmount) / total) * 100) : 0
    }))
    .sort((a, b) => toNumber(b.totalAmount) - toNumber(a.totalAmount));
}

function buildLiveSummary({
  monthKey,
  currency = 'MYR',
  receipts = [],
  revenueRows = [],
  subscriptionRows = [],
  categoryMap = new Map()
}) {
  const approvedReceipts = receipts.filter((row) => String(row.review_status || '').toLowerCase() === 'approved');
  const calculationSource = approvedReceipts.length ? approvedReceipts : receipts;
  const invoiceRevenue = revenueRows.reduce((sum, row) => sum + toNumber(row.amount), 0);
  const subscriptionRevenue = subscriptionRows.reduce((sum, row) => sum + toNumber(row.amount_cents) / 100, 0);

  let directExpenses = 0;
  let overheadExpenses = 0;
  let approvedCount = 0;
  let unreviewedCount = 0;

  for (const receipt of receipts) {
    const amount = toNumber(receipt.total_amount);
    const reviewStatus = String(receipt.review_status || 'pending').toLowerCase();
    const overhead = isOverheadReceipt(receipt, categoryMap);

    if (reviewStatus === 'approved') approvedCount += 1;
    else unreviewedCount += 1;

    if (!approvedReceipts.length || reviewStatus === 'approved') {
      if (overhead) overheadExpenses += amount;
      else directExpenses += amount;
    }
  }

  const totalDirect = approvedReceipts.length
    ? directExpenses
    : calculationSource.reduce((sum, receipt) => (isOverheadReceipt(receipt, categoryMap) ? sum : sum + toNumber(receipt.total_amount)), 0);

  const totalOverhead = approvedReceipts.length
    ? overheadExpenses
    : calculationSource.reduce((sum, receipt) => (isOverheadReceipt(receipt, categoryMap) ? sum + toNumber(receipt.total_amount) : sum), 0);

  const grossRevenue = round2(invoiceRevenue + subscriptionRevenue);
  const totalExpenses = round2(totalDirect);
  const netProfit = round2(grossRevenue - totalExpenses - totalOverhead);

  return {
    monthKey,
    grossRevenue,
    totalExpenses,
    totalOverhead: round2(totalOverhead),
    netProfit,
    receiptCount: receipts.length,
    approvedReceiptCount: approvedCount,
    unreviewedReceiptCount: unreviewedCount,
    currency,
    source: 'live'
  };
}

function buildVendorBreakdown(receipts, currency) {
  const grouped = new Map();

  for (const receipt of receipts) {
    const vendorName = String(receipt.vendor_normalized_name || receipt.vendor_name || 'Unknown').trim() || 'Unknown';
    const current = grouped.get(vendorName) || { vendorName, totalAmount: 0, receiptCount: 0, currency };
    current.totalAmount += toNumber(receipt.total_amount);
    current.receiptCount += 1;
    grouped.set(vendorName, current);
  }

  const rows = Array.from(grouped.values()).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 10);
  const total = rows.reduce((sum, item) => sum + item.totalAmount, 0);

  return rows.map((item) => ({
    ...item,
    totalAmount: round2(item.totalAmount),
    sharePct: total > 0 ? round2((item.totalAmount / total) * 100) : 0
  }));
}

function buildCategoryBreakdown(receipts, categoryMap, currency) {
  const grouped = new Map();

  for (const receipt of receipts) {
    const category = categoryMap.get(receipt.category_id);
    const categoryName = String(category?.name || receipt.expense_type || 'Uncategorized').trim() || 'Uncategorized';
    const isOverhead = Boolean(category?.is_overhead || String(receipt.expense_type || '').toLowerCase() === 'overhead');
    const key = `${categoryName}::${isOverhead ? '1' : '0'}`;
    const current = grouped.get(key) || {
      categoryName,
      isOverhead,
      totalAmount: 0,
      receiptCount: 0,
      currency
    };
    current.totalAmount += toNumber(receipt.total_amount);
    current.receiptCount += 1;
    grouped.set(key, current);
  }

  const rows = Array.from(grouped.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  const total = rows.reduce((sum, item) => sum + item.totalAmount, 0);

  return rows.map((item) => ({
    ...item,
    totalAmount: round2(item.totalAmount),
    sharePct: total > 0 ? round2((item.totalAmount / total) * 100) : 0
  }));
}

function buildAiInsights({ summary, vendorBreakdown, categoryBreakdown, reviewQueue }) {
  const insights = [];

  if (reviewQueue.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Pending receipts need review',
      message: `${reviewQueue.length} receipt(s) are still pending or flagged for the selected month.`,
      severity: reviewQueue.length > 10 ? 'high' : 'medium',
      suggestedAction: 'Open the review queue and approve or flag the outstanding receipts.'
    });
  }

  if (summary.grossRevenue > 0 && summary.netProfit < 0) {
    insights.push({
      type: 'critical',
      title: 'Profit is negative',
      message: 'Revenue is currently below total expenses and overhead for this month.',
      severity: 'high',
      suggestedAction: 'Review top expense categories and check whether any costs can be delayed or reduced.'
    });
  }

  const topVendor = vendorBreakdown[0];
  if (topVendor && topVendor.sharePct >= 35) {
    insights.push({
      type: 'info',
      title: 'Vendor concentration is high',
      message: `${topVendor.vendorName} makes up ${topVendor.sharePct}% of recorded spend for this month.`,
      severity: 'medium',
      suggestedAction: 'Review whether the vendor is strategic or whether the spend can be spread out.'
    });
  }

  const topCategory = categoryBreakdown.find((item) => item.isOverhead) || categoryBreakdown[0];
  if (topCategory && topCategory.sharePct >= 40) {
    insights.push({
      type: 'info',
      title: 'Overhead is heavy',
      message: `${topCategory.categoryName} is taking a large share of this month's spend.`,
      severity: 'medium',
      suggestedAction: 'Check whether this overhead category can be capped or renegotiated.'
    });
  }

  return insights;
}

function buildSnapshotSummaryText({ summary, vendorBreakdown = [], categoryBreakdown = [], reviewQueue = [], insights = [] }) {
  const lines = [];
  lines.push(`${summary.monthKey} monthly close`);
  lines.push(`Revenue ${summary.currency || 'MYR'} ${summary.grossRevenue.toFixed(2)}, expenses ${summary.totalExpenses.toFixed(2)}, overhead ${summary.totalOverhead.toFixed(2)}, profit ${summary.netProfit.toFixed(2)}.`);

  if (reviewQueue.length) {
    lines.push(`${reviewQueue.length} receipt(s) still need review.`);
  }

  const topVendor = vendorBreakdown[0];
  if (topVendor) {
    lines.push(`Top vendor: ${topVendor.vendorName} (${topVendor.sharePct}% of spend).`);
  }

  const topCategory = categoryBreakdown[0];
  if (topCategory) {
    lines.push(`Top category: ${topCategory.categoryName} (${topCategory.sharePct}% of spend).`);
  }

  if (insights.length) {
    lines.push(insights.slice(0, 2).map((item) => item.title).join(' · '));
  }

  return lines.filter(Boolean).join(' ');
}

async function persistMonthlyExpenseSnapshot({
  workspaceId,
  monthKey,
  summary,
  vendorBreakdown = [],
  categoryBreakdown = [],
  reviewQueue = [],
  aiInsights = [],
  generatedBy = 'system'
}) {
  const snapshotRow = {
    workspace_id: workspaceId,
    month_key: monthKey,
    currency: summary.currency || 'MYR',
    gross_revenue: round2(summary.grossRevenue),
    total_expenses: round2(summary.totalExpenses),
    total_overhead: round2(summary.totalOverhead),
    net_profit: round2(summary.netProfit),
    receipt_count: Number(summary.receiptCount || 0),
    approved_receipt_count: Number(summary.approvedReceiptCount || 0),
    unreviewed_receipt_count: Number(summary.unreviewedReceiptCount || 0),
    category_breakdown: categoryBreakdown,
    vendor_breakdown: vendorBreakdown,
    ai_summary: buildSnapshotSummaryText({ summary, vendorBreakdown, categoryBreakdown, reviewQueue, insights: aiInsights }),
    generated_by: generatedBy,
    generated_at: nowIso()
  };

  return supabaseUpsert('monthly_expense_snapshots', snapshotRow, 'workspace_id,month_key');
}

async function rebuildMonthlyExpenseSnapshot({
  workspaceId,
  workspaceName,
  ownerId,
  monthInput,
  includeInsights = true,
  generatedBy = 'system'
} = {}) {
  const dashboard = await fetchExpenseDashboardResponse({
    workspaceId,
    workspaceName,
    ownerId,
    monthInput,
    includeInsights,
    includeLiveFallback: true,
    forceLive: true
  });

  if (dashboard.status !== 200) return dashboard;

  const data = dashboard.body?.data || {};
  const snapshot = await persistMonthlyExpenseSnapshot({
    workspaceId: data.workspaceId,
    monthKey: data.monthKey,
    summary: data.summary,
    vendorBreakdown: data.vendorBreakdown,
    categoryBreakdown: data.categoryBreakdown,
    reviewQueue: data.reviewQueue,
    aiInsights: data.aiInsights,
    generatedBy
  });

  return {
    ...dashboard,
    body: {
      ...dashboard.body,
      data: {
        ...data,
        snapshot,
        meta: {
          ...data.meta,
          snapshotUsed: true,
          liveFallbackUsed: true,
          generatedBy
        }
      }
    }
  };
}

async function fetchExpenseDashboardResponse({
  workspaceId,
  workspaceName,
  ownerId,
  monthInput,
  includeInsights = true,
  includeLiveFallback = true,
  forceLive = false
} = {}) {
  const monthKey = normalizeMonthKey(monthInput);
  if (!monthKey) {
    return {
      status: 400,
      body: {
        success: false,
        error: {
          code: 'INVALID_MONTH',
          message: 'month must use YYYY-MM or YYYY-MM-01 format'
        }
      }
    };
  }

  const base = getSupabaseRestBase();
  const key = getSupabaseServiceRoleKey();
  if (!base || !key) {
    return {
      status: 503,
      body: {
        success: false,
        error: {
          code: 'SUPABASE_NOT_CONFIGURED',
          message: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured yet'
        }
      }
    };
  }

  const { startDate, nextStartDate } = monthRange(monthKey);
  const cleanWorkspaceId = String(workspaceId || '').trim();
  const cleanWorkspaceName = String(workspaceName || '').trim();
  const cleanOwnerId = String(ownerId || '').trim();
  let resolvedWorkspaceId = cleanWorkspaceId;
  let resolvedWorkspaceName = cleanWorkspaceName;
  let resolvedOwnerId = cleanOwnerId;

  if (!resolvedWorkspaceId) {
    const workspaceQueries = [];
    if (cleanWorkspaceName) workspaceQueries.push({ name: `eq.${cleanWorkspaceName}`, limit: '1' });
    if (cleanOwnerId) workspaceQueries.push({ owner_id: `eq.${cleanOwnerId}`, limit: '1' });

    let workspaceRows = [];
    try {
      for (const query of workspaceQueries) {
        workspaceRows = normalizeRows(
          await supabaseRest('workspaces', {
            query: {
              select: 'id,owner_id,name,region,package',
              ...query
            }
          })
        );
        if (workspaceRows.length) break;
      }
    } catch (error) {
      if (/workspaces/i.test(error.message || '')) {
        return {
          status: 503,
          body: {
            success: false,
            error: {
              code: 'WORKSPACE_LOOKUP_UNAVAILABLE',
              message: 'workspace lookup requires public.workspaces or a provided workspaceId'
            }
          }
        };
      }
      throw error;
    }

    resolvedWorkspaceId = workspaceRows[0]?.id || '';
    resolvedWorkspaceName = workspaceRows[0]?.name || resolvedWorkspaceName;
    resolvedOwnerId = workspaceRows[0]?.owner_id || resolvedOwnerId;
  }

  if (!resolvedWorkspaceId) {
    return {
      status: 404,
      body: {
        success: false,
        error: {
          code: 'WORKSPACE_NOT_FOUND',
          message: 'workspaceId or matching workspaceName is required for the expense dashboard scaffold'
        }
      }
    };
  }
  const [snapshotRows, expenseRows, revenueRows, subscriptionRowsRaw, categoryRows, pnlRows] = await Promise.all([
    supabaseRest('monthly_expense_snapshots', {
      query: {
        select: 'month_key,currency,gross_revenue,total_expenses,total_overhead,net_profit,receipt_count,approved_receipt_count,unreviewed_receipt_count,category_breakdown,vendor_breakdown,ai_summary,generated_at',
        workspace_id: `eq.${resolvedWorkspaceId}`,
        month_key: `eq.${monthKey}`,
        limit: '1'
      }
    }),
    supabaseRest('expense_receipts', {
      query: {
        select: 'id,workspace_id,category_id,expense_month,vendor_name,vendor_normalized_name,receipt_date,currency,subtotal_amount,tax_amount,total_amount,payment_method,expense_type,ocr_status,review_status,ocr_confidence,file_name,file_url,notes,created_at,updated_at',
        workspace_id: `eq.${resolvedWorkspaceId}`,
        expense_month: `gte.${startDate}`,
        expense_month: `lt.${nextStartDate}`,
        order: 'created_at.desc'
      }
    }),
    supabaseRest('receipts', {
      query: {
        select: 'id,workspace_id,invoice_id,number,amount,paid_at,document_url,created_at,updated_at',
        workspace_id: `eq.${resolvedWorkspaceId}`,
        paid_at: `gte.${startDate}T00:00:00Z`,
        paid_at: `lt.${nextStartDate}T00:00:00Z`,
        order: 'paid_at.desc'
      }
    }),
    resolvedOwnerId
      ? supabaseRest('subscriptions', {
          query: {
            select: 'id,owner_id,plan_code,provider,status,amount_cents,currency,trial_ends_at,current_period_start,current_period_end,created_at,updated_at',
            owner_id: `eq.${resolvedOwnerId}`,
            status: 'eq.active',
            order: 'updated_at.desc'
          }
        })
      : Promise.resolve([]),
    supabaseRest('expense_categories', {
      query: {
        select: 'id,name,slug,is_overhead,sort_order',
        workspace_id: `eq.${resolvedWorkspaceId}`,
        order: 'sort_order.asc,name.asc'
      }
    }),
    supabaseRest('monthly_expense_snapshots', {
      query: {
        select: 'month_key,currency,gross_revenue,total_expenses,total_overhead,net_profit,receipt_count,approved_receipt_count,unreviewed_receipt_count,generated_at',
        workspace_id: `eq.${resolvedWorkspaceId}`,
        order: 'month_key.desc',
        limit: '12'
      }
    })
  ]);

  const snapshot = forceLive ? null : normalizeRows(snapshotRows)[0] || null;
  const expenseReceipts = normalizeRows(expenseRows);
  const revenueReceipts = normalizeRows(revenueRows);
  const subscriptionRows = normalizeRows(subscriptionRowsRaw);
  const categories = normalizeRows(categoryRows);
  const categoryMap = new Map(categories.map((row) => [row.id, row]));
  const currency = snapshot?.currency || expenseReceipts[0]?.currency || revenueReceipts[0]?.currency || 'MYR';

  const approvedReceipts = expenseReceipts.filter((row) => String(row.review_status || '').toLowerCase() === 'approved');
  const breakdownReceipts = approvedReceipts.length ? approvedReceipts : expenseReceipts;

  const liveSummary = buildLiveSummary({
    monthKey,
    currency,
    receipts: expenseReceipts,
    revenueRows: revenueReceipts,
    subscriptionRows,
    categoryMap
  });

  let summary = snapshot
    ? {
        monthKey: String(snapshot.month_key || monthKey),
        grossRevenue: round2(snapshot.gross_revenue),
        totalExpenses: round2(snapshot.total_expenses),
        totalOverhead: round2(snapshot.total_overhead),
        netProfit: round2(snapshot.net_profit),
        receiptCount: Number(snapshot.receipt_count || 0),
        approvedReceiptCount: Number(snapshot.approved_receipt_count || 0),
        unreviewedReceiptCount: Number(snapshot.unreviewed_receipt_count || 0),
        currency: String(snapshot.currency || currency || 'MYR'),
        source: 'snapshot'
      }
    : liveSummary;

  if (!snapshot && includeLiveFallback === false) {
    summary = {
      monthKey,
      grossRevenue: 0,
      totalExpenses: 0,
      totalOverhead: 0,
      netProfit: 0,
      receiptCount: expenseReceipts.length,
      approvedReceiptCount: approvedReceipts.length,
      unreviewedReceiptCount: expenseReceipts.length - approvedReceipts.length,
      currency,
      source: 'live'
    };
  }

  const vendorBreakdown = snapshot?.vendor_breakdown
    ? enrichBreakdown(snapshot.vendor_breakdown, 'vendor', currency)
    : buildVendorBreakdown(breakdownReceipts, currency);

  const categoryBreakdown = snapshot?.category_breakdown
    ? enrichBreakdown(snapshot.category_breakdown, 'category', currency)
    : buildCategoryBreakdown(breakdownReceipts, categoryMap, currency);

  const reviewQueue = expenseReceipts
    .filter((row) => ['pending', 'flagged'].includes(String(row.review_status || '').toLowerCase()))
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));

  const pnl = normalizeRows(pnlRows);
  const pnlRowsResponse = pnl.length
    ? pnl.map((row) => ({
        monthKey: String(row.month_key),
        grossRevenue: round2(row.gross_revenue),
        totalExpenses: round2(row.total_expenses),
        totalOverhead: round2(row.total_overhead),
        netProfit: round2(row.net_profit),
        profitMarginPct: toNumber(row.gross_revenue) > 0 ? round2((toNumber(row.net_profit) / toNumber(row.gross_revenue)) * 100) : 0,
        currency: String(row.currency || currency || 'MYR')
      }))
    : [
        {
          monthKey,
          grossRevenue: summary.grossRevenue,
          totalExpenses: summary.totalExpenses,
          totalOverhead: summary.totalOverhead,
          netProfit: summary.netProfit,
          profitMarginPct: summary.grossRevenue > 0 ? round2((summary.netProfit / summary.grossRevenue) * 100) : 0,
          currency: summary.currency || currency || 'MYR'
        }
      ];

  const aiInsights = includeInsights ? buildAiInsights({ summary, vendorBreakdown, categoryBreakdown, reviewQueue }) : [];

  return {
    status: 200,
    body: {
      success: true,
      data: {
        workspaceId: resolvedWorkspaceId,
        workspaceName: resolvedWorkspaceName,
        monthKey,
        summary,
        vendorBreakdown,
        categoryBreakdown,
        reviewQueue,
        pnlRows: pnlRowsResponse,
        aiInsights,
        meta: {
          generatedAt: new Date().toISOString(),
          snapshotUsed: Boolean(snapshot),
          liveFallbackUsed: !snapshot && includeLiveFallback !== false,
          currency: summary.currency || currency || 'MYR',
          timezone: DEFAULT_TIMEZONE
        }
      }
    }
  };
}

async function handleExpenseDashboard(req, res, url, send) {
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

  if (req.method === 'OPTIONS') {
    return responder(200, {});
  }

  if (req.method === 'POST') {
    const body = await readBody(req);
    const action = String(body?.action || queryValue(url, req, 'action') || '').toLowerCase();
    if (action === 'rollup') {
      try {
        const result = await rebuildMonthlyExpenseSnapshot({
          workspaceId: String(body?.workspaceId || body?.workspace_id || queryValue(url, req, 'workspaceId') || queryValue(url, req, 'workspace_id') || process.env.WORK2U_DEFAULT_WORKSPACE_ID || '').trim(),
          workspaceName: String(body?.workspaceName || body?.workspace_name || queryValue(url, req, 'workspaceName') || queryValue(url, req, 'workspace_name') || '').trim(),
          ownerId: String(body?.ownerId || body?.owner_id || queryValue(url, req, 'ownerId') || queryValue(url, req, 'owner_id') || '').trim(),
          monthInput: String(body?.month || body?.monthKey || body?.month_key || queryValue(url, req, 'month') || queryValue(url, req, 'monthKey') || queryValue(url, req, 'month_key') || currentMonthKey()).trim(),
          includeInsights: parseBool(body?.includeInsights ?? queryValue(url, req, 'includeInsights'), true),
          generatedBy: String(body?.generatedBy || body?.generated_by || 'system').trim() || 'system'
        });
        return responder(result.status, result.body);
      } catch (error) {
        return responder(500, {
          success: false,
          error: {
            code: 'ROLLUP_FAILED',
            message: error.message || 'Failed to roll up monthly expense snapshot'
          }
        });
      }
    }

    return responder(405, {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Unsupported expense dashboard action'
      }
    });
  }

  if (req.method !== 'GET') {
    return responder(405, {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'GET only'
      }
    });
  }

  const query = url instanceof URL ? url.searchParams : new URL(req.url, `http://${req.headers.host || 'localhost'}`).searchParams;
  const workspaceId =
    String(query.get('workspaceId') || req.headers['x-workspace-id'] || process.env.WORK2U_DEFAULT_WORKSPACE_ID || '').trim();
  const workspaceName = String(query.get('workspaceName') || query.get('workspace_name') || '').trim();
  const ownerId = String(query.get('ownerId') || query.get('owner_id') || '').trim();
  const month = query.get('month') || query.get('monthKey');
  const includeInsights = parseBool(query.get('includeInsights'), true);
  const includeLiveFallback = parseBool(query.get('includeLiveFallback'), true);

  try {
    const result = await fetchExpenseDashboardResponse({
      workspaceId,
      workspaceName,
      ownerId,
      monthInput: month,
      includeInsights,
      includeLiveFallback
    });
    return responder(result.status, result.body);
  } catch (error) {
    return responder(500, {
      success: false,
      error: {
        code: 'DASHBOARD_FETCH_FAILED',
        message: error.message || 'Failed to build expense dashboard'
      }
    });
  }
}

function queryValue(url, req, key) {
  const query = url instanceof URL ? url.searchParams : new URL(req.url, `http://${req.headers.host || 'localhost'}`).searchParams;
  return query.get(key);
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return '';
  return Buffer.concat(chunks).toString('utf8');
}

async function readBody(req) {
  const raw = await readRawBody(req);
  if (!raw) return {};
  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

module.exports = {
  buildAiInsights,
  buildLiveSummary,
  fetchExpenseDashboardResponse,
  handleExpenseDashboard,
  normalizeMonthKey,
  persistMonthlyExpenseSnapshot,
  rebuildMonthlyExpenseSnapshot
};
