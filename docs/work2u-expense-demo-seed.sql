-- Work2U expense reporting demo seed
-- Edit only the two values below before running.

-- demo_workspace_id = <YOUR_WORKSPACE_ID>
-- demo_owner_id = <YOUR_AUTH_USER_ID>

do $$
declare
  demo_workspace_id uuid := '<YOUR_WORKSPACE_ID>';
  demo_owner_id uuid := '<YOUR_AUTH_USER_ID>';
  subscriptions_category_id uuid := gen_random_uuid();
  travel_category_id uuid := gen_random_uuid();
  tools_category_id uuid := gen_random_uuid();
  resend_receipt_id uuid := gen_random_uuid();
  petrol_receipt_id uuid := gen_random_uuid();
  canva_receipt_id uuid := gen_random_uuid();
begin
  insert into public.expense_categories (
    id,
    workspace_id,
    name,
    slug,
    is_overhead,
    sort_order,
    is_active
  )
  values
    (subscriptions_category_id, demo_workspace_id, 'Subscriptions', 'subscriptions', true, 1, true),
    (travel_category_id, demo_workspace_id, 'Travel', 'travel', false, 2, true),
    (tools_category_id, demo_workspace_id, 'Tools', 'tools', false, 3, true)
  on conflict (workspace_id, slug) do update set
    name = excluded.name,
    is_overhead = excluded.is_overhead,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active,
    updated_at = now();

  insert into public.expense_receipts (
    id,
    workspace_id,
    owner_id,
    category_id,
    source_channel,
    expense_month,
    vendor_name,
    vendor_normalized_name,
    receipt_number,
    receipt_date,
    currency,
    subtotal_amount,
    tax_amount,
    total_amount,
    payment_method,
    expense_type,
    ocr_status,
    review_status,
    ocr_provider,
    ocr_confidence,
    raw_text,
    extracted_data,
    duplicate_hash,
    file_name,
    file_url,
    mime_type,
    notes
  )
  values
    (
      resend_receipt_id,
      demo_workspace_id,
      demo_owner_id,
      subscriptions_category_id,
      'upload',
      date '2026-08-01',
      'Resend',
      'resend',
      'RS-0826-001',
      date '2026-08-03',
      'MYR',
      89.00,
      0.00,
      89.00,
      'card',
      'subscription',
      'complete',
      'approved',
      'openai',
      94.00,
      'Resend subscription invoice receipt',
      '{"vendor_name":"Resend","amount":89.00,"category":"subscriptions","month":"2026-08"}'::jsonb,
      'seed-resend-0826-001',
      'resend-0826-001.pdf',
      'https://example.com/receipts/resend-0826-001.pdf',
      'application/pdf',
      'Demo subscription receipt'
    ),
    (
      petrol_receipt_id,
      demo_workspace_id,
      demo_owner_id,
      travel_category_id,
      'upload',
      date '2026-08-01',
      'Petrol Station Senawang',
      'petrol station senawang',
      'PS-0826-014',
      date '2026-08-10',
      'MYR',
      42.00,
      0.00,
      42.00,
      'cash',
      'travel',
      'complete',
      'approved',
      'openai',
      91.00,
      'Fuel receipt for client visit',
      '{"vendor_name":"Petrol Station Senawang","amount":42.00,"category":"travel","month":"2026-08"}'::jsonb,
      'seed-petrol-0826-014',
      'petrol-0826-014.jpg',
      'https://example.com/receipts/petrol-0826-014.jpg',
      'image/jpeg',
      'Demo travel receipt'
    ),
    (
      canva_receipt_id,
      demo_workspace_id,
      demo_owner_id,
      tools_category_id,
      'upload',
      date '2026-08-01',
      'Canva',
      'canva',
      'CV-0826-077',
      date '2026-08-16',
      'MYR',
      65.00,
      0.00,
      65.00,
      'card',
      'tools',
      'complete',
      'flagged',
      'openai',
      88.00,
      'Design tool subscription receipt',
      '{"vendor_name":"Canva","amount":65.00,"category":"tools","month":"2026-08"}'::jsonb,
      'seed-canva-0826-077',
      'canva-0826-077.pdf',
      'https://example.com/receipts/canva-0826-077.pdf',
      'application/pdf',
      'Demo tools receipt'
    )
  on conflict (workspace_id, duplicate_hash) do update set
    category_id = excluded.category_id,
    receipt_number = excluded.receipt_number,
    receipt_date = excluded.receipt_date,
    subtotal_amount = excluded.subtotal_amount,
    tax_amount = excluded.tax_amount,
    total_amount = excluded.total_amount,
    payment_method = excluded.payment_method,
    expense_type = excluded.expense_type,
    ocr_status = excluded.ocr_status,
    review_status = excluded.review_status,
    ocr_provider = excluded.ocr_provider,
    ocr_confidence = excluded.ocr_confidence,
    raw_text = excluded.raw_text,
    extracted_data = excluded.extracted_data,
    file_name = excluded.file_name,
    file_url = excluded.file_url,
    mime_type = excluded.mime_type,
    notes = excluded.notes,
    updated_at = now();

  insert into public.expense_receipt_extractions (
    id,
    workspace_id,
    expense_receipt_id,
    model_provider,
    model_name,
    prompt_version,
    raw_text,
    extracted_json,
    confidence_score,
    review_status,
    applied_by,
    applied_at
  )
  values
    (
      gen_random_uuid(),
      demo_workspace_id,
      resend_receipt_id,
      'openai',
      'gpt-5',
      'v1',
      'Resend subscription invoice receipt',
      '{"vendor_name":"Resend","amount":89.00,"category":"subscriptions","month":"2026-08"}'::jsonb,
      90.00,
      'applied',
      demo_owner_id,
      now()
    ),
    (
      gen_random_uuid(),
      demo_workspace_id,
      petrol_receipt_id,
      'openai',
      'gpt-5',
      'v1',
      'Fuel receipt for client visit',
      '{"vendor_name":"Petrol Station Senawang","amount":42.00,"category":"travel","month":"2026-08"}'::jsonb,
      90.00,
      'applied',
      demo_owner_id,
      now()
    ),
    (
      gen_random_uuid(),
      demo_workspace_id,
      canva_receipt_id,
      'openai',
      'gpt-5',
      'v1',
      'Design tool subscription receipt',
      '{"vendor_name":"Canva","amount":65.00,"category":"tools","month":"2026-08"}'::jsonb,
      88.00,
      'applied',
      demo_owner_id,
      now()
    )
  on conflict do nothing;

  insert into public.monthly_expense_snapshots (
    id,
    workspace_id,
    month_key,
    currency,
    gross_revenue,
    total_expenses,
    total_overhead,
    net_profit,
    receipt_count,
    approved_receipt_count,
    unreviewed_receipt_count,
    category_breakdown,
    vendor_breakdown,
    ai_summary,
    generated_by
  )
  values (
    gen_random_uuid(),
    demo_workspace_id,
    date '2026-08-01',
    'MYR',
    24500.00,
    196.00,
    89.00,
    24215.00,
    3,
    2,
    1,
    '{"subscriptions":89,"travel":42,"tools":65}'::jsonb,
    '{"Resend":89,"Petrol Station Senawang":42,"Canva":65}'::jsonb,
    'August receipts are in good shape. One tools receipt is flagged for review, and overhead remains low.',
    'seed'
  )
  on conflict (workspace_id, month_key) do update set
    currency = excluded.currency,
    gross_revenue = excluded.gross_revenue,
    total_expenses = excluded.total_expenses,
    total_overhead = excluded.total_overhead,
    net_profit = excluded.net_profit,
    receipt_count = excluded.receipt_count,
    approved_receipt_count = excluded.approved_receipt_count,
    unreviewed_receipt_count = excluded.unreviewed_receipt_count,
    category_breakdown = excluded.category_breakdown,
    vendor_breakdown = excluded.vendor_breakdown,
    ai_summary = excluded.ai_summary,
    generated_by = excluded.generated_by,
    generated_at = now(),
    updated_at = now();
end $$;

