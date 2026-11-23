/* Guardado del progreso en el Google Drive de cada usuaria (carpeta oculta de la app: appDataFolder).
   Solo se pide el permiso "drive.appdata": la app NO puede ver ningún otro archivo del Drive. */
(function () {
  const C = () => PDC_CONFIG, SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
  const native = () => !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
  const GA = () => window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.GoogleAuth;
  let token = null, exp = 0, tc = null, timer = null, busy = false, lastHash = 0;
  const D = { status: 'off', msg: '', cb: null };
  const set = (s, m) => { D.status = s; D.msg = m || ''; D.cb && D.cb(); };
  const configured = () => !!C().googleClientId;
  async function loadGIS() { if (window.google && google.accounts && google.accounts.oauth2) return; await new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.onload = ok; s.onerror = () => no(new Error('Sin conexión a internet')); document.head.append(s); }); }
  async function getToken(interactive) {
    if (token && Date.now() < exp - 60000) return token;
    if (native()) {
      if (!GA()) throw new Error('Falta el plugin de Google en la app');
      await GA().initialize({ clientId: C().googleClientId, scopes: ['profile', 'email', SCOPE], grantOfflineAccess: false });
      const r = interactive ? await GA().signIn() : await GA().refresh(); token = r.authentication.accessToken; exp = Date.now() + 3300e3;
      if (interactive) { PDC.store.S.drive.email = r.email || ''; } return token;
    }
    await loadGIS();
    return new Promise((ok, no) => {
      tc = tc || google.accounts.oauth2.initTokenClient({ client_id: C().googleClientId, scope: 'openid email profile ' + SCOPE, callback: () => { } });
      tc.callback = r => { if (r.error) return no(new Error(r.error)); token = r.access_token; exp = Date.now() + (r.expires_in || 3600) * 1000; ok(token); };
      tc.error_callback = e => no(new Error(e.type || 'cancelado'));
      tc.requestAccessToken({ prompt: interactive ? 'consent select_account' : '' });
    });
  }
  async function api(url, opts = {}) {
    const r = await fetch(url, Object.assign({}, opts, { headers: Object.assign({ Authorization: 'Bearer ' + token }, opts.headers || {}) }));
    if (r.status === 401) { token = null; throw new Error('Sesión vencida'); } if (!r.ok) throw new Error('Drive respondió ' + r.status); return r;
  }
  async function findFile() { const q = encodeURIComponent("name='" + C().driveFileName + "'"); const r = await (await api('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,modifiedTime)&q=' + q)).json(); return r.files && r.files[0]; }
  async function upload(id, text) {
    if (id) return api('https://www.googleapis.com/upload/drive/v3/files/' + id + '?uploadType=media', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: text });
    const b = '-pdc-' + Date.now(); const body = '--' + b + '\r\nContent-Type: application/json\r\n\r\n' + JSON.stringify({ name: C().driveFileName, parents: ['appDataFolder'] }) + '\r\n--' + b + '\r\nContent-Type: application/json\r\n\r\n' + text + '\r\n--' + b + '--';
    return api('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + b }, body });
  }
  async function sync(interactive) {
    if (busy || !PDC.store.S.drive.linked) return; if (!navigator.onLine) return set('error', 'Sin internet: se guardará después');
    busy = true; set('syncing', 'Guardando en tu Drive…');
    try {
      await getToken(!!interactive); const st = PDC.store; const f = await findFile(); let merged = st.S;
      if (f) { const remote = await (await api('https://www.googleapis.com/drive/v3/files/' + f.id + '?alt=media')).json(); if (remote && remote.v === 1) { merged = st.merge(st.S, remote); if (JSON.stringify(merged) !== JSON.stringify(st.S)) { st.replaceState(merged); merged = st.S; } } }
      const txt = JSON.stringify(Object.assign({}, merged, { drive: { linked: false, email: '', last: 0 } })); const hh = U.hash(txt);
      if (hh !== lastHash || !f) { await upload(f && f.id, txt); lastHash = hh; }
      st.S.drive.last = Date.now(); st.save(true); set('ok', 'Guardado en tu Drive');
    } catch (e) { set('error', e.message === 'cancelado' || /popup|access_denied/.test(e.message) ? 'Toca "Reconectar" para continuar' : 'No se pudo guardar: ' + e.message); }
    busy = false;
  }
  async function connect() {
    if (!configured()) { FX.toast('Falta configurar el ID de cliente de Google (ver README)', 'bad'); return; }
    PDC.store.S.drive.linked = true; try { await getToken(true); } catch (e) { PDC.store.S.drive.linked = false; set('error', 'No se pudo conectar: ' + e.message); return; }
    if (!native()) { try { const u = await (await api('https://www.googleapis.com/oauth2/v3/userinfo')).json(); PDC.store.S.drive.email = u.email || ''; } catch (e) { } }
    PDC.store.save(true); await sync(false);
  }
  async function disconnect(deleteRemote) {
    try { if (deleteRemote) { await getToken(false); const f = await findFile(); if (f) await api('https://www.googleapis.com/drive/v3/files/' + f.id, { method: 'DELETE' }); } if (token && window.google && google.accounts) google.accounts.oauth2.revoke(token, () => { }); if (native() && GA()) await GA().signOut(); } catch (e) { }
    token = null; PDC.store.S.drive = { linked: false, email: '', last: 0 }; PDC.store.save(true); set('off', '');
  }
  function schedule() { if (!PDC.store.S.drive.linked) return; clearTimeout(timer); timer = setTimeout(() => sync(false), 8000); }
  function start() {
    PDC.store.onChange(schedule);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && PDC.store.S.drive.linked) sync(false); });
    window.addEventListener('online', () => sync(false));
    if (PDC.store.S.drive.linked) { set('off', 'Toca "Reconectar" para sincronizar'); if (native()) sync(false); }
  }
  Object.assign(D, { configured, connect, disconnect, sync, start });
  window.Drive = D;
})();
