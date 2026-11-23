registerWorld({
  id: 'm4', n: 4, title: 'Desarrollo web', subtitle: 'Construye páginas que viven en Internet', emoji: '🌐', color: '#f97316',
  intro: 'Bienvenida al mundo web. Aquí vas a entender cómo viaja una página desde un servidor hasta tu celular y a construir las tuyas con HTML, CSS y JavaScript. Al final tendrás tu propia tarjeta de presentación.',
  badge: { name: 'Tejedora web', emoji: '🌐' },
  lessons: [
    // ───────────── L1 ─────────────
    {
      id: 'm4-l1', title: 'Cómo funciona Internet', emoji: '🌍', minutes: 7,
      learn: [
        { title: 'Cliente y servidor', blocks: [
          { t: 'p', text: 'Cuando abres una página, dos computadores hablan entre sí. El **cliente** pide información y el **servidor** la entrega.' },
          { t: 'p', text: 'Tu celular o tu portátil es el cliente. El servidor es un computador potente, encendido todo el día, que guarda las páginas.' },
          { t: 'analogy', text: 'Es como un restaurante: tú eres la clienta, la cocina es el servidor y el mesero lleva tu pedido y trae la comida.' },
        ] },
        { title: 'Navegador y URL', blocks: [
          { t: 'p', text: 'El **navegador** (Chrome, Firefox, Safari) es el programa que pide páginas y las dibuja en tu pantalla. Es tu "mesero".' },
          { t: 'p', text: 'La **URL** es la dirección de una página, como la dirección de un local. Tiene partes:' },
          { t: 'table', head: ['Parte', 'Ejemplo', 'Qué dice'], rows: [['Protocolo', 'https://', 'Cómo hablar con el servidor'], ['Dominio', 'www.tiendadedoña.co', 'Qué servidor buscar'], ['Ruta', '/arepas', 'Qué página pedir']] },
        ] },
        { title: 'HTTP: el idioma del pedido', blocks: [
          { t: 'p', text: '**HTTP** es el idioma con el que cliente y servidor se entienden. **HTTPS** es lo mismo pero cifrado, así nadie espía tus datos.' },
          { t: 'steps', items: ['Escribes una URL en el navegador.', 'El navegador envía una petición (request) al servidor.', 'El servidor responde con HTML, CSS y JavaScript.', 'El navegador dibuja la página.'] },
          { t: 'tip', text: 'Si ves un candado junto a la URL, la página usa HTTPS. Úsalo siempre al poner datos o pagar.' },
        ] },
        { title: 'Las tres lenguas de la web', blocks: [
          { t: 'list', items: ['**HTML**: el esqueleto y el contenido (títulos, textos, imágenes).', '**CSS**: la ropa y la decoración (colores, tamaños, posición).', '**JavaScript**: el movimiento (botones que reaccionan, cálculos).'] },
          { t: 'analogy', text: 'Una casa: HTML son las paredes, CSS la pintura y JavaScript la electricidad que hace funcionar las luces.' },
        ] },
      ],
      example: {
        title: 'Pedir una página de una panadería',
        story: 'Laura escribe https://www.panaderiaesperanza.co/pan en su celular. El navegador pregunta al servidor y este responde con la página del pan. Aquí tienes una página mínima, como la que recibiría.',
        code: { lang: 'html', code: '<h1>Panadería Esperanza</h1>\n<p>Pan fresco todos los días.</p>', run: true },
        note: 'Esto es HTML: lo que el servidor envía y el navegador dibuja.',
      },
      practice: [
        { type: 'mcq', q: 'En la analogía del restaurante, ¿quién es el servidor?', options: ['La clienta que pide', 'La cocina que prepara y entrega', 'El menú impreso'], answer: 1,
          wrong: { 0: 'La clienta es el cliente: quien pide.', 2: 'El menú se parece más a la URL: indica qué puedes pedir.' }, explain: 'El servidor guarda y entrega la información, como la cocina entrega los platos.', hints: ['El servidor responde, no pide.'] },
        { type: 'match', q: 'Une cada término con su significado:', pairs: [['Cliente', 'Quien pide la página'], ['Servidor', 'Quien guarda y entrega la página'], ['Navegador', 'Programa que dibuja la página'], ['URL', 'Dirección de la página']], explain: 'Cliente pide, servidor responde, navegador muestra y la URL dice dónde está.' },
        { type: 'order', q: 'Ordena lo que pasa al abrir una página:', items: ['Escribes la URL', 'El navegador envía la petición', 'El servidor envía la respuesta', 'El navegador dibuja la página'], explain: 'Primero pides, luego el servidor responde y al final el navegador muestra el resultado.' },
      ],
      challenge: { type: 'fill', q: '🎯 Misión: completa la explicación de la URL.', template: 'En https://www.tienda.co/zapatos, "https" es el ___, "www.tienda.co" es el ___ y "/zapatos" es la ___.',
        blanks: [{ answers: ['protocolo'], options: ['protocolo', 'dominio', 'ruta'] }, { answers: ['dominio'], options: ['protocolo', 'dominio', 'ruta'] }, { answers: ['ruta'], options: ['protocolo', 'dominio', 'ruta'] }],
        explain: 'El protocolo dice cómo hablar, el dominio qué servidor buscar y la ruta qué página pedir.', hints: ['Mira la tabla de partes de la URL.'] },
      summary: ['El cliente pide y el servidor responde.', 'El navegador dibuja la página que recibe.', 'Una URL tiene protocolo, dominio y ruta.', 'HTML es estructura, CSS es estilo y JavaScript es comportamiento.'],
    },
    // ───────────── L2 ─────────────
    {
      id: 'm4-l2', title: 'HTML: estructura de una página', emoji: '🏗️', minutes: 7,
      learn: [
        { title: 'Qué es HTML', blocks: [
          { t: 'p', text: '**HTML** significa "lenguaje de marcado de hipertexto". Usa **etiquetas** para decirle al navegador qué es cada cosa.' },
          { t: 'p', text: 'Una etiqueta se escribe entre `<` y `>`. Casi siempre hay una de apertura y otra de cierre: `<p>` y `</p>`.' },
          { t: 'analogy', text: 'Es como rotular cajas de una mudanza: "cocina", "libros". Las etiquetas dicen qué hay dentro de cada una.' },
        ] },
        { title: 'El esqueleto de la página', blocks: [
          { t: 'code', lang: 'html', code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi primera página</title>
</head>
<body>
  <h1>Hola, mundo</h1>
</body>
</html>`, run: true },
          { t: 'list', items: ['`<!DOCTYPE html>`: avisa que es HTML moderno.', '`<html>`: envuelve toda la página.', '`<head>`: datos invisibles (título de la pestaña, letras con tilde).', '`<body>`: lo que sí se ve en pantalla.'] },
        ] },
        { title: 'Reglas importantes', blocks: [
          { t: 'list', items: ['Cierra cada etiqueta que abras.', 'Anida bien: la que abres al final se cierra primero.', '`<meta charset="UTF-8">` hace que se vean bien tildes y la ñ.'] },
          { t: 'warn', text: 'Error común: `<p><b>Hola</p></b>` está mal anidado. Lo correcto es `<p><b>Hola</b></p>`.' },
          { t: 'tip', text: 'El texto de `<title>` aparece en la pestaña del navegador, no dentro de la página.' },
        ] },
      ],
      example: {
        title: 'Página de una tienda de barrio',
        story: 'Don Jairo quiere una página sencilla para su tienda. Esta es la estructura mínima completa.',
        code: { lang: 'html', code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Tienda Don Jairo</title>
</head>
<body>
  <h1>Tienda Don Jairo</h1>
  <p>Abierto de 6 a.m. a 9 p.m.</p>
</body>
</html>`, run: true },
        note: 'Cambia el texto del título y del párrafo y vuelve a ejecutar.',
      },
      practice: [
        { type: 'mcq', q: '¿Dónde se escribe lo que se ve en la pantalla?', options: ['Dentro de <head>', 'Dentro de <body>', 'Dentro de <title>'], answer: 1,
          wrong: { 0: '<head> guarda datos invisibles como el título de la pestaña.', 2: '<title> solo pone el nombre en la pestaña.' }, explain: 'El contenido visible va dentro de <body>.', hints: ['Body significa "cuerpo" de la página.'] },
        { type: 'bug', q: 'Toca la línea con el error de HTML:', code: '<html>\n<body>\n  <h1>Mi tienda\n  <p>Hola</p>\n</body>\n</html>', bugLine: 3, explain: 'El <h1> se abrió pero nunca se cerró con </h1>.', hints: ['Revisa que cada etiqueta de apertura tenga su cierre.'] },
        { type: 'tf', q: 'El texto dentro de <title> aparece en la pestaña del navegador.', answer: true, explain: 'Así es: <title> da el nombre de la pestaña.' },
      ],
      challenge: { type: 'code', lang: 'html', q: '🎯 Misión: completa la estructura. Agrega un <title> con la palabra "Mi página" y un <h1> dentro del body.',
        starter: '<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8">\n\n</head>\n<body>\n\n</body>\n</html>',
        domChecks: [{ sel: 'head title', text: 'mi p[aá]gina', msg: 'Falta <title>Mi página</title> dentro del head.' }, { sel: 'body h1', min: 1, msg: 'Agrega un <h1> dentro del body.' }],
        solution: '<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8">\n  <title>Mi página</title>\n</head>\n<body>\n  <h1>Hola</h1>\n</body>\n</html>',
        hints: ['El title va dentro de <head>.', '<title>Mi página</title>'], explain: 'El title va en el head y el h1 en el body.' },
      summary: ['HTML usa etiquetas para dar estructura.', 'Toda página tiene html, head y body.', 'El body es lo que se ve; el head son los datos invisibles.', 'Cada etiqueta abierta debe cerrarse.'],
    },
    // ───────────── L3 ─────────────
    {
      id: 'm4-l3', title: 'Etiquetas: títulos, textos, enlaces e imágenes', emoji: '🏷️', minutes: 8,
      learn: [
        { title: 'Títulos y párrafos', blocks: [
          { t: 'p', text: 'Los títulos van de `<h1>` (el más importante) a `<h6>` (el menos importante). El texto normal va en `<p>`.' },
          { t: 'code', lang: 'html', code: '<h1>Arepas La Abuela</h1>\n<h2>Menú</h2>\n<p>Arepas rellenas desde $5.000.</p>', run: true },
          { t: 'tip', text: 'Usa un solo `<h1>` por página: es el título principal.' },
        ] },
        { title: 'Enlaces e imágenes', blocks: [
          { t: 'p', text: 'Un **enlace** (`<a>`) lleva a otra página. Su dirección va en el atributo `href`. Un **atributo** es un dato extra dentro de la etiqueta.' },
          { t: 'code', lang: 'html', code: '<a href="https://www.sena.edu.co">Ir al SENA</a>\n<img src="https://picsum.photos/id/1025/200/150" alt="Un perro">', run: true },
          { t: 'p', text: 'La imagen (`<img>`) no lleva cierre. `src` dice dónde está la foto y `alt` la describe para lectores de pantalla.' },
          { t: 'warn', text: 'No olvides el `alt`: ayuda a personas ciegas y se ve si la foto no carga.' },
        ] },
        { title: 'Listas y contenedores', blocks: [
          { t: 'p', text: '`<ul>` es una lista con viñetas, `<ol>` una lista numerada y cada elemento va en `<li>`.' },
          { t: 'code', lang: 'html', code: '<ul>\n  <li>Arroz</li>\n  <li>Frijoles</li>\n</ul>\n<ol>\n  <li>Hervir</li>\n  <li>Servir</li>\n</ol>', run: true },
          { t: 'p', text: 'El `<div>` es una caja invisible para agrupar cosas y darles estilo después.' },
          { t: 'analogy', text: 'Un `<div>` es como una bolsa de mercado: no se ve, pero junta varios productos.' },
        ] },
      ],
      example: {
        title: 'Menú de un restaurante',
        story: 'Un corrientazo del barrio muestra su menú con título, lista y enlace de contacto.',
        code: { lang: 'html', code: `<div>
  <h1>Corrientazo Doña Rosa</h1>
  <p>Almuerzo del día: $12.000</p>
  <ul>
    <li>Sopa de verduras</li>
    <li>Pollo con arroz</li>
    <li>Jugo de mora</li>
  </ul>
  <a href="https://wa.me/573001112233">Pedir por WhatsApp</a>
</div>`, run: true },
        note: 'Cuenta cuántas etiquetas distintas aparecen: div, h1, p, ul, li y a.',
      },
      practice: [
        { type: 'match', q: 'Une cada etiqueta con su uso:', pairs: [['<h1>', 'Título principal'], ['<p>', 'Párrafo de texto'], ['<a>', 'Enlace'], ['<ul>', 'Lista con viñetas'], ['<img>', 'Imagen']], explain: 'Cada etiqueta le dice al navegador qué tipo de contenido es.' },
        { type: 'input', q: '¿Qué atributo de <a> guarda la dirección a donde lleva el enlace? (una palabra)', answers: ['href'], common: [{ re: '^src$', msg: 'src se usa en las imágenes. Para enlaces es otro.' }], explain: 'Se escribe <a href="...">.', hints: ['Son 4 letras y empieza con h.'] },
        { type: 'fill', q: 'Completa la lista numerada:', template: '<___>\n  <___>Hervir agua</li>\n  <li>Añadir café</li>\n</ol>', blanks: [{ answers: ['ol'], options: ['ul', 'ol', 'li'] }, { answers: ['li'], options: ['ul', 'ol', 'li'] }], explain: '<ol> crea la lista numerada y cada elemento va en <li>.', hints: ['La etiqueta de cierre es </ol>.'] },
      ],
      challenge: { type: 'code', lang: 'html', q: '🎯 Misión: crea una página con un h1, un párrafo, una lista con 3 <li>, un enlace con href y una imagen con src y alt.', starter: '<!-- escribe aquí -->',
        domChecks: [{ sel: 'h1', min: 1, msg: 'Falta el <h1>.' }, { sel: 'p', min: 1, msg: 'Falta un <p>.' }, { sel: 'ul li, ol li', min: 3, msg: 'La lista necesita al menos 3 <li>.' }, { sel: 'a', attr: { href: true }, msg: 'El enlace necesita href.' }, { sel: 'img', attr: { src: true, alt: true }, msg: 'La imagen necesita src y alt.' }],
        solution: '<h1>Mi barrio</h1><p>Un lugar tranquilo.</p><ul><li>Parque</li><li>Tienda</li><li>Panadería</li></ul><a href="https://example.com">Más</a><img src="https://picsum.photos/200" alt="Foto del barrio">',
        hints: ['Cada elemento de la lista va dentro de <li>.', '<img src="..." alt="...">'], explain: 'Combinaste títulos, texto, lista, enlace e imagen: las etiquetas básicas de cualquier página.' },
      summary: ['h1 a h6 son títulos; p es un párrafo.', 'a lleva href y img lleva src y alt.', 'ul y ol son listas; cada elemento va en li.', 'div agrupa contenido en una caja.'],
    },
    // ───────────── L4 ─────────────
    {
      id: 'm4-l4', title: 'Formularios', emoji: '📝', minutes: 8,
      learn: [
        { title: 'Para qué sirve un formulario', blocks: [
          { t: 'p', text: 'Un **formulario** (`<form>`) recoge datos de quien visita la página: nombre, correo, pedido.' },
          { t: 'analogy', text: 'Es la hoja de inscripción del SENA: tiene casillas para llenar y un botón para entregarla.' },
        ] },
        { title: 'Campos de entrada', blocks: [
          { t: 'code', lang: 'html', code: `<form>
  <label for="nombre">Nombre:</label>
  <input type="text" id="nombre" name="nombre" placeholder="Tu nombre">
  <br>
  <label for="correo">Correo:</label>
  <input type="email" id="correo" name="correo">
  <br>
  <button type="submit">Enviar</button>
</form>`, run: true },
          { t: 'list', items: ['`<input>`: casilla para escribir. El `type` cambia su tipo (text, email, number, password).', '`<label>`: el rótulo. Su `for` coincide con el `id` del campo.', '`<button>`: el botón de enviar.'] },
          { t: 'tip', text: 'Con `<label for>` tocar el rótulo selecciona el campo. Ayuda mucho en celular.' },
        ] },
        { title: 'Listas desplegables y texto largo', blocks: [
          { t: 'code', lang: 'html', code: `<form>
  <label for="ciudad">Ciudad:</label>
  <select id="ciudad" name="ciudad">
    <option>Bogotá</option>
    <option>Medellín</option>
    <option>Cali</option>
  </select>
  <br>
  <label for="msg">Mensaje:</label>
  <textarea id="msg" rows="3"></textarea>
</form>`, run: true },
          { t: 'p', text: '`<select>` muestra un menú con varias `<option>`. `<textarea>` es para textos largos, con varias líneas.' },
          { t: 'warn', text: 'Cada `id` debe ser único en la página. Dos campos con el mismo id causan errores.' },
        ] },
      ],
      example: {
        title: 'Pedido de domicilio',
        story: 'Una pizzería de Cali recibe pedidos con un formulario: nombre, tamaño y observaciones.',
        code: { lang: 'html', code: `<form>
  <label for="n">Nombre:</label>
  <input type="text" id="n"><br>
  <label for="t">Tamaño:</label>
  <select id="t"><option>Personal</option><option>Mediana</option><option>Familiar</option></select><br>
  <label for="o">Observaciones:</label>
  <textarea id="o"></textarea><br>
  <button>Pedir</button>
</form>`, run: true },
        note: 'Cada campo tiene su label y su id para que se relacionen.',
      },
      practice: [
        { type: 'mcq', q: '¿Qué etiqueta crea un menú desplegable?', options: ['<input>', '<select>', '<textarea>'], answer: 1, wrong: { 0: '<input> es una casilla simple de una línea.', 2: '<textarea> es para textos largos.' }, explain: '<select> con varias <option> crea el menú.', hints: ['Significa "seleccionar".'] },
        { type: 'multi', q: 'Marca TODAS las etiquetas que van dentro de un formulario típico:', options: ['<input>', '<label>', '<title>', '<button>'], answers: [0, 1, 3], explain: '<title> va en el head de la página, no en el formulario.' },
        { type: 'fill', q: 'Relaciona el label con su campo:', template: '<label for="edad">Edad:</label>\n<input type="number" ___="edad">', blanks: [{ answers: ['id'], options: ['id', 'class', 'src'] }], explain: 'El for del label debe coincidir con el id del input.', hints: ['Es el atributo que identifica un elemento.'] },
      ],
      challenge: { type: 'code', lang: 'html', q: '🎯 Misión: crea un formulario con un input de tipo email (con su label), un select con 2 opciones, un textarea y un botón.', starter: '<form>\n  \n</form>',
        domChecks: [{ sel: 'form', count: 1, msg: 'Debe haber un <form>.' }, { sel: 'input[type=email]', count: 1, msg: 'Agrega un input type="email".' }, { sel: 'label', min: 1, msg: 'Agrega un <label>.' }, { sel: 'select option', min: 2, msg: 'El select necesita 2 option.' }, { sel: 'textarea', count: 1, msg: 'Agrega un <textarea>.' }, { sel: 'button', min: 1, msg: 'Agrega un <button>.' }],
        solution: '<form><label for="c">Correo</label><input type="email" id="c"><select><option>A</option><option>B</option></select><textarea></textarea><button>Enviar</button></form>',
        hints: ['<input type="email">', 'El select lleva dentro varias <option>.'], explain: 'Un formulario combina campos, rótulos y un botón.' },
      summary: ['form agrupa los campos que recogen datos.', 'input cambia con type: text, email, number…', 'label for se une al id del campo.', 'select, textarea y button completan el formulario.'],
    },
    // ───────────── L5 ─────────────
    {
      id: 'm4-l5', title: 'CSS: primeros estilos', emoji: '🎨', minutes: 7,
      learn: [
        { title: 'Qué es CSS', blocks: [
          { t: 'p', text: '**CSS** da estilo a la página: colores, tamaños y posición. HTML pone el contenido; CSS lo decora.' },
          { t: 'analogy', text: 'HTML es una pared sin pintar. CSS es la pintura, el color y los cuadros.' },
        ] },
        { title: 'Reglas de CSS', blocks: [
          { t: 'p', text: 'Una regla tiene un **selector** (a quién) y **propiedades** (qué cambiar).' },
          { t: 'code', lang: 'html', code: `<style>
  h1 {
    color: teal;
    font-size: 32px;
  }
</style>
<h1>Mi página</h1>`, run: true },
          { t: 'list', items: ['Selector: `h1`.', 'Propiedad: `color`; valor: `teal`.', 'Cada línea termina en `;`.'] },
        ] },
        { title: 'Tres tipos de selector', blocks: [
          { t: 'table', head: ['Selector', 'Se escribe', 'Elige'], rows: [['Etiqueta', 'p', 'Todos los párrafos'], ['Clase', '.nota', 'Todo lo que tenga class="nota"'], ['Id', '#titulo', 'El único con id="titulo"']] },
          { t: 'code', lang: 'html', code: `<style>
  .nota { color: crimson; }
  #titulo { text-align: center; }
</style>
<h1 id="titulo">Avisos</h1>
<p class="nota">Hoy no hay clase.</p>
<p>Mañana sí.</p>`, run: true },
          { t: 'tip', text: 'Usa clases para estilos que se repiten. Un id solo se usa una vez.' },
        ] },
      ],
      example: {
        title: 'Aviso destacado',
        story: 'Una tienda quiere que sus ofertas se vean en rojo y grandes, y el resto del texto normal.',
        code: { lang: 'html', code: `<style>
  body { font-family: sans-serif; }
  .oferta { color: red; font-size: 24px; }
</style>
<p class="oferta">¡Papas a $2.500!</p>
<p>Hasta agotar existencias.</p>`, run: true },
        note: 'Solo el párrafo con class="oferta" cambió.',
      },
      practice: [
        { type: 'mcq', q: '¿Cuál es el selector de clase para class="nota"?', options: ['#nota', '.nota', 'nota'], answer: 1, wrong: { 0: '# es para id.', 2: 'Sin punto, CSS busca una etiqueta llamada nota.' }, explain: 'Las clases se eligen con un punto: .nota', hints: ['Es un signo pequeño antes del nombre.'] },
        { type: 'bug', q: 'Toca la línea con el error de CSS:', code: 'p {\n  color: blue\n  font-size: 18px;\n}', bugLine: 2, explain: 'Falta el punto y coma al final de color: blue;', hints: ['Cada propiedad termina con ;'] },
        { type: 'code', lang: 'css', html: '<h1 id="t">Hola</h1><p class="nota">Texto</p>', q: 'Pon el h1 en rojo (red) y el párrafo con tamaño 20px.', starter: 'h1 {\n  \n}', domChecks: [{ sel: '#t', css: { color: 'red' }, msg: 'El h1 debe tener color red.' }, { sel: '.nota', css: { 'font-size': '20px' }, msg: 'El párrafo .nota debe tener font-size 20px.' }],
          solution: 'h1{color:red} .nota{font-size:20px}', hints: ['Necesitas dos reglas: una para h1 y otra para .nota'], explain: 'Una regla por selector, cada una con sus propiedades.' },
      ],
      challenge: { type: 'code', lang: 'css', html: '<h2 id="titulo">Tienda</h2><p class="precio">$4.500</p><p>Gracias</p>', q: '🎯 Misión: centra el #titulo, pon el texto de .precio en verde (green) y de 22px.', starter: '',
        domChecks: [{ sel: '#titulo', css: { 'text-align': 'center' }, msg: 'El título debe estar centrado.' }, { sel: '.precio', css: { color: 'green', 'font-size': '22px' }, msg: '.precio debe ser green y de 22px.' }],
        solution: '#titulo{text-align:center} .precio{color:green;font-size:22px}', hints: ['text-align: center;', 'Usa .precio para la clase y #titulo para el id.'], explain: 'Combinaste selector de id y de clase para estilos distintos.' },
      summary: ['CSS da estilo al HTML.', 'Una regla = selector + propiedades entre llaves.', 'Etiqueta: p; clase: .nota; id: #titulo.', 'Cada propiedad termina con punto y coma.'],
    },
    // ───────────── L6 ─────────────
    {
      id: 'm4-l6', title: 'Colores y diseños', emoji: '🌈', minutes: 8,
      learn: [
        { title: 'Formas de escribir colores', blocks: [
          { t: 'p', text: 'En CSS puedes dar color con nombre (`red`), con **hex** (`#ff0000`) o con **rgb** (`rgb(255, 0, 0)`).' },
          { t: 'p', text: 'RGB mezcla luz roja, verde y azul, cada una de 0 a 255. Hex es lo mismo en otro formato.' },
          { t: 'table', head: ['Color', 'Hex', 'RGB'], rows: [['Rojo', '#ff0000', 'rgb(255, 0, 0)'], ['Verde', '#00ff00', 'rgb(0, 255, 0)'], ['Azul', '#0000ff', 'rgb(0, 0, 255)'], ['Amarillo', '#ffff00', 'rgb(255, 255, 0)']] },
          { t: 'analogy', text: 'Es como mezclar pinturas: más de un color da otro nuevo. El amarillo de Colombia es rojo y verde de luz juntos.' },
        ] },
        { title: 'Fondo y letra', blocks: [
          { t: 'code', lang: 'html', code: `<style>
  body { background-color: #fff7ed; }
  h1 { color: #c2410c; }
  p { color: rgb(55, 65, 81); }
</style>
<h1>Café del Eje</h1>
<p>Aromático y recién molido.</p>`, run: true },
          { t: 'tip', text: 'Elige poco contraste entre colores de la misma familia y mucho entre fondo y texto, para que se lea bien.' },
        ] },
        { title: 'Bordes, esquinas y sombras', blocks: [
          { t: 'list', items: ['`border`: borde, p. ej. `2px solid #f97316`.', '`border-radius`: esquinas redondeadas.', '`box-shadow`: sombra detrás de la caja.', '`padding`: espacio interno; `margin`: espacio externo.'] },
          { t: 'code', lang: 'html', code: `<style>
  .tarjeta {
    background-color: white;
    border: 2px solid #f97316;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 220px;
  }
</style>
<div class="tarjeta">
  <h3>Arepa de queso</h3>
  <p>$4.500</p>
</div>`, run: true },
        ] },
      ],
      example: {
        title: 'Tarjeta de producto',
        story: 'Una tienda de artesanías quiere que cada producto se vea como una tarjeta con esquinas suaves y sombra.',
        code: { lang: 'html', code: `<style>
  body { background-color: #f3f4f6; font-family: sans-serif; }
  .producto { background-color: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); padding: 16px; width: 200px; }
  .precio { color: #15803d; font-weight: bold; }
</style>
<div class="producto">
  <h3>Mochila wayuu</h3>
  <p class="precio">$85.000</p>
</div>`, run: true },
        note: 'Prueba cambiar border-radius a 0 y a 40px y mira la diferencia.',
      },
      practice: [
        { type: 'mcq', q: '¿Qué color es #0000ff?', options: ['Rojo', 'Verde', 'Azul'], answer: 2, wrong: { 0: 'El rojo es #ff0000: los primeros dos dígitos son el rojo.', 1: 'El verde es #00ff00.' }, explain: 'En hex, los pares son rojo, verde y azul. Aquí solo el azul está al máximo (ff).', hints: ['Los últimos dos dígitos son el azul.'] },
        { type: 'match', q: 'Une cada propiedad con su efecto:', pairs: [['border-radius', 'Esquinas redondeadas'], ['box-shadow', 'Sombra de la caja'], ['background-color', 'Color de fondo'], ['padding', 'Espacio interno']], explain: 'Cada propiedad cambia un aspecto de la caja.' },
        { type: 'input', q: 'En rgb(255, 0, 0), ¿qué color sale? (una palabra)', answers: ['rojo', 'red'], explain: 'El primer número es el rojo al máximo y los otros están en 0.', hints: ['Solo el primer número (rojo) está al máximo.'] },
      ],
      challenge: { type: 'code', lang: 'css', html: '<div class="tarjeta">Hola</div>', q: '🎯 Misión: a .tarjeta ponle fondo amarillo (yellow), esquinas redondeadas de 10px y padding de 20px.', starter: '.tarjeta {\n  \n}',
        domChecks: [{ sel: '.tarjeta', css: { 'background-color': 'yellow', 'border-radius': '10px', padding: '20px' }, msg: 'Revisa background-color: yellow, border-radius: 10px y padding: 20px.' }],
        solution: '.tarjeta{background-color:yellow;border-radius:10px;padding:20px}', hints: ['background-color, border-radius y padding.'], explain: 'Con tres propiedades convertiste un texto suelto en una tarjeta.' },
      summary: ['Un color puede ser nombre, hex o rgb.', 'background-color cambia el fondo y color cambia la letra.', 'border-radius redondea y box-shadow da sombra.', 'padding es espacio interno y margin, externo.'],
    },
    // ───────────── L7 ─────────────
    {
      id: 'm4-l7', title: 'Flexbox y Grid', emoji: '🧩', minutes: 8,
      learn: [
        { title: 'El problema de ordenar cajas', blocks: [
          { t: 'p', text: 'Por defecto, las cajas se apilan una debajo de otra. Para ponerlas en fila o en cuadrícula usamos **Flexbox** o **Grid**.' },
          { t: 'analogy', text: 'Es como organizar la vitrina de una tienda: unas cosas en fila, otras en bandejas con filas y columnas.' },
        ] },
        { title: 'Flexbox: en fila', blocks: [
          { t: 'p', text: 'Pon `display: flex` en el **contenedor** (el padre). Sus hijos quedan en fila.' },
          { t: 'code', lang: 'html', code: `<style>
  .fila { display: flex; justify-content: space-between; gap: 10px; }
  .caja { background: #fdba74; padding: 16px; }
</style>
<div class="fila">
  <div class="caja">Inicio</div>
  <div class="caja">Menú</div>
  <div class="caja">Contacto</div>
</div>`, run: true },
          { t: 'list', items: ['`justify-content`: reparte a lo largo (center, space-between).', '`align-items`: alinea en vertical.', '`gap`: espacio entre cajas.', '`flex-direction: column`: en columna.'] },
        ] },
        { title: 'Grid: filas y columnas', blocks: [
          { t: 'p', text: '`display: grid` crea una cuadrícula. `grid-template-columns` define las columnas.' },
          { t: 'code', lang: 'html', code: `<style>
  .galeria { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .foto { background: #fdba74; padding: 20px; text-align: center; }
</style>
<div class="galeria">
  <div class="foto">1</div><div class="foto">2</div><div class="foto">3</div>
  <div class="foto">4</div><div class="foto">5</div><div class="foto">6</div>
</div>`, run: true },
          { t: 'tip', text: 'Flexbox para una sola línea (menús). Grid para filas y columnas (galerías).' },
        ] },
      ],
      example: {
        title: 'Barra de menú',
        story: 'Una página de turismo necesita una barra con tres enlaces en fila y centrados.',
        code: { lang: 'html', code: `<style>
  nav { display: flex; justify-content: center; gap: 20px; background: #0f766e; padding: 12px; }
  nav a { color: white; text-decoration: none; }
</style>
<nav>
  <a href="#">Playas</a>
  <a href="#">Montañas</a>
  <a href="#">Ciudades</a>
</nav>`, run: true },
        note: 'Cambia justify-content a space-around y mira cómo se reparten.',
      },
      practice: [
        { type: 'mcq', q: '¿Qué propiedad convierte un contenedor en Flexbox?', options: ['display: flex', 'flex: display', 'position: flex'], answer: 0, wrong: { 1: 'Está al revés: la propiedad es display.', 2: 'position sirve para otra cosa; Flexbox se activa con display.' }, explain: 'Se escribe display: flex en el contenedor.', hints: ['Es la misma propiedad que se usa para grid.'] },
        { type: 'tf', q: 'Con display: grid puedes definir cuántas columnas tendrá una galería.', answer: true, explain: 'Con grid-template-columns defines las columnas.' },
        { type: 'fill', q: 'Completa para centrar las cajas en una fila:', template: '.menu {\n  display: ___;\n  ___: center;\n}', blanks: [{ answers: ['flex'], options: ['flex', 'grid', 'block'] }, { answers: ['justify-content'], options: ['justify-content', 'align-text', 'gap'] }], explain: 'display: flex pone las cajas en fila y justify-content: center las centra.', hints: ['La primera activa Flexbox.'] },
      ],
      challenge: { type: 'code', lang: 'css', html: '<div class="galeria"><div>1</div><div>2</div><div>3</div><div>4</div></div>', q: '🎯 Misión: haz que .galeria sea una cuadrícula (grid) y tenga un gap de 10px.', starter: '.galeria {\n  \n}',
        domChecks: [{ sel: '.galeria', css: { display: 'grid', gap: '10px' }, msg: 'Usa display: grid y gap: 10px.' }],
        solution: '.galeria{display:grid;grid-template-columns:1fr 1fr;gap:10px}', hints: ['display: grid;', 'gap: 10px;'], explain: 'display: grid crea la cuadrícula y gap deja espacio entre celdas.' },
      summary: ['Flexbox ordena en una línea (fila o columna).', 'Grid ordena en filas y columnas.', 'Se activan con display: flex o display: grid en el padre.', 'gap separa las cajas.'],
    },
    // ───────────── L8 ─────────────
    {
      id: 'm4-l8', title: 'JavaScript: variables y funciones', emoji: '⚡', minutes: 8,
      learn: [
        { title: 'Variables', blocks: [
          { t: 'p', text: '**JavaScript** hace que la página reaccione. Una **variable** es una cajita con nombre donde guardas un dato.' },
          { t: 'code', lang: 'js', code: 'let nombre = "Yuli";\nconst precio = 4500;\nconsole.log(nombre);\nconsole.log(precio * 2);', run: true },
          { t: 'list', items: ['`let`: la caja puede cambiar de valor.', '`const`: la caja no cambia.', '`console.log()` muestra algo en la consola.'] },
          { t: 'analogy', text: 'Es como la etiqueta en un frasco de la cocina: dice qué hay y puedes cambiar el contenido.' },
        ] },
        { title: 'Funciones', blocks: [
          { t: 'p', text: 'Una **función** es una receta con nombre que puedes usar muchas veces. Recibe datos (parámetros) y puede devolver un resultado.' },
          { t: 'code', lang: 'js', code: 'function total(precio, cantidad) {\n  return precio * cantidad;\n}\nconsole.log(total(4500, 3));\nconsole.log(total(1200, 10));', run: true },
          { t: 'tip', text: '`return` entrega el resultado. Sin él, la función no devuelve nada útil.' },
        ] },
        { title: 'Decisiones', blocks: [
          { t: 'code', lang: 'js', code: 'let nota = 4.2;\nif (nota >= 3) {\n  console.log("Aprobaste");\n} else {\n  console.log("A repasar");\n}', run: true },
          { t: 'warn', text: 'Para comparar usa `===`. Un solo `=` guarda un valor, no compara.' },
        ] },
      ],
      example: {
        title: 'Calcular el IVA',
        story: 'Una tienda necesita saber cuánto cuesta un producto con IVA del 19%. Se hace una función reutilizable.',
        code: { lang: 'js', code: 'function conIva(precio) {\n  return precio * 1.19;\n}\nconsole.log(conIva(10000));\nconsole.log(conIva(50000));', run: true },
        note: 'La misma función sirve para cualquier precio.',
      },
      practice: [
        { type: 'mcq', q: '¿Qué palabra entrega el resultado de una función?', options: ['print', 'return', 'let'], answer: 1, wrong: { 0: 'print es de Python; en JavaScript mostramos con console.log.', 2: 'let crea variables.' }, explain: 'return devuelve el valor al lugar donde se llamó la función.', hints: ['Significa "devolver".'] },
        { type: 'bug', q: 'Toca la línea con el error:', code: 'const precio = 5000;\nlet total = precio * 2;\nprecio = 6000;\nconsole.log(total);', bugLine: 3, explain: 'precio es const: no se puede cambiar. Usa let si necesitas cambiarla.', hints: ['Revisa qué palabra se usó al crear precio.'] },
        { type: 'input', q: 'Qué muestra este código?\nlet a = 4;\nlet b = a * 3;\nconsole.log(b);', answers: ['12'], common: [{ re: '^7$', msg: 'Sumaste 4 + 3. El operador * multiplica.' }], explain: '4 × 3 = 12.', hints: ['El asterisco * es multiplicar.'] },
      ],
      challenge: { type: 'code', lang: 'js', q: '🎯 Misión: lee con prompt() el precio de un producto. Crea una función conDescuento(precio) que devuelva el precio menos el 10% y muestra el resultado con console.log.', starter: 'let precio = Number(prompt("Precio:"));\n',
        tests: [{ inputs: ['10000'], output: '9000' }, { inputs: ['5000'], output: '4500' }, { inputs: ['0'], output: '0' }],
        checks: [{ re: 'function\\s+conDescuento', msg: 'Crea la función conDescuento.' }, { re: 'return', msg: 'La función debe usar return.' }],
        solution: 'function conDescuento(precio) {\n  return precio * 0.9;\n}\nlet precio = Number(prompt("Precio:"));\nconsole.log(conDescuento(precio));', hints: ['El 90% del precio es precio * 0.9.', 'Llama la función dentro de console.log().'], explain: 'La función calcula el 90% del precio y console.log lo muestra.' },
      summary: ['let y const crean variables.', 'console.log muestra datos en la consola.', 'Una función agrupa pasos y devuelve un resultado con return.', 'if / else toma decisiones.'],
    },
    // ───────────── L9 ─────────────
    {
      id: 'm4-l9', title: 'Eventos e interacción con la página', emoji: '🖱️', minutes: 9,
      learn: [
        { title: 'Eventos', blocks: [
          { t: 'p', text: 'Un **evento** es algo que pasa en la página: un clic, escribir, pasar el mouse. JavaScript puede reaccionar.' },
          { t: 'analogy', text: 'Es como el timbre de tu casa: cuando alguien lo pulsa (evento), tú abres la puerta (reacción).' },
        ] },
        { title: 'Buscar y cambiar elementos', blocks: [
          { t: 'p', text: 'El **DOM** es el árbol de elementos de la página que JavaScript puede tocar.' },
          { t: 'list', items: ['`document.getElementById("id")`: busca un elemento por su id.', '`.textContent`: el texto del elemento (se puede leer y cambiar).', '`.value`: lo que hay escrito en un input.'] },
          { t: 'code', lang: 'html', code: '<p id="mensaje">Hola</p>\n<script>\n  document.getElementById("mensaje").textContent = "¡Cambié!";\n</script>', run: true },
          { t: 'warn', text: 'El `<script>` va después de los elementos que usa; si no, aún no existen.' },
        ] },
        { title: 'Reaccionar a un clic', blocks: [
          { t: 'code', lang: 'html', code: `<input id="nombre" placeholder="Tu nombre">
<button id="btn">Saludar</button>
<p id="saludo"></p>
<script>
  document.getElementById("btn").addEventListener("click", function () {
    var n = document.getElementById("nombre").value;
    document.getElementById("saludo").textContent = "Hola, " + n;
  });
</script>`, run: true },
          { t: 'steps', items: ['Busca el botón con getElementById.', '`addEventListener("click", función)` espera el clic.', 'Al hacer clic, se ejecuta la función.', 'La función lee `.value` y cambia `.textContent`.'] },
        ] },
      ],
      example: {
        title: 'Contador de arepas',
        story: 'Una vendedora cuenta cuántas arepas ha vendido pulsando un botón.',
        code: { lang: 'html', code: `<p>Vendidas: <span id="cuenta">0</span></p>
<button id="vender">Vender una</button>
<script>
  var total = 0;
  document.getElementById("vender").addEventListener("click", function () {
    total = total + 1;
    document.getElementById("cuenta").textContent = total;
  });
</script>`, run: true },
        note: 'Pulsa el botón varias veces: la variable total guarda el conteo.',
      },
      practice: [
        { type: 'order', q: 'Ordena los pasos para reaccionar a un clic:', items: ['Buscar el botón con getElementById', 'Agregar addEventListener("click", ...)', 'Dentro de la función, leer o cambiar elementos', 'El usuario hace clic y se ejecuta la función'], explain: 'Primero preparas el escucha; cuando ocurre el clic, se ejecuta la función.' },
        { type: 'fill', q: 'Completa para cambiar el texto del párrafo:', template: 'document.getElementById("msg").___ = "Listo";', blanks: [{ answers: ['textContent'], options: ['textContent', 'value', 'id'] }], explain: 'textContent cambia el texto; value es para inputs.', hints: ['Es la propiedad del texto de un elemento.'] },
        { type: 'mcq', q: '¿Cómo lees lo que escribió la usuaria en un input con id="edad"?', options: ['document.getElementById("edad").value', 'document.getElementById("edad").textContent', 'document.edad'], answer: 0, wrong: { 1: 'textContent es el texto dentro del elemento; un input no tiene texto dentro, usa value.', 2: 'Así no se encuentra el elemento; hay que usar getElementById.' }, explain: 'En inputs se usa .value.', hints: ['Los inputs guardan lo escrito en una propiedad especial.'] },
      ],
      challenge: { type: 'code', lang: 'html', q: '🎯 Misión: haz que al pulsar #btn, el párrafo #msg diga "¡Gracias por tu compra!".', starter: '<button id="btn">Comprar</button>\n<p id="msg"></p>\n<script>\n  \n</script>',
        actions: [{ click: '#btn' }],
        domChecks: [{ sel: '#msg', text: 'gracias por tu compra', msg: 'Después del clic, #msg debe decir "¡Gracias por tu compra!".' }],
        solution: '<button id="btn">Comprar</button><p id="msg"></p><script>document.getElementById("btn").addEventListener("click", function(){ document.getElementById("msg").textContent = "¡Gracias por tu compra!"; });</script>',
        hints: ['Usa addEventListener("click", ...) sobre #btn.', 'Dentro cambia textContent de #msg.'], explain: 'El clic dispara la función, que cambia el texto del párrafo.' },
      summary: ['Un evento es algo que pasa en la página, como un clic.', 'getElementById busca un elemento.', 'textContent cambia el texto y value lee un input.', 'addEventListener ejecuta una función cuando ocurre el evento.'],
    },
    // ───────────── L10 ─────────────
    {
      id: 'm4-l10', title: 'Mini proyecto: tu tarjeta de presentación', emoji: '🚀', minutes: 10,
      learn: [
        { title: 'Qué vamos a construir', blocks: [
          { t: 'p', text: 'Vas a crear una **tarjeta de presentación** web con tu nombre, una descripción y un botón que cambia un mensaje.' },
          { t: 'steps', items: ['HTML: la estructura.', 'CSS: el diseño.', 'JavaScript: el botón.'] },
          { t: 'analogy', text: 'Es como armar un puesto en la feria: primero la mesa (HTML), luego el mantel bonito (CSS) y por último la campanita para atraer clientes (JS).' },
        ] },
        { title: 'Paso 1 y 2: estructura y diseño', blocks: [
          { t: 'code', lang: 'html', code: `<style>
  body { font-family: sans-serif; background: #fff7ed; }
  .tarjeta { background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); padding: 20px; width: 260px; text-align: center; }
  h1 { color: #c2410c; }
</style>
<div class="tarjeta">
  <h1>Camila Torres</h1>
  <p>Desarrolladora web en formación</p>
</div>`, run: true },
          { t: 'tip', text: 'Primero haz que funcione y luego que se vea bonito. Prueba cada paso.' },
        ] },
        { title: 'Paso 3: el botón', blocks: [
          { t: 'code', lang: 'html', code: `<p id="mensaje">Haz clic para conocerme</p>
<button id="btn">Conóceme</button>
<script>
  document.getElementById("btn").addEventListener("click", function () {
    document.getElementById("mensaje").textContent = "Me encanta crear páginas web";
  });
</script>`, run: true },
          { t: 'warn', text: 'Si el botón no responde, revisa que los ids del HTML y del JavaScript sean iguales, letra por letra.' },
        ] },
      ],
      example: {
        title: 'Tarjeta completa',
        story: 'Así se ve el proyecto terminado: estructura, estilo e interacción juntos.',
        code: { lang: 'html', code: `<style>
  body { font-family: sans-serif; background: #fff7ed; }
  .tarjeta { background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); padding: 20px; width: 260px; text-align: center; }
  h1 { color: #c2410c; }
  button { background: #f97316; color: white; border: none; border-radius: 8px; padding: 10px 16px; }
</style>
<div class="tarjeta">
  <h1>Camila Torres</h1>
  <p id="mensaje">Desarrolladora web en formación</p>
  <button id="btn">Conóceme</button>
</div>
<script>
  document.getElementById("btn").addEventListener("click", function () {
    document.getElementById("mensaje").textContent = "Me encanta crear páginas web";
  });
</script>`, run: true },
        note: 'Ahora te toca hacer la tuya.',
      },
      practice: [
        { type: 'order', q: 'Ordena los pasos del mini proyecto:', items: ['Escribir el HTML de la tarjeta', 'Darle estilo con CSS', 'Agregar el botón con JavaScript', 'Probar el clic'], explain: 'Estructura, diseño, interacción y prueba.' },
        { type: 'bug', q: 'El botón no cambia el mensaje. Toca la línea con el error:', code: '<p id="mensaje">Hola</p>\n<button id="btn">Clic</button>\n<script>\n  document.getElementById("btn").addEventListener("click", function () {\n    document.getElementById("mesaje").textContent = "Listo";\n  });\n</script>', bugLine: 5, explain: 'El id está mal escrito: "mesaje" en vez de "mensaje".', hints: ['Compara el id del párrafo con el de getElementById.'] },
        { type: 'mcq', q: '¿Qué hace cada lenguaje en tu tarjeta?', options: ['HTML pone el contenido, CSS el diseño y JS la acción del botón', 'HTML hace el botón reaccionar y CSS pone el texto', 'CSS crea los elementos y JS los pinta'], answer: 0, wrong: { 1: 'Al revés: JS es lo que hace reaccionar.', 2: 'Los elementos los crea HTML.' }, explain: 'HTML = qué hay, CSS = cómo se ve, JS = qué hace.', hints: ['Recuerda la casa: paredes, pintura, electricidad.'] },
      ],
      challenge: { type: 'code', lang: 'html', q: '🎯 Misión: crea tu tarjeta. Un h1 con tu nombre, un <p id="mensaje">, un <button id="btn"> y JavaScript para que, al pulsar, #mensaje diga algo nuevo. Con CSS, centra el texto de .tarjeta.', starter: '<style>\n  \n</style>\n<div class="tarjeta">\n  \n</div>\n<script>\n  \n</script>',
        actions: [{ click: '#btn' }],
        domChecks: [{ sel: '.tarjeta h1', min: 1, msg: 'Agrega un h1 dentro de .tarjeta.' }, { sel: '#btn', count: 1, msg: 'Agrega el botón #btn.' }, { sel: '.tarjeta', css: { 'text-align': 'center' }, msg: 'Centra el texto de .tarjeta con text-align: center.' }, { sel: '#mensaje', text: '^(?!\\s*$).+', msg: 'Después del clic, #mensaje debe tener un texto.' }, { sel: '#mensaje', text: '^(?!\\s*Hola\\s*$)', msg: 'El mensaje debe cambiar al pulsar el botón (no dejes el mismo texto).' }],
        common: [{ re: '^(?![\\s\\S]*addEventListener|[\\s\\S]*onclick)', msg: 'Falta el evento: usa addEventListener("click", ...) en el botón.' }],
        solution: '<style>.tarjeta{text-align:center;padding:20px}</style><div class="tarjeta"><h1>Yuli</h1><p id="mensaje">Hola</p><button id="btn">Conóceme</button></div><script>document.getElementById("btn").addEventListener("click", function(){ document.getElementById("mensaje").textContent = "Me encanta programar"; });</script>',
        hints: ['Escribe el HTML, luego el CSS y por último el script.', 'En el script, cambia textContent de #mensaje al hacer clic.'], explain: 'Uniste HTML, CSS y JavaScript en una página funcional: ¡tu primera tarjeta web!' },
      summary: ['Un proyecto web combina HTML, CSS y JavaScript.', 'Construye por pasos y prueba cada uno.', 'Los ids deben coincidir entre HTML y JavaScript.', 'Ya puedes crear páginas con diseño e interacción.'],
    },
  ],
  exam: [
    { lesson: 'm4-l1', type: 'mcq', q: '¿Qué programa pide las páginas y las dibuja en tu pantalla?', options: ['El servidor', 'El navegador', 'El dominio'], answer: 1, explain: 'El navegador (Chrome, Firefox…) pide la página y la muestra.' },
    { lesson: 'm4-l1', type: 'tf', q: 'HTTPS es lo mismo que HTTP, pero con la comunicación cifrada.', answer: true, explain: 'La S significa seguro: los datos viajan cifrados.' },
    { lesson: 'm4-l2', type: 'mcq', q: '¿Dónde va la etiqueta <title>?', options: ['Dentro de <body>', 'Dentro de <head>', 'Fuera de <html>'], answer: 1, explain: 'El title va en el head y se ve en la pestaña.' },
    { lesson: 'm4-l3', type: 'match', q: 'Une etiqueta y función:', pairs: [['<a>', 'Enlace'], ['<img>', 'Imagen'], ['<li>', 'Elemento de lista'], ['<h1>', 'Título principal']], explain: 'Cada etiqueta cumple un papel distinto.' },
    { lesson: 'm4-l4', type: 'multi', q: 'Marca los elementos de formulario:', options: ['<input>', '<select>', '<ul>', '<textarea>'], answers: [0, 1, 3], explain: '<ul> es una lista, no un campo de formulario.' },
    { lesson: 'm4-l5', type: 'bug', q: 'Toca la línea con el error:', code: '.nota {\n  color: red;\n  font-size 18px;\n}', bugLine: 3, explain: 'Falta los dos puntos: font-size: 18px;' },
    { lesson: 'm4-l6', type: 'input', q: '¿Qué propiedad CSS redondea las esquinas de una caja?', answers: ['border-radius'], explain: 'border-radius redondea las esquinas.' },
    { lesson: 'm4-l7', type: 'fill', q: 'Completa para poner 3 columnas:', template: 'display: ___;\ngrid-template-columns: repeat(3, 1fr);', blanks: [{ answers: ['grid'], options: ['flex', 'grid', 'block'] }], explain: 'Las columnas se definen con display: grid.' },
    { lesson: 'm4-l8', type: 'order', q: 'Ordena para crear y usar una función:', items: ['Escribir function total(a, b) {', 'Poner return a * b;', 'Cerrar con }', 'Llamar console.log(total(2, 3));'], explain: 'Se define, se cierra y luego se llama.' },
    { lesson: 'm4-l9', type: 'code', lang: 'html', q: 'Haz que al pulsar #btn el párrafo #msg diga "Hecho".', starter: '<button id="btn">Ok</button>\n<p id="msg"></p>\n<script>\n  \n</script>',
      actions: [{ click: '#btn' }], domChecks: [{ sel: '#msg', text: '^\\s*hecho\\s*$', msg: '#msg debe decir "Hecho" tras el clic.' }],
      solution: '<button id="btn">Ok</button><p id="msg"></p><script>document.getElementById("btn").addEventListener("click", function(){ document.getElementById("msg").textContent = "Hecho"; });</script>', explain: 'addEventListener + textContent.' },
  ],
});
