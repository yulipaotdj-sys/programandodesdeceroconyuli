/* Arranque y rutas */
(function () {
  PDC.worlds.sort((a, b) => a.n - b.n);
  const st = PDC.store; const apply = () => { document.documentElement.dataset.theme = st.S.settings.theme || 'auto'; }; apply();
  function route() {
    document.querySelectorAll('.modal-back, .confetti').forEach(m => m.remove());
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/'); const [r, a] = [parts[0], decodeURIComponent(parts.slice(1).join('/'))];
    if (!st.S.onboarded && r !== 'legal' && r !== 'bienvenida') return UI.bienvenida();
    try {
      ({ '': () => UI.home(), mundo: () => UI.world(a), leccion: () => UI.lesson(a), examen: () => UI.exam(a), taller: () => UI.taller(), misiones: () => UI.misiones(), perfil: () => UI.perfil(), legal: () => UI.legal(a), certificado: () => UI.certificado(), repaso: () => UI.repaso(), sorpresa: () => UI.sorpresa(), bienvenida: () => (st.S.onboarded ? UI.home() : UI.bienvenida()) }[r] || (() => UI.home()))();
    } catch (e) { console.error(e); document.getElementById('app').innerHTML = '<div class="wrap"><div class="card"><h2>Algo salió mal 😕</h2><p>' + U.esc(e.message) + '</p><a class="btn" href="#/">Volver al inicio</a></div></div>'; }
  }
  window.addEventListener('hashchange', route);
  /* Tiempo de estudio (solo cuando la app está visible y se está usando) */
  let lastAct = Date.now(); ['pointerdown', 'keydown', 'scroll'].forEach(e => addEventListener(e, () => lastAct = Date.now(), { passive: true }));
  setInterval(() => { if (document.visibilityState === 'visible' && Date.now() - lastAct < 60000) { st.S.seconds += 15; st.save(true); } }, 15000);
  /* Registro del service worker (funciona sin conexión en la versión web) */
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
  const r = st.checkStreak(); route(); Ads.init(); Drive.start();
  if (r && r.lost) setTimeout(() => FX.toast('😢 Perdiste tu racha. ¡Puedes recuperarla desde el Mapa!'), 800);
  if (r && r.saved) setTimeout(() => FX.toast('🧊 Tu protector salvó la racha', 'good'), 800);
})();
