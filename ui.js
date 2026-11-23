/* Pantallas principales: mapa, mundos, lección y examen */
(function () {
  const { h, md } = U; const st = () => PDC.store, S = () => PDC.store.S; const app = document.getElementById('app');
  const UI = window.UI = {}; const AV = 'avatar.png';
  const PRAISE = ['¡Excelente!', '¡Muy bien, así se hace!', '¡Eso es!', '¡Correcto, lo lograste!', '¡Brillante!', '¡Vas muy bien!'];
  const OOPS = ['Casi. Mira con calma y vuelve a intentarlo.', 'No pasa nada: equivocarse es parte de aprender.', 'Todavía no, pero estás cerca. Respira y revisa otra vez.', 'Buen intento. Lee el enunciado de nuevo con tranquilidad.'];
  const nm = () => S().name || 'estudiante';
  const go = r => { location.hash = '#/' + r; };
  const bar = pct => h('div', { class: 'progress' }, h('i', { style: { width: pct + '%' } }));
  const tutor = msg => h('div', { class: 'tutor' }, h('img', { src: AV, alt: 'Profe Yuli' }), h('div', { class: 'bubble', html: md(msg) }));
  UI.go = go; UI.bar = bar; UI.tutor = tutor;
  /* ---------- estructura ---------- */
  function topbar() {
    const s = S();
    return h('div', { class: 'topbar' }, h('div', { class: 'in' }, h('div', { class: 'brand', onclick: () => go('') }, h('img', { src: 'logo-512.png', alt: '' }), h('span', null, 'Programando desde Cero')),
      h('div', { class: 'stat', 'data-k': 'streak', title: 'Racha de días' }, '🔥 ', h('span', null, s.streak.count)), h('div', { class: 'stat', 'data-k': 'coins', title: 'Monedas' }, '🪙 ', h('span', null, s.coins)), h('div', { class: 'stat', 'data-k': 'xp', title: 'Puntos de experiencia' }, '⚡ ', h('span', null, s.xp))));
  }
  UI.refreshTop = () => { const s = S(); [['streak', s.streak.count], ['coins', s.coins], ['xp', s.xp]].forEach(([k, v]) => { const e = document.querySelector('.stat[data-k=' + k + '] span'); if (e) e.textContent = v; }); };
  function navbar(route) {
    const d = st().ensureDaily(); const alert = !d.chest || d.missions.some(m => m.done && !m.claimed);
    const it = [['', '🗺️', 'Mapa'], ['taller', '⌨️', 'Taller'], ['misiones', '🎯', 'Misiones'], ['perfil', '👩‍💻', 'Perfil']];
    const cur = route.split('/')[0]; const on = r => (r === '' ? (cur === '' || cur === 'mundo') : cur === r);
    return h('nav', { class: 'nav' }, h('div', { class: 'in' }, it.map(([r, ic, t]) => h('a', { href: '#/' + r, class: on(r) ? 'on' : '' }, h('span', { class: 'ic' }, ic), t, r === 'misiones' && alert ? h('span', { class: 'dot' }) : null))));
  }
  UI.shell = function (route, node, opt = {}) {
    app.innerHTML = ''; document.body.classList.toggle('focus', !!opt.focus);
    if (!opt.focus) app.append(topbar()); app.append(node); if (!opt.focus) app.append(navbar(route));
    Ads.banner(!opt.focus && route !== 'certificado'); window.scrollTo(0, 0);
  };
  /* ---------- inicio / mapa ---------- */
  UI.home = function () {
    const s = S(), rk = st().rankFor(s.xp), nx = st().nextLesson(); const wrap = h('div', { class: 'wrap' });
    wrap.append(h('div', { class: 'hero' }, h('img', { src: AV, alt: '' }), h('div', { style: { flex: 1, minWidth: 0 } }, h('h2', null, '¡Hola, ' + nm() + '!'), h('div', { class: 'small' }, rk.emoji + ' ' + rk.name + ' · Nivel ' + st().level(s.xp)), bar(rk.pct), h('div', { class: 'small', style: { marginTop: '4px' } }, rk.next ? 'Faltan ' + (rk.next.xp - s.xp) + ' XP para ' + rk.next.name : '¡Rango máximo!'))));
    if (s.lost) wrap.append(h('div', { class: 'card' }, h('h3', null, '😢 Perdiste tu racha de ' + s.lost.count + ' días'), h('p', { class: 'muted small' }, 'Aún puedes recuperarla.'), h('div', { class: 'row' }, h('button', { class: 'btn small gold', onclick: async () => { if (await Ads.rewarded()) { st().repairStreak(); FX.toast('🔥 ¡Racha recuperada!', 'good'); UI.home(); } } }, '▶ Ver anuncio y recuperarla'), h('button', { class: 'btn small ghost', onclick: () => { if (S().coins >= 80) { st().addCoins(-80); st().repairStreak(); FX.toast('🔥 ¡Racha recuperada!', 'good'); UI.home(); } else FX.toast('Necesitas 80 monedas 🪙', 'bad'); } }, 'Usar 80 🪙'))));
    const d = st().ensureDaily();
    if (nx) wrap.append(h('div', { class: 'card' }, h('div', { class: 'small muted' }, 'Tu próxima misión'), h('h3', null, nx.exam ? '🏆 Examen del Mundo ' + nx.w.n : nx.l.emoji + ' ' + nx.l.title), h('button', { class: 'btn block', onclick: () => go(nx.exam ? 'examen/' + nx.w.id : 'leccion/' + nx.l.id) }, S().lessons[nx.l && nx.l.id] ? 'Continuar' : (st().doneCount() ? '¡Seguir aprendiendo!' : '¡Empezar!'))));
    else wrap.append(h('div', { class: 'card center' }, h('h3', null, '🎓 ¡Completaste todos los mundos!'), h('button', { class: 'btn', onclick: () => go('certificado') }, 'Ver mi certificado')));
    if (!d.chest) wrap.append(h('div', { class: 'card row sp', style: { cursor: 'pointer' }, onclick: () => go('misiones') }, h('div', null, h('b', null, '🎁 Tu cofre diario te espera'), h('div', { class: 'small muted' }, 'Ábrelo y gana monedas y XP')), h('span', { class: 'chip' }, 'Abrir')));
    wrap.append(h('div', { class: 'row sp' }, h('h2', { style: { margin: 0 } }, 'Mapa de mundos'), h('span', { class: 'chip' }, st().overallPct() + '% completado')), bar(st().overallPct()));
    const map = h('div', { class: 'map' });
    PDC.worlds.filter(w => w.id !== 'en').forEach((w, i) => { if (i) map.append(h('div', { class: 'link-v' })); map.append(worldCard(w)); });
    wrap.append(map); const en = PDC.worlds.find(w => w.id === 'en'); if (en) wrap.append(h('h2', { style: { marginTop: '22px' } }, '🌎 Mundo extra'), h('div', { class: 'map' }, worldCard(en)));
    wrap.append(h('p', { class: 'center small muted', style: { marginTop: '24px' } }, h('a', { href: '#/legal/privacidad' }, 'Privacidad'), ' · ', h('a', { href: '#/legal/terminos' }, 'Términos'), ' · ', h('a', { href: '#/legal/contacto' }, 'Contacto')));
    UI.shell('', wrap);
  };
  function worldCard(w) {
    const lock = !st().worldUnlocked(w), pct = st().worldPct(w); const prev = PDC.worlds.filter(x => x.id !== 'en')[PDC.worlds.filter(x => x.id !== 'en').indexOf(w) - 1];
    return h('div', { class: 'world' + (lock ? ' locked' : ''), onclick: () => lock ? FX.toast('🔒 Aprueba el examen del Mundo ' + (prev ? prev.n : '') + ' para desbloquear este mundo') : go('mundo/' + w.id) },
      h('div', { class: 'ico', style: { background: w.color } }, w.emoji, lock ? h('span', { class: 'lock' }, '🔒') : (st().examPassed(w) ? h('span', { class: 'lock' }, '✅') : null)),
      h('div', { class: 'meta' }, h('b', null, (w.id === 'en' ? 'Extra' : 'Mundo ' + w.n) + ' · ' + w.title), h('div', { class: 'small muted' }, w.subtitle), bar(pct), h('div', { class: 'small muted' }, st().doneCount([w]) + ' de ' + w.lessons.length + ' lecciones')));
  }
  UI.world = function (id) {
    const w = PDC.worlds.find(x => String(x.id) === String(id)); if (!w) return go('');
    if (!st().worldUnlocked(w)) { FX.toast('🔒 Mundo bloqueado'); return go(''); }
    const wrap = h('div', { class: 'wrap' }); wrap.append(h('a', { href: '#/', class: 'small' }, '← Volver al mapa'), h('div', { class: 'card', style: { borderTop: '6px solid ' + w.color } }, h('h1', null, w.emoji + ' ' + w.title), h('p', { class: 'muted', html: md(w.intro) }), bar(st().worldPct(w))));
    const path = h('div', { class: 'path' }); const cur = w.lessons.findIndex(l => !st().lessonDone(l.id));
    w.lessons.forEach((l, i) => { const done = st().lessonDone(l.id), un = st().lessonUnlocked(w, i), r = S().lessons[l.id];
      const b = h('button', { class: 'node' + (done ? ' done' : '') + (!un ? ' locked' : '') + (i === cur ? ' cur' : ''), style: { transform: 'translateX(' + [0, 40, 0, -40][i % 4] + 'px)', background: done ? '' : (un ? w.color : '') }, onclick: () => un ? go('leccion/' + l.id) : FX.toast('🔒 Termina la lección anterior primero') }, un ? l.emoji : '🔒', done ? h('span', { class: 'st' }, '⭐'.repeat(r.stars)) : null);
      path.append(h('div', { style: { textAlign: 'center' } }, b, h('div', { class: 'lbl' }, (i + 1) + '. ' + l.title))); });
    const ex = h('button', { class: 'node exam' + (st().examUnlocked(w) ? '' : ' locked'), onclick: () => st().examUnlocked(w) ? go('examen/' + w.id) : FX.toast('🔒 Termina todas las lecciones para el examen') }, st().examUnlocked(w) ? '🏆' : '🔒');
    const er = S().exams[w.id]; path.append(h('div', { style: { textAlign: 'center' } }, ex, h('div', { class: 'lbl' }, 'Examen del mundo' + (er ? ' · mejor: ' + er.best + '%' : ''))));
    wrap.append(path); UI.shell('mundo/' + id, wrap);
  };
  /* ---------- bloques de contenido ---------- */
  function flowEl(steps) { const f = h('div', { class: 'flow' }); steps.forEach((s, i) => { if (i) f.append(h('div', { class: 'fa' }, '⬇')); f.append(h('div', { class: 'fs ' + s.shape }, h('span', null, s.text))); if (s.shape === 'decision') f.append(h('div', { class: 'fyn' }, h('div', null, '✅ Sí: ' + (s.yes || '')), h('div', null, '❌ No: ' + (s.no || '')))); }); return f; }
  const spk = t => h('button', { class: 'mini', 'aria-label': 'Escuchar', onclick: () => FX.speak(t) }, '🔊');
  UI.block = function (b) {
    switch (b.t) {
      case 'p': return h('p', { class: 'blk', html: md(b.text) }); case 'analogy': return h('div', { class: 'blk analogy', html: md(b.text) }); case 'tip': return h('div', { class: 'blk tip', html: md(b.text) }); case 'warn': return h('div', { class: 'blk warn', html: md(b.text) });
      case 'list': return h('ul', { class: 'blk' }, b.items.map(i => h('li', { html: md(i) }))); case 'steps': return h('ol', { class: 'blk' }, b.items.map(i => h('li', { html: md(i) })));
      case 'code': return h('div', { class: 'blk' }, EX.codeBlock(b)); case 'table': return h('div', { class: 'blk' }, EX.tableEl(b.head, b.rows)); case 'flow': return h('div', { class: 'blk' }, flowEl(b.steps));
      case 'vocab': return h('div', { class: 'blk vocab' }, b.items.map(i => h('div', { class: 'vi' }, spk(i.en), h('div', { class: 't' }, h('b', null, i.en), ' — ' + i.es, i.ex ? h('i', null, '“' + i.ex + '”') : null), i.ex ? h('button', { class: 'mini', 'aria-label': 'Escuchar frase', onclick: () => FX.speak(i.ex) }, '💬') : null)));
      case 'dialog': return h('div', { class: 'blk dlg' }, b.lines.map(l => h('div', { class: 'ln' }, h('span', { class: 'who' }, l.who), h('div', { style: { flex: 1 } }, h('b', null, l.en), h('div', { class: 'muted small' }, l.es)), spk(l.en))));
    } return h('span');
  };
  /* ---------- ejercicio interactivo (lección, repaso y retos) ---------- */
  UI.exStep = function (step, stats, done) {
    const ex = step.e, api = EX.build(ex); let attempts = 0, hints = 0, over = false; const fb = h('div'), actions = h('div', { class: 'footer-bar' }); const hintBox = h('div');
    const set = (...e) => { actions.innerHTML = ''; actions.append(...e); };
    const check = h('button', { class: 'btn block', onclick: async () => {
      const a = api.get(); if (a == null) return FX.toast('Responde primero 🙂'); check.disabled = true; let res;
      try { res = await EX.grade(ex, a); } catch (e) { res = { ok: false, error: { type: 'Error', message: String(e.message || e) } }; } attempts++; check.disabled = false; res.ok ? good(res) : bad(res);
    } }, 'Comprobar'); set(check);
    function good(res) {
      api.lock(); api.mark(res); over = true; const first = attempts === 1 && hints === 0;
      const base = step.challenge ? 25 : 10, mult = attempts === 1 ? 1 : attempts === 2 ? .6 : .3, hp = Math.max(.4, 1 - .2 * hints); const bonus = first ? Math.min(stats.combo, 5) * 2 : 0; const pts = Math.round(base * mult * hp) + bonus;
      stats.total++; if (attempts === 1 && hints === 0) { stats.first++; stats.combo++; } else stats.combo = 0; stats.xp += pts; st().bump('correct'); if (step.ref) st().clearWrong(step.ref);
      FX.play('ok'); FX.vibrate(30); const fly = h('div', { class: 'xpfly' }, '+' + pts + ' XP'); document.body.append(fly); setTimeout(() => fly.remove(), 1000);
      fb.innerHTML = ''; fb.append(h('div', { class: 'feedback ok' }, h('h3', null, '✅ ' + U.pick(PRAISE) + (stats.combo >= 2 ? '  ' : '')), stats.combo >= 2 ? h('span', { class: 'combo' }, '🔥 Combo x' + stats.combo) : null, h('div', { html: md(ex.explain) })));
      set(h('button', { class: 'btn good block', onclick: () => done(pts) }, 'Continuar →'));
    }
    function bad(res) {
      FX.play('bad'); FX.vibrate(60); stats.combo = 0; api.mark(res); if (step.ref && attempts === 1) st().markWrong(step.ref);
      const msg = res.wrongMsg || (ex.type === 'code' ? '' : U.pick(OOPS)); fb.innerHTML = '';
      fb.append(h('div', { class: 'feedback no' }, h('h3', null, '🤔 ' + (ex.type === 'code' ? 'Aún no pasa todas las pruebas' : 'Todavía no')), msg ? h('div', { html: md(msg) }) : null, ex.type === 'code' ? h('div', { class: 'small muted' }, U.pick(OOPS)) : null));
      const btns = [h('button', { class: 'btn block', onclick: () => { api.reset && api.reset(); fb.innerHTML = ''; set(check); if (api.input) api.input.focus(); } }, '↻ Intentar de nuevo')];
      if (ex.hints && hints < ex.hints.length) btns.push(h('button', { class: 'btn ghost block', style: { marginTop: '8px' }, onclick: () => { hintBox.append(h('div', { class: 'tip' }, '💡 Pista ' + (hints + 1) + ': ' + ex.hints[hints])); hints++; bad2(); } }, '💡 Pedir una pista (' + hints + '/' + ex.hints.length + ')'));
      if (attempts >= 3) btns.push(h('button', { class: 'btn ghost block', style: { marginTop: '8px' }, onclick: reveal }, '👀 Ver una solución (0 XP)'));
      else btns.push(h('div', { class: 'small muted center', style: { marginTop: '6px' } }, attempts === 2 ? 'Un intento más y podrás ver una solución.' : ''));
      set(...btns);
      function bad2() { bad(res); }
    }
    function reveal() { over = true; api.lock(); stats.total++; stats.combo = 0; fb.append(EX.solutionEl(ex), h('div', { class: 'feedback ok', style: { marginTop: '8px' }, html: md(ex.explain) })); set(h('button', { class: 'btn block', onclick: () => done(0) }, 'Continuar →')); }
    return h('div', null, api.el, hintBox, fb, actions);
  };
  /* ---------- lección ---------- */
  UI.lesson = function (id) {
    const ref = st().lessonRef(id); if (!ref) return go(''); if (!st().lessonUnlocked(ref.w, ref.i)) { FX.toast('🔒 Termina la lección anterior primero'); return go('mundo/' + ref.w.id); }
    const L = ref.l, w = ref.w, steps = []; L.learn.forEach((c, i) => steps.push({ k: 'learn', c, i, n: L.learn.length })); steps.push({ k: 'example' });
    L.practice.forEach((e, i) => steps.push({ k: 'ex', e, ref: id + '|p' + i, label: 'Practica' })); steps.push({ k: 'ex', e: L.challenge, ref: id + '|c', label: 'Reto final', challenge: true }); steps.push({ k: 'reward' });
    const stats = { xp: 0, first: 0, total: 0, combo: 0 }; let idx = 0; const root = h('div'), body = h('div', { class: 'wrap' }); const fill = h('i', { style: { width: '0%' } });
    const exit = h('button', { class: 'x', 'aria-label': 'Salir', onclick: () => { const m = FX.modal(h('div', { class: 'center' }, h('h3', null, '¿Salir de la lección?'), h('p', { class: 'muted' }, 'Perderás el avance de esta lección.'), h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn ghost', onclick: () => m.close() }, 'Seguir'), h('button', { class: 'btn danger', onclick: () => { m.close(); go('mundo/' + w.id); } }, 'Salir')))); } }, '✕');
    root.append(h('div', { class: 'lesson-top' }, exit, h('div', { class: 'progress' }, fill)), body);
    const next = () => { idx++; render(); };
    function render() {
      body.innerHTML = ''; fill.style.width = Math.round(idx / (steps.length - 1) * 100) + '%'; window.scrollTo(0, 0); const s = steps[idx];
      if (s.k === 'learn') {
        const msg = idx === 0 ? '¡Hola, ' + nm() + '! Hoy aprenderemos **' + L.title + '**. Ve a tu ritmo, aquí nadie te apura. 💜' : U.pick(['Lee con calma, tú puedes.', 'Cada idea nueva suma. ¡Sigue!', 'Si algo no queda claro, vuelve atrás sin miedo.']);
        body.append(tutor(msg), h('span', { class: 'stepname' }, '1 · Aprende'), h('h2', { style: { marginTop: '8px' } }, s.c.title), s.c.blocks.map(UI.block), h('div', { class: 'cards-nav' }, Array.from({ length: s.n }, (_, i) => h('i', { class: i === s.i ? 'on' : '' }))),
          h('div', { class: 'footer-bar row' }, idx > 0 ? h('button', { class: 'btn ghost', onclick: () => { idx--; render(); } }, '←') : null, h('button', { class: 'btn', style: { flex: 1 }, onclick: next }, 'Siguiente →')));
      } else if (s.k === 'example') {
        const E = L.example; body.append(tutor('Mira este ejemplo de la vida real y cómo se traduce a código.'), h('span', { class: 'stepname' }, '2 · Ejemplo'), h('h2', { style: { marginTop: '8px' } }, E.title), h('div', { class: 'card' }, h('p', { html: md(E.story) })));
        if (E.pseudo) body.append(h('div', { class: 'blk' }, h('div', { class: 'cb-head' }, 'Pseudocódigo'), h('pre', { class: 'code' }, E.pseudo))); if (E.code) body.append(h('div', { class: 'blk' }, EX.codeBlock(Object.assign({ run: true }, E.code)))); if (E.note) body.append(h('div', { class: 'blk tip', html: md(E.note) }));
        if (L.example && L.practice) body.append(h('div', { class: 'footer-bar row' }, h('button', { class: 'btn ghost', onclick: () => { idx--; render(); } }, '←'), h('button', { class: 'btn', style: { flex: 1 }, onclick: next }, '¡A practicar! →')));
      } else if (s.k === 'ex') {
        body.append(tutor(s.challenge ? '¡Última prueba! Tú puedes con este reto. 🎯' : U.pick(['Ahora te toca a ti. ¡Sin presión!', 'Probemos lo aprendido.', 'Tómate tu tiempo, no hay prisa.'])), h('span', { class: 'stepname' }, (s.challenge ? '5 · ' : '3 · ') + s.label + (s.challenge ? '' : ' · ' + (idx - L.learn.length) + '/' + L.practice.length)));
        if (s.challenge) body.append(h('div', { class: 'card', style: { background: 'var(--bg2)' } }, h('b', null, '🎯 Reto final'), h('div', { class: 'muted small' }, 'Aplica todo lo aprendido en una pequeña misión.')));
        body.append(UI.exStep(s, stats, () => next()));
      } else finish();
    }
    async function finish() {
      const ratio = stats.total ? stats.first / stats.total : 1; const r = st().finishLesson(id, { xp: stats.xp, ratio }); const badges = st().checkBadges(); UI.refreshTop(); FX.play('win'); FX.confetti(r.stars === 3 ? 160 : 90);
      body.append(h('div', { class: 'center' }, h('div', { class: 'chest' }, r.stars === 3 ? '🏆' : '🎉'), h('h1', null, '¡Lección completada!'), h('div', { style: { fontSize: '2.4rem' } }, '⭐'.repeat(r.stars) + '☆'.repeat(3 - r.stars)), h('p', { class: 'muted' }, r.stars === 3 ? '¡Perfecta! Casi todo a la primera.' : 'Cada intento te hace mejor.')));
      body.append(h('div', { class: 'grid2' }, h('div', { class: 'kpi' }, h('b', null, '+' + r.xp), 'XP ⚡'), h('div', { class: 'kpi' }, h('b', null, '+' + r.coins), 'Monedas 🪙')));
      if (badges.length) body.append(h('div', { class: 'card center' }, h('b', null, '🏅 ¡Nueva insignia!'), badges.map(b => h('div', { style: { fontSize: '1.2rem', margin: '6px 0' } }, b.e + ' ' + b.n))));
      if (r.stars === 3 && r.first) { let opened = false; const cb = h('button', { class: 'btn gold block', onclick: () => { if (opened) return; opened = true; const c = 10 + U.rnd(16); st().addCoins(c); st().save(); UI.refreshTop(); FX.play('coin'); cb.textContent = '🪙 +' + c + ' monedas del cofre'; cb.disabled = true; const d = h('button', { class: 'btn small ghost', style: { marginTop: '8px' }, onclick: async () => { if (await Ads.rewarded()) { st().addCoins(c); st().save(); UI.refreshTop(); FX.play('coin'); d.remove(); FX.toast('¡Monedas duplicadas! 🪙🪙', 'good'); } } }, '▶ Duplicar con un anuncio'); cb.after(d); } }, '🎁 Abrir cofre de 3 estrellas'); body.append(h('div', { class: 'card' }, cb)); }
      if (Math.random() < .35 && st().doneCount() >= 2 && st().ensureDaily().surprises < 3) body.append(h('div', { class: 'card row sp' }, h('div', null, h('b', null, '⚡ ¡Reto sorpresa disponible!'), h('div', { class: 'small muted' }, 'Una pregunta rápida por monedas')), h('button', { class: 'btn small', onclick: () => go('sorpresa') }, 'Jugar')));
      if (r.rankUp) FX.modal(h('div', { class: 'center' }, h('div', { class: 'chest' }, r.rankUp.emoji), h('h2', null, '¡Subiste de rango!'), h('p', null, 'Ahora eres ', h('b', null, r.rankUp.name)), h('button', { class: 'btn', onclick: e => e.target.closest('.modal-back').remove() }, '¡Genial!')));
      const nx = ref.i + 1 < w.lessons.length ? w.lessons[ref.i + 1] : null; const worldFinished = st().worldDone(w);
      if (worldFinished && r.first) FX.modal(h('div', { class: 'center' }, h('div', { class: 'chest' }, w.emoji), h('h2', null, '¡Completaste el Mundo ' + (w.id === 'en' ? 'Extra' : w.n) + '!'), h('p', null, 'Ya puedes hacer el examen del mundo y ganar tu insignia ', h('b', null, w.badge.emoji + ' ' + w.badge.name), '.'), h('button', { class: 'btn', onclick: e => e.target.closest('.modal-back').remove() }, '¡Vamos!')));
      body.append(h('div', { class: 'footer-bar' }, h('button', { class: 'btn block', onclick: async () => { await Ads.maybeInterstitial(); go(nx ? 'leccion/' + nx.id : (worldFinished ? 'examen/' + w.id : 'mundo/' + w.id)); } }, nx ? 'Siguiente lección →' : (worldFinished ? '🏆 Ir al examen del mundo' : 'Volver al mundo')), h('button', { class: 'btn ghost block', style: { marginTop: '8px' }, onclick: async () => { await Ads.maybeInterstitial(); go('mundo/' + w.id); } }, 'Volver al mapa')));
    }
    render(); UI.shell('leccion/' + id, root, { focus: true });
  };
  /* ---------- examen del mundo ---------- */
  UI.exam = function (wid) {
    const w = PDC.worlds.find(x => String(x.id) === String(wid)); if (!w) return go(''); if (!st().examUnlocked(w)) { FX.toast('🔒 Termina todas las lecciones primero'); return go('mundo/' + wid); }
    const Q = w.exam; const apis = []; let idx = 0; const root = h('div'), body = h('div', { class: 'wrap' }), fill = h('i', { style: { width: '0%' } });
    root.append(h('div', { class: 'lesson-top' }, h('button', { class: 'x', onclick: () => go('mundo/' + wid) }, '✕'), h('div', { class: 'progress' }, fill)), body);
    function render() {
      body.innerHTML = ''; fill.style.width = Math.round(idx / Q.length * 100) + '%'; window.scrollTo(0, 0);
      if (idx === 0 && !apis[0]) body.append(tutor('Este es el examen del **Mundo ' + (w.id === 'en' ? 'Extra' : w.n) + '**. No hay pistas: confía en lo que aprendiste. Necesitas **70 %** para aprobar. 💪'));
      const api = apis[idx] || (apis[idx] = EX.build(Q[idx])); body.append(h('span', { class: 'stepname' }, 'Pregunta ' + (idx + 1) + ' de ' + Q.length), api.el);
      body.append(h('div', { class: 'footer-bar' }, h('button', { class: 'btn block', onclick: async () => { if (api.get() == null) return FX.toast('Responde antes de continuar 🙂'); if (idx < Q.length - 1) { idx++; render(); } else await results(); } }, idx < Q.length - 1 ? 'Siguiente →' : 'Terminar examen')));
    }
    async function results() {
      body.innerHTML = '<p class="center muted">Calificando…</p>'; const res = []; for (let i = 0; i < Q.length; i++) { let r; try { r = await EX.grade(Q[i], apis[i].get()); } catch (e) { r = { ok: false }; } res.push(r.ok); }
      const ok = res.filter(Boolean).length, pct = Math.round(ok / Q.length * 100), out = st().finishExam(w.id, pct); const badges = st().checkBadges(); UI.refreshTop(); body.innerHTML = ''; fill.style.width = '100%';
      if (pct >= 70) { FX.play('win'); FX.confetti(180); }
      body.append(h('div', { class: 'center' }, h('div', { class: 'chest' }, pct >= 70 ? '🏆' : '📚'), h('h1', null, pct >= 70 ? '¡Aprobaste!' : 'Casi lo logras'), h('div', { style: { fontSize: '3rem', fontWeight: 900 } }, pct + '%'), h('p', { class: 'muted' }, ok + ' de ' + Q.length + ' correctas'),
        h('p', null, pct >= 70 ? (out.first ? '¡Ganaste la insignia ' + w.badge.emoji + ' ' + w.badge.name + '!' : '¡Muy bien!') : 'Para continuar necesitas 70 %. Te recomiendo repasar antes de intentarlo otra vez; ¡tú puedes!')));
      if (badges.length) body.append(h('div', { class: 'card center' }, h('b', null, '🏅 ¡Nueva insignia!'), badges.map(b => h('div', { style: { fontSize: '1.2rem' } }, b.e + ' ' + b.n))));
      if (pct < 70) { const ls = [...new Set(Q.filter((q, i) => !res[i]).map(q => q.lesson))].map(id => st().lessonRef(id)).filter(Boolean); if (ls.length) body.append(h('div', { class: 'card' }, h('h3', null, '📖 Lecciones para repasar'), ls.map(x => h('div', { class: 'row sp' }, h('span', null, x.l.emoji + ' ' + x.l.title), h('button', { class: 'btn small ghost', onclick: () => go('leccion/' + x.l.id) }, 'Repasar'))))); }
      body.append(h('h2', null, 'Respuestas y explicaciones')); Q.forEach((q, i) => { body.append(h('div', { class: 'card' }, h('div', { class: 'small', style: { fontWeight: 900, color: res[i] ? 'var(--good)' : 'var(--bad)' } }, (res[i] ? '✅ Correcta' : '❌ Incorrecta') + ' · pregunta ' + (i + 1)), h('div', { class: 'ex-q', html: md(q.q) }), q.code && q.type === 'bug' ? h('pre', { class: 'code' }, q.code) : null, EX.solutionEl(q), h('p', { class: 'small', html: md(q.explain) }))); });
      const worlds = st().core(); const allDone = worlds.every(x => st().examPassed(x));
      body.append(h('div', { class: 'footer-bar' }, pct >= 70 ? (allDone && w.id !== 'en' ? h('button', { class: 'btn gold block', onclick: () => go('certificado') }, '🎓 ¡Obtener mi certificado!') : h('button', { class: 'btn block', onclick: async () => { await Ads.maybeInterstitial(); go(''); } }, 'Continuar al mapa →')) : h('button', { class: 'btn block', onclick: () => { UI.exam(wid); } }, '↻ Intentar el examen otra vez'), h('button', { class: 'btn ghost block', style: { marginTop: '8px' }, onclick: () => go('mundo/' + wid) }, 'Volver al mundo')));
      window.scrollTo(0, 0);
    }
    render(); UI.shell('examen/' + wid, root, { focus: true });
  };
})();
