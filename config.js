/* ===== CONFIGURACIÓN — edita estos valores antes de publicar ===== */
window.PDC_CONFIG = {
  appName: 'Programando desde Cero con Yuli',
  developerName: 'Yulipao',
  contactEmail: 'tu-correo@ejemplo.com',     // ← CAMBIA por tu correo público de contacto
  website: '',                                // opcional: https://tu-sitio.com
  privacyUrl: 'https://TU-USUARIO.github.io/programando-desde-cero/legal/privacidad.html', // URL pública que pedirá Play Console
  // Google Drive (guardar progreso en el Drive de cada usuaria). Crea un "ID de cliente OAuth" tipo Web en Google Cloud Console.
  googleClientId: '',                         // ← pega aquí tu ID de cliente (termina en .apps.googleusercontent.com)
  driveFileName: 'progreso-programando-desde-cero.json',
  // Anuncios (AdMob). Los IDs de abajo son de PRUEBA de Google: reemplázalos por los tuyos antes de publicar.
  admob: {
    testing: true,                            // ← pon false al publicar con tus IDs reales
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917'
  },
  webFakeAds: true,                           // En la versión web simula anuncios de prueba (ponlo en false para quitarlos)
  interstitialEveryLessons: 3,                // 1 anuncio de pantalla completa cada N lecciones terminadas
  interstitialMinSeconds: 240,                // y nunca más seguido que esto
  version: '1.0.0'
};
