const STORAGE = {
  theme: 'work2u-v2-theme',
  view: 'work2u-v2-view',
  auth: 'work2u-v2-auth',
  survey: 'work2u-v2-survey',
  onboardingSeen: 'work2u-v2-onboarding-seen',
  profile: 'work2u-v2-profile',
  members: 'work2u-v2-members',
  workspaceSearch: 'work2u-v2-workspace-search',
  expenseReceiptFilter: 'work2u-v2-expense-receipt-filter',
  expenseReceiptSearch: 'work2u-v2-expense-receipt-search',
  leads: 'work2u-v2-leads',
  clients: 'work2u-v2-clients',
  tasks: 'work2u-v2-tasks',
  cases: 'work2u-v2-cases',
  services: 'work2u-v2-services',
  threads: 'work2u-v2-threads',
  invoices: 'work2u-v2-invoices',
  expenses: 'work2u-v2-expenses',
  ai: 'work2u-v2-ai',
  aiSource: 'work2u-v2-ai-source'
};

const VIEW_META = {
  overview: {
    title: 'Overview',
    subtitle: 'The home base for follow-up, communication, and priority work.',
    note: 'Focus on today. Work2U surfaces hot leads, due tasks, and next actions first.'
  },
  setup: {
    title: 'Setup',
    subtitle: 'Tell Work2U how you work so the dashboard, automation, and language match your flow.',
    note: 'This is the first step. Pick your persona, channels, AI mode, and plan.'
  },
  workspace: {
    title: 'Workspace',
    subtitle: 'Manage leads, clients, tasks, cases, and services in one place.',
    note: 'This is the Sprint 1 core workspace for everyday CRM operations.'
  },
  hub: {
    title: 'Communication',
    subtitle: 'One inbox for WhatsApp, email, and Telegram conversations.',
    note: 'The hub is where AI drafts, follow-ups, and channel routing start.'
  },
  tasks: {
    title: 'Tasks',
    subtitle: 'Track stage, progress, due dates, and priority in one place.',
    note: 'Task flow is designed for sales, operations, and recurring follow-up.'
  },
  clients: {
    title: 'Clients',
    subtitle: 'Every client gets a timeline, service history, and next action.',
    note: 'The client timeline is the business memory layer.'
  },
  calendar: {
    title: 'Calendar',
    subtitle: 'Sync reminders, meetings, and due dates into a single plan.',
    note: 'Calendar events should become reminders, not extra admin work.'
  },
  ai: {
    title: 'AI Copilot',
    subtitle: 'Draft replies, summarize conversations, and turn ideas into workflows.',
    note: 'AI is an assistant first, automation second.'
  },
  access: {
    title: 'Access',
    subtitle: 'Control roles, presets, and member scope for the workspace.',
    note: 'Keep top-level roles simple and manage detail with presets and scope.'
  },
  billing: {
    title: 'Billing',
    subtitle: 'Manage package pricing, region routing, and payment stack.',
    note: 'Malaysia routes to Billplz. Global routes to Stripe.'
  },
  reports: {
    title: 'Reports',
    subtitle: 'Keep an eye on revenue, expenses, and margin health.',
    note: 'PnL should be simple enough to make package pricing decisions.'
  },
  admin: {
    title: 'Admin',
    subtitle: 'Audit billing, plan usage, and platform state.',
    note: 'Super Admin only. Review subscriptions, events, and plan health.'
  }
};

const LABELS = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  telegram: 'Telegram',
  starter: 'Starter',
  elite: 'Elite',
  enterprise: 'Enterprise',
  followup: 'Follow-up',
  invoice: 'Invoice',
  reminder: 'Reminder',
  internal: 'Internal',
  support: 'Support'
};

const PLAN_LIMITS = {
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
    storage: 'Small',
    reporting: 'Basic',
    automationBuilder: false,
    socialManagement: false,
    advancedReports: false
  },
  Elite: {
    maxUsers: 5,
    maxWorkspaces: 1,
    maxMainChannels: 3,
    maxLeadsActive: 1000,
    maxClientsActive: 1000,
    maxTasksActive: 5000,
    maxAiActionsMonth: 1000,
    maxConnectors: 5,
    maxAutomationRules: 15,
    maxStorageGb: 10,
    maxEmailSendsMonth: 5000,
    maxSharedTemplates: 50,
    allowCustomBranding: 1,
    allowCustomPermissions: 0,
    allowCustomWorkflow: 1,
    allowAuditLog: 1,
    allowPrioritySlaSupport: 0,
    allowByoAiKey: 1,
    aiQuota: 'Higher',
    storage: 'Moderate',
    reporting: 'Revenue + PnL',
    automationBuilder: true,
    socialManagement: true,
    advancedReports: true
  },
  Enterprise: {
    maxUsers: 'Custom',
    maxWorkspaces: 'Custom',
    maxMainChannels: 'Custom',
    maxLeadsActive: 'Custom',
    maxClientsActive: 'Custom',
    maxTasksActive: 'Custom',
    maxAiActionsMonth: 'Custom',
    maxConnectors: 'Custom',
    maxAutomationRules: 'Custom',
    maxStorageGb: 'Custom',
    maxEmailSendsMonth: 'Custom',
    maxSharedTemplates: 'Custom',
    allowCustomBranding: 1,
    allowCustomPermissions: 1,
    allowCustomWorkflow: 1,
    allowAuditLog: 1,
    allowPrioritySlaSupport: 1,
    allowByoAiKey: 1,
    aiQuota: 'Custom',
    storage: 'Custom',
    reporting: 'Advanced analytics',
    automationBuilder: true,
    socialManagement: true,
    advancedReports: true
  }
};

const defaultProfile = () => ({
  workspaceName: 'Work2U Studio',
  workspaceId: '',
  persona: 'Freelancer',
  primaryGoal: 'Follow up prospects',
  package: 'Starter',
  channels: ['whatsapp', 'email', 'telegram'],
  accessRole: 'Admin',
  authMethod: 'Email',
  loginEmail: '',
  mailboxType: 'Own email',
  aiMode: 'Suggest only',
  aiSource: 'Work2U managed',
  language: 'BM + English',
  region: 'Malaysia',
  teamSize: '1',
  onboardingStep: 'survey',
  setupComplete: false,
  notes: ''
});

const defaultSurvey = () => ({
  workspaceName: 'Work2U Studio',
  role: 'Freelancer',
  goal: 'Follow up prospects',
  teamSize: '1',
  region: 'Malaysia',
  language: 'BM + English',
  channels: ['whatsapp', 'email', 'telegram'],
  needs: ['tasks', 'hub', 'calendar', 'ai'],
  aiMode: 'Suggest only',
  emailAddress: '',
  mailboxType: 'Own email',
  authMethod: 'email'
});

const defaultAuth = () => ({
  signedIn: false,
  method: 'email',
  email: '',
  userId: null,
  emailVerified: false
});

const defaultMembers = () => ([
  {
    id: 'm-owner',
    name: 'Workspace Owner',
    email: 'owner@work2u.io',
    role: 'Admin',
    preset: 'Manager',
    scope: 'All workspaces',
    status: 'Active'
  }
]);

function defaultMembersForSession(session, profile = defaultProfile()) {
  const email = session?.user?.email || profile.loginEmail || 'owner@work2u.io';
  const displayName = session?.user?.user_metadata?.full_name
    || session?.user?.user_metadata?.name
    || email.split('@')[0]
    || 'Workspace Owner';
  return [{
    id: 'm-owner',
    name: displayName.replace(/\./g, ' '),
    email,
    role: normalizeAccessRole(profile.accessRole),
    preset: 'Manager',
    scope: 'Workspace',
    status: session?.user?.email_confirmed_at ? 'Active' : 'Invited'
  }];
}

const sampleLeads = () => ([
  {
    id: 'lead-1',
    name: 'Aina Rahman',
    company: 'Rahman Property',
    stage: 'hot',
    source: 'WhatsApp',
    value: 3200,
    nextFollowUp: 'Today',
    note: 'Needs quotation and viewing schedule.'
  },
  {
    id: 'lead-2',
    name: 'Daniel Tan',
    company: 'Tan Insurance',
    stage: 'warm',
    source: 'Email',
    value: 1800,
    nextFollowUp: 'Tomorrow',
    note: 'Waiting for document confirmation.'
  },
  {
    id: 'lead-3',
    name: 'Syafiq Zain',
    company: 'Freelance Brand',
    stage: 'cold',
    source: 'Telegram',
    value: 950,
    nextFollowUp: 'Friday',
    note: 'Follow-up after proposal review.'
  }
]);

const sampleClients = () => ([
  {
    id: 'client-1',
    name: 'Aina Rahman',
    company: 'Rahman Property',
    status: 'active',
    service: 'Listing + lead follow-up',
    value: 3200,
    timeline: [
      'Lead captured from WhatsApp.',
      'Quotation sent.',
      'Viewing date proposed.',
      'AI suggested follow-up drafted.'
    ]
  },
  {
    id: 'client-2',
    name: 'Daniel Tan',
    company: 'Tan Insurance',
    status: 'active',
    service: 'Policy renewal assistant',
    value: 1800,
    timeline: [
      'Client converted from email enquiry.',
      'Documents requested.',
      'Reminder scheduled.',
      'Invoice prepared.'
    ]
  }
]);

const sampleTasks = () => ([
  { id: 'task-1', title: 'Follow up Aina on viewing schedule', stage: 'todo', progress: 20, due: 'Today', owner: 'Sales' },
  { id: 'task-2', title: 'Send Daniel document checklist', stage: 'doing', progress: 55, due: 'Tomorrow', owner: 'Finance' },
  { id: 'task-3', title: 'Prepare Syafiq proposal revision', stage: 'review', progress: 75, due: 'Friday', owner: 'Operations' },
  { id: 'task-4', title: 'Archive closed lead notes', stage: 'done', progress: 100, due: 'Done', owner: 'Admin' }
]);

const sampleCases = () => ([
  { id: 'case-1', title: 'Deposit follow-up', type: 'Sales', status: 'open', clientName: 'Aina Rahman', summary: 'Waiting for final confirmation and booking update.' },
  { id: 'case-2', title: 'Policy renewal docs', type: 'Support', status: 'in progress', clientName: 'Daniel Tan', summary: 'Need checklist and signed copy before noon.' }
]);

const sampleServices = () => ([
  { id: 'svc-1', name: 'Lead follow-up service', description: 'Manage prospect communication and reminders.', price: 3200, active: true },
  { id: 'svc-2', name: 'Renewal assistant', description: 'Document follow-up and policy reminder support.', price: 1800, active: true }
]);

const sampleThreads = () => ([
  {
    id: 'th-1',
    channel: 'whatsapp',
    name: 'Aina Rahman',
    subject: 'Viewing follow-up',
    status: 'Hot',
    preview: 'Can we move the viewing to 4pm and send the revised quotation?',
    messages: [
      { role: 'user', text: 'Can we move the viewing to 4pm and send the revised quotation?', at: '10:14' },
      { role: 'ai', text: 'Absolutely. Here is a clean reply you can send: "Sure, 4pm works for me. I will send the revised quotation shortly and update the booking details."', at: '10:15' }
    ]
  },
  {
    id: 'th-2',
    channel: 'email',
    name: 'Daniel Tan',
    subject: 'Documents required',
    status: 'Awaiting reply',
    preview: 'He needs the checklist and invoice PDF before noon.',
    messages: [
      { role: 'user', text: 'Please send the checklist and invoice PDF before noon.', at: '09:48' },
      { role: 'ai', text: 'Draft email ready. It includes a checklist link, invoice summary, and a polite reminder tone.', at: '09:49' }
    ]
  },
  {
    id: 'th-3',
    channel: 'telegram',
    name: 'Syafiq Zain',
    subject: 'Proposal revision',
    status: 'Pending',
    preview: 'Client wants a quick summary and next step.',
    messages: [
      { role: 'user', text: 'Need a shorter proposal summary for client review.', at: 'Yesterday' },
      { role: 'ai', text: 'Here is a crisp version: "Attached is the revised proposal with the key deliverables and timeline. Let me know if you want me to adjust the scope."', at: 'Yesterday' }
    ]
  }
]);

const sampleInvoices = () => ([
  { id: 'inv-1', number: 'INV-2026-001', client: 'Aina Rahman', amount: 3200, status: 'sent', due: 'Today', region: 'Malaysia' },
  { id: 'inv-2', number: 'INV-2026-002', client: 'Daniel Tan', amount: 1800, status: 'paid', due: 'Paid', region: 'Global' },
  { id: 'inv-3', number: 'INV-2026-003', client: 'Syafiq Zain', amount: 950, status: 'draft', due: 'Friday', region: 'Malaysia' }
]);

const sampleExpenses = () => ([
  { id: 'exp-1', description: 'Cloud hosting and backups', amount: 120, category: 'Infrastructure' },
  { id: 'exp-2', description: 'AI usage reserve', amount: 210, category: 'AI' },
  { id: 'exp-3', description: 'Support and tools', amount: 75, category: 'Ops' }
]);

const sampleCalendar = () => ([
  { id: 'cal-1', title: 'Aina viewing', time: 'Today, 4:00 PM', type: 'meeting' },
  { id: 'cal-2', title: 'Daniel follow-up reminder', time: 'Tomorrow, 10:30 AM', type: 'reminder' },
  { id: 'cal-3', title: 'Invoice review', time: 'Friday, 3:00 PM', type: 'billing' }
]);

const state = {
  view: load(STORAGE.view, 'overview'),
  theme: load(STORAGE.theme, 'light'),
  auth: (() => {
    const auth = load(STORAGE.auth, defaultAuth());
    return {
      ...auth,
      method: auth.method === 'google' ? 'google' : 'email'
    };
  })(),
  survey: load(STORAGE.survey, defaultSurvey()),
  authConfigured: false,
  authLoading: true,
  authMessage: 'Checking login setup...',
  authTone: 'warn',
  profile: load(STORAGE.profile, defaultProfile()),
  entitlements: packageEntitlements(load(STORAGE.profile, defaultProfile()).package),
  members: load(STORAGE.members, defaultMembers()),
  workspaceSearch: load(STORAGE.workspaceSearch, ''),
  publicConfig: null,
  onboardingWelcomeOpen: false,
  onboardingWelcomeSeen: load(STORAGE.onboardingSeen, false),
  leads: load(STORAGE.leads, sampleLeads()),
  clients: load(STORAGE.clients, sampleClients()),
  tasks: load(STORAGE.tasks, sampleTasks()),
  cases: load(STORAGE.cases, sampleCases()),
  services: load(STORAGE.services, sampleServices()),
  threads: load(STORAGE.threads, sampleThreads()),
  invoices: load(STORAGE.invoices, sampleInvoices()),
  expenses: load(STORAGE.expenses, sampleExpenses()),
  calendar: load(STORAGE.calendar, sampleCalendar()),
  ai: load(STORAGE.ai, [
    { role: 'assistant', text: 'Hi! I can help draft replies, summarize conversations, and turn your idea into a workflow.', at: 'Welcome' }
  ]),
  billing: null,
  billingAdmin: null,
  expenseRollup: null,
  expenseRollupError: null,
  expenseReceiptUpload: null,
  expenseReceiptError: null,
  expenseReceiptModal: null,
  expenseReceiptModalError: null,
  expenseReceiptModalLoading: false,
  expenseReceiptModalReceiptId: null,
  expenseReceipts: [],
  expenseReceiptsLoading: false,
  expenseReceiptsError: null,
  expenseReceiptFilter: load(STORAGE.expenseReceiptFilter, 'all'),
  expenseReceiptSearch: load(STORAGE.expenseReceiptSearch, ''),
  expenseReceiptDrawerReceiptId: null,
  expenseReceiptDrawerTab: 'overview',
  expenseReceiptDrawerData: null,
  expenseReceiptDrawerLoading: false,
  expenseReceiptDrawerError: null,
  expenseReceiptSelection: [],
  activeThreadId: null,
  activeClientId: null,
  moduleInspector: null,
  memberEditor: null,
  workspaceEditor: null,
  workspaceInspector: null
};

let supabaseClient = null;
let supabaseInitPromise = null;

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : clone(fallback);
  } catch {
    return clone(fallback);
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

function money(value) {
  return Number(value || 0).toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatShortDate(value) {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function billingTrialState(subscription = null) {
  const provider = String(subscription?.provider || '').toLowerCase();
  const trialEndsAt = subscription?.trial_ends_at ? parseDate(subscription.trial_ends_at) : null;
  if (provider !== 'stripe' || !trialEndsAt) return null;

  const msLeft = trialEndsAt.getTime() - Date.now();
  const daysLeft = Math.max(0, Math.ceil(msLeft / 86400000));

  return {
    active: msLeft > 0,
    daysLeft,
    endsAt: trialEndsAt,
    label: msLeft <= 0 ? 'Ends today' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`,
    copy: msLeft <= 0
      ? 'Your 7-day trial ends today.'
      : `Your 7-day trial ends on ${formatShortDate(trialEndsAt)}.`,
    summary: msLeft > 0 ? `${daysLeft} days left` : 'Trial ends today'
  };
}

function syncSurveyLocationStatus(message) {
  const status = document.getElementById('survey-location-status');
  if (status) {
    status.textContent = message || 'You can choose manually, or let Work2U suggest a region using your device location.';
  }
}

function guessSurveyRegionFromTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  if (timezone === 'Asia/Kuala_Lumpur' || timezone === 'Asia/Kuching') return 'Malaysia';
  return 'Global';
}

function guessSurveyRegionFromContext(language = state.survey.language) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const lang = String(language || '').toLowerCase();
  const malaysiaTimezone = timezone === 'Asia/Kuala_Lumpur' || timezone === 'Asia/Kuching';
  const malaysiaLanguage = lang.includes('bahasa') || lang.includes('bm');

  if (malaysiaTimezone || malaysiaLanguage) {
    return {
      region: 'Malaysia',
      reason: malaysiaTimezone
        ? 'Your timezone points to Malaysia.'
        : 'Your language choice points to Malaysia.'
    };
  }

  return {
    region: 'Global',
    reason: 'Timezone and language look more global.'
  };
}

function guessSurveyRegionFromCoordinates(latitude, longitude) {
  const inMalaysia = latitude >= -0.5 && latitude <= 7.8 && longitude >= 99 && longitude <= 120;
  return inMalaysia ? 'Malaysia' : 'Global';
}

function setSurveyRegion(nextRegion, message) {
  const region = nextRegion === 'Malaysia' ? 'Malaysia' : 'Global';
  const regionField = document.getElementById('survey-region');
  if (regionField) regionField.value = region;
  state.survey = { ...state.survey, region };
  save(STORAGE.survey, state.survey);
  updateSurveySummary();
  syncSurveyLocationStatus(message || `Region set to ${region}.`);
}

function detectSurveyRegionFromLocation() {
  const status = document.getElementById('survey-location-status');
  if (status) status.textContent = 'Checking your device location...';

  if (!navigator.geolocation) {
    setSurveyRegion(guessSurveyRegionFromTimezone(), 'Location is not available here, so Work2U used your browser timezone.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const region = guessSurveyRegionFromCoordinates(position.coords.latitude, position.coords.longitude);
      setSurveyRegion(
        region,
        region === 'Malaysia'
          ? 'Your device location suggests Malaysia, so Billplz will be the default route.'
          : 'Your device location suggests Global, so Stripe will be the default route.'
      );
    },
    () => {
      setSurveyRegion(guessSurveyRegionFromTimezone(), 'Location permission was not granted, so Work2U used your browser timezone instead.');
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

function applySurveyRegionSuggestion() {
  const suggestion = guessSurveyRegionFromContext();
  setSurveyRegion(suggestion.region, `Suggested from timezone/language: ${suggestion.reason}`);
}

function surveyHasMeaningfulInput(survey = state.survey) {
  const base = defaultSurvey();
  const channels = (survey.channels || []).join('|');
  const baseChannels = base.channels.join('|');
  const needs = (survey.needs || []).join('|');
  const baseNeeds = base.needs.join('|');
  return [
    survey.workspaceName !== base.workspaceName,
    survey.role !== base.role,
    survey.goal !== base.goal,
    survey.teamSize !== base.teamSize,
    survey.region !== base.region,
    survey.language !== base.language,
    channels !== baseChannels,
    needs !== baseNeeds,
    survey.aiMode !== base.aiMode,
    !!survey.emailAddress,
    survey.mailboxType !== base.mailboxType
  ].some(Boolean);
}

function onboardingWelcomePayload(survey = state.survey) {
  const regionSuggestion = guessSurveyRegionFromContext(survey.language);
  const recommendation = recommendPackage(survey);
  return {
    title: `Welcome, ${survey.role || 'user'}`,
    packageName: recommendation.name,
    packageReason: recommendation.reason,
    region: survey.region || regionSuggestion.region,
    suggestion: regionSuggestion.reason,
    nextSteps: [
      'Review the recommended package',
      'Choose email login',
      'Open the dashboard and start setup'
    ]
  };
}

function refreshOnboardingWelcome() {
  const overlay = document.getElementById('welcome-overlay');
  if (!overlay) return;
  const survey = readSurveyForm();
  const payload = onboardingWelcomePayload(survey);

  const title = document.getElementById('welcome-title');
  if (title) title.textContent = payload.title;

  const summary = document.getElementById('welcome-summary');
  if (summary) {
    summary.innerHTML = `
      <div class="welcome-badge">${esc(payload.packageName)}</div>
      <div class="welcome-copy">${esc(payload.packageReason)}</div>
      <div class="welcome-grid">
        <div class="welcome-tile">
          <span class="tiny">Region</span>
          <strong>${esc(payload.region)}</strong>
        </div>
        <div class="welcome-tile">
          <span class="tiny">Suggested</span>
          <strong>${esc(payload.suggestion)}</strong>
        </div>
      </div>
    `;
  }

  const steps = document.getElementById('welcome-steps');
  if (steps) {
    steps.innerHTML = payload.nextSteps.map((step, index) => `
      <div class="welcome-step">
        <span>${index + 1}</span>
        <div>${esc(step)}</div>
      </div>
    `).join('');
  }
}

function openOnboardingWelcome() {
  const overlay = document.getElementById('welcome-overlay');
  if (!overlay) return;
  refreshOnboardingWelcome();
  state.onboardingWelcomeOpen = true;
  overlay.hidden = false;
  document.body.classList.add('modal-open');
}

function closeOnboardingWelcome(markSeen = true) {
  const overlay = document.getElementById('welcome-overlay');
  if (overlay) overlay.hidden = true;
  state.onboardingWelcomeOpen = false;
  if (markSeen) {
    state.onboardingWelcomeSeen = true;
    save(STORAGE.onboardingSeen, true);
  }
  document.body.classList.remove('modal-open');
  document.getElementById('auth-continue')?.focus();
}

function maybeOpenOnboardingWelcome() {
  if (state.auth.signedIn || state.onboardingWelcomeSeen || state.onboardingWelcomeOpen) return;
  if (!surveyHasMeaningfulInput(state.survey)) return;
  openOnboardingWelcome();
}

function currentOnboardingStage() {
  if (state.auth.signedIn) return 'dashboard';
  if (surveyHasMeaningfulInput(state.survey)) return 'login';
  return 'survey';
}

function refreshOnboardingWizard() {
  const stage = currentOnboardingStage();
  const copy = document.getElementById('onboarding-wizard-copy');
  const progress = document.querySelector('.onboarding-progress-fill');
  const cards = [
    { id: 'onboarding-step-survey', key: 'survey' },
    { id: 'onboarding-step-login', key: 'login' },
    { id: 'onboarding-step-dashboard', key: 'dashboard' }
  ];

  cards.forEach((card, index) => {
    const el = document.getElementById(card.id);
    if (!el) return;
    el.classList.toggle('active', stage === card.key);
    el.classList.toggle('complete', stage === 'dashboard' || (stage === 'login' && index === 0));
  });

  if (progress) {
    progress.style.width = stage === 'survey' ? '34%' : stage === 'login' ? '67%' : '100%';
  }

  if (copy) {
    copy.textContent = stage === 'survey'
      ? 'Step 1 of 3 is active. Fill in the survey so Work2U can recommend the right package and workflow.'
      : stage === 'login'
        ? 'Step 2 of 3 is active. Choose a login path so we can open the dashboard with your settings.'
      : 'Step 3 of 3 is active. Your dashboard is ready, so you can move straight into the CRM.';
  }
}

function focusOnboardingTarget(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (typeof target.focus === 'function') {
    target.focus({ preventScroll: true });
  }
}

function focusSurveyStep() {
  focusOnboardingTarget('#survey-workspace');
}

function focusLoginStep() {
  if (state.auth.method === 'google') {
    focusOnboardingTarget('#auth-continue');
    return;
  }
  focusOnboardingTarget('#auth-email');
}

function focusDashboardStep() {
  if (state.auth.signedIn) {
    setView('overview');
    return;
  }
  focusLoginStep();
}

function firstRelevantModuleRecord(kind) {
  switch (kind) {
    case 'leads':
      return state.leads.find((item) => item.stage === 'hot') || state.leads[0] || null;
    case 'clients':
      return state.clients.find((item) => item.status === 'active') || state.clients[0] || null;
    case 'tasks':
      return state.tasks.find((item) => item.stage !== 'done') || state.tasks[0] || null;
    case 'communication':
      return state.threads.find((item) => item.status === 'Awaiting reply')
        || state.threads.find((item) => item.id === state.activeThreadId)
        || state.threads[0]
        || null;
    case 'billing':
      return state.invoices.find((item) => item.status !== 'paid') || state.invoices[0] || null;
    case 'calendar':
      return state.calendar[0] || null;
    case 'ai copilot':
      return state.ai[state.ai.length - 1] || null;
    case 'reports':
      return state.invoices.find((item) => item.status === 'paid') || state.invoices[0] || null;
    default:
      return null;
  }
}

function modulePrimaryActionLabel(kind, record) {
  switch (kind) {
    case 'leads':
      return `Open ${record?.name || 'hot lead'}`;
    case 'clients':
      return `Open ${record?.name || 'active client'}`;
    case 'tasks':
      return `Open ${record?.title || 'pending task'}`;
    case 'communication':
      return `Open ${record?.name || 'hot thread'}`;
    case 'billing':
      return `Open ${record?.number || 'billing'}`;
    case 'calendar':
      return `Open ${record?.title || 'calendar event'}`;
    case 'ai copilot':
      return 'Open AI Copilot';
    case 'reports':
      return 'Open reports';
    default:
      return 'Open module';
  }
}

function moduleSecondaryActionLabel(kind) {
  switch (kind) {
    case 'leads':
      return 'Open tasks';
    case 'clients':
      return 'Open billing';
    case 'tasks':
      return 'Open calendar';
    case 'communication':
      return 'Open AI Copilot';
    case 'billing':
      return 'Open reports';
    case 'calendar':
      return 'Open tasks';
    case 'ai copilot':
      return 'Open setup';
    case 'reports':
      return 'Open billing';
    default:
      return 'Open overview';
  }
}

function openModuleShortcut(kind, target = 'primary') {
  const record = firstRelevantModuleRecord(kind);
  closeModuleDetail();

  switch (kind) {
    case 'leads':
      setView('workspace');
      if (record && target === 'primary') setWorkspaceInspector('lead', record.id);
      if (target === 'secondary') setView('tasks');
      return;
    case 'clients':
      setView('clients');
      if (record && target === 'primary') selectClient(record.id);
      if (target === 'secondary') setView('billing');
      return;
    case 'tasks':
      setView('workspace');
      if (record && target === 'primary') setWorkspaceInspector('task', record.id);
      if (target === 'secondary') setView('calendar');
      return;
    case 'communication':
      setView('hub');
      if (record && target === 'primary') selectThread(record.id);
      if (target === 'secondary') setView('ai');
      return;
    case 'billing':
      setView('billing');
      if (target === 'secondary') setView('reports');
      return;
    case 'calendar':
      setView('calendar');
      if (target === 'secondary') setView('tasks');
      return;
    case 'ai copilot':
      setView('ai');
      if (target === 'secondary') setView('setup');
      return;
    case 'reports':
      setView('reports');
      if (target === 'secondary') setView('billing');
      return;
    default:
      setView('overview');
  }
}

function refreshModuleDetail() {
  const kind = state.moduleInspector;
  const overlay = document.getElementById('module-detail-overlay');
  if (!overlay || !kind) return;
  const payload = moduleDetailPayload(kind);

  const title = document.getElementById('module-detail-title');
  if (title) title.textContent = payload.title;

  const copy = document.getElementById('module-detail-copy');
  if (copy) copy.textContent = payload.copy;

  const meta = document.getElementById('module-detail-meta');
  if (meta) {
    meta.innerHTML = `
      <span class="status-pill">${esc(payload.status)}</span>
      <span class="status-pill">${esc(payload.countLabel)}</span>
      <span class="status-pill">${esc(payload.routeLabel)}</span>
    `;
  }

  const checklist = document.getElementById('module-detail-checklist');
  if (checklist) {
    checklist.innerHTML = payload.checklist.map((item, index) => `
      <div class="module-detail-step">
        <span>${index + 1}</span>
        <div>
          <strong>${esc(item.title)}</strong>
          <div class="tiny">${esc(item.copy)}</div>
        </div>
      </div>
    `).join('');
  }

  const actions = document.getElementById('module-detail-actions');
  if (actions) {
    actions.innerHTML = payload.actions.map((action) => `
      <button class="${action.primary ? 'primary-btn' : 'soft-btn'}" type="button" onclick="${action.onclick}">
        ${esc(action.label)}
      </button>
    `).join('');
  }
}

function moduleDetailPayload(kind) {
  const data = overviewData();
  const primaryRecord = firstRelevantModuleRecord(kind);
  const map = {
    leads: {
      title: 'Leads',
      copy: 'Prospects are where the sales pipeline starts. Keep stage, source, and follow-up date visible so nothing slips.',
      status: `${state.leads.length} leads`,
      countLabel: `${state.leads.filter((item) => item.stage === 'hot').length} hot`,
      routeLabel: 'Workspace + Hub',
      checklist: [
        { title: 'Capture the lead', copy: 'Add name, company, source, and next follow-up.' },
        { title: 'Qualify the stage', copy: 'Move from cold to warm to hot as attention increases.' },
        { title: 'Push to task', copy: 'Create reminders so follow-up happens on time.' }
      ],
      actions: [
        { label: modulePrimaryActionLabel('leads', primaryRecord), onclick: "openModuleShortcut('leads', 'primary')", primary: true },
        { label: 'Open tasks', onclick: "openModuleShortcut('leads', 'secondary')" }
      ]
    },
    clients: {
      title: 'Clients',
      copy: 'Converted clients keep their service history, billing connection, and next actions in one place.',
      status: `${state.clients.length} clients`,
      countLabel: `${state.clients.filter((item) => item.status === 'active').length} active`,
      routeLabel: 'Clients + Billing',
      checklist: [
        { title: 'Attach service history', copy: 'Store the work scope and timeline on the client record.' },
        { title: 'Keep payment linked', copy: 'Tie invoices and receipts to the same account.' },
        { title: 'Review next action', copy: 'Make sure the next step is visible before outreach.' }
      ],
      actions: [
        { label: modulePrimaryActionLabel('clients', primaryRecord), onclick: "openModuleShortcut('clients', 'primary')", primary: true },
        { label: 'Open billing', onclick: "openModuleShortcut('clients', 'secondary')" }
      ]
    },
    tasks: {
      title: 'Tasks',
      copy: 'Tasks track stage, progress, and ownership. This is the control center for daily execution.',
      status: `${state.tasks.length} tasks`,
      countLabel: `${data.pendingTasks.length} pending`,
      routeLabel: 'Tasks + Calendar',
      checklist: [
        { title: 'Set stage', copy: 'Use todo, doing, review, and done to make progress obvious.' },
        { title: 'Track ownership', copy: 'Assign the task owner so reminders reach the right person.' },
        { title: 'Sync due date', copy: 'Keep due dates aligned with the calendar reminder layer.' }
      ],
      actions: [
        { label: modulePrimaryActionLabel('tasks', primaryRecord), onclick: "openModuleShortcut('tasks', 'primary')", primary: true },
        { label: 'Open calendar', onclick: "openModuleShortcut('tasks', 'secondary')" }
      ]
    },
    communication: {
      title: 'Communication',
      copy: 'WhatsApp, email, and Telegram stay in one place so AI can help draft, route, and follow up.',
      status: `${state.threads.length} threads`,
      countLabel: `${state.threads.filter((item) => item.status === 'Awaiting reply').length} awaiting reply`,
      routeLabel: 'Hub + AI',
      checklist: [
        { title: 'Pick the channel', copy: 'Choose WhatsApp, email, or Telegram based on context.' },
        { title: 'Use AI draft', copy: 'Let AI suggest the reply before sending it out.' },
        { title: 'Create next action', copy: 'Turn every message into a task or reminder.' }
      ],
      actions: [
        { label: modulePrimaryActionLabel('communication', primaryRecord), onclick: "openModuleShortcut('communication', 'primary')", primary: true },
        { label: 'Open AI Copilot', onclick: "openModuleShortcut('communication', 'secondary')" }
      ]
    },
    billing: {
      title: 'Billing',
      copy: 'Billing keeps packages, invoices, and receipts tied to the business instead of scattered across tools.',
      status: `${state.invoices.length} invoices`,
      countLabel: `RM ${money(data.outstanding)} outstanding`,
      routeLabel: state.profile.region === 'Malaysia' ? 'Billplz' : 'Stripe',
      checklist: [
        { title: 'Create invoice', copy: 'Keep invoice data linked to the client and service.' },
        { title: 'Send receipt', copy: 'Download or send the document through email or WhatsApp.' },
        { title: 'Track cash flow', copy: 'Review what has been paid and what is still due.' }
      ],
      actions: [
        { label: modulePrimaryActionLabel('billing', primaryRecord), onclick: "openModuleShortcut('billing', 'primary')", primary: true },
        { label: 'Open reports', onclick: "openModuleShortcut('billing', 'secondary')" }
      ]
    },
    calendar: {
      title: 'Calendar',
      copy: 'Internal calendar keeps reminders and meetings connected to the same workflow as tasks and client work.',
      status: `${state.calendar.length} events`,
      countLabel: 'Internal calendar',
      routeLabel: 'Calendar + Tasks',
      checklist: [
        { title: 'Create event', copy: 'Schedule meetings and reminders from the same workspace.' },
        { title: 'Link task', copy: 'Tie the calendar event to a task or client follow-up.' },
        { title: 'Send reminder', copy: 'Keep the phone notification layer aligned with business priorities.' }
      ],
      actions: [
        { label: modulePrimaryActionLabel('calendar', primaryRecord), onclick: "openModuleShortcut('calendar', 'primary')", primary: true },
        { label: 'Open tasks', onclick: "openModuleShortcut('calendar', 'secondary')" }
      ]
    },
    'ai copilot': {
      title: 'AI Copilot',
      copy: 'AI helps the user write faster, think through implementation, and automate the small follow-up jobs.',
      status: `${state.ai.length} messages`,
      countLabel: state.profile.aiMode,
      routeLabel: 'AI + Workflow',
      checklist: [
        { title: 'Draft the reply', copy: 'Use AI to suggest what to say before sending.' },
        { title: 'Summarize context', copy: 'Turn long chats into short action items.' },
        { title: 'Shape the workflow', copy: 'Use AI to turn a business idea into process.' }
      ],
      actions: [
        { label: modulePrimaryActionLabel('ai copilot', primaryRecord), onclick: "openModuleShortcut('ai copilot', 'primary')", primary: true },
        { label: 'Open setup', onclick: "openModuleShortcut('ai copilot', 'secondary')" }
      ]
    },
    reports: {
      title: 'Reports',
      copy: 'Reports show revenue, expenses, and P&L so the package strategy stays grounded in real numbers.',
      status: `RM ${money(data.revenue)} revenue`,
      countLabel: `${data.margin}% margin`,
      routeLabel: 'Reports + Billing',
      checklist: [
        { title: 'Review revenue', copy: 'See paid invoices and cash received.' },
        { title: 'Review expenses', copy: 'Track hosting, AI, and support costs.' },
        { title: 'Adjust pricing', copy: 'Use the numbers to decide whether Starter, Elite, or Enterprise fits.' }
      ],
      actions: [
        { label: modulePrimaryActionLabel('reports', primaryRecord), onclick: "openModuleShortcut('reports', 'primary')", primary: true },
        { label: 'Open billing', onclick: "openModuleShortcut('reports', 'secondary')" }
      ]
    }
  };

  return map[kind] || map.leads;
}

function openModuleDetail(kind) {
  state.moduleInspector = kind;
  render();
  refreshModuleDetail();
  const overlay = document.getElementById('module-detail-overlay');
  if (overlay) overlay.hidden = false;
  document.body.classList.add('modal-open');
}

function closeModuleDetail() {
  const overlay = document.getElementById('module-detail-overlay');
  state.moduleInspector = null;
  render();
  if (overlay) overlay.hidden = true;
  document.body.classList.remove('modal-open');
}

function label(key) {
  return LABELS[key] || key;
}

function channelList(list) {
  return (list || []).map((item) => `<span class="chip">${label(item)}</span>`).join('');
}

function setTheme(nextTheme) {
  state.theme = nextTheme;
  document.body.dataset.theme = nextTheme;
  save(STORAGE.theme, nextTheme);
}

function setView(view) {
  if (!canAccessView(view)) {
    updateAuthStatus(`Your ${normalizeAccessRole(state.profile.accessRole)} role cannot open ${VIEW_META[view]?.title || view}.`, 'warn');
    return;
  }
  state.view = view;
  save(STORAGE.view, view);
  render();
}

function toggleTheme() {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
}

function updateShell() {
  const profile = state.profile || defaultProfile();
  document.getElementById('workspace-name').textContent = profile.workspaceName;
  document.getElementById('workspace-meta').textContent = [
    profile.persona,
    profile.package,
    profile.language,
    profile.accessRole,
    profile.authMethod ? `${profile.authMethod} login` : ''
  ].filter(Boolean).join(' · ');
  document.getElementById('sidebar-note-body').textContent = VIEW_META[state.view]?.note || VIEW_META.overview.note;
  document.getElementById('page-title').textContent = VIEW_META[state.view]?.title || 'Overview';
  document.getElementById('page-subtitle').textContent = VIEW_META[state.view]?.subtitle || '';
  document.getElementById('quick-setup').textContent = profile.setupComplete ? 'Edit setup' : 'Continue setup';
  const signOut = document.getElementById('signout-btn');
  if (signOut) signOut.hidden = !state.auth.signedIn;
  document.querySelectorAll('.nav-item').forEach((btn) => {
    const allowed = canAccessView(btn.dataset.view);
    btn.classList.toggle('active', btn.dataset.view === state.view);
    btn.disabled = !allowed;
    btn.classList.toggle('locked', !allowed);
  });
}

function ensureSeedData() {
  if (!state.leads.length) state.leads = sampleLeads();
  if (!state.clients.length) state.clients = sampleClients();
  if (!state.tasks.length) state.tasks = sampleTasks();
  if (!state.cases.length) state.cases = sampleCases();
  if (!state.services.length) state.services = sampleServices();
  if (!state.threads.length) state.threads = sampleThreads();
  if (!state.invoices.length) state.invoices = sampleInvoices();
  if (!state.expenses.length) state.expenses = sampleExpenses();
  if (!state.calendar.length) state.calendar = sampleCalendar();
  if (!state.members.length) state.members = defaultMembers();
  state.activeThreadId = state.activeThreadId || state.threads[0]?.id || null;
  state.activeClientId = state.activeClientId || state.clients[0]?.id || null;
}

function persistCollection(name) {
  save(STORAGE[name], state[name]);
}

function saveProfile(nextProfile) {
  const sanitized = sanitizeProfileForPlan(nextProfile);
  state.profile = sanitized;
  state.entitlements = currentEntitlements(sanitized.package);
  save(STORAGE.profile, sanitized);
  const nextWorkspace = sanitized.workspaceName || defaultProfile().workspaceName;
  document.getElementById('workspace-name').textContent = nextWorkspace;
  updateShell();
  void syncProfileToSupabase(sanitized);
}

async function syncBillingStateFromServer() {
  const email = state.profile.loginEmail || state.auth.email || '';
  const workspace = state.profile.workspaceName || defaultProfile().workspaceName;
  if (!email && !workspace) return null;

  try {
    const params = new URLSearchParams({
      email,
      workspace,
      provider: state.profile.region === 'Malaysia' ? 'billplz' : 'stripe'
    });
    const response = await fetch(`/api/billing/state?${params.toString()}`);
    if (!response.ok) return null;

    const data = await response.json();
    state.billing = data;
    state.entitlements = resolveEffectiveEntitlements(state.profile.package, data?.entitlement || null);

    const subscription = data?.subscription;
    if (subscription?.status === 'active') {
      const nextPlan = normalizePackageName(subscription.plan_code || subscription.plan || state.profile.package);
      if (nextPlan && nextPlan !== state.profile.package) {
        saveProfile({ ...state.profile, package: nextPlan });
      }
    }

    render();
    if (isSuperAdmin()) {
      void syncBillingAdminFromServer();
    }
    return data;
  } catch {
    return null;
  }
}

async function syncBillingAdminFromServer() {
  if (!isSuperAdmin()) return null;
  try {
    const response = await fetch('/api/billing/state?scope=admin');
    if (!response.ok) return null;
    const data = await response.json();
    state.billingAdmin = data;
    render();
    return data;
  } catch {
    return null;
  }
}

async function openBillingPortal() {
  try {
    updateAuthStatus('Opening billing portal...', 'warn');
    const response = await fetch('/api/billing/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: state.profile.region === 'Malaysia' ? 'billplz' : 'stripe',
        email: state.profile.loginEmail || state.auth.email || '',
        name: state.profile.workspaceName || 'Work2U Customer',
        workspaceName: state.profile.workspaceName || 'Work2U',
        region: state.profile.region || 'Global',
        plan: state.profile.package || 'Starter'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Billing portal could not be opened');
    }

    if (data.portalUrl) {
      updateAuthStatus('Redirecting to billing portal...', 'good');
      window.location.href = data.portalUrl;
      return;
    }

    updateAuthStatus(data.message || 'Billing portal is not available yet.', 'warn');
  } catch (error) {
    updateAuthStatus(error.message || 'Billing portal could not be opened', 'bad');
  }
}

function profileToRow(profile, auth = state.auth) {
  const userId = auth?.userId || null;
  const email = auth?.email || profile.loginEmail || '';
  return {
    id: userId,
    email,
    workspace_id: profile.workspaceId || null,
    workspace_name: profile.workspaceName,
    persona: profile.persona,
    primary_goal: profile.primaryGoal,
    package: profile.package,
    channels: profile.channels,
    access_role: normalizeAccessRole(profile.accessRole),
    auth_method: profile.authMethod,
    login_email: profile.loginEmail || email,
    mailbox_type: profile.mailboxType,
    ai_mode: profile.aiMode,
    ai_source: profile.aiSource,
    language: profile.language,
    region: profile.region,
    team_size: profile.teamSize,
    setup_complete: !!profile.setupComplete,
    notes: profile.notes || '',
    onboarding_step: profile.setupComplete ? 'complete' : 'survey',
    login_state: auth?.emailVerified ? 'verified' : 'pending_verification',
    last_login_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function rowToProfile(row, fallback = {}) {
  if (!row) return null;
  return {
    ...defaultProfile(),
    ...fallback,
    workspaceId: row.workspace_id || fallback.workspaceId || null,
    workspaceName: row.workspace_name || fallback.workspaceName || defaultProfile().workspaceName,
    persona: row.persona || fallback.persona || defaultProfile().persona,
    primaryGoal: row.primary_goal || fallback.primaryGoal || defaultProfile().primaryGoal,
    package: row.package || fallback.package || defaultProfile().package,
    channels: Array.isArray(row.channels) ? row.channels : fallback.channels || defaultProfile().channels,
    accessRole: normalizeAccessRole(row.access_role || fallback.accessRole || defaultProfile().accessRole),
    authMethod: row.auth_method || fallback.authMethod || defaultProfile().authMethod,
    loginEmail: row.login_email || row.email || fallback.loginEmail || '',
    mailboxType: row.mailbox_type || fallback.mailboxType || defaultProfile().mailboxType,
    aiMode: row.ai_mode || fallback.aiMode || defaultProfile().aiMode,
    aiSource: row.ai_source || fallback.aiSource || defaultProfile().aiSource,
    language: row.language || fallback.language || defaultProfile().language,
    region: row.region || fallback.region || defaultProfile().region,
    teamSize: row.team_size || fallback.teamSize || defaultProfile().teamSize,
    setupComplete: typeof row.setup_complete === 'boolean' ? row.setup_complete : !!fallback.setupComplete,
    notes: row.notes || fallback.notes || '',
    onboardingStep: row.onboarding_step || (row.setup_complete ? 'complete' : 'survey'),
    lastLoginAt: row.last_login_at || null
  };
}

async function loadProfileFromSupabase(userId) {
  const client = await getSupabaseClient();
  if (!client || !userId) return null;
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .limit(1);

  if (error) {
    updateAuthStatus(`Could not load your profile: ${error.message}`, 'warn');
    return null;
  }

  return rowToProfile(data?.[0] || null, state.survey);
}

async function syncProfileToSupabase(profile) {
  if (!state.auth.signedIn) return null;
  const client = await getSupabaseClient();
  if (!client) return null;
  const row = profileToRow(profile);
  const { error, data } = await client
    .from('profiles')
    .upsert(row, { onConflict: 'id' })
    .select();

  if (error) {
    updateAuthStatus(`Profile sync skipped: ${error.message}`, 'warn');
    return null;
  }

  return data?.[0] || null;
}

function memberToRow(member, ownerId = state.auth.userId, workspaceName = state.profile.workspaceName) {
  return {
    id: member.id,
    owner_id: ownerId,
    workspace_name: workspaceName,
    name: member.name,
    email: member.email || '',
    role: member.role,
    preset: member.preset,
    scope: member.scope,
    status: member.status,
    updated_at: new Date().toISOString(),
    created_at: member.createdAt || new Date().toISOString()
  };
}

function rowToMember(row) {
  return {
    id: row.id,
    name: row.name || 'Member',
    email: row.email || '',
    role: row.role || 'User',
    preset: row.preset || 'Operations',
    scope: row.scope || 'Workspace',
    status: row.status || 'Active',
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null
  };
}

async function loadMembersFromSupabase(ownerId) {
  const client = await getSupabaseClient();
  if (!client || !ownerId) return [];
  const { data, error } = await client
    .from('workspace_members')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true });

  if (error) {
    updateAuthStatus(`Could not load team members: ${error.message}`, 'warn');
    return [];
  }

  return (data || []).map(rowToMember);
}

async function syncMemberToSupabase(member) {
  if (!state.auth.signedIn) return null;
  const client = await getSupabaseClient();
  if (!client) return null;
  const row = memberToRow(member);
  const { error, data } = await client
    .from('workspace_members')
    .upsert(row, { onConflict: 'id' })
    .select();

  if (error) {
    updateAuthStatus(`Member sync skipped: ${error.message}`, 'warn');
    return null;
  }

  return data?.[0] || null;
}

async function deleteMemberFromSupabase(memberId) {
  if (!state.auth.signedIn) return;
  const client = await getSupabaseClient();
  if (!client) return;
  await client
    .from('workspace_members')
    .delete()
    .eq('id', memberId)
    .eq('owner_id', state.auth.userId);
}

function pageCards(items) {
  return items.map((item) => `
    <article class="metric">
      <div class="metric-label">${esc(item.label)}</div>
      <div class="metric-value">${esc(item.value)}</div>
      <div class="metric-sub">${esc(item.sub || '')}</div>
    </article>
  `).join('');
}

function overviewData() {
  const pendingTasks = state.tasks.filter((t) => t.stage !== 'done');
  const hotLeads = state.leads.filter((l) => l.stage === 'hot').length;
  const outstanding = state.invoices.filter((inv) => inv.status !== 'paid').reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  const revenue = state.invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  const expense = state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return { pendingTasks, hotLeads, outstanding, revenue, expense, margin: revenue ? (((revenue - expense) / revenue) * 100).toFixed(1) : '0.0' };
}

function launchReadinessSnapshot() {
  const config = state.publicConfig || {};
  const region = state.profile.region || 'Malaysia';
  const billingReady = region === 'Malaysia' ? !!config.billing?.billplzReady : !!config.billing?.stripeReady;
  return {
    region,
    items: [
      { title: 'Public policy pages', copy: 'Privacy Policy and Service Policy are ready for review and public launch.' },
      { title: 'Email login', copy: config.auth?.supabaseReady ? 'Supabase Auth is ready for email login and magic link flow.' : 'Supabase Auth still needs to be connected.' },
      { title: 'Resend mailing', copy: config.mail?.resendReady ? `Sender ready: ${config.mail.from}` : 'Resend sender details still need to be filled.' },
      { title: `${region} billing`, copy: billingReady ? (region === 'Malaysia' ? 'Billplz route is ready for local payment flow.' : 'Stripe route is ready for global payment flow.') : (region === 'Malaysia' ? 'Billplz keys still need to be filled.' : 'Stripe keys still need to be filled.') },
      { title: 'Final go-live check', copy: 'Open the final launch checklist before publishing the workspace.' }
    ]
  };
}

function renderTrialBanner(subscription = state.billing?.subscription) {
  const trial = billingTrialState(subscription);
  if (!trial) return '';

  return `
    <section class="panel" style="margin-bottom:18px;border-color:rgba(21,101,216,0.22);background:linear-gradient(135deg, rgba(21,101,216,0.08), rgba(15,118,110,0.06));">
      <div class="section-title">
        <div>
          <h3>7-day trial</h3>
          <p>${esc(trial.copy)} Cancel anytime from the billing portal when you are ready.</p>
        </div>
        <span class="status-pill ${trial.active ? '' : 'warn'}">${esc(trial.label)}</span>
      </div>
      <div class="topbar-actions">
        <button class="soft-btn" type="button" onclick="syncBillingStateFromServer()">Refresh trial status</button>
        <button class="primary-btn" type="button" onclick="openBillingPortal()">Manage billing</button>
      </div>
    </section>
  `;
}

function render() {
  updateShell();
  const root = document.getElementById('view-root');
  const safeView = canAccessView(state.view) ? state.view : 'overview';
  if (safeView !== state.view) {
    state.view = safeView;
    save(STORAGE.view, state.view);
    updateShell();
  }
  const views = {
    overview: renderOverview,
    setup: renderSetup,
    workspace: renderWorkspace,
    hub: renderHub,
    tasks: renderTasks,
    clients: renderClients,
    calendar: renderCalendar,
    ai: renderAI,
    access: renderAccess,
    billing: renderBilling,
    reports: renderReports,
    admin: renderAdmin
  };
  root.innerHTML = views[safeView] ? views[safeView]() : renderOverview();
  syncAuthGate();
}

function renderOverview() {
  const profile = state.profile;
  const data = overviewData();
  const readiness = launchReadinessSnapshot();
  const nextTask = state.tasks.find((task) => task.stage !== 'done') || state.tasks[0];
  const hotLead = state.leads.find((lead) => lead.stage === 'hot') || state.leads[0];
  const activeThread = state.threads.find((thread) => thread.id === state.activeThreadId) || state.threads[0];
  return `
    <section class="hero">
      <div class="panel hero-copy">
        <div class="eyebrow">Priority-first workspace</div>
        <h2>${esc(profile.workspaceName)}</h2>
        <p>Work2U keeps prospect follow-up, reminders, client history, billing, and AI drafting in one calm operating layer. Use it to stay focused on the next priority instead of remembering everything manually.</p>
        <div class="chip-row">
          <span class="chip">${esc(profile.persona)}</span>
          <span class="chip">${esc(profile.package)} plan</span>
          <span class="chip">${esc(profile.accessRole)}</span>
          <span class="chip">${esc(profile.language)}</span>
          <span class="chip">${esc(profile.authMethod || 'Email')} login</span>
          <span class="chip">${esc(profile.aiMode)}</span>
        </div>
      </div>
      <div class="panel hero-panel">
        <div class="action-card">
          <strong>Today's focus</strong>
          <p>${esc(nextTask?.title || 'No urgent task yet')}</p>
          <span class="status-pill">${esc(nextTask?.due || 'Next up')}</span>
        </div>
        <div class="action-card">
          <strong>Hot lead</strong>
          <p>${esc(hotLead?.name || 'No lead yet')} · ${esc(hotLead?.company || '')}</p>
          <span class="status-pill warn">${esc(hotLead?.stage || 'warm')}</span>
        </div>
        <div class="action-card">
          <strong>Inbox signal</strong>
          <p>${esc(activeThread?.subject || 'No thread yet')}</p>
          <span class="status-pill">${esc(activeThread?.channel || 'inbox')}</span>
        </div>
      </div>
    </section>

    ${renderTrialBanner()}
    ${renderCoreFlow()}
    ${renderModuleMatrix(data)}

    <section class="metric-grid">
      ${pageCards([
        { label: 'Pending Tasks', value: data.pendingTasks.length, sub: 'Need follow-up or execution' },
        { label: 'Hot Leads', value: data.hotLeads, sub: 'Ready for next action' },
        { label: 'Outstanding', value: `RM ${money(data.outstanding)}`, sub: 'Invoice value pending' },
        { label: 'Margin', value: `${data.margin}%`, sub: 'Revenue minus expenses' }
      ])}
    </section>

    <section class="split">
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Next Actions</h3>
            <p>What Work2U should help you handle first.</p>
          </div>
          <button class="soft-btn" onclick="setView('setup')">Adjust setup</button>
        </div>
        <div class="stack">
          ${renderActionCard('Continue onboarding', profile.setupComplete ? 'Refine your workspace profile for better automation and channel routing.' : 'Finish your workspace setup to unlock personalized defaults.', 'setup')}
          ${renderActionCard('Review hot lead', hotLead ? `${hotLead.name} needs a response in ${hotLead.nextFollowUp}.` : 'No lead available.', 'hub')}
          ${renderActionCard("Check today's task", nextTask ? `${nextTask.title} is scheduled for ${nextTask.due}.` : 'No task yet.', 'tasks')}
          ${renderActionCard('Review billing', `Revenue RM ${money(data.revenue)} against expenses RM ${money(data.expense)}.`, 'billing')}
        </div>
      </div>
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Workspace Snapshot</h3>
            <p>Persona-aware control panel.</p>
          </div>
        </div>
        <div class="grid-2">
          ${pageCards([
            { label: 'Channels', value: state.profile.channels.map(label).join(', '), sub: 'Primary communication' },
            { label: 'AI Source', value: state.profile.aiSource, sub: 'Bring your own key or managed' },
            { label: 'Region', value: state.profile.region, sub: 'Billing route' },
            { label: 'Team Size', value: state.profile.teamSize, sub: 'Workspace capacity' }
          ])}
        </div>
      </div>
    </section>

    <section class="split">
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Launch Readiness</h3>
            <p>The shortest path from setup to go-live.</p>
          </div>
        </div>
        <div class="stack">
          ${readiness.items.map((item) => miniLine(item.title, item.copy)).join('')}
        </div>
        <div class="topbar-actions" style="margin-top:16px;">
          <a class="soft-btn" href="/launch-checklist.html">Open launch checklist</a>
          <a class="ghost-btn" href="/privacy-policy.html">Review policy pages</a>
        </div>
      </div>
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Launch Path</h3>
            <p>We keep the first release focused and easy to verify.</p>
          </div>
        </div>
        <div class="stack">
          ${miniLine('1. Survey', 'Capture persona, channels, language, and AI preference')}
          ${miniLine('2. Login', 'Use email magic link')}
          ${miniLine('3. Connect', 'Attach messaging, email, and internal calendar')}
          ${miniLine('4. Bill', `Use ${readiness.region === 'Malaysia' ? 'Billplz' : 'Stripe'} for the active region`)}
          ${miniLine('5. Go live', 'Check entitlements, webhook events, and the final launch checklist')}
        </div>
      </div>
    </section>
  `;
}

function renderModuleMatrix(data = overviewData()) {
  const activeClients = state.clients.filter((client) => client.status === 'active').length;
  const hotLeads = state.leads.filter((lead) => lead.stage === 'hot').length;
  const unreadThreads = state.threads.filter((thread) => thread.status === 'Awaiting reply').length;
  const unpaidInvoices = state.invoices.filter((invoice) => invoice.status !== 'paid').length;
  const calendarEvents = state.calendar.length;
  const modules = [
    {
      key: 'leads',
      name: 'Leads',
      value: state.leads.length,
      status: `${hotLeads} hot`,
      copy: 'Capture prospects, label the stage, and keep the next follow-up visible.'
    },
    {
      key: 'clients',
      name: 'Clients',
      value: activeClients,
      status: `${state.clients.length} total`,
      copy: 'Converted accounts stay connected to services, timeline, and billing.'
    },
    {
      key: 'tasks',
      name: 'Tasks',
      value: data.pendingTasks.length,
      status: `${state.tasks.length} total`,
      copy: 'Track stage and progress so work moves from todo to done without friction.'
    },
    {
      key: 'communication',
      name: 'Communication',
      value: unreadThreads,
      status: `${state.threads.length} threads`,
      copy: 'WhatsApp, email, and Telegram stay in one follow-up lane with AI drafts.'
    },
    {
      key: 'billing',
      name: 'Billing',
      value: unpaidInvoices,
      status: `RM ${money(data.outstanding)} due`,
      copy: 'Invoices and receipts stay attached to the client and the payment route.'
    },
    {
      key: 'calendar',
      name: 'Calendar',
      value: calendarEvents,
      status: 'Internal sync',
      copy: 'Meetings, reminders, and task dates stay aligned across mobile and desktop without external dependency.'
    },
    {
      key: 'ai copilot',
      name: 'AI Copilot',
      value: state.ai.length,
      status: state.profile.aiMode,
      copy: 'AI suggests the next message, helps structure ideas, and supports automation.'
    },
    {
      key: 'reports',
      name: 'Reports',
      value: `RM ${money(data.revenue)}`,
      status: `${data.margin}% margin`,
      copy: 'Revenue, expenses, and P&L stay visible so pricing decisions stay grounded.'
    }
  ];

  return `
    <section class="panel module-dashboard">
      <div class="section-title">
        <div>
          <h3>Module dashboard</h3>
          <p>Each module stays visible with a live snapshot of what needs attention.</p>
        </div>
        <span class="status-pill">Live summary</span>
      </div>
      <div class="module-grid">
        ${modules.map((module) => `
          <button class="module-card module-card-button${state.moduleInspector === module.key ? ' active' : ''}" type="button" onclick="openModuleDetail('${module.key}')">
            <div class="module-card-top">
              <div>
                <div class="tiny">${esc(module.name)}</div>
                <strong>${esc(module.value)}</strong>
              </div>
              <span class="status-pill">${esc(module.status)}</span>
            </div>
            <p>${esc(module.copy)}</p>
          </button>
        `).join('')}
      </div>
    </section>
  `;
}

function renderCoreFlow() {
  const coreSteps = [
    {
      title: 'Capture',
      copy: 'Survey, leads, and incoming messages land into one structured workspace.'
    },
    {
      title: 'Coordinate',
      copy: 'Tasks, calendar, reminders, and team follow-up stay linked to the same record.'
    },
    {
      title: 'Close',
      copy: 'Invoices, receipts, reports, and client history stay ready for review.'
    }
  ];

  return `
    <section class="split core-flow-section">
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Core CRM flow</h3>
            <p>The shortest path from lead to client to billing.</p>
          </div>
        </div>
        <div class="stack">
          ${coreSteps.map((step, index) => `
            <div class="action-card">
              <div class="pill-line">
                <span class="status-pill">0${index + 1}</span>
                <span class="status-pill">${esc(step.title)}</span>
              </div>
              <strong style="display:block;margin-top:10px;">${esc(step.title)}</strong>
              <p style="margin:6px 0 0;">${esc(step.copy)}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Modules that stay connected</h3>
            <p>Every module feeds the same profile, billing, and reminder layer.</p>
          </div>
        </div>
        <div class="grid-2">
          ${pageCards([
            { label: 'Leads', value: 'Hot / Warm / Cold', sub: 'Capture prospects before conversion' },
            { label: 'Clients', value: 'Timeline + Service', sub: 'Keep post-sale history attached' },
            { label: 'Tasks', value: 'Stage + Progress', sub: 'Track work until done' },
            { label: 'Cases', value: 'Support + Exceptions', sub: 'Resolve issues with context' },
            { label: 'Billing', value: 'Invoices + Receipt', sub: 'Match payments to clients' },
            { label: 'Calendar', value: 'Internal Sync', sub: 'Reminders and meetings stay aligned' }
          ])}
        </div>
      </div>
    </section>
  `;
}

function renderActionCard(title, copy, view) {
  return `
    <article class="action-card">
      <strong>${esc(title)}</strong>
      <p>${esc(copy)}</p>
      <div class="pill-line">
        <span class="status-pill">Action</span>
        <button class="soft-btn" type="button" onclick="setView('${view}')">Open</button>
      </div>
    </article>
  `;
}

function renderSetup() {
  const p = state.profile;
  const blueprint = personaBlueprint(p.persona);
  return `
    <section class="panel form-card">
      <div class="section-title">
        <div>
          <h3>Onboarding setup</h3>
          <p>Tell Work2U who you are and how you want the system to behave.</p>
        </div>
        <div class="pill-line">
          <span class="status-pill">${p.setupComplete ? 'Complete' : 'Incomplete'}</span>
        </div>
      </div>

      <div class="grid-2">
        <form class="stack" id="setup-form" onsubmit="event.preventDefault(); saveSetupFromForm();">
          <div class="form-grid">
            ${field('Workspace ID', 'setup-workspace-id', p.workspaceId || '')}
            ${field('Workspace name', 'setup-workspace', p.workspaceName)}
            ${selectField('Persona / role', 'setup-persona', p.persona, ['Property Agent', 'Insurance Agent', 'Freelancer', 'Corporate Team', 'General Business'])}
            ${selectField('Primary goal', 'setup-goal', p.primaryGoal, ['Follow up prospects', 'Manage clients', 'Track tasks', 'Send invoices', 'Coordinate team'])}
            ${selectField('Package', 'setup-package', p.package, ['Starter', 'Elite', 'Enterprise'])}
            ${selectField('Team size', 'setup-team', p.teamSize, ['1', '2-5', '6-10', '10+'])}
            ${selectField('Region', 'setup-region', p.region, ['Malaysia', 'Global'])}
            ${selectField('Language', 'setup-language', p.language, ['BM + English', 'Bahasa Melayu', 'English'])}
            ${selectField('AI mode', 'setup-ai-mode', p.aiMode, ['Suggest only', 'Draft only', 'Semi-auto', 'Auto-send for approved rules'])}
            ${selectField('AI source', 'setup-ai-source', p.aiSource, ['Work2U managed', 'Bring your own key'])}
          </div>

          <div class="field">
            <label>Primary channels</label>
            <div class="check-row">
              ${checkbox('whatsapp', 'WhatsApp', p.channels.includes('whatsapp'))}
              ${checkbox('email', 'Email', p.channels.includes('email'))}
              ${checkbox('telegram', 'Telegram', p.channels.includes('telegram'))}
            </div>
          </div>

          <div class="field">
            <label>Notes</label>
            <textarea id="setup-notes" placeholder="Optional setup notes">${esc(p.notes || '')}</textarea>
          </div>

          <div class="topbar-actions">
            <button class="ghost-btn" type="button" onclick="seedProfile('freelancer')">Use freelancer demo</button>
            <button class="ghost-btn" type="button" onclick="seedProfile('property')">Use property demo</button>
            <button class="primary-btn" type="submit">Save setup</button>
          </div>
        </form>

        <div class="stack">
          <article class="panel persona-card" style="box-shadow:none;">
            <div class="section-title">
              <div>
                <h3>${esc(blueprint.title)}</h3>
                <p>${esc(blueprint.summary)}</p>
              </div>
              <span class="status-pill">${esc(blueprint.package)} plan</span>
            </div>
            <div class="stack">
              ${miniLine('Recommended package', blueprint.package)}
              ${miniLine('Automation focus', blueprint.ai)}
              ${miniLine('Best channels', blueprint.channels.join(', '))}
              ${miniLine('Capture fields', blueprint.fields.join(', '))}
            </div>
          </article>

          <article class="panel persona-card" style="box-shadow:none;">
            <div class="section-title">
              <div>
                <h3>Workflow preview</h3>
                <p>What Work2U will optimize first for this persona.</p>
              </div>
            </div>
            <div class="stack">
              ${blueprint.steps.map((step, index) => `
                <div class="list-item">
                  <div>
                    <strong>Step ${index + 1}</strong>
                    <div class="tiny">${esc(step)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </article>
        </div>
      </div>

      <div style="margin-top:20px;" class="grid-2">
        <div class="panel" style="box-shadow:none;">
          <div class="section-title">
            <div>
              <h3>Checklist</h3>
              <p>Work2U will use these settings to personalize the dashboard.</p>
            </div>
          </div>
          <div class="list">
            ${checkItem('Workspace created', !!p.workspaceName)}
            ${checkItem('Persona selected', !!p.persona)}
            ${checkItem('Channels selected', !!p.channels.length)}
            ${checkItem('AI mode selected', !!p.aiMode)}
            ${checkItem('Package selected', !!p.package)}
            ${checkItem('Setup complete', !!p.setupComplete)}
          </div>
        </div>
        <div class="panel" style="box-shadow:none;">
          <div class="section-title">
            <div>
              <h3>How this changes the app</h3>
              <p>The same system behaves differently per persona and package.</p>
            </div>
          </div>
          <div class="list">
            ${miniLine('Dashboard', 'Shows the right priority cards and alerts')}
            ${miniLine('Communication', 'Routes follow-up to the best channel')}
            ${miniLine('AI', 'Uses your mode and tone preference')}
            ${miniLine('Billing', 'Keeps limits in line with your package')}
            ${miniLine('Access', 'Prepares roles and scopes for team growth')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderHub() {
  const thread = state.threads.find((item) => item.id === state.activeThreadId) || state.threads[0];
  const aiTip = thread?.channel === 'email'
    ? 'Use a formal reply with the document attached.'
    : thread?.channel === 'telegram'
      ? 'Keep the reply short and action-focused.'
      : 'Use a conversational reply with a warm tone.';
  return `
    <section class="split">
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Unified inbox</h3>
            <p>WhatsApp, email, and Telegram in one lane.</p>
          </div>
        </div>
        <div class="thread-list">
          ${state.threads.map((item) => `
            <article class="thread-card ${item.id === state.activeThreadId ? 'active' : ''}" onclick="selectThread('${item.id}')">
              <div class="thread-top">
                <div>
                  <div class="thread-title">${esc(item.name)}</div>
                  <div class="tiny">${esc(item.subject)}</div>
                </div>
                <span class="status-pill">${esc(label(item.channel))}</span>
              </div>
              <div class="thread-preview">${esc(item.preview)}</div>
            </article>
          `).join('')}
        </div>
      </div>

      <div class="panel">
        <div class="section-title">
          <div>
            <h3>${esc(thread?.name || 'Conversation')}</h3>
            <p>${esc(thread?.subject || 'Pick a thread to view context.')}</p>
          </div>
          <span class="status-pill">${esc(thread?.status || 'Pending')}</span>
        </div>
        <div class="conversation">
          ${(thread?.messages || []).map((message) => `
            <div class="message ${message.role === 'user' ? 'user' : 'ai'}">
              ${esc(message.text)}
              <div class="message-meta">${esc(message.at)}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:16px;" class="stack">
          <div class="field">
            <label>AI draft</label>
            <textarea id="hub-draft" placeholder="Ask AI to draft a reply or summarize the thread..."></textarea>
          </div>
          <div class="input-row">
            <input id="hub-input" type="text" placeholder="Try: Draft a polite WhatsApp reply and mention the revised quotation." />
            <button class="primary-btn" type="button" onclick="runHubDraft()">Draft with AI</button>
          </div>
          <div class="list">
            ${miniLine('Suggested tone', aiTip)}
            ${miniLine('Next action', 'Create follow-up task or schedule a reminder')}
            ${miniLine('Channel rule', 'Send only when the channel is connected and consent exists')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTasks() {
  const groups = ['todo', 'doing', 'review', 'done'];
  const labels = { todo: 'To Do', doing: 'In Progress', review: 'Review', done: 'Done' };
  return `
    <section class="grid-4">
      ${groups.map((stage) => `
        <article class="panel">
          <div class="section-title">
            <div>
              <h3>${labels[stage]}</h3>
              <p>${state.tasks.filter((task) => task.stage === stage).length} tasks</p>
            </div>
          </div>
          <div class="stack">
            ${state.tasks.filter((task) => task.stage === stage).map((task) => `
              <div class="action-card">
                <strong>${esc(task.title)}</strong>
                <p>Owner: ${esc(task.owner)} · Due ${esc(task.due)}</p>
                <div class="bar"><span style="width:${task.progress}%"></span></div>
                <div class="pill-line">
                  <span class="status-pill">${esc(task.progress)}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </article>
      `).join('')}
    </section>
  `;
}

function workspaceMeta(kind) {
  const map = {
    lead: {
      title: 'Leads',
      subtitle: 'Prospects not converted yet',
      collection: 'leads',
      empty: 'No leads yet. Add the first prospect.',
      action: 'Add lead'
    },
    client: {
      title: 'Clients',
      subtitle: 'Converted clients and active accounts',
      collection: 'clients',
      empty: 'No clients yet. Convert a lead or add one manually.',
      action: 'Add client'
    },
    task: {
      title: 'Tasks',
      subtitle: 'Stage and progress tracking',
      collection: 'tasks',
      empty: 'No tasks yet. Add work for the workspace.',
      action: 'Add task'
    },
    case: {
      title: 'Cases',
      subtitle: 'Open service or support cases',
      collection: 'cases',
      empty: 'No cases yet. Track exceptions or support requests.',
      action: 'Add case'
    },
    service: {
      title: 'Services',
      subtitle: 'Service catalog and pricing',
      collection: 'services',
      empty: 'No services yet. Add your offers and packages.',
      action: 'Add service'
    }
  };
  return map[kind];
}

function workspaceCollections() {
  return ['lead', 'client', 'task', 'case', 'service'].map((kind) => ({
    kind,
    ...workspaceMeta(kind),
    items: state[workspaceMeta(kind).collection] || []
  }));
}

function workspaceQuery() {
  return String(state.workspaceSearch || '').trim().toLowerCase();
}

function workspaceText(kind, item) {
  const chunks = [
    item.name,
    item.title,
    item.company,
    item.service,
    item.clientName,
    item.source,
    item.stage,
    item.status,
    item.type,
    item.owner,
    item.note,
    item.summary
  ];
  if (kind === 'task') chunks.push(item.due, item.progress);
  if (kind === 'service') chunks.push(item.description, item.price);
  if (kind === 'client') chunks.push((item.timeline || []).join(' '));
  return chunks.filter(Boolean).join(' ').toLowerCase();
}

function workspaceRecordContext() {
  return {
    workspace_name: state.profile?.workspaceName || defaultProfile().workspaceName,
    owner_id: state.auth?.userId || null,
    workspace_id: state.profile?.workspaceId || null,
    created_by: state.auth?.userId || null,
    updated_by: state.auth?.userId || null
  };
}

function workspaceStatusLabel(kind, item) {
  if (kind === 'task') return `${item.stage || 'todo'} · ${item.progress || 0}%`;
  if (kind === 'service') return item.active === false ? 'inactive' : 'active';
  return item.stage || item.status || item.type || 'active';
}

function workspaceMatchesSearch(kind, item) {
  const query = workspaceQuery();
  if (!query) return true;
  return workspaceText(kind, item).includes(query);
}

function setWorkspaceSearch(value) {
  state.workspaceSearch = value;
  save(STORAGE.workspaceSearch, value);
  render();
}

function setWorkspaceInspector(kind, id) {
  state.workspaceInspector = { kind, id };
  render();
}

function currentWorkspaceSelection() {
  if (state.workspaceInspector?.kind) {
    const meta = workspaceMeta(state.workspaceInspector.kind);
    const list = (state[meta.collection] || []).filter((item) => workspaceMatchesSearch(state.workspaceInspector.kind, item));
    const current = list.find((item) => item.id === state.workspaceInspector.id) || list[0] || null;
    if (current) return { kind: state.workspaceInspector.kind, item: current };
  }

  const prioritized = ['lead', 'client', 'task', 'case', 'service'];
  for (const kind of prioritized) {
    const meta = workspaceMeta(kind);
    const list = (state[meta.collection] || []).filter((item) => workspaceMatchesSearch(kind, item));
    if (list.length) return { kind, item: list[0] };
  }
  return null;
}

function workspaceItemSummary(kind, item) {
  switch (kind) {
    case 'lead':
      return `${item.company || 'No company'} · ${item.source || 'Unknown source'} · ${item.nextFollowUp || 'No follow-up'}`;
    case 'client':
      return `${item.company || 'No company'} · ${item.service || 'No service'} · RM ${money(item.value)}`;
    case 'task':
      return `Owner: ${item.owner || 'Unassigned'} · Due ${item.due || 'No due date'} · ${item.progress || 0}%`;
    case 'case':
      return `${item.clientName || 'No client'} · ${item.type || 'General'} · ${item.status || 'open'}`;
    case 'service':
      return `${item.description || 'No description'} · RM ${money(item.price)}${item.active === false ? ' · Disabled' : ''}`;
    default:
      return '';
  }
}

function openWorkspaceEditor(kind, id = null) {
  state.workspaceEditor = { kind, id };
  state.workspaceInspector = { kind, id };
  render();
}

function closeWorkspaceEditor() {
  state.workspaceEditor = null;
  render();
}

function editorValue(id) {
  return document.getElementById(id)?.value ?? '';
}

function editorChecked(id) {
  return !!document.getElementById(id)?.checked;
}

function workspaceEditorItem(kind, id) {
  const meta = workspaceMeta(kind);
  const list = state[meta.collection] || [];
  return id ? list.find((item) => item.id === id) : null;
}

function renderWorkspaceEditor() {
  const editor = state.workspaceEditor;
  if (!editor) {
    return `
      <div class="section-title">
        <div>
          <h3>Workspace editor</h3>
          <p>Select an item to edit, or create a new record from the panels on the left.</p>
        </div>
      </div>
      <div class="stack">
        ${miniLine('Leads', 'Capture prospects and qualify follow-up')}
        ${miniLine('Clients', 'Track converted accounts and service history')}
        ${miniLine('Tasks', 'Manage stage, progress, and due dates')}
        ${miniLine('Cases', 'Handle support, exceptions, and service issues')}
        ${miniLine('Services', 'Define offerings and pricing')}
      </div>
    `;
  }

  const meta = workspaceMeta(editor.kind);
  const item = workspaceEditorItem(editor.kind, editor.id) || {};
  const isEdit = !!editor.id;
  const title = isEdit ? `Edit ${meta.title.slice(0, -1).toLowerCase()}` : `Add ${meta.title.slice(0, -1).toLowerCase()}`;

  const fields = (() => {
    switch (editor.kind) {
      case 'lead':
        return `
          <div class="form-grid">
            ${field('Name', 'editor-name', item.name || '')}
            ${field('Company', 'editor-company', item.company || '')}
            ${selectField('Stage', 'editor-stage', item.stage || 'cold', ['cold', 'warm', 'hot'])}
            ${selectField('Source', 'editor-source', item.source || 'WhatsApp', ['WhatsApp', 'Email', 'Telegram', 'Referral'])}
            ${field('Value', 'editor-value', item.value ?? 0)}
            ${field('Next follow-up', 'editor-followup', item.nextFollowUp || '')}
          </div>
          <div class="field">
            <label>Note</label>
            <textarea id="editor-note">${esc(item.note || '')}</textarea>
          </div>
        `;
      case 'client':
        return `
          <div class="form-grid">
            ${field('Name', 'editor-name', item.name || '')}
            ${field('Company', 'editor-company', item.company || '')}
            ${selectField('Status', 'editor-status', item.status || 'active', ['active', 'paused', 'closed'])}
            ${field('Service', 'editor-service', item.service || '')}
            ${field('Value', 'editor-value', item.value ?? 0)}
          </div>
          <div class="field">
            <label>Timeline notes</label>
            <textarea id="editor-timeline">${esc((item.timeline || []).join('\n'))}</textarea>
          </div>
        `;
      case 'task':
        return `
          <div class="form-grid">
            ${field('Title', 'editor-title', item.title || '')}
            ${selectField('Stage', 'editor-stage', item.stage || 'todo', ['todo', 'doing', 'review', 'done'])}
            ${field('Progress', 'editor-progress', item.progress ?? 0)}
            ${field('Due', 'editor-due', item.due || '')}
            ${field('Owner', 'editor-owner', item.owner || '')}
          </div>
        `;
      case 'case':
        return `
          <div class="form-grid">
            ${field('Title', 'editor-title', item.title || '')}
            ${field('Type', 'editor-type', item.type || '')}
            ${selectField('Status', 'editor-status', item.status || 'open', ['open', 'in progress', 'resolved', 'closed'])}
            ${field('Client', 'editor-client', item.clientName || '')}
          </div>
          <div class="field">
            <label>Summary</label>
            <textarea id="editor-summary">${esc(item.summary || '')}</textarea>
          </div>
        `;
      case 'service':
        return `
          <div class="form-grid">
            ${field('Name', 'editor-name', item.name || '')}
            ${field('Price', 'editor-price', item.price ?? 0)}
            ${selectField('Status', 'editor-status', item.active === false ? 'Inactive' : 'Active', ['Active', 'Inactive'])}
          </div>
          <div class="field">
            <label>Description</label>
            <textarea id="editor-description">${esc(item.description || '')}</textarea>
          </div>
        `;
      default:
        return '';
    }
  })();

  return `
    <div class="section-title">
      <div>
        <h3>${esc(title)}</h3>
        <p>${esc(meta.subtitle)}</p>
      </div>
      <span class="status-pill">${isEdit ? 'Editing' : 'Creating'}</span>
    </div>
    <form class="stack" id="workspace-editor-form" onsubmit="event.preventDefault(); saveWorkspaceEntity();">
      ${fields}
      <div class="topbar-actions">
        ${isEdit ? '<button class="ghost-btn" type="button" onclick="deleteWorkspaceEntity()">Delete</button>' : ''}
        <div style="flex:1"></div>
        <button class="ghost-btn" type="button" onclick="closeWorkspaceEditor()">Cancel</button>
        <button class="primary-btn" type="submit">Save</button>
      </div>
    </form>
  `;
}

function renderWorkspacePanel(kind) {
  const meta = workspaceMeta(kind);
  const items = (state[meta.collection] || []).filter((item) => workspaceMatchesSearch(kind, item));
  const list = items.map((item) => `
    <div class="list-item">
      <div style="cursor:pointer;" onclick="setWorkspaceInspector('${kind}', '${item.id}')">
        <strong>${esc(item.name || item.title || 'Untitled')}</strong>
        <div class="tiny">${esc(workspaceItemSummary(kind, item))}</div>
      </div>
      <div class="pill-line">
        <span class="status-pill">${esc(workspaceStatusLabel(kind, item))}</span>
        <button class="soft-btn" type="button" onclick="setWorkspaceInspector('${kind}', '${item.id}')">View</button>
        <button class="soft-btn" type="button" onclick="openWorkspaceEditor('${kind}', '${item.id}')">Edit</button>
      </div>
    </div>
  `).join('');

  return `
    <article class="panel">
      <div class="section-title">
        <div>
          <h3>${esc(meta.title)}</h3>
          <p>${esc(meta.subtitle)}</p>
        </div>
        <button class="soft-btn" type="button" onclick="openWorkspaceEditor('${kind}')">${esc(meta.action)}</button>
      </div>
      <div class="stack">
        ${list || `<div class="list-item"><div><strong>${esc(meta.empty)}</strong></div></div>`}
      </div>
    </article>
  `;
}

function renderWorkspaceDetail() {
  const selection = currentWorkspaceSelection();
  if (!selection) {
    return `
      <div class="section-title">
        <div>
          <h3>Record detail</h3>
          <p>Select any record from the left to inspect its full summary.</p>
        </div>
      </div>
      <div class="stack">
        ${miniLine('Search', 'Use the search box to narrow results across all workspace records.')}
        ${miniLine('View', 'Click View to open the detail panel for a record.')}
        ${miniLine('Edit', 'Click Edit to jump directly into the form editor.')}
      </div>
    `;
  }

  const { kind, item } = selection;
  const meta = workspaceMeta(kind);
  const tagLine = {
    lead: `${item.source || 'WhatsApp'} lead`,
    client: `${item.service || 'Active client'}`,
    task: `${item.owner || 'Unassigned'} task`,
    case: `${item.type || 'General'} case`,
    service: `${item.active === false ? 'Disabled service' : 'Active service'}`
  }[kind] || 'Selected record';

  const detail = (() => {
    switch (kind) {
      case 'lead':
        return [
          ['Company', item.company || '-'],
          ['Stage', item.stage || '-'],
          ['Source', item.source || '-'],
          ['Value', `RM ${money(item.value)}`],
          ['Next follow-up', item.nextFollowUp || '-'],
          ['Note', item.note || '-'],
          ['Engagement', item.stage === 'hot' ? 'Reply now and push to quotation.' : 'Keep nudging with reminders.']
        ];
      case 'client':
        return [
          ['Company', item.company || '-'],
          ['Status', item.status || '-'],
          ['Service', item.service || '-'],
          ['Value', `RM ${money(item.value)}`],
          ['Timeline', (item.timeline || []).join(' | ') || '-'],
          ['Next action', 'Review history before the next outreach.']
        ];
      case 'task':
        return [
          ['Stage', item.stage || '-'],
          ['Progress', `${item.progress || 0}%`],
          ['Due', item.due || '-'],
          ['Owner', item.owner || '-'],
          ['Workflow tip', item.stage === 'review' ? 'Check before moving forward.' : 'Keep the next step visible.']
        ];
      case 'case':
        const casePriority = item.status === 'open' ? 'High' : item.status === 'in progress' ? 'Medium' : 'Low';
        return [
          ['Type', item.type || '-'],
          ['Status', item.status || '-'],
          ['Client', item.clientName || '-'],
          ['Summary', item.summary || '-'],
          ['Priority', casePriority],
          ['Routing', 'Assign to the right owner before closing the loop.'],
          ['Recommended action', item.status === 'resolved' ? 'Archive after confirmation.' : 'Assign owner and resolve next blocker.']
        ];
      case 'service':
        const serviceBilling = item.price > 0 ? 'Attach to invoice line items' : 'Use as bundled or complimentary service';
        return [
          ['Name', item.name || '-'],
          ['Price', `RM ${money(item.price)}`],
          ['Status', item.active === false ? 'Inactive' : 'Active'],
          ['Description', item.description || '-'],
          ['Package use', serviceBilling],
          ['Accounting hook', item.price > 0 ? 'Ready for invoicing, receipt, and revenue reporting.' : 'Useful for free scope, retainer, or internal ops.']
        ];
      default:
        return [];
    }
  })();

  return `
    <div class="section-title">
      <div>
        <h3>${esc(meta.title)} detail</h3>
        <p>${esc(item.name || item.title || 'Selected record')}</p>
      </div>
      <div class="pill-line">
        <span class="status-pill">${esc(tagLine)}</span>
        <button class="soft-btn" type="button" onclick="openWorkspaceEditor('${kind}', '${item.id}')">Edit</button>
      </div>
    </div>
    <div class="stack">
      ${detail.map(([labelText, value]) => miniLine(labelText, value)).join('')}
      <div class="topbar-actions">
        <button class="ghost-btn" type="button" onclick="openWorkspaceEditor('${kind}', '${item.id}')">Open editor</button>
        <button class="ghost-btn" type="button" onclick="deleteWorkspaceRecord('${kind}', '${item.id}')">Delete</button>
      </div>
    </div>
  `;
}

function renderWorkspace() {
  const query = state.workspaceSearch || '';
  return `
    <section class="stack">
      <article class="panel">
        <div class="section-title">
          <div>
            <h3>Workspace core</h3>
            <p>Search across leads, clients, tasks, cases, and services. Click any record to inspect it.</p>
          </div>
          <span class="status-pill">${esc(state.profile.package || 'Starter')}</span>
        </div>
        <div class="input-row">
          <input id="workspace-search" value="${esc(query)}" placeholder="Search by name, company, status, note, or service..." oninput="setWorkspaceSearch(this.value)" />
          <button class="soft-btn" type="button" onclick="setWorkspaceSearch('')">Clear</button>
        </div>
      </article>

      <section class="split">
        <div class="stack">
          ${workspaceCollections().map((entry) => renderWorkspacePanel(entry.kind)).join('')}
        </div>
        <div class="stack">
          <article class="panel">
            ${renderWorkspaceDetail()}
          </article>
          <article class="panel">
            ${renderWorkspaceEditor()}
          </article>
        </div>
      </section>
    </section>
  `;
}

function workspaceCollectionKey(kind) {
  return workspaceMeta(kind)?.collection || 'leads';
}

function workspaceApiPath(collection, id = null) {
  return `/api/work2u/core/${collection}${id ? `/${id}` : ''}`;
}

async function workspaceApiRequest(collection, method = 'GET', id = null, payload = null) {
  try {
    const response = await fetch(workspaceApiPath(collection, id), {
      method,
      headers: payload ? { 'Content-Type': 'application/json' } : undefined,
      body: payload ? JSON.stringify(payload) : undefined
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function hydrateWorkspaceCollectionsFromApi() {
  const collections = ['leads', 'clients', 'tasks', 'cases', 'services'];
  const remote = {};
  let hasRemoteData = false;

  for (const collection of collections) {
    const result = await workspaceApiRequest(collection);
    const items = Array.isArray(result?.items) ? result.items : [];
    remote[collection] = items;
    if (items.length) hasRemoteData = true;
  }

  if (hasRemoteData) {
    collections.forEach((collection) => {
      if (remote[collection]) {
        state[collection] = remote[collection];
        save(STORAGE[collection], state[collection]);
      }
    });
    return;
  }

  for (const collection of collections) {
    const items = state[collection] || [];
    for (const item of items) {
      await workspaceApiRequest(collection, 'POST', null, item);
    }
  }
}

async function saveWorkspaceEntity() {
  const editor = state.workspaceEditor;
  if (!editor) return;

  const meta = workspaceMeta(editor.kind);
  if (!meta) return;

  const collection = workspaceCollectionKey(editor.kind);
  const list = state[collection] || [];
  const existing = editor.id ? list.find((item) => item.id === editor.id) : null;
  const id = editor.id || `${collection.slice(0, -1)}-${Date.now()}`;
  let nextItem = existing ? { ...existing } : { id };

  switch (editor.kind) {
    case 'lead':
      nextItem = {
        ...nextItem,
        id,
        name: editorValue('editor-name').trim() || 'New Lead',
        company: editorValue('editor-company').trim(),
        stage: editorValue('editor-stage'),
        source: editorValue('editor-source'),
        value: Number(editorValue('editor-value') || 0),
        nextFollowUp: editorValue('editor-followup').trim(),
        note: editorValue('editor-note').trim()
      };
      break;
    case 'client':
      nextItem = {
        ...nextItem,
        id,
        name: editorValue('editor-name').trim() || 'New Client',
        company: editorValue('editor-company').trim(),
        status: editorValue('editor-status'),
        service: editorValue('editor-service').trim(),
        value: Number(editorValue('editor-value') || 0),
        timeline: editorValue('editor-timeline')
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
      };
      break;
    case 'task':
      nextItem = {
        ...nextItem,
        id,
        title: editorValue('editor-title').trim() || 'New Task',
        stage: editorValue('editor-stage'),
        progress: Math.max(0, Math.min(100, Number(editorValue('editor-progress') || 0))),
        due: editorValue('editor-due').trim(),
        owner: editorValue('editor-owner').trim()
      };
      break;
    case 'case':
      nextItem = {
        ...nextItem,
        id,
        title: editorValue('editor-title').trim() || 'New Case',
        type: editorValue('editor-type').trim(),
        status: editorValue('editor-status'),
        clientName: editorValue('editor-client').trim(),
        summary: editorValue('editor-summary').trim()
      };
      break;
    case 'service':
      nextItem = {
        ...nextItem,
        id,
        name: editorValue('editor-name').trim() || 'New Service',
        description: editorValue('editor-description').trim(),
        price: Number(editorValue('editor-price') || 0),
        active: editorValue('editor-status') === 'Active'
      };
      break;
    default:
      return;
  }

  nextItem = {
    ...nextItem,
    ...workspaceRecordContext()
  };

  const index = list.findIndex((item) => item.id === id);
  if (index >= 0) list[index] = nextItem;
  else list.unshift(nextItem);
  const method = existing ? 'PATCH' : 'POST';
  const result = await workspaceApiRequest(collection, method, existing ? id : null, nextItem);
  state[collection] = list;
  if (result?.item) {
    state[collection][index >= 0 ? index : 0] = result.item;
    nextItem = result.item;
  }
  persistCollection(collection);
  if (editor.kind === 'client') {
    state.activeClientId = id;
  }
  state.workspaceEditor = null;
  state.workspaceInspector = { kind: editor.kind, id };
  render();
}

async function deleteWorkspaceEntity() {
  const editor = state.workspaceEditor;
  if (!editor) return;
  await deleteWorkspaceRecord(editor.kind, editor.id);
}

async function deleteWorkspaceRecord(kind, id) {
  if (!window.confirm(`Delete this ${kind}?`)) return;
  const collection = workspaceCollectionKey(kind);
  await workspaceApiRequest(collection, 'DELETE', id);
  state[collection] = (state[collection] || []).filter((item) => item.id !== id);
  persistCollection(collection);
  if (state.workspaceInspector?.kind === kind && state.workspaceInspector?.id === id) {
    state.workspaceInspector = null;
  }
  if (state.workspaceEditor?.kind === kind && state.workspaceEditor?.id === id) {
    state.workspaceEditor = null;
  }
  render();
}

function renderClients() {
  const client = state.clients.find((item) => item.id === state.activeClientId) || state.clients[0];
  return `
    <section class="split">
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Clients</h3>
            <p>Every client keeps a timeline and next step.</p>
          </div>
        </div>
        <div class="client-list">
          ${state.clients.map((item) => `
            <article class="client-card ${item.id === state.activeClientId ? 'active' : ''}" onclick="selectClient('${item.id}')">
              <div class="client-top">
                <div>
                  <div class="client-title">${esc(item.name)}</div>
                  <div class="tiny">${esc(item.company)}</div>
                </div>
                <span class="status-pill">${esc(item.status)}</span>
              </div>
              <div class="client-meta">${esc(item.service)} · RM ${money(item.value)}</div>
            </article>
          `).join('')}
        </div>
      </div>
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>${esc(client?.name || 'Client timeline')}</h3>
            <p>${esc(client?.company || '')}</p>
          </div>
          <button class="soft-btn" onclick="setView('hub')">Open inbox</button>
        </div>
        <div class="stack">
          ${(client?.timeline || []).map((entry, index) => `
            <div class="list-item">
              <div>
                <strong>Step ${index + 1}</strong>
                <div class="tiny">${esc(entry)}</div>
              </div>
              <span class="tag">${index === 0 ? 'Lead' : index === client.timeline.length - 1 ? 'Next' : 'Update'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderCalendar() {
  return `
    <section class="panel">
      <div class="section-title">
        <div>
          <h3>Calendar sync</h3>
          <p>Task reminders and meetings are grouped by priority.</p>
        </div>
        <span class="status-pill">Internal calendar ready</span>
      </div>
      <div class="grid-3">
        ${state.calendar.map((item) => `
          <article class="calendar-card">
            <div class="thread-top">
              <div>
                <div class="thread-title">${esc(item.title)}</div>
                <div class="tiny">${esc(item.time)}</div>
              </div>
              <span class="status-pill">${esc(item.type)}</span>
            </div>
            <div class="thread-preview">Synced task reminders should show up here once calendar integration is connected.</div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAI() {
  const aiSource = state.profile.aiSource;
  const messages = state.ai || [];
  const automationUnlocked = canUseFeature('automationBuilder');
  const socialUnlocked = canUseFeature('socialManagement');
  return `
    <section class="split">
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>AI Copilot</h3>
            <p>Use it to draft replies, summarize threads, and turn ideas into steps.</p>
          </div>
          <span class="status-pill">${esc(aiSource)}</span>
        </div>
        <div class="conversation" id="ai-stream">
          ${messages.map((message) => `
            <div class="message ${message.role === 'user' ? 'user' : 'ai'}">
              ${esc(message.text)}
              <div class="message-meta">${esc(message.at)}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:16px;" class="input-row">
          <input id="ai-prompt" type="text" placeholder="Tell AI what you want to do..." />
          <button class="primary-btn" type="button" onclick="sendAI()">Send</button>
        </div>
      </div>
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Suggested prompts</h3>
            <p>Start with simple workflows and let AI help structure them.</p>
          </div>
        </div>
        <div class="stack">
          ${miniLine('Draft reply', 'Write a friendly WhatsApp reply for a hot lead.')}
          ${miniLine('Summarize', 'Summarize the last thread into action items.')}
          ${miniLine('Workflow', 'Turn this business idea into a step-by-step flow.')}
          ${miniLine('Reminder', 'Build a follow-up reminder sequence for this client.')}
        </div>
        <div style="margin-top:18px;" class="panel">
          <div class="tiny">AI source</div>
          <strong>${esc(aiSource)}</strong>
          <p class="muted">Later we can plug in user-owned AI credentials or a managed Work2U key.</p>
        </div>
        <div style="margin-top:18px;" class="panel">
          <div class="section-title">
            <div>
              <h3>Automation builder</h3>
              <p>Design follow-up rules, approvals, and handoffs.</p>
            </div>
            <span class="status-pill">${automationUnlocked ? 'Unlocked' : 'Starter locked'}</span>
          </div>
          <div class="stack">
            ${automationUnlocked
              ? miniLine('Automation', 'Build approved follow-up rules and reminders for your team.')
              : miniLine('Automation', 'Starter only supports drafting. Upgrade to unlock rule-based sending.')}
            ${miniLine('Social media', socialUnlocked ? 'Social management is available for campaign workflows.' : 'Social media management starts at Elite.')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAccess() {
  const currentRole = normalizeAccessRole(state.profile.accessRole);
  return `
    <section class="split">
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Role matrix</h3>
            <p>Keep the top-level roles simple and use presets underneath.</p>
          </div>
          <span class="status-pill">${esc(currentRole)}</span>
        </div>
        <div class="stack">
          ${roleCard('Super Admin', 'Full platform control', 'Plans, feature flags, billing, all workspaces, audit logs')}
          ${roleCard('Admin', 'Workspace operator', 'CRM, communication hub, billing within workspace, reports')}
          ${roleCard('User', 'Assigned execution', 'Tasks, clients, messages, and actions assigned to them')}
        </div>
      </div>
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Workspace members</h3>
            <p>Add team members and set their scope.</p>
          </div>
          <button class="soft-btn" onclick="openMemberEditor()" ${canManageMembers() ? '' : 'disabled'}>Add member</button>
        </div>
        <div class="member-list">
          ${state.members.map((member) => `
            <div class="list-item">
              <div>
                <strong>${esc(member.name)}</strong>
                <div class="tiny">${esc(member.email)} · ${esc(member.role)} · ${esc(member.preset)}</div>
              </div>
              <div class="pill-line">
                <span class="status-pill">${esc(member.scope)}</span>
                <button class="soft-btn" onclick="openMemberEditor('${member.id}')" ${canManageMembers() ? '' : 'disabled'}>Edit</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderBilling() {
  const ent = currentEntitlements();
  const currentPlan = normalizePackageName(state.profile.package);
  const currentGateway = state.profile.region === 'Malaysia' ? 'Billplz' : 'Stripe';
  const subscription = state.billing?.subscription || null;
  const trial = billingTrialState(subscription);
  const billingStatus = state.billing?.status || 'pending';
  const billingPlan = state.billing?.plan || currentPlan;
  return `
    <section class="panel">
      <div class="section-title">
        <div>
          <h3>Billing</h3>
          <p>Malaysia uses Billplz. Global uses Stripe.</p>
        </div>
        <div class="pill-line">
          <span class="status-pill">${esc(state.profile.region)} routing</span>
          <span class="status-pill">${esc(billingStatus)}</span>
        </div>
      </div>

      ${trial ? `
        <div class="report-card" style="margin-bottom:18px;border-color:rgba(21,101,216,0.22);background:linear-gradient(135deg, rgba(21,101,216,0.06), rgba(15,118,110,0.04));">
          <div class="report-top">
            <div>
              <div class="tiny">Stripe trial countdown</div>
              <strong>${esc(trial.label)}</strong>
            </div>
            <span class="status-pill">${esc(currentGateway)}</span>
          </div>
          <p class="report-copy">${esc(trial.copy)} You can continue or unsubscribe from the customer portal before renewal.</p>
          <div class="topbar-actions">
            <button class="soft-btn" type="button" onclick="syncBillingStateFromServer()">Refresh status</button>
            <button class="primary-btn" type="button" onclick="openBillingPortal()">Open billing portal</button>
          </div>
        </div>
      ` : ''}

      <div class="grid-2" style="margin-bottom:18px;">
        <div class="report-card">
          <div class="report-top">
            <div>
              <div class="tiny">Current subscription</div>
              <strong>${esc(billingPlan)}</strong>
            </div>
            <span class="status-pill">${esc(currentGateway)}</span>
          </div>
          <div class="stack" style="margin-top:14px;">
            ${miniLine('Billing route', state.profile.region === 'Malaysia' ? 'FPX via Billplz' : 'Global card billing via Stripe')}
            ${miniLine('Billing status', state.billing?.status || 'Awaiting confirmation')}
            ${miniLine('Trial', trial ? `${esc(trial.summary)} · ends ${esc(formatShortDate(trial.endsAt))}` : 'No active Stripe trial')}
            ${miniLine('Cancel / renew', state.profile.region === 'Malaysia' ? 'Manage through support for Billplz billing changes' : 'Customers can cancel or renew in the Stripe portal')}
            ${miniLine('AI source', state.profile.aiSource || 'Work2U managed')}
            ${miniLine('Login email', state.profile.loginEmail || 'Not set yet')}
          </div>
        </div>
        <div class="report-card">
          <div class="report-top">
            <div>
              <div class="tiny">What this page does</div>
              <strong>Package control</strong>
            </div>
            <div class="pill-line">
              <button class="soft-btn" type="button" onclick="syncBillingStateFromServer()">Refresh status</button>
              <button class="soft-btn" type="button" onclick="openBillingPortal()">Manage billing</button>
            </div>
          </div>
          <p class="report-copy">Use this screen to compare Starter, Elite, and Enterprise, see what each tier unlocks, and keep the billing flow low-friction for the user.</p>
          <div class="stack" style="margin-top:14px;">
            ${miniLine('Starter', 'Affordable solo plan for core CRM and reminders')}
            ${miniLine('Elite', 'Team plan for inbox, automation, and reporting')}
            ${miniLine('Stripe trial', 'Global checkout starts with a 7-day card trial')}
            ${miniLine('Enterprise', 'Custom onboarding, permissions, and SLA')}
            ${miniLine('Cancel anytime', 'Users can continue or unsubscribe from the Stripe billing portal')}
          </div>
        </div>
      </div>

      <div class="plan-grid">
        ${planCard('Starter', 'RM29', 'For freelancers and solo users', currentPlan === 'Starter', ['1 user', 'Core CRM', 'Basic AI drafts', 'Limited automation'])}
        ${planCard('Elite', 'RM99', 'For teams that need stronger collaboration', currentPlan === 'Elite', ['3-5 users', 'Unified inbox', 'More AI credits', 'More automation'])}
        ${planCard('Enterprise', 'Custom', 'For custom workflow, SLA, and advanced control', currentPlan === 'Enterprise', ['Unlimited seats', 'Custom permissions', 'Custom onboarding', 'Dedicated support'])}
      </div>

      <div style="margin-top:18px;" class="grid-2">
        <div class="report-card">
          <div class="report-top">
            <div>
              <div class="tiny">Current package limits</div>
              <strong>${esc(state.profile.package || 'Starter')}</strong>
            </div>
            <span class="status-pill">${esc(state.profile.accessRole || 'Admin')}</span>
          </div>
          <div class="stack" style="margin-top:14px;">
            ${miniLine('Users', `${esc(ent.maxUsers)} user(s)`)}
            ${miniLine('Workspaces', `${esc(ent.maxWorkspaces)} workspace(s)`)}
            ${miniLine('Main channels', `${esc(ent.maxMainChannels)} channel(s)`)}
            ${miniLine('Connectors', `${esc(ent.maxConnectors)} channel(s)`)}
            ${miniLine('Automation rules', `${esc(ent.maxAutomationRules)} rules`)}
            ${miniLine('Leads / clients / tasks', `${esc(ent.maxLeadsActive)} / ${esc(ent.maxClientsActive)} / ${esc(ent.maxTasksActive)}`)}
            ${miniLine('AI actions', `${esc(ent.maxAiActionsMonth)} per month`)}
            ${miniLine('Email sends', `${esc(ent.maxEmailSendsMonth)} per month`)}
            ${miniLine('Storage', `${esc(ent.maxStorageGb)} GB`)}
            ${miniLine('AI quota', `${esc(ent.aiQuota)} usage`)}
            ${miniLine('Reporting', esc(ent.reporting))}
            ${miniLine('Branding', ent.allowCustomBranding ? 'Allowed' : 'Starter locked')}
            ${miniLine('Workflow', ent.allowCustomWorkflow ? 'Allowed' : 'Starter locked')}
            ${miniLine('Audit log', ent.allowAuditLog ? 'Allowed' : 'Starter locked')}
            ${miniLine('BYO AI key', ent.allowByoAiKey ? 'Allowed' : 'Starter locked')}
          </div>
        </div>
        <div class="report-card">
          <div class="report-top">
            <div>
              <div class="tiny">Phase 0 and 1</div>
              <strong>Foundation first</strong>
            </div>
          </div>
          <p class="report-copy">Package limits are now wired into the app layer so we can reuse the same rule set for members, AI, automation, and billing when backend enforcement lands.</p>
          <div class="stack" style="margin-top:14px;">
            ${miniLine('Phase 0', 'Schema, auth, roles, config, and entitlement rules')}
            ${miniLine('Phase 1', 'Leads, clients, tasks, cases, and workspace flow')}
          </div>
        </div>
      </div>

      <div style="margin-top:18px;" class="grid-2">
        <div class="report-card">
          <div class="report-top">
            <div>
              <div class="tiny">Malaysia</div>
              <strong>Billplz</strong>
            </div>
            <span class="status-pill">FPX / local rails</span>
          </div>
          <p class="report-copy">Use Billplz for Malaysia billing to keep payment cost low and fit local preferences.</p>
        </div>
        <div class="report-card">
          <div class="report-top">
            <div>
              <div class="tiny">Global</div>
              <strong>Stripe</strong>
            </div>
            <span class="status-pill">Recurring SaaS</span>
          </div>
          <p class="report-copy">Use Stripe for global subscriptions, recurring billing, and future expansion.</p>
        </div>
      </div>

      ${isSuperAdmin() ? `
        <div style="margin-top:18px;" class="report-card">
          <div class="report-top">
            <div>
              <div class="tiny">Super Admin</div>
              <strong>Billing control tower</strong>
            </div>
            <button class="soft-btn" type="button" onclick="syncBillingAdminFromServer()">Refresh all</button>
          </div>
          <div class="stack" style="margin-top:14px;">
            ${miniLine('Total subscriptions', `${esc(state.billingAdmin?.summary?.totalSubscriptions || 0)}`)}
            ${miniLine('Active', `${esc(state.billingAdmin?.summary?.activeSubscriptions || 0)}`)}
            ${miniLine('Past due', `${esc(state.billingAdmin?.summary?.pastDueSubscriptions || 0)}`)}
            ${miniLine('Pending', `${esc(state.billingAdmin?.summary?.pendingSubscriptions || 0)}`)}
          </div>
          <div style="overflow:auto;margin-top:16px;">
            <table class="table" style="min-width:720px;width:100%;">
              <thead>
                <tr>
                  <th>Workspace</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                ${(state.billingAdmin?.subscriptions || []).slice(0, 8).map((item) => `
                  <tr>
                    <td>${esc(item.workspace_name || 'Work2U')}</td>
                    <td>${esc(item.email || '-')}</td>
                    <td>${esc(item.plan_code || 'Starter')}</td>
                    <td>${esc(item.provider || '-')}</td>
                    <td>${esc(item.status || '-')}</td>
                    <td>${esc((item.updated_at || '').slice(0, 19).replace('T', ' '))}</td>
                  </tr>
                `).join('') || '<tr><td colspan="6">No billing records yet.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    </section>
  `;
}

function renderReports() {
  const revenue = state.invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  const expected = state.invoices.filter((inv) => inv.status !== 'paid').reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  const expenses = state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const profit = revenue - expenses;
  const grossMargin = revenue ? ((profit / revenue) * 100).toFixed(1) : '0.0';
  const advancedReports = canUseFeature('advancedReports');
  const rollupData = state.expenseRollup?.data || null;
  const rollupSummary = rollupData?.summary || null;
  const rollupMeta = rollupData?.meta || null;
  const rollupVendor = rollupData?.vendorBreakdown?.[0] || null;
  const rollupCategory = rollupData?.categoryBreakdown?.[0] || null;
  const rollupInsights = rollupData?.aiInsights || [];
  const rollupMonth = (rollupData?.monthKey || currentMonthKey()).slice(0, 7);
  const rollupWorkspaceId = currentWorkspaceIdFallback();
  const rollupWorkspaceName = state.profile.workspaceName || defaultProfile().workspaceName;
  const rollupStatusTone = state.expenseRollupError ? 'warn' : (rollupData ? 'good' : (rollupWorkspaceId ? 'ready' : 'warn'));
  const rollupStatusLabel = state.expenseRollupError ? 'Needs fix' : (rollupData ? 'Snapshot ready' : (rollupWorkspaceId ? 'Ready to close' : 'Set workspace ID'));
  const receiptUniverse = Array.isArray(state.expenseReceipts) ? state.expenseReceipts : [];
  const recentReceipts = filteredExpenseReceipts();
  const selectedReceiptIds = new Set(normalizeReceiptSelection());
  const visibleSelectedCount = recentReceipts.filter((receipt) => selectedReceiptIds.has(receipt.id)).length;
  const allVisibleSelected = recentReceipts.length > 0 && visibleSelectedCount === recentReceipts.length;
  const someVisibleSelected = visibleSelectedCount > 0 && visibleSelectedCount < recentReceipts.length;
  const receiptCounts = receiptUniverse.reduce((acc, receipt) => {
    const status = String(receipt.reviewStatus || 'pending').toLowerCase();
    acc.total += 1;
    if (status === 'approved') acc.approved += 1;
    else if (status === 'flagged') acc.flagged += 1;
    else acc.pending += 1;
    return acc;
  }, { total: 0, pending: 0, approved: 0, flagged: 0 });
  const receiptSearchValue = String(state.expenseReceiptSearch || '');
  const cashBase = Math.max(revenue + expected, 0);
  const collectedRate = cashBase > 0 ? Math.min(100, Math.round((revenue / cashBase) * 100)) : 0;
  const expensePressure = revenue > 0 ? Math.min(100, Math.round((expenses / Math.max(revenue, 1)) * 100)) : 0;
  const approvalRate = receiptCounts.total > 0 ? Math.round((receiptCounts.approved / receiptCounts.total) * 100) : 0;
  const pnlTrendChart = renderPnlTrendChart(rollupData?.pnlRows || []);
  return `
    <section class="metric-grid">
      ${pageCards([
        { label: 'Revenue', value: `RM ${money(revenue)}`, sub: 'Paid invoices and received cash' },
        { label: 'Expected', value: `RM ${money(expected)}`, sub: 'Open or draft invoices' },
        { label: 'Expenses', value: `RM ${money(expenses)}`, sub: 'Infrastructure and support reserve' },
        { label: 'Gross Margin', value: `${grossMargin}%`, sub: 'Simple package health check' }
      ])}
    </section>

    ${!rollupWorkspaceId || state.expenseRollupError ? `
      <section class="report-card" style="margin-top:18px;border-color:rgba(180,83,9,0.22);background:linear-gradient(135deg, rgba(180,83,9,0.08), rgba(15,23,42,0.02));">
        <div class="report-top">
          <div>
            <div class="tiny">Workspace setup</div>
            <strong>${!rollupWorkspaceId ? 'Add workspace ID for rollup' : 'Rollup needs attention'}</strong>
          </div>
          <span class="status-pill">${esc(rollupStatusLabel)}</span>
        </div>
        <p class="report-copy">${esc(state.expenseRollupError || 'Set the workspace ID in Setup so receipts, snapshots, and monthly close point to the right workspace.')}</p>
        <div class="topbar-actions">
          <button class="soft-btn" type="button" onclick="setView('setup')">Open setup</button>
          <button class="soft-btn" type="button" onclick="refreshMonthlyExpenseRollup()">Retry rollup</button>
        </div>
      </section>
      ` : ''}

    <section class="split">
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">P&L snapshot</div>
            <strong>Monthly projection</strong>
          </div>
          <span class="status-pill">${profit >= 0 ? 'Healthy' : 'Needs review'}</span>
        </div>
        <div class="stack" style="margin-top:14px;">
          ${miniLine('Revenue', `RM ${money(revenue)}`)}
          ${miniLine('Expenses', `RM ${money(expenses)}`)}
          ${miniLine('Net profit', `RM ${money(profit)}`)}
          ${miniLine('Open invoices', `RM ${money(expected)}`)}
        </div>
        <div style="margin-top:16px;">
          ${pnlTrendChart}
        </div>
      </div>
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Package strategy</div>
            <strong>Why RM29 starts here</strong>
          </div>
        </div>
        <p class="report-copy">Starter stays affordable so freelancers can adopt the tool without feeling trapped by a high monthly bill. Growth comes from Elite upgrades, add-ons, and Enterprise onboarding.</p>
        <div class="stack" style="margin-top:14px;">
          ${miniLine('Starter', 'Low friction and affordable entry point')}
          ${miniLine('Elite', 'Most attractive value tier')}
          ${miniLine('Enterprise', 'Custom, sales-led expansion')}
        </div>
      </div>
    </section>

    <section class="split" style="margin-top:18px;">
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Analytics depth</div>
            <strong>${advancedReports ? 'Advanced reporting unlocked' : 'Advanced reporting locked'}</strong>
          </div>
          <span class="status-pill">${advancedReports ? 'Elite+' : 'Starter'}</span>
        </div>
        <p class="report-copy">${advancedReports ? 'You can expand into deeper PnL analysis, channel ROI, and automation impact reporting.' : 'Starter keeps reporting simple. Upgrade to Elite for channel ROI, automation impact, and deeper PnL analysis.'}</p>
        <div class="stack" style="margin-top:14px;">
          ${miniLine('Basic PnL', 'Revenue minus expenses with a clean monthly snapshot.')}
          ${miniLine('Advanced PnL', advancedReports ? 'Available with more dimensions and breakdowns.' : 'Locked to Elite and Enterprise.')}
          ${miniLine('Social ROI', advancedReports ? 'Ready for campaign attribution and channel analysis.' : 'Locked to Elite and Enterprise.')}
        </div>
      </div>
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Automation impact</div>
            <strong>${canUseFeature('automationBuilder') ? 'Available' : 'Locked'}</strong>
          </div>
        </div>
        <p class="report-copy">${canUseFeature('automationBuilder') ? 'Automation rules can be measured against follow-up speed and conversion.' : 'Automation builder remains suggestion-only on Starter. Upgrade to measure automation impact.'}</p>
        <div class="stack" style="margin-top:14px;">
          ${miniLine('Reminder rules', canUseFeature('automationBuilder') ? 'Can be tracked and optimized.' : 'Locked to higher plans.')}
          ${miniLine('Social workflows', canUseFeature('socialManagement') ? 'Can be included in reporting.' : 'Locked to Elite and Enterprise.')}
        </div>
      </div>
    </section>

    <section class="report-visual-grid" style="margin-top:18px;">
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Revenue pulse</div>
            <strong>Cash collected vs expected</strong>
          </div>
          <span class="status-pill">${collectedRate}%</span>
        </div>
        <p class="report-copy">A quick read on how much cash has landed compared with what is still waiting on invoice settlement.</p>
        <div class="stack" style="margin-top:14px;">
          ${miniLine('Collected', `RM ${money(revenue)}`)}
          ${miniLine('Expected', `RM ${money(expected)}`)}
          ${miniLine('Collection rate', `${collectedRate}%`)}
          <div class="bar"><span style="width:${Math.max(8, collectedRate)}%"></span></div>
        </div>
      </div>
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Expense pressure</div>
            <strong>Cost load against revenue</strong>
          </div>
          <span class="status-pill">${expensePressure}%</span>
        </div>
        <p class="report-copy">This helps us spot when operating cost starts to creep too close to monthly revenue.</p>
        <div class="stack" style="margin-top:14px;">
          ${miniLine('Expenses', `RM ${money(expenses)}`)}
          ${miniLine('Net profit', `RM ${money(profit)}`)}
          ${miniLine('Margin', `${grossMargin}%`)}
          <div class="bar"><span style="width:${Math.max(8, Math.min(100, expensePressure))}%"></span></div>
        </div>
      </div>
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Receipt health</div>
            <strong>Review completion rate</strong>
          </div>
          <span class="status-pill">${approvalRate}%</span>
        </div>
        <p class="report-copy">Approved receipts move reporting forward faster and reduce manual month-end cleanup.</p>
        <div class="stack" style="margin-top:14px;">
          ${miniLine('Approved', `${receiptCounts.approved} receipts`)}
          ${miniLine('Pending', `${receiptCounts.pending} receipts`)}
          ${miniLine('Flagged', `${receiptCounts.flagged} receipts`)}
          <div class="bar"><span style="width:${Math.max(8, approvalRate)}%"></span></div>
        </div>
      </div>
    </section>

    <section class="split" style="margin-top:18px;">
      <div class="report-card receipt-workbench-card">
        <div class="report-top">
          <div>
            <div class="tiny">Recent receipts</div>
            <strong>Latest receipt queue</strong>
          </div>
          <div class="pill-line">
            <span class="status-pill">${state.expenseReceiptsLoading ? 'Loading' : `${recentReceipts.length} visible`}</span>
            <button class="soft-btn" type="button" onclick="syncRecentExpenseReceiptsFromServer()">Refresh receipts</button>
          </div>
        </div>
        <p class="report-copy">Approve, download, or reprocess receipts from one compact dashboard so your P&amp;L and review queue stay aligned.</p>

        <div class="receipt-dashboard-strip" style="margin-top:14px;">
          ${[
            { label: 'All', value: receiptCounts.total, note: 'loaded' },
            { label: 'Pending', value: receiptCounts.pending, note: 'needs review' },
            { label: 'Approved', value: receiptCounts.approved, note: 'ready' },
            { label: 'Flagged', value: receiptCounts.flagged, note: 'needs attention' }
          ].map((item) => `
            <div class="receipt-stat-card">
              <div class="tiny">${esc(item.label)}</div>
              <strong>${item.value}</strong>
              <span>${esc(item.note)}</span>
            </div>
          `).join('')}
        </div>

        <div class="receipt-toolbar" style="margin-top:14px;">
          <div class="field receipt-search-field">
            <label class="field-label" for="receipt-search">Search receipts</label>
            <input
              id="receipt-search"
              class="text-input"
              type="search"
              value="${esc(receiptSearchValue)}"
              placeholder="Vendor, file name, notes, status..."
              oninput="setExpenseReceiptSearch(this.value)"
            />
          </div>
          <div class="receipt-toolbar-actions">
            <button class="soft-btn" type="button" onclick="setExpenseReceiptFilter('all'); setExpenseReceiptSearch('')">Clear filters</button>
            <button class="soft-btn" type="button" onclick="syncRecentExpenseReceiptsFromServer()">Reload</button>
          </div>
        </div>

        <div class="receipt-filter-row" style="margin-top:14px;">
          ${[
            ['all', 'All'],
            ['pending', 'Pending'],
            ['approved', 'Approved'],
            ['flagged', 'Flagged']
          ].map(([key, label]) => `
            <button class="receipt-filter-btn${String(state.expenseReceiptFilter || 'all') === key ? ' active' : ''}" type="button" onclick="setExpenseReceiptFilter('${key}')">${label}</button>
          `).join('')}
        </div>

        <div class="receipt-bulk-bar" style="margin-top:14px;">
          <label class="check-pill receipt-select-all">
            <input type="checkbox" ${allVisibleSelected ? 'checked' : ''} ${someVisibleSelected ? 'data-mixed="true"' : ''} onclick="toggleAllVisibleExpenseReceipts(this.checked)" />
            Select visible
          </label>
          <span class="status-pill">${selectedExpenseReceipts().length ? `${selectedExpenseReceipts().length} selected` : `${visibleSelectedCount} of ${recentReceipts.length}`}</span>
          <button class="soft-btn" type="button" onclick="batchUpdateReceiptsReview('approved')">Approve selected</button>
          <button class="soft-btn" type="button" onclick="batchUpdateReceiptsReview('flagged')">Flag selected</button>
          <button class="soft-btn" type="button" onclick="bulkReprocessExpenseReceipts()">Reprocess selected</button>
          <button class="soft-btn" type="button" onclick="bulkMergeReceiptTags()">Merge tags</button>
          <button class="soft-btn" type="button" onclick="bulkDeleteExpenseReceipts()">Delete selected</button>
          <button class="soft-btn" type="button" onclick="exportSelectedExpenseReceipts()">Export CSV</button>
          <button class="soft-btn" type="button" onclick="clearExpenseReceiptSelection()">Clear</button>
        </div>

        ${state.expenseReceiptsError ? `
          <div class="report-card" style="margin-top:14px;border-color:rgba(220,38,38,0.24);background:rgba(220,38,38,0.05);">
            ${miniLine('Receipt list error', state.expenseReceiptsError)}
          </div>
        ` : ''}
        <div class="stack" style="margin-top:14px;">
          ${recentReceipts.length ? recentReceipts.map((receipt) => {
            const checked = selectedReceiptIds.has(receipt.id);
            return `
              <div class="list-item receipt-row ${checked ? 'active' : ''}" onclick="setExpenseReceiptDrawer('${encodeURIComponent(receipt.id)}')">
                <label class="check-pill receipt-row-check" onclick="event.stopPropagation();">
                  <input type="checkbox" ${checked ? 'checked' : ''} onclick="toggleExpenseReceiptSelection('${encodeURIComponent(receipt.id)}', this.checked)" />
                </label>
                <div class="receipt-row-main">
                  <div class="pill-line">
                    <span class="status-pill">${esc(receipt.reviewStatus || 'pending')}</span>
                    <span class="status-pill">${esc(receipt.expenseType || 'direct')}</span>
                    <span class="status-pill">${esc(receipt.ocrStatus || 'pending')}</span>
                  </div>
                  <strong>${esc(receipt.vendorName || receipt.fileName || 'Receipt')}</strong>
                  <div class="tiny">${esc(receipt.fileName || 'receipt')} · ${esc(receipt.receiptDate || receipt.expenseMonth || 'no date')} · ${esc(receipt.currency || 'MYR')} ${money(receipt.totalAmount || 0)}</div>
                  <div class="tiny">${esc(receipt.notes || 'No notes yet')}</div>
                </div>
                <div class="pill-line receipt-row-actions">
                  <button class="soft-btn" type="button" onclick="event.stopPropagation(); setExpenseReceiptDrawer('${encodeURIComponent(receipt.id)}')">Drawer</button>
                  <button class="soft-btn" type="button" onclick="event.stopPropagation(); openReceiptTimelineModal('${encodeURIComponent(receipt.id)}')">Timeline</button>
                  <button class="soft-btn" type="button" onclick="event.stopPropagation(); openReceiptDownload('${encodeURIComponent(receipt.id)}')">Download</button>
                  <button class="soft-btn" type="button" onclick="event.stopPropagation(); reprocessReceiptOCR('${encodeURIComponent(receipt.id)}')">Reprocess OCR</button>
                </div>
              </div>
            `;
          }).join('') : `<div class="list-item"><div><strong>No receipts yet</strong><div class="tiny">${receiptSearchValue || String(state.expenseReceiptFilter || 'all') !== 'all' ? 'Try clearing the search or filter.' : 'Upload the first receipt to start the monthly close flow.'}</div></div></div>`}
        </div>
      </div>

      <div class="report-card receipt-workbench-drawer">
        ${renderReceiptDetailDrawer()}
      </div>
    </section>

    <section class="split" style="margin-top:18px;">
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Monthly close</div>
            <strong>Manual snapshot refresh</strong>
          </div>
          <span class="status-pill">${esc(state.expenseRollup?.data?.meta?.snapshotUsed ? 'refreshed' : 'ready')}</span>
        </div>
        <p class="report-copy">Use this after receipt upload or when you want a fresh P&amp;L snapshot without waiting for the next automatic pass.</p>
        <div class="stack" style="margin-top:14px;">
          <label class="field-label" for="report-workspace-id">Workspace ID</label>
          <input id="report-workspace-id" class="text-input" type="text" value="${esc(rollupWorkspaceId)}" placeholder="Workspace ID" />
          <label class="field-label" for="report-workspace-name">Workspace name fallback</label>
          <input id="report-workspace-name" class="text-input" type="text" value="${esc(rollupWorkspaceName)}" placeholder="Work2U Studio" />
          <label class="field-label" for="report-month">Month</label>
          <input id="report-month" class="text-input" type="month" value="${esc(rollupMonth)}" />
        </div>
        <div class="topbar-actions" style="margin-top:14px;">
          <button class="primary-btn" type="button" onclick="refreshMonthlyExpenseRollup()">Refresh rollup</button>
          <button class="soft-btn" type="button" onclick="syncBillingStateFromServer()">Refresh billing</button>
        </div>
        ${state.expenseRollup?.data?.meta ? `
          <div class="stack" style="margin-top:14px;">
            ${miniLine('Status', rollupStatusLabel)}
            ${miniLine('Last refresh', `${esc(rollupMeta?.generatedAt || '-')}`)}
            ${miniLine('Snapshot', rollupMeta?.snapshotUsed ? 'Saved to monthly snapshot table' : 'Live only')}
            ${miniLine('Source', rollupMeta?.liveFallbackUsed ? 'Live fallback used' : 'Stored snapshot')}
          </div>
        ` : ''}
      </div>
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Smoke test</div>
            <strong>Receipt to P&amp;L path</strong>
          </div>
        </div>
        <p class="report-copy">This checks the chain we care about most: billing state sync, receipt upload or review, then a fresh monthly close.</p>
        <div class="stack" style="margin-top:14px;">
          ${miniLine('1. Billing', 'Sync the current subscription and entitlement state.')}
          ${miniLine('2. Receipt', 'Upload or review a receipt to trigger rollup updates.')}
          ${miniLine('3. Snapshot', 'Run manual refresh for immediate reporting close.')}
        </div>
      </div>
    </section>

    <section class="split" style="margin-top:18px;">
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Receipt intake</div>
            <strong>Upload a receipt</strong>
          </div>
          <span class="status-pill">${state.expenseReceiptUpload?.receipt?.id ? 'Uploaded' : 'Ready'}</span>
        </div>
        <p class="report-copy">Drop in a receipt file, fill the key fields, and Work2U will store it, extract it, and rebuild the monthly snapshot.</p>
        <div class="stack" style="margin-top:14px;">
          <label class="field-label" for="receipt-workspace-id">Workspace ID</label>
          <input id="receipt-workspace-id" class="text-input" type="text" value="${esc(rollupWorkspaceId)}" placeholder="Workspace ID" />
          <label class="field-label" for="receipt-file">Receipt file</label>
          <input id="receipt-file" class="text-input" type="file" accept="image/*,application/pdf" />
          <label class="field-label" for="receipt-vendor">Vendor name</label>
          <input id="receipt-vendor" class="text-input" type="text" value="" placeholder="E.g. Shell, Canva, AWS" />
          <div class="grid-2">
            <div class="field">
              <label class="field-label" for="receipt-date">Receipt date</label>
              <input id="receipt-date" class="text-input" type="date" value="${esc(new Date().toISOString().slice(0, 10))}" />
            </div>
            <div class="field">
              <label class="field-label" for="receipt-month">Expense month</label>
              <input id="receipt-month" class="text-input" type="month" value="${esc(rollupMonth)}" />
            </div>
          </div>
          <div class="grid-2">
            <div class="field">
              <label class="field-label" for="receipt-amount">Total amount</label>
              <input id="receipt-amount" class="text-input" type="number" min="0" step="0.01" value="" placeholder="0.00" />
            </div>
            <div class="field">
              <label class="field-label" for="receipt-tax">Tax amount</label>
              <input id="receipt-tax" class="text-input" type="number" min="0" step="0.01" value="0" />
            </div>
          </div>
          <div class="grid-2">
            <div class="field">
              <label class="field-label" for="receipt-currency">Currency</label>
              <select id="receipt-currency">
                <option selected>MYR</option>
                <option>USD</option>
                <option>SGD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div class="field">
              <label class="field-label" for="receipt-expense-type">Expense type</label>
              <select id="receipt-expense-type">
                <option value="direct" selected>direct</option>
                <option value="overhead">overhead</option>
                <option value="travel">travel</option>
                <option value="tools">tools</option>
                <option value="marketing">marketing</option>
                <option value="subscription">subscription</option>
                <option value="other">other</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="receipt-review-status">Review status</label>
            <select id="receipt-review-status">
              <option value="pending" selected>pending</option>
              <option value="approved">approved</option>
              <option value="flagged">flagged</option>
            </select>
          </div>
          <label class="field-label" for="receipt-notes">Notes</label>
          <textarea id="receipt-notes" placeholder="Optional note for this receipt"></textarea>
        </div>
        <div class="topbar-actions" style="margin-top:14px;">
          <button class="primary-btn" type="button" onclick="uploadExpenseReceiptFromForm()">Upload receipt</button>
          <button class="soft-btn" type="button" onclick="refreshMonthlyExpenseRollup()">Refresh after upload</button>
        </div>
        ${state.expenseReceiptUpload ? `
          <div class="stack" style="margin-top:14px;">
            ${miniLine('Last receipt', `${esc(state.expenseReceiptUpload.receipt?.vendor_name || state.expenseReceiptUpload.receipt?.file_name || 'Uploaded receipt')}`)}
            ${miniLine('Receipt id', `${esc(state.expenseReceiptUpload.receipt?.id || '-')}`)}
            ${miniLine('Status', `${esc(state.expenseReceiptUpload.receipt?.review_status || 'pending')}`)}
            ${miniLine('Next step', (state.expenseReceiptUpload.nextSteps || []).join(' · ') || 'Review the receipt values.')}
          </div>
        ` : ''}
        ${state.expenseReceiptError ? `
          <div class="report-card" style="margin-top:14px;border-color:rgba(220,38,38,0.24);background:rgba(220,38,38,0.05);">
            ${miniLine('Upload error', state.expenseReceiptError)}
          </div>
        ` : ''}
      </div>
      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">P&amp;L snapshot</div>
            <strong>Close summary</strong>
          </div>
          <span class="status-pill">${rollupData ? 'Live' : 'Pending'}</span>
        </div>
        <p class="report-copy">This panel mirrors the monthly close so you can see gross revenue, overhead, and profit together with the biggest spend drivers.</p>
        <div class="stack" style="margin-top:14px;">
          ${miniLine('Month', rollupSummary?.monthKey || rollupData?.monthKey || rollupMonth)}
          ${miniLine('Gross revenue', `RM ${money(rollupSummary?.grossRevenue ?? 0)}`)}
          ${miniLine('Total expenses', `RM ${money(rollupSummary?.totalExpenses ?? 0)}`)}
          ${miniLine('Overhead', `RM ${money(rollupSummary?.totalOverhead ?? 0)}`)}
          ${miniLine('Net profit', `RM ${money(rollupSummary?.netProfit ?? 0)}`)}
          ${miniLine('Receipts', `${rollupSummary?.receiptCount ?? 0} total · ${rollupSummary?.approvedReceiptCount ?? 0} approved`)}
          ${miniLine('Top vendor', rollupVendor ? `${rollupVendor.vendorName} · ${rollupVendor.sharePct}%` : 'No vendor data yet')}
          ${miniLine('Top category', rollupCategory ? `${rollupCategory.categoryName} · ${rollupCategory.sharePct}%` : 'No category data yet')}
        </div>
        ${rollupInsights.length ? `
          <div class="stack" style="margin-top:14px;">
            ${rollupInsights.slice(0, 3).map((item) => miniLine(item.title, item.suggestedAction || item.message || 'Review this item.')).join('')}
          </div>
        ` : ''}
      </div>
    </section>

    ${renderReceiptTimelineModal()}
  `;
}

function renderAdmin() {
  const admin = state.billingAdmin || { summary: {}, subscriptions: [], events: [], source: 'local' };
  const summary = admin.summary || {};
  const providers = Object.entries(summary.providers || {});
  const latestSubscription = (admin.subscriptions || [])[0] || null;
  const latestEvent = (admin.events || [])[0] || null;
  const fmtTime = (value) => String(value || '').slice(0, 19).replace('T', ' ') || '-';
  const statusRows = [
    { label: 'Active', value: summary.activeSubscriptions || 0, tone: 'green', note: 'paying' },
    { label: 'Past due', value: summary.pastDueSubscriptions || 0, tone: 'rose', note: 'needs follow-up' },
    { label: 'Pending', value: summary.pendingSubscriptions || 0, tone: 'amber', note: 'awaiting confirmation' }
  ];
  const providerRows = providers.length ? providers.map(([provider, value]) => ({
    label: provider === 'billplz' ? 'Billplz' : provider === 'stripe' ? 'Stripe' : provider,
    value,
    tone: provider === 'billplz' ? 'green' : provider === 'stripe' ? 'blue' : 'slate',
    note: provider === 'billplz' ? 'Malaysia FPX' : provider === 'stripe' ? 'Global cards' : 'Other'
  })) : [
    { label: 'Billplz', value: 0, tone: 'green', note: 'Malaysia FPX' },
    { label: 'Stripe', value: 0, tone: 'blue', note: 'Global cards' }
  ];
  const featureRows = [
    { plan: 'Starter', automation: 'Locked', social: 'Locked', reports: 'Basic' },
    { plan: 'Elite', automation: 'Unlocked', social: 'Unlocked', reports: 'Advanced' },
    { plan: 'Enterprise', automation: 'Unlocked', social: 'Unlocked', reports: 'Advanced + custom' }
  ];

  return `
    <section class="stack">
      <div class="panel">
        <div class="section-title">
          <div>
            <h3>Admin audit</h3>
            <p>Super Admin only. Review subscription state, event trail, and plan usage.</p>
          </div>
          <div class="pill-line">
            <span class="status-pill">${esc(admin.source || 'local')}</span>
            <span class="status-pill">${esc(latestEvent?.event_type || 'no events')}</span>
            <button class="soft-btn" type="button" onclick="syncBillingAdminFromServer()">Refresh audit</button>
          </div>
        </div>
        <div class="grid-2" style="margin-bottom:18px;">
          <div class="report-card">
            <div class="report-top">
              <div>
                <div class="tiny">Audit health</div>
                <strong>${esc(admin.source === 'supabase' ? 'Live from Supabase' : 'Local mirror')}</strong>
              </div>
              <span class="status-pill">${esc(fmtTime(latestEvent?.created_at || latestSubscription?.updated_at || nowIso()))}</span>
            </div>
            <div class="stack" style="margin-top:14px;">
              ${miniLine('Data source', admin.source === 'supabase' ? 'Production billing snapshot' : 'Local fallback snapshot')}
              ${miniLine('Latest event', `${esc(latestEvent?.event_type || 'None')} · ${esc(latestEvent?.provider || '-')}`)}
              ${miniLine('Latest subscription', `${esc(latestSubscription?.plan_code || 'Starter')} · ${esc(latestSubscription?.status || 'pending')}`)}
            </div>
          </div>
          <div class="report-card">
            <div class="report-top">
              <div>
                <div class="tiny">Status mix</div>
                <strong>Billing health distribution</strong>
              </div>
            </div>
            <div style="margin-top:14px;">
              ${chartBars(statusRows)}
            </div>
          </div>
        </div>
        <div class="metric-grid">
          ${pageCards([
            { label: 'Total subscriptions', value: summary.totalSubscriptions || 0, sub: 'All tracked billing records' },
            { label: 'Active', value: summary.activeSubscriptions || 0, sub: 'Current paying customers' },
            { label: 'Past due', value: summary.pastDueSubscriptions || 0, sub: 'Needs follow-up' },
            { label: 'Pending', value: summary.pendingSubscriptions || 0, sub: 'Checkout or verification stage' }
          ])}
        </div>
      </div>

      <section class="split">
        <div class="report-card">
          <div class="report-top">
            <div>
              <div class="tiny">Provider mix</div>
              <strong>Gateway distribution</strong>
            </div>
            <span class="status-pill">${esc((admin.subscriptions || []).length ? 'synced' : 'empty')}</span>
          </div>
          <div style="margin-top:14px;">
            ${chartBars(providerRows)}
          </div>
        </div>
        <div class="report-card">
          <div class="report-top">
            <div>
              <div class="tiny">Subscriptions</div>
              <strong>Latest records</strong>
            </div>
            <span class="status-pill">${esc((admin.subscriptions || []).length ? 'synced' : 'empty')}</span>
          </div>
          <div style="overflow:auto;margin-top:14px;">
            <table class="table" style="min-width:760px;width:100%;">
              <thead>
                <tr>
                  <th>Workspace</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                ${(admin.subscriptions || []).slice(0, 10).map((item) => `
                  <tr>
                    <td>
                      <div style="display:flex;flex-direction:column;gap:4px;">
                        <strong>${esc(item.workspace_name || 'Work2U')}</strong>
                        <span class="tiny">${esc(item.customer_id || item.subscription_id || item.session_id || 'no external id')}</span>
                      </div>
                    </td>
                    <td>${esc(item.email || '-')}</td>
                    <td><span class="status-pill">${esc(item.plan_code || '-')}</span></td>
                    <td><span class="status-pill">${esc(item.provider || '-')}</span></td>
                    <td><span class="status-pill ${String(item.status || '').toLowerCase() === 'active' ? '' : 'warn'}">${esc(item.status || '-')}</span></td>
                    <td>${esc(fmtTime(item.updated_at))}</td>
                  </tr>
                `).join('') || '<tr><td colspan="6">No subscriptions yet.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Billing events</div>
            <strong>Webhook trail</strong>
          </div>
          <span class="status-pill">${esc((admin.events || []).length ? 'live' : 'quiet')}</span>
        </div>
        <div class="stack" style="margin-top:14px;">
          ${(admin.events || []).slice(0, 8).map((event) => `
            <div class="list-item" style="align-items:flex-start;">
              <div style="display:flex;flex-direction:column;gap:4px;">
                <strong>${esc(event.event_type || 'event')}</strong>
                <div class="tiny">${esc(event.workspace_name || 'Work2U')} · ${esc(event.provider || '-')} · ${esc(fmtTime(event.created_at))}</div>
              </div>
              <div class="pill-line">
                <span class="status-pill">${esc(event.status || 'received')}</span>
              </div>
            </div>
          `).join('') || '<div class="tiny">No billing events yet.</div>'}
        </div>
      </div>

      <div class="report-card">
        <div class="report-top">
          <div>
            <div class="tiny">Plan matrix</div>
            <strong>Feature lock overview</strong>
          </div>
        </div>
        <div style="overflow:auto;margin-top:14px;">
          <table class="table" style="min-width:620px;width:100%;">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Automation</th>
                <th>Social</th>
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              ${featureRows.map((row) => `
                <tr>
                  <td>${esc(row.plan)}</td>
                  <td>${esc(row.automation)}</td>
                  <td>${esc(row.social)}</td>
                  <td>${esc(row.reports)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderMemberEditor() {
  const member = state.memberEditor || {
    name: '',
    email: '',
    role: 'User',
    preset: 'Operations',
    scope: 'Workspace',
    status: 'Active'
  };
  return `
    <div class="field">
      <label>Name</label>
      <input id="member-name" value="${esc(member.name)}" placeholder="Member name" />
    </div>
    <div class="field">
      <label>Email</label>
      <input id="member-email" value="${esc(member.email)}" placeholder="member@company.com" />
    </div>
    <div class="form-grid">
      ${selectField('Role', 'member-role', member.role, ['Super Admin', 'Admin', 'User'])}
      ${selectField('Preset', 'member-preset', member.preset, ['Sales', 'Finance', 'Operations', 'Manager', 'Viewer'])}
      ${selectField('Scope', 'member-scope', member.scope, ['Own only', 'Assigned only', 'Workspace', 'All workspaces'])}
      ${selectField('Status', 'member-status', member.status, ['Active', 'Invited', 'Disabled'])}
    </div>
    <div class="topbar-actions">
      <button class="ghost-btn" type="button" id="delete-member">Delete</button>
      <div style="flex:1"></div>
      <button class="ghost-btn" type="button" id="cancel-member">Cancel</button>
      <button class="primary-btn" type="submit">Save member</button>
    </div>
  `;
}

function field(labelText, id, value) {
  return `
    <div class="field">
      <label for="${id}">${labelText}</label>
      <input id="${id}" value="${esc(value)}" />
    </div>
  `;
}

function selectField(labelText, id, value, options) {
  return `
    <div class="field">
      <label for="${id}">${labelText}</label>
      <select id="${id}">
        ${options.map((option) => `<option ${option === value ? 'selected' : ''}>${esc(option)}</option>`).join('')}
      </select>
    </div>
  `;
}

function checkbox(id, labelText, checked) {
  return `
    <label class="check-pill">
      <input type="checkbox" id="channel-${id}" ${checked ? 'checked' : ''} />
      ${labelText}
    </label>
  `;
}

function checkItem(labelText, ok) {
  return `
    <div class="list-item">
      <div>
        <strong>${esc(labelText)}</strong>
      </div>
      <span class="status-pill ${ok ? '' : 'warn'}">${ok ? 'Done' : 'Pending'}</span>
    </div>
  `;
}

function miniLine(title, copy) {
  return `
    <div class="list-item">
      <div>
        <strong>${esc(title)}</strong>
        <div class="tiny">${esc(copy)}</div>
      </div>
    </div>
  `;
}

function chartBars(items) {
  const max = Math.max(...items.map((item) => Number(item.value || 0)), 1);
  const toneMap = {
    blue: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
    green: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
    amber: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
    rose: 'linear-gradient(90deg, #ef4444 0%, #fb7185 100%)',
    slate: 'linear-gradient(90deg, #475569 0%, #94a3b8 100%)'
  };

  return `
    <div class="stack">
      ${items.map((item) => {
        const value = Number(item.value || 0);
        const pct = Math.max(6, Math.round((value / max) * 100));
        const bar = toneMap[item.tone] || toneMap.blue;
        return `
          <div class="list-item" style="align-items:flex-start;">
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:8px;">
                <strong>${esc(item.label)}</strong>
                <span class="tiny">${esc(value)}${item.total != null ? ` / ${esc(item.total)}` : ''}${item.note ? ` · ${esc(item.note)}` : ''}</span>
              </div>
              <div style="height:10px;border-radius:999px;background:rgba(148,163,184,0.16);overflow:hidden;">
                <div style="width:${pct}%;height:100%;border-radius:999px;background:${bar};"></div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderPnlTrendChart(rows) {
  const series = (Array.isArray(rows) ? rows : [])
    .slice()
    .sort((a, b) => String(a.monthKey || '').localeCompare(String(b.monthKey || '')))
    .slice(-6);
  const items = series.length ? series.map((row) => {
    const profit = Number(row.netProfit || 0);
    const absProfit = Math.max(Math.abs(profit), 1);
    return {
      label: String(row.monthKey || '').slice(0, 7) || '-',
      value: absProfit,
      note: `${profit < 0 ? 'Loss' : 'Profit'} RM ${money(profit)} · Revenue RM ${money(row.grossRevenue || 0)}`,
      tone: profit >= 0 ? 'green' : 'rose'
    };
  }) : [{
    label: String(currentMonthKey()).slice(0, 7),
    value: 1,
    note: 'No historical snapshot yet',
    tone: 'blue'
  }];

  return `
    <div class="pnl-trend-wrap">
      <div class="section-title" style="margin-bottom:12px;">
        <div>
          <h3>Monthly trend</h3>
          <p>Last six snapshot closes for a quick direction check.</p>
        </div>
        <span class="status-pill">${series.length ? `${series.length} months` : 'Pending'}</span>
      </div>
      ${chartBars(items)}
    </div>
  `;
}

function roleCard(title, copy, detail) {
  return `
    <article class="role-card">
      <div class="thread-top">
        <div>
          <div class="role-title">${esc(title)}</div>
          <div class="tiny">${esc(copy)}</div>
        </div>
        <span class="status-pill">${title === 'Super Admin' ? 'Platform' : title === 'Admin' ? 'Workspace' : 'Assigned'}</span>
      </div>
      <p class="role-meta" style="margin-top:10px;">${esc(detail)}</p>
    </article>
  `;
}

function planCard(name, price, copy, featured, features) {
  const active = normalizePackageName(state.profile.package) === name;
  const region = String(state.profile.region || 'Malaysia');
  const provider = region.toLowerCase().includes('malaysia') ? 'billplz' : 'stripe';
  const trialNote = name === 'Enterprise' || provider !== 'stripe'
    ? ''
    : '<div class="tiny" style="margin-top:10px;">7-day trial on Stripe · card required · cancel anytime from billing portal</div>';
  const actionLabel = name === 'Enterprise'
    ? 'Contact sales'
    : active
      ? 'Current plan'
      : provider === 'stripe'
        ? 'Start 7-day trial'
        : 'Continue to checkout';
  return `
    <article class="plan-card ${featured ? 'featured' : ''}">
      <div class="pill-line" style="justify-content:space-between;margin-bottom:8px;">
        <div class="tiny">${esc(name)}</div>
        <span class="status-pill ${active ? '' : 'warn'}">${active ? 'Active' : 'Available'}</span>
      </div>
      <h4>${esc(name)}</h4>
      <div class="plan-price">${esc(price)}</div>
      <p class="billing-copy">${esc(copy)}</p>
      ${trialNote}
      <div class="stack" style="margin-top:14px;">
        ${features.map((feature) => `<div class="list-item"><div><strong>${esc(feature)}</strong></div></div>`).join('')}
      </div>
      <div class="topbar-actions" style="margin-top:16px;">
        <button class="ghost-btn" type="button" onclick="openBillingPackage('${name}')">${esc(actionLabel)}</button>
      </div>
    </article>
  `;
}

function openBillingPackage(plan) {
  const normalized = normalizePackageName(plan);
  if (normalized === 'Enterprise') {
    window.location.href = 'mailto:enquiry@work2u.io?subject=Work2U%20Enterprise%20Plan';
    return;
  }

  if (normalizePackageName(state.profile.package) === normalized) {
    updateAuthStatus(`${normalized} is already your active package.`, 'good');
    return;
  }

  const region = state.profile.region || 'Malaysia';
  const provider = region.toLowerCase().includes('malaysia') ? 'billplz' : 'stripe';
  updateAuthStatus(`Opening ${normalized}${provider === 'stripe' ? ' trial' : ''} checkout...`, 'warn');
  void (async () => {
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: normalized,
          region,
          provider,
          email: state.profile.loginEmail || state.auth.email || '',
          name: state.profile.workspaceName || 'Work2U Customer',
          workspaceName: state.profile.workspaceName || 'Work2U Studio'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Checkout could not be created');
      }

      updateAuthStatus(`Redirecting to ${data.provider === 'billplz' ? 'Billplz' : 'Stripe'}...`, 'good');
      window.location.href = data.paymentUrl;
    } catch (error) {
      updateAuthStatus(error.message || 'Unable to open checkout', 'bad');
    }
  })();
}

function authMethodLabel(method) {
  return {
    email: 'Email'
  }[method] || 'Email';
}

function providerForMethod(method) {
  return {
    email: 'email',
    google: 'google'
  }[method] || 'email';
}

function featureLabel(item) {
  return {
    tasks: 'Tasks',
    hub: 'Inbox',
    accounting: 'Accounting',
    calendar: 'Calendar',
    ai: 'AI',
    social: 'Social'
  }[item] || item;
}

function humanizeList(items, fallback = 'None') {
  return (items || []).length ? items.join(', ') : fallback;
}

function normalizePackageName(plan) {
  return {
    starter: 'Starter',
    elite: 'Elite',
    enterprise: 'Enterprise'
  }[String(plan || '').toLowerCase()] || 'Starter';
}

function packageEntitlements(plan) {
  return PLAN_LIMITS[normalizePackageName(plan)] || PLAN_LIMITS.Starter;
}

function resolveEffectiveEntitlements(plan, override = null) {
  const base = packageEntitlements(plan);
  if (!override || typeof override !== 'object') return { ...base };

  return {
    ...base,
    ...override,
    maxUsers: override.maxUsers ?? base.maxUsers,
    maxWorkspaces: override.maxWorkspaces ?? base.maxWorkspaces,
    maxMainChannels: override.maxMainChannels ?? base.maxMainChannels,
    maxLeadsActive: override.maxLeadsActive ?? base.maxLeadsActive,
    maxClientsActive: override.maxClientsActive ?? base.maxClientsActive,
    maxTasksActive: override.maxTasksActive ?? base.maxTasksActive,
    maxAiActionsMonth: override.maxAiActionsMonth ?? base.maxAiActionsMonth,
    maxAutomationRules: override.maxAutomationRules ?? base.maxAutomationRules,
    maxConnectors: override.maxConnectors ?? base.maxConnectors,
    maxStorageGb: override.maxStorageGb ?? base.maxStorageGb,
    maxEmailSendsMonth: override.maxEmailSendsMonth ?? base.maxEmailSendsMonth,
    maxSharedTemplates: override.maxSharedTemplates ?? base.maxSharedTemplates,
    allowCustomBranding: override.allowCustomBranding ?? base.allowCustomBranding,
    allowCustomPermissions: override.allowCustomPermissions ?? base.allowCustomPermissions,
    allowCustomWorkflow: override.allowCustomWorkflow ?? base.allowCustomWorkflow,
    allowAuditLog: override.allowAuditLog ?? base.allowAuditLog,
    allowPrioritySlaSupport: override.allowPrioritySlaSupport ?? base.allowPrioritySlaSupport,
    allowByoAiKey: override.allowByoAiKey ?? base.allowByoAiKey,
    aiQuota: override.aiQuota || base.aiQuota,
    storage: override.storage || base.storage,
    reporting: override.reporting || base.reporting,
    automationBuilder: typeof override.automationBuilder === 'boolean' ? override.automationBuilder : base.automationBuilder,
    socialManagement: typeof override.socialManagement === 'boolean' ? override.socialManagement : base.socialManagement,
    advancedReports: typeof override.advancedReports === 'boolean' ? override.advancedReports : base.advancedReports
  };
}

function currentEntitlements(plan = state.profile.package) {
  const normalizedPlan = normalizePackageName(plan);
  const billingPlan = normalizePackageName(state.billing?.plan || state.billing?.subscription?.plan_code || normalizedPlan);
  const override = billingPlan === normalizedPlan ? state.billing?.entitlement || null : null;
  return resolveEffectiveEntitlements(normalizedPlan, override);
}

function currentMonthKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

function currentWorkspaceIdFallback() {
  return state.profile.workspaceId || state.auth.userId || '';
}

function numericLimit(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sanitizeProfileForPlan(profile) {
  const next = { ...profile };
  const plan = normalizePackageName(next.package);
  const ent = packageEntitlements(plan);
  const maxConnectors = numericLimit(ent.maxConnectors);

  if (Array.isArray(next.channels) && maxConnectors !== null && next.channels.length > maxConnectors) {
    next.channels = next.channels.slice(0, maxConnectors);
  }

  const allowedModes = {
    Starter: ['Suggest only', 'Draft only'],
    Elite: ['Suggest only', 'Draft only', 'Semi-auto', 'Auto-send for approved rules'],
    Enterprise: ['Suggest only', 'Draft only', 'Semi-auto', 'Auto-send for approved rules']
  };
  const supportedModes = allowedModes[plan] || allowedModes.Starter;
  if (!supportedModes.includes(next.aiMode)) {
    next.aiMode = supportedModes[0];
  }

  return next;
}

function normalizeAccessRole(role) {
  const value = String(role || '').toLowerCase();
  if (value.includes('super')) return 'Super Admin';
  if (value.includes('admin')) return 'Admin';
  return 'User';
}

function roleCapabilities(role) {
  const normalized = normalizeAccessRole(role);
  const base = {
    views: ['overview', 'setup', 'workspace', 'hub', 'tasks', 'clients', 'calendar', 'ai'],
    canManageMembers: false,
    canViewBilling: false,
    canViewReports: false,
    canChangePlatformSettings: false
  };

  if (normalized === 'Admin') {
    return {
      ...base,
      views: [...base.views, 'access', 'billing', 'reports'],
      canManageMembers: true,
      canViewBilling: true,
      canViewReports: true
    };
  }

  if (normalized === 'Super Admin') {
    return {
      views: ['overview', 'setup', 'workspace', 'hub', 'tasks', 'clients', 'calendar', 'ai', 'access', 'billing', 'reports', 'admin'],
      canManageMembers: true,
      canViewBilling: true,
      canViewReports: true,
      canChangePlatformSettings: true
    };
  }

  return base;
}

function canAccessView(view) {
  return roleCapabilities(state.profile?.accessRole).views.includes(view);
}

function canManageMembers() {
  return roleCapabilities(state.profile?.accessRole).canManageMembers;
}

function isSuperAdmin() {
  return roleCapabilities(state.profile?.accessRole).canChangePlatformSettings;
}

function canUseFeature(feature) {
  const ent = currentEntitlements();
  if (Object.prototype.hasOwnProperty.call(ent, feature)) {
    return !!ent[feature];
  }
  return true;
}

function recommendPackage(survey) {
  const needs = survey.needs || [];
  const channels = survey.channels || [];
  if (survey.role === 'Corporate Team' || survey.teamSize === '10+') {
    return { name: 'Enterprise', reason: 'Best fit for bigger teams, tighter permissions, and custom onboarding.' };
  }
  if (
    survey.goal === 'Coordinate team' ||
    survey.goal === 'Send invoices' ||
    needs.includes('accounting') ||
    channels.length >= 3 ||
    survey.aiMode === 'Auto-send for approved rules'
  ) {
    return { name: 'Elite', reason: 'Stronger for multi-channel follow-up, automation, and collaboration.' };
  }
  return { name: 'Starter', reason: 'Keeps the entry cost low while covering core follow-up and reminders.' };
}

function personaBlueprint(persona) {
  const map = {
    'Property Agent': {
      title: 'Property flow',
      summary: 'Track enquiries, arrange viewing, send quotation, and follow up until deposit is closed.',
      package: 'Elite',
      channels: ['WhatsApp', 'Email', 'Telegram'],
      ai: 'Draft fast replies with listing details and viewing reminders.',
      steps: ['Capture lead', 'Schedule viewing', 'Send quotation', 'Confirm next step'],
      fields: ['Preferred area', 'Listing type', 'Viewing date', 'Budget range']
    },
    'Insurance Agent': {
      title: 'Insurance flow',
      summary: 'Manage prospects, collect documents, prepare renewal reminders, and keep policy tasks on track.',
      package: 'Elite',
      channels: ['WhatsApp', 'Email'],
      ai: 'Suggest compliant follow-up copy and document request messages.',
      steps: ['Qualify prospect', 'Request documents', 'Send proposal', 'Follow up renewal'],
      fields: ['Policy type', 'Renewal date', 'Document checklist', 'Preferred channel']
    },
    'Freelancer': {
      title: 'Freelance flow',
      summary: 'Handle leads, quotation, milestone reminders, and invoice follow-up without losing momentum.',
      package: 'Starter',
      channels: ['WhatsApp', 'Email'],
      ai: 'Draft quotations, project updates, and payment reminders.',
      steps: ['Understand brief', 'Send quote', 'Track progress', 'Invoice and collect'],
      fields: ['Service type', 'Expected budget', 'Delivery date', 'Payment terms']
    },
    'Corporate Team': {
      title: 'Corporate flow',
      summary: 'Coordinate multiple users, assign work by department, and control approval flow.',
      package: 'Enterprise',
      channels: ['Email', 'Telegram'],
      ai: 'Summarize team updates and produce internal follow-up briefings.',
      steps: ['Assign owner', 'Review request', 'Approve task', 'Archive completed work'],
      fields: ['Department', 'Approval owner', 'SLA target', 'Reporting cadence']
    },
    'General Business': {
      title: 'General business flow',
      summary: 'A flexible setup for any business that wants reminders, client tracking, and faster response times.',
      package: 'Starter',
      channels: ['WhatsApp', 'Email'],
      ai: 'Help structure the workflow around the business idea.',
      steps: ['Collect lead', 'Set reminder', 'Send follow-up', 'Close deal'],
      fields: ['Main product', 'Lead source', 'Response time', 'Priority channel']
    }
  };
  return map[persona] || map['Freelancer'];
}

function readSurveyForm() {
  return {
    workspaceName: document.getElementById('survey-workspace')?.value.trim() || defaultSurvey().workspaceName,
    role: document.getElementById('survey-role')?.value || defaultSurvey().role,
    goal: document.getElementById('survey-goal')?.value || defaultSurvey().goal,
    teamSize: document.getElementById('survey-team')?.value || defaultSurvey().teamSize,
    region: document.getElementById('survey-region')?.value || defaultSurvey().region,
    language: document.getElementById('survey-language')?.value || defaultSurvey().language,
    channels: ['whatsapp', 'email', 'telegram'].filter((channel) => document.getElementById(`survey-channel-${channel}`)?.checked),
    needs: ['tasks', 'hub', 'accounting', 'calendar', 'ai', 'social'].filter((item) => document.getElementById(`survey-${item}`)?.checked),
    aiMode: document.querySelector('#survey-ai-mode .choice-card.active')?.dataset.value || defaultSurvey().aiMode,
    emailAddress: document.getElementById('auth-email')?.value.trim() || '',
    mailboxType: document.getElementById('auth-mailbox')?.value || defaultSurvey().mailboxType
  };
}

function writeSurveyForm(survey) {
  const current = survey || defaultSurvey();
  const workspace = document.getElementById('survey-workspace');
  if (workspace) workspace.value = current.workspaceName || '';
  const role = document.getElementById('survey-role');
  if (role) role.value = current.role || defaultSurvey().role;
  const goal = document.getElementById('survey-goal');
  if (goal) goal.value = current.goal || defaultSurvey().goal;
  const team = document.getElementById('survey-team');
  if (team) team.value = current.teamSize || defaultSurvey().teamSize;
  const region = document.getElementById('survey-region');
  if (region) region.value = current.region || defaultSurvey().region;
  const language = document.getElementById('survey-language');
  if (language) language.value = current.language || defaultSurvey().language;

  ['whatsapp', 'email', 'telegram'].forEach((channel) => {
    const box = document.getElementById(`survey-channel-${channel}`);
    if (box) box.checked = (current.channels || defaultSurvey().channels).includes(channel);
  });

  ['tasks', 'hub', 'accounting', 'calendar', 'ai', 'social'].forEach((item) => {
    const box = document.getElementById(`survey-${item}`);
    if (box) box.checked = (current.needs || defaultSurvey().needs).includes(item);
  });

  const authEmail = document.getElementById('auth-email');
  if (authEmail) authEmail.value = current.emailAddress || '';
  const mailbox = document.getElementById('auth-mailbox');
  if (mailbox) mailbox.value = current.mailboxType || defaultSurvey().mailboxType;

  document.querySelectorAll('#survey-ai-mode .choice-card').forEach((button) => {
    button.classList.toggle('active', button.dataset.value === (current.aiMode || defaultSurvey().aiMode));
  });
}

function updateAuthStatus(message, tone = 'warn') {
  state.authMessage = message;
  state.authTone = tone;
  const status = document.getElementById('auth-status');
  if (status) {
    status.className = `auth-status ${tone}`.trim();
    status.textContent = message;
  }
}

function authButtonLabel() {
  return {
    email: 'Send magic link'
  }[state.auth.method] || 'Continue';
}

function authMethodDetails(method = state.auth.method) {
  const config = state.publicConfig || {};
  const supabaseReady = !!config.auth?.supabaseReady;
  const map = {
    email: {
      title: 'Email login',
      copy: supabaseReady
        ? 'Best when you want a simple magic-link sign in and plan to send messages from your own mailbox or a Work2U domain mailbox.'
        : 'Supabase Auth needs to be connected before email magic links can work in production.',
      steps: [
        'Enter your email address in the field below.',
        'We send a magic link to verify the sign in.',
        'After sign in, Work2U opens the dashboard with your survey settings.'
      ]
    }
  };

  return map[method] || map.email;
}

function updateAuthControls() {
  const emailField = document.getElementById('auth-email-field');
  if (emailField) emailField.hidden = state.auth.method !== 'email';
  const button = document.getElementById('auth-continue');
  if (button) button.textContent = authButtonLabel();
  const signOut = document.getElementById('signout-btn');
  if (signOut) signOut.hidden = !state.auth.signedIn;
  document.querySelectorAll('#auth-method-grid .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.method === state.auth.method);
  });

  const methodNote = document.getElementById('auth-method-note');
  if (methodNote) {
    const detail = authMethodDetails();
    methodNote.innerHTML = `
      <strong>${esc(detail.title)}</strong>
      <div>${esc(detail.copy)}</div>
    `;
  }

  const methodSteps = document.getElementById('auth-login-steps');
  if (methodSteps) {
    const detail = authMethodDetails();
    methodSteps.innerHTML = detail.steps.map((step, index) => `
      <div class="auth-login-step">
        <span>${index + 1}</span>
        <div>${esc(step)}</div>
      </div>
    `).join('');
  }

  const readiness = document.getElementById('auth-readiness');
  if (readiness) {
    const config = state.publicConfig || {};
    const items = [
      {
        title: 'Supabase Auth',
        status: config.auth?.supabaseReady ? 'Ready' : 'Missing',
        copy: config.auth?.supabaseReady
          ? 'Email login and session callbacks can be handled through Supabase.'
          : 'Set SUPABASE_URL and SUPABASE_ANON_KEY before launching auth.'
      },
      {
        title: 'Resend Mailer',
        status: config.mail?.resendReady ? 'Ready' : 'Missing',
        copy: config.mail?.resendReady
          ? `Sender: ${config.mail.from}`
          : 'Set RESEND_API_KEY and verified sender details before launch.'
      },
      {
        title: 'Internal calendar',
        status: 'Ready',
      copy: 'Work2U V1 uses its own scheduling layer before any optional external calendar sync later.'
      }
    ];

    readiness.innerHTML = items.map((item) => `
      <article class="auth-readiness-card">
        <div class="pill-line">
          <strong>${esc(item.title)}</strong>
          <span class="status-pill ${item.status === 'Ready' ? '' : 'warn'}">${esc(item.status)}</span>
        </div>
        <div class="tiny" style="margin-top:8px;">${esc(item.copy)}</div>
      </article>
    `).join('');
  }

  const checklist = document.getElementById('auth-checklist');
  if (checklist) {
    const config = state.publicConfig || {};
    const checklistItems = [
      { label: 'Supabase URL and anon key', done: !!(config.supabaseUrl && config.supabaseAnonKey) },
      { label: 'Resend API key and verified sender', done: !!config.mail?.resendReady },
      { label: 'Email login and magic link route', done: !!config.auth?.supabaseReady },
      { label: 'Production redirect URL configured', done: !!config.supabaseRedirectTo && /^https:\/\//i.test(config.supabaseRedirectTo) }
    ];

    checklist.innerHTML = `
      <div class="auth-checklist-title">V1 readiness checklist</div>
      <div class="auth-checklist-items">
        ${checklistItems.map((item) => `
          <div class="auth-checklist-item ${item.done ? 'done' : 'pending'}">
            <span>${item.done ? '✓' : '•'}</span>
            <div>${esc(item.label)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

function updateSurveySummary() {
  const survey = readSurveyForm();
  state.survey = survey;
  save(STORAGE.survey, survey);
  const recommendation = recommendPackage(survey);
  const summary = document.getElementById('survey-summary');
  const packagePill = document.getElementById('auth-package-pill');
  if (summary) {
    const recommendationPlan = packageEntitlements(recommendation.name);
    const regionSuggestion = guessSurveyRegionFromContext(survey.language);
    const locked = [];
    if (!recommendationPlan.automationBuilder && (survey.aiMode === 'Semi-auto' || survey.aiMode === 'Auto-send for approved rules')) {
      locked.push('Automation builder stays locked on Starter.');
    }
    if (!recommendationPlan.socialManagement && (survey.needs || []).includes('social')) {
      locked.push('Social media management starts from Elite.');
    }
    if (!recommendationPlan.advancedReports && (survey.needs || []).includes('accounting')) {
      locked.push('Advanced reporting and deeper PnL tools start from Elite.');
    }
    summary.innerHTML = `
      <div class="summary-title">Recommended package</div>
      <div class="summary-package">${esc(recommendation.name)}</div>
      <div class="summary-copy">${esc(recommendation.reason)}</div>
      <div class="summary-grid">
        <div>
          <span class="tiny">Role</span>
          <strong>${esc(survey.role)}</strong>
        </div>
        <div>
          <span class="tiny">Goal</span>
          <strong>${esc(survey.goal)}</strong>
        </div>
        <div>
          <span class="tiny">Channels</span>
          <strong>${esc(humanizeList((survey.channels || []).map(label)))}</strong>
        </div>
        <div>
          <span class="tiny">Functions</span>
          <strong>${esc(humanizeList((survey.needs || []).map(featureLabel)))}</strong>
        </div>
        <div>
          <span class="tiny">Region</span>
          <strong>${esc(survey.region)}</strong>
        </div>
        <div>
          <span class="tiny">Suggested</span>
          <strong>${esc(regionSuggestion.region)}</strong>
        </div>
      </div>
      ${locked.length ? `<div class="summary-copy" style="margin-top:10px;">${esc(locked.join(' '))}</div>` : ''}
    `;
  }
  if (packagePill) packagePill.textContent = recommendation.name;
  updateAuthControls();
  const regionSuggestion = guessSurveyRegionFromContext(survey.language);
  syncSurveyLocationStatus(`Region: ${survey.region}. Suggested: ${regionSuggestion.region}. Billplz for Malaysia, Stripe for Global.`);
  refreshOnboardingWizard();
  maybeOpenOnboardingWelcome();
}

function syncAuthGate() {
  const gate = document.getElementById('auth-gate');
  if (!gate) return;
  gate.hidden = !!state.auth.signedIn;
  document.body.classList.toggle('locked', !state.auth.signedIn);
  if (state.auth.signedIn) {
    closeOnboardingWelcome(false);
  } else {
    writeSurveyForm(state.survey);
    updateSurveySummary();
    updateAuthControls();
    updateAuthStatus(state.authMessage || 'Connect Supabase auth to enable email login.', state.authTone || 'warn');
  }
  refreshOnboardingWizard();
}

function saveSurveyDraft() {
  state.survey = readSurveyForm();
  save(STORAGE.survey, state.survey);
  updateSurveySummary();
}

function selectAuthMethod(method) {
  state.auth.method = method;
  save(STORAGE.auth, state.auth);
  updateAuthControls();
  refreshOnboardingWizard();
  updateAuthStatus(
    method === 'email'
      ? 'Email login will send a magic link to your inbox.'
      : `You will be redirected to ${authMethodLabel(method)} to continue sign-in.`,
    'warn'
  );
}

async function getPublicConfig() {
  try {
    const response = await fetch('/api/public-config');
    if (!response.ok) return null;
    const data = await response.json();
    state.publicConfig = data;
    return data;
  } catch {
    return null;
  }
}

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (supabaseInitPromise) return supabaseInitPromise;

  supabaseInitPromise = (async () => {
    const config = await getPublicConfig();
    state.authConfigured = !!(config?.supabaseUrl && config?.supabaseAnonKey);
    state.authLoading = false;
    if (!state.authConfigured) {
      state.auth = { ...defaultAuth(), method: state.auth.method };
      save(STORAGE.auth, state.auth);
      updateAuthStatus('Supabase auth is not configured yet. Add SUPABASE_URL and SUPABASE_ANON_KEY in .env to enable real login.', 'bad');
      return null;
    }

    const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabaseClient = mod.createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    return supabaseClient;
  })().catch((error) => {
    state.authLoading = false;
    state.auth = { ...defaultAuth(), method: state.auth.method };
    save(STORAGE.auth, state.auth);
    updateAuthStatus(`Unable to initialize auth: ${error.message}`, 'bad');
    return null;
  });

  return supabaseInitPromise;
}

function getAuthRedirectTo() {
  return state.publicConfig?.supabaseRedirectTo || `${window.location.origin}/work2u`;
}

async function applySession(session) {
  if (!session?.user) return;
  const provider = session.user.app_metadata?.provider || session.user.identities?.[0]?.provider || 'email';
  const authMethod = provider === 'google' ? 'google' : 'email';
  const email = session.user.email || state.survey.emailAddress || state.profile.loginEmail || '';

  state.auth = {
    signedIn: true,
    method: authMethod,
    email,
    userId: session.user.id,
    emailVerified: !!session.user.email_confirmed_at
  };
  save(STORAGE.auth, state.auth);

  const survey = state.survey || defaultSurvey();
  const recommendation = recommendPackage(survey);
  const existingRow = await loadProfileFromSupabase(session.user.id);

  const nextProfile = existingRow
    ? {
        ...state.profile,
        ...existingRow,
        accessRole: normalizeAccessRole(existingRow.accessRole || existingRow.access_role || state.profile.accessRole),
        loginEmail: email || existingRow.loginEmail || existingRow.email || '',
        workspaceId: existingRow.workspaceId || existingRow.workspace_id || state.profile.workspaceId || session.user.id || '',
        authMethod: authMethodLabel(authMethod),
        setupComplete: !!existingRow.setupComplete
      }
    : {
        ...defaultProfile(),
        ...state.profile,
        workspaceId: state.profile.workspaceId || session.user.id || '',
        workspaceName: survey.workspaceName || state.profile.workspaceName || defaultProfile().workspaceName,
        persona: survey.role,
        primaryGoal: survey.goal,
        package: recommendation.name,
        channels: survey.channels,
        accessRole: state.profile.accessRole || defaultProfile().accessRole,
        authMethod: authMethodLabel(authMethod),
        loginEmail: email,
        mailboxType: survey.mailboxType,
        aiMode: survey.aiMode,
        language: survey.language,
        region: survey.region,
        teamSize: survey.teamSize,
        setupComplete: false,
        notes: `Survey needs: ${humanizeList((survey.needs || []).map(featureLabel))}.`,
        onboardingStep: 'survey'
      };

  saveProfile(nextProfile);

  const members = await loadMembersFromSupabase(session.user.id);
  if (members.length) {
    state.members = members;
  } else {
    state.members = defaultMembersForSession(session, nextProfile);
    save(STORAGE.members, state.members);
    await Promise.all(state.members.map((member) => syncMemberToSupabase(member)));
  }
  state.memberEditor = null;
  persistCollection('members');

  state.view = nextProfile.setupComplete ? 'overview' : 'setup';
  save(STORAGE.view, state.view);
  updateAuthStatus(
    nextProfile.setupComplete
      ? `Signed in as ${email || authMethodLabel(authMethod)}.`
      : `Signed in as ${email || authMethodLabel(authMethod)}. Complete onboarding to finish your workspace.`,
    'good'
  );
  render();
  void syncBillingStateFromServer();
  void syncRecentExpenseReceiptsFromServer();
}

async function bootstrapAuth() {
  const client = await getSupabaseClient();
  if (!client) return;

  client.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      void applySession(session);
      return;
    }

    state.auth = { ...defaultAuth(), method: state.auth.method };
    state.auth.signedIn = false;
    state.auth.userId = null;
    state.auth.emailVerified = false;
    save(STORAGE.auth, state.auth);
    updateAuthStatus('Signed out. Choose a login method to continue.', 'warn');
    render();
  });

  const { data, error } = await client.auth.getSession();
  state.authLoading = false;
  if (error) {
    updateAuthStatus(`Auth session check failed: ${error.message}`, 'bad');
    return;
  }

  if (data.session?.user) {
    await applySession(data.session);
    return;
  }

  state.auth.signedIn = false;
  state.auth.userId = null;
  state.auth.emailVerified = false;
  save(STORAGE.auth, state.auth);
  updateAuthStatus('Connect Supabase auth to enable email login.', 'warn');
}

async function completeAuth() {
  const survey = readSurveyForm();
  state.survey = survey;
  save(STORAGE.survey, survey);
  updateSurveySummary();

  const client = await getSupabaseClient();
  if (!client) return;
  if (!state.publicConfig?.auth?.supabaseReady) {
    updateAuthStatus('Production auth is not ready yet. Connect Supabase Auth before enabling login.', 'bad');
    return;
  }

  if (state.auth.method === 'email') {
    const email = survey.emailAddress || state.auth.email || '';
    if (!email) {
      updateAuthStatus('Please enter an email address before sending the magic link.', 'warn');
      document.getElementById('auth-email')?.focus();
      return;
    }

    updateAuthStatus('Sending your magic link through Work2U mailer...', 'warn');
    const response = await fetch('/api/work2u/email/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: survey.workspaceName || state.profile?.workspaceName || 'Work2U',
        workspaceName: survey.workspaceName || state.profile?.workspaceName || 'Work2U',
        redirectTo: getAuthRedirectTo(),
        shouldCreateUser: true,
        expiresInMinutes: 60
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      if (!client?.auth?.signInWithOtp) {
        updateAuthStatus(`Email login failed: ${payload.error || 'Unable to send magic link'}`, 'bad');
        return;
      }

      updateAuthStatus('Work2U mailer was unavailable. Falling back to Supabase magic link...', 'warn');
      const fallback = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: getAuthRedirectTo()
        }
      });

      if (fallback?.error) {
        updateAuthStatus(`Email login failed: ${fallback.error.message}`, 'bad');
        return;
      }
    } else {
      state.auth.email = email;
      state.auth.userId = null;
      state.auth.emailVerified = false;
      save(STORAGE.auth, state.auth);
      updateAuthStatus('Magic link sent from Work2U mailer. Check your email to complete sign-in.', 'good');
      return;
    }

    state.auth.email = email;
    state.auth.userId = null;
    state.auth.emailVerified = false;
    save(STORAGE.auth, state.auth);
    updateAuthStatus('Magic link sent. Check your email to complete sign-in.', 'good');
    return;
  }

  if (state.auth.method !== 'email') {
    updateAuthStatus('Work2U V1 uses email login only. Select email to continue.', 'warn');
    return;
  }

  updateAuthStatus('Work2U V1 uses email login only. Select email to continue.', 'warn');
}

function setupSuggestion(kind) {
  const suggestions = {
    freelancer: {
      workspaceName: 'Work2U Freelance Hub',
      persona: 'Freelancer',
      primaryGoal: 'Follow up prospects',
      package: 'Starter',
      channels: ['whatsapp', 'email'],
      aiMode: 'Suggest only',
      aiSource: 'Work2U managed',
      language: 'BM + English',
      region: 'Malaysia',
      teamSize: '1',
      notes: 'Focus on fast follow-up, quotations, and payment reminders.'
    },
    property: {
      workspaceName: 'Work2U Property Desk',
      persona: 'Property Agent',
      primaryGoal: 'Follow up prospects',
      package: 'Elite',
      channels: ['whatsapp', 'email', 'telegram'],
      aiMode: 'Draft only',
      aiSource: 'Work2U managed',
      language: 'BM + English',
      region: 'Malaysia',
      teamSize: '2-5',
      notes: 'Use this profile for viewing schedule, offer follow-up, and document sharing.'
    },
    insurance: {
      workspaceName: 'Work2U Insurance Desk',
      persona: 'Insurance Agent',
      primaryGoal: 'Manage clients',
      package: 'Elite',
      channels: ['whatsapp', 'email'],
      aiMode: 'Draft only',
      aiSource: 'Work2U managed',
      language: 'BM + English',
      region: 'Malaysia',
      teamSize: '1',
      notes: 'Use this profile for renewals, policy updates, and document tracking.'
    },
    corporate: {
      workspaceName: 'Work2U Corporate Hub',
      persona: 'Corporate Team',
      primaryGoal: 'Coordinate team',
      package: 'Enterprise',
      channels: ['email', 'telegram'],
      aiMode: 'Semi-auto',
      aiSource: 'Work2U managed',
      language: 'English',
      region: 'Global',
      teamSize: '6-10',
      notes: 'Use this profile for approvals, departmental follow-up, and reporting.'
    },
    general: {
      workspaceName: 'Work2U Business Hub',
      persona: 'General Business',
      primaryGoal: 'Track tasks',
      package: 'Starter',
      channels: ['whatsapp', 'email'],
      aiMode: 'Suggest only',
      aiSource: 'Work2U managed',
      language: 'BM + English',
      region: 'Malaysia',
      teamSize: '1',
      notes: 'Use this profile for flexible workflow setup and general business tracking.'
    }
  };
  const preset = suggestions[kind] || suggestions.freelancer;
  const nextProfile = {
    ...defaultProfile(),
    ...state.profile,
    ...preset,
    setupComplete: true,
    onboardingStep: 'complete'
  };
  saveProfile(nextProfile);
  state.view = 'overview';
  save(STORAGE.view, state.view);
  render();
}

function saveSetupFromForm() {
  const selectedChannels = ['whatsapp', 'email', 'telegram'].filter((channel) => document.getElementById(`channel-${channel}`)?.checked);
  let aiMode = document.getElementById('setup-ai-mode').value;
  const packageValue = document.getElementById('setup-package').value;
  const channelLimit = numericLimit(currentEntitlements(packageValue).maxConnectors);
  const channels = channelLimit && selectedChannels.length > channelLimit
    ? selectedChannels.slice(0, channelLimit)
    : selectedChannels;
  if (packageValue === 'Starter' && aiMode === 'Auto-send for approved rules') {
    aiMode = 'Suggest only';
  }
  const nextProfile = {
    ...state.profile,
    workspaceId: document.getElementById('setup-workspace-id').value.trim() || currentWorkspaceIdFallback(),
    workspaceName: document.getElementById('setup-workspace').value.trim() || defaultProfile().workspaceName,
    persona: document.getElementById('setup-persona').value,
    primaryGoal: document.getElementById('setup-goal').value,
    package: packageValue,
    channels,
    aiMode,
    aiSource: document.getElementById('setup-ai-source').value,
    language: document.getElementById('setup-language').value,
    region: document.getElementById('setup-region').value,
    teamSize: document.getElementById('setup-team').value,
    setupComplete: true,
    onboardingStep: 'complete',
    notes: document.getElementById('setup-notes').value.trim()
  };
  saveProfile(nextProfile);
  if (channelLimit && selectedChannels.length > channelLimit) {
    updateAuthStatus(`Your ${nextProfile.package} plan keeps the first ${channelLimit} channel(s) selected. Upgrade to use more.`, 'warn');
  }
  const updatedWorkspace = nextProfile.workspaceName;
  state.view = 'overview';
  save(STORAGE.view, state.view);
  const wsChip = document.getElementById('workspace-name');
  if (wsChip) wsChip.textContent = updatedWorkspace;
  render();
}

function openMemberEditor(id) {
  if (!canManageMembers()) {
    updateAuthStatus('Your current role cannot manage workspace members.', 'warn');
    return;
  }
  if (!id) {
    const maxUsers = numericLimit(currentEntitlements().maxUsers);
    const activeMembers = state.members.filter((member) => String(member.status || '').toLowerCase() !== 'disabled').length;
    if (maxUsers !== null && activeMembers >= maxUsers) {
      updateAuthStatus(`Your ${state.profile.package} plan allows up to ${maxUsers} active member(s). Upgrade to add more.`, 'warn');
      return;
    }
  }
  const existing = id ? state.members.find((member) => member.id === id) : null;
  state.memberEditor = existing ? clone(existing) : null;
  const overlay = document.getElementById('member-overlay');
  const form = document.getElementById('member-form');
  document.getElementById('member-modal-title').textContent = id ? 'Edit member' : 'Add member';
  form.innerHTML = renderMemberEditor();
  overlay.hidden = false;

  document.getElementById('member-form').onsubmit = (event) => {
    event.preventDefault();
    saveMember(id);
  };
  document.getElementById('cancel-member').onclick = closeMemberEditor;
  document.getElementById('delete-member').onclick = () => {
    if (!id) return closeMemberEditor();
    state.members = state.members.filter((member) => member.id !== id);
    persistCollection('members');
    void deleteMemberFromSupabase(id);
    closeMemberEditor();
    render();
  };
}

function closeMemberEditor() {
  document.getElementById('member-overlay').hidden = true;
  state.memberEditor = null;
}

function saveMember(editId) {
  const member = {
    id: editId || `m-${Date.now()}`,
    name: document.getElementById('member-name').value.trim() || 'New Member',
    email: document.getElementById('member-email').value.trim(),
    role: document.getElementById('member-role').value,
    preset: document.getElementById('member-preset').value,
    scope: document.getElementById('member-scope').value,
    status: document.getElementById('member-status').value
  };
  const index = state.members.findIndex((item) => item.id === member.id);
  if (index >= 0) state.members[index] = member;
  else state.members.unshift(member);
  persistCollection('members');
  void syncMemberToSupabase(member);
  closeMemberEditor();
  render();
}

function selectThread(id) {
  state.activeThreadId = id;
  render();
}

function selectClient(id) {
  state.activeClientId = id;
  render();
}

function sendAI() {
  const input = document.getElementById('ai-prompt');
  const prompt = input.value.trim();
  if (!prompt) return;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.ai.push({ role: 'user', text: prompt, at: timestamp });
  input.value = '';
  save(STORAGE.ai, state.ai);
  render();

  fetch('/api/ai/groq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: `Work2U context:
- workspace: ${state.profile.workspaceName}
- persona: ${state.profile.persona}
- package: ${state.profile.package}
- channels: ${state.profile.channels.join(', ')}
- ai mode: ${state.profile.aiMode}

User request:
${prompt}`
    })
  })
    .then((response) => response.ok ? response.json() : Promise.reject(response))
    .then((data) => {
      state.ai.push({ role: 'assistant', text: data.text || 'No response.', at: 'Now' });
      save(STORAGE.ai, state.ai);
      render();
    })
    .catch(() => {
      state.ai.push({
        role: 'assistant',
        text: 'AI service is unavailable right now. Try again later or use the prompt as a starting draft.',
        at: 'Now'
      });
      save(STORAGE.ai, state.ai);
      render();
    });
}

function runHubDraft() {
  const prompt = document.getElementById('hub-input').value.trim();
  if (!prompt) return;
  const draftBox = document.getElementById('hub-draft');
  const suggestion = state.profile.aiMode === 'Auto-send for approved rules'
    ? 'Approved reply: keep it short, warm, and action-focused.'
    : 'Draft reply: polite, clear, and with one next step.';
  draftBox.value = `${prompt}\n\n${suggestion}`;
}

function seedProfile(kind) {
  setupSuggestion(kind);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read the selected receipt file'));
    reader.readAsDataURL(file);
  });
}

async function refreshMonthlyExpenseRollup() {
  const workspaceId = document.getElementById('report-workspace-id')?.value.trim() || currentWorkspaceIdFallback();
  const workspaceName = document.getElementById('report-workspace-name')?.value.trim() || state.profile.workspaceName || defaultProfile().workspaceName;
  const month = document.getElementById('report-month')?.value || currentMonthKey().slice(0, 7);

  if (!workspaceId && !workspaceName) {
    state.expenseRollupError = 'Enter a workspace id or workspace name before refreshing the rollup.';
    updateAuthStatus('Enter a workspace id or workspace name before refreshing the rollup.', 'warn');
    render();
    return null;
  }

  try {
    updateAuthStatus('Refreshing monthly rollup...', 'warn');
    const response = await fetch('/api/expense-dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'rollup',
        workspaceId,
        workspaceName,
        month,
        generatedBy: state.auth.email || state.profile.loginEmail || 'system'
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || 'Monthly rollup could not be refreshed');
    }
    state.expenseRollup = data;
    state.expenseRollupError = null;
    render();
    updateAuthStatus(`Monthly rollup refreshed for ${month}.`, 'good');
    return data;
  } catch (error) {
    state.expenseRollupError = error.message || 'Monthly rollup could not be refreshed';
    render();
    updateAuthStatus(error.message || 'Monthly rollup could not be refreshed', 'bad');
    return null;
  }
}

function normalizeRecentReceipt(row) {
  return {
    id: row.id,
    fileName: row.file_name || row.fileName || 'receipt',
    vendorName: row.vendor_name || row.vendorName || 'Unknown',
    totalAmount: Number(row.total_amount || row.totalAmount || 0),
    taxAmount: Number(row.tax_amount || row.taxAmount || 0),
    currency: row.currency || 'MYR',
    reviewStatus: row.review_status || row.reviewStatus || 'pending',
    receiptDate: row.receipt_date || row.receiptDate || '',
    expenseMonth: row.expense_month || row.expenseMonth || '',
    expenseType: row.expense_type || row.expenseType || 'direct',
    ocrStatus: row.ocr_status || row.ocrStatus || 'pending',
    createdAt: row.created_at || row.createdAt || '',
    updatedAt: row.updated_at || row.updatedAt || '',
    notes: row.notes || '',
    tags: receiptTagsFromNotes(row.notes || ''),
    fileUrl: row.file_url || row.fileUrl || '',
    reviewedAt: row.reviewed_at || row.reviewedAt || '',
    reviewedBy: row.reviewed_by || row.reviewedBy || ''
  };
}

function receiptTagsFromNotes(notes) {
  const text = String(notes || '');
  if (!text.trim()) return [];
  const lines = text.split('\n');
  const tags = new Set();
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const tagLine = trimmed.match(/^tags\s*:\s*(.+)$/i);
    if (tagLine) {
      tagLine[1].split(/[\s,]+/).forEach((item) => {
        const clean = item.replace(/^#+/, '').trim().toLowerCase();
        if (clean) tags.add(clean);
      });
      continue;
    }
    trimmed.split(/\s+/).forEach((item) => {
      const clean = item.replace(/^#+/, '').trim().toLowerCase();
      if (clean && item.startsWith('#')) tags.add(clean);
    });
  }
  return [...tags];
}

function formatReceiptTags(tags) {
  return [...new Set((Array.isArray(tags) ? tags : []).map((tag) => String(tag || '').replace(/^#+/, '').trim().toLowerCase()).filter(Boolean))];
}

function mergeReceiptTags(existingTags, nextTags) {
  return [...new Set([...(Array.isArray(existingTags) ? existingTags : []), ...(Array.isArray(nextTags) ? nextTags : [])])].filter(Boolean);
}

async function syncRecentExpenseReceiptsFromServer() {
  const workspaceId = currentWorkspaceIdFallback();
  if (!workspaceId) return null;

  try {
    state.expenseReceiptsLoading = true;
    const params = new URLSearchParams({
      workspaceId,
      limit: '8'
    });
    const response = await fetch(`/api/expense-receipts?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || 'Could not load recent receipts');
    }
    state.expenseReceipts = Array.isArray(data?.data?.receipts) ? data.data.receipts.map(normalizeRecentReceipt) : [];
    state.expenseReceiptsError = null;
    state.expenseReceiptsLoading = false;
    render();
    return data;
  } catch (error) {
    state.expenseReceiptsLoading = false;
    state.expenseReceiptsError = error.message || 'Could not load recent receipts';
    render();
    return null;
  }
}

async function updateReceiptReview(receiptId, reviewStatus, options = {}) {
  const workspaceId = currentWorkspaceIdFallback();
  if (!workspaceId || !receiptId) return null;
  const shouldRefresh = options.refresh !== false;
  const silent = !!options.silent;

  try {
    if (!silent) updateAuthStatus(`Marking receipt as ${reviewStatus}...`, 'warn');
    const response = await fetch('/api/expense-receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'review',
        workspaceId,
        receiptId,
        reviewStatus,
        reviewerId: state.auth.userId || '',
        notes: reviewStatus === 'approved' ? 'Approved from Work2U dashboard' : 'Flagged from Work2U dashboard'
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || 'Could not update receipt review');
    }
    state.expenseReceiptUpload = data?.data || state.expenseReceiptUpload;
    if (shouldRefresh) {
      await syncRecentExpenseReceiptsFromServer();
      await refreshMonthlyExpenseRollup();
    }
    if (!silent) updateAuthStatus(`Receipt marked as ${reviewStatus}.`, 'good');
    return data;
  } catch (error) {
    state.expenseReceiptError = error.message || 'Could not update receipt review';
    render();
    if (!silent) updateAuthStatus(state.expenseReceiptError, 'bad');
    return null;
  }
}

function setExpenseReceiptFilter(filter) {
  const next = ['all', 'pending', 'approved', 'flagged'].includes(filter) ? filter : 'all';
  state.expenseReceiptFilter = next;
  save(STORAGE.expenseReceiptFilter, next);
  render();
}

function setExpenseReceiptSearch(value) {
  const next = String(value || '');
  state.expenseReceiptSearch = next;
  save(STORAGE.expenseReceiptSearch, next);
  render();
}

function decodeReceiptId(value) {
  const raw = String(value || '').trim();
  try {
    return decodeURIComponent(raw);
  } catch (error) {
    return raw;
  }
}

function receiptSearchText(receipt) {
  return [
    receipt.vendorName,
    receipt.fileName,
    receipt.notes,
    receipt.reviewStatus,
    receipt.expenseType,
    receipt.ocrStatus,
    receipt.currency,
    receipt.receiptDate,
    receipt.expenseMonth
  ].filter(Boolean).join(' ').toLowerCase();
}

function filteredExpenseReceipts() {
  const receipts = Array.isArray(state.expenseReceipts) ? state.expenseReceipts : [];
  const filter = String(state.expenseReceiptFilter || 'all').toLowerCase();
  const search = String(state.expenseReceiptSearch || '').trim().toLowerCase();
  return receipts.filter((receipt) => {
    const matchesStatus = filter === 'all' || String(receipt.reviewStatus || '').toLowerCase() === filter;
    const matchesSearch = !search || receiptSearchText(receipt).includes(search);
    return matchesStatus && matchesSearch;
  });
}

function normalizeReceiptSelection() {
  const receipts = Array.isArray(state.expenseReceipts) ? state.expenseReceipts : [];
  const selected = new Set((state.expenseReceiptSelection || []).map((id) => decodeReceiptId(id)).filter(Boolean));
  const validIds = new Set(receipts.map((item) => item.id));
  state.expenseReceiptSelection = [...selected].filter((id) => validIds.has(id));
  return state.expenseReceiptSelection;
}

function selectedExpenseReceipts() {
  const ids = new Set(normalizeReceiptSelection());
  return (Array.isArray(state.expenseReceipts) ? state.expenseReceipts : []).filter((item) => ids.has(item.id));
}

function toggleExpenseReceiptSelection(receiptId, checked) {
  const cleanId = decodeReceiptId(receiptId);
  if (!cleanId) return;
  const next = new Set(normalizeReceiptSelection());
  if (checked) next.add(cleanId);
  else next.delete(cleanId);
  state.expenseReceiptSelection = [...next];
  render();
}

function toggleAllVisibleExpenseReceipts(checked) {
  const visibleIds = filteredExpenseReceipts().map((receipt) => receipt.id).filter(Boolean);
  const next = new Set(normalizeReceiptSelection());
  if (checked) {
    visibleIds.forEach((id) => next.add(id));
  } else {
    visibleIds.forEach((id) => next.delete(id));
  }
  state.expenseReceiptSelection = [...next];
  render();
}

function clearExpenseReceiptSelection() {
  state.expenseReceiptSelection = [];
  render();
}

function setExpenseReceiptDrawer(receiptId) {
  const cleanId = receiptId ? decodeReceiptId(receiptId) : '';
  state.expenseReceiptDrawerReceiptId = cleanId || null;
  state.expenseReceiptDrawerTab = 'overview';
  state.expenseReceiptDrawerData = null;
  state.expenseReceiptDrawerLoading = false;
  state.expenseReceiptDrawerError = null;
  render();
}

function setExpenseReceiptDrawerTab(tab) {
  const next = ['overview', 'timeline', 'file'].includes(String(tab || '').toLowerCase()) ? String(tab).toLowerCase() : 'overview';
  state.expenseReceiptDrawerTab = next;
  if (next !== 'overview') {
    void loadReceiptDrawerContext();
  } else {
    state.expenseReceiptDrawerError = null;
  }
  render();
}

function currentReceiptDrawerReceipt() {
  const receipts = Array.isArray(state.expenseReceipts) ? state.expenseReceipts : [];
  const visible = filteredExpenseReceipts();
  const drawerId = decodeReceiptId(state.expenseReceiptDrawerReceiptId);
  const selected = receipts.find((item) => item.id === drawerId) || visible.find((item) => item.id === drawerId) || receipts[0] || visible[0] || null;
  if (!selected) return null;
  if (!state.expenseReceiptDrawerReceiptId && selected.id) {
    state.expenseReceiptDrawerReceiptId = selected.id;
  }
  return selected;
}

function currentReceiptDrawerContext() {
  const receipt = currentReceiptDrawerReceipt();
  const drawerReceiptId = decodeReceiptId(state.expenseReceiptDrawerData?.receipt?.id || state.expenseReceiptDrawerData?.receiptId || '');
  const activeReceiptId = decodeReceiptId(receipt?.id || '');
  if (state.expenseReceiptDrawerData && drawerReceiptId === activeReceiptId) {
    return state.expenseReceiptDrawerData;
  }
  return null;
}

async function loadReceiptDrawerContext() {
  const receipt = currentReceiptDrawerReceipt();
  const receiptId = decodeReceiptId(receipt?.id || '');
  if (!receiptId) return null;
  if (state.expenseReceiptDrawerLoading) return null;
  state.expenseReceiptDrawerLoading = true;
  state.expenseReceiptDrawerError = null;
  render();
  try {
    const data = await fetchSignedReceiptAsset(receiptId, 900);
    state.expenseReceiptDrawerData = data || null;
    state.expenseReceiptDrawerLoading = false;
    state.expenseReceiptDrawerError = null;
    render();
    return data;
  } catch (error) {
    state.expenseReceiptDrawerLoading = false;
    state.expenseReceiptDrawerError = error.message || 'Could not load receipt drawer details';
    render();
    return null;
  }
}

async function batchUpdateReceiptsReview(reviewStatus) {
  const receipts = selectedExpenseReceipts();
  const fallbackReceipts = filteredExpenseReceipts();
  const targetReceipts = receipts.length ? receipts : fallbackReceipts;
  if (!targetReceipts.length) {
    updateAuthStatus('No receipts available for bulk action.', 'warn');
    return null;
  }

  updateAuthStatus(`${reviewStatus === 'approved' ? 'Approving' : 'Flagging'} ${targetReceipts.length} receipt(s)...`, 'warn');
  for (const receipt of targetReceipts) {
    // Run without refreshing after every item so bulk actions stay fast.
    // eslint-disable-next-line no-await-in-loop
    await updateReceiptReview(receipt.id, reviewStatus, { refresh: false, silent: true });
  }
  await syncRecentExpenseReceiptsFromServer();
  await refreshMonthlyExpenseRollup();
  clearExpenseReceiptSelection();
  updateAuthStatus(`Bulk ${reviewStatus} complete for ${targetReceipts.length} receipt(s).`, 'good');
  return targetReceipts;
}

async function bulkReprocessExpenseReceipts() {
  const receipts = selectedExpenseReceipts();
  const fallbackReceipts = filteredExpenseReceipts();
  const targetReceipts = receipts.length ? receipts : fallbackReceipts;
  if (!targetReceipts.length) {
    updateAuthStatus('No receipts available for bulk OCR refresh.', 'warn');
    return null;
  }

  updateAuthStatus(`Reprocessing OCR for ${targetReceipts.length} receipt(s)...`, 'warn');
  for (const receipt of targetReceipts) {
    // Keep the flow predictable by finishing each update before the next one starts.
    // eslint-disable-next-line no-await-in-loop
    await reprocessReceiptOCR(receipt.id, { refresh: false, silent: true });
  }
  await syncRecentExpenseReceiptsFromServer();
  await refreshMonthlyExpenseRollup();
  clearExpenseReceiptSelection();
  updateAuthStatus(`OCR refreshed for ${targetReceipts.length} receipt(s).`, 'good');
  return targetReceipts;
}

async function bulkDeleteExpenseReceipts() {
  const receipts = selectedExpenseReceipts();
  const fallbackReceipts = filteredExpenseReceipts();
  const targetReceipts = receipts.length ? receipts : fallbackReceipts;
  if (!targetReceipts.length) {
    updateAuthStatus('No receipts available for deletion.', 'warn');
    return null;
  }

  const confirmed = window.confirm(`Delete ${targetReceipts.length} receipt(s)? This cannot be undone.`);
  if (!confirmed) return null;

  updateAuthStatus(`Deleting ${targetReceipts.length} receipt(s)...`, 'warn');
  const workspaceId = currentWorkspaceIdFallback();
  for (const receipt of targetReceipts) {
    // Keep the batch steady even if one delete fails.
    // eslint-disable-next-line no-await-in-loop
    await fetch('/api/expense-receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        workspaceId,
        receiptId: receipt.id,
        deletedBy: state.auth.userId || ''
      })
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error?.message || 'Could not delete receipt');
      }
      return data;
    });
  }

  await syncRecentExpenseReceiptsFromServer();
  await refreshMonthlyExpenseRollup();
  clearExpenseReceiptSelection();
  state.expenseReceiptDrawerData = null;
  state.expenseReceiptDrawerReceiptId = null;
  state.expenseReceiptDrawerError = null;
  updateAuthStatus(`Deleted ${targetReceipts.length} receipt(s).`, 'good');
  return targetReceipts;
}

function promptReceiptTagInput() {
  const value = window.prompt('Enter tags to merge for the selected receipts. Separate with spaces or commas.', 'overhead review');
  const tags = formatReceiptTags(String(value || '').split(/[\s,]+/));
  return tags;
}

async function bulkMergeReceiptTags() {
  const tags = promptReceiptTagInput();
  if (!tags.length) {
    updateAuthStatus('No tags entered.', 'warn');
    return null;
  }

  const receipts = selectedExpenseReceipts();
  const fallbackReceipts = filteredExpenseReceipts();
  const targetReceipts = receipts.length ? receipts : fallbackReceipts;
  if (!targetReceipts.length) {
    updateAuthStatus('No receipts available for tag merge.', 'warn');
    return null;
  }

  const workspaceId = currentWorkspaceIdFallback();
  updateAuthStatus(`Applying tags to ${targetReceipts.length} receipt(s)...`, 'warn');
  for (const receipt of targetReceipts) {
    // Each receipt is updated one at a time so the audit trail stays clean.
    // eslint-disable-next-line no-await-in-loop
    await fetch('/api/expense-receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'tag',
        workspaceId,
        receiptId: receipt.id,
        tags,
        updatedBy: state.auth.userId || ''
      })
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error?.message || 'Could not update receipt tags');
      }
      return data;
    });
  }

  await syncRecentExpenseReceiptsFromServer();
  await refreshMonthlyExpenseRollup();
  clearExpenseReceiptSelection();
  updateAuthStatus(`Merged tags for ${targetReceipts.length} receipt(s).`, 'good');
  return targetReceipts;
}

function buildReceiptExportCsv(receipts) {
  const header = ['id', 'vendorName', 'fileName', 'receiptDate', 'expenseMonth', 'currency', 'totalAmount', 'reviewStatus', 'expenseType', 'ocrStatus', 'notes'];
  const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const rows = receipts.map((receipt) => [
    receipt.id,
    receipt.vendorName,
    receipt.fileName,
    receipt.receiptDate,
    receipt.expenseMonth,
    receipt.currency,
    receipt.totalAmount,
    receipt.reviewStatus,
    receipt.expenseType,
    receipt.ocrStatus,
    receipt.notes
  ].map(escapeCsv).join(','));
  return [header.join(','), ...rows].join('\n');
}

function exportSelectedExpenseReceipts() {
  const receipts = selectedExpenseReceipts();
  const fallbackReceipts = filteredExpenseReceipts();
  const targetReceipts = receipts.length ? receipts : fallbackReceipts;
  if (!targetReceipts.length) {
    updateAuthStatus('No receipts available to export.', 'warn');
    return null;
  }
  const csv = buildReceiptExportCsv(targetReceipts);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `work2u-receipts-${currentMonthKey().slice(0, 7)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  updateAuthStatus(`Exported ${targetReceipts.length} receipt(s) as CSV.`, 'good');
  return targetReceipts;
}

function formatReceiptEventLabel(event) {
  const label = String(event?.label || event?.event_label || event?.type || event?.event_type || 'update').trim();
  const status = String(event?.status || event?.event_status || '').trim();
  if (status && status.toLowerCase() !== label.toLowerCase()) return `${label} · ${status}`;
  return label;
}

function formatReceiptEventMeta(event) {
  const details = event?.details || event?.event_details || {};
  const pieces = [];
  if (details?.fileName) pieces.push(details.fileName);
  if (details?.vendorName) pieces.push(details.vendorName);
  if (details?.reviewedBy) pieces.push(`By ${details.reviewedBy}`);
  if (details?.modelName) pieces.push(details.modelName);
  return pieces.join(' · ');
}

async function fetchSignedReceiptAsset(receiptId, expiresIn = 900) {
  const workspaceId = currentWorkspaceIdFallback();
  const rawReceiptId = String(receiptId || '').trim();
  let cleanReceiptId = rawReceiptId;
  try {
    cleanReceiptId = decodeURIComponent(rawReceiptId);
  } catch (error) {
    cleanReceiptId = rawReceiptId;
  }
  if (!workspaceId || !cleanReceiptId) {
    throw new Error('Workspace ID and receipt ID are required');
  }

  const response = await fetch('/api/expense-receipts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'sign',
      workspaceId,
      receiptId: cleanReceiptId,
      expiresIn
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Could not load receipt asset');
  }
  return data?.data || null;
}

function renderReceiptTimelineModal() {
  const modal = state.expenseReceiptModal;
  if (!modal) return '';
  const receipt = modal.receipt || {};
  const timeline = Array.isArray(modal.timeline) ? modal.timeline : [];
  return `
    <div class="overlay receipt-modal-overlay" onclick="closeReceiptTimelineModal()" ${state.expenseReceiptModalLoading ? 'aria-busy="true"' : ''}>
      <div class="overlay-card receipt-modal-card" onclick="event.stopPropagation()">
        <div class="overlay-header">
          <div>
            <h2>${esc(receipt.vendor_name || receipt.vendorName || receipt.file_name || 'Receipt timeline')}</h2>
            <p>${esc(receipt.file_name || receipt.fileName || 'Receipt detail')}${receipt.receipt_date ? ` · ${esc(receipt.receipt_date)}` : ''}</p>
          </div>
          <div class="pill-line">
            <span class="status-pill">${esc(receipt.review_status || 'pending')}</span>
            <button class="soft-btn" type="button" onclick="closeReceiptTimelineModal()">Close</button>
          </div>
        </div>
        ${state.expenseReceiptModalError ? `
          <div class="report-card" style="margin-bottom:14px;border-color:rgba(220,38,38,0.24);background:rgba(220,38,38,0.05);">
            ${miniLine('Timeline error', state.expenseReceiptModalError)}
          </div>
        ` : ''}
        <div class="receipt-modal-grid">
          <div class="receipt-detail-stack">
            <div class="report-card">
              <div class="section-title">
                <div>
                  <h3>Receipt details</h3>
                  <p>Quick view for review and approval.</p>
                </div>
              </div>
              <div class="stack">
                ${miniLine('Amount', `${esc(receipt.currency || 'MYR')} ${money(receipt.total_amount || receipt.totalAmount || 0)}`)}
                ${miniLine('Expense month', receipt.expense_month || receipt.expenseMonth || '-')}
                ${miniLine('Expense type', receipt.expense_type || receipt.expenseType || '-')}
                ${miniLine('OCR status', receipt.ocr_status || receipt.ocrStatus || '-')}
                ${miniLine('Reviewed at', receipt.reviewed_at || receipt.reviewedAt || '-')}
                ${miniLine('Reviewed by', receipt.reviewed_by || receipt.reviewedBy || '-')}
              </div>
              <div class="topbar-actions" style="margin-top:14px;">
                <button class="soft-btn" type="button" onclick="updateReceiptReview('${String(receipt.id || '').replace(/'/g, "\\'")}', 'approved')">Approve</button>
                <button class="soft-btn" type="button" onclick="updateReceiptReview('${String(receipt.id || '').replace(/'/g, "\\'")}', 'flagged')">Flag</button>
                ${modal.downloadUrl ? `<a class="primary-btn" href="${esc(modal.downloadUrl)}" target="_blank" rel="noreferrer">Download</a>` : ''}
              </div>
            </div>
          </div>
          <div class="receipt-timeline">
            <div class="report-card">
              <div class="section-title">
                <div>
                  <h3>Timeline</h3>
                  <p>Every action attached to this receipt.</p>
                </div>
                <span class="status-pill">${timeline.length} events</span>
              </div>
              <div class="stack">
                ${timeline.length ? timeline.map((item, index) => `
                  <div class="receipt-timeline-item">
                    <div class="receipt-timeline-dot">${index + 1}</div>
                    <div class="receipt-timeline-body">
                      <div class="receipt-timeline-top">
                        <strong>${esc(formatReceiptEventLabel(item))}</strong>
                        <span class="tiny">${esc(String(item.at || item.created_at || '').slice(0, 19).replace('T', ' '))}</span>
                      </div>
                      <div class="tiny">${esc(formatReceiptEventMeta(item) || item.source || 'System update')}</div>
                    </div>
                  </div>
                `).join('') : '<div class="list-item"><div><strong>No timeline yet</strong><div class="tiny">Upload, review, or open the receipt again to populate the timeline.</div></div></div>'}
              </div>
            </div>
            <div class="report-card">
              <div class="section-title">
                <div>
                  <h3>Preview</h3>
                  <p>Quick links for download or inspection.</p>
                </div>
              </div>
              <div class="stack">
                ${miniLine('File name', receipt.file_name || receipt.fileName || '-')}
                ${miniLine('File url', modal.signedUrl ? 'Signed URL ready' : (receipt.file_url || receipt.fileUrl || '-'))}
                ${miniLine('Review status', receipt.review_status || receipt.reviewStatus || '-')}
                ${miniLine('Receipt id', receipt.id || '-')}
              </div>
              ${modal.signedUrl ? `
                <div style="margin-top:14px;">
                  <a class="soft-btn" href="${esc(modal.signedUrl)}" target="_blank" rel="noreferrer" style="display:inline-flex;">Open signed file</a>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderReceiptDetailDrawer() {
  const receipt = currentReceiptDrawerReceipt();
  const selectedCount = selectedExpenseReceipts().length;
  const visibleCount = filteredExpenseReceipts().length;
  const drawerTab = String(state.expenseReceiptDrawerTab || 'overview').toLowerCase();
  const drawerContext = currentReceiptDrawerContext();
  const drawerTitle = receipt ? (receipt.vendorName || receipt.fileName || 'Receipt detail') : 'Select a receipt';
  const drawerSubtitle = receipt
    ? `${receipt.fileName || 'receipt'} · ${receipt.receiptDate || receipt.expenseMonth || 'no date'}`
    : 'Pick any receipt from the list to inspect the full context.';
  const drawerTags = mergeReceiptTags(receipt?.tags || [], receiptTagsFromNotes(receipt?.notes || ''));
  const drawerTimeline = Array.isArray(drawerContext?.timeline) ? drawerContext.timeline : [];
  const drawerSignedUrl = String(drawerContext?.signedUrl || '').trim();
  const drawerDownloadUrl = String(drawerContext?.downloadUrl || '').trim();

  if (!receipt) {
    return `
      <div class="receipt-detail-drawer">
        <div class="section-title">
          <div>
            <h3>Receipt drawer</h3>
            <p>Keep the selected receipt open while you review and approve.</p>
          </div>
          <span class="status-pill">${selectedCount ? `${selectedCount} selected` : `${visibleCount} visible`}</span>
        </div>
        <div class="drawer-empty">
          <strong>No receipt selected</strong>
          <p>Click any receipt row to open its detail drawer. Bulk actions stay available on the left.</p>
        </div>
      </div>
    `;
  }

  const status = String(receipt.reviewStatus || 'pending').toLowerCase();
  const ocrStatus = String(receipt.ocrStatus || 'pending').toLowerCase();
  const drawerBars = [
    { label: 'Amount', value: Number(receipt.totalAmount || 0), tone: 'blue' },
    { label: 'Tax', value: Number(receipt.taxAmount || receipt.tax_amount || 0), tone: 'amber' },
    { label: 'Review', value: status === 'approved' ? 100 : status === 'flagged' ? 45 : 70, tone: status === 'approved' ? 'green' : status === 'flagged' ? 'rose' : 'amber' }
  ];

  return `
    <div class="receipt-detail-drawer">
      <div class="section-title">
        <div>
          <h3>Receipt drawer</h3>
          <p>${esc(drawerSubtitle)}</p>
        </div>
        <span class="status-pill">${esc(receipt.reviewStatus || 'pending')}</span>
      </div>

      <div class="drawer-tabs">
        ${[
          ['overview', 'Overview'],
          ['timeline', 'Timeline'],
          ['file', 'File']
        ].map(([tab, label]) => `
          <button class="drawer-tab${drawerTab === tab ? ' active' : ''}" type="button" onclick="setExpenseReceiptDrawerTab('${tab}')">${label}</button>
        `).join('')}
      </div>

      ${drawerTab === 'timeline' ? `
        <div class="drawer-header-card">
          <div class="drawer-title-row">
            <div>
              <div class="tiny">Timeline mode</div>
              <strong>${esc(drawerTitle)}</strong>
            </div>
            <div class="pill-line">
              <button class="soft-btn" type="button" onclick="void loadReceiptDrawerContext()">Reload</button>
              <button class="soft-btn" type="button" onclick="openReceiptTimelineModal('${encodeURIComponent(receipt.id)}')">Open modal</button>
            </div>
          </div>
          ${state.expenseReceiptDrawerError ? `
            <div class="report-card" style="border-color:rgba(220,38,38,0.24);background:rgba(220,38,38,0.05);">
              ${miniLine('Timeline error', state.expenseReceiptDrawerError)}
            </div>
          ` : ''}
          ${state.expenseReceiptDrawerLoading ? `
            <div class="drawer-empty">
              <strong>Loading timeline</strong>
              <p>Fetching the receipt events and file context now.</p>
            </div>
          ` : `
            <div class="receipt-timeline">
              ${drawerTimeline.length ? drawerTimeline.map((item, index) => `
                <div class="receipt-timeline-item">
                  <div class="receipt-timeline-dot">${index + 1}</div>
                  <div class="receipt-timeline-body">
                    <div class="receipt-timeline-top">
                      <strong>${esc(formatReceiptEventLabel(item))}</strong>
                      <span class="tiny">${esc(String(item.at || item.created_at || '').slice(0, 19).replace('T', ' '))}</span>
                    </div>
                    <div class="tiny">${esc(formatReceiptEventMeta(item) || item.source || 'System update')}</div>
                  </div>
                </div>
              `).join('') : `
                <div class="drawer-empty" style="min-height:160px;">
                  <strong>No timeline loaded</strong>
                  <p>Click Reload to fetch the receipt history from the server.</p>
                </div>
              `}
            </div>
          `}
        </div>
      ` : drawerTab === 'file' ? `
        <div class="drawer-header-card">
          <div class="drawer-title-row">
            <div>
              <div class="tiny">File mode</div>
              <strong>${esc(drawerTitle)}</strong>
            </div>
            <div class="pill-line">
              <button class="soft-btn" type="button" onclick="void loadReceiptDrawerContext()">Refresh file</button>
              <button class="soft-btn" type="button" onclick="openReceiptDownload('${encodeURIComponent(receipt.id)}')">Download</button>
            </div>
          </div>
          <div class="stack" style="margin-top:10px;">
            ${miniLine('File name', receipt.fileName || '-')}
            ${miniLine('File URL', receipt.fileUrl || '-') }
            ${miniLine('Signed URL', drawerSignedUrl ? 'Ready' : 'Not loaded yet')}
            ${miniLine('Download URL', drawerDownloadUrl ? 'Ready' : 'Not loaded yet')}
          </div>
          ${drawerSignedUrl ? `
            <div class="drawer-link-card">
              <div class="tiny">Open file</div>
              <strong>${esc(drawerSignedUrl)}</strong>
              <p>Use this signed link if the direct preview is blocked by permissions.</p>
              <div class="drawer-actions" style="margin-top:4px;">
                <a class="primary-btn" href="${esc(drawerSignedUrl)}" target="_blank" rel="noreferrer">Open signed file</a>
                ${drawerDownloadUrl ? `<a class="soft-btn" href="${esc(drawerDownloadUrl)}" target="_blank" rel="noreferrer">Download file</a>` : ''}
              </div>
            </div>
          ` : `
            <div class="drawer-empty" style="min-height:160px;">
              <strong>File not loaded</strong>
              <p>Click Refresh file to load a signed preview link for this receipt.</p>
            </div>
          `}
        </div>
      ` : `
        <div class="drawer-header-card">
          <div class="drawer-title-row">
            <div>
              <div class="tiny">Now viewing</div>
              <strong>${esc(drawerTitle)}</strong>
            </div>
            <span class="status-pill">${esc(receipt.currency || 'MYR')} ${money(receipt.totalAmount || 0)}</span>
          </div>
          <div class="pill-line" style="margin-top:10px;">
            <span class="status-pill">${esc(receipt.expenseType || 'direct')}</span>
            <span class="status-pill">${esc(receipt.ocrStatus || 'pending')}</span>
            <span class="status-pill">${esc(receipt.expenseMonth || receipt.receiptDate || '-')}</span>
          </div>
          <div class="drawer-bars" style="margin-top:14px;">
            ${chartBars(drawerBars)}
          </div>
          ${drawerTags.length ? `
            <div class="drawer-tag-row">
              ${drawerTags.map((tag) => `<span class="tag">#${esc(tag)}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <div class="drawer-meta-grid">
          ${miniLine('File name', receipt.fileName || '-')}
          ${miniLine('Vendor', receipt.vendorName || '-')}
          ${miniLine('Receipt date', receipt.receiptDate || '-')}
          ${miniLine('Expense month', receipt.expenseMonth || '-')}
          ${miniLine('Notes', receipt.notes || 'No notes yet')}
          ${miniLine('OCR status', ocrStatus)}
        </div>

        <div class="drawer-actions">
          <button class="primary-btn" type="button" onclick="setExpenseReceiptDrawerTab('timeline')">Open timeline</button>
          <button class="soft-btn" type="button" onclick="setExpenseReceiptDrawerTab('file')">Open file</button>
          <button class="soft-btn" type="button" onclick="reprocessReceiptOCR('${encodeURIComponent(receipt.id)}')">Reprocess OCR</button>
          <button class="soft-btn" type="button" onclick="updateReceiptReview('${esc(receipt.id)}', 'approved')">Approve</button>
          <button class="soft-btn" type="button" onclick="updateReceiptReview('${esc(receipt.id)}', 'flagged')">Flag</button>
        </div>

        <div class="drawer-link-card">
          <div class="tiny">File link</div>
          <strong>${esc(receipt.fileUrl || 'No file link')}</strong>
          <p>Use timeline for event history and the file tab for direct preview or download.</p>
        </div>
      `}
    </div>
  `;
}

async function closeReceiptTimelineModal() {
  state.expenseReceiptModal = null;
  state.expenseReceiptModalError = null;
  state.expenseReceiptModalLoading = false;
  state.expenseReceiptModalReceiptId = null;
  document.body.classList.remove('modal-open');
  render();
}

async function openReceiptTimelineModal(receiptId) {
  const rawReceiptId = String(receiptId || '').trim();
  let cleanReceiptId = rawReceiptId;
  try {
    cleanReceiptId = decodeURIComponent(rawReceiptId);
  } catch (error) {
    cleanReceiptId = rawReceiptId;
  }
  if (!currentWorkspaceIdFallback() || !cleanReceiptId) return null;

  state.expenseReceiptModalLoading = true;
  state.expenseReceiptModalError = null;
  state.expenseReceiptModalReceiptId = cleanReceiptId;
  state.expenseReceiptModal = { receipt: state.expenseReceipts.find((item) => item.id === cleanReceiptId) || null, timeline: [] };
  render();
  document.body.classList.add('modal-open');

  try {
    const data = await fetchSignedReceiptAsset(cleanReceiptId, 900);
    state.expenseReceiptModal = data || null;
    state.expenseReceiptModalError = null;
    state.expenseReceiptModalLoading = false;
    render();
    document.body.classList.add('modal-open');
    return data;
  } catch (error) {
    state.expenseReceiptModalLoading = false;
    state.expenseReceiptModalError = error.message || 'Could not open receipt timeline';
    render();
    document.body.classList.add('modal-open');
    return null;
  }
}

async function openReceiptDownload(receiptId) {
  try {
    updateAuthStatus('Preparing receipt download...', 'warn');
    const downloadWindow = window.open('about:blank', '_blank');
    const data = await fetchSignedReceiptAsset(receiptId, 900);
    const url = data?.downloadUrl || data?.signedUrl || '';
    if (!url) {
      throw new Error('Download link is not available for this receipt');
    }
    if (downloadWindow) {
      downloadWindow.opener = null;
      downloadWindow.location.replace(url);
    } else {
      window.location.href = url;
    }
    updateAuthStatus('Receipt download opened.', 'good');
    return data;
  } catch (error) {
    updateAuthStatus(error.message || 'Could not open receipt download', 'bad');
    return null;
  }
}

async function reprocessReceiptOCR(receiptId, options = {}) {
  const workspaceId = currentWorkspaceIdFallback();
  const rawReceiptId = String(receiptId || '').trim();
  let cleanReceiptId = rawReceiptId;
  try {
    cleanReceiptId = decodeURIComponent(rawReceiptId);
  } catch (error) {
    cleanReceiptId = rawReceiptId;
  }
  if (!workspaceId || !cleanReceiptId) return null;
  const shouldRefresh = options.refresh !== false;
  const silent = !!options.silent;

  try {
    if (!silent) updateAuthStatus('Reprocessing receipt OCR...', 'warn');
    const response = await fetch('/api/expense-receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'extract',
        workspaceId,
        receiptId: cleanReceiptId,
        ownerId: state.auth.userId || '',
        autoApprove: false
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || 'Could not reprocess OCR');
    }
    state.expenseReceiptUpload = data?.data || state.expenseReceiptUpload;
    if (shouldRefresh) {
      await syncRecentExpenseReceiptsFromServer();
      await refreshMonthlyExpenseRollup();
    }
    if (!silent) updateAuthStatus('Receipt OCR reprocessed.', 'good');
    return data;
  } catch (error) {
    if (!silent) updateAuthStatus(error.message || 'Could not reprocess OCR', 'bad');
    return null;
  }
}

async function uploadExpenseReceiptFromForm() {
  const workspaceId = document.getElementById('receipt-workspace-id')?.value.trim() || currentWorkspaceIdFallback();
  const fileInput = document.getElementById('receipt-file');
  const file = fileInput?.files?.[0] || null;
  const vendorName = document.getElementById('receipt-vendor')?.value.trim() || 'Unknown';
  const receiptDate = document.getElementById('receipt-date')?.value || currentMonthKey().slice(0, 10);
  const totalAmount = Number(document.getElementById('receipt-amount')?.value || 0);
  const taxAmount = Number(document.getElementById('receipt-tax')?.value || 0);
  const currency = document.getElementById('receipt-currency')?.value || 'MYR';
  const expenseType = document.getElementById('receipt-expense-type')?.value || 'direct';
  const notes = document.getElementById('receipt-notes')?.value.trim() || '';
  const reviewStatus = document.getElementById('receipt-review-status')?.value || 'pending';
  const expenseMonth = document.getElementById('receipt-month')?.value || receiptDate.slice(0, 7);

  if (!workspaceId) {
    state.expenseReceiptError = 'Set a workspace ID first so the receipt can be attached to the right workspace.';
    render();
    updateAuthStatus(state.expenseReceiptError, 'warn');
    return null;
  }

  if (!file) {
    state.expenseReceiptError = 'Please choose a receipt file before uploading.';
    render();
    updateAuthStatus(state.expenseReceiptError, 'warn');
    return null;
  }

  try {
    state.expenseReceiptError = null;
    updateAuthStatus('Uploading receipt...', 'warn');
    const fileDataUrl = await fileToDataUrl(file);
    const response = await fetch('/api/expense-receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId,
        ownerId: state.auth.userId || '',
        action: 'create',
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileDataUrl,
        vendorName,
        receiptDate,
        totalAmount,
        taxAmount,
        currency,
        expenseType,
        notes,
        reviewStatus,
        expenseMonth,
        sourceChannel: 'upload'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || 'Receipt upload could not be saved');
    }

    state.expenseReceiptUpload = data?.data || data;
    state.expenseReceiptError = null;
    await syncRecentExpenseReceiptsFromServer();
    render();
    updateAuthStatus('Receipt uploaded and monthly rollup updated.', 'good');
    await refreshMonthlyExpenseRollup();
    return data;
  } catch (error) {
    state.expenseReceiptError = error.message || 'Receipt upload could not be saved';
    render();
    updateAuthStatus(state.expenseReceiptError, 'bad');
    return null;
  }
}

function wireAuthGate() {
  const surveyForm = document.getElementById('survey-form');
  if (surveyForm) {
    surveyForm.addEventListener('input', saveSurveyDraft);
    surveyForm.addEventListener('change', saveSurveyDraft);
  }

  document.getElementById('survey-ai-mode')?.addEventListener('click', (event) => {
    const button = event.target.closest('.choice-card');
    if (!button) return;
    state.survey.aiMode = button.dataset.value;
    save(STORAGE.survey, state.survey);
    updateSurveySummary();
  });

  document.getElementById('auth-method-grid')?.addEventListener('click', (event) => {
    const button = event.target.closest('.choice-card');
    if (!button) return;
    selectAuthMethod(button.dataset.method || 'email');
  });

  document.getElementById('auth-email')?.addEventListener('input', saveSurveyDraft);
  document.getElementById('auth-mailbox')?.addEventListener('change', saveSurveyDraft);
  document.getElementById('survey-region')?.addEventListener('change', () => {
    syncSurveyLocationStatus(`Region set to ${document.getElementById('survey-region')?.value || 'Global'}. Billplz for Malaysia, Stripe for Global.`);
  });
  document.getElementById('survey-apply-region')?.addEventListener('click', applySurveyRegionSuggestion);
  document.getElementById('survey-detect-region')?.addEventListener('click', detectSurveyRegionFromLocation);
  document.getElementById('auth-continue')?.addEventListener('click', completeAuth);
  document.getElementById('onboarding-cta-survey')?.addEventListener('click', focusSurveyStep);
  document.getElementById('onboarding-cta-login')?.addEventListener('click', focusLoginStep);
  document.getElementById('onboarding-cta-dashboard')?.addEventListener('click', focusDashboardStep);
  document.getElementById('welcome-close')?.addEventListener('click', () => closeOnboardingWelcome(true));
  document.getElementById('welcome-continue')?.addEventListener('click', () => {
    closeOnboardingWelcome(true);
    focusLoginStep();
  });
  document.getElementById('welcome-overlay')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeOnboardingWelcome(true);
  });
  document.getElementById('onboarding-step-survey')?.addEventListener('click', focusSurveyStep);
  document.getElementById('onboarding-step-login')?.addEventListener('click', focusLoginStep);
  document.getElementById('onboarding-step-dashboard')?.addEventListener('click', focusDashboardStep);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.onboardingWelcomeOpen) {
      closeOnboardingWelcome(true);
    }
    if (event.key === 'Escape' && state.moduleInspector) {
      closeModuleDetail();
    }
  });
}

function saveThemeAndView() {
  save(STORAGE.theme, state.theme);
  save(STORAGE.view, state.view);
}

function attachNav() {
  document.getElementById('nav').addEventListener('click', (event) => {
    const btn = event.target.closest('.nav-item');
    if (!btn) return;
    setView(btn.dataset.view);
  });
}

function wireShell() {
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('quick-setup').addEventListener('click', () => setView('setup'));
  document.getElementById('signout-btn').addEventListener('click', signOut);
  document.getElementById('close-member').addEventListener('click', closeMemberEditor);
  document.getElementById('member-overlay').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeMemberEditor();
  });
  document.getElementById('module-close')?.addEventListener('click', closeModuleDetail);
  document.getElementById('module-detail-overlay')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeModuleDetail();
  });
}

async function signOut() {
  const client = await getSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }
  state.auth = { ...defaultAuth(), method: state.auth.method };
  state.expenseReceipts = [];
  state.expenseReceiptsError = null;
  state.expenseReceiptsLoading = false;
  state.expenseReceiptSelection = [];
  state.expenseReceiptDrawerReceiptId = null;
  state.expenseReceiptDrawerTab = 'overview';
  state.expenseReceiptDrawerData = null;
  state.expenseReceiptDrawerLoading = false;
  state.expenseReceiptDrawerError = null;
  state.expenseReceiptUpload = null;
  state.expenseReceiptError = null;
  save(STORAGE.auth, state.auth);
  updateAuthStatus('Signed out. Choose a login method to continue.', 'warn');
  render();
}

async function initialize() {
  document.body.dataset.theme = state.theme;
  ensureSeedData();
  await getPublicConfig();
  attachNav();
  wireAuthGate();
  wireShell();
  if (!state.profile.setupComplete) {
    state.view = 'setup';
  }
  if (!state.activeThreadId) state.activeThreadId = state.threads[0]?.id || null;
  if (!state.activeClientId) state.activeClientId = state.clients[0]?.id || null;
  await bootstrapAuth();
  await hydrateWorkspaceCollectionsFromApi();
  render();
  void syncBillingStateFromServer();
  void syncRecentExpenseReceiptsFromServer();
  if (isSuperAdmin()) {
    void syncBillingAdminFromServer();
  }
  saveThemeAndView();
}

window.addEventListener('DOMContentLoaded', initialize);

