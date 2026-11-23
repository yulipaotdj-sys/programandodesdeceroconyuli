/* Estado, progreso y gamificación */
(function () {
  const { dayKey, daysBetween, seeded } = U;
  const KEY = 'pdc.state.v1';
  const RANKS = [
    { xp: 0, name: 'Exploradora del código', emoji: '🧭' }, { xp: 200, name: 'Aprendiz de lógica', emoji: '🧠' },
    { xp: 600, name: 'Programadora principiante', emoji: '💻' }, { xp: 1300, name: 'Desarrolladora en formación', emoji: '🛠️' },
    { xp: 2300, name: 'Arquitecta de soluciones', emoji: '🏗️' }, { xp: 3500, name: 'Desarrolladora de software', emoji: '👩‍💻' }];
  const POOL = [
    { id: 'lesson', t: 'Completa 1 lección', goal: 1, coins: 20, xp: 15 }, { id: 'correct', t: 'Acierta 6 ejercicios', goal: 6, coins: 15, xp: 10 },
    { id: 'xp', t: 'Gana 60 XP', goal: 60, coins: 20, xp: 10 }, { id: 'taller', t: 'Ejecuta código en el Taller', goal: 1, coins: 10, xp: 10 },
    { id: 'review', t: 'Repasa 3 errores', goal: 3, coins: 20, xp: 15 }, { id: 'surprise', t: 'Supera 1 reto sorpresa', goal: 1, coins: 25, xp: 15 }];
  const fresh = () => ({
    v: 1, name: '', createdAt: Date.now(), updatedAt: 0, xp: 0, coins: 20, freezes: 0, seconds: 0, tallerRuns: 0,
    streak: { count: 0, last: '' }, bestStreak: 0, lost: null,
    lessons: {}, exams: {}, badges: {}, history: [], wrong: [], daily: null, cert: null,
    settings: { theme: 'auto', sound: true }, drive: { linked: false, email: '', last: 0 }, ads: { since: 0, last: 0 }, onboarded: false
  });
  let S = load(); const subs = [];
  function load() { try { const r = JSON.parse(localStorage.getItem(KEY)); if (r && r.v === 1) { const f = fresh(); return Object.assign(f, r, { settings: Object.assign(f.settings, r.settings), drive: Object.assign(f.drive, r.drive) }); } } catch (e) { } return fresh(); }
  function save(silent) { S.updatedAt = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } if (!silent) subs.forEach(f => { try { f(S); } catch (e) { } }); }
  const onChange = f => subs.push(f);
  const rankFor = xp => { let i = 0; RANKS.forEach((r, j) => { if (xp >= r.xp) i = j; }); const nx = RANKS[i + 1]; return { i, ...RANKS[i], next: nx, pct: nx ? Math.round((xp - RANKS[i].xp) / (nx.xp - RANKS[i].xp) * 100) : 100 }; };
  const level = xp => Math.floor(xp / 100) + 1;
  function log(type, text, xp) { S.history.unshift({ t: Date.now(), type, text, xp: xp || 0 }); S.history.length = Math.min(S.history.length, 150); }

  /* --- contenido --- */
  const worlds = () => PDC.worlds;
  const core = () => worlds().filter(w => w.id !== 'en');
  const lessonRef = id => { for (const w of worlds()) for (let i = 0; i < w.lessons.length; i++) if (w.lessons[i].id === id) return { w, l: w.lessons[i], i }; return null; };
  const totalLessons = () => core().reduce((n, w) => n + w.lessons.length, 0);
  const doneCount = ws => (ws || worlds()).reduce((n, w) => n + w.lessons.filter(l => S.lessons[l.id] && S.lessons[l.id].done).length, 0);
  const lessonDone = id => !!(S.lessons[id] && S.lessons[id].done);
  const worldDone = w => w.lessons.every(l => lessonDone(l.id));
  const examPassed = w => !!(S.exams[w.id] && S.exams[w.id].passed);
  function worldUnlocked(w) { if (w.id === 'en') return true; const c = core(); const i = c.indexOf(w); return i <= 0 || examPassed(c[i - 1]); }
  function lessonUnlocked(w, i) { return worldUnlocked(w) && (i === 0 || lessonDone(w.lessons[i - 1].id)); }
  const examUnlocked = w => worldUnlocked(w) && worldDone(w);
  const worldPct = w => Math.round(w.lessons.filter(l => lessonDone(l.id)).length / w.lessons.length * 100);
  const overallPct = () => { const n = doneCount(core()) + core().filter(examPassed).length; const t = totalLessons() + core().length; return Math.round(n / t * 100); };
  function nextLesson() { for (const w of core()) { if (!worldUnlocked(w)) break; for (let i = 0; i < w.lessons.length; i++) if (!lessonDone(w.lessons[i].id)) return { w, l: w.lessons[i], i }; if (!examPassed(w)) return { w, exam: true }; } return null; }

  /* --- día, racha y misiones --- */
  function ensureDaily() {
    const t = dayKey();
    if (!S.daily || S.daily.date !== t) {
      const rng = seeded(t + (S.createdAt || 0)); const hasWrong = S.wrong.length > 0, hasDone = doneCount() >= 2;
      const opts = POOL.filter(m => m.id !== 'lesson' && (m.id !== 'review' || hasWrong) && (m.id !== 'surprise' || hasDone));
      for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
      S.daily = { date: t, chest: false, surprises: 0, missions: [POOL[0], opts[0], opts[1]].filter(Boolean).map(m => ({ id: m.id, p: 0, done: false, claimed: false })) };
    }
    return S.daily;
  }
  const missionDef = id => POOL.find(m => m.id === id);
  function bump(id, n = 1) { const d = ensureDaily(); const m = d.missions.find(x => x.id === id); if (!m || m.done) return; m.p += n; if (m.p >= missionDef(id).goal) { m.p = missionDef(id).goal; m.done = true; FX.toast('🎯 ¡Misión cumplida! Reclama tu recompensa', 'good'); } }
  function claimMission(id) { const d = ensureDaily(); const m = d.missions.find(x => x.id === id); if (!m || !m.done || m.claimed) return false; m.claimed = true; const def = missionDef(id); addCoins(def.coins); addXp(def.xp, 'Misión: ' + def.t, true); save(); return def; }
  function checkStreak() {
    const t = dayKey(), s = S.streak; if (!s.last || s.last === t || s.count === 0) return null;
    const gap = daysBetween(s.last, t); if (gap <= 1) return null;
    if (gap === 2 && S.freezes > 0) { S.freezes--; s.last = dayKey(new Date(Date.now() - 864e5)); log('streak', 'Se usó un protector de racha 🧊'); save(); return { saved: true }; }
    S.lost = { count: s.count, at: t }; s.count = 0; save(); return { lost: S.lost.count };
  }
  function touchStreak() { const t = dayKey(), s = S.streak; if (s.last === t) return; const gap = s.last ? daysBetween(s.last, t) : 99; s.count = gap === 1 ? s.count + 1 : 1; s.last = t; S.lost = null; if (s.count > S.bestStreak) S.bestStreak = s.count; if ([3, 7, 14, 30].includes(s.count)) FX.toast('🔥 ¡Racha de ' + s.count + ' días!', 'good'); }
  function repairStreak() { if (!S.lost) return false; S.streak.count = S.lost.count; S.streak.last = dayKey(new Date(Date.now() - 864e5)); S.lost = null; save(); return true; }

  /* --- recompensas --- */
  function addCoins(n) { S.coins = Math.max(0, S.coins + n); }
  function addXp(n, why, quiet) {
    if (!n) return {}; const before = rankFor(S.xp).i, lb = level(S.xp); S.xp += n; touchStreak(); bump('xp', n);
    const after = rankFor(S.xp); if (!quiet) log('xp', why || 'XP', n);
    return { rankUp: after.i > before ? after : null, levelUp: level(S.xp) > lb ? level(S.xp) : null };
  }
  /* --- insignias --- */
  const BADGES = () => [
    { id: 'first', n: 'Primer paso', e: '👣', d: 'Completa tu primera lección', ok: () => doneCount() >= 1 },
    { id: 'l10', n: '10 lecciones', e: '🔟', d: 'Completa 10 lecciones', ok: () => doneCount() >= 10 },
    { id: 'l25', n: '25 lecciones', e: '🥈', d: 'Completa 25 lecciones', ok: () => doneCount() >= 25 },
    { id: 'l50', n: '50 lecciones', e: '🥇', d: 'Completa 50 lecciones', ok: () => doneCount() >= 50 },
    { id: 's3', n: 'Racha de 3', e: '🔥', d: '3 días seguidos', ok: () => S.bestStreak >= 3 },
    { id: 's7', n: 'Racha de 7', e: '🌟', d: '7 días seguidos', ok: () => S.bestStreak >= 7 },
    { id: 's30', n: 'Racha de 30', e: '💎', d: '30 días seguidos', ok: () => S.bestStreak >= 30 },
    { id: 'perfect', n: 'Impecable', e: '⭐', d: '5 lecciones con 3 estrellas', ok: () => Object.values(S.lessons).filter(l => l.stars === 3).length >= 5 },
    { id: 'ace', n: 'Examen perfecto', e: '💯', d: 'Saca 100 % en un examen', ok: () => Object.values(S.exams).some(e => e.best === 100) },
    { id: 'taller', n: 'Manos a la obra', e: '⌨️', d: 'Ejecuta código 10 veces', ok: () => S.tallerRuns >= 10 },
    { id: 'rich', n: 'Ahorradora', e: '🪙', d: 'Reúne 500 monedas', ok: () => S.coins >= 500 },
    ...worlds().map(w => ({ id: 'w' + w.id, n: w.badge.name, e: w.badge.emoji, d: 'Aprueba el examen del Mundo ' + (w.id === 'en' ? 'Extra de inglés' : w.n), ok: () => examPassed(w) })),
    { id: 'cert', n: 'Certificada', e: '🎓', d: 'Obtén tu certificado', ok: () => !!S.cert }];
  function checkBadges() { const out = []; BADGES().forEach(b => { if (!S.badges[b.id] && b.ok()) { S.badges[b.id] = Date.now(); out.push(b); log('badge', 'Insignia: ' + b.n); } }); if (out.length) save(); return out; }
  /* --- registrar resultados --- */
  function finishLesson(id, stats) {
    const prev = S.lessons[id]; const first = !(prev && prev.done);
    const stars = stats.ratio >= .85 ? 3 : stats.ratio >= .6 ? 2 : 1;
    S.lessons[id] = { done: true, stars: Math.max(stars, prev ? prev.stars : 0), xp: (prev ? prev.xp : 0) + stats.xp, at: Date.now() };
    let bonus = 0; if (first) { bonus = 15; bump('lesson'); S.ads.since++; }
    const r = addXp(stats.xp + bonus, 'Lección: ' + lessonRef(id).l.title, true); const coins = Math.max(1, Math.round((stats.xp + bonus) / 5)) + (stars === 3 ? 5 : 0); addCoins(coins);
    log('lesson', 'Lección: ' + lessonRef(id).l.title + ' ' + '⭐'.repeat(stars), stats.xp + bonus); save();
    return { stars, xp: stats.xp + bonus, coins, first, ...r };
  }
  function finishExam(wid, pct, wrongLessons) {
    const w = worlds().find(x => x.id === wid); const prev = S.exams[wid]; const passed = pct >= 70 || (prev && prev.passed); const first = passed && !(prev && prev.passed);
    S.exams[wid] = { best: Math.max(pct, prev ? prev.best : 0), last: pct, passed: !!passed, at: Date.now(), tries: (prev ? prev.tries : 0) + 1 };
    let r = {}; if (pct >= 70) { const xp = first ? 60 + Math.round(pct / 2) : 10; r = addXp(xp, 'Examen: ' + w.title + ' ' + pct + '%', true); addCoins(first ? 50 : 5); log('exam', 'Examen: ' + w.title + ' — ' + pct + '%', xp); } else log('exam', 'Examen (repasar): ' + w.title + ' — ' + pct + '%');
    save(); return { first, passed: pct >= 70, ...r };
  }
  function markWrong(ref) { const e = S.wrong.find(x => x.ref === ref); if (e) e.n++; else S.wrong.push({ ref, n: 1 }); S.wrong = S.wrong.slice(-40); }
  function clearWrong(ref) { S.wrong = S.wrong.filter(x => x.ref !== ref); }
  function resolveRef(ref) {
    const [a, b] = ref.split('|'); const lr = lessonRef(a); if (lr) return b === 'c' ? lr.l.challenge : lr.l.practice[+b.slice(1)];
    if (a.startsWith('exam:')) { const w = worlds().find(x => String(x.id) === a.slice(5)); return w && w.exam[+b]; } return null;
  }
  /* --- sincronización: combina dos estados --- */
  function merge(a, b) {
    const base = (a.updatedAt || 0) >= (b.updatedAt || 0) ? a : b, other = base === a ? b : a; const m = JSON.parse(JSON.stringify(base));
    for (const id in other.lessons) { const x = other.lessons[id], y = m.lessons[id]; if (!y || (x.done && !y.done)) m.lessons[id] = x; else if (x.done) { y.stars = Math.max(y.stars, x.stars); y.xp = Math.max(y.xp, x.xp); } }
    for (const id in other.exams) { const x = other.exams[id], y = m.exams[id]; if (!y) m.exams[id] = x; else { y.best = Math.max(y.best, x.best); y.passed = y.passed || x.passed; y.tries = Math.max(y.tries, x.tries); } }
    for (const id in other.badges) if (!m.badges[id]) m.badges[id] = other.badges[id];
    m.xp = Math.max(a.xp, b.xp); m.coins = base.coins; m.seconds = Math.max(a.seconds, b.seconds); m.bestStreak = Math.max(a.bestStreak, b.bestStreak); m.tallerRuns = Math.max(a.tallerRuns, b.tallerRuns);
    const seen = new Set(m.history.map(h => h.t + h.text)); other.history.forEach(h => { if (!seen.has(h.t + h.text)) m.history.push(h); }); m.history.sort((p, q) => q.t - p.t); m.history.length = Math.min(m.history.length, 150);
    m.cert = m.cert || other.cert; m.name = m.name || other.name; m.onboarded = a.onboarded || b.onboarded; m.createdAt = Math.min(a.createdAt, b.createdAt);
    return m;
  }
  function replaceState(ns) { const keep = { settings: S.settings, drive: S.drive }; S = Object.assign(fresh(), ns, keep); PDC.store.S = S; save(); }
  const exportJSON = () => JSON.stringify(S, null, 1);
  function importJSON(txt) { const r = JSON.parse(txt); if (!r || r.v !== 1) throw new Error('Archivo no válido'); replaceState(merge(S, r)); }
  function reset() { const keep = { settings: S.settings }; S = Object.assign(fresh(), keep); PDC.store.S = S; try { localStorage.removeItem(KEY); } catch (e) { } save(); }
  window.PDC = window.PDC || {}; PDC.worlds = PDC.worlds || [];
  PDC.store = { S, save, onChange, RANKS, POOL, rankFor, level, lessonRef, totalLessons, doneCount, lessonDone, worldDone, examPassed, worldUnlocked, lessonUnlocked, examUnlocked, worldPct, overallPct, nextLesson, ensureDaily, missionDef, bump, claimMission, checkStreak, repairStreak, addCoins, addXp, BADGES, checkBadges, finishLesson, finishExam, markWrong, clearWrong, resolveRef, merge, replaceState, exportJSON, importJSON, reset, log, core };
  Object.defineProperty(PDC.store, 'S', { get: () => S, set: v => { S = v; } });
})();
