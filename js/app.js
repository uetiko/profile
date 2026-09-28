import { createTranslator, initialLanguage, loadNarrative, messages, validateMessages } from './i18n.js';
import { Telemetry, uuidv4 } from './telemetry.js';
import { Compositor, EffectManager, EventBus, StateManager, WindowManager } from './windowing.js';
import { About, Contact, DocumentViewer, Download, Education, Experience, Skills } from './components.js';
import { Journal } from './journal.js';
import { Projects, ProjectsBadges } from './projects.js';

const runtimeError = (error, language = initialLanguage()) => {
  const panel = document.getElementById('runtime-error');
  const appRoot = document.getElementById('app');
  const runtimeMessages = messages[language]?.runtime || {};
  if (appRoot) appRoot.hidden = true;
  document.documentElement.lang = language;
  document.title = messages[language]?.metadata?.document_title || 'Angel Barrientos — Profile';
  if (panel) {
    panel.hidden = false;
    panel.querySelector('[data-runtime-title]').textContent = runtimeMessages.title || 'Profile unavailable';
    panel.querySelector('[data-runtime-details]').textContent = runtimeMessages.details || 'Required content could not be validated. Reload the page to try again.';
    panel.querySelector('[data-runtime-technical]').textContent = `${runtimeMessages.technical || 'Technical detail'}: ${error.message}`;
  }
  console.error('[runtime]', error);
};

const Vue = globalThis.Vue;
if (!Vue) {
  runtimeError(new Error('Vue CDN global is unavailable'));
} else {
  const { createApp, onMounted, onUnmounted, ref, reactive } = Vue;
  const langAtStart = initialLanguage();
  let narrative;
  let contentError = null;
  try {
    validateMessages();
    narrative = await loadNarrative();
  } catch (error) {
    contentError = error;
    runtimeError(error, langAtStart);
  }

  if (!contentError) {
    const app = createApp({
      components: { About, Experience, Skills, Education, Download, Contact, DocumentViewer, ProjectsBadges, Projects, Journal },
      setup() {
        const env = new URLSearchParams(location.search).get('env') || 'live';
        const appName = 'desktop';
        const lang = ref(langAtStart);
        document.documentElement.lang = lang.value;
        document.title = messages[lang.value].metadata.document_title;
        const t = key => createTranslator(lang.value, narrative)(key);
        const telemetry = new Telemetry({ env, app: appName });
        telemetry.pageView();

        window.addEventListener('error', event => telemetry.error('global_js', { message: event.message, filename: event.filename, lineno: event.lineno, colno: event.colno }));
        window.addEventListener('unhandledrejection', event => telemetry.error('unhandled_promise', { reason: String(event.reason) }));

        const wm = new WindowManager();
        const bus = new EventBus();
        const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
        const stateManager = new StateManager({ glass: true, animationSpeed: 1.0, reducedMotion: mediaQuery.matches });
        const effectManager = new EffectManager({ bus, state: stateManager, telemetry });
        const compositor = reactive(new Compositor({
          bus,
          stateManager,
          effectManager,
          getElement: id => document.querySelector(`.window[data-win-id="${id}"]`)
        }));
        const windows = reactive([]);
        const tasks = reactive([]);

        const makeWin = (id, title, icon, component, props = {}, titleKey = `menu.${id}`) => {
          if (wm.find(id)) {
            wm.restore(id);
            const view = windows.find(item => item.id === id);
            if (view) view.minimized = false;
            focus(id);
            return;
          }
          wm.create({ id, title, icon, component });
          const managerWindow = wm.find(id);
          windows.push({ id, title, titleKey, icon, component, props, minimized: false, maximized: false, get style() { return wm.style(managerWindow); } });
          tasks.push({ id, title, titleKey, active: true });
          focus(id);
          requestAnimationFrame(() => bus.emit('window.opened', { id }));
        };

        const updateWindowTitles = () => {
          windows.forEach(view => {
            const title = view.titleKey ? t(view.titleKey) : view.title;
            view.title = title;
            if (view.props?.titleKey) view.props.title = t(view.props.titleKey);
            const managerWindow = wm.find(view.id);
            if (managerWindow) managerWindow.title = title;
            const task = tasks.find(item => item.id === view.id);
            if (task) task.title = title;
          });
          document.documentElement.lang = lang.value;
          document.title = t('metadata.document_title');
        };

        const openViewer = ({ src, type, title }) => {
          const id = `viewer-${uuidv4()}`;
          makeWin(id, title, '🗎', 'DocumentViewer', { src, type, title, titleKey: 'download.viewer_title', telemetry }, 'download.viewer_title');
          telemetry.openWindow('document_viewer', { file: src, type });
        };

        const focus = id => {
          const previous = tasks.find(task => task.active);
          if (previous && previous.id !== id) bus.emit('window.blur', { id: previous.id });
          wm.focus(id);
          tasks.forEach(task => { task.active = task.id === id; });
          bus.emit('window.focus', { id });
        };

        const minimize = id => {
          bus.emit('window.minimizing', {
            id,
            onDone: () => {
              wm.minimize(id);
              const view = windows.find(item => item.id === id);
              if (view) view.minimized = true;
              const task = tasks.find(item => item.id === id);
              if (task) task.active = false;
            }
          });
        };

        const restore = id => {
          wm.restore(id);
          const view = windows.find(item => item.id === id);
          if (view) view.minimized = false;
          bus.emit('window.restored', { id });
          bus.emit('window.focus', { id });
        };

        const isNarrowViewport = () => window.innerWidth <= 768;
        const toggleMaximize = id => {
          if (isNarrowViewport()) {
            bus.emit('window.feedback', { id, kind: 'shake' });
            return;
          }
          wm.toggleMax(id);
          const view = windows.find(item => item.id === id);
          if (view) view.maximized = wm.find(id)?.maximized || false;
          bus.emit('window.maximized', { id });
        };

        const closeWindow = id => {
          bus.emit('window.closing', {
            id,
            onDone: () => {
              wm.close(id);
              const index = windows.findIndex(window => window.id === id);
              if (index > -1) windows.splice(index, 1);
              const taskIndex = tasks.findIndex(task => task.id === id);
              if (taskIndex > -1) tasks.splice(taskIndex, 1);
            }
          });
        };

        const appRegistry = {
          about: { id: 'about', title: 'menu.about', icon: './img/icons/24x24/office-address-book.png', component: 'About' },
          experience: { id: 'experience', title: 'menu.experience', icon: './img/icons/24x24/preferences-system-network.png', component: 'Experience' },
          skills: { id: 'skills', title: 'menu.skills', icon: './img/icons/24x24/basket.png', component: 'Skills' },
          education: { id: 'education', title: 'menu.education', icon: './img/icons/24x24/applications-education-university.png', component: 'Education' },
          download: { id: 'download', title: 'menu.download', icon: './img/icons/24x24/folder-downloads.png', component: 'Download' },
          contact: { id: 'contact', title: 'menu.contact', icon: './img/icons/24x24/mail-folder-inbox.png', component: 'Contact' },
          badges: { id: 'badges', title: 'menu.badges', icon: './img/icons/24x24/certificate-server.png', component: 'ProjectsBadges' },
          projects: { id: 'projects', title: 'menu.projects', icon: './img/icons/24x24/folder-development.png', component: 'Projects' },
          journal: { id: 'journal', title: 'menu.journal', icon: './img/icons/24x24/application-rss.png', component: 'Journal' }
        };

        const openApp = name => {
          const definition = appRegistry[name];
          if (definition) makeWin(definition.id, t(definition.title), definition.icon, definition.component, name === 'journal' ? { telemetry } : undefined);
          telemetry.cta('open_app', { name });
        };

        const drag = reactive({ active: false, id: null, startX: 0, startY: 0, start: {}, ghost: false, ghostStyle: '' });
        const startDrag = (event, id) => {
          const win = wm.find(id);
          if (!win) return;
          if (win.maximized) {
            bus.emit('window.feedback', { id, kind: 'shake' });
            return;
          }
          if (isNarrowViewport()) {
            bus.emit('window.feedback', { id, kind: 'shake' });
            return;
          }
          drag.active = true;
          drag.id = id;
          drag.startX = event.clientX;
          drag.startY = event.clientY;
          drag.start = { x: win.x, y: win.y };
          drag.ghost = true;
          drag.ghostStyle = `left:${win.x}px;top:${win.y}px;width:${win.w}px;height:${win.h}px;`;
          window.addEventListener('mousemove', onDrag);
          window.addEventListener('mouseup', endDrag);
        };
        const onDrag = event => {
          if (!drag.active) return;
          const win = wm.find(drag.id);
          if (!win) return;
          const x = drag.start.x + (event.clientX - drag.startX);
          const y = drag.start.y + (event.clientY - drag.startY);
          drag.ghostStyle = `left:${x}px;top:${y}px;width:${win.w}px;height:${win.h}px;`;
        };
        const endDrag = event => {
          if (!drag.active) return;
          const win = wm.find(drag.id);
          if (!win) return;
          const maxX = innerWidth - win.w;
          const maxY = innerHeight - win.h;
          const x = Math.max(Math.min(4, maxX), Math.min(drag.start.x + (event.clientX - drag.startX), maxX));
          const y = Math.max(Math.min(4, maxY), Math.min(drag.start.y + (event.clientY - drag.startY), maxY));
          wm.move(drag.id, x, y);
          drag.active = false;
          drag.id = null;
          drag.ghost = false;
          drag.ghostStyle = '';
          window.removeEventListener('mousemove', onDrag);
          window.removeEventListener('mouseup', endDrag);
        };
        const startResize = (event, id) => {
          event.stopPropagation();
          const win = wm.find(id);
          if (!win) return;
          if (win.maximized) {
            bus.emit('window.feedback', { id, kind: 'shake' });
            return;
          }
          if (isNarrowViewport()) {
            bus.emit('window.feedback', { id, kind: 'shake' });
            return;
          }
          drag.active = true;
          drag.id = id;
          drag.startX = event.clientX;
          drag.startY = event.clientY;
          drag.start = { w: win.w, h: win.h };
          drag.ghost = true;
          drag.ghostStyle = `left:${win.x}px;top:${win.y}px;width:${win.w}px;height:${win.h}px;`;
          const onMove = moveEvent => {
            const width = Math.max(340, drag.start.w + (moveEvent.clientX - drag.startX));
            const height = Math.max(220, drag.start.h + (moveEvent.clientY - drag.startY));
            drag.ghostStyle = `left:${win.x}px;top:${win.y}px;width:${width}px;height:${height}px;`;
          };
          const onUp = upEvent => {
            const width = Math.max(340, drag.start.w + (upEvent.clientX - drag.startX));
            const height = Math.max(220, drag.start.h + (upEvent.clientY - drag.startY));
            wm.resize(id, Math.min(width, innerWidth - win.x), Math.min(height, innerHeight - win.y));
            drag.active = false;
            drag.id = null;
            drag.ghost = false;
            drag.ghostStyle = '';
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
          };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        };

        const clock = ref('');
        const tick = () => {
          clock.value = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' });
        };
        setInterval(tick, 1000);
        tick();
        const ui = reactive({ menu: false });
        const setLang = language => {
          if (!['es', 'en'].includes(language)) throw new Error(`Unsupported language: ${language}`);
          lang.value = language;
          updateWindowTitles();
          telemetry.cta('lang_switch', { variant: language });
        };
        const handleDocumentClickForStartMenu = event => {
          if (!ui.menu) return;
          const menu = document.querySelector('.menu');
          const start = document.querySelector('.start');
          if (!menu?.contains(event.target) && !start?.contains(event.target)) ui.menu = false;
        };

        onMounted(() => {
          document.addEventListener('click', handleDocumentClickForStartMenu);
          openApp('about');
        });
        onUnmounted(() => document.removeEventListener('click', handleDocumentClickForStartMenu));

        return { env, appName, lang, t, telemetry, compositor, windows, tasks, ui, openApp, openViewer, focus, minimize, restore, toggleMaximize, closeWindow, startDrag, startResize, drag, clock, setLang };
      }
    });
    app.mount('#app');
  }
}
