/* Anuncios: AdMob en la app de Android (Capacitor) y anuncios de prueba simulados en la web */
(function () {
  const { h } = U; const C = () => PDC_CONFIG;
  const native = () => !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
  const AdMob = () => window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.AdMob;
  let bannerVisible = false, bar = null;
  const testing = () => !!C().admob.testing;
  async function init() {
    if (native() && AdMob()) {
      try {
        await AdMob().initialize({ initializeForTesting: testing() });
        const info = await AdMob().requestConsentInfo(); // Formulario de consentimiento (UMP) donde la ley lo exige
        if (info.isConsentFormAvailable && info.status === 'REQUIRED') await AdMob().showConsentForm();
      } catch (e) { console.warn('AdMob init', e); }
    }
  }
  async function privacyOptions() { try { if (native() && AdMob()) await AdMob().showPrivacyOptionsForm(); else FX.toast('Disponible en la app de Android'); } catch (e) { FX.toast('No disponible ahora'); } }
  async function banner(show) {
    if (show === bannerVisible) return; bannerVisible = show;
    if (native() && AdMob()) {
      try { if (show) await AdMob().showBanner({ adId: C().admob.banner, adSize: 'ADAPTIVE_BANNER', position: 'BOTTOM_CENTER', margin: 64, isTesting: testing() }); else await AdMob().removeBanner(); } catch (e) { console.warn('banner', e); }
    } else if (C().webFakeAds) {
      if (show) { bar = bar || h('div', { class: 'adbar' }, h('span', { class: 'adtag' }, 'Anuncio'), ' Espacio publicitario de prueba'); document.body.append(bar); } else if (bar) bar.remove();
    }
  }
  function fakeAd(kind) {
    return new Promise(res => {
      let n = kind === 'rewarded' ? 5 : 3; const btn = h('button', { class: 'btn', disabled: true }, 'Espera ' + n + ' s');
      const m = FX.modal(h('div', { class: 'center' }, h('span', { class: 'adtag' }, 'Anuncio de prueba'), h('h3', null, kind === 'rewarded' ? '🎁 Mira el anuncio para ganar la recompensa' : 'Pantalla completa de prueba'), h('p', { class: 'muted' }, 'En la app de Play Store aquí aparece un anuncio real de Google AdMob.'), btn), { sticky: true });
      const t = setInterval(() => { n--; if (n <= 0) { clearInterval(t); btn.disabled = false; btn.textContent = kind === 'rewarded' ? 'Recibir recompensa' : 'Cerrar'; } else btn.textContent = 'Espera ' + n + ' s'; }, 1000);
      btn.onclick = () => { m.close(); res(true); };
    });
  }
  /* Pantalla completa: solo entre lecciones, con frecuencia limitada */
  async function maybeInterstitial() {
    const S = PDC.store.S, c = C(); if (S.ads.since < c.interstitialEveryLessons || Date.now() - S.ads.last < c.interstitialMinSeconds * 1000) return;
    S.ads.since = 0; S.ads.last = Date.now(); PDC.store.save(true);
    if (native() && AdMob()) { try { await AdMob().prepareInterstitial({ adId: c.admob.interstitial, isTesting: testing() }); await AdMob().showInterstitial(); } catch (e) { console.warn('interstitial', e); } }
    else if (c.webFakeAds) await fakeAd('interstitial');
  }
  /* Anuncio con recompensa: el usuario decide verlo. Devuelve true si ganó la recompensa */
  async function rewarded() {
    if (native() && AdMob()) {
      try { await AdMob().prepareRewardVideoAd({ adId: C().admob.rewarded, isTesting: testing() }); const r = await AdMob().showRewardVideoAd(); return !!r; }
      catch (e) { FX.toast('Ahora no hay anuncios disponibles. Inténtalo en un rato.'); return false; }
    }
    if (C().webFakeAds) return fakeAd('rewarded');
    return true;
  }
  window.Ads = { init, banner, maybeInterstitial, rewarded, privacyOptions };
})();
