/* PyRun — mini intérprete de Python (subconjunto) para ejecutar ejercicios dentro de la app.
   Funciona en el navegador (window.PyRun) y en Node (module.exports) para validar el contenido.
   Soporta: variables, int/float/str/bool/None, listas, tuplas, diccionarios, f-strings, if/elif/else,
   for/while/break/continue, def/return/lambda, try/except, comprensiones de listas, módulos math y random. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PyRun = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ───────────── Tipos ───────────── */
  class PyFloat { constructor(v) { this.v = v; } }
  class PyTuple { constructor(items) { this.items = items; } }
  class PyRange {
    constructor(a, b, c) { this.start = a; this.stop = b; this.step = c; }
    len() { const { start, stop, step } = this; return step > 0 ? Math.max(0, Math.ceil((stop - start) / step)) : Math.max(0, Math.ceil((start - stop) / -step)); }
    at(i) { return this.start + i * this.step; }
  }
  class PyDict {
    constructor() { this.m = new Map(); }
    get size() { return this.m.size; }
    set(k, v) { this.m.set(keyOf(k), [k, v]); }
    has(k) { return this.m.has(keyOf(k)); }
    get(k) { const e = this.m.get(keyOf(k)); return e ? e[1] : undefined; }
    del(k) { return this.m.delete(keyOf(k)); }
    keys() { return [...this.m.values()].map(e => e[0]); }
    values() { return [...this.m.values()].map(e => e[1]); }
    entries() { return [...this.m.values()]; }
  }
  class PyFunc { constructor(name, params, body, scope, expr) { this.name = name; this.params = params; this.body = body; this.scope = scope; this.expr = expr; } }
  class PyBuiltin { constructor(name, fn, isType) { this.name = name; this.fn = fn; this.isType = !!isType; } }
  class PyModule { constructor(name, attrs) { this.name = name; this.attrs = attrs; } }
  class BoundMethod { constructor(obj, name) { this.obj = obj; this.name = name; } }
  class PyError extends Error {
    constructor(type, msg, line) { super(msg); this.pyType = type; this.pyMsg = msg; this.line = line; }
  }
  class BreakSig { } class ContinueSig { }
  class ReturnSig { constructor(v) { this.v = v; } }

  const err = (t, m, l) => new PyError(t, m, l);
  const isInt = v => typeof v === 'number' || typeof v === 'bigint';
  const norm = b => (b >= -9007199254740991n && b <= 9007199254740991n) ? Number(b) : b;
  const toF = v => v instanceof PyFloat ? v.v : (typeof v === 'boolean' ? (v ? 1 : 0) : Number(v));

  function keyOf(k) {
    if (typeof k === 'string') return 's' + k;
    if (typeof k === 'number' || typeof k === 'bigint') return 'n' + k;
    if (typeof k === 'boolean') return 'n' + (k ? 1 : 0);
    if (k instanceof PyFloat) return Number.isInteger(k.v) ? 'n' + k.v : 'f' + k.v;
    if (k === null) return 'N';
    if (k instanceof PyTuple) return 't(' + k.items.map(keyOf).join(',') + ')';
    throw err('TypeError', "unhashable type: '" + typeName(k) + "'");
  }

  function typeName(v) {
    if (v === null || v === undefined) return 'NoneType';
    if (typeof v === 'boolean') return 'bool';
    if (isInt(v)) return 'int';
    if (v instanceof PyFloat) return 'float';
    if (typeof v === 'string') return 'str';
    if (Array.isArray(v)) return 'list';
    if (v instanceof PyTuple) return 'tuple';
    if (v instanceof PyDict) return 'dict';
    if (v instanceof PyRange) return 'range';
    if (v instanceof PyFunc || v instanceof PyBuiltin || v instanceof BoundMethod) return 'function';
    if (v instanceof PyModule) return 'module';
    return 'object';
  }

  /* ───────────── Texto: str / repr / formato ───────────── */
  function fmtFloat(x) {
    if (Number.isNaN(x)) return 'nan';
    if (!isFinite(x)) return x > 0 ? 'inf' : '-inf';
    const a = Math.abs(x);
    if (a >= 1e16 || (a < 1e-4 && a > 0)) {
      let s = x.toExponential();
      return s.replace(/e([+-])(\d)$/, 'e$10$2');
    }
    if (Number.isInteger(x)) return (Object.is(x, -0) ? '-0' : String(x)) + '.0';
    return String(x);
  }
  function reprStr(s) {
    const q = (s.includes("'") && !s.includes('"')) ? '"' : "'";
    let o = '';
    for (const ch of s) {
      if (ch === '\\') o += '\\\\'; else if (ch === q) o += '\\' + q; else if (ch === '\n') o += '\\n';
      else if (ch === '\t') o += '\\t'; else if (ch === '\r') o += '\\r'; else o += ch;
    }
    return q + o + q;
  }
  function repr(v) {
    if (typeof v === 'string') return reprStr(v);
    if (Array.isArray(v)) return '[' + v.map(repr).join(', ') + ']';
    if (v instanceof PyTuple) return '(' + v.items.map(repr).join(', ') + (v.items.length === 1 ? ',' : '') + ')';
    if (v instanceof PyDict) return '{' + v.entries().map(e => repr(e[0]) + ': ' + repr(e[1])).join(', ') + '}';
    return str(v);
  }
  function str(v) {
    if (v === null || v === undefined) return 'None';
    if (typeof v === 'boolean') return v ? 'True' : 'False';
    if (typeof v === 'number' || typeof v === 'bigint') return String(v);
    if (v instanceof PyFloat) return fmtFloat(v.v);
    if (typeof v === 'string') return v;
    if (Array.isArray(v) || v instanceof PyTuple || v instanceof PyDict) return repr(v);
    if (v instanceof PyRange) return 'range(' + v.start + ', ' + v.stop + (v.step !== 1 ? ', ' + v.step : '') + ')';
    if (v instanceof PyBuiltin) return v.isType ? "<class '" + v.name + "'>" : '<built-in function ' + v.name + '>';
    if (v instanceof PyFunc) return '<function ' + v.name + '>';
    if (v instanceof PyModule) return "<module '" + v.name + "'>";
    if (v instanceof PyError) return v.pyMsg;
    return String(v);
  }
  function group(intStr, sep) { return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, sep); }
  function formatValue(v, spec) {
    if (!spec) return str(v);
    const m = /^(?:(.)?([<>^=]))?([+\- ])?(#)?(0)?(\d+)?([,_])?(?:\.(\d+))?([bdeEfFgGnosxX%])?$/su.exec(spec);
    if (!m) throw err('ValueError', 'Invalid format specifier');
    let [, fill, align, sign, , zero, width, thou, prec, type] = m;
    const isNum = isInt(v) || v instanceof PyFloat || typeof v === 'boolean';
    let body;
    if (typeof v === 'string') {
      if (type && type !== 's') throw err('ValueError', "Unknown format code '" + type + "' for object of type 'str'");
      body = prec !== undefined ? v.slice(0, +prec) : v;
    } else if (isNum) {
      let x = typeof v === 'boolean' ? (v ? 1 : 0) : v;
      const isF = x instanceof PyFloat;
      if (!type) type = isF ? (prec !== undefined ? 'g' : '') : 'd';
      if (type === 'd' && isF) throw err('ValueError', "Unknown format code 'd' for object of type 'float'");
      const num = toF(x);
      let s;
      const p = prec === undefined ? 6 : +prec;
      switch (type) {
        case 'd': s = (typeof x === 'bigint' ? (x < 0n ? -x : x) : Math.abs(x)).toString(); break;
        case 'f': case 'F': s = Math.abs(num).toFixed(p); break;
        case 'e': case 'E': s = Math.abs(num).toExponential(p).replace(/e([+-])(\d)$/, 'e$10$2'); if (type === 'E') s = s.toUpperCase(); break;
        case '%': s = (Math.abs(num) * 100).toFixed(prec === undefined ? 6 : +prec) + '%'; break;
        case 'x': s = Math.abs(Number(x)).toString(16); break;
        case 'X': s = Math.abs(Number(x)).toString(16).toUpperCase(); break;
        case 'b': s = Math.abs(Number(x)).toString(2); break;
        case 'o': s = Math.abs(Number(x)).toString(8); break;
        case 'g': case 'G': s = String(parseFloat(Math.abs(num).toPrecision(p || 1))); break;
        default: s = fmtFloat(Math.abs(num)); break;
      }
      if (thou) { const parts = s.split('.'); parts[0] = group(parts[0], thou); s = parts.join('.'); }
      const neg = (typeof x === 'bigint' ? x < 0n : num < 0) || Object.is(num, -0) && false;
      const sg = neg ? '-' : (sign === '+' ? '+' : (sign === ' ' ? ' ' : ''));
      if (zero && !align) { fill = '0'; align = '='; }
      body = s;
      if (align === '=') {
        const w = width ? +width : 0; const padLen = Math.max(0, w - sg.length - s.length);
        return sg + (fill || ' ').repeat(padLen) + s;
      }
      body = sg + s;
    } else {
      body = str(v);
      if (type && type !== 's') throw err('ValueError', 'Invalid format specifier');
    }
    const w = width ? +width : 0;
    const f = fill || ' ';
    const al = align || (isNum ? '>' : '<');
    const pad = Math.max(0, w - [...body].length);
    if (!pad) return body;
    if (al === '<') return body + f.repeat(pad);
    if (al === '>') return f.repeat(pad) + body;
    const l = Math.floor(pad / 2); return f.repeat(l) + body + f.repeat(pad - l);
  }

  /* ───────────── Aritmética y comparaciones ───────────── */
  function typeErrBin(op, a, b) {
    if (op === '+' && typeof a === 'string') return err('TypeError', 'can only concatenate str (not "' + typeName(b) + '") to str');
    return err('TypeError', "unsupported operand type(s) for " + op + ": '" + typeName(a) + "' and '" + typeName(b) + "'");
  }
  function arith(op, a, b) {
    if (typeof a === 'boolean') a = a ? 1 : 0;
    if (typeof b === 'boolean') b = b ? 1 : 0;
    if (op === '+') {
      if (typeof a === 'string' && typeof b === 'string') return a + b;
      if (Array.isArray(a) && Array.isArray(b)) return a.concat(b);
      if (a instanceof PyTuple && b instanceof PyTuple) return new PyTuple(a.items.concat(b.items));
    }
    if (op === '*') {
      if (typeof a === 'string' && isInt(b)) return b > 0 ? a.repeat(Number(b)) : '';
      if (isInt(a) && typeof b === 'string') return a > 0 ? b.repeat(Number(a)) : '';
      if (Array.isArray(a) && isInt(b)) { let r = []; for (let i = 0; i < b; i++) r = r.concat(a); return r; }
      if (isInt(a) && Array.isArray(b)) { let r = []; for (let i = 0; i < a; i++) r = r.concat(b); return r; }
    }
    if (op === '%' && typeof a === 'string') return percentFormat(a, b);
    const ai = isInt(a), bi = isInt(b), af = a instanceof PyFloat, bf = b instanceof PyFloat;
    if (!((ai || af) && (bi || bf))) throw typeErrBin(op, a, b);
    if (op === '/') { const y = toF(b); if (y === 0) throw err('ZeroDivisionError', 'division by zero'); return new PyFloat(toF(a) / y); }
    if (ai && bi) {
      const small = typeof a === 'number' && typeof b === 'number';
      switch (op) {
        case '+': { if (small) { const r = a + b; if (Number.isSafeInteger(r)) return r; } return norm(BigInt(a) + BigInt(b)); }
        case '-': { if (small) { const r = a - b; if (Number.isSafeInteger(r)) return r; } return norm(BigInt(a) - BigInt(b)); }
        case '*': { if (small) { const r = a * b; if (Number.isSafeInteger(r)) return r; } return norm(BigInt(a) * BigInt(b)); }
        case '//': case '%': {
          if (b == 0) throw err('ZeroDivisionError', op === '//' ? 'integer division or modulo by zero' : 'integer modulo by zero');
          if (small) {
            let r = a % b; if (r !== 0 && (r < 0) !== (b < 0)) r += b;
            return op === '%' ? r : (a - r) / b;
          }
          const A = BigInt(a), B = BigInt(b); let r = A % B; if (r !== 0n && (r < 0n) !== (B < 0n)) r += B;
          return norm(op === '%' ? r : (A - r) / B);
        }
        case '**': {
          if (b < 0) return new PyFloat(Math.pow(Number(a), Number(b)));
          if (b > 100000) throw err('OverflowError', 'exponente demasiado grande');
          return norm(BigInt(a) ** BigInt(b));
        }
      }
    }
    const x = toF(a), y = toF(b);
    switch (op) {
      case '+': return new PyFloat(x + y);
      case '-': return new PyFloat(x - y);
      case '*': return new PyFloat(x * y);
      case '//': if (y === 0) throw err('ZeroDivisionError', 'float floor division by zero'); return new PyFloat(Math.floor(x / y));
      case '%': { if (y === 0) throw err('ZeroDivisionError', 'float modulo'); let r = x % y; if (r !== 0 && (r < 0) !== (y < 0)) r += y; return new PyFloat(r); }
      case '**': return new PyFloat(Math.pow(x, y));
    }
    throw err('TypeError', 'operador no soportado ' + op);
  }
  function percentFormat(fmt, arg) {
    const args = arg instanceof PyTuple ? arg.items.slice() : [arg];
    return fmt.replace(/%([-+ 0#]*)(\d+)?(?:\.(\d+))?([sdifrx%])/g, (m, flags, w, p, t) => {
      if (t === '%') return '%';
      if (!args.length) throw err('TypeError', 'not enough arguments for format string');
      const v = args.shift(); let s;
      if (t === 's') s = str(v); else if (t === 'r') s = repr(v);
      else if (t === 'd' || t === 'i') s = String(Math.trunc(toF(v)));
      else if (t === 'f') s = toF(v).toFixed(p === undefined ? 6 : +p);
      else s = Math.trunc(toF(v)).toString(16);
      if (w) { const n = +w; s = flags.includes('-') ? s.padEnd(n) : (flags.includes('0') && t !== 's' ? s.padStart(n, '0') : s.padStart(n)); }
      return s;
    });
  }
  function eq(a, b) {
    if (typeof a === 'boolean') a = a ? 1 : 0;
    if (typeof b === 'boolean') b = b ? 1 : 0;
    if ((isInt(a) || a instanceof PyFloat) && (isInt(b) || b instanceof PyFloat)) {
      if (typeof a === 'bigint' || typeof b === 'bigint') return (a instanceof PyFloat || b instanceof PyFloat) ? toF(a) === toF(b) : BigInt(a) === BigInt(b);
      return toF(a) === toF(b);
    }
    if (a === b) return true;
    if (a === null || b === null || a === undefined || b === undefined) return false;
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => eq(x, b[i]));
    if (a instanceof PyTuple && b instanceof PyTuple) return a.items.length === b.items.length && a.items.every((x, i) => eq(x, b.items[i]));
    if (a instanceof PyDict && b instanceof PyDict) return a.size === b.size && a.entries().every(([k, v]) => b.has(k) && eq(v, b.get(k)));
    return false;
  }
  function cmp(a, b, opSym) {
    if (typeof a === 'boolean') a = a ? 1 : 0;
    if (typeof b === 'boolean') b = b ? 1 : 0;
    const an = isInt(a) || a instanceof PyFloat, bn = isInt(b) || b instanceof PyFloat;
    if (an && bn) {
      if (typeof a === 'bigint' || typeof b === 'bigint') { const x = typeof a === 'bigint' ? a : (a instanceof PyFloat ? a.v : BigInt(a)); const y = typeof b === 'bigint' ? b : (b instanceof PyFloat ? b.v : BigInt(b)); return x < y ? -1 : (x > y ? 1 : 0); }
      const x = toF(a), y = toF(b); return x < y ? -1 : (x > y ? 1 : 0);
    }
    if (typeof a === 'string' && typeof b === 'string') return a < b ? -1 : (a > b ? 1 : 0);
    const sa = Array.isArray(a) ? a : (a instanceof PyTuple ? a.items : null);
    const sb = Array.isArray(b) ? b : (b instanceof PyTuple ? b.items : null);
    if (sa && sb && Array.isArray(a) === Array.isArray(b)) {
      for (let i = 0; i < Math.min(sa.length, sb.length); i++) { if (!eq(sa[i], sb[i])) return cmp(sa[i], sb[i], opSym); }
      return sa.length < sb.length ? -1 : (sa.length > sb.length ? 1 : 0);
    }
    throw err('TypeError', "'" + (opSym || '<') + "' not supported between instances of '" + typeName(a) + "' and '" + typeName(b) + "'");
  }
  function truthy(v) {
    if (v === null || v === undefined) return false;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'bigint') return v !== 0n;
    if (v instanceof PyFloat) return v.v !== 0;
    if (typeof v === 'string') return v.length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (v instanceof PyTuple) return v.items.length > 0;
    if (v instanceof PyDict) return v.size > 0;
    if (v instanceof PyRange) return v.len() > 0;
    return true;
  }

  /* ───────────── Tokenizador ───────────── */
  const KEYWORDS = new Set(['False', 'None', 'True', 'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']);
  const ESC = { n: '\n', t: '\t', r: '\r', '\\': '\\', "'": "'", '"': '"', '0': '\0', a: '\x07', b: '\b' };
  function unescape(s) {
    return s.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|\n|.)/gs, (m, c) => {
      if (c === '\n') return '';
      if (c[0] === 'u' && c.length === 5) return String.fromCharCode(parseInt(c.slice(1), 16));
      if (c[0] === 'x' && c.length === 3) return String.fromCharCode(parseInt(c.slice(1), 16));
      return ESC[c] !== undefined ? ESC[c] : m;
    });
  }
  function parseFString(raw, isRaw, line) {
    const parts = []; let lit = ''; let i = 0; const n = raw.length;
    const flush = () => { if (lit) { parts.push({ lit: isRaw ? lit : unescape(lit) }); lit = ''; } };
    while (i < n) {
      const c = raw[i];
      if (c === '{') {
        if (raw[i + 1] === '{') { lit += '{'; i += 2; continue; }
        flush();
        let depth = 0, j = i + 1, q = null, exprEnd = -1, specStart = -1, conv = null;
        for (; j < n; j++) {
          const d = raw[j];
          if (q) { if (d === q) q = null; continue; }
          if (d === '"' || d === "'") { q = d; continue; }
          if ('([{'.includes(d)) depth++;
          else if (')]'.includes(d)) depth--;
          else if (d === '}') { if (depth === 0) { if (exprEnd < 0) exprEnd = j; break; } depth--; }
          else if (depth === 0 && exprEnd < 0 && d === '!' && raw[j + 1] !== '=') { exprEnd = j; conv = raw[j + 1]; j++; }
          else if (depth === 0 && exprEnd < 0 && d === ':') { exprEnd = j; specStart = j + 1; }
          else if (depth === 0 && exprEnd >= 0 && specStart < 0 && d === ':') { specStart = j + 1; }
        }
        if (j >= n) throw err('SyntaxError', "f-string: falta '}'", line);
        const expr = raw.slice(i + 1, exprEnd);
        let spec = null;
        if (specStart >= 0) {
          // el spec llega hasta el '}' que cierra (soporta {} anidadas)
          let k = specStart, dd = 0; for (; k < n; k++) { if (raw[k] === '{') dd++; else if (raw[k] === '}') { if (dd === 0) break; dd--; } }
          spec = parseFString(raw.slice(specStart, k), true, line); j = k;
        }
        parts.push({ expr: expr.trim(), conv, spec, line });
        i = j + 1;
      } else if (c === '}') { if (raw[i + 1] === '}') { lit += '}'; i += 2; continue; } throw err('SyntaxError', "f-string: '}' suelta", line); }
      else { lit += c; i++; }
    }
    flush(); return parts;
  }
  function tokenize(src) {
    src = src.replace(/\r\n?/g, '\n');
    const toks = []; const indents = [0]; let depth = 0, atStart = true, i = 0, line = 1; const n = src.length;
    const OPS3 = ['**=', '//=', '>>=', '<<='], OPS2 = ['**', '//', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '->', ':=', '<<', '>>'];
    while (i < n) {
      if (atStart && depth === 0) {
        let col = 0, j = i;
        while (j < n && (src[j] === ' ' || src[j] === '\t')) { col += src[j] === '\t' ? 4 : 1; j++; }
        if (j >= n) { i = j; break; }
        if (src[j] === '\n') { i = j + 1; line++; continue; }
        if (src[j] === '#') { while (j < n && src[j] !== '\n') j++; i = j; continue; }
        i = j;
        if (col > indents[indents.length - 1]) { indents.push(col); toks.push({ t: 'INDENT', line }); }
        else {
          while (col < indents[indents.length - 1]) { indents.pop(); toks.push({ t: 'DEDENT', line }); }
          if (col !== indents[indents.length - 1]) throw err('IndentationError', 'unindent does not match any outer indentation level', line);
        }
        atStart = false;
      }
      const c = src[i];
      if (c === ' ' || c === '\t') { i++; continue; }
      if (c === '#') { while (i < n && src[i] !== '\n') i++; continue; }
      if (c === '\\' && src[i + 1] === '\n') { i += 2; line++; continue; }
      if (c === '\n') { i++; if (depth > 0) { line++; continue; } toks.push({ t: 'NEWLINE', line }); line++; atStart = true; continue; }
      // strings (con prefijo)
      const pm = /^([fFrRbBuU]{1,2})?(['"])/.exec(src.slice(i, i + 3));
      if (pm && (pm[1] || true) && /^[fFrRbBuU]{0,2}['"]/.test(src.slice(i, i + 3))) {
        const prefix = (pm[1] || '').toLowerCase(); const qch = pm[2]; i += (pm[1] || '').length;
        const triple = src.substr(i, 3) === qch + qch + qch; i += triple ? 3 : 1;
        let raw = '', startLine = line;
        for (; ;) {
          if (i >= n) throw err('SyntaxError', 'EOL while scanning string literal', startLine);
          const d = src[i];
          if (d === '\\') { raw += d + (src[i + 1] || ''); if (src[i + 1] === '\n') line++; i += 2; continue; }
          if (triple ? src.substr(i, 3) === qch + qch + qch : d === qch) { i += triple ? 3 : 1; break; }
          if (d === '\n') { if (!triple) throw err('SyntaxError', 'EOL while scanning string literal', line); line++; }
          raw += d; i++;
        }
        if (prefix.includes('f')) toks.push({ t: 'FSTR', parts: parseFString(raw, prefix.includes('r'), startLine), line: startLine });
        else toks.push({ t: 'STR', v: prefix.includes('r') ? raw : unescape(raw), line: startLine });
        continue;
      }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
        const m = /^(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(\d[\d_]*\.?[\d_]*|\.\d[\d_]*)([eE][+-]?\d+)?)/.exec(src.slice(i));
        let txt = m[0]; i += txt.length; const clean = txt.replace(/_/g, '');
        if (/^0[xXbBoO]/.test(clean)) toks.push({ t: 'NUM', v: norm(BigInt(clean)), line });
        else if (/[.eE]/.test(clean)) toks.push({ t: 'NUM', v: new PyFloat(parseFloat(clean)), line });
        else { const b = BigInt(clean); toks.push({ t: 'NUM', v: norm(b), line }); }
        continue;
      }
      const nm = /^[\p{L}_][\p{L}\p{N}_]*/u.exec(src.slice(i, i + 80));
      if (nm) { toks.push({ t: 'NAME', v: nm[0], line }); i += nm[0].length; continue; }
      const s3 = src.substr(i, 3), s2 = src.substr(i, 2);
      if (OPS3.includes(s3)) { toks.push({ t: 'OP', v: s3, line }); i += 3; continue; }
      if (OPS2.includes(s2)) { toks.push({ t: 'OP', v: s2, line }); i += 2; continue; }
      if ('+-*/%<>=()[]{},:.;@&|^~'.includes(c)) {
        if ('([{'.includes(c)) depth++; else if (')]}'.includes(c)) depth = Math.max(0, depth - 1);
        toks.push({ t: 'OP', v: c, line }); i++; continue;
      }
      throw err('SyntaxError', "caracter no válido: '" + c + "'", line);
    }
    if (toks.length && toks[toks.length - 1].t !== 'NEWLINE') toks.push({ t: 'NEWLINE', line });
    while (indents.length > 1) { indents.pop(); toks.push({ t: 'DEDENT', line }); }
    toks.push({ t: 'EOF', line });
    return toks;
  }

  /* ───────────── Parser ───────────── */
  class Parser {
    constructor(toks) { this.toks = toks; this.p = 0; }
    peek(o = 0) { return this.toks[Math.min(this.p + o, this.toks.length - 1)]; }
    next() { return this.toks[this.p++]; }
    isOp(v, o = 0) { const t = this.peek(o); return t.t === 'OP' && t.v === v; }
    isKw(v, o = 0) { const t = this.peek(o); return t.t === 'NAME' && t.v === v; }
    eatOp(v) { if (this.isOp(v)) { this.p++; return true; } return false; }
    eatKw(v) { if (this.isKw(v)) { this.p++; return true; } return false; }
    expectOp(v) { if (!this.eatOp(v)) this.fail("se esperaba '" + v + "'"); }
    fail(msg) { let t = this.peek(); if (['INDENT', 'DEDENT', 'EOF'].includes(t.t) && this.p > 0) t = this.toks[this.p - 1]; throw err('SyntaxError', 'invalid syntax (' + msg + ')', t.line); }
    program() { const body = []; while (this.peek().t !== 'EOF') { if (this.peek().t === 'NEWLINE') { this.p++; continue; } body.push(...this.statement()); } return body; }
    block() {
      this.expectOp(':');
      if (this.peek().t === 'NEWLINE') {
        this.p++;
        if (this.peek().t !== 'INDENT') throw err('IndentationError', 'expected an indented block', this.peek().line);
        this.p++; const body = [];
        while (this.peek().t !== 'DEDENT' && this.peek().t !== 'EOF') { if (this.peek().t === 'NEWLINE') { this.p++; continue; } body.push(...this.statement()); }
        if (this.peek().t === 'DEDENT') this.p++;
        return body;
      }
      return this.simpleLine();
    }
    statement() {
      const t = this.peek(); const line = t.line;
      if (t.t === 'INDENT') throw err('IndentationError', 'unexpected indent', line);
      if (t.t === 'NAME') {
        switch (t.v) {
          case 'if': { this.p++; const test = this.test(); const body = this.block(); const node = { k: 'If', test, body, orelse: [], line }; let cur = node;
            while (this.isKw('elif')) { const l2 = this.peek().line; this.p++; const t2 = this.test(); const b2 = this.block(); const n2 = { k: 'If', test: t2, body: b2, orelse: [], line: l2 }; cur.orelse = [n2]; cur = n2; }
            if (this.eatKw('else')) cur.orelse = this.block(); return [node]; }
          case 'while': { this.p++; const test = this.test(); const body = this.block(); let orelse = []; if (this.eatKw('else')) orelse = this.block(); return [{ k: 'While', test, body, orelse, line }]; }
          case 'for': { this.p++; const target = this.targetList(); if (!this.eatKw('in')) this.fail("falta 'in'"); const iter = this.exprList(); const body = this.block(); let orelse = []; if (this.eatKw('else')) orelse = this.block(); return [{ k: 'For', target, iter, body, orelse, line }]; }
          case 'def': return [this.funcDef()];
          case 'try': return [this.tryStmt()];
          case 'class': throw err('SyntaxError', 'Las clases (class) aún no están disponibles en este simulador.', line);
          case 'with': throw err('SyntaxError', 'with aún no está disponible en este simulador.', line);
        }
      }
      return this.simpleLine();
    }
    simpleLine() {
      const out = [this.simple()];
      while (this.eatOp(';')) { if (this.peek().t === 'NEWLINE') break; out.push(this.simple()); }
      if (this.peek().t === 'NEWLINE') this.p++; else if (this.peek().t !== 'EOF' && this.peek().t !== 'DEDENT') this.fail('texto inesperado "' + (this.peek().v ?? this.peek().t) + '"');
      return out;
    }
    simple() {
      const t = this.peek(); const line = t.line;
      if (t.t === 'NAME') {
        switch (t.v) {
          case 'pass': this.p++; return { k: 'Pass', line };
          case 'break': this.p++; return { k: 'Break', line };
          case 'continue': this.p++; return { k: 'Continue', line };
          case 'return': { this.p++; let v = null; if (!['NEWLINE', 'EOF', 'DEDENT'].includes(this.peek().t) && !this.isOp(';')) v = this.exprList(); return { k: 'Return', value: v, line }; }
          case 'global': case 'nonlocal': { this.p++; const names = [this.next().v]; while (this.eatOp(',')) names.push(this.next().v); return { k: 'Global', names, line }; }
          case 'import': { this.p++; const items = []; do { const name = this.next().v; let as = name; if (this.eatKw('as')) as = this.next().v; items.push([name, as]); } while (this.eatOp(',')); return { k: 'Import', items, line }; }
          case 'from': { this.p++; const mod = this.next().v; if (!this.eatKw('import')) this.fail("falta 'import'"); const items = []; if (this.eatOp('*')) items.push(['*', '*']); else do { const name = this.next().v; let as = name; if (this.eatKw('as')) as = this.next().v; items.push([name, as]); } while (this.eatOp(',')); return { k: 'FromImport', mod, items, line }; }
          case 'del': { this.p++; const targets = [this.postfix()]; while (this.eatOp(',')) targets.push(this.postfix()); return { k: 'Del', targets, line }; }
          case 'assert': { this.p++; const test = this.test(); let msg = null; if (this.eatOp(',')) msg = this.test(); return { k: 'Assert', test, msg, line }; }
          case 'raise': { this.p++; let ex = null; if (!['NEWLINE', 'EOF', 'DEDENT'].includes(this.peek().t)) ex = this.test(); return { k: 'Raise', exc: ex, line }; }
        }
      }
      const first = this.exprList();
      if (this.isOp('=')) {
        const targets = [first]; let value;
        while (this.eatOp('=')) { value = this.exprList(); if (this.isOp('=')) targets.push(value); }
        targets.forEach(tg => this.checkTarget(tg, line));
        return { k: 'Assign', targets, value, line };
      }
      const pt = this.peek();
      if (pt.t === 'OP' && ['+=', '-=', '*=', '/=', '//=', '%=', '**='].includes(pt.v)) {
        this.p++; const value = this.exprList(); this.checkTarget(first, line);
        return { k: 'AugAssign', target: first, op: pt.v.slice(0, -1), value, line };
      }
      return { k: 'Expr', value: first, line };
    }
    checkTarget(n, line) {
      if (n.k === 'Name' || n.k === 'Subscript') return;
      if ((n.k === 'Tuple' || n.k === 'List') && n.items) { n.items.forEach(x => this.checkTarget(x, line)); return; }
      throw err('SyntaxError', 'no se puede asignar a esa expresión', line);
    }
    targetList() {
      const line = this.peek().line; const items = [this.postfix()];
      while (this.eatOp(',')) { if (this.isKw('in')) break; items.push(this.postfix()); }
      const t = items.length === 1 ? items[0] : { k: 'Tuple', items, line }; this.checkTarget(t, line); return t;
    }
    funcDef() {
      const line = this.next().line; const name = this.next().v; this.expectOp('(');
      const params = this.params(')'); this.expectOp(')');
      if (this.eatOp('->')) this.test();
      const body = this.block(); return { k: 'Def', name, params, body, line };
    }
    params(end) {
      const params = [];
      while (!this.isOp(end)) {
        let star = false;
        if (this.eatOp('*')) star = true; else if (this.isOp('**')) throw err('SyntaxError', '**kwargs aún no está disponible', this.peek().line);
        const nameTok = this.next(); if (nameTok.t !== 'NAME') this.fail('nombre de parámetro');
        let def = null; if (end === ')' && this.eatOp(':')) this.test();
        if (this.eatOp('=')) def = this.test();
        params.push({ name: nameTok.v, def, star });
        if (!this.eatOp(',')) break;
      }
      return params;
    }
    tryStmt() {
      const line = this.next().line; const body = this.block(); const handlers = []; let orelse = [], fin = [];
      while (this.isKw('except')) {
        this.p++; let types = null, name = null;
        if (!this.isOp(':')) { types = this.test(); if (this.eatKw('as')) name = this.next().v; }
        handlers.push({ types, name, body: this.block() });
      }
      if (this.eatKw('else')) orelse = this.block();
      if (this.eatKw('finally')) fin = this.block();
      if (!handlers.length && !fin.length) this.fail("try necesita 'except' o 'finally'");
      return { k: 'Try', body, handlers, orelse, fin, line };
    }
    exprList() {
      const line = this.peek().line; const first = this.starTest();
      if (!this.isOp(',')) return first;
      const items = [first];
      while (this.eatOp(',')) { const t = this.peek(); if (t.t === 'NEWLINE' || t.t === 'EOF' || (t.t === 'OP' && [')', ']', '}', '=', ':'].includes(t.v))) break; items.push(this.starTest()); }
      return { k: 'Tuple', items, line };
    }
    starTest() { if (this.isOp('*')) { const line = this.next().line; return { k: 'Starred', value: this.test(), line }; } return this.test(); }
    test() {
      if (this.isKw('lambda')) {
        const line = this.next().line; const params = this.params(':'); this.expectOp(':'); const body = this.test();
        return { k: 'Lambda', params, body, line };
      }
      const cond = this.orTest();
      if (this.isKw('if')) {
        const line = this.next().line; const test = this.orTest(); if (!this.eatKw('else')) this.fail("falta 'else' en la expresión condicional"); const orelse = this.test();
        return { k: 'IfExp', test, body: cond, orelse, line };
      }
      return cond;
    }
    orTest() { let l = this.andTest(); while (this.isKw('or')) { const line = this.next().line; l = { k: 'BoolOp', op: 'or', left: l, right: this.andTest(), line }; } return l; }
    andTest() { let l = this.notTest(); while (this.isKw('and')) { const line = this.next().line; l = { k: 'BoolOp', op: 'and', left: l, right: this.notTest(), line }; } return l; }
    notTest() { if (this.isKw('not')) { const line = this.next().line; return { k: 'Not', value: this.notTest(), line }; } return this.comparison(); }
    comparison() {
      const left = this.arith(); const ops = [], rights = [];
      for (; ;) {
        const t = this.peek(); let op = null;
        if (t.t === 'OP' && ['<', '>', '==', '>=', '<=', '!='].includes(t.v)) { op = t.v; this.p++; }
        else if (this.isKw('in')) { op = 'in'; this.p++; }
        else if (this.isKw('not') && this.isKw('in', 1)) { op = 'not in'; this.p += 2; }
        else if (this.isKw('is')) { this.p++; op = this.eatKw('not') ? 'is not' : 'is'; }
        if (!op) break; ops.push(op); rights.push(this.arith());
      }
      return ops.length ? { k: 'Compare', left, ops, rights, line: t_line(left) } : left;
    }
    arith() { let l = this.term(); while (this.isOp('+') || this.isOp('-')) { const o = this.next(); l = { k: 'Bin', op: o.v, left: l, right: this.term(), line: o.line }; } return l; }
    term() { let l = this.factor(); while (['*', '/', '//', '%'].some(o => this.isOp(o))) { const o = this.next(); l = { k: 'Bin', op: o.v, left: l, right: this.factor(), line: o.line }; } return l; }
    factor() { if (this.isOp('-') || this.isOp('+')) { const o = this.next(); return { k: 'Unary', op: o.v, value: this.factor(), line: o.line }; } return this.power(); }
    power() { const base = this.postfix(); if (this.isOp('**')) { const o = this.next(); return { k: 'Bin', op: '**', left: base, right: this.factor(), line: o.line }; } return base; }
    postfix() {
      let n = this.atom();
      for (; ;) {
        if (this.isOp('(')) { const line = this.next().line; n = this.callArgs(n, line); }
        else if (this.isOp('[')) { const line = this.next().line; const idx = this.subscript(); this.expectOp(']'); n = { k: 'Subscript', obj: n, index: idx, line }; }
        else if (this.isOp('.')) { const line = this.next().line; const nm = this.next(); if (nm.t !== 'NAME') this.fail('nombre de atributo'); n = { k: 'Attr', obj: n, name: nm.v, line }; }
        else break;
      }
      return n;
    }
    callArgs(fn, line) {
      const args = [], kwargs = [];
      while (!this.isOp(')')) {
        if (this.isOp('*')) { const l = this.next().line; args.push({ k: 'Starred', value: this.test(), line: l }); }
        else if (this.isOp('**')) throw err('SyntaxError', '**kwargs aún no está disponible', line);
        else if (this.peek().t === 'NAME' && this.isOp('=', 1) && !KEYWORDS.has(this.peek().v)) { const name = this.next().v; this.p++; kwargs.push({ name, value: this.test() }); }
        else {
          const e = this.test();
          if (this.isKw('for')) args.push(this.comprehension(e, 'ListComp', line)); else args.push(e);
        }
        if (!this.eatOp(',')) break;
      }
      this.expectOp(')'); return { k: 'Call', fn, args, kwargs, line };
    }
    subscript() {
      const line = this.peek().line; let lo = null, hi = null, step = null, slice = false;
      if (!this.isOp(':')) lo = this.exprList();
      if (this.eatOp(':')) { slice = true; if (!this.isOp(':') && !this.isOp(']')) hi = this.test(); if (this.eatOp(':')) { if (!this.isOp(']')) step = this.test(); } }
      return slice ? { k: 'Slice', lo, hi, step, line } : lo;
    }
    comprehension(elt, kind, line, valueNode) {
      const gens = [];
      while (this.isKw('for')) {
        this.p++; const target = this.targetList(); if (!this.eatKw('in')) this.fail("falta 'in'"); const iter = this.orTest(); const ifs = [];
        while (this.isKw('if')) { this.p++; ifs.push(this.orTest()); }
        gens.push({ target, iter, ifs });
      }
      return { k: kind, elt, value: valueNode, gens, line };
    }
    atom() {
      const t = this.next(); const line = t.line;
      switch (t.t) {
        case 'NUM': return { k: 'Const', v: t.v, line };
        case 'STR': { let s = t.v; while (this.peek().t === 'STR') s += this.next().v; if (this.peek().t === 'FSTR') { return this.fstrNode([{ lit: s }], line); } return { k: 'Const', v: s, line }; }
        case 'FSTR': return this.fstrNode(t.parts, line);
        case 'NAME':
          if (t.v === 'True') return { k: 'Const', v: true, line };
          if (t.v === 'False') return { k: 'Const', v: false, line };
          if (t.v === 'None') return { k: 'Const', v: null, line };
          if (KEYWORDS.has(t.v)) { this.p--; this.fail("palabra reservada '" + t.v + "' en un lugar inesperado"); }
          return { k: 'Name', name: t.v, line };
        case 'OP':
          if (t.v === '(') {
            if (this.eatOp(')')) return { k: 'Tuple', items: [], line };
            const first = this.starTest();
            if (this.isKw('for')) { const c = this.comprehension(first, 'ListComp', line); this.expectOp(')'); return c; }
            if (this.isOp(',')) { const items = [first]; while (this.eatOp(',')) { if (this.isOp(')')) break; items.push(this.starTest()); } this.expectOp(')'); return { k: 'Tuple', items, line }; }
            this.expectOp(')'); return first;
          }
          if (t.v === '[') {
            if (this.eatOp(']')) return { k: 'List', items: [], line };
            const first = this.starTest();
            if (this.isKw('for')) { const c = this.comprehension(first, 'ListComp', line); this.expectOp(']'); return c; }
            const items = [first]; while (this.eatOp(',')) { if (this.isOp(']')) break; items.push(this.starTest()); } this.expectOp(']'); return { k: 'List', items, line };
          }
          if (t.v === '{') {
            if (this.eatOp('}')) return { k: 'Dict', pairs: [], line };
            const k1 = this.test();
            if (!this.isOp(':')) throw err('SyntaxError', 'Los conjuntos (set) aún no están disponibles en este simulador.', line);
            this.p++; const v1 = this.test();
            if (this.isKw('for')) { const c = this.comprehension(k1, 'DictComp', line, v1); this.expectOp('}'); return c; }
            const pairs = [[k1, v1]];
            while (this.eatOp(',')) { if (this.isOp('}')) break; const k = this.test(); this.expectOp(':'); pairs.push([k, this.test()]); }
            this.expectOp('}'); return { k: 'Dict', pairs, line };
          }
      }
      this.p--; const bad = this.peek();
      if (bad.t === 'NEWLINE' || bad.t === 'EOF') throw err('SyntaxError', 'la línea está incompleta', bad.line);
      throw err('SyntaxError', 'invalid syntax cerca de "' + (bad.v !== undefined ? (bad.v instanceof PyFloat ? bad.v.v : bad.v) : bad.t) + '"', bad.line);
    }
    fstrNode(parts, line) {
      // une FSTR consecutivos
      const all = parts.slice();
      while (this.peek().t === 'FSTR' || this.peek().t === 'STR') { const nt = this.next(); if (nt.t === 'STR') all.push({ lit: nt.v }); else all.push(...nt.parts); }
      return { k: 'FStr', parts: this.compileParts(all, line), line };
    }
    compileParts(parts, line) {
      return parts.map(p => {
        if (p.lit !== undefined) return p;
        const toks = tokenize('(' + p.expr + ')'); const sub = new Parser(toks); const node = sub.test();
        return { node, conv: p.conv, spec: p.spec ? this.compileParts(p.spec, line) : null };
      });
    }
  }
  function t_line(n) { return n && n.line; }

  /* ───────────── Intérprete ───────────── */
  class Scope {
    constructor(parent) { this.vars = new Map(); this.parent = parent; this.globalNames = null; }
    root() { let s = this; while (s.parent) s = s.parent; return s; }
  }

  class Interp {
    constructor(opts) {
      this.out = []; this.outLen = 0; this.inputs = (opts.inputs || []).slice(); this.steps = 0; this.depth = 0;
      this.deadline = Date.now() + (opts.timeLimit || 3000); this.maxOut = 30000; this.truncated = false;
      this.globals = new Scope(null); this.builtins = makeBuiltins(this); this.modules = makeModules(this);
    }
    write(s) {
      if (this.outLen > this.maxOut) { if (!this.truncated) { this.truncated = true; this.out.push('\n[...salida recortada...]'); } return; }
      this.out.push(s); this.outLen += s.length;
    }
    tick() {
      if (++this.steps > 4000000) throw err('TimeoutError', 'El programa se ejecutó demasiado tiempo. ¿Tienes un ciclo infinito?');
      if ((this.steps & 8191) === 0 && Date.now() > this.deadline) throw err('TimeoutError', 'El programa tardó demasiado. ¿Tienes un ciclo infinito?');
    }
    lookup(name, scope) {
      for (let s = scope; s; s = s.parent) if (s.vars.has(name)) return s.vars.get(name);
      if (this.builtins.has(name)) return this.builtins.get(name);
      throw err('NameError', "name '" + name + "' is not defined");
    }
    assignName(name, v, scope) {
      if (scope.globalNames && scope.globalNames.has(name)) this.globals.vars.set(name, v); else scope.vars.set(name, v);
    }
    runProgram(body) { for (const s of body) this.exec(s, this.globals); }
    execBlock(body, scope) { for (let i = 0; i < body.length; i++) this.exec(body[i], scope); }
    exec(n, scope) {
      this.tick();
      try { this.exec1(n, scope); }
      catch (e) { if (e instanceof PyError && e.line == null) e.line = n.line; throw e; }
    }
    exec1(n, scope) {
      switch (n.k) {
        case 'Expr': this.ev(n.value, scope); return;
        case 'Assign': { const v = this.ev(n.value, scope); for (const t of n.targets) this.assign(t, v, scope); return; }
        case 'AugAssign': {
          if (n.target.k === 'Name') { const cur = this.lookup(n.target.name, scope); this.assignName(n.target.name, this.binop(n.op, cur, this.ev(n.value, scope)), scope); }
          else { const obj = this.ev(n.target.obj, scope); const idx = this.ev(n.target.index, scope); const cur = this.getItem(obj, idx); this.setItem(obj, idx, this.binop(n.op, cur, this.ev(n.value, scope))); }
          return;
        }
        case 'If': if (truthy(this.ev(n.test, scope))) this.execBlock(n.body, scope); else this.execBlock(n.orelse, scope); return;
        case 'While': {
          let broke = false;
          while (truthy(this.ev(n.test, scope))) {
            this.tick();
            try { this.execBlock(n.body, scope); } catch (e) { if (e instanceof BreakSig) { broke = true; break; } if (e instanceof ContinueSig) continue; throw e; }
          }
          if (!broke) this.execBlock(n.orelse, scope); return;
        }
        case 'For': {
          const it = this.ev(n.iter, scope); let broke = false;
          for (const v of this.iterate(it)) {
            this.tick(); this.assign(n.target, v, scope);
            try { this.execBlock(n.body, scope); } catch (e) { if (e instanceof BreakSig) { broke = true; break; } if (e instanceof ContinueSig) continue; throw e; }
          }
          if (!broke) this.execBlock(n.orelse, scope); return;
        }
        case 'Pass': return;
        case 'Break': throw new BreakSig();
        case 'Continue': throw new ContinueSig();
        case 'Return': throw new ReturnSig(n.value ? this.ev(n.value, scope) : null);
        case 'Global': { if (!scope.globalNames) scope.globalNames = new Set(); n.names.forEach(x => scope.globalNames.add(x)); return; }
        case 'Def': {
          const params = n.params.map(p => ({ name: p.name, star: p.star, def: p.def ? this.ev(p.def, scope) : undefined }));
          this.assignName(n.name, new PyFunc(n.name, params, n.body, scope, null), scope); return;
        }
        case 'Import': for (const [name, as] of n.items) { const m = this.modules[name]; if (!m) throw err('ModuleNotFoundError', "No module named '" + name + "' (este simulador solo incluye math y random)"); this.assignName(as, m, scope); } return;
        case 'FromImport': {
          const m = this.modules[n.mod]; if (!m) throw err('ModuleNotFoundError', "No module named '" + n.mod + "' (este simulador solo incluye math y random)");
          for (const [name, as] of n.items) { if (name === '*') { for (const k of Object.keys(m.attrs)) this.assignName(k, m.attrs[k], scope); } else { if (!(name in m.attrs)) throw err('ImportError', "cannot import name '" + name + "' from '" + n.mod + "'"); this.assignName(as, m.attrs[name], scope); } } return;
        }
        case 'Del': for (const t of n.targets) { if (t.k === 'Name') scope.vars.delete(t.name); else if (t.k === 'Subscript') { const o = this.ev(t.obj, scope), i = this.ev(t.index, scope); if (Array.isArray(o)) { const k = this.idx(i, o.length, 'list'); o.splice(k, 1); } else if (o instanceof PyDict) { if (!o.del(i)) throw err('KeyError', repr(i)); } } } return;
        case 'Assert': if (!truthy(this.ev(n.test, scope))) throw err('AssertionError', n.msg ? str(this.ev(n.msg, scope)) : ''); return;
        case 'Raise': {
          if (!n.exc) throw err('RuntimeError', 'No active exception to reraise');
          const e = this.ev(n.exc, scope);
          if (e instanceof PyError) throw e;
          if (e instanceof PyBuiltin && e.isExc) throw err(e.name, '');
          throw err('TypeError', 'exceptions must derive from BaseException');
        }
        case 'Try': return this.execTry(n, scope);
      }
      throw err('SyntaxError', 'instrucción no soportada: ' + n.k);
    }
    execTry(n, scope) {
      const run = () => {
        try { this.execBlock(n.body, scope); }
        catch (e) {
          let pe = e;
          if (e instanceof RangeError) pe = err('RecursionError', 'maximum recursion depth exceeded');
          if (!(pe instanceof PyError) || pe.pyType === 'TimeoutError') throw e;
          for (const h of n.handlers) {
            let match = !h.types;
            if (h.types) {
              const ty = this.ev(h.types, scope); const list = ty instanceof PyTuple ? ty.items : [ty];
              match = list.some(x => x instanceof PyBuiltin && (x.name === pe.pyType || x.name === 'Exception' || x.name === 'BaseException' || (x.name === 'ArithmeticError' && pe.pyType === 'ZeroDivisionError') || (x.name === 'LookupError' && (pe.pyType === 'IndexError' || pe.pyType === 'KeyError'))));
            }
            if (match) { if (h.name) scope.vars.set(h.name, pe); this.execBlock(h.body, scope); return 'handled'; }
          }
          throw e;
        }
        this.execBlock(n.orelse, scope); return 'ok';
      };
      try { run(); } finally { if (n.fin.length) this.execBlock(n.fin, scope); }
    }
    assign(t, v, scope) {
      switch (t.k) {
        case 'Name': this.assignName(t.name, v, scope); return;
        case 'Tuple': case 'List': {
          const vals = [...this.iterate(v)];
          if (vals.length !== t.items.length) throw err('ValueError', vals.length < t.items.length ? 'not enough values to unpack (expected ' + t.items.length + ', got ' + vals.length + ')' : 'too many values to unpack (expected ' + t.items.length + ')');
          t.items.forEach((it, i) => this.assign(it, vals[i], scope)); return;
        }
        case 'Subscript': this.setItem(this.ev(t.obj, scope), this.ev(t.index, scope), v); return;
      }
      throw err('SyntaxError', 'asignación no válida');
    }
    *iterate(v) {
      if (Array.isArray(v)) { for (let i = 0; i < v.length; i++) yield v[i]; return; }
      if (typeof v === 'string') { for (const ch of v) yield ch; return; }
      if (v instanceof PyTuple) { for (const x of v.items) yield x; return; }
      if (v instanceof PyDict) { for (const k of v.keys()) yield k; return; }
      if (v instanceof PyRange) { const n = v.len(); for (let i = 0; i < n; i++) yield v.at(i); return; }
      throw err('TypeError', "'" + typeName(v) + "' object is not iterable");
    }
    binop(op, a, b) { return arith(op, a, b); }
    idx(i, len, what) {
      if (typeof i === 'boolean') i = i ? 1 : 0;
      if (!isInt(i)) throw err('TypeError', what + ' indices must be integers or slices, not ' + typeName(i));
      i = Number(i); if (i < 0) i += len;
      if (i < 0 || i >= len) throw err('IndexError', what + ' index out of range');
      return i;
    }
    sliceIdx(sl, len) {
      const step = sl.step == null ? 1 : Number(sl.step); if (step === 0) throw err('ValueError', 'slice step cannot be zero');
      const cl = (x, def, lo, hi) => { if (x == null) return def; x = Number(x); if (x < 0) x += len; return Math.min(Math.max(x, lo), hi); };
      let lo, hi;
      if (step > 0) { lo = cl(sl.lo, 0, 0, len); hi = cl(sl.hi, len, 0, len); }
      else { lo = cl(sl.lo, len - 1, -1, len - 1); hi = cl(sl.hi, -1, -1, len - 1); }
      const idxs = []; if (step > 0) for (let i = lo; i < hi; i += step) idxs.push(i); else for (let i = lo; i > hi; i += step) idxs.push(i);
      return idxs;
    }
    getItem(o, i) {
      if (i && i.k === 'SliceV') {
        if (typeof o === 'string') return this.sliceIdx(i, [...o].length).map(k => [...o][k]).join('');
        if (Array.isArray(o)) return this.sliceIdx(i, o.length).map(k => o[k]);
        if (o instanceof PyTuple) return new PyTuple(this.sliceIdx(i, o.items.length).map(k => o.items[k]));
        throw err('TypeError', "'" + typeName(o) + "' object is not subscriptable");
      }
      if (typeof o === 'string') { const cs = [...o]; return cs[this.idx(i, cs.length, 'string')]; }
      if (Array.isArray(o)) return o[this.idx(i, o.length, 'list')];
      if (o instanceof PyTuple) return o.items[this.idx(i, o.items.length, 'tuple')];
      if (o instanceof PyRange) return o.at(this.idx(i, o.len(), 'range object'));
      if (o instanceof PyDict) { if (!o.has(i)) throw err('KeyError', repr(i)); return o.get(i); }
      throw err('TypeError', "'" + typeName(o) + "' object is not subscriptable");
    }
    setItem(o, i, v) {
      if (Array.isArray(o)) { o[this.idx(i, o.length, 'list assignment')] = v; return; }
      if (o instanceof PyDict) { o.set(i, v); return; }
      throw err('TypeError', "'" + typeName(o) + "' object does not support item assignment");
    }
    ev(n, scope) {
      switch (n.k) {
        case 'Const': return n.v;
        case 'Name': return this.lookup(n.name, scope);
        case 'FStr': return this.evFStr(n.parts, scope);
        case 'Bin': return arith(n.op, this.ev(n.left, scope), this.ev(n.right, scope));
        case 'Unary': {
          const v = this.ev(n.value, scope); const x = typeof v === 'boolean' ? (v ? 1 : 0) : v;
          if (!(isInt(x) || x instanceof PyFloat)) throw err('TypeError', "bad operand type for unary " + n.op + ": '" + typeName(v) + "'");
          if (n.op === '+') return x; return x instanceof PyFloat ? new PyFloat(-x.v) : (typeof x === 'bigint' ? norm(-x) : (x === 0 ? 0 : -x));
        }
        case 'BoolOp': { const l = this.ev(n.left, scope); if (n.op === 'and') return truthy(l) ? this.ev(n.right, scope) : l; return truthy(l) ? l : this.ev(n.right, scope); }
        case 'Not': return !truthy(this.ev(n.value, scope));
        case 'Compare': {
          let l = this.ev(n.left, scope);
          for (let i = 0; i < n.ops.length; i++) {
            const r = this.ev(n.rights[i], scope); const op = n.ops[i]; let res;
            switch (op) {
              case '==': res = eq(l, r); break; case '!=': res = !eq(l, r); break;
              case '<': res = cmp(l, r, '<') < 0; break; case '>': res = cmp(l, r, '>') > 0; break;
              case '<=': res = cmp(l, r, '<=') <= 0; break; case '>=': res = cmp(l, r, '>=') >= 0; break;
              case 'in': res = this.contains(r, l); break; case 'not in': res = !this.contains(r, l); break;
              case 'is': res = l === r || (l == null && r == null) || (typeof l === 'boolean' && l === r); break;
              case 'is not': res = !(l === r || (l == null && r == null)); break;
            }
            if (!res) return false; l = r;
          }
          return true;
        }
        case 'IfExp': return truthy(this.ev(n.test, scope)) ? this.ev(n.body, scope) : this.ev(n.orelse, scope);
        case 'List': return this.evItems(n.items, scope);
        case 'Tuple': return new PyTuple(this.evItems(n.items, scope));
        case 'Dict': { const d = new PyDict(); for (const [k, v] of n.pairs) d.set(this.ev(k, scope), this.ev(v, scope)); return d; }
        case 'ListComp': case 'DictComp': {
          const res = n.k === 'ListComp' ? [] : new PyDict(); const inner = new Scope(scope);
          const rec = (gi) => {
            if (gi === n.gens.length) { if (n.k === 'ListComp') res.push(this.ev(n.elt, inner)); else res.set(this.ev(n.elt, inner), this.ev(n.value, inner)); return; }
            const g = n.gens[gi];
            for (const v of this.iterate(this.ev(g.iter, inner))) { this.tick(); this.assign(g.target, v, inner); if (g.ifs.every(c => truthy(this.ev(c, inner)))) rec(gi + 1); }
          };
          rec(0); return res;
        }
        case 'Lambda': return new PyFunc('<lambda>', n.params.map(p => ({ name: p.name, star: p.star, def: p.def ? this.ev(p.def, scope) : undefined })), null, scope, n.body);
        case 'Subscript': {
          const o = this.ev(n.obj, scope);
          if (n.index && n.index.k === 'Slice') { const s = n.index; return this.getItem(o, { k: 'SliceV', lo: s.lo ? this.ev(s.lo, scope) : null, hi: s.hi ? this.ev(s.hi, scope) : null, step: s.step ? this.ev(s.step, scope) : null }); }
          return this.getItem(o, this.ev(n.index, scope));
        }
        case 'Attr': {
          const o = this.ev(n.obj, scope);
          if (o instanceof PyModule) { if (!(n.name in o.attrs)) throw err('AttributeError', "module '" + o.name + "' has no attribute '" + n.name + "'"); return o.attrs[n.name]; }
          return new BoundMethod(o, n.name);
        }
        case 'Call': return this.evCall(n, scope);
        case 'Starred': throw err('SyntaxError', 'uso de * no válido aquí');
      }
      throw err('SyntaxError', 'expresión no soportada: ' + n.k);
    }
    evItems(items, scope) { const out = []; for (const it of items) { if (it.k === 'Starred') out.push(...this.iterate(this.ev(it.value, scope))); else out.push(this.ev(it, scope)); } return out; }
    evFStr(parts, scope) {
      let s = '';
      for (const p of parts) {
        if (p.lit !== undefined) { s += p.lit; continue; }
        let v = this.ev(p.node, scope);
        if (p.conv === 'r') v = repr(v); else if (p.conv === 's') v = str(v);
        s += p.spec ? formatValue(v, this.evFStr(p.spec, scope)) : str(v);
      }
      return s;
    }
    contains(c, x) {
      if (typeof c === 'string') { if (typeof x !== 'string') throw err('TypeError', "'in <string>' requires string as left operand, not " + typeName(x)); return c.includes(x); }
      if (Array.isArray(c)) return c.some(y => eq(x, y));
      if (c instanceof PyTuple) return c.items.some(y => eq(x, y));
      if (c instanceof PyDict) return c.has(x);
      if (c instanceof PyRange) { for (const v of this.iterate(c)) if (eq(v, x)) return true; return false; }
      throw err('TypeError', "argument of type '" + typeName(c) + "' is not iterable");
    }
    evCall(n, scope) {
      const args = this.evItems(n.args, scope); const kw = {}; for (const k of n.kwargs) kw[k.name] = this.ev(k.value, scope);
      if (n.fn.k === 'Attr') {
        const o = this.ev(n.fn.obj, scope);
        if (o instanceof PyModule) return this.call(this.ev(n.fn, scope), args, kw);
        return this.callMethod(o, n.fn.name, args, kw);
      }
      return this.call(this.ev(n.fn, scope), args, kw);
    }
    call(f, args, kw) {
      this.tick();
      if (f instanceof PyFunc) return this.callFunc(f, args, kw);
      if (f instanceof PyBuiltin) return f.fn(args, kw || {}, this);
      if (f instanceof BoundMethod) return this.callMethod(f.obj, f.name, args, kw || {});
      throw err('TypeError', "'" + typeName(f) + "' object is not callable");
    }
    callFunc(f, args, kw) {
      if (this.depth > 400) throw err('RecursionError', 'maximum recursion depth exceeded');
      const sc = new Scope(f.scope); const ps = f.params; let ai = 0;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        if (p.star) { sc.vars.set(p.name, new PyTuple(args.slice(ai))); ai = args.length; continue; }
        if (ai < args.length) { if (p.name in kw) throw err('TypeError', f.name + "() got multiple values for argument '" + p.name + "'"); sc.vars.set(p.name, args[ai++]); }
        else if (p.name in kw) sc.vars.set(p.name, kw[p.name]);
        else if (p.def !== undefined) sc.vars.set(p.name, p.def);
        else { const miss = ps.slice(i).filter(q => !q.star && q.def === undefined && !(q.name in kw)).map(q => "'" + q.name + "'"); throw err('TypeError', f.name + '() missing ' + miss.length + ' required positional argument' + (miss.length > 1 ? 's' : '') + ': ' + miss.join(' and ')); }
      }
      if (ai < args.length) throw err('TypeError', f.name + '() takes ' + ps.length + ' positional argument' + (ps.length === 1 ? '' : 's') + ' but ' + args.length + ' were given');
      for (const k of Object.keys(kw)) if (!ps.some(p => p.name === k)) throw err('TypeError', f.name + "() got an unexpected keyword argument '" + k + "'");
      this.depth++;
      try {
        if (f.expr) return this.ev(f.expr, sc);
        try { this.execBlock(f.body, sc); } catch (e) { if (e instanceof ReturnSig) return e.v; throw e; }
        return null;
      } finally { this.depth--; }
    }
    callMethod(o, name, args, kw) {
      let tbl = null;
      if (typeof o === 'string') tbl = STR_METHODS; else if (Array.isArray(o)) tbl = LIST_METHODS; else if (o instanceof PyDict) tbl = DICT_METHODS;
      else if (o instanceof PyTuple) tbl = TUPLE_METHODS; else if (o instanceof PyFloat) tbl = FLOAT_METHODS;
      if (!tbl || !tbl[name]) throw err('AttributeError', "'" + typeName(o) + "' object has no attribute '" + name + "'");
      return tbl[name](o, args, kw, this);
    }
  }

  /* ───────────── Métodos ───────────── */
  const need = (args, n, name) => { if (args.length < n) throw err('TypeError', name + '() takes at least ' + n + ' argument(s) (' + args.length + ' given)'); };
  const STR_METHODS = {
    upper: s => s.toUpperCase(), lower: s => s.toLowerCase(), capitalize: s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
    title: s => s.toLowerCase().replace(/(^|[^\p{L}])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()), swapcase: s => [...s].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
    strip: (s, a) => a.length ? stripChars(s, a[0], 3) : s.trim(), lstrip: (s, a) => a.length ? stripChars(s, a[0], 1) : s.trimStart(), rstrip: (s, a) => a.length ? stripChars(s, a[0], 2) : s.trimEnd(),
    split: (s, a, kw) => { const sep = a.length ? a[0] : (kw.sep ?? null); if (sep === null) return s.split(/\s+/).filter(Boolean); if (sep === '') throw err('ValueError', 'empty separator'); const mx = a.length > 1 ? a[1] : (kw.maxsplit ?? -1); if (mx < 0) return s.split(sep); const parts = s.split(sep); return parts.slice(0, mx).concat(parts.length > mx ? [parts.slice(mx).join(sep)] : []); },
    join: (s, a, kw, it) => { const items = [...it.iterate(a[0])]; for (const x of items) if (typeof x !== 'string') throw err('TypeError', 'sequence item ' + items.indexOf(x) + ': expected str instance, ' + typeName(x) + ' found'); return items.join(s); },
    replace: (s, a) => { need(a, 2, 'replace'); const cnt = a.length > 2 ? Number(a[2]) : -1; if (cnt < 0) return s.split(a[0]).join(a[1]); let out = s, i = 0, r = ''; for (let c = 0; c < cnt; c++) { const k = out.indexOf(a[0], i); if (k < 0) break; r += out.slice(i, k) + a[1]; i = k + a[0].length; } return r + out.slice(i); },
    startswith: (s, a) => (a[0] instanceof PyTuple ? a[0].items : [a[0]]).some(p => s.startsWith(p)), endswith: (s, a) => (a[0] instanceof PyTuple ? a[0].items : [a[0]]).some(p => s.endsWith(p)),
    find: (s, a) => s.indexOf(a[0], a[1] || 0), rfind: (s, a) => s.lastIndexOf(a[0]),
    index: (s, a) => { const i = s.indexOf(a[0]); if (i < 0) throw err('ValueError', 'substring not found'); return i; },
    count: (s, a) => a[0] === '' ? s.length + 1 : s.split(a[0]).length - 1,
    isdigit: s => /^\d+$/.test(s), isnumeric: s => /^\d+$/.test(s), isalpha: s => /^\p{L}+$/u.test(s), isalnum: s => /^[\p{L}\p{N}]+$/u.test(s), isspace: s => /^\s+$/.test(s),
    isupper: s => /\p{L}/u.test(s) && s === s.toUpperCase(), islower: s => /\p{L}/u.test(s) && s === s.toLowerCase(),
    zfill: (s, a) => s.padStart(a[0], '0'), center: (s, a) => { const w = a[0], f = a[1] || ' '; const p = Math.max(0, w - s.length); const l = Math.floor(p / 2) + (p % 2 && w % 2 ? 1 : 0); return f.repeat(p - Math.floor(p / 2)).slice(0, 0) + f.repeat(Math.floor(p / 2) + (p % 2)) .slice(0, 0) + f.repeat(Math.floor(p / 2)) + s + f.repeat(p - Math.floor(p / 2)); },
    ljust: (s, a) => s.padEnd(a[0], a[1] || ' '), rjust: (s, a) => s.padStart(a[0], a[1] || ' '),
    format: (s, a, kw) => strFormat(s, a, kw),
  };
  function stripChars(s, chars, mode) { let b = 0, e = s.length; if (mode & 1) while (b < e && chars.includes(s[b])) b++; if (mode & 2) while (e > b && chars.includes(s[e - 1])) e--; return s.slice(b, e); }
  function strFormat(s, args, kw) {
    let auto = 0;
    return s.replace(/\{\{|\}\}|\{([^{}:!]*)(?:!([rs]))?(?::([^{}]*))?\}/g, (m, name, conv, spec) => {
      if (m === '{{') return '{'; if (m === '}}') return '}';
      let v; if (name === '' || name === undefined) v = args[auto++]; else if (/^\d+$/.test(name)) v = args[+name]; else v = kw[name];
      if (v === undefined) throw err('IndexError', 'Replacement index out of range');
      if (conv === 'r') v = repr(v);
      return formatValue(v, spec || '');
    });
  }
  const LIST_METHODS = {
    append: (l, a) => { need(a, 1, 'append'); l.push(a[0]); return null; },
    extend: (l, a, kw, it) => { l.push(...it.iterate(a[0])); return null; },
    insert: (l, a) => { let i = Number(a[0]); if (i < 0) i = Math.max(0, l.length + i); l.splice(Math.min(i, l.length), 0, a[1]); return null; },
    pop: (l, a) => { if (!l.length) throw err('IndexError', 'pop from empty list'); const i = a.length ? Number(a[0]) : l.length - 1; const k = i < 0 ? l.length + i : i; if (k < 0 || k >= l.length) throw err('IndexError', 'pop index out of range'); return l.splice(k, 1)[0]; },
    remove: (l, a) => { const i = l.findIndex(x => eq(x, a[0])); if (i < 0) throw err('ValueError', 'list.remove(x): x not in list'); l.splice(i, 1); return null; },
    index: (l, a) => { const i = l.findIndex(x => eq(x, a[0])); if (i < 0) throw err('ValueError', repr(a[0]) + ' is not in list'); return i; },
    count: (l, a) => l.filter(x => eq(x, a[0])).length,
    sort: (l, a, kw, it) => { const sorted = sortList(l, kw, it); l.length = 0; l.push(...sorted); return null; },
    reverse: l => { l.reverse(); return null; }, copy: l => l.slice(), clear: l => { l.length = 0; return null; },
  };
  function sortList(l, kw, it) {
    const key = kw.key; const rev = kw.reverse !== undefined && truthy(kw.reverse);
    let arr = l.map(v => ({ v, k: key ? it.call(key, [v], {}) : v }));
    arr.sort((x, y) => cmp(x.k, y.k)); if (rev) { arr = arr.reverse(); /* estabilidad aproximada */ }
    return arr.map(x => x.v);
  }
  const TUPLE_METHODS = { count: (t, a) => t.items.filter(x => eq(x, a[0])).length, index: (t, a) => { const i = t.items.findIndex(x => eq(x, a[0])); if (i < 0) throw err('ValueError', 'tuple.index(x): x not in tuple'); return i; } };
  const DICT_METHODS = {
    get: (d, a) => d.has(a[0]) ? d.get(a[0]) : (a.length > 1 ? a[1] : null),
    keys: d => d.keys(), values: d => d.values(), items: d => d.entries().map(e => new PyTuple([e[0], e[1]])),
    pop: (d, a) => { if (d.has(a[0])) { const v = d.get(a[0]); d.del(a[0]); return v; } if (a.length > 1) return a[1]; throw err('KeyError', repr(a[0])); },
    update: (d, a) => { if (a[0] instanceof PyDict) a[0].entries().forEach(([k, v]) => d.set(k, v)); return null; },
    setdefault: (d, a) => { if (!d.has(a[0])) d.set(a[0], a.length > 1 ? a[1] : null); return d.get(a[0]); },
    copy: d => { const n = new PyDict(); d.entries().forEach(([k, v]) => n.set(k, v)); return n; }, clear: d => { d.m.clear(); return null; },
  };
  const FLOAT_METHODS = { is_integer: f => Number.isInteger(f.v) };

  /* ───────────── Builtins y módulos ───────────── */
  function makeBuiltins(it) {
    const B = new Map();
    const def = (name, fn, isType) => B.set(name, new PyBuiltin(name, fn, isType));
    def('print', (a, kw, I) => { const sep = kw.sep == null ? ' ' : str(kw.sep); const end = kw.end == null ? '\n' : str(kw.end); I.write(a.map(str).join(sep) + end); return null; });
    def('input', (a, kw, I) => { if (a.length) I.write(str(a[0])); if (!I.inputs.length) throw err('EOFError', 'EOF when reading a line (no hay más datos de entrada)'); return String(I.inputs.shift()); });
    def('len', a => { const v = a[0]; if (typeof v === 'string') return [...v].length; if (Array.isArray(v)) return v.length; if (v instanceof PyTuple) return v.items.length; if (v instanceof PyDict) return v.size; if (v instanceof PyRange) return v.len(); throw err('TypeError', "object of type '" + typeName(v) + "' has no len()"); });
    def('range', a => { a = a.map(x => { if (!isInt(x) && typeof x !== 'boolean') throw err('TypeError', "'" + typeName(x) + "' object cannot be interpreted as an integer"); return Number(x); }); if (!a.length) throw err('TypeError', 'range expected at least 1 argument, got 0'); if (a.length === 1) return new PyRange(0, a[0], 1); if (a.length === 2) return new PyRange(a[0], a[1], 1); if (a[2] === 0) throw err('ValueError', 'range() arg 3 must not be zero'); return new PyRange(a[0], a[1], a[2]); });
    def('int', a => {
      if (!a.length) return 0; const v = a[0];
      if (typeof v === 'boolean') return v ? 1 : 0; if (isInt(v)) return v; if (v instanceof PyFloat) { if (!isFinite(v.v)) throw err('OverflowError', 'cannot convert float infinity to integer'); const t = Math.trunc(v.v); return Number.isSafeInteger(t) ? t : norm(BigInt(t)); }
      if (typeof v === 'string') { const s = v.trim(); const base = a.length > 1 ? Number(a[1]) : 10; if (base === 10 ? /^[+-]?\d+$/.test(s) : s !== '' && !isNaN(parseInt(s, base))) return base === 10 ? norm(BigInt(s)) : parseInt(s, base); throw err('ValueError', 'invalid literal for int() with base ' + base + ': ' + repr(v)); }
      throw err('TypeError', "int() argument must be a string or a real number, not '" + typeName(v) + "'");
    }, true);
    def('float', a => { if (!a.length) return new PyFloat(0); const v = a[0]; if (v instanceof PyFloat) return v; if (typeof v === 'boolean' || isInt(v)) return new PyFloat(Number(v)); if (typeof v === 'string') { const s = v.trim().toLowerCase(); if (/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/.test(s)) return new PyFloat(parseFloat(s)); if (/^[+-]?(inf|infinity)$/.test(s)) return new PyFloat(s[0] === '-' ? -Infinity : Infinity); if (s === 'nan') return new PyFloat(NaN); throw err('ValueError', 'could not convert string to float: ' + repr(v)); } throw err('TypeError', "float() argument must be a string or a real number, not '" + typeName(v) + "'"); }, true);
    def('str', a => a.length ? str(a[0]) : '', true);
    def('bool', a => a.length ? truthy(a[0]) : false, true);
    def('list', (a, kw, I) => a.length ? [...I.iterate(a[0])] : [], true);
    def('tuple', (a, kw, I) => new PyTuple(a.length ? [...I.iterate(a[0])] : []), true);
    def('dict', (a, kw, I) => { const d = new PyDict(); if (a.length) { if (a[0] instanceof PyDict) a[0].entries().forEach(([k, v]) => d.set(k, v)); else for (const p of I.iterate(a[0])) { const kv = [...I.iterate(p)]; d.set(kv[0], kv[1]); } } for (const k of Object.keys(kw)) d.set(k, kw[k]); return d; }, true);
    def('abs', a => { const v = a[0]; if (v instanceof PyFloat) return new PyFloat(Math.abs(v.v)); if (typeof v === 'bigint') return v < 0n ? norm(-v) : v; if (typeof v === 'boolean') return v ? 1 : 0; if (typeof v === 'number') return Math.abs(v); throw err('TypeError', "bad operand type for abs(): '" + typeName(v) + "'"); });
    def('round', a => {
      const v = a[0]; const nd = a.length > 1 && a[1] !== null ? Number(a[1]) : null;
      if (isInt(v) || typeof v === 'boolean') return nd === null || nd >= 0 ? (typeof v === 'boolean' ? Number(v) : v) : (() => { const f = Math.pow(10, -nd); return Math.round(Number(v) / f) * f; })();
      if (!(v instanceof PyFloat)) throw err('TypeError', "type " + typeName(v) + " doesn't define __round__ method");
      const x = v.v;
      const bankers = (y) => { const r = Math.round(y); return (Math.abs(y % 1) === 0.5) ? 2 * Math.round(y / 2) : r; };
      if (nd === null) { if (!isFinite(x)) throw err('OverflowError', 'cannot convert float infinity to integer'); return bankers(x); }
      if (!isFinite(x)) return v;
      const ax = Math.abs(x); const full = ax.toFixed(Math.min(100, Math.max(0, nd) + 30)); const dot = full.indexOf('.'); const rest = nd >= 0 ? full.slice(dot + 1 + nd) : '';
      if (nd >= 0 && /^50*$/.test(rest)) { const f = Math.pow(10, nd); const lo = Math.floor(ax * f); const r = lo % 2 === 0 ? lo : lo + 1; return new PyFloat((x < 0 ? -r : r) / f); }
      if (nd >= 0) return new PyFloat(Number(x.toFixed(Math.min(nd, 100))));
      const f = Math.pow(10, -nd); return new PyFloat(bankers(x / f) * f);
    });
    const minmax = (name, sign) => def(name, (a, kw, I) => {
      let items = a.length === 1 ? [...I.iterate(a[0])] : a; if (!items.length) { if ('default' in kw) return kw.default; throw err('ValueError', name + '() arg is an empty sequence'); }
      let best = items[0], bk = kw.key ? I.call(kw.key, [best], {}) : best;
      for (let i = 1; i < items.length; i++) { const k = kw.key ? I.call(kw.key, [items[i]], {}) : items[i]; if (cmp(k, bk) * sign > 0) { best = items[i]; bk = k; } }
      return best;
    });
    minmax('min', -1); minmax('max', 1);
    def('sum', (a, kw, I) => { let t = a.length > 1 ? a[1] : 0; for (const x of I.iterate(a[0])) t = arith('+', t, x); return t; });
    def('sorted', (a, kw, I) => sortList([...I.iterate(a[0])], kw, I));
    def('reversed', (a, kw, I) => [...I.iterate(a[0])].reverse());
    def('enumerate', (a, kw, I) => { const st = a.length > 1 ? Number(a[1]) : (kw.start ?? 0); return [...I.iterate(a[0])].map((v, i) => new PyTuple([i + Number(st), v])); });
    def('zip', (a, kw, I) => { const ls = a.map(x => [...I.iterate(x)]); const n = ls.length ? Math.min(...ls.map(l => l.length)) : 0; const out = []; for (let i = 0; i < n; i++) out.push(new PyTuple(ls.map(l => l[i]))); return out; });
    def('map', (a, kw, I) => { const f = a[0]; const ls = a.slice(1).map(x => [...I.iterate(x)]); const n = Math.min(...ls.map(l => l.length)); const out = []; for (let i = 0; i < n; i++) out.push(I.call(f, ls.map(l => l[i]), {})); return out; });
    def('filter', (a, kw, I) => [...I.iterate(a[1])].filter(x => a[0] === null ? truthy(x) : truthy(I.call(a[0], [x], {}))));
    def('any', (a, kw, I) => { for (const x of I.iterate(a[0])) if (truthy(x)) return true; return false; });
    def('all', (a, kw, I) => { for (const x of I.iterate(a[0])) if (!truthy(x)) return false; return true; });
    def('type', a => { const n = typeName(a[0]); return B.get(n) || new PyBuiltin(n, () => null, true); });
    def('isinstance', a => { const t = a[1]; const list = t instanceof PyTuple ? t.items : [t]; const n = typeName(a[0]); return list.some(x => x instanceof PyBuiltin && (x.name === n || (x.name === 'int' && n === 'bool'))); });
    def('repr', a => repr(a[0]));
    def('chr', a => String.fromCodePoint(Number(a[0]))); def('ord', a => { if (typeof a[0] !== 'string' || [...a[0]].length !== 1) throw err('TypeError', 'ord() expected a character'); return a[0].codePointAt(0); });
    def('pow', a => a.length > 2 ? Number((BigInt(a[0]) ** BigInt(a[1])) % BigInt(a[2])) : arith('**', a[0], a[1]));
    def('divmod', a => new PyTuple([arith('//', a[0], a[1]), arith('%', a[0], a[1])]));
    def('bin', a => (a[0] < 0 ? '-0b' : '0b') + Math.abs(Number(a[0])).toString(2)); def('hex', a => (a[0] < 0 ? '-0x' : '0x') + Math.abs(Number(a[0])).toString(16)); def('oct', a => '0o' + Number(a[0]).toString(8));
    def('format', a => formatValue(a[0], a[1] || ''));
    def('callable', a => a[0] instanceof PyFunc || a[0] instanceof PyBuiltin || a[0] instanceof BoundMethod);
    for (const e of ['Exception', 'BaseException', 'ValueError', 'TypeError', 'ZeroDivisionError', 'IndexError', 'KeyError', 'NameError', 'RuntimeError', 'AssertionError', 'ArithmeticError', 'LookupError', 'AttributeError', 'OverflowError', 'EOFError']) {
      const b = new PyBuiltin(e, (a) => err(e, a.length ? str(a[0]) : ''), true); b.isExc = true; B.set(e, b);
    }
    return B;
  }
  function makeModules(it) {
    const f = (name, fn) => new PyBuiltin(name, fn);
    const num = v => toF(v);
    const math = new PyModule('math', {
      pi: new PyFloat(Math.PI), e: new PyFloat(Math.E), tau: new PyFloat(2 * Math.PI), inf: new PyFloat(Infinity),
      sqrt: f('sqrt', a => { const x = num(a[0]); if (x < 0) throw err('ValueError', 'math domain error'); return new PyFloat(Math.sqrt(x)); }),
      pow: f('pow', a => new PyFloat(Math.pow(num(a[0]), num(a[1])))), fabs: f('fabs', a => new PyFloat(Math.abs(num(a[0])))),
      floor: f('floor', a => Math.floor(num(a[0]))), ceil: f('ceil', a => Math.ceil(num(a[0]))), trunc: f('trunc', a => Math.trunc(num(a[0]))),
      sin: f('sin', a => new PyFloat(Math.sin(num(a[0])))), cos: f('cos', a => new PyFloat(Math.cos(num(a[0])))), tan: f('tan', a => new PyFloat(Math.tan(num(a[0])))),
      log: f('log', a => { const x = num(a[0]); if (x <= 0) throw err('ValueError', 'math domain error'); return new PyFloat(a.length > 1 ? Math.log(x) / Math.log(num(a[1])) : Math.log(x)); }), log10: f('log10', a => new PyFloat(Math.log10(num(a[0])))), log2: f('log2', a => new PyFloat(Math.log2(num(a[0])))),
      factorial: f('factorial', a => { let r = 1n; for (let i = 2n; i <= BigInt(a[0]); i++) r *= i; return norm(r); }),
      gcd: f('gcd', a => { let x = Math.abs(Number(a[0])), y = Math.abs(Number(a[1])); while (y) [x, y] = [y, x % y]; return x; }),
      isqrt: f('isqrt', a => Math.floor(Math.sqrt(Number(a[0])))), radians: f('radians', a => new PyFloat(num(a[0]) * Math.PI / 180)), degrees: f('degrees', a => new PyFloat(num(a[0]) * 180 / Math.PI)),
    });
    const random = new PyModule('random', {
      random: f('random', () => new PyFloat(Math.random())),
      randint: f('randint', a => { const lo = Number(a[0]), hi = Number(a[1]); return lo + Math.floor(Math.random() * (hi - lo + 1)); }),
      randrange: f('randrange', a => { const lo = a.length > 1 ? Number(a[0]) : 0, hi = a.length > 1 ? Number(a[1]) : Number(a[0]); return lo + Math.floor(Math.random() * (hi - lo)); }),
      choice: f('choice', (a, kw, I) => { const l = [...I.iterate(a[0])]; if (!l.length) throw err('IndexError', 'Cannot choose from an empty sequence'); return l[Math.floor(Math.random() * l.length)]; }),
      shuffle: f('shuffle', a => { const l = a[0]; for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } return null; }),
      uniform: f('uniform', a => new PyFloat(num(a[0]) + Math.random() * (num(a[1]) - num(a[0])))),
      seed: f('seed', () => null),
    });
    return { math, random };
  }

  /* ───────────── API pública ───────────── */
  const FRIENDLY = {
    SyntaxError: 'Python no entendió cómo está escrita esa línea. Revisa paréntesis, comillas, dos puntos (:) y que no falte ninguna palabra.',
    IndentationError: 'La sangría (los espacios al inicio de la línea) no es correcta. Todo lo que va dentro de un if, for, while o def debe llevar el mismo espacio.',
    NameError: 'Usaste un nombre que Python no conoce. Revisa que la variable exista y que esté escrita igual (mayúsculas y minúsculas cuentan).',
    TypeError: 'Mezclaste tipos de datos que no se pueden combinar (por ejemplo texto con número). Revisa los tipos con str(), int() o float().',
    ValueError: 'El valor no es el esperado para esa operación (por ejemplo, convertir "hola" a número).',
    IndexError: 'Pediste una posición que no existe en la lista o texto. Recuerda que se empieza a contar desde 0.',
    KeyError: 'Buscaste una clave que no está en el diccionario.',
    ZeroDivisionError: 'No se puede dividir entre cero. Revisa el divisor.',
    EOFError: 'El programa pidió un dato con input() pero no había más datos. Escribe los valores de entrada (uno por línea).',
    RecursionError: 'La función se llamó a sí misma demasiadas veces. Falta un caso base que detenga la recursión.',
    TimeoutError: 'El programa tardó demasiado. Revisa que tus ciclos while tengan una condición que termine.',
    AttributeError: 'Intentaste usar un método o atributo que ese tipo de dato no tiene.',
    ModuleNotFoundError: 'Ese módulo no está disponible en este simulador.',
  };
  function run(source, opts) {
    opts = opts || {};
    const I = new Interp(opts);
    let error = null;
    try {
      const toks = tokenize(source); const prog = new Parser(toks).program(); I.runProgram(prog);
    } catch (e) {
      let pe = e;
      if (e instanceof RangeError) pe = err('RecursionError', 'maximum recursion depth exceeded');
      if (pe instanceof BreakSig || pe instanceof ContinueSig) pe = err('SyntaxError', "'break' o 'continue' fuera de un ciclo");
      if (pe instanceof ReturnSig) pe = err('SyntaxError', "'return' fuera de una función");
      if (!(pe instanceof PyError)) { pe = err('InternalError', 'Error interno del simulador: ' + (e && e.message)); }
      error = { type: pe.pyType, message: pe.pyMsg, line: pe.line, friendly: FRIENDLY[pe.pyType] || '' };
    }
    const output = I.out.join('');
    return { output, error, ok: !error, steps: I.steps };
  }
  return { run, tokenize, str, repr, PyFloat, PyError, formatValue };
});
