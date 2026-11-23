/* Efectos: sonidos, confeti, voz, vibración, avisos */
(function () {
  const { h } = U; let ac = null;
  const on = () => PDC.store && PDC.store.S.settings.sound;
  function tone(freq, t0, dur, type = 'sine', vol = 0.12) {
    if (!on()) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ac.currentTime + t0); g.gain.exponentialRampToValueAtTime(vol, ac.currentTime + t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t0 + dur);
      o.connect(g).connect(ac.destination); o.start(ac.currentTime + t0); o.stop(ac.currentTime + t0 + dur + 0.05);
    } catch (e) { }
  }
  const SOUNDS = {
    ok: () => { tone(660, 0, .12); tone(880, .1, .18); }, bad: () => { tone(220, 0, .18, 'triangle'); tone(180, .15, .22, 'triangle'); },
    coin: () => { tone(988, 0, .08, 'square', .07); tone(1319, .08, .2, 'square', .07); },
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .12, .25, 'triangle', .14)),
    tap: () => tone(500, 0, .04, 'sine', .05)
  };
  const play = n => SOUNDS[n] && SOUNDS[n]();
  const vibrate = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } };
  function confetti(n = 120) {
    const c = h('canvas', { class: 'confetti' }); document.body.append(c);
    const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    const cols = ['#8b5cf6', '#f472b6', '#fbbf24', '#34d399', '#60a5fa'];
    const ps = Array.from({ length: n }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .4, vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 5, s: 5 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[(Math.random() * cols.length) | 0] }));
    let f = 0;
    (function loop() {
      ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += .04; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); });
      if (++f < 220) requestAnimationFrame(loop); else c.remove();
    })();
  }
  function speak(text) {
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = .9; speechSynthesis.speak(u); } catch (e) { }
  }
  function toast(msg, kind = '') {
    let box = document.getElementById('toasts'); if (!box) { box = h('div', { id: 'toasts' }); document.body.append(box); }
    const t = h('div', { class: 'toast ' + kind }, msg); box.append(t); setTimeout(() => t.classList.add('out'), 2600); setTimeout(() => t.remove(), 3100);
  }
  function modal(content, opts = {}) {
    const back = h('div', { class: 'modal-back' });
    const box = h('div', { class: 'modal' + (opts.wide ? ' wide' : '') }, content); back.append(box);
    const close = () => { back.remove(); opts.onClose && opts.onClose(); };
    if (!opts.sticky) back.addEventListener('click', e => { if (e.target === back) close(); });
    document.body.append(back); return { close, el: box };
  }
  window.FX = { play, vibrate, confetti, speak, toast, modal };
})();
