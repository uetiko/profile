const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

const nowISO = () => new Date().toISOString();

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
  }

  base() {
    return {
      event_id: uuidv4(),
      ts: nowISO(),
      page_path: location.pathname,
      page_location: location.href,
      page_title: document.title,
      env: this.env,
      app: this.app,
      session_id: this.session_id,
      client_id: this.client_id,
      transport_type: 'beacon'
    };
  }

  send(name, extra = {}) {
    const payload = { ...this.base(), ...extra };
    if (window.gtag) window.gtag('event', name, payload);
    else console.debug('[telemetry:fallback]', name, payload);
  }

  pageView(extra = {}) { this.send('page_view', extra); }
  click(scope, extra = {}) { this.send('click', { scope, ...extra }); }
  cta(name, extra = {}) { this.send('cta', { name, ...extra }); }
  openWindow(name, extra = {}) { this.send('open_window', { name, ...extra }); }
  closeWindow(name, extra = {}) { this.send('close_window', { name, ...extra }); }
  formSubmit(extra) { this.send('form_submit', { ...extra }); }
  download(extra) { this.send('download', { ...extra }); }
  videoPlay(extra) { this.send('video_play', { ...extra }); }
  error(scope, extra) { this.send('error', { scope, ...extra }); }
}

export { Telemetry, nowISO, uuidv4 };
