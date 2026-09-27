class WindowManager {
  constructor() {
    this.stack = [];
    this.z = 2000;
  }

  create({ id, title, icon, component, x = 120, y = 120, w = 720, h = 460 }) {
    const win = { id, title, icon, component, x, y, w, h, minimized: false, maximized: false, z: ++this.z };
    this.stack.push(win);
    return win;
  }

  focus(id) {
    const win = this.find(id);
    if (!win) return;
    win.z = ++this.z;
    this.stack = this.stack.sort((a, b) => a.z - b.z);
  }

  find(id) { return this.stack.find(win => win.id === id); }
  close(id) { this.stack = this.stack.filter(win => win.id !== id); }

  minimize(id) {
    const win = this.find(id);
    if (win) win.minimized = true;
  }

  restore(id) {
    const win = this.find(id);
    if (win) {
      win.minimized = false;
      this.focus(id);
    }
  }

  toggleMax(id) {
    const win = this.find(id);
    if (!win) return;
    win.maximized = !win.maximized;
    if (win.maximized) {
      win.prev = { x: win.x, y: win.y, w: win.w, h: win.h };
      win.x = 12;
      win.y = 12;
      win.w = innerWidth - 24;
      win.h = innerHeight - 54;
    } else if (win.prev) {
      Object.assign(win, win.prev);
      win.prev = undefined;
    }
  }

  style(win) {
    const base = `z-index:${win.z};` + (win.minimized ? 'display:none;' : '');
    return base + `left:${win.x}px;top:${win.y}px;width:${win.w}px;height:${win.h}px;`;
  }
  move(id, x, y) {
    const win = this.find(id);
    if (win) {
      win.x = x;
      win.y = y;
    }
  }

  resize(id, w, h) {
    const win = this.find(id);
    if (win) {
      win.w = w;
      win.h = h;
    }
  }
}


class EventBus {
  constructor() { this.map = new Map(); }

  on(event, handler) {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const handlers = this.map.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (!handlers.size) this.map.delete(event);
    }
  }

  emit(event, payload) {
    const handlers = this.map.get(event);
    if (handlers) {
      for (const handler of [...handlers]) {
        try { handler(payload); } catch (error) { console.debug('[bus:error]', event, error); }
      }
    }
  }
}

class StateManager {
  constructor(init = {}) {
    this.state = Object.assign({
      glass: true,
      wallpaper: 'https://fedoraproject.org/w/uploads/f/f9/F42-01-night.jpg',
      fit: 'cover',
      effectsEnabled: true,
      reducedMotion: false,
      animationSpeed: 1.0
    }, init);
  }

  get(key) { return this.state[key]; }
  set(key, value) { this.state[key] = value; return this.snapshot(); }
  toggle(key) { this.state[key] = !this.state[key]; return this.snapshot(); }
  snapshot() { return { ...this.state }; }
}

class EffectManager {
  constructor({ bus, state, telemetry }) {
    this.bus = bus;
    this.state = state;
    this.telemetry = telemetry;
    this.registry = new Map();
  }

  register(type, handler) { this.registry.set(type, handler); }
  unregister(type) { this.registry.delete(type); }

  async play(type, ctx) {
    if (!this.registry.has(type)) return;
    const start = performance.now();
    this.bus?.emit('effect.start', { type, target: ctx?.id });
    const factor = this.state.get('reducedMotion') ? 0.01 : (this.state.get('animationSpeed') || 1);
    await this.registry.get(type)({ ...ctx, state: this.state.snapshot(), speed: factor });
    const duration = performance.now() - start;
    this.bus?.emit('effect.end', { type, target: ctx?.id, duration });
    this.telemetry?.cta?.('effect', { name: type, duration: Math.round(duration) });
  }
}

const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

const awaitTransition = (element, timeout = 320) => new Promise(resolve => {
  if (!element) return resolve();
  let done = false;
  const timer = setTimeout(() => {
    if (!done) {
      done = true;
      resolve();
    }
  }, timeout + 40);
  const onEnd = event => {
    if (event.target !== element || done) return;
    done = true;
    clearTimeout(timer);
    element.removeEventListener('transitionend', onEnd);
    resolve();
  };
  element.addEventListener('transitionend', onEnd, { once: true });
});

function registerDefaultEffects(effectManager) {
  effectManager.register('transition:open', async ({ element, speed = 1 }) => {
    if (!element) return;
    element.classList.add('is-opening');
    await nextFrame();
    element.classList.add('is-open');
    element.classList.remove('is-opening');
    await awaitTransition(element, 240 / speed);
  });
  effectManager.register('transition:close', async ({ element, speed = 1 }) => {
    if (!element) return;
    element.classList.add('is-closing');
    element.classList.remove('is-open');
    await awaitTransition(element, 240 / speed);
    element.classList.remove('is-closing');
  });
  effectManager.register('transition:minimize', async ({ element, speed = 1 }) => {
    if (!element) return;
    element.classList.add('is-closing');
    element.classList.remove('is-open');
    await awaitTransition(element, 220 / speed);
    element.classList.remove('is-closing');
  });
  effectManager.register('transition:restore', async ({ element, speed = 1 }) => {
    if (!element) return;
    element.classList.remove('is-closing');
    element.style.willChange = 'opacity, transform';
    element.style.opacity = '0';
    element.style.transform = 'scale(.98)';
    await nextFrame();
    element.classList.add('is-open');
    element.style.opacity = '';
    element.style.transform = '';
    await awaitTransition(element, 200 / speed);
    element.style.willChange = '';
  });
  effectManager.register('material:shadow:weak', async ({ element }) => {
    if (!element) return;
    element.classList.add('has-shadow-weak');
    element.classList.remove('has-shadow-strong');
  });
  effectManager.register('material:shadow:strong', async ({ element }) => {
    if (!element) return;
    element.classList.add('has-shadow-strong');
    element.classList.remove('has-shadow-weak');
  });
  effectManager.register('motion:to-taskbar', async ({ id, element, speed = 1, getTaskEl }) => {
    if (!element) return;
    const taskElement = getTaskEl?.(id);
    if (!taskElement) return;
    const from = element.getBoundingClientRect();
    const to = taskElement.getBoundingClientRect();
    const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
    const scale = Math.max(0.08, Math.min(0.12, to.width / from.width));
    element.classList.add('fly');
    element.style.transformOrigin = 'center center';
    element.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    element.style.opacity = '0';
    await awaitTransition(element, 220 / speed);
    element.classList.remove('fly');
    element.style.transform = '';
    element.style.opacity = '';
  });
  effectManager.register('feedback:shake', async ({ element }) => {
    if (!element) return;
    element.classList.add('shake');
    await awaitTransition(element, 280);
    element.classList.remove('shake');
  });
  effectManager.register('attention:task', async ({ id, getTaskEl }) => {
    const element = getTaskEl?.(id);
    if (!element) return;
    element.classList.add('attention');
    await awaitTransition(element, 1200 * 2);
    element.classList.remove('attention');
  });
  effectManager.register('attention:window', async ({ element }) => {
    if (!element) return;
    element.classList.add('attention');
    await awaitTransition(element, 1200 * 2);
    element.classList.remove('attention');
  });
  effectManager.register('compositor:glass-toggle', async ({ elementList = [] }) => {
    for (const element of elementList) {
      if (element) element.style.willChange = 'backdrop-filter, background';
    }
    await nextFrame();
    for (const element of elementList) if (element) element.style.willChange = '';
  });
  effectManager.register('ambient:parallax', ({ root }) => {
    if (!root) return;
    root.classList.add('parallax');
    const onMove = event => {
      const x = (event.clientX / window.innerWidth) * 10;
      const y = (event.clientY / window.innerHeight) * 10;
      root.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px), center, center`;
    };
    root.__parallaxMove = onMove;
    window.addEventListener('mousemove', onMove);
  });
  effectManager.register('ambient:parallax:off', ({ root }) => {
    if (!root) return;
    window.removeEventListener('mousemove', root.__parallaxMove);
    root.classList.remove('parallax');
    root.style.backgroundPosition = 'center, center, center';
  });
}

class Compositor {
  constructor({ bus, stateManager, effectManager, getElement }) {
    this._bus = bus;
    this._state = stateManager;
    this._effects = effectManager;
    this._getElement = getElement;
    this.glass = this._state.get('glass');
    this.wallpaper = this._state.get('wallpaper');
    this.fit = this._state.get('fit');
    registerDefaultEffects(this._effects);
    this._bind();
  }

  _bind() {
    this._bus.on('window.opened', async ({ id }) => {
      const element = this._getElement(id);
      if (!element) return;
      await this._effects.play('transition:open', { id, element });
      await this._effects.play('material:shadow:strong', { id, element });
    });
    this._bus.on('window.closing', async ({ id, onDone }) => {
      const element = this._getElement(id);
      if (element) await this._effects.play('transition:close', { id, element });
      onDone?.();
    });
    this._bus.on('window.minimizing', async ({ id, onDone }) => {
      const element = this._getElement(id);
      if (element) await this._effects.play('transition:minimize', { id, element });
      onDone?.();
    });
    this._bus.on('window.focus', async ({ id }) => {
      const element = this._getElement(id);
      if (!element) return;
      await this._effects.play('material:shadow:strong', { id, element });
    });
    this._bus.on('window.blur', async ({ id }) => {
      const element = this._getElement(id);
      if (!element) return;
      await this._effects.play('material:shadow:weak', { id, element });
    });
    this._bus.on('window.feedback', async ({ id, kind }) => {
      const element = this._getElement(id);
      if (!element) return;
      if (kind === 'shake') await this._effects.play('feedback:shake', { id, element });
    });
    this._bus.on('window.restored', async ({ id }) => {
      const element = this._getElement(id);
      if (!element) return;
      element.classList.remove('is-closing');
      element.classList.add('is-open');
      await this._effects.play('material:shadow:strong', { id, element });
    });
    this._bus.on('compositor.toggleGlass', () => {
      const snap = this._state.toggle('glass');
      this.glass = snap.glass;
    });
  }

  toggleGlass() { this._bus.emit('compositor.toggleGlass'); }
  setWallpaper(url) { const snapshot = this._state.set('wallpaper', url); this.wallpaper = snapshot.wallpaper; }
  setFit(mode) { const snapshot = this._state.set('fit', mode); this.fit = snapshot.fit; }
}

export { Compositor, EffectManager, EventBus, StateManager, WindowManager, registerDefaultEffects };
