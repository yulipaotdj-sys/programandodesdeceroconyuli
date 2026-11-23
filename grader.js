/* Grader — califica ejercicios. Se usa en la app (navegador) y en el validador (Node). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./pyrun.js'), (() => { try { return require('./sqlrun.js'); } catch (e) { return null; } })());
  else root.Grader = factory(root.PyRun, root.SqlRun);
})(typeof self !== 'undefined' ? self : this, function (PyRun, SqlRun) {
  'use strict';

  const noAccents = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  /* Texto "suave": minúsculas, sin tildes, espacios colapsados */
  function norm(s) { return noAccents(String(s ?? '')).toLowerCase().replace(/\s+/g, ' ').trim(); }
  /* Respuestas cortas: tolera $, espacios, separadores de miles y coma decimal */
  function normAnswer(s) {
    let t = norm(s).replace(/[$"'`]/g, '').replace(/\s+/g, '');
    if (/^[+-]?\d{1,3}([.,]\d{3})+$/.test(t)) t = t.replace(/[.,]/g, '');
    else if (/^[+-]?\d{1,3}(\.\d{3})+,\d+$/.test(t)) t = t.replace(/\./g, '').replace(',', '.');
    else if (/^[+-]?\d{1,3}(,\d{3})+\.\d+$/.test(t)) t = t.replace(/,/g, '');
    else t = t.replace(',', '.');
    if (/^[+-]?\d+(\.\d+)?$/.test(t)) { const n = Number(t); if (Number.isFinite(n)) return String(n); }
    return t;
  }
  function normOutput(s) { return String(s ?? '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/^\n+|\n+$/g, ''); }
  function shuffleIdx(n, seed) { const a = [...Array(n).keys()]; let s = seed || 1; for (let i = n - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* ─── Ejercicios no-código ─── */
  function gradeStatic(ex, ans) {
    switch (ex.type) {
      case 'mcq': return { ok: ans === ex.answer, wrongMsg: ex.wrong && ex.wrong[ans] };
      case 'tf': return { ok: ans === ex.answer };
      case 'multi': { const a = [...(ans || [])].sort().join(','), b = [...ex.answers].sort().join(','); return { ok: a === b }; }
      case 'input': {
        const given = normAnswer(ans); const ok = (ex.answers || []).some(a => normAnswer(a) === given);
        let msg; if (!ok) for (const c of ex.common || []) if (new RegExp(c.re, 'i').test(norm(ans)) || new RegExp(c.re, 'i').test(String(ans))) { msg = c.msg; break; }
        return { ok, wrongMsg: msg };
      }
      case 'order': return { ok: Array.isArray(ans) && ans.length === ex.items.length && ans.every((v, i) => v === i) };
      case 'fill': {
        const res = ex.blanks.map((b, i) => (b.answers || []).some(a => normAnswer(a) === normAnswer((ans || [])[i])));
        return { ok: res.every(Boolean), perBlank: res };
      }
      case 'match': { const res = ex.pairs.map((p, i) => ans && ans[i] === i); return { ok: res.every(Boolean), perPair: res }; }
      case 'bug': return { ok: ans === ex.bugLine };
    }
    return { ok: false };
  }

  /* ─── Revisiones de texto ─── */
  function runChecks(code, checks) {
    const fails = [];
    const text = String(code || '');
    for (const c of checks || []) {
      const re = new RegExp(c.re, c.flags === undefined ? 'i' : c.flags);
      const hit = re.test(text);
      if (c.not ? hit : !hit) fails.push(c.msg || ('Falta algo importante en tu respuesta: ' + c.re));
    }
    return fails;
  }

  /* ─── DOM (HTML/CSS/JS en el navegador o jsdom) ─── */
  function cssEqual(win, doc, el, prop, expected) {
    const tmp = doc.createElement('div'); doc.body.appendChild(tmp);
    try { tmp.style.setProperty(prop, expected); return win.getComputedStyle(el).getPropertyValue(prop).trim() === win.getComputedStyle(tmp).getPropertyValue(prop).trim() || (el.style.getPropertyValue(prop) && el.style.getPropertyValue(prop) === tmp.style.getPropertyValue(prop)); }
    finally { tmp.remove(); }
  }
  function evalDomChecks(doc, win, checks) {
    const fails = [];
    for (const c of checks || []) {
      let els = []; try { els = [...doc.querySelectorAll(c.sel)]; } catch (e) { }
      let ok = true;
      if (c.count !== undefined) ok = els.length === c.count; else if (c.min !== undefined) ok = els.length >= c.min; else if (c.exists === false) ok = els.length === 0; else ok = els.length > 0;
      if (ok && c.exists !== false && els.length) {
        if (c.text !== undefined) { const re = new RegExp(c.text, 'i'); ok = els.some(e => re.test(e.textContent.replace(/\s+/g, ' '))); }
        if (ok && c.css) ok = els.some(e => Object.entries(c.css).every(([p, v]) => cssEqual(win, doc, e, p, v)));
        if (ok && c.attr) ok = els.some(e => Object.entries(c.attr).every(([k, v]) => { const a = e.getAttribute(k); return a !== null && (v === true || new RegExp('^' + v + '$', 'i').test(a)); }));
        if (ok && c.value !== undefined) ok = els.some(e => String(e.value) === String(c.value));
      }
      if (!ok) fails.push(c.msg || ('Revisa el elemento ' + c.sel));
    }
    return fails;
  }
  function runActions(doc, win, actions) {
    for (const a of actions || []) {
      if (a.click) { const el = doc.querySelector(a.click); if (el) el.click(); }
      else if (a.type) { const el = doc.querySelector(a.type); if (el) { el.value = a.value; el.dispatchEvent(new win.Event('input', { bubbles: true })); el.dispatchEvent(new win.Event('change', { bubbles: true })); } }
    }
  }

  /* ─── Ejercicios de código ─── */
  /* ctx: { runJS(code, inputs) → Promise<{output,error}>, renderHTML(code) → Promise<{doc,win,cleanup}> } */
  async function gradeCode(ex, code, ctx) {
    ctx = ctx || {};
    const out = { ok: false, tests: [], failedChecks: [], domFails: [], output: '', error: null };
    const lang = ex.lang;
    out.failedChecks = runChecks(code, ex.checks);
    let testsOk = true;
    if ((lang === 'python' || lang === 'js') && ex.tests && ex.tests.length) {
      for (const t of ex.tests) {
        let r;
        if (lang === 'python') r = PyRun.run(code, { inputs: t.inputs || [] });
        else r = await ctx.runJS(code, t.inputs || []);
        const got = normOutput(r.output);
        let ok;
        if (r.error) ok = false;
        else if (t.contains) ok = t.contains.every(s => norm(got).includes(norm(s)));
        else if (t.output !== undefined) ok = got === normOutput(t.output);
        else ok = true;
        if (!ok) testsOk = false;
        out.tests.push({ ok, hidden: !!t.hidden, inputs: t.inputs || [], expected: t.output !== undefined ? normOutput(t.output) : (t.contains ? 'debe incluir: ' + t.contains.join(' · ') : ''), got, error: r.error });
        if (!out.error && r.error) out.error = r.error;
        out.output = got;
      }
    } else if (lang === 'python' && !ex.tests) {
      const r = PyRun.run(code, { inputs: [] }); out.output = r.output; out.error = r.error; if (r.error) testsOk = false;
    }
    let domOk = true;
    if ((lang === 'html' || lang === 'css') && ctx.renderHTML) {
      const page = await ctx.renderHTML(code, ex);
      try {
        runActions(page.doc, page.win, ex.actions);
        if (ex.actions && ex.actions.length && ctx.settle) await ctx.settle();
        out.domFails = evalDomChecks(page.doc, page.win, ex.domChecks);
      } finally { page.cleanup && page.cleanup(); }
      domOk = out.domFails.length === 0;
    }
    let sqlOk = true;
    if (lang === 'sql' && SqlRun && (ex.expect || ex.expectTable)) {
      const r = SqlRun.grade(ex, code); out.sql = r; sqlOk = r.ok; if (r.error) out.error = { type: 'SQLError', message: r.error, friendly: 'Revisa la sintaxis de tu consulta SQL.' };
    }
    out.ok = out.failedChecks.length === 0 && testsOk && domOk && sqlOk && !(lang === 'python' && out.error && !ex.tests);
    if (lang === 'pseudo' && ex.minLines) { const n = String(code).split('\n').filter(l => l.trim()).length; if (n < ex.minLines) { out.ok = false; out.failedChecks.push('Tu pseudocódigo es muy corto: escribe al menos ' + ex.minLines + ' líneas con los pasos completos.'); } }
    return out;
  }

  /* Construye la página que se muestra/evalúa en ejercicios html y css */
  function buildPage(code, ex) {
    const base = '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;margin:12px;line-height:1.4}</style>';
    if (ex && ex.lang === 'css') return '<!doctype html><html><head>' + base + '<style>' + code + '</style></head><body>' + (ex.html || '') + '</body></html>';
    if (/<html|<!doctype/i.test(code)) return code;
    return '<!doctype html><html><head>' + base + '</head><body>' + code + '</body></html>';
  }
  return { buildPage, norm, normAnswer, normOutput, shuffleIdx, gradeStatic, gradeCode, runChecks, evalDomChecks, runActions };
});
