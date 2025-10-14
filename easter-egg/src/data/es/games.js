// 游戏分类列表 (Russian)
export const classifications = [
  {
    "name": "Action Adventure",
    "display_name": "Action Adventure"
  },
  {
    "name": "FPS/TPS",
    "display_name": "FPS/TPS"
  },
  {
    "name": "RPG",
    "display_name": "RPG"
  }
]

// 游戏数据 (Russian)
export const gamesData = [
  {
    "id": 1,
    "title": "Guía de Easter Egg de The Reckoning: ¡De principio a fin, paso a paso!",
    "addressBar": "reckoning-easter-egg-guide",
    "publishDate": "2025-09-11T16:00:00.000Z",
    "description": "Una guía completa y amigable para principiantes para completar el Easter Egg principal en el mapa \"The Reckoning\" de Call of Duty. Esta guía desglosa cada objetivo en instrucciones sencillas, cubriendo todo desde activar el Pack-A-Punch y ensamblar a Franken Klaus hasta obtener el arma maravilla Gorgofex y derrotar al jefe final.",
    "imageUrl": "/images/games/hq720.jpg",
    "imageAlt": "The reckoning-1",
    "seo": {
      "title": "Easter Egg de The Reckoning: Guía completa paso a paso",
      "description": "Esta es una guía completa y amigable para principiantes para completar el Easter Egg principal en el mapa \"The Reckoning\" de Call of Duty. La guía desglosa cada objetivo en pasos simples, desde activar el Pack-A-Punch y ensamblar a Franken Klaus hasta obtener el arma maravilla Gorgofex y derrotar al jefe final.",
      "keywords": "The Reckoning, Call of Duty, CoD Zombies, Guía de Easter Egg, Walkthrough"
    },
    "classify": ["FPS/TPS"],
    "tag": ["JUEGOS", "FPS"],
    "iframeUrl": "https://www.youtube.com/embed/DjaCGge3Mzk",
    "isHome": true,
    "isLatest": true,
    "detailsHtml": `
      <p>¡Hola a todos! Esta es mi primera guía de Easter Egg de Call of Duty; esta vez es para el mapa "The Reckoning". Recientemente terminé el juego, así que aún lo tengo fresco en la memoria y he compilado los pasos. También usé videos de ROFLwaffles y MrDalekJD como referencia, pero esta guía será más accesible para la persona promedio. ¡Si hay algún error, por favor avísenme y lo actualizaré lo antes posible!</p>
  <p>¡Espero que esta guía te ayude! ¡Buena suerte y comencemos! ✨</p>
  <h2>🔹 Paso 1: Activar la máquina Pack-A-Punch</h2>
  <ul>
      <li>1a: Al inicio del juego, empuja el cubo de agua hacia la derecha y colócalo directamente bajo el aspersor para recoger agua (la necesitarás más tarde).</li>
      <li>1b: Sigue el marcador del mapa hasta PaP. En el camino, recoge la jeringa cerca de la centrífuga en Mutant Research (junto al tanque de agua de Mangler).</li>
      <li>1c: Continúa adelante y busca la Pierna del Robot en T2 Android Assembly (oculta en el montón de chatarra junto al portal o detrás del espejo). Commando Klaus, que aparece en una ronda especial, también dejará caer un Brazo Robot (límite de uno por ronda).</li>
  </ul>
  <h2>🔹 Paso 2: Recoger Sangre, Jeringa de Mutación Fowler y Muestra de ADN</h2>
  <ul>
      <li>2a: Salta a la columna de luz para transformarte en una bola. Derriba un zombie y usa la jeringa para extraer sangre.</li>
      <li>2b: Regresa a Mutant Research, mata al "Zombie Genetista" para obtener la tarjeta de acceso y abre el refrigerador (frente a la tabla periódica) para obtener la muestra de ADN.</li>
      <li>2c: Devuelve la jeringa sangrienta a su ubicación original. Mata al siguiente Fowler Mangler para obtener la jeringa.</li>
  </ul>
  <h2>🔹 Paso 3: ¡Obtener el arma maravilla Gorgofex!</h2>
  <ul>
      <li>3a: En el Laboratorio de Mutación, encuentra dos pantallas con palabras parpadeantes. Toma la primera letra de cada palabra y forma el nombre del elemento. Consulta la tabla periódica para obtener el número atómico (agrega ceros si tiene menos de tres dígitos). Usa este código para abrir la puerta al laboratorio superior.</li>
      <li>3b: En el nuevo laboratorio, mata 3 zombies y 3 plagas cerca de la centrífuga. Activa el quiste amarillo y tíralo al agujero del suelo del laboratorio (que conduce a la sala de computación cuántica).</li>
      <li>3c: Párate debajo de los tres hongos morados con el quiste en la cabeza para vaciar tu barra de salud (evita los charcos de veneno y zombies).</li>
      <li>3d: Ve a la Contención de Entidad Oscura (la sala Forsaken) y activa rápidamente los cuatro terminales "Iniciar Sobrecarga" para invocar a Uber Klaus.</li>
      <li>3e: Golpea los hombros de Uber Klaus para llevarlo al panel estático frente a los Forsaken y activar la batalla con mini-jefe. Después de derrotarlo, recoge el orbe morado para obtener Gorgofex.</li>
  </ul>
  <h2>🔹 Paso 4: Ensamblar a Franken Klaus</h2>
  <ul>
      <li>4a: Usa los brazos y piernas robóticos que recolectaste antes para reparar el robot Klaus en el taller T2.</li>
      <li>4b: Usa la jeringa Fowler para transformarte en Mangler. Escanea la tarjeta de acceso en la parte superior de las escaleras de la Entidad Oscura para desbloquear la sala del teletransportador.</li>
      <li>4c: Espera hasta la ronda 16 (o la siguiente ronda de Uber Klaus) y haz que dispare una bola eléctrica al robot reparado.</li>
  </ul>
  <h2>🔹 Paso 5: Resolver los rompecabezas de la computadora</h2>
  <ul>
      <li>5a: Sigue el movimiento de Franken Klaus en cada turno. La segunda ubicación requiere completar una prueba SAM.</li>
      <li>5b: La tercera ubicación está en la sala del teletransportador y requiere una contraseña de 4 dígitos. Los documentos de la contraseña están dispersos en estanterías, escritorios y computadoras en la Suite Ejecutiva T1 (posiblemente en Forsaken o sala del teletransportador).</li>
      <li>5c: Cada documento tiene un número en la parte superior y una fecha (MM/DD/YYYY) en la parte inferior. La contraseña es el número ordenado por fecha de la más antigua a la más reciente.</li>
      <li>5d: Ingresa la contraseña en la computadora de la sala de teletransportación. Si aparece "Acceso Concedido", has tenido éxito.</li>
  </ul>
  <h2>🔹 Paso 6: ¡Modo Caza Fantasmas Activado!</h2>
  <ul>
      <li>6a: Ve a la Sala de Computación Cuántica y compra el Melee Machiatto (aumento de velocidad cuerpo a cuerpo). Rompe el panel verde para obtener el Cerebro Morado, luego corre rápidamente a la sala de teletransportación (¡usa el elevador como atajo!).</li>
      <li>6b: Regresa a la Sala PaP para activar el acelerador de partículas y usa Gorgofex para eliminar las plagas fantasmales azules.</li>
      <li>6c: Regresa al panel de control para interactuar con Gorgofex y recargarlo. Vuelve a la sala de teletransportación con Gorgofex recargado.</li>
      <li>6d: Lanza un ataque cargado al cristal del marco del portal de teletransportación para eliminar el obstáculo.</li>
      <li>6e: Regresa al Laboratorio de Mutación y apunta con Gorgofex a la ventana de hongos en la entrada de la cueva subterránea. Caerá una Cabeza Fúngica. Salta y recógela.</li>
  </ul>
  <h2>🔹 Paso 7: Entrenador Pokémon (Error)</h2>
  <ul>
      <li>7a: Regresa al punto de aparición y coloca la Cabeza Fúngica en el cubo de agua que recolectaste antes. Enjuágala y recógela (te ralentizará).</li>
      <li>7b: Llévala puesta mientras matas zombies para recargarla, luego devuélvela al marco del portal.</li>
      <li>7c: Una vez recargada, regresa al punto de aparición y toma el "Dispositivo de Sellado al Vacío" (granada táctica) de la sala roja.</li>
      <li>7d: Úsalo para capturar los objetos morados flotantes en el mapa (¡no te acerques demasiado!) y repite con el dispositivo de reciclaje para capturar cuatro más.</li>
      <li>7e: Devuélvelo al pedestal frente a la sala del portal para activar el evento de bloqueo: activa cuatro interruptores en un tiempo limitado (verde se vuelve rojo con un efecto de sonido).</li>
  </ul>
  <h2>🔹 Paso 8: ¡Batalla Final!</h2>
  <h3>Recomendaciones de Preparación:</h3>
  <ul>
      <li>Arma Dual PaP Nivel 3 (intenta no superar 40 rondas)</li>
      <li>AMR Mod 4 o SVD recomendado para ataques a distancia</li>
      <li>Bubble Gum: Reign Drops, Idle Eyes, Perkaholic, Phoenix Up (en línea), Shields Up</li>
      <li>Habilidades: Escoge "Tribologist" (impulso de planeo) para PHD</li>
      <li>Recompensa Killstreak: Chopper Gunner / Death Machine, acumula Monkey Bombs o señuelos</li>
  </ul>
  <h3>Proceso:</h3>
  <ul>
      <li>8a: Inicia la batalla final. Elige ayudar a Richtofen (más fácil) o Maxis.</li>
      <li>8b: Encuentra tres Cajas de Alma LTG en el pasillo. Tras cargarlas, regresa al elevador.</li>
      <li>8c: Dispara al cristal bloqueado en la tubería. Cuando el elevador se detenga de nuevo, llegarás al techo.</li>
      <li>8d: Enfrenta a SAM: ¡dispara a su ojo! Después del ataque láser, la parte superior e inferior de la cabeza se abrirá y explotará. Cada pérdida del 25% de salud activa una Prueba SAM, otorgando un buff al tener éxito y un debuff al fallar.</li>
      <li>8e: Mantén la calma, busca cobertura para curarte, evita ataques AOE y aplica daño con paciencia.</li>
  </ul>
  <p>¡Felicidades! Si has llegado hasta aquí, ¡estás a un paso de completar el juego! Esta guía fue escrita con mucho cuidado. Si te resulta útil, avísame. ¡También agradecería cualquier mejora!</p>
  <p>¡Feliz caza de zombies!</p>
      `
  },
  {
    "id": 2,
    "title": "Guía Solo del Easter Egg de Der Eisendrache 2025 - Walkthrough completo y consejos pro",
    "addressBar": "der-eisendrache-easter-egg",
    "publishDate": "2025-09-11T16:00:00.000Z",
    "description": "Guía completa paso a paso del Easter Egg de Der Eisendrache optimizada para jugadores en solitario. Aprende a obtener el Arco de Relámpago, derrotar al jefe Keeper y desbloquear el logro con estrategias profesionales y consejos ocultos. Actualizado para 2025.",
    "imageUrl": "/images/games/der eisendrache easter egg.png",
    "imageAlt": "der eisendrache 1",
    "seo": {
      "title": "Guía Solo del Easter Egg de Der Eisendrache 2025",
      "description": "Guía completa paso a paso del Easter Egg de Der Eisendrache optimizada para jugadores en solitario. Desbloquea el logro con estrategias profesionales y consejos ocultos.",
      "keywords": "der eisendrache easter egg solo, upgrade arco de relámpago, jefe keeper, gravity spikes der eisendrache"
    },
    "classify": ["FPS/TPS", "RPG"],
    "tag": ["JUEGOS", "BO3", "der eisendrache"],
    "iframeUrl": "https://www.youtube.com/embed/IS_7c9P8ibU",
    "isHome": true,
    "isLatest": false,
    "detailsHtml": `
      <h2>Obtén el arco y flechas con anticipación</h2>
  <p>Necesitas obtener un arco específico antes de que comience el Easter Egg.</p>
  <p>Para conseguir un arco simple, alimenta las tres cabezas de dragón en el mapa.</p>
  <p>Luego, haz la mejora para obtener el Arco de Relámpago, la versión más fuerte para juego en solitario recomendada en el video. Otra opción es un arco con funciones adicionales.</p>
  <p>➕ <strong>Consejo:</strong> Sé paciente, ya que el procedimiento de mejora requiere disparar runas y proteger puntos.</p>
  
  <h2>🔮 Paso 1: Localiza el Espíritu Azul o Wisp</h2>
  <p>Dispara la campana en la parte superior del teletransportador con el arco simple hasta escuchar el sonido único "ding".</p>
  <p>Cambia al arco mejorado de inmediato y busca las Llamas del Espíritu Azul en el mapa. Aleatoriamente aparecerán en uno de los siguientes lugares:</p>
  <ul>
      <li>La máquina en la esquina de la iglesia</li>
      <li>Encima de la chimenea de la iglesia hay un reloj</li>
      <li>En la habitación de Samantha con el globo</li>
      <li>La caja sobre Double Tap en la sala</li>
      <li>La llanta trasera de un coche</li>
      <li>La mesa junto a Quick Revive</li>
      <li>En la sala de aumento de resistencia, un teléfono</li>
      <li>Hay un reloj en el pasillo entre la torre de la campana y la iglesia</li>
  </ul>
  <p>Cuando localices uno, usa tu arco mejorado para dispararle. Se dirigirá a su próximo destino, la Llama del Espíritu.</p>
  <p>Haz esto cuatro veces. Cuando termines, escucharás un sonido de confirmación.</p>
  <p>Al regresar al teletransportador, se volverá morado, permitiendo que entres.</p>
  
  <h2>⚡️ Paso 2: Viaja en el tiempo y recolecta partes</h2>
  <p>Al entrar al teletransportador, recoge:</p>
  <ul>
      <li>la caja de la derecha</li>
  </ul>
  <p>Espera hasta que el médico ingrese el código de la bóveda (¡recuerda!).</p>
  <p>Al regresar, aparecerá un Panzer (¡cuidado!).</p>
  
  <h2>🧩 Paso 3: Rompecabezas del Rayo de la Muerte</h2>
  <p>Antes de encender la trampa del Rayo de la Muerte, coloca el fusible y pon el panel en modo Protección.</p>
  <p>Si introduces el código que te dio el médico en la máquina, sonará un efecto de sonido.</p>
  <p>Vuelve al modo Destruir después de abrir la bóveda, sacar los componentes y cargarlos en la Torre del Rayo de la Muerte.</p>
  
  <h2>👻 Fase 4: Simon Dice y Llamar a Tempy</h2>
  <p>Toma nota de la secuencia parpadeante al terminar el rompecabezas "Simon Dice" cerca del Rayo de la Muerte. En la Base del Cohete, hay otro problema que debe resolverse al mismo tiempo.</p>
  <p>Para llamar a Tempy de regreso a la Tierra, regresa al Rayo de la Muerte y presiona el botón verde cuando la torre se ilumine de blanco.</p>
  <p>Para liberar al espíritu después de aterrizar, toma la llave y colócala en la lápida. Mantén un seguimiento de su ubicación.</p>
  
  <h2>🔁 Paso 5: Obtén la losa + Repite Fuego del Espíritu</h2>
  <p>Al comenzar una nueva ronda (límite de tiempo; se pierde al final de la ronda), debes repetir la etapa del Fuego del Espíritu.</p>
  <p>Ingresa nuevamente al teletransportador después de hacerlo cuatro veces. Para obtener la Piedra en esta ocasión, interactúa con el libro en la esquina (aparecerá un segundo Panzer).</p>
  
  <h2>💀 Paso 6: Recolectando Almas y Ritual Final</h2>
  <p>Mata zombies dentro del círculo blanco hasta que el alma se vaya al lugar original (esto se hace cuatro veces).</p>
  <p>Debes colocar la Piedra para continuar recolectando una vez que casi hayas duplicado la velocidad del fuego.</p>
  <p>El alma eventualmente se volverá roja y volará hacia la pirámide debajo de la iglesia.</p>
  
  <h3>Preparación para la Batalla del Jefe</h3>
  <h4>Equipo Sugerido:</h4>
  <ul>
      <li>¡Gravity Spikes son esenciales!</li>
      <li>Todos los Beneficios + Nuevo Escudo (especialmente Protección de Explosión Juggernaut)</li>
      <li>Arma Máxima (para panzers, Dragon's Glare o armas explosivas son recomendadas)</li>
      <li>Peligro Cercano (para evitar agarres de Panzer)</li>
  </ul>
  
  <h2>🏛️ Paso 7: Inicia la Batalla del Jefe y la Pirámide</h2>
  <p>Para abrir la puerta, coloca el contenedor azul en la esquina de la pirámide.</p>
  <p>Para entrar en la pelea del jefe, activa el panel azul con el Gravity Spike.</p>
  
  <h3>Consejos para los Jefes:</h3>
  <ul>
      <li>¡Sigue adelante!</li>
      <li>Usa el Gravity Spike para romper la tierra y desbloquear el cofre del Keeper cuando aparezca una luz azul en el centro. Aprovecha para infligir daño usando un arma explosiva o el arco.</li>
      <li>Cuidado con el ultimate del Keeper: si los spikes se han ido, escóndete detrás de un pilar para evitar ser eliminado de un golpe.</li>
      <li>Cada una de las dos oleadas de Panzers y tres oleadas de Keepers tiene munición máxima.</li>
  </ul>
  
  <h3>Último Paso: Inserta la Llave de Sombra</h3>
  <p>Una vez transportado de regreso a la pirámide, coloca la Llave de Sombra y observa que se ilumine antes de retirarla.</p>
  <p>Coloca la llave en la máquina donde jugaste "Simon Dice" por primera vez.</p>
  <p>¡Felicidades! ¡El Easter Egg está completado!</p>
  
  <h3>Última Nota:</h3>
  <p>Uno de los Easter Eggs más espectaculares en la historia de Call of Duty Zombies es Der Eisendrache. Jugarlo solo es gratificante y exigente. Mantendré la información actualizada, así que no dudes en comentar cualquier problema que encuentres durante la exploración.</p>
  <p>✨ Un homenaje a los jugadores que se atreven a explorar la oscuridad por sí mismos. Al final, tu persistencia iluminará este mágico camino lleno de dragones.</p>
  <p>¡Nos vemos en la próxima guía!</p>
      `
  },
  {
    "id": 3,
    "title": "Teorías de Recompensa del Super Easter Egg de Black Ops 6 Zombies | COD BO6",
    "addressBar": "bo6-super-easter-egg-rewards",
    "publishDate": "2025-09-03T16:00:00.000Z",
    "description": "¿Qué obtienen los jugadores al completar todas las misiones principales en Call of Duty: Black Ops 6 Zombies? Este artículo explora las cinco principales teorías de la comunidad sobre la recompensa del super Easter Egg, incluyendo armas maravilla ilimitadas, un gauntlet de jefes y más.",
    "imageUrl": "/images/games/game-03.webp",
    "imageAlt": "bo6 super easter egg rewards",
    "seo": {
      "title": "Teorías de Recompensa del Super Easter Egg de Black Ops 6 Zombies | COD BO6",
      "description": "¿Cuál es el premio definitivo por completar todas las misiones principales en Call of Duty: Black Ops 6 Zombies? Descubre las cinco principales teorías de la comunidad sobre la recompensa del super Easter Egg, desde armas maravilla ilimitadas hasta un gauntlet de jefes.",
      "keywords": "Call of Duty, Black Ops 6, COD, Zombies, BO6, Easter Egg, Guía de Juegos, Recompensas, Teorías"
    },
    "classify": ["FPS/TPS"],
    "tag": ["Call of Duty", "Black Ops 6", "COD", "Zombies", "BO6", "Easter Egg"],
    "iframeUrl": "https://www.youtube.com/embed/85f2cyiXhT8",
    "isHome": false,
    "isLatest": false,
    "detailsHtml": `
      <h2>¿Cuál podría ser la recompensa del Super Easter Egg en Black Ops 6 Zombies?</h2>
  <p>La anticipación por <em>Call of Duty: Black Ops 6</em> está en aumento, especialmente para los fans del modo Zombies. Cada mapa tiene su propia misión principal, pero el objetivo final es completar el "super Easter Egg" al terminar las cinco misiones principales. ¿Pero cuál es la recompensa por esta monumental tarea? Aunque los detalles oficiales aún no se han revelado, la comunidad está llena de teorías emocionantes. Basado en un video reciente de YouTube (ver enlace abajo), aquí están cinco de las ideas más convincentes para el premio definitivo.</p>
  
  <h3>1. Todas las Armas Maravilla en la Mystery Box</h3>
  <p>Imagina poder obtener cada arma maravilla de todos los mapas en la Mystery Box. Esto no sería un simple premio, sino un cambio total en la jugabilidad. Tradicionalmente, cada mapa tiene un arma maravilla única que dicta gran parte de la estrategia. Pero si todas estuvieran disponibles en cada Mystery Box, los jugadores tendrían que replantear toda su estrategia. La rejugabilidad se dispararía, ya que cada partida podría sentirse completamente diferente según qué arma poderosa obtengas.</p>
  
  <h3>2. Modo GobbleGum Ilimitado</h3>
  <p>Los GobbleGums son una parte esencial de la experiencia Zombies, ofreciendo poderes limitados pero potentes. ¿Qué pasaría si el super Easter Egg desbloquea un nuevo modo de juego donde puedes usar GobbleGums sin limitaciones? Sería pura diversión caótica, permitiendo a los jugadores aprovechar completamente el poder y la locura de estas habilidades. Para mantener el equilibrio, probablemente este modo no contaría para XP, camuflajes o estadísticas. Es un premio diseñado solo para diversión y caos.</p>
  
  <h3>3. El Gauntlet Definitivo de Jefes</h3>
  <p>Para los jugadores realmente hardcore, un gauntlet de jefes sería el premio perfecto. Este modo te enfrentaría a todos los jefes de los cinco mapas de Black Ops 6 Zombies, uno tras otro. El desafío podría intensificarse con restricciones únicas, como requerir tipos específicos de armas o completar las peleas en un tiempo límite. Sería la prueba definitiva de habilidad y un verdadero símbolo de honor para quien lo complete.</p>
  
  <h3>4. Desbloqueo de Camos Pack-a-Punch</h3>
  <p>¿A quién no le gusta un buen skin de arma? En Zombies, mejorar tu arma con Pack-a-Punch no solo aumenta su poder, sino que también le da un aspecto genial. Esta idea sugiere que completar el super Easter Egg desbloquearía la capacidad de usar cualquier camuflaje Pack-a-Punch de cualquier mapa en cualquier arma, incluso en multiplayer o Warzone. Sería una recompensa cosmética fantástica, permitiéndote mostrar tu dominio en Zombies en otros modos. Es un premio simple pero muy deseado para jugadores dedicados.</p>
  
  <h3>5. Comenzar con Armadura Dorada</h3>
  <p>La última y quizás más práctica idea es comenzar cada partida con un conjunto de Armadura Dorada. Para cualquier veterano de Zombies, las primeras rondas suelen ser las más peligrosas porque careces de defensa adecuada. Tener Armadura Dorada desde el inicio proporcionaría una enorme mejora en la calidad de vida, permitiéndote enfocarte en construir tu arsenal y conseguir beneficios sin la constante amenaza de ser derribado. Es una recompensa funcional que reconoce tu logro sin romper la jugabilidad principal.</p>
  
  <h3>Conclusión</h3>
  <p>Cada una de estas ideas aporta algo único, desde estilo cosmético hasta mecánicas que alteran el juego. Mientras esperamos un anuncio oficial, la especulación solo aumenta la emoción. ¿Qué esperas que sea la recompensa final? ¡Déjanos tu opinión en los comentarios!</p>
      `
  },

  {
    "id": 4,
    "title": "Esta Casa Espeluznante era un Easter Egg todo el tiempo...",
    "addressBar": "gta5-creepy-house-easter-egg",
    "publishDate": "2025-09-02T16:00:00.000Z",
    "description": "Durante años, los jugadores pensaron que esta casa abandonada en GTA 5 estaba embrujada. Este artículo revela su sorprendente verdad: es un ingenioso Easter egg basado en un sitio histórico real.",
    "imageUrl": "/images/games/game-04.webp",
    "imageAlt": "Esta Casa Espeluznante era un Easter Egg todo el tiempo...",
    "seo": {
      "title": "Esta Casa Espeluznante era un Easter Egg todo el tiempo...",
      "description": "Durante años, esta casa abandonada en GTA 5 fue fuente de mitos espeluznantes. Este artículo revela la sorprendente verdad: es un ingenioso Easter egg basado en un pueblo fantasma de la vida real y en la historia de la Ruta 66, una historia mucho más interesante que cualquier cuento de fantasmas.",
      "keywords": "GTA 5, Grand Theft Auto, Easter Egg GTA 5, casa embrujada, Ruta 66, pueblo fantasma, secretos de GTA 5, Rockstar Games, historia de los videojuegos, ubicaciones reales en GTA, lore, misterio, casa abandonada"
    },
    "classify": ["Acción Aventura"],
    "tag": ["GTA 5", "Grand Theft Auto", "Easter Egg", "Videojuegos", "Casa Embrujada", "Rockstar Games"],
    "iframeUrl": "https://www.youtube.com/embed/QfFDHBbT5R4",
    "isHome": true,
    "isLatest": true,
    "detailsHtml": `
      <h2>Esta Casa Espeluznante era un Easter Egg todo el tiempo...</h2>
  <p>En el vasto y detallado mundo de Grand Theft Auto V, cada rincón parece esconder un secreto. Una casa abandonada en el desierto ha sido durante mucho tiempo objeto de rumores de actividad paranormal, generando innumerables leyendas urbanas. Sin embargo, la verdadera historia detrás de este lugar es mucho más fascinante que cualquier cuento de fantasmas. Es un homenaje sutil y magistral a un pedazo olvidado de la historia de California.</p>
  
  <h3>La Leyenda de la Casa Embrujada</h3>
  <p>Durante años, esta casa desolada ha sido un imán para la creación de mitos. Su fachada escalofriante, su interior deteriorado y su ubicación aislada proporcionaron el escenario perfecto para historias espeluznantes. Youtubers y jugadores han creado videos y lore que afirman actividad paranormal, consolidando la reputación de "casa embrujada" en la comunidad.</p>
  <p>Curiosamente, Rockstar Games aprovechó este mito durante su evento de Halloween de 2023, agregando dos fantasmas temporales a la ubicación. Sin embargo, esto fue una broma estacional, no la intención original del diseño. El verdadero propósito de la casa se encuentra en la historia, no en el horror.</p>
  
  <h3>La Inspiración de la Vida Real: Pueblo Fantasma de California</h3>
  <p>El prototipo en la vida real de la casa es el <strong>Hotel Pentagast</strong>, un edificio abandonado ubicado en el pueblo fantasma de <strong>Lello, California</strong>. La historia de Lello es un relato clásico de la expansión hacia el oeste de Estados Unidos. Comenzó como un próspero pueblo ferroviario antes de reinventarse como un popular punto de descanso en la legendaria <strong>Ruta 66</strong>. Durante la época dorada de la Ruta 66, Lello fue una parada vital para incontables viajeros, trayendo prosperidad y vida a la pequeña comunidad.</p>
  
  <h3>El Declive de la Ruta 66</h3>
  <p>El destino del pueblo quedó sellado con la construcción del <strong>Sistema de Autopistas Interestatales</strong>. La construcción de la más rápida <strong>Interestatal 40</strong> dejó de lado a la Ruta 66, provocando que el tráfico disminuyera y los negocios fracasaran. A medida que los viajeros se fueron, también lo hicieron los residentes. Lello fue abandonada lentamente, convirtiéndose en el pueblo fantasma que es hoy: un testimonio silencioso de una era pasada.</p>
  
  <h3>La Meticulosa Recreación de Rockstar</h3>
  <p>Los diseñadores de Rockstar prestaron una increíble atención a esta historia. En el juego, la Ruta 66 se representa como <strong>Ruta 68</strong>, y la ubicación de la casa abandonada refleja perfectamente su contraparte real, situada justo al lado de la línea ferroviaria. Esto no es solo una copia simple; es un homenaje meticulosamente elaborado que agrega profundidad y realismo al mundo del juego.</p>
  
  <h3>Conclusión: Un Easter Egg Histórico</h3>
  <p>Así que, la próxima vez que pases frente a esta casa en GTA 5, no la veas como un lugar espeluznante. En su lugar, aprecia que es un <strong>Easter egg</strong> histórico, un monumento al pasado de California y un testimonio de la increíble atención al detalle de Rockstar. Nos recuerda que incluso en un mundo de caos y crimen, hay historias sutiles de nuestro mundo real esperando ser descubiertas.</p>
      `
  },
  {
    "id": 5,
    "title": "Easter Egg de Battlefield 2042",
    "addressBar": "battlefield-2042-your-easter-egg",
    "publishDate": "2025-09-02T16:00:00.000Z",
    "description": "Guía completa para desbloquear el título de jugador 'Su Excelencia' en Battlefield 2042, cubriendo todos los Easter eggs, códigos del portal y recompensas.",
    "imageUrl": "/images/games/game-02.webp",
    "imageAlt": "Easter Egg de Battlefield 2042",
    "seo": {
      "title": "Battlefield 2042 Your Excellency Easter Egg – Guía Completa",
      "description": "Descubre cómo desbloquear el exclusivo título de jugador 'Su Excelencia' en Battlefield 2042 completando los cuatro Easter eggs. Guía paso a paso con consejos, códigos del portal y recompensas.",
      "keywords": "Battlefield 2042, Your Excellency, guía Easter egg, búsqueda de peluches, Sacrifice, Shark NATO, Prototype, título de jugador, código del portal, walkthrough"
    },
    "classify": ["FPS/TPS"],
    "tag": ["Battlefield 2042", "Easter Egg", "Your Excellency", "Búsqueda de Peluches"],
    "iframeUrl": "https://www.youtube.com/embed/Y9IUI3DBDI0",
    "isHome": true,
    "isLatest": true,
    "detailsHtml": `
      <h2>Búsqueda de Peluches en Redacted</h2>
  <p>En Redacted hay cuatro peluches ocultos y necesitas recoger uno de cada tipo. Cada peluche tiene 10 posibles ubicaciones, y solo aparece uno por partida. Interactúa con el peluche para desbloquear un amuleto. Reinicia el mapa desde el menú de administración para buscar el siguiente peluche.</p>
  <p>Después de encontrar el primer peluche, solo necesitarás buscar en 30 ubicaciones para el siguiente, luego 20, y finalmente 10 para el último. Pueden repetirse. Usar el código del portal AB6 NS1 aumenta la velocidad de movimiento y facilita alcanzar peluches complicados.</p>
  <p>Al recoger los cuatro peluches, desbloquearás amuletos y un fondo especial de tarjeta de jugador. Luego, pasa al siguiente mapa.</p>
  
  <h2>Sacrificio en Battle of the Bulge</h2>
  <p>Este Easter egg requiere un amigo. En la versión nocturna de Battle of the Bulge, realiza eliminaciones gratuitas dentro de un círculo en llamas. Un jugador se ejecuta mientras el otro realiza eliminaciones. Esto desbloquea la <strong>tarjeta de jugador Sacrifice</strong>.</p>
  <p>Además, puedes recoger una tarjeta clave necesaria para el Easter egg Prototype. En el objetivo D, como Ingeniero, dispara las alas y cabeza de las estatuas, luego usa dinamita en la estatua derecha. En el cementerio E1, destruye la cabeza de la estatua central e interactúa para recoger la tarjeta clave.</p>
  
  <h2>Shark NATO en Orbital</h2>
  <p>Este Easter egg requiere dos jugadores y la versión tormentosa de Orbital. Busca un cartel de “prohibido nadar” en la playa para confirmar el mapa tormentoso. Interactúa con un walkie-talkie dentro del almacén B1 cerca del cohete y colócalo en el cartel para reproducir código Morse.</p>
  <p>Luego, interactúa con cuatro laptops escondidas: una en la plataforma de lanzamiento bajo las escaleras, otra en un contenedor oficina cerca del edificio de ensamblaje, otra en la bandera B2 dentro del edificio K3, y otra en el gran edificio de ensamblaje de vehículos en el piso R1. Tras interactuar con todas, vuelve al cartel de la playa e ingresa el código <strong>1 3 2 3 1 3</strong> usando las laptops.</p>
  <p>Un jugador realiza tres eliminaciones en el agua equipado con el amuleto <strong>Frankie the Shark</strong>. Solo el jugador que es eliminado recibe la recompensa y la <strong>medalla Shark Bait</strong>. Aparece un efecto de tornado de tiburón al completar. Si se hace en parejas, repite para el segundo jugador.</p>
  
  <h2>Recuperación de Prototype</h2>
  <p>Si ya tienes Prototype, desbloqueas automáticamente el título <strong>Excellency</strong>. Si no, primero desbloquea un skin de apoyo Phantom Program en Exposure. Con Fal (sanador de apoyo), hazte daño y cúrate 10 veces en cada objetivo: A1, B1, B2, D y C. Luego llama un vehículo y súbete para desbloquear todos los skins de apoyo.</p>
  <p>En Iroima, usa un skin de apoyo y ve al objetivo C1 cerca de una máquina minera. Ingresa los códigos del teclado: <strong>2550146, 613251, 51576, 441806</strong>. Esto abre una salida de fuego con un elevador. Puedes descender con seguridad con cuatro jugadores con tags Phantom o irte al suelo si estás solo.</p>
  <p>Al final, interactúa con el lector de tarjetas (recogida en Battle of the Bulge) para entrar en un corredor con láseres. Usar el skin correcto permite pasar seguro. Al final, interactúa con la vitrina para recoger el arma Prototype y desbloquear el <strong>título de jugador Excellency</strong>. Otros skins de Prototype se pueden recoger en estantes.</p>
      `
  },
  {
    "id": 6,
    "title": "Los Más Grandes Easter Eggs de GTA V: Un Tributo al Universo Rockstar",
    "addressBar": "gta5-rockstar-universe-easter-eggs",
    "publishDate": "2025-09-02T16:00:00.000Z",
    "description": "Descubre los innumerables Easter eggs en GTA V que rinden homenaje a otros juegos de Rockstar, desde Red Dead Redemption hasta Max Payne 3.",
    "imageUrl": "/images/games/game-05.webp",
    "imageAlt": "Los Más Grandes Easter Eggs de GTA V: Un Tributo al Universo Rockstar",
    "seo": {
      "title": "Los Más Grandes Easter Eggs de GTA V: Un Tributo al Universo Rockstar",
      "description": "GTA V está repleto de más de 50 referencias ocultas a otros títulos de Rockstar. Explora el mundo del lore interconectado y descubre Easter eggs de GTA IV, San Andreas, Red Dead Redemption, Max Payne 3 y más.",
      "keywords": "GTA 5, Grand Theft Auto, Rockstar Games, Easter eggs, lore de juegos, secretos de GTA V, Red Dead Redemption, Max Payne 3, LA Noire, Bully, Manhunt, San Andreas, GTA IV, historia de los videojuegos"
    },
    "classify": ["Acción Aventura"],
    "tag": ["GTA 5", "Grand Theft Auto", "Rockstar Games", "Easter Eggs", "Lore de Videojuegos", "GTA V", "Secretos"],
    "iframeUrl": "https://www.youtube.com/embed/Z1IT7YX9rQI",
    "isHome": true,
    "isLatest": true,
    "detailsHtml": `
      <h2>GTA V: Un Tributo Magistral al Universo de Rockstar Games</h2>
  <p>Grand Theft Auto V es más que un juego; es una carta de amor a los fans dedicados de Rockstar Games. Con más de 50 Easter eggs sutiles y no tan sutiles, el vasto mundo de Los Santos está meticulosamente entrelazado con todo el universo Rockstar. Desde las calles de Liberty City hasta las llanuras del Viejo Oeste, estas referencias crean un mundo conectado que recompensa a los jugadores por su fidelidad durante años.</p>
  
  <h3>Ecos de Liberty City: El Legado de Niko Bellic</h3>
  <p>Los guiños a GTA IV son imposibles de ignorar, especialmente las referencias frecuentes a su protagonista, <strong>Niko Bellic</strong>. Durante la planificación de un atraco, el mentor de Franklin, Lester, menciona que no querría trabajar con ningún "tipo de Europa del Este", un claro guiño al trasfondo de Niko. Además, en el desierto, se puede encontrar un cartel de se busca o una foto de Niko en el <strong>Yellow Jack Inn</strong>, sugiriendo que su fama llegó hasta Blaine County. También se hace referencia a la banda de motociclistas "Lost MC" de la expansión <em>Lost and Damned</em> y al club <strong>Honkers</strong>, mostrando que los mundos criminales de Liberty City y Los Santos están más conectados de lo que parecen. Quizás la referencia más famosa es el mensaje de voz que a veces se escucha: "¡Hey Niko! ¡Es Roman! ¡Vamos a jugar bolos!", una línea icónica para la comunidad de GTA.</p>
  
  <h3>Un Regreso a San Andreas: Nostalgia de la Edad de Oro</h3>
  <p>Para los jugadores que crecieron con GTA: San Andreas, GTA V es un tesoro de momentos nostálgicos. Cerca del Aeropuerto Internacional de Los Santos, un gran mural dice <strong>"Welcome Back"</strong>, un reconocimiento directo al regreso al estado de San Andreas. Esto se extiende a detalles minuciosos: la escuela de vuelo en el juego se estableció en 2004, el mismo año de lanzamiento de <em>San Andreas</em>. También hay un desafío llamado <strong>"Better Than CJ"</strong>, un guiño humorístico a su icónico predecesor. Más allá de estas referencias, hay detalles que aluden a personajes clásicos como <strong>Big Smoke</strong>, <strong>OG Loc</strong> y <strong>Madd Dogg</strong>, recompensando a los fans de siempre con un guiño cómplice.</p>
  
  <h3>El Universo Compartido de Rockstar: Conexiones Más Allá de GTA</h3>
  <p>La interconexión del universo Rockstar va más allá de la serie GTA. Los desarrolladores integraron referencias a otros títulos emblemáticos.</p>
  
  <h4>Red Dead Redemption</h4>
  <p>En GTA V, la historia del Viejo Oeste sigue viva. Se puede encontrar un escudo del mundo <em>Red Dead</em> en el Yellow Jack Inn. El apartamento de Franklin contiene un libro titulado <strong>"Red Dead"</strong> escrito por <strong>J. Marsden</strong>, en referencia al protagonista John Marston. Además, hay un café llamado <strong>Cafe Redemption</strong> en Los Santos, consolidando la conexión entre ambas franquicias.</p>
  
  <h4>Max Payne 3</h4>
  <p>El juego rinde homenaje al mundo oscuro de Max Payne. Un yate llamado "Dignity" hace referencia a una embarcación de <em>Max Payne 3</em>. Además, una línea de Michael diciendo "Cariño, ya llegué a casa" comparte un tono melancólico con las líneas típicas de Max Payne, conectando a ambos protagonistas.</p>
  
  <h4>Otros Clásicos</h4>
  <p>Las referencias continúan. Un comercial en la TV del juego alude al trabajo detectivesco de <strong>L.A. Noire</strong>. Un NPC viste una camiseta con el nombre <strong>"Hopkins"</strong>, homenajeando a Jimmy Hopkins de <em>Bully</em>. Y para los fans más oscuros, hay menciones a <em>Manhunt</em> con referencias a <strong>"Carcer City"</strong> y a la máscara aterradora <strong>"Pigsy"</strong>.</p>
  <p>Estos Easter eggs cuidadosamente colocados no son simples objetos ocultos; son los hilos que unen los expansivos mundos de Rockstar, recompensando a los jugadores que han estado desde el principio y transformando GTA V en un tributo definitivo a una trayectoria de juegos innovadores.</p>
      `
  },

  {
    "id": 7,
    "title": "BO6 Reckoning Easter Egg Guía – Recorrido Completo de Ruffwaffles",
    "addressBar": "bo6-reckoning-easter-egg-guide",
    "publishDate": "2025-08-30T16:00:00.000Z",
    "description": "Guía paso a paso del Easter Egg de BO6 Reckoning por Ruffwaffles. Aprende consejos para la misión Black Armor, recolección de cuerpos de Klaus, activación de Pack a Punch y estrategias para los jefes para completar con éxito.",
    "imageUrl": "/images/games/game-01.webp",
    "imageAlt": "guía easter egg bo6 reckoning",
    "seo": {
      "title": "BO6 Reckoning Easter Egg Guía – Recorrido Completo de Ruffwaffles",
      "description": "Sigue la guía completa de Ruffwaffles del Easter Egg de BO6 Reckoning, cubriendo la misión Black Armor, recolección de cuerpos de Klaus, activación de Pack-a-Punch y estrategias para los jefes. La guía paso a paso asegura completar el easter egg de manera eficiente.",
      "keywords": "BO6 Reckoning, BO6 Reckoning Easter Egg, guía BO6 Easter Egg, Ruffwaffles, misión Black Armor, Klaus, Pack a Punch, estrategias de jefes, recorrido Easter Egg"
    },
    "classify": ["FPS/TPS"],
    "tag": ["Guía de Juego","FPS","Easter Egg","Jefe Final"],
    "iframeUrl": "https://www.youtube.com/embed/DjaCGge3Mzk",
    "isHome": true,
    "isLatest": true,
    "detailsHtml": `
    <h2>Guía Easter Egg de BO6 Reckoning</h2>

<h3>Introducción</h3>
<p>Hola a todos, soy Ruffwaffles. Esta es tu guía directa para completar el Easter Egg de BO6 Reckoning.</p>

<h3>Misión Black Armor Easter Egg</h3>
<p>Antes de entrar al juego, te encontrarás con seis zombis. Aquí algunos consejos rápidos:</p>
<ul>
  <li>El Whirlwind Gun es muy efectivo contra enemigos pequeños.</li>
  <li>Mejorar los escudos es una buena habilidad en este mapa.</li>
  <li>Prefiere usar Berserk Soldiers.</li>
</ul>

<h3>Recomendaciones de Configuración del Whirlwind Gun</h3>
<p>Si quieres conocer mi configuración del Whirlwind Gun:</p>
<ul>
  <li>Bozal de bloqueo completo</li>
  <li>Un Ranger</li>
  <li>Empuñadura de cuatro dedos inferior</li>
  <li>Revólver extendido, dos segmentos</li>
  <li>Empuñadura ergonómica</li>
  <li>Módulo láser de apuntado</li>
  <li>Adjunto de llamas Dragon Breath</li>
</ul>

<h3>Pasos Después de Entrar al Juego</h3>
<p>Cuando tengas compañeros de equipo, deja que todos permanezcan quietos unos segundos. Prioridad: golpear el cubo de mop hasta colocarlo bajo el rociador. La posición no necesita ser perfecta. Si estás inmóvil, acuéstate para golpear, prueba diferentes ángulos y luego avisa a tus compañeros para actuar y pasar por el detector metálico para activar el rociador.</p>
<p>Luego, el cubo de mop se llenará y la partida comenzará normalmente. Prioriza el Área de Investigación Mutante para optimizar. Abre la puerta, usa el ascensor y busca el gran contenedor azul. En el lado derecho del contenedor, presiona la tecla de acción para recoger el componente de jeringa. Mantén presionada la tecla hasta completarlo, luego sigue el marcador naranja hasta el nivel subterráneo 10.</p>

<h3>Área de Mejora de Armas</h3>
<p>Esta área requiere activación. Dispara a todos los cristales morados indicados por símbolos naranjas para activar Pack-a-Punch. Aparecerá un rayo de luz gigante en el centro; camina por el pasaje lateral y salta al rayo para transformarte en una pequeña bola. Evita obstáculos móviles, golpea el cuerpo del objetivo, interactúa para actualizar el progreso del objetivo, luego sal de la forma de bola y usa la jeringa en el cuerpo objetivo.</p>
<p>Si no puedes entrar al rayo inicialmente, acércate desde el otro lado y salta dentro.</p>

<h3>Restaurando los Brazos de Klaus</h3>
<p>Concéntrate en restaurar los brazos faltantes de Klaus. Los brazos aparecen en rondas especiales cada 5–6 rondas, correspondientes a rondas de enjambre. Dispara a múltiples Assault Klaus para que suelten brazos, recógelos y espera la siguiente ronda especial para el segundo brazo. Usa las rondas intermedias para otras tareas. Regresa al Área de Pruebas de Investigación Mutante T1 y al Laboratorio para encontrar Genetistas (zombis con batas verdes) cada 5–6 rondas; mátalos para obtener una tarjeta de oro.</p>

<h3>Recogiendo Viales</h3>
<p>Ve a la sala del refrigerador con esposa e hijo en cápsulas de incubación. Mantén presionada la tecla de acción en el refrigerador para recoger el vial para uso posterior.</p>

<h3>Recolectando las Piernas de Klaus</h3>
<p>Las piernas están en la Sala de Ensamblaje Biónico T2. Los puntos de aparición incluyen:</p>
<ul>
  <li>Primera pierna: sobre la estantería</li>
  <li>Segunda pierna: junto a la puerta rota</li>
  <li>Tercera pierna: junto al televisor roto</li>
  <li>Cuarta pierna: área de caja de llamas</li>
</ul>
<p>Recoge ambas piernas de estos puntos. Consulta fuentes de la comunidad para ubicaciones adicionales si es necesario.</p>

<h3>Creando el Arma de Efecto Gorg Gratis</h3>
<p>En el Laboratorio de Investigación Mutante, encuentra dos pantallas de computadora con texto verde. Anota la primera letra de cada palabra. Usa la tabla periódica para convertir las letras en números atómicos (completa los dígitos únicos con ceros). Ingresa el código para desbloquear el laboratorio biológico secreto. Ataca zombis para generar plagas, recoge vesículas, luego ve al Laboratorio de Computación Cuántica para absorber vida de las Plantas de Éter. Completa tres plantas y luego sal del laboratorio.</p>

<h3>Sala de Contención de Entidad Oscura</h3>
<p>En el Área 2, entra a la Sala de Contención de Entidad Oscura, interactúa con cuatro computadoras para activar la energía y convocar a Super Klaus. Rompe los hombros, quita las hombreras, guía al panel eléctrico para choque. El Forsaken entra en Klaus, creando un objetivo de alto valor (HVT). Mata al HVT, combina el material de fusión de sangre con vesículas para invocar a Free Gofrex.</p>

<h3>Ensamblando a Klaus</h3>
<p>Ve al Área de Ensamblaje de Androides, mantén presionada la tecla de acción para ensamblar a Klaus. Completa los pasos de la jeringa, inyecta sangre para crear la Jeringa de Mutación Flawler, mata a Manler y sus discípulos. Lleva la Jeringa de Mutación de Corrupción a la Sala de Contención de Energía Oscura, usa el escáner de retina para abrir la puerta pequeña y activar el teletransportador.</p>

<h3>Preparación para Jefe</h3>
<p>Antes de la pelea contra el jefe: confirma triple munición, estrategia de ataque, accesorios de munición, rachas de bajas, elementos de auto-curación, equipo regular y elección de facción (apoyar a Retan o Max). Mantén presionada la tecla de acción para activar el portal a la sala del jefe.</p>

<h3>Elegir Facción</h3>
<p>En el Reliquia Sentinel, mantén presionada la tecla de acción para votar:</p>
<ul>
  <li>Elegir Retan: enfrentar a Max (más difícil)</li>
  <li>Elegir Max: enfrentar a Retan (más fácil)</li>
</ul>
<p>Toma el ascensor hacia el área del contenedor morado brillante, llena los contenedores, mata enemigos cercanos, regresa después de llenar todos los contenedores.</p>

<h3>Golpeando Cristales Morados</h3>
<p>Entra a la Bóveda de Elemento Oscuro, golpea todos los cristales morados brillantes. Esto activa el ascensor hacia la sala del jefe.</p>

<h3>Pelea con el Jefe Samantha Max</h3>
<p>Evita los proyectiles morados giratorios. Al 75%, 50%, 25% de HP, aparecerán Sam Trials o zombis. Completar los trials otorga mejoras. Apunta al punto débil de esfera roja con armas de largo alcance y lleva al Tribologista del Doctor para mejorar movilidad.</p>

<h3>Pelea con el Jefe Reckton</h3>
<p>Fase uno: forma Super Principal con buceos aéreos y lanzamientos. Ten paciencia. Fase dos: Klaus móvil versión Retan con Universal Dafa, enfócate en movimiento y roles de sanador para manejar daño explosivo.</p>

<h3>Consejos para Peleas de Jefes</h3>
<p>Prioriza la movilidad del sanador, debilita al jefe gradualmente, no te apresures. Mata al jefe para completar el Easter Egg.</p>

<h3>Laboratorio Cuántico & Caja del Alma</h3>
<p>Después de la pelea con el jefe, coloca la cabeza de hongo o artículos clave en la Caja del Alma, mata ~30 zombis para cargar. Escucha las líneas de voz de la cabeza, luego ve al área de Fowler, coloca la cabeza en el teletransportador.</p>

<h3>Pasos de Sellado al Vacío</h3>
<p>En Torre 1, recoge dispositivos de sellado al vacío. Usa cuatro dispositivos para absorber diferentes partes moradas, repite cuatro veces. Inserta los dispositivos en la máquina y mantén presionada la tecla de acción para iniciar el programa de bloqueo.</p>

<h3>Bloqueo Final & Sala del Jefe</h3>
<p>Activa los interruptores rojos en las paredes. Espera 5–10 segundos para señales de audio. Una vez activados todos los interruptores, la pantalla se vuelve blanca, indicando la finalización del bloqueo. La pelea final con el jefe está lista.</p>

<h3>Conclusión</h3>
<p>Sigue esta guía para dominar el Easter Egg de BO6 Reckoning, incluyendo restauración de extremidades de Klaus, activación de Pack-a-Punch, creación del arma Free Gorg, operaciones en el Laboratorio Cuántico, carga de la Caja del Alma, sellado al vacío y estrategias para jefes. La ejecución cuidadosa asegura el éxito.</p>

<h3>Resumen del Easter Egg & Recompensas</h3>

<h4>Confirmar Extremidades de Klaus</h4>
<p>Asegúrate de que ambos brazos y piernas estén ensamblados en la cabeza de Klaus. Verifica los efectos del arma Gorg y mejoras para operaciones finales.</p>

<h4>Operación Final de Jeringa</h4>
<p>Regresa a la ubicación inicial de la jeringa, inserta el vial de sangre, mantén presionada la tecla de acción para iniciar la inyección. Activa la Inyección de Mutación Manler, mata a Manler y discípulos, recoge el vial verde para completar el paso especial de la jeringa.</p>

<h4>Operación Sala de Contención de Energía Oscura</h4>
<p>Entra a la sala, usa la Jeringa de Mutación de Corrupción con el escáner de retina para desbloquear la puerta pequeña. Asegúrate de que las piernas de Klaus y el efecto Gorg estén listos.</p>

<h4>Super Klaus & HVT</h4>
<p>En la ronda ~16, aparece Super Klaus. Coloca todas las extremidades, activa, guía para ataque eléctrico o a distancia, activa la transformación HVT. Mata al HVT, combina material de fusión de sangre con vesículas para invocar a Free Gofrex.</p>

<h4>Carga de la Caja del Alma & Sellado al Vacío</h4>
<p>Coloca artículos clave en la Caja del Alma, mata ~30 zombis para cargar. Usa cuatro dispositivos de vacío para absorber partes moradas, repite cuatro veces. Inserta los dispositivos en la máquina, inicia el programa de bloqueo, activa los interruptores rojos, bloqueo final completo.</p>

<h4>Jefe Final & Completar Easter Egg</h4>
<p>Entra a la sala del jefe final, sigue las estrategias para derrotar a Samantha Max o Reckton. Enfócate en movilidad del sanador, ataques a distancia y puntos débiles. Tras la derrota, el Easter Egg oculto se completa. Recoge recompensas y activa diálogos o animaciones ocultas.</p>

<h3>Resumen & Consejos</h3>
<p>Esta guía cubre restauración de extremidades de Klaus, activación de Pack-a-Punch, creación del arma Free Gorg, operaciones del Laboratorio Cuántico, carga de la Caja del Alma, pasos de sellado al vacío, estrategias para jefes y finalización del Easter Egg. Sigue las indicaciones en pantalla, códigos de texto verde y contraseñas de la tabla periódica para garantizar el éxito.</p>
    `
  },
  
  {
    "id": 8,
    "title": "Monster Hunter Wilds: Guía Completa de la Misión del Huevo de Wyvern",
    "addressBar": "monster-hunter-wilds-wyvern-egg-guide",
    "publishDate": "2025-08-28T16:00:00.000Z",
    "description": "Aprende cómo entregar de forma segura y eficiente el Huevo de Wyvern en Monster Hunter Wilds. Esta guía cubre preparación, enfrentamiento a enemigos y la mejor ruta para completar la misión con éxito.",
    "imageUrl": "/images/games/game-06.webp",
    "imageAlt": "Monster Hunter Wilds: Guía completa del Huevo de Wyvern",
    "seo": {
      "title": "Monster Hunter Wilds: Guía Completa de la Misión del Huevo de Wyvern",
      "description": "¡No dejes que el Huevo de Wyvern se rompa! Sigue nuestra guía completa de Monster Hunter Wilds que detalla cada paso de la misión, desde la preparación y recolección del huevo hasta enfrentar amenazas y realizar una entrega segura.",
      "keywords": "Monster Hunter Wilds, Huevo de Wyvern, guía, walkthrough, guía de misión, cómo, entrega del Huevo de Wyvern, consejos de juego, MH Wilds, Monster Hunter, estrategia, trucos y consejos"
    },
    "classify": ["RPG"],
    "tag": ["Monster Hunter Wilds","Huevo de Wyvern","Guía","Walkthrough","Misión","Consejos de Juego"],
    "iframeUrl": "https://www.youtube.com/embed/MiCW1s_UB3c",
    "isHome": true,
    "isLatest": false,
    "detailsHtml": `
    <h2>Monster Hunter Wilds: Guía para Entregar de Forma Segura el Huevo de Wyvern</h2>

<p>En <em>Monster Hunter Wilds</em>, la misión de entregar el Huevo de Wyvern es un desafío emocionante y de alto riesgo que requiere más que habilidades de combate. Demanda planificación cuidadosa, ejecución impecable y un poco de suerte. Esta guía, basada en un detallado video walkthrough, proporciona un desglose paso a paso para asegurar que transportes el valioso objeto hasta el campamento con éxito.</p>

<h3>Paso Uno: Preparación para el Viaje</h3>
<p>Antes de acercarte al nido, la preparación es esencial. Descansa en tu tienda hasta que encuentres un grupo de criaturas conocidas como "Yin c c." Estos monstruos ayudan a limitar la cantidad de otras criaturas agresivas en la zona, creando un camino más seguro para tu misión. Además, asegúrate de que el campamento en el Área 7 esté desbloqueado, ya que su ubicación favorable proporciona el punto de entrega más fácil para este objetivo.</p>

<h3>Paso Dos: Entrar al Nido y Asegurar el Huevo</h3>
<p>El Huevo de Wyvern se encuentra en el Área 11, un nido peligroso generalmente custodiado por un Rathalos o Rathian. Al acercarte al nido, estos monstruos pueden volverse agresivos. La guía sugiere usar una pod normal o grande: al golpear al Wyvern con ella, se retirará temporalmente, dándote una ventana crucial para tomar el huevo.</p>

<h3>Paso Tres: El Peligroso Regreso</h3>
<p>Una vez que tengas el huevo en tus manos, comienza el verdadero desafío. El huevo es extremadamente frágil, y cualquier caída significativa lo romperá, resultando en un fracaso de la misión. Usa lianas específicas para descender lentamente desde acantilados altos y sigue exactamente la ruta mostrada en la guía. Un enfoque lento y constante es clave para el éxito.</p>

<h3>Paso Cuatro: Navegando Obstáculos</h3>
<p>Tu camino de regreso al campamento probablemente incluirá interrupciones. Si eres atacado por fauna agresiva menor, coloca temporalmente el huevo para enfrentarlos. Despacha rápidamente a las criaturas y recoge el huevo para continuar. Si Rathalos o Rathian regresa, usa otra pod para que se retiren nuevamente. Al acercarte al campamento, observa las avispas. Usar un arma a distancia desde un lugar seguro ayuda a evitar que dañen el huevo.</p>

<h3>Paso Cinco: Entrega Exitosa</h3>
<p>Tras superar todos los obstáculos y llegar al campamento, el último paso es simple. El Huevo de Wyvern será tomado automáticamente, completando la entrega. Esta misión desafiante pone a prueba la paciencia, la planificación y la conciencia situacional. Siguiendo esta guía, aumentas significativamente tus posibilidades de éxito y podrás disfrutar la satisfacción de un trabajo bien hecho.</p>
    `
  }
]

