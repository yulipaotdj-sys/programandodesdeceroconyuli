/* Ejecutores de JavaScript (Worker en el navegador, vm en Node) */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.Runners = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const WORKER_SRC = `
  self.onmessage = (ev) => {
    const { code, inputs } = ev.data; const out = []; const q = (inputs || []).slice();
    const fmt = (v) => { if (typeof v === 'string') return v; if (v === undefined) return 'undefined'; if (typeof v === 'function') return String(v); try { return typeof v === 'object' ? JSON.stringify(v) : String(v); } catch (e) { return String(v); } };
    const console_ = { log: (...a) => out.push(a.map(fmt).join(' ')), error: (...a) => out.push(a.map(fmt).join(' ')), warn: (...a) => out.push(a.map(fmt).join(' ')) };
    let error = null;
    try { new Function('console', 'prompt', 'alert', '"use strict";\\n' + code)(console_, () => (q.length ? q.shift() : null), (m) => out.push(String(m))); }
    catch (e) { error = { type: e.name, message: e.message, friendly: friendly(e.name) }; }
    function friendly(n) { return ({ ReferenceError: 'Usaste un nombre que no existe. Revisa que la variable esté declarada y bien escrita.', SyntaxError: 'JavaScript no entendió esa línea. Revisa llaves { }, paréntesis ( ) y comillas.', TypeError: 'Intentaste usar un valor de una forma que no permite (por ejemplo, llamar algo que no es una función).' })[n] || ''; }
    self.postMessage({ output: out.join('\\n'), error });
  };`;
  function runJS(code, inputs, timeout) {
    timeout = timeout || 2500;
    if (typeof Worker === 'undefined') {
      // Node
      const vm = require('vm'); const out = []; let error = null; const q = (inputs || []).slice();
      const fmt = v => typeof v === 'string' ? v : (v === undefined ? 'undefined' : (typeof v === 'object' ? JSON.stringify(v) : String(v)));
      try { vm.runInNewContext('"use strict";\n' + code, { console: { log: (...a) => out.push(a.map(fmt).join(' ')) }, prompt: () => q.length ? q.shift() : null }, { timeout }); }
      catch (e) { error = { type: e.name, message: e.message, friendly: '' }; }
      return Promise.resolve({ output: out.join('\n'), error });
    }
    return new Promise(resolve => {
      const blob = new Blob([WORKER_SRC], { type: 'text/javascript' }); const url = URL.createObjectURL(blob);
      const w = new Worker(url); let done = false;
      const finish = (r) => { if (done) return; done = true; clearTimeout(tm); w.terminate(); URL.revokeObjectURL(url); resolve(r); };
      const tm = setTimeout(() => finish({ output: '', error: { type: 'TimeoutError', message: 'El programa tardó demasiado (¿ciclo infinito?).', friendly: 'Revisa que tus ciclos terminen.' } }), timeout);
      w.onmessage = e => finish(e.data); w.onerror = e => finish({ output: '', error: { type: 'Error', message: e.message || 'Error', friendly: '' } });
      w.postMessage({ code, inputs });
    });
  }
  return { runJS };
});
