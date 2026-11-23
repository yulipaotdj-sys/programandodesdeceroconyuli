registerWorld({
  id: 'm6', n: 6, title: 'Ingeniería de software', subtitle: 'Planea, construye y entrega software como un equipo profesional',
  emoji: '🏗️', color: '#ec4899',
  intro: 'Programar es solo una parte. Un software de verdad se planea, se dibuja, se prueba, se guarda por versiones y se construye en equipo. En este mundo aprendes cómo lo hacen las empresas, con ejemplos del SENA, tiendas y buses de tu ciudad.',
  badge: { name: 'Arquitecta de software', emoji: '🏗️' },
  lessons: [
    // ───────────── L1 ─────────────
    {
      id: 'm6-l1', title: 'Ciclo de vida del software', emoji: '🔄', minutes: 7,
      learn: [
        { title: 'Un software también "nace y crece"', blocks: [
          { t: 'p', text: 'El **ciclo de vida del software** son las etapas por las que pasa un programa: desde la idea hasta que se retira.' },
          { t: 'analogy', text: 'Es como construir una casa. Primero hablas con la familia, luego haces el plano, después construyes, revisas que todo funcione, entregas las llaves y haces arreglos con los años.' },
        ] },
        { title: 'Las etapas', blocks: [
          { t: 'steps', items: ['**Análisis**: entender qué necesita el cliente.', '**Diseño**: dibujar cómo será el sistema.', '**Desarrollo**: escribir el código.', '**Pruebas**: buscar errores antes de entregar.', '**Despliegue**: poner el software a funcionar para los usuarios.', '**Mantenimiento**: corregir y mejorar con el tiempo.'] },
          { t: 'tip', text: 'Muchos errores caros nacen en el análisis: si entiendes mal lo que el cliente quiere, todo lo demás sale mal.' },
        ] },
        { title: 'Cuesta más arreglar tarde', blocks: [
          { t: 'p', text: 'Un error encontrado en el análisis se arregla con una conversación. Uno encontrado cuando la app ya está en uso puede costar mucho dinero.' },
          { t: 'table', head: ['Etapa', 'Pregunta clave'], rows: [['Análisis', '¿Qué necesita el cliente?'], ['Diseño', '¿Cómo lo vamos a armar?'], ['Desarrollo', '¿Cómo se escribe?'], ['Pruebas', '¿Funciona bien?'], ['Despliegue', '¿Ya lo pueden usar?'], ['Mantenimiento', '¿Qué falló o qué mejoramos?']] },
          { t: 'warn', text: 'El ciclo no termina al entregar: casi todo el software recibe cambios por años.' },
        ] },
      ],
      example: {
        title: 'App de turnos para un consultorio',
        story: 'Una odontóloga de Cali quiere una app para agendar citas. Primero se pregunta qué necesita (análisis), se dibujan las pantallas (diseño), se programa, se prueba con la recepcionista y se publica. Meses después pide recordatorios por WhatsApp: eso es mantenimiento.',
        pseudo: 'ANÁLISIS: hablar con la odontóloga\nDISEÑO: dibujar pantalla de citas\nDESARROLLO: programar la agenda\nPRUEBAS: la recepcionista agenda 20 citas\nDESPLIEGUE: instalar en el consultorio\nMANTENIMIENTO: agregar recordatorios',
        note: 'Observa que cada etapa produce algo: notas, dibujos, código, un informe de errores...',
      },
      practice: [
        { type: 'order', q: 'Ordena las etapas del ciclo de vida:', items: ['Análisis', 'Diseño', 'Desarrollo', 'Pruebas', 'Despliegue', 'Mantenimiento'], explain: 'Primero se entiende el problema, luego se diseña, se programa, se prueba, se entrega y se mantiene.' },
        { type: 'mcq', q: 'La app ya está funcionando y los usuarios piden un botón nuevo. ¿Qué etapa es?', options: ['Análisis inicial', 'Mantenimiento', 'Despliegue'], answer: 1,
          wrong: { 0: 'El análisis inicial ocurre antes de construir la primera versión.', 2: 'El despliegue es publicar la app; aquí ya está publicada.' }, explain: 'Mejorar o corregir un software que ya funciona es mantenimiento.', hints: ['La app ya está en uso.'] },
        { type: 'match', q: 'Une cada etapa con su actividad:', pairs: [['Análisis', 'Entrevistar al cliente'], ['Diseño', 'Dibujar las pantallas'], ['Pruebas', 'Buscar errores'], ['Despliegue', 'Publicar la app']], explain: 'Cada etapa tiene un trabajo distinto y un resultado propio.' },
      ],
      challenge: { type: 'tf', q: '🎯 Misión: ¿Verdadero o falso? "Cuando el software se entrega al cliente, el ciclo de vida termina y ya no hay más trabajo."', answer: false, explain: 'Falso. Después de entregar viene el mantenimiento: corregir errores y agregar mejoras durante años.' },
      summary: ['El ciclo de vida son las etapas de un software, desde la idea hasta su retiro.', 'Las etapas: análisis, diseño, desarrollo, pruebas, despliegue y mantenimiento.', 'Entre más temprano se encuentra un error, más barato es arreglarlo.'],
    },
    // ───────────── L2 ─────────────
    {
      id: 'm6-l2', title: 'Requerimientos funcionales y no funcionales', emoji: '📋', minutes: 7,
      learn: [
        { title: '¿Qué es un requerimiento?', blocks: [
          { t: 'p', text: 'Un **requerimiento** es algo que el sistema debe hacer o cumplir. Es la lista de lo que el cliente espera.' },
          { t: 'analogy', text: 'Cuando encargas un pedido en un restaurante, dices qué quieres: "una bandeja paisa" y también cómo: "rápido y sin cebolla". Ambas cosas son requerimientos.' },
        ] },
        { title: 'Funcionales: lo que hace', blocks: [
          { t: 'p', text: 'Los **requerimientos funcionales (RF)** describen acciones o funciones del sistema.' },
          { t: 'list', items: ['El sistema debe permitir registrar un cliente.', 'El sistema debe calcular el total de la compra.', 'El sistema debe enviar un correo de confirmación.'] },
          { t: 'tip', text: 'Casi siempre empiezan con un verbo: registrar, calcular, enviar, buscar.' },
        ] },
        { title: 'No funcionales: cómo lo hace', blocks: [
          { t: 'p', text: 'Los **requerimientos no funcionales (RNF)** describen la calidad: rapidez, seguridad, facilidad de uso, disponibilidad.' },
          { t: 'table', head: ['Tipo', 'Ejemplo'], rows: [['Rendimiento', 'La búsqueda responde en menos de 2 segundos.'], ['Seguridad', 'Las contraseñas se guardan cifradas.'], ['Usabilidad', 'Una persona aprende a usarla en 10 minutos.'], ['Disponibilidad', 'La app funciona 24 horas al día.']] },
          { t: 'warn', text: 'Un RNF debe poder medirse. "Que sea rápida" es vago; "responde en menos de 2 segundos" sí se puede comprobar.' },
        ] },
      ],
      example: {
        title: 'App para recargar tarjeta de bus',
        story: 'Una app permite recargar la tarjeta del bus. RF: "El usuario puede recargar $10.000 a su tarjeta". RNF: "La recarga se confirma en menos de 5 segundos" y "Los datos de pago viajan cifrados".',
        pseudo: 'RF1: el sistema permite recargar la tarjeta\nRF2: el sistema muestra el saldo actual\nRNF1: la recarga se confirma en menos de 5 segundos\nRNF2: los datos de pago viajan cifrados',
        note: 'Los RF son acciones; los RNF son cualidades que se pueden medir.',
      },
      practice: [
        { type: 'mcq', q: '"El sistema debe permitir buscar un producto por nombre." Es un requerimiento...', options: ['Funcional', 'No funcional', 'Ninguno: no es un requerimiento'], answer: 0, wrong: { 1: 'Describe una acción que el sistema hace (buscar), no una cualidad.', 2: 'Sí es un requerimiento: dice algo que el sistema debe hacer.' }, explain: 'Buscar es una función del sistema: es funcional.', hints: ['¿Describe una acción o una cualidad?'] },
        { type: 'match', q: 'Clasifica cada requerimiento:', pairs: [['Registrar una venta', 'Función: el sistema hace algo'], ['Responder en menos de 3 segundos', 'Calidad: rendimiento'], ['Cifrar las contraseñas', 'Calidad: seguridad'], ['Generar un reporte de notas', 'Función: el sistema produce algo']], explain: 'Lo que el sistema hace es funcional; qué tan bien lo hace es no funcional.' },
        { type: 'multi', q: 'Marca los requerimientos NO funcionales:', options: ['Calcular el IVA de la factura', 'La página carga en menos de 2 segundos', 'Enviar un correo de bienvenida', 'La información se respalda cada noche'], answers: [1, 3], explain: 'Velocidad de carga y respaldo diario son cualidades. Calcular y enviar son funciones.' },
      ],
      challenge: { type: 'fill', q: '🎯 Misión: completa la regla con las palabras correctas.', template: 'Un requerimiento ___ dice QUÉ hace el sistema. Un requerimiento ___ dice QUÉ TAN BIEN lo hace.', blanks: [{ answers: ['funcional'], options: ['funcional', 'no funcional'] }, { answers: ['no funcional'], options: ['funcional', 'no funcional'] }], explain: 'Funcional = función o acción. No funcional = calidad (rapidez, seguridad, facilidad).' },
      summary: ['Un requerimiento es lo que el cliente espera del sistema.', 'Los funcionales describen acciones: registrar, calcular, enviar.', 'Los no funcionales describen calidades medibles: rapidez, seguridad, usabilidad.'],
    },
    // ───────────── L3 ─────────────
    {
      id: 'm6-l3', title: 'Historias de usuario', emoji: '🗣️', minutes: 7,
      learn: [
        { title: 'Pedir cosas como lo diría una persona', blocks: [
          { t: 'p', text: 'Una **historia de usuario** es una frase corta que cuenta lo que una persona necesita del software, con sus propias palabras.' },
          { t: 'analogy', text: 'Es como la nota que dejas en la panadería: "Como cliente, quiero pan caliente a las 5 para tomar onces con mi familia".' },
        ] },
        { title: 'La plantilla', blocks: [
          { t: 'p', text: 'Casi todas siguen esta forma:' },
          { t: 'code', lang: 'text', code: 'Como [tipo de usuario],\nquiero [una acción],\npara [el beneficio].' },
          { t: 'table', head: ['Parte', 'Responde', 'Ejemplo'], rows: [['Como…', '¿Quién?', 'Como estudiante'], ['Quiero…', '¿Qué?', 'quiero ver mis notas'], ['Para…', '¿Por qué?', 'para saber si aprobé']] },
        ] },
        { title: 'Una buena historia', blocks: [
          { t: 'list', items: ['Es **corta**: cabe en una tarjeta.', 'Habla del **usuario**, no de la tecnología.', 'Tiene un **beneficio** claro (el "para").', 'Se puede **probar** si ya está lista.'] },
          { t: 'warn', text: 'Mala historia: "Quiero una base de datos MySQL". No dice quién la necesita ni para qué.' },
        ] },
      ],
      example: {
        title: 'Historias para una tienda en línea',
        story: 'Doña Marta vende artesanías por internet. Su equipo escribió historias cortas para saber qué construir primero.',
        pseudo: 'Como cliente, quiero filtrar por precio, para encontrar algo que pueda pagar.\nComo cliente, quiero pagar con Nequi, para no usar tarjeta.\nComo vendedora, quiero ver mis pedidos del día, para empacarlos a tiempo.',
        note: 'Cada historia tiene quién, qué y para qué.',
      },
      practice: [
        { type: 'order', q: 'Ordena las partes de una historia de usuario:', items: ['Como estudiante,', 'quiero descargar mi certificado,', 'para presentarlo en una empresa.'], explain: 'Primero el quién, luego el qué y al final el para qué.' },
        { type: 'mcq', q: '¿Cuál es una historia de usuario bien escrita?', options: ['Usar una base de datos relacional', 'Como pasajera, quiero ver cuándo llega mi bus, para no esperar de más', 'Hacer la pantalla azul'], answer: 1,
          wrong: { 0: 'Habla de tecnología, no de una persona ni de un beneficio.', 2: 'No dice quién lo pide ni para qué.' }, explain: 'Tiene usuario, acción y beneficio.', hints: ['Busca quién, qué y para qué.'] },
        { type: 'fill', q: 'Completa la plantilla:', template: '___ instructora, quiero subir las notas, ___ que mis aprendices las vean.', blanks: [{ answers: ['como'] }, { answers: ['para'] }], explain: 'La plantilla es "Como…, quiero…, para…".' },
      ],
      challenge: { type: 'code', lang: 'pseudo', q: '🎯 Misión: escribe una historia de usuario para una app donde los aprendices del SENA reservan un computador de la sala. Usa "Como…, quiero…, para…".', starter: '',
        checks: [{ re: 'como\\s+\\w+', msg: 'Empieza con "Como" y el tipo de usuario.' }, { re: 'quiero\\s+\\w+', msg: 'Agrega lo que quiere hacer con "quiero".' }, { re: 'para\\s+\\w+', msg: 'Termina con el beneficio usando "para".' }],
        solution: 'Como aprendiz, quiero reservar un computador de la sala, para poder hacer mi trabajo sin esperar.', hints: ['Empieza con: Como aprendiz,', 'Luego "quiero" + acción y "para" + beneficio.'], explain: 'Una buena historia dice quién, qué quiere y para qué.' },
      summary: ['Una historia de usuario cuenta una necesidad con palabras sencillas.', 'La plantilla es: Como [usuario], quiero [acción], para [beneficio].', 'Debe ser corta, centrada en la persona y con un beneficio claro.'],
    },
    // ───────────── L4 ─────────────
    {
      id: 'm6-l4', title: 'Criterios de aceptación', emoji: '✅', minutes: 7,
      learn: [
        { title: '¿Cuándo está "terminada" una historia?', blocks: [
          { t: 'p', text: 'Los **criterios de aceptación** son las condiciones que deben cumplirse para decir que una historia de usuario quedó bien hecha.' },
          { t: 'analogy', text: 'Es como pedir un tinto "listo": calientico, sin azúcar y en vaso. Si falla una condición, no está como lo pediste.' },
        ] },
        { title: 'Dado, Cuando, Entonces', blocks: [
          { t: 'p', text: 'Una forma muy usada de escribirlos es **Dado / Cuando / Entonces** (en inglés Given / When / Then).' },
          { t: 'table', head: ['Palabra', 'Significa', 'Ejemplo'], rows: [['Dado', 'La situación inicial', 'Dado que tengo $20.000 de saldo'], ['Cuando', 'La acción que hago', 'cuando compro un pasaje de $3.000'], ['Entonces', 'El resultado esperado', 'entonces mi saldo es $17.000']] },
        ] },
        { title: 'Reglas para escribirlos', blocks: [
          { t: 'list', items: ['Deben poder **verificarse**: se cumple o no se cumple.', 'Usa **datos concretos** ($3.000, 5 intentos).', 'Escribe uno por cada situación importante, incluso los errores.'] },
          { t: 'tip', text: 'Piensa también en lo que sale mal: contraseña incorrecta, saldo insuficiente, campo vacío.' },
        ] },
      ],
      example: {
        title: 'Iniciar sesión',
        story: 'Historia: "Como aprendiz, quiero iniciar sesión, para ver mis fichas". Se escriben dos criterios: uno cuando todo va bien y otro cuando la clave es incorrecta.',
        pseudo: 'Escenario 1: clave correcta\n  Dado que estoy en la pantalla de inicio\n  Cuando escribo mi correo y mi clave correcta\n  Entonces veo mis fichas\n\nEscenario 2: clave incorrecta\n  Dado que estoy en la pantalla de inicio\n  Cuando escribo una clave incorrecta\n  Entonces veo el mensaje "Clave incorrecta"',
        note: 'El segundo escenario cubre el error, que es tan importante como el caso feliz.',
      },
      practice: [
        { type: 'match', q: 'Une cada palabra con lo que expresa:', pairs: [['Dado', 'La situación inicial'], ['Cuando', 'La acción de la persona'], ['Entonces', 'El resultado esperado']], explain: 'Dado = contexto, Cuando = acción, Entonces = resultado.' },
        { type: 'mcq', q: '¿Cuál criterio se puede verificar mejor?', options: ['La app debe verse bonita', 'Entonces el saldo muestra $17.000', 'Debe ser fácil'], answer: 1, wrong: { 0: '"Bonita" es opinión; no se puede medir.', 2: '"Fácil" es vago; no hay forma exacta de comprobarlo.' }, explain: 'Un valor concreto se verifica: el saldo es $17.000 o no lo es.', hints: ['Busca el que tenga un dato exacto.'] },
        { type: 'order', q: 'Ordena el criterio de aceptación:', items: ['Dado que mi carrito tiene 2 productos', 'Cuando presiono "Pagar"', 'Entonces veo el resumen de la compra'], explain: 'Primero la situación (Dado), luego la acción (Cuando) y por último el resultado (Entonces).' },
      ],
      challenge: { type: 'fill', q: '🎯 Misión: completa el criterio de aceptación de "Recuperar contraseña".', template: '___ que olvidé mi contraseña\n___ escribo mi correo y presiono "Enviar"\n___ recibo un mensaje con el enlace para cambiarla', blanks: [{ answers: ['Dado'], options: ['Dado', 'Cuando', 'Entonces'] }, { answers: ['Cuando'], options: ['Dado', 'Cuando', 'Entonces'] }, { answers: ['Entonces'], options: ['Dado', 'Cuando', 'Entonces'] }], explain: 'Se usa el orden Dado, Cuando, Entonces.' },
      summary: ['Los criterios de aceptación dicen cuándo una historia está bien terminada.', 'El formato Dado/Cuando/Entonces separa situación, acción y resultado.', 'Deben ser verificables y cubrir también los casos de error.'],
    },
    // ───────────── L5 ─────────────
    {
      id: 'm6-l5', title: 'UML y diagramas', emoji: '📐', minutes: 8,
      learn: [
        { title: 'Dibujar antes de construir', blocks: [
          { t: 'p', text: '**UML** es un lenguaje de dibujos para explicar cómo es o cómo funciona un sistema. Así todo el equipo entiende lo mismo.' },
          { t: 'analogy', text: 'Es como los planos de una casa: el arquitecto no explica con palabras, dibuja. Los símbolos son iguales para todos.' },
        ] },
        { title: 'Diagrama de casos de uso', blocks: [
          { t: 'p', text: 'Muestra **quién** usa el sistema (actores) y **qué** puede hacer (casos de uso).' },
          { t: 'table', head: ['Actor', 'Casos de uso'], rows: [['Cliente', 'Buscar producto, Hacer pedido, Pagar'], ['Vendedora', 'Ver pedidos, Despachar pedido'], ['Administrador', 'Crear productos, Ver ventas']] },
          { t: 'tip', text: 'Se dibuja con muñequitos (actores) y óvalos (casos de uso).' },
        ] },
        { title: 'Diagrama de clases', blocks: [
          { t: 'p', text: 'Muestra las **clases**: los "moldes" del sistema, con sus datos (atributos) y acciones (métodos).' },
          { t: 'table', head: ['Clase', 'Atributos', 'Métodos'], rows: [['Estudiante', 'nombre, ficha', 'matricular()'], ['Curso', 'nombre, horas', 'agregarEstudiante()']] },
        ] },
        { title: 'Diagrama de secuencia', blocks: [
          { t: 'p', text: 'Muestra **en qué orden** se envían mensajes los participantes, como una conversación.' },
          { t: 'flow', steps: [{ shape: 'start', text: 'Cliente pulsa "Pagar"' }, { shape: 'process', text: 'App envía el pedido al servidor' }, { shape: 'process', text: 'Servidor consulta al banco' }, { shape: 'io', text: 'Banco responde: aprobado' }, { shape: 'end', text: 'App muestra "Pago exitoso"' }] },
        ] },
      ],
      example: {
        title: 'Biblioteca del SENA',
        story: 'Para una app de biblioteca, el equipo dibuja tres diagramas: casos de uso (qué hace el aprendiz), clases (Libro, Préstamo) y secuencia (cómo se presta un libro).',
        pseudo: 'CASO DE USO:  Aprendiz --> Pedir libro prestado\nCLASE:  Libro (titulo, autor) | Prestamo (fecha, libro)\nSECUENCIA: Aprendiz -> App -> Base de datos -> App -> Aprendiz',
        note: 'Cada diagrama responde una pregunta distinta sobre el mismo sistema.',
      },
      practice: [
        { type: 'match', q: 'Une cada diagrama con lo que muestra:', pairs: [['Casos de uso', 'Quién usa el sistema y qué hace'], ['Clases', 'Los moldes con sus datos y acciones'], ['Secuencia', 'El orden de los mensajes']], explain: 'Cada diagrama UML tiene un propósito propio.' },
        { type: 'mcq', q: 'Quieres mostrar el orden de los pasos cuando alguien paga en línea. ¿Qué diagrama usas?', options: ['Casos de uso', 'Clases', 'Secuencia'], answer: 2, wrong: { 0: 'Casos de uso muestra qué se puede hacer, no el orden de los mensajes.', 1: 'Clases muestra la estructura, no el paso a paso.' }, explain: 'El diagrama de secuencia muestra el orden en el tiempo.', hints: ['Piensa en una conversación paso a paso.'] },
        { type: 'tf', q: 'En un diagrama de clases, una clase puede tener atributos (datos) y métodos (acciones).', answer: true, explain: 'Por ejemplo, la clase Estudiante tiene atributos como nombre y métodos como matricular().' },
      ],
      challenge: { type: 'input', q: '🎯 Misión: en un diagrama de casos de uso, ¿cómo se llama a las personas o sistemas que usan el software? (una palabra)', answers: ['actor', 'actores'], hints: ['Se dibujan como muñequitos.'], explain: 'Se llaman actores: pueden ser personas (cliente) u otros sistemas.' },
      summary: ['UML es un lenguaje de dibujos para explicar un sistema.', 'Casos de uso: quién usa el sistema y qué hace.', 'Clases: la estructura. Secuencia: el orden de los mensajes.'],
    },
    // ───────────── L6 ─────────────
    {
      id: 'm6-l6', title: 'Pruebas de software', emoji: '🧪', minutes: 8,
      learn: [
        { title: 'Probar para no fallar', blocks: [
          { t: 'p', text: 'Las **pruebas de software** comprueban que el programa hace lo que debe. Se buscan errores (bugs) antes de que los encuentre el usuario.' },
          { t: 'analogy', text: 'Antes de lanzar un bus nuevo, lo prueban: frenos, puertas, luces. Nadie lo pone a rodar con pasajeros sin revisar.' },
        ] },
        { title: 'Tres niveles de prueba', blocks: [
          { t: 'table', head: ['Prueba', 'Qué revisa', 'Ejemplo'], rows: [['Unitaria', 'Una pieza pequeña (una función)', 'calcularIVA(100) da 19'], ['De integración', 'Que varias piezas trabajen juntas', 'La app guarda en la base de datos'], ['De aceptación', 'Que el cliente quede conforme', 'La odontóloga agenda una cita real']] },
          { t: 'tip', text: 'Van de lo más pequeño a lo más grande: pieza, conjunto, cliente.' },
        ] },
        { title: 'Una prueba unitaria sencilla', blocks: [
          { t: 'p', text: 'Una prueba unitaria llama a la función con un dato y compara el resultado con el esperado.' },
          { t: 'code', lang: 'python', code: 'def calcular_iva(precio):\n    return precio * 19 // 100\n\nresultado = calcular_iva(100)\nesperado = 19\nprint("OK" if resultado == esperado else "FALLÓ")', run: true },
          { t: 'tip', text: 'Prueba casos normales y casos borde, como cero.' },
          { t: 'warn', text: 'Que una prueba pase no prueba que no haya errores; solo que ese caso funciona.' },
        ] },
      ],
      example: {
        title: 'Probar un descuento',
        story: 'Una tienda da 10% de descuento. La programadora prueba la función con 1000, con 0 y con 50, para comprobar que da lo esperado.',
        code: { lang: 'python', code: 'def descuento(precio):\n    return precio * 10 // 100\n\nprint(descuento(1000) == 100)\nprint(descuento(0) == 0)\nprint(descuento(50) == 5)', run: true },
        note: 'Tres pruebas, tres True. Si alguna da False, hay un bug.',
      },
      practice: [
        { type: 'match', q: 'Une cada prueba con su descripción:', pairs: [['Unitaria', 'Revisa una función sola'], ['Integración', 'Revisa que varias partes funcionen juntas'], ['Aceptación', 'El cliente confirma que sirve']], explain: 'Van de lo más pequeño (una función) a lo más grande (el cliente).' },
        { type: 'mcq', q: 'La app guarda un pedido en la base de datos y funciona bien. ¿Qué prueba confirma que app y base de datos trabajan juntas?', options: ['Unitaria', 'De integración', 'De aceptación'], answer: 1, wrong: { 0: 'La unitaria revisa una pieza aislada.', 2: 'La de aceptación la hace el cliente.' }, explain: 'Revisar la unión de varias partes es integración.', hints: ['Son varias piezas trabajando juntas.'] },
        { type: 'bug', q: 'Esta prueba debería dar OK, pero da error. Toca la línea con el bug:', code: 'def doble(n):\n    return n + 2\n\nprint(doble(5) == 10)', bugLine: 2, explain: 'La función suma 2 en vez de multiplicar por 2. Con 5 da 7, no 10.' },
      ],
      challenge: { type: 'code', lang: 'python', q: '🎯 Misión: define la función `doble(n)` que devuelva el doble de n. Luego lee un número con input() e imprime doble(numero).', starter: 'def doble(n):\n    # tu código\n',
        tests: [{ inputs: ['4'], output: '8' }, { inputs: ['0'], output: '0' }, { inputs: ['25'], output: '50' }], checks: [{ re: 'def\\s+doble', msg: 'Define la función doble(n).' }, { re: 'return', msg: 'Usa return para devolver el resultado.' }],
        solution: 'def doble(n):\n    return n * 2\n\nnumero = int(input())\nprint(doble(numero))', hints: ['Usa return n * 2.', 'Después de la función, lee con int(input()) e imprime doble(numero).'], explain: 'Una función que devuelve el doble y una llamada con datos distintos: así se prueba.' },
      summary: ['Las pruebas buscan errores antes de que lleguen al usuario.', 'Unitarias (una pieza), de integración (varias piezas) y de aceptación (el cliente).', 'Prueba casos normales y casos borde.'],
    },
    // ───────────── L7 ─────────────
    {
      id: 'm6-l7', title: 'Control de versiones con Git y GitHub', emoji: '🌿', minutes: 9,
      learn: [
        { title: 'Guardar partidas como en un videojuego', blocks: [
          { t: 'p', text: '**Git** es un programa que guarda el historial de tu proyecto. Cada "guardado" se llama **commit**.' },
          { t: 'analogy', text: 'Es como guardar partidas en un videojuego: si algo sale mal, vuelves a una partida anterior. Un commit es un punto de guardado con nombre.' },
          { t: 'p', text: '**GitHub** es una página web donde subes tu proyecto para guardarlo en internet y trabajar con otras personas.' },
        ] },
        { title: 'Los comandos básicos', blocks: [
          { t: 'table', head: ['Comando', 'Qué hace'], rows: [['git init', 'Empieza a seguir la carpeta con Git'], ['git add .', 'Prepara los cambios para guardar'], ['git commit -m "mensaje"', 'Guarda la partida con un mensaje'], ['git branch', 'Muestra o crea ramas'], ['git push', 'Sube tus commits a GitHub'], ['git pull', 'Baja los cambios nuevos de GitHub']] },
          { t: 'tip', text: 'Orden típico: add, commit, push.' },
        ] },
        { title: 'Ramas: un mundo paralelo', blocks: [
          { t: 'p', text: 'Una **rama (branch)** es una copia paralela del proyecto. Pruebas ideas nuevas sin dañar la versión principal (`main`).' },
          { t: 'analogy', text: 'Es como abrir una partida nueva para probar una estrategia arriesgada. Si funciona, la juntas con tu partida principal.' },
          { t: 'code', lang: 'text', code: 'git branch login\ngit checkout login\ngit add .\ngit commit -m "Agrega pantalla de login"\ngit push' },
        ] },
      ],
      example: {
        title: 'Subir tu primer proyecto',
        story: 'Camila tiene la carpeta "tienda". Quiere guardar su trabajo y subirlo a GitHub.',
        pseudo: 'git init\ngit add .\ngit commit -m "Primera versión de la tienda"\ngit push',
        note: 'Primero preparas (add), luego guardas (commit) y al final subes (push).',
      },
      practice: [
        { type: 'match', q: 'Une cada comando con su función:', pairs: [['git init', 'Empezar a seguir el proyecto'], ['git commit', 'Guardar una versión con mensaje'], ['git push', 'Subir a GitHub'], ['git pull', 'Bajar cambios nuevos']], explain: 'init inicia, commit guarda, push sube y pull baja.' },
        { type: 'order', q: 'Ordena los pasos para guardar y subir tus cambios:', items: ['git add .', 'git commit -m "Agrega carrito"', 'git push'], explain: 'Se preparan, se guardan con mensaje y luego se suben.' },
        { type: 'mcq', q: 'Quieres probar un diseño nuevo sin dañar la versión que ya funciona. ¿Qué usas?', options: ['Una rama (branch)', 'git pull', 'Borrar todo y empezar'], answer: 0, wrong: { 1: 'pull baja cambios de GitHub; no crea una copia paralela.', 2: 'Borrar todo perdería el trabajo.' }, explain: 'Una rama es una copia paralela para experimentar con seguridad.', hints: ['Piensa en una partida paralela.'] },
      ],
      challenge: { type: 'code', lang: 'pseudo', q: '🎯 Misión: escribe los comandos de Git para guardar tus cambios con el mensaje "Agrega login" y subirlos a GitHub.', starter: '',
        checks: [{ re: 'git\\s+add', msg: 'Primero prepara los cambios con git add.' }, { re: 'git\\s+commit\\s+-m', msg: 'Guarda con git commit -m "mensaje".' }, { re: 'git\\s+push', msg: 'Sube con git push.' }],
        solution: 'git add .\ngit commit -m "Agrega login"\ngit push', hints: ['Son tres comandos: add, commit, push.'], explain: 'add prepara, commit guarda y push sube a GitHub.' },
      summary: ['Git guarda el historial; un commit es como guardar una partida.', 'Orden típico: git add, git commit, git push.', 'Una rama permite experimentar sin dañar la versión principal.'],
    },
    // ───────────── L8 ─────────────
    {
      id: 'm6-l8', title: 'Metodologías ágiles', emoji: '⚡', minutes: 7,
      learn: [
        { title: 'Entregar poco a poco', blocks: [
          { t: 'p', text: 'Las **metodologías ágiles** construyen el software en partes pequeñas, entregando algo útil cada pocas semanas y escuchando al cliente.' },
          { t: 'analogy', text: 'Es como cocinar un almuerzo para una fiesta probando la sazón mientras cocinas, en vez de esperar al final para descubrir que quedó desabrido.' },
        ] },
        { title: 'Cascada vs ágil', blocks: [
          { t: 'table', head: ['', 'Cascada', 'Ágil'], rows: [['Forma', 'Etapas una tras otra', 'Ciclos cortos que se repiten'], ['Entrega', 'Todo al final', 'Poco a poco'], ['Cambios', 'Difíciles y costosos', 'Bienvenidos'], ['Cliente', 'Aparece al inicio y al final', 'Participa todo el tiempo']] },
          { t: 'tip', text: 'Ágil no significa "sin planear": significa planear en pedazos pequeños.' },
        ] },
        { title: 'Valores del Manifiesto Ágil', blocks: [
          { t: 'list', items: ['**Personas** e interacciones sobre procesos y herramientas.', '**Software funcionando** sobre documentación extensa.', '**Colaborar con el cliente** sobre negociar contratos.', '**Responder al cambio** sobre seguir un plan rígido.'] },
          { t: 'tip', text: 'No dice que lo de la derecha sea malo; solo que lo de la izquierda importa más.' },
        ] },
      ],
      example: {
        title: 'App de domicilios',
        story: 'Un equipo en Medellín hace una app de domicilios. En 2 semanas entrega solo "ver menú". Los restaurantes la prueban y piden cambios. En las 2 siguientes agregan "hacer pedido".',
        pseudo: 'Ciclo 1: ver menú -> se prueba -> opiniones\nCiclo 2: hacer pedido -> se prueba -> opiniones\nCiclo 3: pagar -> se prueba -> opiniones',
        note: 'Cada ciclo entrega algo que ya se puede usar y se ajusta con la opinión real.',
      },
      practice: [
        { type: 'mcq', q: '¿Cuál es una característica de las metodologías ágiles?', options: ['Entregar todo el software al final del proyecto', 'Entregar partes pequeñas cada pocas semanas', 'No hablar con el cliente'], answer: 1, wrong: { 0: 'Eso es más propio de cascada.', 2: 'En ágil el cliente participa constantemente.' }, explain: 'Ágil entrega por ciclos cortos y recibe opinión continua.', hints: ['Piensa en "poco a poco".'] },
        { type: 'tf', q: 'En una metodología ágil, los cambios que pide el cliente a mitad del proyecto son bienvenidos.', answer: true, explain: 'Responder al cambio es uno de los valores ágiles.' },
        { type: 'match', q: 'Une el valor ágil con su idea:', pairs: [['Software funcionando', 'Más importante que mucha documentación'], ['Colaborar con el cliente', 'Más importante que pelear contratos'], ['Responder al cambio', 'Más importante que seguir un plan rígido']], explain: 'El Manifiesto Ágil prefiere lo práctico y flexible.' },
      ],
      challenge: { type: 'order', q: '🎯 Misión: ordena un ciclo ágil de dos semanas.', items: ['Elegir qué construir en este ciclo', 'Construir esa parte', 'Mostrársela al cliente', 'Recoger opiniones y ajustar el plan'], explain: 'Se planea una parte pequeña, se construye, se muestra y se aprende para el siguiente ciclo.' },
      summary: ['Ágil = entregar en ciclos cortos y mejorar con opinión del cliente.', 'Cascada entrega todo al final; ágil entrega poco a poco.', 'Los cambios son bienvenidos y las personas importan más que los procesos.'],
    },
    // ───────────── L9 ─────────────
    {
      id: 'm6-l9', title: 'Scrum: Product Backlog, Sprint Backlog e Incremento', emoji: '📚', minutes: 8,
      learn: [
        { title: '¿Qué es Scrum?', blocks: [
          { t: 'p', text: '**Scrum** es una forma ágil de trabajar en equipo. El trabajo se divide en **sprints**: períodos cortos, de 1 a 4 semanas, al final de los cuales hay algo listo.' },
          { t: 'analogy', text: 'Es como un campeonato de fútbol por fechas: cada fecha (sprint) juegas un partido y ves cómo vas.' },
        ] },
        { title: 'Las dos listas', blocks: [
          { t: 'p', text: 'El **Product Backlog** es la lista ordenada de todo lo que el producto podría necesitar. Es la lista de deseos completa.' },
          { t: 'p', text: 'El **Sprint Backlog** son los elementos que el equipo elige hacer en este sprint, más el plan para lograrlos.' },
          { t: 'analogy', text: 'El Product Backlog es la lista del mercado del mes. El Sprint Backlog es lo que compras esta semana.' },
        ] },
        { title: 'El Incremento', blocks: [
          { t: 'p', text: 'El **Incremento** es el resultado utilizable del sprint: una parte del producto terminada y que funciona, sumada a lo anterior.' },
          { t: 'table', head: ['Artefacto', 'Qué es', 'Ejemplo'], rows: [['Product Backlog', 'Todo lo pendiente del producto', 'Login, carrito, pagos, reportes'], ['Sprint Backlog', 'Lo elegido para este sprint', 'Login y carrito'], ['Incremento', 'Lo terminado y funcionando', 'Ya se puede entrar y agregar al carrito']] },
          { t: 'warn', text: 'Un incremento a medias no cuenta: debe estar terminado según lo acordado por el equipo.' },
        ] },
      ],
      example: {
        title: 'App de la cooperativa',
        story: 'Una cooperativa de Bogotá pide una app. En el Product Backlog hay: registro, pagar cuota, ver extracto y reportes. En el primer sprint de 2 semanas el equipo elige registro y pagar cuota (Sprint Backlog). Al final entrega un Incremento: ya se puede registrar y pagar.',
        pseudo: 'PRODUCT BACKLOG: registro, pagar cuota, ver extracto, reportes\nSPRINT 1 (Sprint Backlog): registro, pagar cuota\nINCREMENTO: app donde ya se registra y paga',
        note: 'Del Product Backlog se escoge una parte para el sprint, y de ahí sale un incremento.',
      },
      practice: [
        { type: 'match', q: 'Une cada artefacto con su descripción:', pairs: [['Product Backlog', 'Lista de todo lo que el producto necesita'], ['Sprint Backlog', 'Lo que se hará en este sprint'], ['Incremento', 'Parte terminada y funcionando']], explain: 'Son los tres artefactos de Scrum.' },
        { type: 'mcq', q: 'El equipo escoge 3 historias de la lista grande para trabajarlas en las próximas 2 semanas. ¿Cómo se llama lo que escogió?', options: ['Product Backlog', 'Sprint Backlog', 'Incremento'], answer: 1, wrong: { 0: 'El Product Backlog es la lista completa, no solo lo elegido.', 2: 'El incremento es lo ya terminado, no lo planeado.' }, explain: 'Lo que se compromete para un sprint es el Sprint Backlog.', hints: ['Es lo que se trabaja en este sprint.'] },
        { type: 'tf', q: 'Un incremento puede ser una parte del producto a medio hacer, que todavía no funciona.', answer: false, explain: 'Falso. El incremento debe estar terminado y ser utilizable.' },
      ],
      challenge: { type: 'fill', q: '🎯 Misión: completa la frase.', template: 'El ___ es la lista completa de todo lo pendiente; de ahí se escoge el ___ para cada sprint.', blanks: [{ answers: ['Product Backlog'], options: ['Product Backlog', 'Sprint Backlog', 'Incremento'] }, { answers: ['Sprint Backlog'], options: ['Product Backlog', 'Sprint Backlog', 'Incremento'] }], explain: 'Del Product Backlog se escoge lo que entra al Sprint Backlog.' },
      summary: ['Un sprint es un período corto (1 a 4 semanas) que termina con algo listo.', 'Product Backlog = todo lo pendiente. Sprint Backlog = lo de este sprint.', 'El Incremento es la parte terminada y utilizable.'],
    },
    // ───────────── L10 ─────────────
    {
      id: 'm6-l10', title: 'Roles y eventos de Scrum', emoji: '👥', minutes: 8,
      learn: [
        { title: 'Los tres roles', blocks: [
          { t: 'p', text: 'Un equipo Scrum tiene tres roles:' },
          { t: 'table', head: ['Rol', 'Qué hace'], rows: [['Product Owner', 'Decide qué se construye y su orden de prioridad'], ['Scrum Master', 'Ayuda al equipo a seguir Scrum y quita obstáculos'], ['Developers (equipo de desarrollo)', 'Construyen el producto: programan, prueban, diseñan']] },
          { t: 'analogy', text: 'Piensa en un equipo de fútbol: el Product Owner decide qué partido ganar, el Scrum Master es quien cuida que el equipo juegue bien, y los Developers juegan en la cancha.' },
        ] },
        { title: 'Los eventos', blocks: [
          { t: 'list', items: ['**Sprint Planning**: se planea qué se hará en el sprint.', '**Daily Scrum**: reunión diaria de 15 minutos para coordinarse.', '**Sprint Review**: se muestra el incremento y se recibe opinión.', '**Sprint Retrospective**: el equipo analiza cómo mejorar su forma de trabajar.'] },
          { t: 'tip', text: 'Planning abre el sprint; Review y Retrospective lo cierran.' },
        ] },
        { title: 'El ciclo completo', blocks: [
          { t: 'flow', steps: [{ shape: 'start', text: 'Sprint Planning' }, { shape: 'process', text: 'Daily Scrum cada día' }, { shape: 'process', text: 'Sprint Review: mostrar el incremento' }, { shape: 'process', text: 'Retrospective: mejorar' }, { shape: 'end', text: 'Nuevo sprint' }] },
          { t: 'tip', text: 'En el Daily se responde: ¿qué hice ayer?, ¿qué haré hoy?, ¿qué me bloquea?' },
        ] },
      ],
      example: {
        title: 'Un sprint de dos semanas',
        story: 'El lunes el equipo hace el Sprint Planning. Cada mañana, a las 8:00, hacen el Daily de 15 minutos. El último viernes muestran la app a la cooperativa (Review) y por la tarde conversan sobre cómo mejorar (Retrospective).',
        pseudo: 'Lunes: Sprint Planning\nCada día: Daily Scrum (15 min)\nViernes final: Sprint Review\nViernes final: Retrospective\nLunes siguiente: nuevo Sprint',
        note: 'Los eventos ocurren siempre en el mismo ritmo, sprint tras sprint.',
      },
      practice: [
        { type: 'match', q: 'Une cada rol con su responsabilidad:', pairs: [['Product Owner', 'Decide qué se construye primero'], ['Scrum Master', 'Ayuda a seguir Scrum y quita obstáculos'], ['Developers', 'Construyen el producto']], explain: 'Cada rol tiene un trabajo claro dentro del equipo.' },
        { type: 'mcq', q: 'Al final del sprint el equipo muestra el trabajo terminado al cliente. ¿Qué evento es?', options: ['Daily Scrum', 'Sprint Review', 'Sprint Planning'], answer: 1, wrong: { 0: 'El Daily es una reunión corta diaria entre el equipo.', 2: 'El Planning ocurre al inicio, no al final.' }, explain: 'En la Sprint Review se muestra el incremento y se reciben opiniones.', hints: ['Es al final y hay una demostración.'] },
        { type: 'input', q: '¿Cuántos minutos dura como máximo el Daily Scrum? (número)', answers: ['15'], explain: 'El Daily Scrum dura 15 minutos como máximo.', hints: ['Es una reunión muy corta.'] },
      ],
      challenge: { type: 'order', q: '🎯 Misión: ordena los eventos de un sprint.', items: ['Sprint Planning', 'Daily Scrum', 'Sprint Review', 'Sprint Retrospective'], explain: 'Se planea, se trabaja con reuniones diarias, se muestra el resultado y se analiza cómo mejorar.' },
      summary: ['Roles: Product Owner, Scrum Master y Developers.', 'Eventos: Planning, Daily, Review y Retrospective.', 'El Daily dura 15 minutos y responde qué hice, qué haré y qué me bloquea.'],
    },
  ],
  exam: [
    { lesson: 'm6-l1', type: 'order', q: 'Ordena las primeras etapas del ciclo de vida:', items: ['Análisis', 'Diseño', 'Desarrollo', 'Pruebas'], explain: 'Se entiende, se diseña, se programa y se prueba.' },
    { lesson: 'm6-l2', type: 'mcq', q: '"La app debe soportar 1.000 usuarios al mismo tiempo" es un requerimiento...', options: ['Funcional', 'No funcional', 'Ninguno de los dos tipos'], answer: 1, explain: 'Habla de capacidad (una cualidad), no de una acción concreta.' },
    { lesson: 'm6-l3', type: 'mcq', q: '¿Qué parte de una historia de usuario indica el beneficio?', options: ['Como…', 'Quiero…', 'Para…'], answer: 2, explain: 'El "para" explica por qué se necesita.' },
    { lesson: 'm6-l4', type: 'fill', q: 'Completa:', template: '___ que estoy en el carrito, ___ pago, ___ veo la factura.', blanks: [{ answers: ['Dado'], options: ['Dado', 'Cuando', 'Entonces'] }, { answers: ['Cuando'], options: ['Dado', 'Cuando', 'Entonces'] }, { answers: ['Entonces'], options: ['Dado', 'Cuando', 'Entonces'] }], explain: 'Dado, Cuando, Entonces.' },
    { lesson: 'm6-l5', type: 'match', q: 'Une el diagrama con su uso:', pairs: [['Casos de uso', 'Qué hace cada actor'], ['Clases', 'Atributos y métodos'], ['Secuencia', 'Orden de mensajes']], explain: 'Cada diagrama UML tiene su propósito.' },
    { lesson: 'm6-l6', type: 'tf', q: 'Una prueba unitaria revisa una pieza pequeña del código, como una función.', answer: true, explain: 'Unitaria = una pieza aislada.' },
    { lesson: 'm6-l7', type: 'order', q: 'Ordena para subir cambios a GitHub:', items: ['git add .', 'git commit -m "mensaje"', 'git push'], explain: 'Preparar, guardar y subir.' },
    { lesson: 'm6-l8', type: 'multi', q: 'Marca lo que es propio de las metodologías ágiles:', options: ['Ciclos cortos', 'Entrega única al final', 'Responder al cambio', 'Cliente ausente'], answers: [0, 2], explain: 'Ágil usa ciclos cortos y acepta cambios; no espera al final ni ignora al cliente.' },
    { lesson: 'm6-l9', type: 'mcq', q: '¿Qué es el Incremento en Scrum?', options: ['La lista de todo lo pendiente', 'Una parte del producto terminada y utilizable', 'Una reunión diaria'], answer: 1, explain: 'El incremento es el resultado utilizable del sprint.' },
    { lesson: 'm6-l10', type: 'mcq', q: '¿Quién decide qué se construye primero?', options: ['Product Owner', 'Scrum Master', 'Developers'], answer: 0, explain: 'El Product Owner ordena las prioridades del Product Backlog.' },
  ],
});
