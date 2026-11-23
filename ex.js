/* Ejercicios: interfaz de cada tipo, ejecución de código y calificación */
(function () {
  const { h, md, esc } = U;
  const ctx = {
    runJS: (c, i) => Runners.runJS(c, i), settle: () => new Promise(r => setTimeout(r, 60)),
    renderHTML: (code, ex) => new Promise(res => {
      const f = h('iframe', { sandbox: 'allow-scripts allow-same-origin', style: { position: 'fixed', left: '-9999px', top: '0', width: '420px', height: '320px', border: '0' } });
      f.onload = () => setTimeout(() => res({ doc: f.contentDocument, win: f.contentWindow, cleanup: () => f.remove() }), 40); f.srcdoc = Grader.buildPage(code, ex); document.body.append(f);
    })
  };
  const IND = '  ';
  function editor(value, opts = {}) {
    const ta = h('textarea', { class: 'code-ed', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', rows: opts.rows || Math.max(4, String(value).split('\n').length + 1) }); ta.value = value;
    ta.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText(IND, s, ta.selectionEnd, 'end'); } });
    const fit = () => { ta.style.height = 'auto'; ta.style.height = Math.min(Math.max(ta.scrollHeight + 2, 96), 420) + 'px'; }; ta.addEventListener('input', fit); setTimeout(fit, 0); return ta;
  }
  const errBox = e => h('div', { class: 'out-err' }, h('b', null, '❌ ' + e.type + (e.line ? ' (línea ' + e.line + ')' : '') + ': '), e.message, e.friendly ? h('div', { class: 'friendly' }, '💡 ' + e.friendly) : null);
  function tableEl(cols, rows) { return h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, cols.map(c => h('th', null, String(c))))), h('tbody', null, rows.map(r => h('tr', null, r.map(c => h('td', null, c === null ? 'NULL' : String(c)))))))); }
  /* Ejecuta código y muestra la salida en `out` (código arriba, resultado abajo) */
  async function runInto(lang, code, inputs, out, ex) {
    out.innerHTML = ''; out.classList.remove('empty');
    if (lang === 'python') { const r = PyRun.run(code, { inputs: String(inputs || '').split('\n') }); out.append(h('pre', { class: 'out-pre' }, r.output || (r.error ? '' : '(sin salida: usa print() para mostrar algo)'))); if (r.error) out.append(errBox(r.error)); }
    else if (lang === 'js') { const r = await ctx.runJS(code, String(inputs || '').split('\n')); out.append(h('pre', { class: 'out-pre' }, r.output || (r.error ? '' : '(sin salida: usa console.log())'))); if (r.error) out.append(errBox(r.error)); }
    else if (lang === 'html' || lang === 'css') { const f = h('iframe', { class: 'preview', sandbox: 'allow-scripts allow-same-origin' }); f.srcdoc = Grader.buildPage(code, ex || { lang }); out.append(f); }
    else if (lang === 'sql' && ex && ex.db) { const r = SqlRun.run(ex.db, code); if (r.error) out.append(h('div', { class: 'out-err' }, '❌ ' + r.error)); else { const last = [...r.results].reverse().find(x => x.rows); if (last) out.append(tableEl(last.cols, last.rows)); else out.append(h('pre', { class: 'out-pre' }, '✔ Instrucción ejecutada.')); if (ex.expectTable) { const k = Object.keys(r.db).find(x => x.toLowerCase() === ex.expectTable.name.toLowerCase()); if (k) out.append(h('p', { class: 'muted small' }, 'Tabla ' + k + ' ahora:'), tableEl(r.db[k].cols, r.db[k].rows)); } } }
    PDC.store.S.tallerRuns++; PDC.store.bump('taller'); PDC.store.save(true);
  }
  /* Bloque de código de las tarjetas "Aprende" (editable y ejecutable) */
  function codeBlock(b) {
    const wrap = h('div', { class: 'cblock' }); const label = ({ python: 'Python', js: 'JavaScript', html: 'HTML', css: 'CSS', sql: 'SQL', pseudo: 'Pseudocódigo', text: 'Texto' })[b.lang] || b.lang;
    if (!b.run || !['python', 'js', 'html'].includes(b.lang)) { wrap.append(h('div', { class: 'cb-head' }, label), h('pre', { class: 'code' }, b.code)); return wrap; }
    const ed = editor(b.code); const out = h('div', { class: 'out empty' }, h('span', { class: 'muted small' }, 'Aquí verás el resultado'));
    const inp = h('input', { class: 'inp small', placeholder: 'Entradas para input(), separadas por coma' }); if (b.inputs) inp.value = String(b.inputs).split('\n').join(', ');
    const btn = h('button', { class: 'btn small', onclick: () => runInto(b.lang, ed.value, inp.value.split(',').map(s => s.trim()).join('\n'), out) }, '▶ Ejecutar');
    wrap.append(h('div', { class: 'cb-head' }, label + ' · pruébalo y cámbialo'), ed, (b.lang === 'python' && /input\(/.test(b.code)) ? inp : null, h('div', { class: 'row' }, btn), out); return wrap;
  }
  /* ===== construcción de cada tipo ===== */
  function build(ex, o = {}) {
    const el = h('div', { class: 'ex' }); const T = ex.type; let api = { el, get: () => null, lock() { }, mark() { } };
    if (ex.say) el.append(h('button', { class: 'btn ghost small speak', onclick: () => FX.speak(ex.say) }, '🔊 Escuchar'));
    el.append(h('div', { class: 'ex-q', html: md(ex.q) }));
    if (ex.table) el.append(tableEl(ex.table.head, ex.table.rows));
    if (T === 'mcq') {
      let sel = -1; const opts = ex.options.map((t, i) => h('button', { class: 'opt', onclick: () => { sel = i; opts.forEach((b, j) => b.classList.toggle('sel', j === i)); FX.play('tap'); } }, h('span', { class: 'k' }, 'ABCDE'[i]), h('span', { html: md(t) }))); el.append(h('div', { class: 'opts' }, opts));
      api = { el, get: () => sel < 0 ? null : sel, lock: () => opts.forEach(b => b.disabled = true), mark: r => { if (sel >= 0) opts[sel].classList.add(r.ok ? 'good' : 'bad'); }, reset: () => { sel = -1; opts.forEach(b => b.classList.remove('sel', 'bad', 'good')); } };
    } else if (T === 'tf') {
      let sel = null; const bt = [['Verdadero', true], ['Falso', false]].map(([t, v]) => h('button', { class: 'opt', onclick: () => { sel = v; bt.forEach(b => b.classList.remove('sel')); bt.find(b => b._v === v).classList.add('sel'); FX.play('tap'); } }, t)); bt[0]._v = true; bt[1]._v = false; el.append(h('div', { class: 'opts two' }, bt));
      api = { el, get: () => sel, lock: () => bt.forEach(b => b.disabled = true), mark: r => { const b = bt.find(x => x._v === sel); b && b.classList.add(r.ok ? 'good' : 'bad'); }, reset: () => { sel = null; bt.forEach(b => b.classList.remove('sel', 'bad', 'good')); } };
    } else if (T === 'multi') {
      const set = new Set(); const opts = ex.options.map((t, i) => h('button', { class: 'opt', onclick: () => { set.has(i) ? set.delete(i) : set.add(i); opts[i].classList.toggle('sel'); FX.play('tap'); } }, h('span', { class: 'k sq' }, '✓'), h('span', { html: md(t) }))); el.append(h('p', { class: 'muted small' }, 'Marca todas las que correspondan.'), h('div', { class: 'opts' }, opts));
      api = { el, get: () => set.size ? [...set] : null, lock: () => opts.forEach(b => b.disabled = true), mark: r => opts.forEach((b, i) => { if (set.has(i)) b.classList.add(r.ok ? 'good' : 'bad'); }), reset: () => { set.clear(); opts.forEach(b => b.classList.remove('sel', 'bad', 'good')); } };
    } else if (T === 'input') {
      const i = h('input', { class: 'inp', placeholder: 'Escribe tu respuesta', autocomplete: 'off', autocapitalize: 'off', enterkeyhint: 'done' }); el.append(i);
      api = { el, get: () => i.value.trim() ? i.value : null, lock: () => i.disabled = true, mark: r => i.classList.add(r.ok ? 'good' : 'bad'), reset: () => { i.value = ''; i.classList.remove('bad', 'good'); i.focus(); }, input: i };
    } else if (T === 'order') {
      let ord = Grader.shuffleIdx(ex.items.length, U.hash(ex.q)); if (ord.every((v, k) => v === k)) ord.reverse();
      const list = h('div', { class: 'order' }); const draw = () => { list.innerHTML = ''; ord.forEach((v, k) => list.append(h('div', { class: 'ord-item' }, h('span', { class: 'ord-n' }, k + 1), h('span', { class: 'ord-t', html: md(ex.items[v]) }), h('span', { class: 'ord-btns' }, h('button', { class: 'mini', 'aria-label': 'Subir', disabled: k === 0, onclick: () => { [ord[k - 1], ord[k]] = [ord[k], ord[k - 1]]; draw(); FX.play('tap'); } }, '▲'), h('button', { class: 'mini', 'aria-label': 'Bajar', disabled: k === ord.length - 1, onclick: () => { [ord[k + 1], ord[k]] = [ord[k], ord[k + 1]]; draw(); FX.play('tap'); } }, '▼'))))); }; draw(); el.append(h('p', { class: 'muted small' }, 'Usa las flechas para poner los pasos en orden.'), list);
      api = { el, get: () => [...ord], lock: () => list.querySelectorAll('button').forEach(b => b.disabled = true), mark: r => list.classList.add(r.ok ? 'good' : 'bad'), reset: () => list.classList.remove('bad', 'good') };
    } else if (T === 'fill') {
      const parts = ex.template.split('___'); const fields = []; const pre = h('pre', { class: 'code fill' });
      parts.forEach((p, k) => { pre.append(p); if (k < ex.blanks.length) { const b = ex.blanks[k]; let f; if (b.options) { f = h('select', { class: 'blank' }, h('option', { value: '' }, '…'), b.options.map(o => h('option', { value: o }, o))); } else { f = h('input', { class: 'blank', size: Math.max(4, Math.max(...b.answers.map(a => a.length)) + 1), autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' }); } fields.push(f); pre.append(f); } }); el.append(pre);
      api = { el, get: () => fields.every(f => !f.value.trim()) ? null : fields.map(f => f.value), lock: () => fields.forEach(f => f.disabled = true), mark: r => fields.forEach((f, k) => f.classList.add(r.perBlank ? (r.perBlank[k] ? 'good' : 'bad') : (r.ok ? 'good' : 'bad'))), reset: () => fields.forEach(f => f.classList.remove('good', 'bad')) };
    } else if (T === 'match') {
      const n = ex.pairs.length, rights = Grader.shuffleIdx(n, U.hash(ex.q) + 7); const sels = ex.pairs.map(() => h('select', { class: 'blank wide' }, h('option', { value: '' }, 'Elige…'), rights.map(j => h('option', { value: j }, ex.pairs[j][1]))));
      el.append(h('div', { class: 'match' }, ex.pairs.map((p, i) => h('div', { class: 'match-row' }, h('div', { class: 'match-l', html: md(p[0]) }), sels[i]))));
      api = { el, get: () => sels.some(s => s.value === '') ? null : sels.map(s => +s.value), lock: () => sels.forEach(s => s.disabled = true), mark: r => sels.forEach((s, i) => s.classList.add(r.perPair ? (r.perPair[i] ? 'good' : 'bad') : (r.ok ? 'good' : 'bad'))), reset: () => sels.forEach(s => s.classList.remove('good', 'bad')) };
    } else if (T === 'bug') {
      let sel = -1; const lines = ex.code.split('\n').map((t, i) => h('button', { class: 'bugline', onclick: () => { sel = i + 1; lines.forEach((b, j) => b.classList.toggle('sel', j === i)); FX.play('tap'); } }, h('span', { class: 'ln' }, i + 1), h('code', null, t || ' '))); el.append(h('div', { class: 'bug' }, lines));
      api = { el, get: () => sel < 0 ? null : sel, lock: () => lines.forEach(b => b.disabled = true), mark: r => { sel > 0 && lines[sel - 1].classList.add(r.ok ? 'good' : 'bad'); }, reset: () => lines.forEach(b => b.classList.remove('sel', 'bad', 'good')) };
    } else if (T === 'code') {
      if (ex.db) Object.keys(ex.db).forEach(k => el.append(h('p', { class: 'muted small tname' }, 'Tabla ' + k), tableEl(ex.db[k].cols, ex.db[k].rows)));
      const ed = editor(ex.starter || '', { rows: 6 }); const out = h('div', { class: 'out empty' }, h('span', { class: 'muted small' }, 'Aquí verás el resultado de ▶ Ejecutar'));
      const inp = h('input', { class: 'inp small', placeholder: 'Entradas para input(), separadas por coma (opcional)' });
      const canRun = ['python', 'js', 'html', 'css', 'sql'].includes(ex.lang);
      el.append(h('div', { class: 'cb-head' }, ({ python: 'Python', js: 'JavaScript', html: 'HTML', css: 'CSS', sql: 'SQL', pseudo: 'Pseudocódigo' })[ex.lang]), ed);
      if ((ex.lang === 'python' && /input\(/.test(ex.solution)) || (ex.lang === 'js' && /prompt\(/.test(ex.solution))) el.append(inp);
      if (canRun) el.append(h('div', { class: 'row' }, h('button', { class: 'btn small ghost', onclick: () => runInto(ex.lang, ed.value, inp.value.split(',').map(s => s.trim()).join('\n'), out, ex) }, '▶ Ejecutar')), out);
      const res = h('div', { class: 'code-res' }); el.append(res);
      api = { el, get: () => ed.value.trim() ? ed.value : null, lock: () => ed.disabled = true, mark: r => { res.innerHTML = ''; res.append(codeFeedback(ex, r)); ed.classList.add(r.ok ? 'good' : 'bad'); }, reset: () => { ed.classList.remove('good', 'bad'); ed.disabled = false; }, isCode: true };
    }
    return api;
  }
  function codeFeedback(ex, r) {
    const box = h('div', { class: 'cfb' }); (r.failedChecks || []).forEach(m => box.append(h('div', { class: 'cf-line' }, '⚠️ ' + m))); (r.domFails || []).forEach(m => box.append(h('div', { class: 'cf-line' }, '⚠️ ' + m)));
    if (r.error && !r.sql) box.append(errBox(r.error)); if (r.sql && r.sql.error) box.append(h('div', { class: 'out-err' }, '❌ ' + r.sql.error));
    if (r.sql && !r.sql.error && !r.ok && r.sql.cols) { box.append(h('p', { class: 'small' }, 'Tu consulta devolvió esto, pero no es lo que pide el ejercicio:'), tableEl(r.sql.cols, r.sql.rows)); }
    const tests = (r.tests || []); if (tests.length) { const bad = tests.filter(t => !t.ok); const t0 = bad.find(t => !t.hidden) || bad[0];
      box.append(h('div', { class: 'small' }, `Pruebas superadas: ${tests.length - bad.length} de ${tests.length}`)); if (t0 && !t0.hidden) box.append(h('div', { class: 'test-bad' }, t0.inputs.length ? h('div', null, h('b', null, 'Con las entradas: '), t0.inputs.join(' , ')) : null, h('div', null, h('b', null, 'Se esperaba: '), h('pre', { class: 'out-pre' }, t0.expected || '—')), h('div', null, h('b', null, 'Tu programa mostró: '), h('pre', { class: 'out-pre' }, t0.got || '(nada)')))); else if (t0) box.append(h('div', { class: 'test-bad' }, 'Falla una prueba oculta: revisa los casos extremos (por ejemplo 0 o valores iguales).')); }
    return box;
  }
  /* ===== calificación ===== */
  async function grade(ex, ans) {
    if (ex.type === 'code') {
      const r = await Grader.gradeCode(ex, ans, ctx);
      if (!r.ok && ex.common) { for (const c of ex.common) { if (new RegExp(c.re, 'i').test(ans)) { r.wrongMsg = c.msg; break; } } }
      return r;
    }
    return Grader.gradeStatic(ex, ans);
  }
  function solutionEl(ex) {
    const T = ex.type; let body;
    if (T === 'mcq') body = h('div', { html: md(ex.options[ex.answer]) }); else if (T === 'tf') body = h('div', null, ex.answer ? 'Verdadero' : 'Falso');
    else if (T === 'multi') body = h('div', { html: ex.answers.map(i => md(ex.options[i])).join('<br>') }); else if (T === 'input') body = h('div', null, ex.answers[0]);
    else if (T === 'order') body = h('ol', null, ex.items.map(t => h('li', { html: md(t) }))); else if (T === 'fill') body = h('div', null, ex.blanks.map(b => b.answers[0]).join('  ·  '));
    else if (T === 'match') body = h('div', null, ex.pairs.map(p => h('div', null, p[0] + ' → ' + p[1]))); else if (T === 'bug') body = h('div', null, 'La línea ' + ex.bugLine + ': ' + ex.code.split('\n')[ex.bugLine - 1]);
    else body = h('pre', { class: 'code' }, ex.solution);
    return h('div', { class: 'solution' }, h('b', null, '👀 Una forma correcta:'), body);
  }
  window.EX = { build, grade, solutionEl, codeBlock, editor, runInto, tableEl, errBox, ctx };
})();
