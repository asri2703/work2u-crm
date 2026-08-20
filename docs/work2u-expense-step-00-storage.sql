-- Work2U expense reporting step 00
-- Supabase Storage bucket and RLS for receipt uploads

create extension if not exists pgcrypto;

create or replace function public.safe_uuid(input text)
returns uuid
language plpgsql
immutable
as $$
begin
  return input::uuid;
exception
  when others then
    return null;
end;
$$;

insert into storage.buckets (id, name, public)
values ('expense-receipts', 'expense-receipts', false)
on conflict (id) do nothing;

drop policy if exists expense_receipts_storage_select_owner on storage.objects;
drop policy if exists expense_receipts_storage_insert_owner on storage.objects;
drop policy if exists expense_receipts_storage_update_owner on storage.objects;
drop policy if exists expense_receipts_storage_delete_owner on storage.objects;
drop policy if exists expense_receipts_storage_select_super_admin on storage.objects;
drop policy if exists expense_receipts_storage_insert_super_admin on storage.objects;
drop policy if exists expense_receipts_storage_update_super_admin on storage.objects;
drop policy if exists expense_receipts_storage_delete_super_admin on storage.objects;

create policy expense_receipts_storage_select_owner
on storage.objects
for select
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
);

create policy expense_receipts_storage_insert_owner
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
);

create policy expense_receipts_storage_update_owner
on storage.objects
for update
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
)
with check (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
);

create policy expense_receipts_storage_delete_owner
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.workspace_has_access(public.safe_uuid((storage.foldername(name))[1]))
);

create policy expense_receipts_storage_select_super_admin
on storage.objects
for select
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
);

create policy expense_receipts_storage_insert_super_admin
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
);

create policy expense_receipts_storage_update_super_admin
on storage.objects
for update
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
)
with check (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
);

create policy expense_receipts_storage_delete_super_admin
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'expense-receipts'
  and public.is_super_admin()
);
