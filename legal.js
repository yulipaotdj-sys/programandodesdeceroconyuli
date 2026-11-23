/* Textos legales: Política de privacidad, Términos de uso y Contacto (se usan en la app y para generar las páginas públicas) */
(function (root) {
  const C = () => root.PDC_CONFIG || {};
  const UPDATED = '18 de noviembre de 2026';
  const mail = () => C().contactEmail || '';
  function privacy() {
    const n = C().appName, d = C().developerName;
    return `<h1>Política de privacidad</h1><p class="muted">Última actualización: ${UPDATED}</p>
<p>En <b>${n}</b> (la «app»), desarrollada por <b>${d}</b> («nosotros»), cuidamos tu privacidad. Esta política explica qué datos usa la app, para qué y qué control tienes sobre ellos. Aplica a la app de Android y a su versión web.</p>
<h2>1. Qué datos usamos</h2><ul>
<li><b>Tu progreso de aprendizaje</b>: nombre o apodo que escribes, lecciones terminadas, puntos (XP), monedas, insignias, calificaciones, racha y tiempo de estudio. Se guarda <b>en tu dispositivo</b>.</li>
<li><b>Copia opcional en tu Google Drive</b>: si activas «Guardar mi progreso en mi Drive», la app guarda un archivo con ese progreso en la <b>carpeta oculta de la app</b> en tu propia cuenta de Drive (permiso <code>drive.appdata</code>). La app <b>no puede ver, leer ni modificar ningún otro archivo</b> de tu Drive. Nosotros no recibimos ni almacenamos ese archivo en servidores propios.</li>
<li><b>Datos básicos de tu cuenta de Google</b> (correo y nombre), solo si inicias sesión con Google, únicamente para mostrarte con qué cuenta está conectada la copia.</li>
<li><b>Datos de publicidad</b>: la app muestra anuncios de <b>Google AdMob</b>. AdMob puede recopilar el identificador de publicidad del dispositivo, dirección IP, datos aproximados de ubicación, información del dispositivo y de uso de anuncios para mostrar y medir anuncios, prevenir fraude y, si lo aceptas, personalizarlos. Más información: <a href="https://policies.google.com/technologies/ads">policies.google.com/technologies/ads</a>.</li></ul>
<h2>2. Qué NO hacemos</h2><ul><li>No vendemos tus datos personales.</li><li>No pedimos contraseñas, documentos de identidad, datos de pago ni ubicación exacta.</li><li>No creamos cuentas propias ni perfiles públicos: nadie más ve tu progreso.</li></ul>
<h2>3. Para qué usamos los datos</h2><p>Para que la app funcione (guardar tu avance, calcular puntos, mostrar tu certificado), para sincronizar tu progreso con tu Drive si lo activas, y para mostrar anuncios que mantienen la app gratuita.</p>
<h2>4. Consentimiento y anuncios personalizados</h2><p>Donde la ley lo exige (por ejemplo, Espacio Económico Europeo y Reino Unido) te mostraremos un formulario de consentimiento. Puedes cambiar tu elección en Perfil → «Opciones de privacidad de anuncios», o en los ajustes de anuncios de tu dispositivo.</p>
<h2>5. Compartir información</h2><p>Solo con proveedores necesarios para operar la app: <b>Google</b> (AdMob para anuncios; Google Drive e inicio de sesión si los activas). Estos servicios tienen sus propias políticas de privacidad. No compartimos información con terceros para otros fines.</p>
<h2>6. Conservación y eliminación</h2><ul><li><b>En tu dispositivo</b>: Perfil → «Borrar todo mi progreso», o desinstala la app.</li><li><b>En tu Drive</b>: Perfil → «Desconectar Drive» y elige borrar la copia; también puedes revocar el acceso en <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a> y borrar los datos de la app desde la configuración de Drive.</li><li>Si tienes dudas o quieres que atendamos una solicitud de eliminación, escríbenos al correo de contacto.</li></ul>
<h2>7. Seguridad</h2><p>Los datos viajan cifrados (HTTPS) cuando se sincronizan con Google. Ningún sistema es 100 % seguro, pero limitamos los permisos al mínimo necesario.</p>
<h2>8. Menores de edad</h2><p>La app está pensada para personas de <b>13 años o más</b>. No recopilamos a sabiendas datos de menores de 13 años. Si crees que un menor de esa edad usa la app, contáctanos.</p>
<h2>9. Tus derechos</h2><p>Conforme a la Ley 1581 de 2012 de Colombia (protección de datos personales) y normas equivalentes, puedes conocer, actualizar, rectificar y solicitar la supresión de tus datos, y revocar tu autorización. Gran parte puedes hacerlo tú misma desde la app; para lo demás, escríbenos.</p>
<h2>10. Cambios a esta política</h2><p>Podemos actualizarla. Publicaremos la nueva versión en la app y cambiaremos la fecha de arriba.</p>
<h2>11. Contacto</h2><p>${d} — <a href="mailto:${mail()}">${mail()}</a></p>`;
  }
  function terms() {
    const n = C().appName, d = C().developerName;
    return `<h1>Términos de uso</h1><p class="muted">Última actualización: ${UPDATED}</p>
<p>Al usar <b>${n}</b> aceptas estos términos. Si no estás de acuerdo, por favor no uses la app.</p>
<h2>1. Qué es la app</h2><p>Es una app educativa gratuita, en formato de juego, para aprender fundamentos de programación. Está financiada con publicidad.</p>
<h2>2. Licencia de uso</h2><p>Te damos una licencia personal, no exclusiva e intransferible para usar la app con fines de aprendizaje. No puedes copiar, vender, redistribuir, descompilar la app ni usar su contenido con fines comerciales sin permiso por escrito de ${d}.</p>
<h2>3. Contenido educativo</h2><p>El contenido es de carácter formativo general y puede contener errores o quedar desactualizado. No sustituye a un curso formal ni garantiza resultados de empleo o de notas en ninguna institución.</p>
<h2>4. Certificado</h2><p>El certificado que genera la app es un <b>reconocimiento de finalización emitido por la propia app</b>. <b>No es un título oficial</b> ni una certificación académica o profesional, y no está emitido, avalado ni afiliado al SENA ni a ninguna institución educativa.</p>
<h2>5. Tu progreso y tu cuenta</h2><p>Tu progreso se guarda en tu dispositivo y, si lo activas, en tu Google Drive. Eres responsable de tu cuenta de Google. Puede perderse si desinstalas la app sin copia o borras los datos; te recomendamos activar la copia en Drive.</p>
<h2>6. Publicidad</h2><p>La app muestra anuncios de terceros (Google AdMob). No controlamos su contenido. Algunas funciones opcionales ofrecen recompensas por ver un anuncio; verlo siempre es voluntario.</p>
<h2>7. Uso adecuado</h2><p>No uses la app para fines ilegales, para intentar vulnerar su funcionamiento o alterar de forma automatizada tus puntos o certificados.</p>
<h2>8. Propiedad intelectual</h2><p>La app, su diseño, textos, ejercicios y marca son de ${d}. Los nombres de lenguajes y tecnologías mencionados pertenecen a sus respectivos dueños.</p>
<h2>9. Garantía y responsabilidad</h2><p>La app se ofrece «tal cual», sin garantías de funcionamiento ininterrumpido. En la medida permitida por la ley, ${d} no es responsable por daños indirectos o pérdida de datos derivados del uso de la app.</p>
<h2>10. Cambios y terminación</h2><p>Podemos modificar la app o estos términos, o suspender el servicio. Los cambios importantes se avisarán en la app. Si sigues usándola, aceptas la versión actualizada.</p>
<h2>11. Ley aplicable</h2><p>Estos términos se rigen por las leyes de la República de Colombia.</p>
<h2>12. Contacto</h2><p><a href="mailto:${mail()}">${mail()}</a></p>`;
  }
  function contact() {
    const w = C().website;
    return `<h1>Contacto</h1><p>¿Tienes una duda, encontraste un error en una lección o quieres sugerir un tema? Escríbenos, nos encanta leerte.</p>
<ul><li>Correo: <a href="mailto:${mail()}">${mail()}</a></li>${w ? `<li>Sitio web: <a href="${w}">${w}</a></li>` : ''}<li>Desarrolla: ${C().developerName}</li></ul>
<p class="muted">Cuando reportes un error, cuéntanos en qué lección estabas y qué dispositivo usas. Respondemos lo antes posible.</p>`;
  }
  root.Legal = { privacy, terms, contact, page: p => ({ privacidad: privacy, terminos: terms, contacto: contact })[p](), UPDATED };
  if (typeof module === 'object' && module.exports) module.exports = root.Legal;
})(typeof window !== 'undefined' ? window : globalThis);
