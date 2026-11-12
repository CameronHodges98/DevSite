/* =============================================
   Cam.Dev — UX Engine (core)
   A tiny plugin host. Plugins register themselves with UX.use() and are
   started together once the DOM is ready.

   Plugin shape:
     UX.use({
       name: 'my-plugin',            // required, unique
       requires: ['other-plugin'],   // optional, started first
       defaults: { speed: 1 },       // optional, merged with user options
       init(ctx)    { ... },         // called on start; return nothing
       destroy(ctx) { ... },         // optional cleanup
     }, { speed: 2 });               // optional per-plugin options

   ctx = { name, options, root, env, on, off, emit, onCleanup, $, $$ }
   ============================================= */

(function (global) {
  'use strict';

  const plugins = new Map(); // name -> { def, options, state }
  const listeners = new Map(); // event -> Set<fn>
  let started = false;

  const mq = (q) => (global.matchMedia ? global.matchMedia(q) : { matches: false });

  /** Environment flags plugins can read (kept live where it matters). */
  const env = {
    get reducedMotion() { return mq('(prefers-reduced-motion: reduce)').matches; },
    get coarsePointer() { return mq('(pointer: coarse)').matches; },
    get hasObserver() { return 'IntersectionObserver' in global; },
  };

  /* ---------- event bus ---------- */
  function on(event, fn) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(fn);
    return () => off(event, fn);
  }

  function off(event, fn) {
    const set = listeners.get(event);
    if (set) set.delete(fn);
  }

  function emit(event, detail) {
    const set = listeners.get(event);
    if (!set) return;
    [...set].forEach((fn) => {
      try { fn(detail); } catch (err) { console.error('[UX] listener error for "' + event + '"', err); }
    });
  }

  /* ---------- registry ---------- */
  function use(def, options) {
    if (!def || typeof def.name !== 'string') {
      throw new Error('[UX] plugin needs a string "name"');
    }
    if (plugins.has(def.name)) {
      console.warn('[UX] plugin "' + def.name + '" already registered; ignoring');
      return api;
    }
    plugins.set(def.name, {
      def,
      options: Object.assign({}, def.defaults, options),
      state: 'registered',
      cleanups: [],
    });
    // Late registration after start: boot immediately.
    if (started) boot(def.name, []);
    return api;
  }

  function makeContext(entry) {
    const root = document;
    return {
      name: entry.def.name,
      options: entry.options,
      root,
      env,
      on(event, fn) {
        const un = on(event, fn);
        entry.cleanups.push(un);
        return un;
      },
      off,
      emit,
      onCleanup(fn) { entry.cleanups.push(fn); },
      $: (sel, scope) => (scope || root).querySelector(sel),
      $$: (sel, scope) => Array.from((scope || root).querySelectorAll(sel)),
    };
  }

  function boot(name, stack) {
    const entry = plugins.get(name);
    if (!entry || entry.state === 'running' || entry.state === 'failed') return;
    if (stack.includes(name)) {
      console.error('[UX] circular plugin dependency: ' + stack.concat(name).join(' -> '));
      entry.state = 'failed';
      return;
    }
    for (const dep of entry.def.requires || []) {
      if (!plugins.has(dep)) {
        console.error('[UX] plugin "' + name + '" requires missing plugin "' + dep + '"');
        entry.state = 'failed';
        return;
      }
      boot(dep, stack.concat(name));
      if (plugins.get(dep).state !== 'running') {
        console.error('[UX] plugin "' + name + '" skipped: dependency "' + dep + '" failed');
        entry.state = 'failed';
        return;
      }
    }
    try {
      entry.def.init && entry.def.init(makeContext(entry));
      entry.state = 'running';
      emit('plugin:ready', name);
    } catch (err) {
      entry.state = 'failed';
      console.error('[UX] plugin "' + name + '" failed to init', err);
    }
  }

  function start() {
    if (started) return api;
    started = true;
    [...plugins.keys()].forEach((name) => boot(name, []));
    emit('engine:ready');
    return api;
  }

  function stop(name) {
    const names = name ? [name] : [...plugins.keys()].reverse();
    names.forEach((n) => {
      const entry = plugins.get(n);
      if (!entry || entry.state !== 'running') return;
      try { entry.def.destroy && entry.def.destroy(makeContext(entry)); } catch (e) { console.error(e); }
      entry.cleanups.splice(0).forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
      entry.state = 'registered';
    });
  }

  function status() {
    const out = {};
    plugins.forEach((entry, n) => { out[n] = entry.state; });
    return out;
  }

  const api = { use, start, stop, status, on, off, emit, env };
  global.UX = api;
})(window);
