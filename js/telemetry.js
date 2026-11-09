const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

const nowISO = () => new Date().toISOString();
const TELEMETRY_UNAVAILABLE_GRACE_MS = 4000;
const EVENT_FIELDS = Object.freeze({
  page_view: [],
  click: ['scope'],
  cta: ['name', 'variant'],
  open_window: ['name', 'type'],
  close_window: ['name'],
  form_submit: ['form_name'],
  download: ['element'],
  video_play: ['video_id'],
  error: ['scope', 'lineno', 'colno'],
  portfolio_language_change: ['language', 'previous_language'],
  portfolio_window_open: ['app_name', 'language'],
  portfolio_window_focus: ['app_name', 'language'],
  portfolio_window_minimize: ['app_name', 'language'],
  portfolio_window_restore: ['app_name', 'language'],
  portfolio_window_close: ['app_name', 'language'],
  portfolio_window_duration: ['app_name', 'duration_ms', 'engagement_ms', 'language'],
  portfolio_cv_download: ['document_type', 'document_language', 'source_window'],
  portfolio_contact_click: ['interaction_type', 'link_url_category'],
  portfolio_external_link_click: ['link_url_category', 'source_window'],
  screen_view: ['screen_name', 'language']
});

const pickAllowed = (payload, fields) => Object.fromEntries(
  fields
    .filter(field => payload[field] !== undefined && payload[field] !== null)
    .map(field => [field, payload[field]])
);

const eventPayload = (name, payload) => pickAllowed(payload, EVENT_FIELDS[name] || []);

const sanitizeBase = payload => pickAllowed(payload, [
  'event_id', 'ts', 'page_path', 'env', 'app', 'session_id', 'client_id', 'transport_type'
]);

const buildPayload = (name, base, extra) => ({
  ...sanitizeBase(base),
  ...eventPayload(name, extra)
});


class Telemetry {
  constructor({ env = 'dev', app = 'desktop' } = {}) {
    this.env = env;
    this.app = app;
    this.session_id = sessionStorage.getItem('session_id') || uuidv4();
    sessionStorage.setItem('session_id', this.session_id);
    this.client_id = undefined;
    try {
      if (window.gtag) window.gtag('get', 'G-6CR8Q1NYHV', 'client_id', cid => { this.client_id = cid; });
    } catch {}
    this._unavailableReported = false;
    this._createdAt = Date.now();
    setTimeout(() => this._reportUnavailableIfNeeded(), TELEMETRY_UNAVAILABLE_GRACE_MS);
  }

  base() {
    return {
      event_id: uuidv4(),
      ts: nowISO(),
      page_path: location.pathname,
      env: this.env,
      app: this.app,
      session_id: this.session_id,
      client_id: this.client_id,
      transport_type: 'beacon'
    };
  }
  _reportUnavailableIfNeeded() {
    if (this._unavailableReported) return;
    if (typeof window.gtag === 'function') return;
    if (Date.now() - this._createdAt < TELEMETRY_UNAVAILABLE_GRACE_MS) return;
    this._unavailableReported = true;
    const payload = { ...this.base(), reason: 'gtag_undefined', ga_available: false };
    console.warn('[telemetry:portfolio_telemetry_unavailable]', payload);
  }

  send(name, extra = {}) {
    const payload = buildPayload(name, this.base(), extra);
    if (typeof window.gtag === 'function') window.gtag('event', name, payload);
    else {
      console.debug('[telemetry:fallback]', name, payload);
      this._reportUnavailableIfNeeded();
    }
  }

  pageView(extra = {}) { this.send('page_view', extra); }
  screenView(screenName, extra = {}) { this.send('screen_view', { screen_name: screenName, ...extra }); }
  click(scope, extra = {}) { this.send('click', { scope, ...extra }); }
  cta(name, extra = {}) { this.send('cta', { name, ...extra }); }
  openWindow(name, extra = {}) { this.send('open_window', { name, ...extra }); }
  closeWindow(name, extra = {}) { this.send('close_window', { name, ...extra }); }
  formSubmit(extra) { this.send('form_submit', { ...extra }); }
  download(extra) { this.send('download', { ...extra }); }
  videoPlay(extra) { this.send('video_play', { ...extra }); }
  error(scope, extra) { this.send('error', { scope, ...extra }); }
  languageChange(language, previousLanguage, extra = {}) { this.send('portfolio_language_change', { language, previous_language: previousLanguage, ...extra }); }
  windowOpen(appName, extra = {}) { this.send('portfolio_window_open', { app_name: appName, ...extra }); }
  windowFocus(appName, extra = {}) { this.send('portfolio_window_focus', { app_name: appName, ...extra }); }
  windowMinimize(appName, extra = {}) { this.send('portfolio_window_minimize', { app_name: appName, ...extra }); }
  windowRestore(appName, extra = {}) { this.send('portfolio_window_restore', { app_name: appName, ...extra }); }
  windowClose(appName, extra = {}) { this.send('portfolio_window_close', { app_name: appName, ...extra }); }
  windowDuration(appName, durationMs, extra = {}) { this.send('portfolio_window_duration', { app_name: appName, duration_ms: durationMs, engagement_ms: durationMs, ...extra }); }
  cvDownload(extra = {}) { this.send('portfolio_cv_download', { document_type: 'cv', source_window: 'download', ...extra }); }
  contactClick(linkUrlCategory, extra = {}) { this.send('portfolio_contact_click', { interaction_type: 'contact', link_url_category: linkUrlCategory, ...extra }); }
  externalLinkClick(linkUrlCategory, sourceWindow, extra = {}) { this.send('portfolio_external_link_click', { link_url_category: linkUrlCategory, source_window: sourceWindow, ...extra }); }
}

export { Telemetry, nowISO, uuidv4 };
