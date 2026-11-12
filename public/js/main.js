/* =============================================
   Cam.Dev — Main entry
   Behavior lives in UX plugins (js/ux-plugins.js) on the UX engine
   (js/ux-engine.js). Add new plugins there and they start from here.
   ============================================= */

(function () {
  'use strict';
  if (!window.UX) {
    console.error('[UX] engine missing: load js/ux-engine.js and js/ux-plugins.js before main.js');
    return;
  }
  window.UX.start();
})();
