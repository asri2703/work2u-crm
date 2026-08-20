# Work2U Changelog

_Ringkasan kemas kini produk, docs, dan release note Work2U._

## Latest Update

### 19 August 2026

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:18px 0 22px">
  <div style="padding:18px;border:1px solid #dbeafe;border-radius:20px;background:linear-gradient(180deg,#f8fbff 0%,#eff6ff 100%);box-shadow:0 10px 28px rgba(37,99,235,.06)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:12px;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:18px">✦</div>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#2563eb">LIVE</div>
        <div style="font-weight:700;color:#0f172a">Visual docs hub</div>
      </div>
    </div>
    <div style="color:#334155;line-height:1.65;font-size:14px">The docs hub now feels more like a portal than a file list.</div>
  </div>
  <div style="padding:18px;border:1px solid #dcfce7;border-radius:20px;background:linear-gradient(180deg,#f8fff9 0%,#f0fdf4 100%);box-shadow:0 10px 28px rgba(21,128,61,.06)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:12px;background:#dcfce7;display:flex;align-items:center;justify-content:center;font-size:18px">◎</div>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#15803d">DOCS</div>
        <div style="font-weight:700;color:#0f172a">Public narrative aligned</div>
      </div>
    </div>
    <div style="color:#334155;line-height:1.65;font-size:14px">The README and landing page now speak the same product language.</div>
  </div>
  <div style="padding:18px;border:1px solid #ede9fe;border-radius:20px;background:linear-gradient(180deg,#fbfaff 0%,#f5f3ff 100%);box-shadow:0 10px 28px rgba(124,58,237,.06)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:12px;background:#ede9fe;display:flex;align-items:center;justify-content:center;font-size:18px">⌁</div>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#7c3aed">INFRA</div>
        <div style="font-weight:700;color:#0f172a">Calendar and email</div>
      </div>
    </div>
    <div style="color:#334155;line-height:1.65;font-size:14px">Internal calendar steps and email routes now have cleaner references.</div>
  </div>
</div>

- Added a visual docs hub at `docs/index.html`
- Refined the public-facing README for GitHub visitors and pitch use
- Added an internal calendar companion split into smaller SQL steps
- Added built-in email routes for magic link, invoice sent, and payment reminder
- Added a deployment checklist for safer Supabase rollout

## Recent Notes

### 19 August 2026

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:18px 0 22px">
  <div style="padding:18px;border:1px solid #dbeafe;border-radius:20px;background:linear-gradient(180deg,#f8fbff 0%,#eff6ff 100%);box-shadow:0 10px 28px rgba(37,99,235,.06)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:12px;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:18px">◆</div>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#2563eb">PUBLIC</div>
        <div style="font-weight:700;color:#0f172a">Homepage aligned</div>
      </div>
    </div>
    <div style="color:#334155;line-height:1.65;font-size:14px">Landing copy now matches the public-facing product narrative more closely.</div>
  </div>
  <div style="padding:18px;border:1px solid #fef3c7;border-radius:20px;background:linear-gradient(180deg,#fffcf3 0%,#fffbeb 100%);box-shadow:0 10px 28px rgba(180,83,9,.06)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:12px;background:#fef3c7;display:flex;align-items:center;justify-content:center;font-size:18px">◌</div>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#b45309">PITCH</div>
        <div style="font-weight:700;color:#0f172a">Sharper value story</div>
      </div>
    </div>
    <div style="color:#334155;line-height:1.65;font-size:14px">Pricing, current focus, and buyer benefits are easier to scan.</div>
  </div>
</div>

- Work2U docs now point to the visual hub from the landing page and dashboard
- The landing page copy now matches the public product narrative more closely
- The README now presents product value, pricing, and current focus more clearly

### 19 August 2026

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:18px 0 22px">
  <div style="padding:18px;border:1px solid #fef3c7;border-radius:20px;background:linear-gradient(180deg,#fffdf5 0%,#fffbeb 100%);box-shadow:0 10px 28px rgba(146,64,14,.06)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:12px;background:#fef3c7;display:flex;align-items:center;justify-content:center;font-size:18px">⟡</div>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#92400e">BUILD</div>
        <div style="font-weight:700;color:#0f172a">Calendar companion</div>
      </div>
    </div>
    <div style="color:#334155;line-height:1.65;font-size:14px">Internal calendar now ships as smaller sequential steps.</div>
  </div>
  <div style="padding:18px;border:1px solid #dbeafe;border-radius:20px;background:linear-gradient(180deg,#f8fbff 0%,#eff6ff 100%);box-shadow:0 10px 28px rgba(37,99,235,.06)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:40px;height:40px;border-radius:12px;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:18px">▣</div>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#2563eb">DOCS</div>
        <div style="font-weight:700;color:#0f172a">Email routes page</div>
      </div>
    </div>
    <div style="color:#334155;line-height:1.65;font-size:14px">Magic link, invoice sent, and payment reminder now have one reference page.</div>
  </div>
</div>

- Internal calendar moved into a step-by-step companion flow
- Email route references now live in a dedicated docs page
- Supabase execution notes were reorganized into execute and deploy checklists

## Release Note Template

Use this format for future updates:

```md
### DD Month YYYY

- what changed
- what was improved
- what to check next
```

## Roadmap Reminder

- keep product changes, docs changes, and infra changes in separate bullets
- note whether a change is customer-facing or internal only
- add dates in full words so release notes are easy to scan later
