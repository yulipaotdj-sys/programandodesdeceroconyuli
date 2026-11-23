registerWorld({
  id: 'm1', n: 1, title: 'Pensamiento lógico y fundamentos', subtitle: 'Aprende a pensar como programadora',
  emoji: '🧠', color: '#8b5cf6',
  intro: 'Antes de escribir código, una programadora aprende a pensar con orden. En este mundo empiezas desde cero: qué es programar, cómo se resuelve un problema paso a paso y cómo se guardan y comparan datos. Todo con ejemplos de tu vida diaria: tinto, bus, cuadernos y WhatsApp.',
  badge: { name: 'Maestra de la lógica', emoji: '🧠' },
  lessons: [
    // ───────────── L1 ─────────────
    {
      id: 'm1-l1', title: '¿Qué significa programar?', emoji: '👋', minutes: 6,
      learn: [
        { title: 'Bienvenida: no necesitas saber nada', blocks: [
          { t: 'p', text: 'Aquí nadie espera que ya sepas programar. Empezamos desde cero y a tu ritmo.' },
          { t: 'p', text: '**Programar** es darle instrucciones claras y ordenadas a un computador para que haga una tarea.' },
          { t: 'analogy', text: 'Es como escribir una receta de cocina. Tú eres la que escribe la receta y el computador es quien la sigue al pie de la letra.' },
        ] },
        { title: 'El computador obedece, pero no adivina', blocks: [
          { t: 'p', text: 'Un computador es muy rápido, pero no piensa por sí mismo. Solo hace lo que tú le dices.' },
          { t: 'list', items: ['Si falta un paso, no lo inventa.', 'Si el orden está mal, el resultado sale mal.', 'Si la instrucción es confusa, se equivoca.'] },
          { t: 'tip', text: 'Programar es explicar las cosas tan claro que hasta alguien que no sabe nada pueda seguirlas.' },
        ] },
        { title: 'Programas que ya usas todos los días', blocks: [
          { t: 'p', text: 'Un **programa** es un conjunto de instrucciones que el computador ejecuta. Ya usas muchos sin darte cuenta.' },
          { t: 'table', head: ['Lo que haces', 'El programa que trabaja'], rows: [['Escribir por WhatsApp', 'La app de mensajes'], ['Sacar plata del cajero', 'El software del banco'], ['Ver la hora en el celular', 'El reloj del teléfono']] },
          { t: 'p', text: 'Alguien como tú escribió esas instrucciones. Y tú también puedes aprender a hacerlo.' },
        ] },
      ],
      example: {
        title: 'La receta del tinto',
        story: 'Tu mamá te explica cómo hacer un tinto: hierves agua, pones el café y sirves. Si se salta un paso, el tinto sale mal. Con un computador pasa igual: las instrucciones deben estar completas y en orden.',
        pseudo: 'INICIO\n  Hervir el agua\n  Poner el café\n  Servir en la taza\nFIN',
        note: 'Esto no es código real todavía: es una idea clara escrita en orden. Ese es el primer paso para programar.',
      },
      practice: [
        { type: 'mcq', q: '¿Qué significa programar?', options: ['Dibujar páginas bonitas', 'Darle instrucciones claras y ordenadas a un computador', 'Reparar la pantalla de un computador'], answer: 1,
          wrong: { 0: 'Diseñar es otra tarea. Programar es dar instrucciones para que el computador haga algo.', 2: 'Reparar piezas es de técnicos de hardware. Programar es escribir instrucciones.' },
          explain: 'Programar es explicarle al computador, paso a paso, lo que debe hacer.', hints: ['Piensa en una receta de cocina.'] },
        { type: 'tf', q: 'Un computador adivina lo que quisiste decir cuando te falta un paso en las instrucciones.', answer: false, explain: 'No adivina. Solo hace lo que le escribes. Si falta un paso, el resultado sale mal o no sale.' },
        { type: 'match', q: 'Une cada parte de la receta con su equivalente en programación:', pairs: [['La receta escrita', 'El programa'], ['Los ingredientes', 'Los datos'], ['La persona que cocina', 'El computador'], ['El plato terminado', 'El resultado']], explain: 'La receta es el programa, los ingredientes son los datos, quien cocina es el computador y el plato es el resultado.', hints: ['El computador es quien hace el trabajo, como quien cocina.'] },
      ],
      challenge: { type: 'multi', q: '🎯 Misión: marca TODO lo que funciona gracias a un programa.', options: ['La app de WhatsApp', 'El cajero automático', 'Una piedra del río', 'El semáforo inteligente de una ciudad'], answers: [0, 1, 3],
        explain: 'WhatsApp, el cajero y un semáforo inteligente siguen instrucciones escritas por personas. Una piedra no.', hints: ['Busca lo que sigue instrucciones escritas por alguien.'] },
      summary: ['Programar es dar instrucciones claras y ordenadas a un computador.', 'El computador obedece al pie de la letra y no adivina.', 'Un programa es un conjunto de instrucciones, como una receta.', 'Tú puedes aprender, aunque hoy empieces desde cero.'],
    },
    // ───────────── L2 ─────────────
    {
      id: 'm1-l2', title: '¿Qué es un algoritmo?', emoji: '📋', minutes: 6,
      learn: [
        { title: 'Una receta con pasos en orden', blocks: [
          { t: 'p', text: 'Un **algoritmo** es una lista de pasos ordenados que resuelve un problema o cumple una tarea.' },
          { t: 'analogy', text: 'Cuando sigues las indicaciones para llegar a una dirección, estás siguiendo un algoritmo: "camina dos cuadras, gira a la derecha".' },
        ] },
        { title: 'Algoritmos de todos los días', blocks: [
          { t: 'p', text: 'Sin saberlo, usas algoritmos todo el tiempo. Mira uno para enviar un WhatsApp:' },
          { t: 'steps', items: ['Abrir la app de WhatsApp', 'Elegir el chat de la persona', 'Escribir el mensaje', 'Tocar el botón de enviar'] },
          { t: 'tip', text: 'Cada paso es una acción pequeña y clara. Nadie queda con dudas de qué hacer.' },
        ] },
        { title: 'Lo que hace bueno a un algoritmo', blocks: [
          { t: 'list', items: ['**Claro**: cada paso se entiende sin dudas.', '**Ordenado**: el orden de los pasos importa.', '**Finito**: tiene un inicio y un final.', '**Completo**: no le falta ningún paso.'] },
          { t: 'warn', text: 'Si cambias el orden, el resultado cambia. Echar el café antes de hervir el agua no da el mismo tinto.' },
        ] },
      ],
      example: {
        title: 'Cruzar la calle',
        story: 'Un niño aprende a cruzar la calle en la esquina. Su abuela le dicta los pasos uno por uno. Sin saberlo, le enseñó un algoritmo.',
        pseudo: 'INICIO\n  Ir a la esquina\n  Mirar a la izquierda y a la derecha\n  SI no vienen carros ENTONCES\n    Cruzar caminando\n  FIN SI\nFIN',
        note: 'Los pasos son pocos, claros y en orden. Eso es un buen algoritmo.',
      },
      practice: [
        { type: 'order', q: 'Ordena los pasos del algoritmo para preparar un tinto:', items: ['Hervir el agua', 'Poner el café en el filtro', 'Echar el agua caliente', 'Esperar a que baje el tinto', 'Servir en la taza'], explain: 'Primero se hierve el agua, luego se prepara el café, se vierte el agua y al final se sirve.', hints: ['Lo primero es calentar el agua.'] },
        { type: 'tf', q: 'En un algoritmo, el orden de los pasos no importa.', answer: false, explain: 'El orden importa mucho. Si sirves el tinto antes de hervir el agua, el resultado sale mal.' },
        { type: 'multi', q: 'Marca TODAS las características de un buen algoritmo:', options: ['Pasos claros', 'Pasos ordenados', 'Nunca termina', 'Le faltan pasos importantes'], answers: [0, 1], explain: 'Un buen algoritmo es claro y ordenado, además de finito y completo. Uno que nunca termina o que está incompleto no sirve.', hints: ['Un algoritmo debe tener final y estar completo.'] },
      ],
      challenge: { type: 'order', q: '🎯 Misión: ordena los pasos para enviar una foto por WhatsApp.', items: ['Abrir WhatsApp', 'Entrar al chat de la persona', 'Tocar el clip para adjuntar', 'Elegir la foto de la galería', 'Tocar el botón de enviar'], explain: 'Primero abres la app, entras al chat, adjuntas la foto, la eliges y la envías.', hints: ['No puedes adjuntar antes de abrir el chat.'] },
      summary: ['Un algoritmo es una lista de pasos ordenados que resuelve un problema.', 'Debe ser claro, ordenado, finito y completo.', 'Usas algoritmos a diario: hacer tinto, cruzar la calle, enviar un mensaje.'],
    },
    // ───────────── L3 ─────────────
    {
      id: 'm1-l3', title: '¿Qué es un problema y cómo analizarlo?', emoji: '🔍', minutes: 7,
      learn: [
        { title: 'Un problema es una pregunta por resolver', blocks: [
          { t: 'p', text: 'En programación, un **problema** es una situación donde conoces algunos datos y quieres llegar a un resultado.' },
          { t: 'analogy', text: 'Es como una cuenta en la tienda: sabes el precio y la cantidad, y quieres saber cuánto pagar.' },
        ] },
        { title: 'Analizar antes de resolver', blocks: [
          { t: 'p', text: 'Antes de escribir cualquier solución, **analiza** el problema con estas preguntas:' },
          { t: 'steps', items: ['¿Qué datos tengo?', '¿Qué me piden encontrar?', '¿Qué operación o regla relaciona los datos?', '¿Cómo muestro la respuesta?'] },
          { t: 'tip', text: 'Subraya los números y las palabras clave del enunciado. Casi siempre ahí está la pista.' },
        ] },
        { title: 'Un ejemplo con cuadernos', blocks: [
          { t: 'p', text: 'Problema: "Compras 4 cuadernos de $3.500 cada uno. ¿Cuánto pagas en total?"' },
          { t: 'table', head: ['Pregunta', 'Respuesta'], rows: [['Datos', 'precio $3.500 y cantidad 4'], ['Qué piden', 'el total a pagar'], ['Regla', 'precio × cantidad'], ['Resultado', '$14.000']] },
          { t: 'warn', text: 'Si no entiendes qué te piden, cualquier solución saldrá mal. Lee el problema dos veces.' },
        ] },
      ],
      example: {
        title: 'Las empanadas del recreo',
        story: 'Laura compra 5 empanadas de $1.800 cada una. Quiere saber cuánto debe pagar. Los datos son el precio y la cantidad. Lo que piden es el total.',
        pseudo: 'DATOS: precio = 1800, cantidad = 5\nPIDEN: total a pagar\nREGLA: total = precio × cantidad\nRESULTADO: 9000',
        note: 'Separar datos, lo que piden y la regla hace el problema mucho más fácil.',
      },
      practice: [
        { type: 'mcq', q: 'Problema: "Un paquete de arroz cuesta $4.200 y compras 3. ¿Cuánto pagas?". ¿Qué te piden encontrar?', options: ['El precio de un paquete', 'La cantidad de paquetes', 'El total a pagar'], answer: 2,
          wrong: { 0: 'El precio ya te lo dan: es un dato, no lo que debes encontrar.', 1: 'La cantidad (3) también es un dato del problema.' },
          explain: 'Los datos son el precio y la cantidad. Lo que piden es el total a pagar.', hints: ['Mira la pregunta al final: "¿Cuánto pagas?".'] },
        { type: 'input', q: 'Compras 4 cuadernos a $3.500 cada uno. ¿Cuánto pagas en total?', answers: ['14000'],
          common: [{ re: '^7[.,]?500$', msg: 'Sumaste 3.500 + 4. Es una multiplicación: precio × cantidad.' }],
          explain: '3500 × 4 = 14000.', hints: ['Total = precio × cantidad.', '3.500 × 4: piensa 3.000 × 4 = 12.000 y 500 × 4 = 2.000.'] },
        { type: 'match', q: 'Une cada pieza del problema con su papel:', pairs: [['$2.800 por cuaderno', 'Dato conocido'], ['¿Cuánto pago por 6?', 'Lo que piden'], ['precio × cantidad', 'Regla de cálculo'], ['$16.800', 'Resultado']], explain: 'Primero identificas los datos, luego lo que piden, aplicas la regla y obtienes el resultado.', hints: ['El resultado es lo último que aparece.'] },
      ],
      challenge: { type: 'input', q: '🎯 Misión: Marta compra 6 cuadernos de $2.800 cada uno y paga con un billete de $20.000. ¿Cuánto dinero le devuelven?', answers: ['3200'],
        common: [{ re: '^16[.,]?800$', msg: 'Ese es lo que cuestan los cuadernos. Falta restarlo a los $20.000 con que pagó.' }],
        explain: 'Primero: 2800 × 6 = 16800. Luego: 20000 − 16800 = 3200 de vuelto.', hints: ['Hay dos pasos: calcular el total y luego el vuelto.', 'Vuelto = dinero entregado − total.'] },
      summary: ['Un problema tiene datos, algo que se pide y una regla que los une.', 'Analizar es separar datos, lo que piden y la operación.', 'Leer bien el enunciado evita muchos errores.'],
    },
    // ───────────── L4 ─────────────
    {
      id: 'm1-l4', title: 'Pensamiento computacional', emoji: '🧩', minutes: 7,
      learn: [
        { title: 'Pensar como una programadora', blocks: [
          { t: 'p', text: 'El **pensamiento computacional** es una forma de resolver problemas en pasos, como lo haría un computador.' },
          { t: 'p', text: 'No es solo para programadoras. Lo usas al organizar tu semana o al buscar la ruta del bus.' },
        ] },
        { title: 'Los 4 pilares', blocks: [
          { t: 'list', items: ['**Descomposición**: partir un problema grande en partes pequeñas.', '**Patrones**: notar lo que se repite.', '**Abstracción**: quedarte con lo importante e ignorar el detalle.', '**Algoritmos**: escribir los pasos ordenados de la solución.'] },
          { t: 'tip', text: 'Aprenderás cada pilar con calma en las próximas lecciones.' },
        ] },
        { title: 'Un ejemplo cotidiano', blocks: [
          { t: 'p', text: 'Quieres llegar a clase en bus. Pensamiento computacional en acción:' },
          { t: 'table', head: ['Pilar', 'En tu viaje'], rows: [['Descomposición', 'caminar al paradero, tomar el bus, bajarte'], ['Patrones', 'el bus pasa cada 15 minutos'], ['Abstracción', 'solo importa la ruta, no el color del bus'], ['Algoritmo', 'los pasos en orden para llegar']] },
        ] },
      ],
      example: {
        title: 'Cruzar la calle con lógica',
        story: 'Para cruzar la calle decides según lo que ves. Si no vienen carros, cruzas; si vienen, esperas. Descompones la acción, ignoras detalles como el color de los carros y sigues pasos ordenados.',
        pseudo: 'INICIO\n  Mirar a ambos lados\n  SI vienen carros ENTONCES\n    Esperar\n  SINO\n    Cruzar\n  FIN SI\nFIN',
        note: 'Aquí aparece una decisión: una pregunta cuya respuesta cambia lo que hacemos.',
      },
      practice: [
        { type: 'match', q: 'Une cada pilar con su descripción:', pairs: [['Descomposición', 'Partir el problema en partes pequeñas'], ['Patrones', 'Encontrar lo que se repite'], ['Abstracción', 'Ignorar detalles que no importan'], ['Algoritmo', 'Pasos ordenados para resolver']], explain: 'Cada pilar es una herramienta distinta para pensar un problema.', hints: ['La abstracción tiene que ver con dejar cosas por fuera.'] },
        { type: 'mcq', q: 'Para organizar una reunión familiar, primero decides comida, luego invitados, luego lugar. ¿Qué pilar usaste?', options: ['Descomposición', 'Abstracción', 'Patrones'], answer: 0,
          wrong: { 1: 'La abstracción sería ignorar detalles; aquí estás dividiendo la tarea en partes.', 2: 'Un patrón es algo que se repite. Aquí lo que hiciste fue dividir.' },
          explain: 'Dividiste un problema grande (la reunión) en partes pequeñas. Eso es descomposición.', hints: ['Se partió una tarea grande en varias pequeñas.'] },
        { type: 'tf', q: 'El pensamiento computacional solo sirve para quienes programan.', answer: false, explain: 'Sirve para cualquier problema: planear un viaje, organizar tareas o repartir gastos. La programación solo lo aplica al computador.' },
      ],
      challenge: { type: 'multi', q: '🎯 Misión: marca TODAS las situaciones donde se nota un PATRÓN.', options: ['Las cuotas de la universidad suben $50.000 cada semestre', 'Un bus pasa cada 20 minutos', 'Hoy llueve y mañana no sabes', 'Los buses numerados 3, 6, 9, 12…'], answers: [0, 1, 3],
        explain: 'Un patrón es algo que se repite de forma regular. La lluvia de mañana no sigue una regla que conozcas.', hints: ['Un patrón se puede predecir.'] },
      summary: ['El pensamiento computacional resuelve problemas en pasos.', 'Sus 4 pilares: descomposición, patrones, abstracción y algoritmos.', 'Lo usas en tu vida diaria, no solo con computadores.'],
    },
    // ───────────── L5 ─────────────
    {
      id: 'm1-l5', title: 'Descomposición de problemas', emoji: '🪓', minutes: 7,
      learn: [
        { title: 'Parte lo grande en partes pequeñas', blocks: [
          { t: 'p', text: 'La **descomposición** es dividir un problema grande en subproblemas más pequeños y fáciles.' },
          { t: 'analogy', text: 'Nadie se come una arepa gigante de un solo bocado. La partes en pedazos y la comes uno por uno.' },
        ] },
        { title: 'Cómo descomponer', blocks: [
          { t: 'steps', items: ['Escribe el problema grande.', 'Pregúntate: ¿de qué partes se compone?', 'Resuelve cada parte por separado.', 'Junta las soluciones en el orden correcto.'] },
          { t: 'tip', text: 'Si una parte sigue pareciendo difícil, vuelve a dividirla.' },
        ] },
        { title: 'Ejemplo: la cuenta de la papelería', blocks: [
          { t: 'p', text: 'Problema: "Compras 4 cuadernos a $3.500 y 2 lápices a $1.200. ¿Cuánto pagas?"' },
          { t: 'table', head: ['Subproblema', 'Cálculo', 'Resultado'], rows: [['Total de cuadernos', '3.500 × 4', '14.000'], ['Total de lápices', '1.200 × 2', '2.400'], ['Total de la compra', '14.000 + 2.400', '16.400']] },
          { t: 'warn', text: 'No mezcles todo en una sola cuenta. Resolver por partes evita errores.' },
        ] },
      ],
      example: {
        title: 'Hacer un mercado para la semana',
        story: 'Quieres comprar el mercado de la semana. Es mucho para pensar de una vez. Lo divides en frutas, aseo y carnes, y resuelves cada parte.',
        pseudo: 'PROBLEMA: hacer el mercado\n  Parte 1: lista de frutas y verduras\n  Parte 2: lista de aseo\n  Parte 3: lista de carnes\n  Juntar las listas y presupuestar',
        note: 'Cada parte pequeña es fácil de resolver. Juntas resuelven el problema grande.',
      },
      practice: [
        { type: 'mcq', q: '¿Qué es descomponer un problema?', options: ['Dividirlo en partes más pequeñas', 'Borrar los datos que no entiendes', 'Resolver solo la parte más fácil'], answer: 0,
          wrong: { 1: 'No se borran datos; se organizan en partes.', 2: 'Hay que resolver todas las partes, no solo la fácil.' },
          explain: 'Descomponer es dividir un problema grande en subproblemas pequeños.', hints: ['Piensa en partir la arepa gigante en pedazos.'] },
        { type: 'input', q: 'Compras 3 cuadernos a $4.000 y 5 borradores a $900. ¿Cuánto pagas en total?', answers: ['16500'],
          common: [{ re: '^12[.,]?000$', msg: 'Ese es solo el total de los cuadernos. Falta sumar los borradores.' }, { re: '^4[.,]?500$', msg: 'Ese es solo el total de los borradores. Falta sumar los cuadernos.' }],
          explain: 'Cuadernos: 4000 × 3 = 12000. Borradores: 900 × 5 = 4500. Total: 12000 + 4500 = 16500.', hints: ['Resuelve primero cada producto por separado.', 'Luego suma los dos totales.'] },
        { type: 'match', q: 'Une el problema grande con una de sus partes:', pairs: [['Organizar un cumpleaños', 'Comprar la torta'], ['Viajar a otra ciudad', 'Comprar el pasaje'], ['Hacer un trabajo del SENA', 'Buscar información'], ['Preparar el almuerzo', 'Cocinar el arroz']], explain: 'Cada parte es una tarea pequeña que contribuye al problema grande.', hints: ['Cada parte hace progresar al problema grande.'] },
      ],
      challenge: { type: 'order', q: '🎯 Misión: ordena los pasos para tomar el bus de tu casa al SENA.', items: ['Caminar hasta el paradero', 'Esperar el bus de la ruta correcta', 'Subir y pagar el pasaje', 'Pedir la parada o tocar el timbre', 'Bajar en la parada del SENA'], explain: 'Descompuesto en partes: llegar al paradero, esperar, subir, avisar y bajar.', hints: ['Primero tienes que estar en el paradero.'] },
      summary: ['Descomponer es partir un problema grande en partes pequeñas.', 'Cada parte se resuelve por separado y luego se juntan.', 'Si una parte es difícil, se vuelve a dividir.'],
    },
    // ───────────── L6 ─────────────
    {
      id: 'm1-l6', title: 'Patrones y abstracción', emoji: '🔁', minutes: 7,
      learn: [
        { title: 'Patrones: lo que se repite', blocks: [
          { t: 'p', text: 'Un **patrón** es algo que se repite siguiendo una regla. Si lo descubres, puedes predecir lo que viene.' },
          { t: 'table', head: ['Cuadernos', 'Total a pagar'], rows: [['1', '$3.500'], ['2', '$7.000'], ['3', '$10.500'], ['4', '$14.000']] },
          { t: 'p', text: 'El patrón: cada cuaderno extra suma $3.500. Con eso calculas cualquier cantidad.' },
        ] },
        { title: 'Abstracción: quedarte con lo importante', blocks: [
          { t: 'p', text: 'La **abstracción** es ignorar los detalles que no ayudan y quedarte solo con lo esencial.' },
          { t: 'analogy', text: 'El mapa del Metro no dibuja casas ni árboles. Solo muestra estaciones y líneas, porque eso es lo que necesitas para viajar.' },
        ] },
        { title: 'De varios casos a una sola fórmula', blocks: [
          { t: 'p', text: 'Los patrones y la abstracción te llevan a una regla general que sirve para muchos casos:' },
          { t: 'list', items: ['3 cuadernos a $3.500: 3 × 3.500', '7 cuadernos a $3.500: 7 × 3.500', 'Regla general: **cantidad × precio**'] },
          { t: 'tip', text: 'En programación, esa regla general se escribe con nombres (variables) en lugar de números fijos.' },
        ] },
      ],
      example: {
        title: 'Las recargas de celular',
        story: 'Recargas $5.000 el lunes, $5.000 el lunes siguiente y $5.000 el siguiente. Notas el patrón: cada lunes, la misma cantidad. En vez de anotarlo cada vez, lo resumes en una regla: recarga semanal de $5.000.',
        pseudo: 'REGLA: cada lunes recargar $5.000\nEn 4 semanas: 4 × 5.000 = 20.000',
        note: 'Descubrir el patrón convierte muchas acciones en una sola regla.',
      },
      practice: [
        { type: 'input', q: 'Un cuaderno cuesta $2.500. Si compras 1, 2, 3 y 4 pagarías $2.500, $5.000, $7.500 y $10.000. ¿Cuánto pagas por 5 cuadernos?', answers: ['12500'],
          common: [{ re: '^1[.,]?250$|^1[.,]?25$', msg: 'Revisa la cuenta: cada cuaderno extra suma $2.500.' }],
          explain: 'El patrón es sumar $2.500 por cuaderno. Por 5: 2500 × 5 = 12500.', hints: ['Mira cuánto sube el total en cada paso.'] },
        { type: 'mcq', q: '¿Cuál de estos ejemplos es una abstracción?', options: ['Dibujar un mapa del bus que solo muestra las paradas', 'Memorizar cada casa del barrio', 'Anotar el color de cada bus'], answer: 0,
          wrong: { 1: 'Memorizar cada casa es guardar detalles, no ignorarlos.', 2: 'El color del bus es un detalle que no ayuda a viajar: justo lo que se ignora.' },
          explain: 'Un mapa de paradas deja por fuera detalles innecesarios y conserva lo importante.', hints: ['Abstraer es dejar por fuera lo que no ayuda.'] },
        { type: 'tf', q: 'Encontrar un patrón nos permite predecir lo que viene.', answer: true, explain: 'Si sabes que cada semana pagas $5.000, puedes calcular cuánto pagarás en 10 semanas sin anotar una por una.' },
      ],
      challenge: { type: 'fill', q: '🎯 Misión: completa la regla general para el total de cualquier compra de cuadernos.', template: 'total = ___ ___ cantidad', blanks: [{ answers: ['precio'], options: ['precio', 'edad', 'total'] }, { answers: ['*', 'x', '×'], options: ['+', '*', '-'] }],
        explain: 'La regla general es total = precio * cantidad. Sirve para 3 cuadernos, 10 o 100.', hints: ['Es una multiplicación.'] },
      summary: ['Un patrón es algo que se repite con una regla.', 'Abstraer es ignorar detalles y quedarte con lo esencial.', 'Con ambos puedes escribir una regla general para muchos casos.'],
    },
    // ───────────── L7 ─────────────
    {
      id: 'm1-l7', title: 'Entrada, proceso y salida (IPO)', emoji: '🔄', minutes: 8,
      learn: [
        { title: 'Las tres partes de todo programa', blocks: [
          { t: 'p', text: 'Todo programa tiene tres partes. Se conocen como **IPO** (en inglés: Input, Process, Output).' },
          { t: 'list', items: ['**Entrada**: los datos que el programa recibe.', '**Proceso**: lo que hace con esos datos (cálculos, decisiones).', '**Salida**: el resultado que muestra.'] },
          { t: 'analogy', text: 'Es como un cajero de la tienda: le das el dinero y los productos (entrada), hace la cuenta (proceso) y te da el recibo (salida).' },
        ] },
        { title: 'Un ejemplo con edades', blocks: [
          { t: 'p', text: 'Problema: calcular cuántos años tienes a partir de tu año de nacimiento.' },
          { t: 'table', head: ['Parte', 'En el problema'], rows: [['Entrada', 'año de nacimiento (por ejemplo 1998)'], ['Proceso', 'año actual − año de nacimiento'], ['Salida', 'tu edad (por ejemplo 28)']] },
        ] },
        { title: 'Cómo identificarlas', blocks: [
          { t: 'steps', items: ['Pregunta: ¿qué datos necesito que me den?', 'Pregunta: ¿qué cálculo o decisión debo hacer?', 'Pregunta: ¿qué debo mostrar al final?'] },
          { t: 'warn', text: 'Un dato que el programa calcula NO es una entrada. Solo es entrada lo que viene "de afuera".' },
        ] },
      ],
      example: {
        title: 'Pagar con un billete',
        story: 'Pagas unos cuadernos con un billete. El programa necesita el precio, la cantidad y el dinero entregado. Calcula el total y el vuelto, y los muestra.',
        pseudo: 'ENTRADA: precio, cantidad, dinero_entregado\nPROCESO: total = precio * cantidad\n         vuelto = dinero_entregado - total\nSALIDA: mostrar total y vuelto',
        note: 'Cada dato que se escribe es una entrada. Cada cálculo es proceso. Lo que se muestra es la salida.',
      },
      practice: [
        { type: 'multi', q: 'Problema: "Calcula el total a pagar por unos cuadernos". Marca TODAS las ENTRADAS.', options: ['El precio de un cuaderno', 'La cantidad de cuadernos', 'El total a pagar', 'La multiplicación'], answers: [0, 1], explain: 'El precio y la cantidad se piden al usuario. El total es la salida y la multiplicación es el proceso.', hints: ['Las entradas son los datos que llegan antes del cálculo.'] },
        { type: 'mcq', q: 'Un programa pide tu edad actual y te dice en qué año naciste. ¿Cuál es la SALIDA?', options: ['Tu edad actual', 'El año actual', 'El año en que naciste'], answer: 2,
          wrong: { 0: 'La edad es lo que tú escribes: es una entrada.', 1: 'El año actual lo usa el programa para calcular, pero no es lo que muestra al final.' },
          explain: 'La salida es lo que el programa te entrega: el año de nacimiento.', hints: ['La salida es lo que aparece al final en la pantalla.'] },
        { type: 'match', q: 'Une cada acción de un programa de recarga con su parte IPO:', pairs: [['Escribir el número y el valor de la recarga', 'Entrada'], ['Verificar que el valor sea mínimo $1.000', 'Proceso'], ['Mostrar "Recarga exitosa"', 'Salida']], explain: 'Lo que escribes es entrada, lo que se verifica o calcula es proceso, y el mensaje final es salida.', hints: ['El mensaje de éxito aparece al final.'] },
      ],
      challenge: { type: 'code', lang: 'pseudo', q: '🎯 Misión: escribe el pseudocódigo para leer la edad actual y un número N de años, y mostrar la edad que tendrás dentro de N años.',
        starter: 'INICIO\n\nFIN',
        checks: [{ re: 'leer|lea|ingresar|pedir|entrada', msg: 'Debes leer (pedir) la edad y los años.' }, { re: 'mostrar|escribir|imprimir|salida', msg: 'Debes mostrar el resultado.' }, { re: '\\+|sumar|suma', msg: 'La edad futura se calcula sumando.' }],
        solution: 'INICIO\n  LEER edad\n  LEER n\n  futura = edad + n\n  MOSTRAR futura\nFIN',
        hints: ['Entradas: edad y años. Proceso: sumar. Salida: edad futura.'], explain: 'Entradas: edad y N. Proceso: edad + N. Salida: la edad futura. Por ejemplo, 20 años dentro de 7 años serán 27.' },
      summary: ['Todo programa tiene entrada, proceso y salida (IPO).', 'La entrada son los datos que llegan; el proceso es el cálculo; la salida es el resultado.', 'Un dato calculado por el programa es proceso o salida, no entrada.'],
    },
    // ───────────── L8 ─────────────
    {
      id: 'm1-l8', title: 'Variables y constantes', emoji: '📦', minutes: 8,
      learn: [
        { title: 'La variable: una cajita con nombre', blocks: [
          { t: 'p', text: 'Una **variable** es una cajita con nombre donde guardas un dato. Su contenido puede cambiar.' },
          { t: 'analogy', text: 'Es como la cajita marcada "tinto" donde guardas el café. Hoy tiene 500 gramos y mañana, 300.' },
          { t: 'code', lang: 'python', code: 'edad = 20\nprint(edad)\nedad = 21\nprint(edad)', run: true },
          { t: 'tip', text: 'El signo `=` en programación significa "guarda en". Se lee de derecha a izquierda.' },
        ] },
        { title: 'La constante: un dato que no cambia', blocks: [
          { t: 'p', text: 'Una **constante** es un dato que NO debe cambiar mientras el programa corre. Por ejemplo, el año actual en un cálculo o el valor del IVA.' },
          { t: 'code', lang: 'python', code: 'ANIO_ACTUAL = 2026\nedad = 20\nnacimiento = ANIO_ACTUAL - edad\nprint(nacimiento)', run: true },
          { t: 'p', text: 'Python no obliga a no cambiarlas. Por costumbre, las constantes se escriben en MAYÚSCULAS.' },
        ] },
        { title: 'Reglas para nombrar', blocks: [
          { t: 'list', items: ['Usa nombres claros: `precio`, no `p`.', 'Sin espacios: `total_pagar`, no `total pagar`.', 'No empieces con número: `nota1` sí, `1nota` no.', 'Python distingue mayúsculas: `Edad` y `edad` son cajitas distintas.'] },
          { t: 'warn', text: 'Si escribes un nombre distinto al que guardaste, Python dice que no lo conoce (NameError).' },
        ] },
      ],
      example: {
        title: 'La edad dentro de unos años',
        story: 'Guardas tu edad actual en una variable y calculas cuántos años tendrás dentro de 5 años. La edad es una variable; el 5 se escribe directo en el cálculo.',
        code: { lang: 'python', code: 'edad = int(input())\nfutura = edad + 5\nprint(futura)', run: true, inputs: '20' },
        note: '`input()` pide un dato y `int()` lo convierte en número entero. Cambia el 20 por tu edad y mira qué pasa.',
      },
      practice: [
        { type: 'mcq', q: '¿Cuál de estos datos conviene guardar como CONSTANTE?', options: ['La cantidad de cuadernos que compras hoy', 'El año actual usado en un cálculo', 'La edad que escribe el usuario'], answer: 1,
          wrong: { 0: 'La cantidad cambia cada compra: es una variable.', 2: 'La edad la escribe cada usuario y cambia: es una variable.' },
          explain: 'El año actual no cambia mientras corre el programa, por eso conviene una constante.', hints: ['Una constante es lo que no cambia durante el programa.'] },
        { type: 'bug', q: 'Toca la línea que tiene el error:', code: 'precio = 3500\ncantidad = 4\nprint(Precio * cantidad)', bugLine: 3, explain: 'Python distingue mayúsculas. Se guardó `precio` en minúscula, pero se usó `Precio`. Debe escribirse igual.', hints: ['Compara cómo se escribe el nombre en la línea 1 y en la 3.'] },
        { type: 'code', lang: 'python', q: 'Lee tu edad actual con input() y muestra la edad que tendrás dentro de 5 años.', starter: 'edad = int(input())\n',
          tests: [{ inputs: ['20'], output: '25' }, { inputs: ['33'], output: '38' }, { inputs: ['0'], output: '5' }],
          checks: [{ re: 'print', msg: 'Muestra el resultado con print().' }],
          solution: 'edad = int(input())\nfutura = edad + 5\nprint(futura)', hints: ['Guarda edad + 5 en una variable y muéstrala.'], explain: 'Se lee la edad, se guarda edad + 5 en `futura` y se imprime.' },
      ],
      challenge: { type: 'code', lang: 'python', q: '🎯 Misión: lee el precio y la cantidad (en este orden) con input(), guárdalos en variables y muestra el total.', starter: 'precio = int(input())\n',
        tests: [{ inputs: ['2800', '5'], output: '14000' }, { inputs: ['1200', '3'], output: '3600' }, { inputs: ['0', '8'], output: '0' }],
        checks: [{ re: 'print', msg: 'Muestra el resultado con print().' }],
        solution: 'precio = int(input())\ncantidad = int(input())\ntotal = precio * cantidad\nprint(total)', hints: ['Necesitas un segundo input() para la cantidad.', 'El total es precio * cantidad.'], explain: 'Dos variables guardan los datos y una tercera guarda el total, que se imprime.' },
      summary: ['Una variable es una cajita con nombre que guarda un dato y puede cambiar.', 'Una constante es un dato que no debe cambiar mientras corre el programa.', 'El nombre debe ser claro y escribirse siempre igual.'],
    },
    // ───────────── L9 ─────────────
    {
      id: 'm1-l9', title: 'Tipos de datos', emoji: '🏷️', minutes: 8,
      learn: [
        { title: 'No todos los datos son iguales', blocks: [
          { t: 'p', text: 'Un **tipo de dato** dice qué clase de información guarda una variable: número, texto o verdadero/falso.' },
          { t: 'analogy', text: 'En la cocina hay frascos distintos: uno para líquidos y otro para sólidos. Cada dato necesita su tipo de frasco.' },
        ] },
        { title: 'Los 4 tipos básicos en Python', blocks: [
          { t: 'table', head: ['Tipo', 'Qué guarda', 'Ejemplo'], rows: [['int', 'números enteros', '25'], ['float', 'números con decimales', '3.5'], ['str', 'texto (entre comillas)', '"Ana"'], ['bool', 'verdadero o falso', 'True']] },
          { t: 'code', lang: 'python', code: 'edad = 25\nestatura = 1.62\nnombre = "Ana"\nes_mayor = True\nprint(type(edad))\nprint(type(nombre))', run: true },
        ] },
        { title: 'Cuidado con las comillas', blocks: [
          { t: 'p', text: 'Lo que escribes con `input()` siempre llega como **texto**. Para hacer cuentas, conviértelo con `int()` o `float()`.' },
          { t: 'code', lang: 'python', code: 'a = "3" + "4"\nb = 3 + 4\nprint(a)\nprint(b)', run: true },
          { t: 'warn', text: '"3" + "4" es texto y se pega: da "34". 3 + 4 son números y suman: da 7.' },
        ] },
      ],
      example: {
        title: 'Un recibo con varios tipos',
        story: 'Un recibo de papelería guarda el nombre de la clienta (texto), la cantidad de cuadernos (entero), el precio (entero) y si pagó con tarjeta (verdadero o falso).',
        code: { lang: 'python', code: 'cliente = "Marta"\ncantidad = 4\nprecio = 3500\ntarjeta = False\nprint(cliente, cantidad * precio)', run: true },
        note: 'Cada variable guarda un tipo distinto. Python lo reconoce solo, por la forma en que escribes el valor.',
      },
      practice: [
        { type: 'match', q: 'Une cada valor con su tipo de dato:', pairs: [['18', 'int'], ['2.75', 'float'], ['"Bogotá"', 'str'], ['False', 'bool']], explain: '18 es entero, 2.75 tiene decimales (float), "Bogotá" está entre comillas (texto) y False es un valor lógico.', hints: ['Mira si tiene comillas o punto decimal.'] },
        { type: 'mcq', q: 'Si escribes `edad = "20"` (con comillas), ¿de qué tipo es `edad`?', options: ['int, porque es un número', 'str, porque está entre comillas', 'bool, porque es un valor'], answer: 1,
          wrong: { 0: 'Parece número, pero las comillas lo vuelven texto.', 2: 'bool solo guarda True o False.' },
          explain: 'Todo lo que va entre comillas es texto (str), aunque parezca número.', hints: ['Las comillas convierten el dato en texto.'] },
        { type: 'code', lang: 'python', q: 'Lee el nombre y la cantidad de cuadernos (un entero) y muestra: Ana compró 4 cuadernos (con el nombre y el número leídos).', starter: 'nombre = input()\n',
          tests: [{ inputs: ['Ana', '4'], output: 'Ana compró 4 cuadernos' }, { inputs: ['Luisa', '10'], output: 'Luisa compró 10 cuadernos' }],
          checks: [{ re: 'print', msg: 'Muestra el mensaje con print().' }],
          solution: 'nombre = input()\ncantidad = int(input())\nprint(nombre, "compró", cantidad, "cuadernos")', hints: ['print puede recibir varios datos separados por comas.'], explain: 'El nombre es texto, la cantidad se convierte a entero y print los junta con espacios.' },
      ],
      challenge: { type: 'input', q: '🎯 Misión: ¿qué muestra este código?  print("3" + "4")', answers: ['34'],
        common: [{ re: '^7$', msg: 'Si fueran números daría 7. Pero con comillas son texto y se pegan.' }],
        explain: 'Entre comillas, "3" y "4" son texto. El + los pega: 34.', hints: ['Mira las comillas: ¿son números o texto?'] },
      summary: ['Los tipos básicos son int, float, str y bool.', 'El texto va entre comillas; los números no.', 'input() entrega texto: usa int() o float() para hacer cuentas.'],
    },
    // ───────────── L10 ─────────────
    {
      id: 'm1-l10', title: 'Operadores aritméticos', emoji: '➕', minutes: 8,
      learn: [
        { title: 'Las operaciones de la calculadora', blocks: [
          { t: 'p', text: 'Los **operadores aritméticos** son los signos para hacer cuentas en un programa.' },
          { t: 'table', head: ['Operador', 'Qué hace', 'Ejemplo', 'Resultado'], rows: [['+', 'suma', '3500 + 500', '4000'], ['-', 'resta', '20000 - 14000', '6000'], ['*', 'multiplica', '3500 * 4', '14000'], ['/', 'divide', '10 / 4', '2.5'], ['//', 'división entera', '10 // 4', '2'], ['%', 'residuo (lo que sobra)', '10 % 4', '2'], ['**', 'potencia', '2 ** 3', '8']] },
          { t: 'warn', text: 'La multiplicación se escribe con `*`, no con `x`.' },
        ] },
        { title: 'Primero lo que va entre paréntesis', blocks: [
          { t: 'p', text: 'Python respeta el orden de la matemática: primero paréntesis, luego potencias, luego `*` y `/`, y al final `+` y `-`.' },
          { t: 'code', lang: 'python', code: 'print(2 + 3 * 4)\nprint((2 + 3) * 4)', run: true },
          { t: 'tip', text: 'Si dudas del orden, usa paréntesis. Hacen tu cuenta más fácil de leer.' },
        ] },
        { title: 'Aplicaciones cotidianas', blocks: [
          { t: 'p', text: 'Con estos operadores resuelves problemas de plata y de edades:' },
          { t: 'code', lang: 'python', code: 'ANIO = 2026\nedad = 31\nprint(ANIO - edad)\nprint(edad + 10)\nprint(17 % 5)', run: true },
          { t: 'analogy', text: 'El residuo es lo que sobra al repartir: 17 empanadas entre 5 personas. Tocan 3 a cada una y sobran 2.' },
        ] },
      ],
      example: {
        title: 'Año de nacimiento',
        story: 'Sabes que tienes 25 años y estamos en 2026. Para saber en qué año naciste, restas tu edad al año actual.',
        code: { lang: 'python', code: 'edad = int(input())\nnacimiento = 2026 - edad\nprint(nacimiento)', run: true, inputs: '25' },
        note: 'Es solo una resta. Cambia la edad y comprueba el año.',
      },
      practice: [
        { type: 'input', q: 'Compras 12 lápices a $850 cada uno. ¿Cuánto pagas en total?', answers: ['10200'],
          common: [{ re: '^862$', msg: 'Sumaste 850 + 12. Debes multiplicar precio × cantidad.' }],
          explain: '850 × 12 = 10200.', hints: ['850 × 10 = 8.500. Falta 850 × 2.', 'Suma 8.500 + 1.700.'] },
        { type: 'mcq', q: '¿Qué resultado da `17 % 5` en Python?', options: ['3', '2', '3.4'], answer: 1,
          wrong: { 0: 'Eso sería 17 // 5 (división entera). El % da lo que sobra.', 2: 'Eso sería 17 / 5. El % da el residuo.' },
          explain: '17 entre 5 da 3 y sobran 2. El residuo es 2.', hints: ['El % da lo que sobra después de repartir.'] },
        { type: 'code', lang: 'python', q: 'Lee la edad actual y muestra el año de nacimiento (usa 2026 como año actual).', starter: 'edad = int(input())\n',
          tests: [{ inputs: ['20'], output: '2006' }, { inputs: ['31'], output: '1995' }, { inputs: ['0'], output: '2026' }],
          checks: [{ re: 'print', msg: 'Muestra el resultado con print().' }],
          solution: 'edad = int(input())\nnacimiento = 2026 - edad\nprint(nacimiento)', hints: ['Año de nacimiento = año actual − edad.'], explain: 'Con 20 años, naciste en 2026 − 20 = 2006.' },
      ],
      challenge: { type: 'code', lang: 'python', q: '🎯 Misión: lee el precio de un cuaderno, la cantidad y el dinero entregado (en ese orden) y muestra el vuelto.', starter: 'precio = int(input())\ncantidad = int(input())\n',
        tests: [{ inputs: ['3500', '4', '20000'], output: '6000' }, { inputs: ['1200', '3', '5000'], output: '1400' }, { inputs: ['2000', '5', '10000'], output: '0' }],
        checks: [{ re: 'print', msg: 'Muestra el resultado con print().' }],
        solution: 'precio = int(input())\ncantidad = int(input())\ndinero = int(input())\nvuelto = dinero - precio * cantidad\nprint(vuelto)', hints: ['Primero el total (precio * cantidad), luego restarlo al dinero.'], explain: 'Vuelto = dinero entregado − (precio × cantidad). Por ejemplo, 20000 − 3500 × 4 = 6000.' },
      summary: ['Los operadores aritméticos son + - * / // % y **.', 'Se respeta el orden: paréntesis, potencia, multiplicar/dividir, sumar/restar.', 'Con ellos calculas precios, vueltos y edades.'],
    },
    {
      id: 'm1-l11', title: 'Operadores relacionales', emoji: '⚖️', minutes: 7,
      learn: [
        { title: 'Comparar para decidir', blocks: [
          { t: 'p', text: 'Un **operador relacional** compara dos valores y responde solo **verdadero** o **falso**.' },
          { t: 'analogy', text: 'Es como el portero de una discoteca: mira tu edad y responde sí o no. ¿Tienes 18 o más? Verdadero → entras.' },
        ] },
        { title: 'Los seis comparadores', blocks: [
          { t: 'table', head: ['Símbolo', 'Significa', 'Ejemplo', 'Resultado'], rows: [['==', 'es igual a', '5 == 5', 'Verdadero'], ['!=', 'es distinto de', '5 != 3', 'Verdadero'], ['>', 'mayor que', '3 > 8', 'Falso'], ['<', 'menor que', '3 < 8', 'Verdadero'], ['>=', 'mayor o igual', '5 >= 5', 'Verdadero'], ['<=', 'menor o igual', '9 <= 4', 'Falso']] },
          { t: 'warn', text: 'Un solo `=` guarda un valor. Para comparar se usan dos: `==`.' },
        ] },
        { title: 'Pruébalo', blocks: [
          { t: 'code', lang: 'python', code: 'edad = 20\nprint(edad >= 18)\nprint(edad == 21)\nprint(edad != 21)', run: true },
          { t: 'tip', text: 'En Python verdadero se escribe True y falso False.' },
        ] },
      ],
      example: { title: 'La entrada al cine', story: 'Para ver una película para mayores, Camila debe tener 18 años o más. Ella tiene 17.', pseudo: 'LEER edad\nresultado = edad >= 18\nMOSTRAR resultado', code: { lang: 'python', code: 'edad = int(input())\nprint(edad >= 18)', run: true, inputs: '17' }, note: 'Cambia la edad a 18 y verás True.' },
      practice: [
        { type: 'mcq', q: '¿Qué resultado da la comparación 5 >= 5?', options: ['Falso', 'Verdadero', 'Da error'], answer: 1, wrong: { 0: 'El símbolo >= incluye la igualdad: 5 es igual a 5, así que se cumple.' }, explain: '>= significa mayor O igual. Como 5 es igual a 5, es verdadero.', hints: ['Mayor o igual incluye cuando son iguales.'] },
        { type: 'match', q: 'Une cada comparación con su resultado:', pairs: [['==', 'es igual a'], ['!=', 'es distinto de'], ['>=', 'mayor o igual que'], ['<', 'menor que']], explain: '== compara igualdad, != compara diferencia, >= incluye la igualdad y < es estrictamente menor.' },
        { type: 'input', q: 'Un bus cuesta $2.800 y tienes $2.500. Escribe el resultado de: dinero >= 2800 (verdadero o falso).', answers: ['falso', 'false'], explain: '2500 no es mayor ni igual a 2800, así que es falso: no alcanza para el pasaje.', hints: ['Compara 2500 con 2800.'] },
      ],
      challenge: { type: 'code', lang: 'python', q: '🎯 Misión: lee la edad con input() y muestra True si es mayor de edad (18 o más) y False si no.', starter: 'edad = int(input())\n',
        tests: [{ inputs: ['20'], output: 'True' }, { inputs: ['17'], output: 'False' }, { inputs: ['18'], output: 'True' }],
        checks: [{ re: '>=|>\\s*17', msg: 'Usa un comparador como >= para comparar la edad.' }],
        solution: 'edad = int(input())\nprint(edad >= 18)', hints: ['print puede mostrar el resultado de una comparación.', 'edad >= 18'], explain: 'La comparación edad >= 18 ya devuelve True o False; print lo muestra. Con 18 da True por el "igual".' },
      summary: ['Los operadores relacionales comparan y devuelven verdadero o falso.', '== compara; = guarda.', '>= y <= incluyen la igualdad.'],
    },
    {
      id: 'm1-l12', title: 'Operadores lógicos (y, o, no)', emoji: '🔀', minutes: 8,
      learn: [
        { title: 'Combinar condiciones', blocks: [
          { t: 'p', text: 'A veces una sola comparación no basta. Los **operadores lógicos** unen condiciones: **and** (y), **or** (o) y **not** (no).' },
          { t: 'analogy', text: 'Para entrar a una fiesta piden invitación Y cédula (las dos). En cambio, para pagar sirve efectivo O tarjeta (una de las dos).' },
        ] },
        { title: 'Cómo funciona cada uno', blocks: [
          { t: 'table', head: ['Operador', 'Cuándo es verdadero', 'Ejemplo'], rows: [['and (y)', 'Las DOS condiciones son verdaderas', 'edad >= 18 and tiene_cedula'], ['or (o)', 'Al menos UNA es verdadera', 'pago_efectivo or pago_tarjeta'], ['not (no)', 'Invierte: lo verdadero pasa a falso', 'not llueve']] },
          { t: 'tip', text: 'and es exigente (todas deben cumplirse). or es flexible (basta una).' },
        ] },
        { title: 'En código', blocks: [
          { t: 'code', lang: 'python', code: 'nota = 4.2\nasistencia = 90\nprint(nota >= 3 and asistencia >= 80)\nprint(nota < 3 or asistencia >= 80)\nprint(not (nota >= 3))', run: true },
          { t: 'tip', text: 'Usa paréntesis para dejar claro qué se compara primero.' },
        ] },
      ],
      example: { title: 'Aprobar el curso', story: 'En el SENA, una aprendiz aprueba si su nota es 3.0 o más y asistió al 80 % o más de las clases.', pseudo: 'LEER nota, asistencia\naprobada = nota >= 3 Y asistencia >= 80\nMOSTRAR aprobada', code: { lang: 'python', code: 'nota = float(input())\nasistencia = int(input())\nprint(nota >= 3 and asistencia >= 80)', run: true, inputs: '4.0\n70' }, note: 'Tiene buena nota pero poca asistencia: el and da False.' },
      practice: [
        { type: 'tf', q: 'Con "and", si una de las dos condiciones es falsa, el resultado completo es falso.', answer: true, explain: 'and exige que TODAS se cumplan. Una sola falsa basta para que todo sea falso.' },
        { type: 'fill', q: 'Completa la regla: puede entrar si es mayor de edad Y tiene cédula.', template: 'puede_entrar = edad >= 18 ___ tiene_cedula', blanks: [{ answers: ['and'], options: ['and', 'or', 'not'] }], explain: 'Se necesitan las dos cosas, por eso se usa and.', hints: ['Las dos condiciones deben cumplirse.'] },
        { type: 'mcq', q: 'Llueve = True. ¿Qué vale "not llueve"?', options: ['True', 'False', 'Llueve'], answer: 1, wrong: { 0: 'not invierte el valor: lo verdadero se vuelve falso.' }, explain: 'not invierte: not True es False.', hints: ['not cambia verdadero por falso.'] },
      ],
      challenge: { type: 'code', lang: 'python', q: '🎯 Misión: lee la nota (decimal) y la asistencia (entero). Muestra True si nota >= 3 y asistencia >= 80; si no, False.', starter: 'nota = float(input())\nasistencia = int(input())\n',
        tests: [{ inputs: ['4.0', '90'], output: 'True' }, { inputs: ['4.0', '70'], output: 'False' }, { inputs: ['2.5', '95'], output: 'False' }, { inputs: ['3.0', '80'], output: 'True' }],
        checks: [{ re: '\\band\\b', msg: 'Une las dos condiciones con and.' }],
        solution: 'nota = float(input())\nasistencia = int(input())\nprint(nota >= 3 and asistencia >= 80)', hints: ['Necesitas dos comparaciones unidas.', 'nota >= 3 and asistencia >= 80'], explain: 'Las dos condiciones deben cumplirse: se unen con and y se muestra el resultado.' },
      summary: ['and: deben cumplirse todas.', 'or: basta con una.', 'not: invierte el resultado.'],
    },
    {
      id: 'm1-l13', title: 'Diagramas de flujo', emoji: '🗺️', minutes: 8,
      learn: [
        { title: 'Dibujar el algoritmo', blocks: [
          { t: 'p', text: 'Un **diagrama de flujo** es un mapa del algoritmo hecho con figuras y flechas. Sirve para ver el camino de un vistazo.' },
          { t: 'analogy', text: 'Es como el mapa del TransMilenio: cada figura es una estación y las flechas te dicen hacia dónde seguir.' },
        ] },
        { title: 'Las figuras', blocks: [
          { t: 'table', head: ['Figura', 'Para qué sirve'], rows: [['Óvalo', 'Inicio y fin'], ['Paralelogramo', 'Entrada o salida de datos'], ['Rectángulo', 'Proceso o cálculo'], ['Rombo', 'Decisión (sí / no)']] },
          { t: 'tip', text: 'Usa siempre la misma figura para lo mismo: así cualquiera te entiende.' },
        ] },
        { title: 'Un ejemplo completo', blocks: [
          { t: 'flow', steps: [{ shape: 'start', text: 'Inicio' }, { shape: 'io', text: 'Leer edad' }, { shape: 'decision', text: '¿edad >= 18?', yes: 'Mostrar "Mayor de edad"', no: 'Mostrar "Menor de edad"' }, { shape: 'end', text: 'Fin' }] },
          { t: 'tip', text: 'Todo diagrama tiene un solo inicio y termina en un fin.' },
        ] },
      ],
      example: { title: 'Descuento en la tienda', story: 'Si la compra supera $50.000, la tienda hace un descuento. Dibujamos el camino.', code: null, note: 'El rombo hace la pregunta; cada salida lleva a un camino distinto.' },
      practice: [
        { type: 'match', q: 'Une cada figura con su función:', pairs: [['Óvalo', 'Inicio o fin'], ['Paralelogramo', 'Entrada o salida'], ['Rectángulo', 'Proceso'], ['Rombo', 'Decisión']], explain: 'Cada figura tiene un papel fijo para que todos entiendan el diagrama.' },
        { type: 'mcq', q: '¿Qué figura usarías para la pregunta "¿el total supera $50.000?"', options: ['Rectángulo', 'Rombo', 'Óvalo'], answer: 1, wrong: { 0: 'El rectángulo es para cálculos, no para preguntas.', 2: 'El óvalo solo marca inicio y fin.' }, explain: 'Las preguntas con respuesta sí/no van en un rombo.', hints: ['Tiene dos salidas: sí y no.'] },
        { type: 'order', q: 'Ordena el diagrama para calcular el total de unos cuadernos:', items: ['Inicio', 'Leer precio y cantidad', 'total = precio × cantidad', 'Mostrar total', 'Fin'], explain: 'Empieza, se piden los datos, se calcula, se muestra y termina.' },
      ],
      challenge: { type: 'order', q: '🎯 Misión: ordena este diagrama que decide si un aprendiz aprueba.', items: ['Inicio', 'Leer nota', '¿nota >= 3? (rombo)', 'Si es sí: mostrar "Aprobó"', 'Fin'], explain: 'Después de leer la nota se pregunta con un rombo; según la respuesta se muestra el mensaje y se llega al fin.' },
      summary: ['Un diagrama de flujo dibuja el algoritmo con figuras y flechas.', 'Óvalo, paralelogramo, rectángulo y rombo tienen funciones distintas.', 'El rombo es la decisión.'],
    },
    {
      id: 'm1-l14', title: 'Pseudocódigo', emoji: '📝', minutes: 8,
      learn: [
        { title: 'Escribir en palabras', blocks: [
          { t: 'p', text: 'El **pseudocódigo** describe un algoritmo con frases parecidas al español. No es un lenguaje real: ningún computador lo ejecuta, pero lo entiende cualquier persona.' },
          { t: 'analogy', text: 'Es el borrador de una receta antes de pasarla en limpio al lenguaje del computador.' },
        ] },
        { title: 'Palabras clave', blocks: [
          { t: 'table', head: ['Palabra', 'Uso'], rows: [['INICIO / FIN', 'Empieza y termina'], ['LEER', 'Pedir un dato'], ['MOSTRAR', 'Dar un resultado'], ['SI … ENTONCES … SINO', 'Decidir']] },
          { t: 'tip', text: 'No hay una sola forma correcta de escribir pseudocódigo; lo importante es que sea claro.' },
        ] },
        { title: 'Ejemplo', blocks: [
          { t: 'code', lang: 'pseudo', code: 'INICIO\n  LEER nota\n  SI nota >= 3 ENTONCES\n    MOSTRAR "Aprobó"\n  SINO\n    MOSTRAR "No aprobó"\n  FIN SI\nFIN' },
          { t: 'tip', text: 'La sangría (espacios al inicio) ayuda a ver qué está dentro de la decisión.' },
        ] },
      ],
      example: { title: 'Total de la compra', story: 'Un cliente compra varios cuadernos y queremos saber cuánto paga.', pseudo: 'INICIO\n  LEER precio\n  LEER cantidad\n  total = precio * cantidad\n  MOSTRAR total\nFIN', code: null, note: 'Cada línea es un paso: primero los datos, luego el cálculo, al final el resultado.' },
      practice: [
        { type: 'mcq', q: '¿Cuál palabra del pseudocódigo se usa para pedir un dato?', options: ['MOSTRAR', 'LEER', 'FIN'], answer: 1, wrong: { 0: 'MOSTRAR entrega un resultado, no pide datos.' }, explain: 'LEER pide un dato; MOSTRAR lo entrega.', hints: ['Es la acción de recibir información.'] },
        { type: 'fill', q: 'Completa el pseudocódigo:', template: 'INICIO\n  ___ edad\n  SI edad >= 18 ___\n    MOSTRAR "Adulta"\n  FIN SI\nFIN', blanks: [{ answers: ['LEER'], options: ['LEER', 'MOSTRAR', 'SINO'] }, { answers: ['ENTONCES'], options: ['ENTONCES', 'FIN', 'LEER'] }], explain: 'Se lee la edad y la decisión usa SI … ENTONCES.' },
        { type: 'bug', q: 'Toca la línea con el error (falta un paso):', code: 'INICIO\n  total = precio * cantidad\n  MOSTRAR total\nFIN', bugLine: 2, explain: 'Se usa precio y cantidad sin haberlos leído antes. Falta LEER precio y LEER cantidad.' },
      ],
      challenge: { type: 'code', lang: 'pseudo', q: '🎯 Misión: escribe el pseudocódigo que lee el precio y la cantidad de cuadernos y muestra el total a pagar.', starter: 'INICIO\n\nFIN', minLines: 5,
        checks: [{ re: 'leer|lea|ingresar|entrada', msg: 'Debes leer los datos.' }, { re: 'precio', msg: 'Usa el dato precio.' }, { re: 'cantidad', msg: 'Usa el dato cantidad.' }, { re: '\\*|multiplic|x', msg: 'Multiplica precio por cantidad.' }, { re: 'mostrar|escribir|imprimir|salida', msg: 'Muestra el resultado.' }],
        solution: 'INICIO\n  LEER precio\n  LEER cantidad\n  total = precio * cantidad\n  MOSTRAR total\nFIN', hints: ['Primero leer, luego calcular, al final mostrar.'], explain: 'Entrada (LEER), proceso (multiplicar) y salida (MOSTRAR), todo entre INICIO y FIN.' },
      summary: ['El pseudocódigo describe pasos en palabras sencillas.', 'LEER entra, MOSTRAR sale, SI decide.', 'Siempre entre INICIO y FIN.'],
    },
    {
      id: 'm1-l15', title: 'Prueba de escritorio', emoji: '🔬', minutes: 8,
      learn: [
        { title: 'Probar sin computador', blocks: [
          { t: 'p', text: 'La **prueba de escritorio** consiste en seguir el algoritmo paso a paso, con lápiz y papel, anotando cómo cambian las variables.' },
          { t: 'analogy', text: 'Es como revisar una cuenta de la tienda línea por línea antes de cobrar, para estar segura de que no hay errores.' },
        ] },
        { title: 'La tabla de seguimiento', blocks: [
          { t: 'p', text: 'Algoritmo: precio = 3500, cantidad = 4, total = precio × cantidad.' },
          { t: 'table', head: ['Paso', 'precio', 'cantidad', 'total'], rows: [['1', '3500', '-', '-'], ['2', '3500', '4', '-'], ['3', '3500', '4', '14000']] },
          { t: 'tip', text: 'Una columna por variable y una fila por paso.' },
        ] },
        { title: 'Para qué sirve', blocks: [
          { t: 'list', items: ['Encontrar errores antes de programar.', 'Comprobar que el resultado es el esperado.', 'Entender qué hace un algoritmo ajeno.'] },
          { t: 'tip', text: 'Si la tabla te sale distinta a lo esperado, ya encontraste un error sin gastar tiempo programando.' },
        ] },
      ],
      example: { title: 'Acumular una suma', story: 'Una variable suma arranca en 0 y se le agregan 3 gastos: 2000, 1500 y 500.', code: { lang: 'python', code: 'suma = 0\nsuma = suma + 2000\nsuma = suma + 1500\nsuma = suma + 500\nprint(suma)', run: true }, note: 'La tabla: suma = 0, 2000, 3500, 4000.' },
      practice: [
        { type: 'input', q: 'Haz la prueba de escritorio: a = 5, b = 3, c = a * b, luego c = c + 2. ¿Cuánto vale c al final?', answers: ['17'], common: [{ re: '^15$', msg: 'Ese es el valor tras multiplicar, pero luego se le suma 2.' }], explain: 'c = 5 × 3 = 15 y después c = 15 + 2 = 17.', hints: ['Primero la multiplicación, luego la suma.'] },
        { type: 'tf', q: 'La prueba de escritorio se hace siempre con el computador encendido.', answer: false, explain: 'Se hace en papel, sin ejecutar nada: sirve justamente para revisar antes de programar.' },
        { type: 'mcq', q: 'En la tabla, ¿qué representa cada columna?', options: ['Un paso del algoritmo', 'Una variable', 'Un error'], answer: 1, wrong: { 0: 'Los pasos van en las filas, no en las columnas.' }, explain: 'Cada columna sigue a una variable; cada fila es un paso.', hints: ['Mira la tabla de ejemplo: precio, cantidad, total.'] },
      ],
      challenge: { type: 'code', lang: 'python', q: '🎯 Misión: lee tres gastos (enteros) y muestra la suma total usando una variable acumuladora.', starter: 'suma = 0\n',
        tests: [{ inputs: ['2000', '1500', '500'], output: '4000' }, { inputs: ['0', '0', '0'], output: '0' }, { inputs: ['10', '20', '30'], output: '60' }],
        checks: [{ re: 'print', msg: 'Muestra el resultado.' }],
        solution: 'suma = 0\nsuma = suma + int(input())\nsuma = suma + int(input())\nsuma = suma + int(input())\nprint(suma)', hints: ['Lee cada gasto y súmalo a suma.', 'suma = suma + int(input())'], explain: 'La variable suma acumula cada gasto; al final se muestra el total.' },
      summary: ['La prueba de escritorio sigue el algoritmo en papel.', 'Se usa una tabla: columnas = variables, filas = pasos.', 'Sirve para encontrar errores a tiempo.'],
    },
  ],
  exam: [
    { lesson: 'm1-l1', type: 'mcq', q: '¿Qué es programar?', options: ['Dar instrucciones claras y ordenadas a un computador', 'Arreglar computadores dañados', 'Navegar por internet'], answer: 0, explain: 'Programar es escribir instrucciones precisas para que el computador las siga.' },
    { lesson: 'm1-l2', type: 'order', q: 'Ordena el algoritmo para preparar un tinto:', items: ['Hervir el agua', 'Agregar el café', 'Esperar un momento', 'Servir en la taza'], explain: 'El orden importa: un algoritmo es una lista de pasos ordenados.' },
    { lesson: 'm1-l3', type: 'tf', q: 'Antes de resolver un problema conviene identificar qué datos tengo y qué me piden.', answer: true, explain: 'Entender el problema es el primer paso para resolverlo bien.' },
    { lesson: 'm1-l5', type: 'mcq', q: 'Dividir un problema grande en partes pequeñas se llama…', options: ['Descomposición', 'Compilación', 'Depuración'], answer: 0, explain: 'La descomposición separa un problema en partes más fáciles.' },
    { lesson: 'm1-l7', type: 'match', q: 'Une cada parte con su ejemplo en la compra de cuadernos:', pairs: [['Entrada', 'Precio y cantidad'], ['Proceso', 'Multiplicar'], ['Salida', 'Total a pagar']], explain: 'Entrada: datos que llegan. Proceso: cálculo. Salida: resultado.' },
    { lesson: 'm1-l10', type: 'input', q: 'Cuadernos a $3.500, compras 4 y pagas con $20.000. ¿Cuánto te devuelven?', answers: ['6000'], common: [{ re: '^14[.,]?000$', msg: 'Ese es el total de los cuadernos; falta restarlo a lo que pagaste.' }], explain: '3500 × 4 = 14000 y 20000 − 14000 = 6000.' },
    { lesson: 'm1-l11', type: 'tf', q: 'La comparación 7 != 7 da verdadero.', answer: false, explain: '!= significa "distinto de". 7 es igual a 7, así que es falso.' },
    { lesson: 'm1-l12', type: 'mcq', q: 'Para entrar se necesita invitación Y cédula. Faltó la cédula. ¿Puede entrar?', options: ['Sí, basta una', 'No, con "y" deben estar las dos', 'Depende del día'], answer: 1, explain: 'and exige que se cumplan todas las condiciones.' },
    { lesson: 'm1-l14', type: 'fill', q: 'Completa el pseudocódigo:', template: 'INICIO\n  ___ nota\n  ___ nota\nFIN', blanks: [{ answers: ['LEER'], options: ['LEER', 'MOSTRAR'] }, { answers: ['MOSTRAR'], options: ['LEER', 'MOSTRAR'] }], explain: 'Se lee el dato y luego se muestra.' },
    { lesson: 'm1-l15', type: 'input', q: 'Prueba de escritorio: x = 4; x = x * 2; x = x + 1. ¿Cuánto vale x?', answers: ['9'], explain: '4 × 2 = 8 y 8 + 1 = 9.' },
  ],
});
