/* Certificado de finalización: se dibuja en canvas y se exporta como PDF (sin librerías) o PNG */
(function () {
  const W = 1600, H = 1131;
  function stats() {
    const st = PDC.store, S = st.S, core = st.core(); const exams = core.map(w => S.exams[w.id]).filter(Boolean);
    const avg = exams.length ? Math.round(exams.reduce((a, e) => a + e.best, 0) / exams.length) : 0;
    return { avg, grade: (avg / 20).toFixed(1).replace('.', ','), hours: Math.max(0.1, S.seconds / 3600) };
  }
  const eligible = () => PDC.store.core().every(w => PDC.store.examPassed(w));
  function ensureCert() {
    const S = PDC.store.S; if (S.cert) return S.cert; const t = Date.now(); const a = U.hash((S.name || 'x') + t).toString(36).toUpperCase().padStart(7, '0').slice(-7), b = U.hash(t + (S.createdAt || '')).toString(36).toUpperCase().padStart(4, '0').slice(-4);
    S.cert = { at: t, code: 'PDC-' + a + '-' + b }; PDC.store.log('cert', 'Certificado obtenido 🎓'); PDC.store.save(); return S.cert;
  }
  const img = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = (window.__IMG && window.__IMG[src]) || src; });
  function wrap(ctx, text, x, y, maxW, lh) { const words = text.split(' '); let line = ''; for (const w of words) { const t = line + w + ' '; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line.trim(), x, y); line = w + ' '; y += lh; } else line = t; } ctx.fillText(line.trim(), x, y); return y; }
  async function draw() {
    const S = PDC.store.S, c = ensureCert(), s = stats(); const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#fbf9ff'); gr.addColorStop(1, '#efe9ff'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.lineWidth = 14; g.strokeStyle = '#6d3df0'; g.strokeRect(36, 36, W - 72, H - 72); g.lineWidth = 3; g.strokeStyle = '#f472b6'; g.strokeRect(60, 60, W - 120, H - 120); g.strokeStyle = '#fbbf24'; g.lineWidth = 2; g.strokeRect(70, 70, W - 140, H - 140);
    const logo = await img('icons/logo-512.png'); if (logo) g.drawImage(logo, W / 2 - 90, 92, 180, 180);
    g.textAlign = 'center'; g.fillStyle = '#1b1f4b'; g.font = '900 64px Nunito, sans-serif'; g.fillText('CERTIFICADO DE FINALIZACIÓN', W / 2, 340);
    g.font = '700 28px Nunito, sans-serif'; g.fillStyle = '#6b6f93'; g.fillText('Se otorga con orgullo a', W / 2, 392);
    g.fillStyle = '#6d3df0'; g.font = 'italic 900 84px Nunito, serif'; let nm = S.name || 'Estudiante'; while (g.measureText(nm).width > W - 300 && g.font) { g.font = g.font.replace(/(\d+)px/, (m, n) => (n - 4) + 'px'); if (parseInt(g.font.match(/(\d+)px/)[1]) < 40) break; } g.fillText(nm, W / 2, 490);
    g.strokeStyle = '#fbbf24'; g.lineWidth = 3; g.beginPath(); g.moveTo(W / 2 - 340, 512); g.lineTo(W / 2 + 340, 512); g.stroke();
    g.fillStyle = '#1b1f4b'; g.font = '700 30px Nunito, sans-serif'; wrap(g, 'por completar el programa «Programando desde Cero» y aprobar las evaluaciones de todos sus mundos.', W / 2, 570, 1100, 40);
    g.font = '900 24px Nunito, sans-serif'; g.fillStyle = '#6d3df0'; g.fillText('TEMAS Y COMPETENCIAS DESARROLLADAS', W / 2, 660);
    g.font = '700 24px Nunito, sans-serif'; g.fillStyle = '#1b1f4b'; g.textAlign = 'left';
    const comps = ['Pensamiento lógico y algoritmos', 'Programación en Python', 'Resolución de problemas', 'Desarrollo web: HTML, CSS y JavaScript', 'Bases de datos y SQL', 'Ingeniería de software, Git y Scrum', 'Proyectos propios de software'];
    comps.forEach((t, i) => { const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4; g.fillText('✔ ' + t, col ? 880 : 250, 706 + row * 38); });
    if (S.exams.en && S.exams.en.passed) g.fillText('✔ Inglés para programadores (extra)', 880, 706 + 3 * 38);
    g.textAlign = 'center'; g.fillStyle = '#1b1f4b'; g.font = '800 26px Nunito, sans-serif';
    g.fillText('Calificación final: ' + s.grade + ' / 5,0 (' + s.avg + ' %)   ·   Horas de estudio registradas: ' + s.hours.toFixed(1).replace('.', ','), W / 2, 880);
    g.font = '700 24px Nunito, sans-serif'; g.fillStyle = '#6b6f93'; g.fillText('Fecha de finalización: ' + U.fmtDate(c.at) + '   ·   Código único: ' + c.code, W / 2, 920);
    g.strokeStyle = '#1b1f4b'; g.lineWidth = 2; g.beginPath(); g.moveTo(W / 2 - 160, 1010); g.lineTo(W / 2 + 160, 1010); g.stroke();
    g.fillStyle = '#6d3df0'; g.font = 'italic 900 52px "Brush Script MT", "Segoe Script", cursive'; g.fillText('Profe Yuli', W / 2, 995); g.fillStyle = '#6b6f93'; g.font = '700 20px Nunito, sans-serif'; g.fillText('Profe virtual · firma decorativa', W / 2, 1038);
    g.font = '700 17px Nunito, sans-serif'; g.fillText('Este documento es un reconocimiento de finalización emitido por la aplicación. No es un título oficial ni una certificación académica del SENA ni de otra institución.', W / 2, 1075);
    return cv;
  }
  /* PDF mínimo con la imagen JPEG a página completa (A4 horizontal) */
  function pdfFromCanvas(cv) {
    const jpg = atob(cv.toDataURL('image/jpeg', .92).split(',')[1]); const bytes = new Uint8Array(jpg.length); for (let i = 0; i < jpg.length; i++) bytes[i] = jpg.charCodeAt(i);
    const enc = s => new TextEncoder().encode(s); const parts = []; const offs = []; let len = 0; const push = b => { parts.push(b); len += b.length; };
    const obj = (n, body) => { offs[n] = len; push(enc(n + ' 0 obj\n')); push(typeof body === 'string' ? enc(body) : body); push(enc('\nendobj\n')); };
    push(enc('%PDF-1.4\n')); obj(1, '<< /Type /Catalog /Pages 2 0 R >>'); obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
    offs[4] = len; push(enc('4 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + cv.width + ' /Height ' + cv.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + bytes.length + ' >>\nstream\n')); push(bytes); push(enc('\nendstream\nendobj\n'));
    const cs = 'q 842 0 0 595 0 0 cm /Im0 Do Q'; obj(5, '<< /Length ' + cs.length + ' >>\nstream\n' + cs + '\nendstream');
    const xr = len; let x = 'xref\n0 6\n0000000000 65535 f \n'; for (let i = 1; i <= 5; i++) x += String(offs[i]).padStart(10, '0') + ' 00000 n \n'; push(enc(x + 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xr + '\n%%EOF'));
    return new Blob(parts, { type: 'application/pdf' });
  }
  async function save(blob, name) {
    const C = window.Capacitor; if (C && C.isNativePlatform && C.isNativePlatform() && C.Plugins.Filesystem && C.Plugins.Share) {
      try { const b64 = await new Promise(r => { const f = new FileReader(); f.onload = () => r(String(f.result).split(',')[1]); f.readAsDataURL(blob); }); const w = await C.Plugins.Filesystem.writeFile({ path: name, data: b64, directory: 'CACHE' }); await C.Plugins.Share.share({ title: 'Mi certificado', url: w.uri, dialogTitle: 'Guardar o compartir certificado' }); return; } catch (e) { console.warn(e); }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  async function print() { const cv = await draw(); const w = document.createElement('div'); w.className = 'print-only'; const i = new Image(); i.src = cv.toDataURL('image/png'); i.style.cssText = 'width:100%;height:auto'; w.append(i); document.body.append(w); i.onload = () => { try { window.print(); } catch (e) { } setTimeout(() => w.remove(), 800); }; }
  window.Cert = { draw, pdfFromCanvas, save, print, eligible, ensureCert, stats };
})();
