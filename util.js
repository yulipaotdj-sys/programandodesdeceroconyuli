/* Utilidades */
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /* Markdown mínimo: **negrita**, *cursiva*, `código` */
  const md = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>');
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const k in attrs || {}) {
      const v = attrs[k]; if (v == null || v === false) continue;
      if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(Infinity).forEach(c => { if (c == null || c === false) return; el.append(c.nodeType ? c : document.createTextNode(c)); });
    return el;
  }
  const pad = n => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  function seeded(seed) { let s = 0; for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function hash(str) { let x = 2166136261; for (const c of String(str)) { x ^= c.charCodeAt(0); x = Math.imul(x, 16777619) >>> 0; } return x >>> 0; }
  const fmtDate = ts => new Date(ts).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  const fmtTime = secs => { const m = Math.round(secs / 60); return m < 60 ? m + ' min' : (m / 60).toFixed(1).replace('.', ',') + ' h'; };
  /* append() acepta listas anidadas y omite null/false */
  const _ap = Element.prototype.append; Element.prototype.append = function (...k) { return _ap.apply(this, k.flat(Infinity).filter(x => x != null && x !== false)); };
  window.U = { esc, md, h, dayKey, daysBetween, rnd, pick, seeded, hash, fmtDate, fmtTime, pad };
})();
