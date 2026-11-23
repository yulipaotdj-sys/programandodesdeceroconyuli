/* SqlRun — mini motor SQL en memoria para practicar SELECT/INSERT/UPDATE/DELETE/JOIN/GROUP BY. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.SqlRun = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  class SqlError extends Error { }
  const fail = m => { throw new SqlError(m); };
  const KW = new Set(['select', 'from', 'where', 'group', 'by', 'order', 'having', 'limit', 'offset', 'insert', 'into', 'values', 'update', 'set', 'delete', 'create', 'table', 'drop', 'join', 'inner', 'left', 'right', 'outer', 'on', 'as', 'and', 'or', 'not', 'in', 'like', 'between', 'is', 'null', 'distinct', 'asc', 'desc', 'primary', 'key', 'foreign', 'references', 'unique', 'default', 'cross', 'if', 'exists', 'true', 'false']);

  function tokenize(sql) {
    const t = []; let i = 0; const n = sql.length;
    while (i < n) {
      const c = sql[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === '-' && sql[i + 1] === '-') { while (i < n && sql[i] !== '\n') i++; continue; }
      if (c === "'") { let s = ''; i++; for (; ;) { if (i >= n) fail('Falta cerrar una comilla simple (\').'); if (sql[i] === "'") { if (sql[i + 1] === "'") { s += "'"; i += 2; continue; } i++; break; } s += sql[i++]; } t.push({ k: 'str', v: s }); continue; }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(sql[i + 1] || ''))) { const m = /^\d*\.?\d+/.exec(sql.slice(i)); t.push({ k: 'num', v: Number(m[0]) }); i += m[0].length; continue; }
      if (/[A-Za-z_\u00C0-\uFFFF]/.test(c)) { const m = /^[\w\u00C0-\uFFFF]+/.exec(sql.slice(i)); const w = m[0]; t.push({ k: 'id', v: w, lw: w.toLowerCase(), kw: KW.has(w.toLowerCase()) }); i += w.length; continue; }
      if (c === '"' || c === '`') { const j = sql.indexOf(c, i + 1); if (j < 0) fail('Falta cerrar unas comillas.'); t.push({ k: 'id', v: sql.slice(i + 1, j), lw: sql.slice(i + 1, j).toLowerCase(), kw: false }); i = j + 1; continue; }
      const two = sql.substr(i, 2);
      if (['<=', '>=', '<>', '!='].includes(two)) { t.push({ k: 'op', v: two === '!=' ? '<>' : two }); i += 2; continue; }
      if ('=<>(),*.+-/%;'.includes(c)) { t.push({ k: 'op', v: c }); i++; continue; }
      fail("Carácter no válido en SQL: '" + c + "'");
    }
    return t;
  }

  class P {
    constructor(toks) { this.t = toks; this.p = 0; }
    peek(o = 0) { return this.t[this.p + o]; }
    isKw(w, o = 0) { const x = this.peek(o); return x && x.k === 'id' && x.lw === w; }
    isOp(v, o = 0) { const x = this.peek(o); return x && x.k === 'op' && x.v === v; }
    eatKw(w) { if (this.isKw(w)) { this.p++; return true; } return false; }
    eatOp(v) { if (this.isOp(v)) { this.p++; return true; } return false; }
    expectKw(w) { if (!this.eatKw(w)) fail('Se esperaba ' + w.toUpperCase() + (this.peek() ? ' cerca de "' + (this.peek().v) + '"' : ' pero la consulta terminó')); }
    expectOp(v) { if (!this.eatOp(v)) fail("Se esperaba '" + v + "'" + (this.peek() ? ' cerca de "' + this.peek().v + '"' : ' pero la consulta terminó')); }
    ident() { const x = this.peek(); if (!x || x.k !== 'id' || (x.kw && !['key'].includes(x.lw))) fail('Se esperaba un nombre' + (x ? ' y llegó "' + x.v + '"' : '')); this.p++; return x.v; }
    statement() {
      if (this.isKw('select')) return this.select();
      if (this.eatKw('insert')) {
        this.expectKw('into'); const table = this.ident(); let cols = null;
        if (this.eatOp('(')) { cols = [this.ident()]; while (this.eatOp(',')) cols.push(this.ident()); this.expectOp(')'); }
        this.expectKw('values'); const rows = [];
        do { this.expectOp('('); const r = [this.expr()]; while (this.eatOp(',')) r.push(this.expr()); this.expectOp(')'); rows.push(r); } while (this.eatOp(','));
        return { type: 'insert', table, cols, rows };
      }
      if (this.eatKw('update')) {
        const table = this.ident(); this.expectKw('set'); const sets = [];
        do { const c = this.ident(); this.expectOp('='); sets.push([c, this.expr()]); } while (this.eatOp(','));
        const where = this.eatKw('where') ? this.expr() : null; return { type: 'update', table, sets, where };
      }
      if (this.eatKw('delete')) { this.expectKw('from'); const table = this.ident(); const where = this.eatKw('where') ? this.expr() : null; return { type: 'delete', table, where }; }
      if (this.eatKw('create')) {
        this.expectKw('table'); if (this.eatKw('if')) { this.expectKw('not'); this.expectKw('exists'); } const table = this.ident(); this.expectOp('('); const cols = [];
        do {
          if (this.isKw('primary') || this.isKw('foreign') || this.isKw('unique')) { let d = 0; while (this.peek() && !(d === 0 && (this.isOp(',') || this.isOp(')')))) { if (this.isOp('(')) d++; if (this.isOp(')')) d--; this.p++; } continue; }
          const name = this.ident(); let d = 0;
          while (this.peek() && !(d === 0 && (this.isOp(',') || this.isOp(')')))) { if (this.isOp('(')) d++; if (this.isOp(')')) d--; this.p++; }
          cols.push(name);
        } while (this.eatOp(','));
        this.expectOp(')'); return { type: 'create', table, cols };
      }
      if (this.eatKw('drop')) { this.expectKw('table'); if (this.eatKw('if')) this.expectKw('exists'); return { type: 'drop', table: this.ident() }; }
      fail('La consulta debe empezar con SELECT, INSERT, UPDATE, DELETE o CREATE TABLE.');
    }
    select() {
      this.expectKw('select'); const distinct = this.eatKw('distinct'); const items = [];
      do {
        if (!this.peek()) fail('La consulta está incompleta: después de SELECT debes indicar qué columnas quieres.');
        if (this.eatOp('*')) items.push({ star: true });
        else if (this.peek().k === 'id' && this.isOp('.', 1) && this.isOp('*', 2)) { const tb = this.ident(); this.p += 2; items.push({ star: true, table: tb }); }
        else { const e = this.expr(); let alias = null; if (this.eatKw('as')) alias = this.ident(); else if (this.peek() && this.peek().k === 'id' && !this.peek().kw) alias = this.ident(); items.push({ e, alias }); }
      } while (this.eatOp(','));
      const q = { type: 'select', distinct, items, from: null, joins: [], where: null, group: null, having: null, order: [], limit: null, offset: 0 };
      if (this.eatKw('from')) {
        q.from = this.tableRef();
        for (; ;) {
          let kind = null;
          if (this.eatKw('inner')) { this.expectKw('join'); kind = 'inner'; } else if (this.eatKw('left')) { this.eatKw('outer'); this.expectKw('join'); kind = 'left'; } else if (this.eatKw('cross')) { this.expectKw('join'); kind = 'cross'; } else if (this.eatKw('join')) kind = 'inner'; else if (this.eatOp(',')) kind = 'cross';
          if (!kind) break;
          const ref = this.tableRef(); let on = null; if (kind !== 'cross') { this.expectKw('on'); on = this.expr(); } q.joins.push({ kind, ref, on });
        }
      }
      if (this.eatKw('where')) q.where = this.expr();
      if (this.eatKw('group')) { this.expectKw('by'); q.group = [this.expr()]; while (this.eatOp(',')) q.group.push(this.expr()); }
      if (this.eatKw('having')) q.having = this.expr();
      if (this.eatKw('order')) { this.expectKw('by'); do { const e = this.expr(); let dir = 1; if (this.eatKw('desc')) dir = -1; else this.eatKw('asc'); q.order.push({ e, dir }); } while (this.eatOp(',')); }
      if (this.eatKw('limit')) { q.limit = this.expr(); if (this.eatKw('offset')) q.offset = this.expr(); }
      return q;
    }
    tableRef() { const name = this.ident(); let alias = name; if (this.eatKw('as')) alias = this.ident(); else if (this.peek() && this.peek().k === 'id' && !this.peek().kw) alias = this.ident(); return { name, alias }; }
    expr() { return this.or(); }
    or() { let l = this.and(); while (this.eatKw('or')) l = { op: 'or', l, r: this.and() }; return l; }
    and() { let l = this.not(); while (this.eatKw('and')) l = { op: 'and', l, r: this.not() }; return l; }
    not() { if (this.eatKw('not')) return { op: 'not', v: this.not() }; return this.cmp(); }
    cmp() {
      const l = this.add(); const x = this.peek();
      if (x && x.k === 'op' && ['=', '<>', '<', '>', '<=', '>='].includes(x.v)) { this.p++; return { op: x.v, l, r: this.add() }; }
      let neg = false; if (this.isKw('not') && (this.isKw('like', 1) || this.isKw('in', 1) || this.isKw('between', 1))) { this.p++; neg = true; }
      if (this.eatKw('like')) return { op: 'like', l, r: this.add(), neg };
      if (this.eatKw('in')) { this.expectOp('('); const list = [this.expr()]; while (this.eatOp(',')) list.push(this.expr()); this.expectOp(')'); return { op: 'in', l, list, neg }; }
      if (this.eatKw('between')) { const a = this.add(); this.expectKw('and'); const b = this.add(); return { op: 'between', l, a, b, neg }; }
      if (this.eatKw('is')) { const n = this.eatKw('not'); this.expectKw('null'); return { op: 'isnull', l, neg: n }; }
      return l;
    }
    add() { let l = this.mul(); while (this.isOp('+') || this.isOp('-')) { const o = this.peek().v; this.p++; l = { op: o, l, r: this.mul() }; } return l; }
    mul() { let l = this.unary(); while (this.isOp('*') || this.isOp('/') || this.isOp('%')) { const o = this.peek().v; this.p++; l = { op: o, l, r: this.unary() }; } return l; }
    unary() { if (this.eatOp('-')) return { op: 'neg', v: this.unary() }; return this.primary(); }
    primary() {
      const x = this.peek(); if (!x) fail('La consulta está incompleta.');
      if (x.k === 'num') { this.p++; return { lit: x.v }; }
      if (x.k === 'str') { this.p++; return { lit: x.v }; }
      if (x.k === 'op' && x.v === '(') { this.p++; const e = this.expr(); this.expectOp(')'); return e; }
      if (x.k === 'id') {
        if (x.lw === 'null') { this.p++; return { lit: null }; }
        if (x.lw === 'true') { this.p++; return { lit: 1 }; } if (x.lw === 'false') { this.p++; return { lit: 0 }; }
        if (this.isOp('(', 1)) {
          const fn = x.lw; this.p += 2; let distinct = false; const args = [];
          if (this.eatOp('*')) args.push({ star: true }); else if (!this.isOp(')')) { distinct = this.eatKw('distinct'); args.push(this.expr()); while (this.eatOp(',')) args.push(this.expr()); }
          this.expectOp(')'); return { fn, args, distinct };
        }
        if (x.kw) fail('No se esperaba "' + x.v + '" aquí.');
        this.p++;
        if (this.isOp('.') && this.peek(1) && this.peek(1).k === 'id') { this.p++; const col = this.peek().v; this.p++; return { col, table: x.v }; }
        return { col: x.v };
      }
      fail('No se entiende "' + x.v + '".');
    }
  }

  const AGG = new Set(['count', 'sum', 'avg', 'min', 'max']);
  const hasAgg = e => !!e && typeof e === 'object' && ((e.fn && AGG.has(e.fn)) || (e.l && hasAgg(e.l)) || (e.r && hasAgg(e.r)) || (e.v && hasAgg(e.v)) || (e.args && e.args.some(hasAgg)));
  const truthy = v => v !== null && v !== undefined && v !== 0 && v !== false && v !== '';
  const cmpv = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  function colGet(env, e) {
    if (e.table) { const k = e.table.toLowerCase() + '.' + e.col.toLowerCase(); if (!(k in env)) fail("No existe la columna '" + e.table + '.' + e.col + "'."); return env[k]; }
    const k = e.col.toLowerCase();
    if (!(k in env)) fail("No existe la columna '" + e.col + "'. Revisa cómo se escribe en la tabla.");
    return env[k];
  }
  function ev(e, env, grp) {
    if ('lit' in e) return e.lit;
    if ('col' in e) return colGet(env, e);
    if (e.fn) {
      if (AGG.has(e.fn)) {
        if (!grp) fail('La función ' + e.fn.toUpperCase() + ' solo se puede usar en SELECT (o con GROUP BY/HAVING).');
        if (e.fn === 'count' && e.args[0] && e.args[0].star) return grp.length;
        let vals = grp.map(r => ev(e.args[0], r, null)).filter(v => v !== null && v !== undefined);
        if (e.distinct) vals = [...new Set(vals)];
        if (e.fn === 'count') return vals.length;
        if (!vals.length) return null;
        if (e.fn === 'sum') return vals.reduce((a, b) => a + b, 0);
        if (e.fn === 'avg') return vals.reduce((a, b) => a + b, 0) / vals.length;
        if (e.fn === 'min') return vals.reduce((a, b) => (b < a ? b : a));
        if (e.fn === 'max') return vals.reduce((a, b) => (b > a ? b : a));
      }
      const a = e.args.map(x => ev(x, env, grp));
      switch (e.fn) {
        case 'upper': return a[0] == null ? null : String(a[0]).toUpperCase(); case 'lower': return a[0] == null ? null : String(a[0]).toLowerCase();
        case 'length': return a[0] == null ? null : String(a[0]).length; case 'abs': return Math.abs(a[0]);
        case 'round': return a[1] ? Math.round(a[0] * 10 ** a[1]) / 10 ** a[1] : Math.round(a[0]);
        case 'coalesce': return a.find(v => v !== null && v !== undefined) ?? null;
        case 'substr': case 'substring': return String(a[0]).substr(a[1] - 1, a[2]);
      }
      fail("Función no disponible en este simulador: " + e.fn);
    }
    switch (e.op) {
      case 'and': return truthy(ev(e.l, env, grp)) && truthy(ev(e.r, env, grp)) ? 1 : 0;
      case 'or': return truthy(ev(e.l, env, grp)) || truthy(ev(e.r, env, grp)) ? 1 : 0;
      case 'not': return truthy(ev(e.v, env, grp)) ? 0 : 1;
      case 'neg': return -ev(e.v, env, grp);
      case '=': case '<>': case '<': case '>': case '<=': case '>=': {
        const a = ev(e.l, env, grp), b = ev(e.r, env, grp); if (a == null || b == null) return 0;
        const c = (typeof a === 'string' && typeof b === 'string') ? cmpv(a.toLowerCase(), b.toLowerCase()) : cmpv(a, b);
        return ({ '=': c === 0, '<>': c !== 0, '<': c < 0, '>': c > 0, '<=': c <= 0, '>=': c >= 0 })[e.op] ? 1 : 0;
      }
      case 'like': { const a = ev(e.l, env, grp), b = ev(e.r, env, grp); if (a == null || b == null) return 0; const re = new RegExp('^' + String(b).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i'); return (re.test(String(a)) !== !!e.neg) ? 1 : 0; }
      case 'in': { const a = ev(e.l, env, grp); const hit = e.list.some(x => { const b = ev(x, env, grp); return (typeof a === 'string' && typeof b === 'string') ? a.toLowerCase() === b.toLowerCase() : a === b; }); return hit !== !!e.neg ? 1 : 0; }
      case 'between': { const a = ev(e.l, env, grp), lo = ev(e.a, env, grp), hi = ev(e.b, env, grp); return ((a >= lo && a <= hi) !== !!e.neg) ? 1 : 0; }
      case 'isnull': { const a = ev(e.l, env, grp); return ((a === null || a === undefined) !== !!e.neg) ? 1 : 0; }
      case '+': { const a = ev(e.l, env, grp), b = ev(e.r, env, grp); return a == null || b == null ? null : a + b; }
      case '-': return ev(e.l, env, grp) - ev(e.r, env, grp); case '*': return ev(e.l, env, grp) * ev(e.r, env, grp);
      case '/': { const b = ev(e.r, env, grp); return b === 0 ? null : ev(e.l, env, grp) / b; } case '%': return ev(e.l, env, grp) % ev(e.r, env, grp);
    }
    fail('Expresión no soportada.');
  }

  function getTable(db, name) { const k = Object.keys(db).find(x => x.toLowerCase() === name.toLowerCase()); if (!k) fail("No existe la tabla '" + name + "'."); return db[k]; }
  function envFor(alias, tbl, row) { const env = {}; tbl.cols.forEach((c, i) => { env[alias.toLowerCase() + '.' + c.toLowerCase()] = row[i]; const k = c.toLowerCase(); env[k] = row[i]; }); return env; }
  function nullEnv(alias, tbl) { return envFor(alias, tbl, tbl.cols.map(() => null)); }

  function execSelect(db, q) {
    let rows = [{}]; const allCols = [];
    if (q.from) {
      const t = getTable(db, q.from.name); rows = t.rows.map(r => envFor(q.from.alias, t, r)); allCols.push({ alias: q.from.alias, t });
      for (const j of q.joins) {
        const t2 = getTable(db, j.ref.name); const out = [];
        for (const l of rows) {
          let matched = false;
          for (const r2 of t2.rows) { const env = { ...l, ...envFor(j.ref.alias, t2, r2) }; if (!j.on || truthy(ev(j.on, env))) { out.push(env); matched = true; } }
          if (!matched && j.kind === 'left') out.push({ ...l, ...nullEnv(j.ref.alias, t2) });
        }
        rows = out; allCols.push({ alias: j.ref.alias, t: t2 });
      }
    }
    if (q.where) rows = rows.filter(r => truthy(ev(q.where, r)));
    // columnas de salida
    const outCols = []; const outExprs = [];
    for (const it of q.items) {
      if (it.star) { if (!q.from) fail('SELECT * necesita FROM.'); for (const a of allCols) { if (it.table && a.alias.toLowerCase() !== it.table.toLowerCase()) continue; for (const c of a.t.cols) { outCols.push(c); outExprs.push({ col: c, table: a.alias }); } } }
      else { outCols.push(it.alias || (it.e.col ? it.e.col : (it.e.fn ? it.e.fn + '(' + (it.e.args[0] && it.e.args[0].star ? '*' : (it.e.args[0] && it.e.args[0].col) || '') + ')' : 'expr'))); outExprs.push(it.e); }
    }
    const aggregate = q.group || outExprs.some(hasAgg) || hasAgg(q.having);
    let result;
    if (aggregate) {
      const groups = new Map();
      if (q.group) { for (const r of rows) { const k = JSON.stringify(q.group.map(g => ev(g, r))); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); } }
      else groups.set('all', rows);
      result = [];
      for (const g of groups.values()) {
        const rep = g[0] || {};
        if (!g.length && q.group) continue;
        if (q.having && !truthy(ev(q.having, rep, g))) continue;
        result.push({ vals: outExprs.map(e => ev(e, rep, g)), env: rep, grp: g });
      }
    } else result = rows.map(r => ({ vals: outExprs.map(e => ev(e, r)), env: r, grp: null }));
    if (q.order.length) {
      result.sort((a, b) => {
        for (const o of q.order) {
          let va, vb;
          if (o.e.col && !o.e.table && outCols.some(c => c.toLowerCase() === o.e.col.toLowerCase()) && !(o.e.col.toLowerCase() in a.env)) { const i = outCols.findIndex(c => c.toLowerCase() === o.e.col.toLowerCase()); va = a.vals[i]; vb = b.vals[i]; }
          else { va = ev(o.e, a.env, a.grp); vb = ev(o.e, b.env, b.grp); }
          if (va === vb) continue; if (va == null) return -o.dir; if (vb == null) return o.dir;
          const c = (typeof va === 'string' && typeof vb === 'string') ? cmpv(va.toLowerCase(), vb.toLowerCase()) : cmpv(va, vb); if (c) return c * o.dir;
        } return 0;
      });
    }
    let out = result.map(r => r.vals);
    if (q.distinct) { const seen = new Set(); out = out.filter(r => { const k = JSON.stringify(r); if (seen.has(k)) return false; seen.add(k); return true; }); }
    if (q.limit) { const off = q.offset ? ev(q.offset, {}) : 0; out = out.slice(off, off + ev(q.limit, {})); }
    return { cols: outCols, rows: out };
  }

  function execOne(db, st) {
    switch (st.type) {
      case 'select': return execSelect(db, st);
      case 'create': if (Object.keys(db).some(k => k.toLowerCase() === st.table.toLowerCase())) fail("La tabla '" + st.table + "' ya existe."); db[st.table] = { cols: st.cols, rows: [] }; return { msg: "Tabla '" + st.table + "' creada." };
      case 'drop': { const k = Object.keys(db).find(x => x.toLowerCase() === st.table.toLowerCase()); if (!k) fail("No existe la tabla '" + st.table + "'."); delete db[k]; return { msg: 'Tabla eliminada.' }; }
      case 'insert': {
        const t = getTable(db, st.table); let n = 0;
        for (const r of st.rows) {
          const cols = st.cols || t.cols; if (r.length !== cols.length) fail('La cantidad de valores (' + r.length + ') no coincide con la cantidad de columnas (' + cols.length + ').');
          const row = t.cols.map(() => null);
          cols.forEach((c, i) => { const idx = t.cols.findIndex(x => x.toLowerCase() === c.toLowerCase()); if (idx < 0) fail("No existe la columna '" + c + "'."); row[idx] = ev(r[i], {}); });
          t.rows.push(row); n++;
        }
        return { msg: n + ' fila(s) insertada(s).', changed: n };
      }
      case 'update': {
        const t = getTable(db, st.table); let n = 0;
        for (const row of t.rows) { const env = envFor(st.table, t, row); if (!st.where || truthy(ev(st.where, env))) { for (const [c, e] of st.sets) { const idx = t.cols.findIndex(x => x.toLowerCase() === c.toLowerCase()); if (idx < 0) fail("No existe la columna '" + c + "'."); row[idx] = ev(e, env); } n++; } }
        return { msg: n + ' fila(s) actualizada(s).', changed: n };
      }
      case 'delete': {
        const t = getTable(db, st.table); const before = t.rows.length;
        t.rows = t.rows.filter(row => !(!st.where || truthy(ev(st.where, envFor(st.table, t, row)))));
        return { msg: (before - t.rows.length) + ' fila(s) eliminada(s).', changed: before - t.rows.length };
      }
    }
  }
  const clone = db => JSON.parse(JSON.stringify(db || {}));
  function splitStatements(sql) { const out = []; let cur = '', q = false; for (const ch of sql) { if (ch === "'") q = !q; if (ch === ';' && !q) { if (cur.trim()) out.push(cur); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur); return out; }
  /* Ejecuta varias sentencias sobre una copia de la base. Devuelve { results, db, error } */
  function run(db, sql) {
    const d = clone(db); const results = []; let error = null;
    try {
      const stmts = splitStatements(sql); if (!stmts.length) fail('Escribe una consulta SQL.');
      for (const s of stmts) { const toks = tokenize(s); const p = new P(toks); const st = p.statement(); if (p.p < toks.length) fail('Sobra texto al final: "' + toks[p.p].v + '"'); results.push(execOne(d, st)); }
    } catch (e) { if (e instanceof SqlError) error = e.message; else error = 'La consulta está incompleta o mal escrita. Revisa cada palabra y los paréntesis.'; }
    return { results, db: d, error };
  }
  const normCell = v => (typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v);
  const rowKey = r => JSON.stringify(r.map(normCell));
  function sameRows(a, b, ordered) { if (a.length !== b.length) return false; const x = a.map(rowKey), y = b.map(rowKey); if (!ordered) { x.sort(); y.sort(); } return x.every((v, i) => v === y[i]); }
  function grade(ex, sql) {
    const r = run(ex.db, sql); const out = { ok: false, error: r.error, cols: null, rows: null, results: r.results };
    if (r.error) return out;
    if (ex.expect) {
      const sel = [...r.results].reverse().find(x => x.rows); if (!sel) { out.error = 'Tu consulta no devolvió resultados (usa SELECT).'; return out; }
      out.cols = sel.cols; out.rows = sel.rows;
      let ok = sameRows(sel.rows, ex.expect.rows, !!ex.expect.ordered);
      if (ok && ex.expect.cols) ok = ex.expect.cols.length === sel.cols.length && ex.expect.cols.every((c, i) => c.toLowerCase() === String(sel.cols[i]).toLowerCase());
      out.ok = ok;
    }
    if (ex.expectTable) {
      const t = Object.keys(r.db).find(k => k.toLowerCase() === ex.expectTable.name.toLowerCase());
      if (!t) { out.ok = false; return out; }
      out.cols = r.db[t].cols; out.rows = r.db[t].rows;
      out.ok = sameRows(r.db[t].rows, ex.expectTable.rows, !!ex.expectTable.ordered);
      if (ex.expect) out.ok = out.ok && sameRows([...r.results].reverse().find(x => x.rows).rows, ex.expect.rows, !!ex.expect.ordered);
    }
    return out;
  }
  return { run, grade, tokenize };
});
