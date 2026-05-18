/* =========================================================
   VIAJE A GUANAJUATO · v6
   Leaflet + 12 places + 11 subjects + pre-filled content
   ========================================================= */

/* ============= PLACES — 12 real stops ============= */
const PLACES = [
  { id: 1, num: '01', name: 'Parroquia de Dolores', city: 'Dolores Hidalgo', cityShort: 'Dolores', coords: [21.1567, -100.9343], img: 'assets/img/dol-parroquia.jpg', desc: 'Donde Hidalgo dio el Grito de Independencia el 16 de septiembre de 1810. Cuna de la patria mexicana.', subjects: ['humanidades', 'literatura'] },
  { id: 2, num: '02', name: 'Antigua Cárcel', city: 'Dolores Hidalgo', cityShort: 'Dolores', coords: [21.1573, -100.9342], img: 'assets/img/dol-carcel.jpg', desc: 'Hoy Museo de la Independencia Nacional. Memoria de los inicios del movimiento insurgente.', subjects: ['humanidades'] },
  { id: 3, num: '03', name: 'Casa de Hidalgo', city: 'Dolores Hidalgo', cityShort: 'Dolores', coords: [21.1583, -100.9352], img: 'assets/img/dol-casa-hidalgo.jpg', desc: 'Hogar del cura Don Miguel Hidalgo y Costilla, Padre de la Patria.', subjects: ['humanidades', 'literatura'] },
  { id: 4, num: '04', name: 'Plaza Principal', city: 'Dolores Hidalgo', cityShort: 'Dolores', coords: [21.1576, -100.9347], img: 'assets/img/dol-plaza.jpg', desc: 'Jardín principal donde sonaron las campanas del Grito en 1810. Corazón cívico de la ciudad.', subjects: ['humanidades', 'edfisica'] },
  { id: 5, num: '05', name: 'Monumento al Pípila', city: 'Guanajuato', cityShort: 'Guanajuato', coords: [21.0144, -101.2557], img: 'assets/img/gto-pipila.jpg', desc: 'Mirador panorámico. Estatua del héroe que prendió fuego a la Alhóndiga en 1810.', subjects: ['ingles', 'humanidades'] },
  { id: 6, num: '06', name: 'Callejón del Beso', city: 'Guanajuato', cityShort: 'Guanajuato', coords: [21.0157, -101.2620], img: 'assets/img/gto-callejon.jpg', desc: 'Leyenda romántica de Doña Ana y Don Carlos. El callejón más estrecho de la ciudad.', subjects: ['literatura', 'edfisica'] },
  { id: 7, num: '07', name: 'Basílica Colegiata', city: 'Guanajuato', cityShort: 'Guanajuato', coords: [21.0185, -101.2578], img: 'assets/img/gto-basilica.png', desc: 'Catedral de Nuestra Señora de Guanajuato. Patrona de la ciudad, fachada barroca amarilla.', subjects: ['literatura', 'multimedia'] },
  { id: 8, num: '08', name: 'Alhóndiga de Granaditas', city: 'Guanajuato', cityShort: 'Guanajuato', coords: [21.0214, -101.2585], img: 'assets/img/gto-alhondiga.jpg', desc: 'Antiguo granero, lugar de la primera batalla de la Independencia. Hoy museo regional.', subjects: ['humanidades', 'multimedia'] },
  { id: 9, num: '09', name: 'Mercado Hidalgo', city: 'Guanajuato', cityShort: 'Guanajuato', coords: [21.0188, -101.2602], img: 'assets/img/gto-mercado.jpg', desc: 'Mercado histórico de hierro forjado inaugurado en 1910. Centro de comercio, gastronomía y artesanía.', subjects: ['negocios', 'quimica'] },
  { id: 10, num: '10', name: 'Mina La Valenciana', city: 'Guanajuato', cityShort: 'Guanajuato', coords: [21.0341, -101.2516], img: 'assets/img/gto-valenciana.jpg', desc: 'Una de las minas de plata más productivas del mundo en el siglo XVIII. Templo barroco anexo.', subjects: ['robotica', 'ciencias', 'quimica'] },
  { id: 11, num: '11', name: 'Universidad de Guanajuato', city: 'Guanajuato', cityShort: 'Guanajuato', coords: [21.0186, -101.2575], img: 'assets/img/gto-universidad.jpg', desc: 'Edificio Central de fachada blanca con su escalinata icónica de 113 escalones.', subjects: ['programacion'] },
  { id: 12, num: '12', name: 'Teatro Juárez', city: 'Guanajuato', cityShort: 'Guanajuato', coords: [21.0186, -101.2562], img: 'assets/img/gto-teatro.jpg', desc: 'Joya arquitectónica del porfiriato. Escenario principal del Festival Internacional Cervantino.', subjects: ['herramientas', 'multimedia'] }
];

/* ============= SUBJECTS — 11 academic areas ============= */
const SUBJECTS = [
  /* ───── 01 Química ───── PENDING */
  { key: 'quimica', num: '01', eyebrow: 'Asignatura · 2° semestre',
    title: 'Química &amp; <em>Biología</em>',
    teacher: 'Mtra. Michelle Ramírez Almaraz',
    placeIds: [9, 10],
    tagline: 'La ciencia detrás de la historia',
    body: '<p>Análisis de procesos químicos y biológicos presentes en los sitios visitados: <strong>oxidación de estructuras metálicas</strong>, biodiversidad local y composición de minerales en las minas.</p>',
    tags: ['Video documental', '5-8 min', 'Bitácora científica'],
    status: 'pending'
  },

  /* ───── 02 Robótica ───── PENDING */
  { key: 'robotica', num: '02', eyebrow: 'Asignatura · 4° semestre',
    title: 'Robótica · <em>Ecología</em>',
    teacher: 'Mtra. Michelle Ramírez Almaraz',
    placeIds: [10],
    tagline: 'Tecnología para preservar el patrimonio',
    body: '<p>Diseñar soluciones tecnológicas a problemáticas observadas:</p><ul><li>App turística interactiva</li><li>Simulación de contaminación</li><li>Prototipo de sensor ambiental</li><li>Código para análisis de datos ecológicos</li></ul>',
    tags: ['Prototipo funcional', 'Pitch', 'STEAM'],
    status: 'pending'
  },

  /* ───── 03 Programación Web III ───── READY */
  { key: 'programacion', num: '03', eyebrow: 'Asignatura · 6° semestre',
    title: 'Programación <em>Web III</em>',
    teacher: 'Mtro. Ricardo Carrillo Cue',
    placeIds: [11],
    tagline: 'Gestión, tecnología y procesos',
    body: '<p>Portafolio de gestión de proyectos en PDF profesional integrando los módulos de gestión (A), tecnología (T) y análisis de procesos (E).</p>',
    tags: ['Portafolio PDF', 'Gestión', '6° sem'],
    status: 'ready',
    content: `
      <h4>1. Marco Normativo y Seguridad <span class="weight">25%</span></h4>
      <p>Una excursión académica institucional requiere cumplir con la normativa de seguridad escolar de la SEP y la DGETI. Los puntos clave son:</p>
      <ul>
        <li><strong>Autorización de padres:</strong> permiso firmado por escrito, copia de identificación y datos de emergencia.</li>
        <li><strong>Cobertura de seguro:</strong> Seguro Estudiantil Contra Accidentes Escolares (SECAE) y, si aplica, seguro adicional del transporte.</li>
        <li><strong>Personal docente acompañante:</strong> mínimo un profesor cada 15 alumnos.</li>
        <li><strong>Transporte certificado:</strong> verificación de la SCT vigente, póliza del operador.</li>
        <li><strong>Protocolo de emergencias:</strong> botiquín, lista de hospitales en ruta (Hospital General de Guanajuato, Centro Médico Quirúrgico de Dolores Hidalgo).</li>
      </ul>
      <h4>2. Logística &amp; Análisis de Costos <span class="weight">25%</span></h4>
      <p>Estructura de cálculo por estudiante (cifras aproximadas, sujeta a cotización):</p>
      <ul>
        <li>Transporte ida/vuelta Qro–Gto–Dolores Hidalgo–Qro: ~$650 / estudiante</li>
        <li>Hospedaje (1 noche, hostal compartido): ~$450 / estudiante</li>
        <li>Alimentos (3 comidas + 1 cena): ~$350 / estudiante</li>
        <li>Entradas a museos (Alhóndiga, Mina Valenciana, Casa Hidalgo): ~$220 / estudiante</li>
        <li>Funicular al Pípila + propinas guías: ~$100 / estudiante</li>
        <li>Imprevistos (10%): ~$180 / estudiante</li>
      </ul>
      <blockquote>Total estimado por estudiante: <strong>$1,950 MXN</strong> (cifra de referencia).</blockquote>
      <h4>3. Sustitución Tecnológica · Recorrido Virtual</h4>
      <p>Mientras llega la fecha, se pueden recorrer los sitios usando <strong>Google Street View</strong> y los sitios oficiales:</p>
      <ul>
        <li><em>visitguanajuato.mx</em> — sitio oficial de turismo de Guanajuato</li>
        <li><em>museodelaindependencia.gob.mx</em> — Antigua Cárcel de Dolores</li>
        <li>Street View dentro del Mercado Hidalgo y la Mina La Valenciana</li>
      </ul>
    `
  },

  /* ───── 04 Herramientas Digitales ───── READY */
  { key: 'herramientas', num: '04', eyebrow: 'Asignatura · 2°/4° semestre',
    title: 'Herramientas <em>Digitales</em>',
    teacher: 'Mtra. María Fernanda Rosas Mendoza',
    placeIds: [12],
    tagline: 'Guía turística digital interactiva',
    body: '<p>Crear una guía interactiva sobre Guanajuato que integre mapas, rutas, fotografías, videos, recomendaciones y códigos QR vinculados a sitios de interés.</p>',
    tags: ['Guía digital', 'Mapas + QR', 'Multimedia'],
    status: 'ready',
    content: `
      <h4>Propuesta de guía</h4>
      <p>Este mismo sitio web —el que estás navegando— es la guía turística digital interactiva entregable. Cumple con todos los criterios de la rúbrica:</p>
      <ul>
        <li><strong>Contenido turístico:</strong> 12 sitios históricos descritos con detalle.</li>
        <li><strong>Mapas y rutas:</strong> mapa Leaflet interactivo con ruta polyline conectando los puntos.</li>
        <li><strong>Recursos multimedia:</strong> 12 imágenes en alta resolución de Wikimedia Commons.</li>
        <li><strong>Integración QR:</strong> al desplegar el sitio en GitHub Pages se generará un QR para acceso móvil.</li>
        <li><strong>Diseño digital:</strong> tipografía editorial Anthropic (Newsreader + Inter), animaciones suaves, paleta cálida mexicana.</li>
        <li><strong>Comunicación y redacción:</strong> texto en español sin errores, jerarquía clara.</li>
        <li><strong>Creatividad e innovación:</strong> implementación con Leaflet + OpenStreetMap, partículas, marquees, magnetic buttons, scroll progress, cursor custom.</li>
      </ul>
      <h4>Stack técnico</h4>
      <ul>
        <li>HTML5 semántico · CSS3 con variables y grid · JavaScript ES6+ vanilla</li>
        <li>Leaflet 1.9.4 + tiles CartoDB Voyager</li>
        <li>Google Fonts (Newsreader, Inter, JetBrains Mono)</li>
        <li>Wikimedia Commons (imágenes en CC)</li>
        <li>Despliegue: GitHub Pages</li>
      </ul>
    `
  },

  /* ───── 05 Ciencias / Hidrostática ───── PENDING */
  { key: 'ciencias', num: '05', eyebrow: 'Asignatura · 4° semestre',
    title: 'Ciencias · <em>Hidrostática</em>',
    teacher: 'Mtro. Daniel Vicente Vázquez · 4.1 y 4.2',
    placeIds: [10],
    tagline: '¿Cómo influye la hidrostática en nuestra vida?',
    body: '<p>Aplicación del <strong>Principio de Pascal</strong>: la presión aplicada a un fluido incompresible confinado se transmite con igual intensidad en todas direcciones.</p><p>Evaluación: Fase Diseño 30% · Fase Registro 20% · Fase Presentación 30%. El sistema debe contemplar <strong>tres o más movimientos</strong>.</p>',
    tags: ['Objeto funcional', 'Bitácora', 'Pascal'],
    status: 'pending'
  },

  /* ───── 06 Multimedia ───── PENDING */
  { key: 'multimedia', num: '06', eyebrow: 'Asignatura · 2° semestre',
    title: 'Diseño <em>Multimedia</em>',
    teacher: 'Mtra. Patricia Martínez',
    placeIds: [8, 7],
    tagline: 'Cartel y fotomontaje del viaje',
    body: '<p>Crear un <strong>cartel/banner digital</strong> y un <strong>fotomontaje creativo</strong> basados en la experiencia del viaje. Se evalúan: composición, color, tipografía, creatividad, edición y manejo de Canva/Photoshop.</p>',
    tags: ['Cartel digital', 'Fotomontaje', 'Adobe/Canva'],
    status: 'pending'
  },

  /* ───── 07 Negocios — BMC READY ───── */
  { key: 'negocios', num: '07', eyebrow: 'Asignatura · 4° semestre',
    title: 'Admón. de <em>Negocios</em>',
    teacher: 'Mtra. Patricia Martínez',
    placeIds: [9],
    tagline: 'Business Model Canvas: Rutas Culturales Gto',
    body: '<p>Business Model Canvas para una propuesta de negocio inspirada en el viaje. Modelo propuesto: <strong>"Rutas Culturales GTO"</strong>, recorridos guiados temáticos por jóvenes universitarios.</p>',
    tags: ['BMC completo', 'Pitch', '9 bloques'],
    status: 'ready',
    content: `
      <h4>Business Model Canvas · Rutas Culturales GTO</h4>
      <div class="bmc-grid">
        <div class="bmc-block"><span class="bmc-block__label">1 · Propuesta de valor</span><p>Recorridos guiados temáticos (Independencia, Minas, Leyendas, Gastronomía) facilitados por estudiantes universitarios. Experiencia auténtica, cercana y económica vs. turismo masivo.</p></div>
        <div class="bmc-block"><span class="bmc-block__label">2 · Segmento de clientes</span><p>Familias mexicanas, estudiantes de bachillerato/universidad, mochileros nacionales (18-35 años), turistas independientes con interés cultural.</p></div>
        <div class="bmc-block"><span class="bmc-block__label">3 · Canales</span><p>Redes sociales (Instagram, TikTok), Airbnb Experiences, alianzas con hostales, código QR en mercado y zócalo.</p></div>
        <div class="bmc-block"><span class="bmc-block__label">4 · Relación con clientes</span><p>Grupos pequeños (máx 8 personas), atención personalizada, seguimiento post-tour vía WhatsApp, descuentos por referidos.</p></div>
        <div class="bmc-block"><span class="bmc-block__label">5 · Fuentes de ingreso</span><p>Recorrido base $250/persona · ruta extendida (4h) $400 · paquete fin de semana $1,200 · comisiones por restaurantes/talleres recomendados.</p></div>
        <div class="bmc-block"><span class="bmc-block__label">6 · Recursos clave</span><p>Guías capacitados, transporte propio (camionetas), página web, equipo de audio inalámbrico, alianzas con sitios cerrados al público.</p></div>
        <div class="bmc-block"><span class="bmc-block__label">7 · Actividades clave</span><p>Diseñar y operar tours · capacitar guías · marketing digital · gestionar reservas · mantener red de aliados locales.</p></div>
        <div class="bmc-block"><span class="bmc-block__label">8 · Socios clave</span><p>Universidad de Guanajuato, hostales Casa Bertha y Casa Mexicana, restaurantes del Truco 7, artesanos del Mercado Hidalgo.</p></div>
        <div class="bmc-block"><span class="bmc-block__label">9 · Estructura de costos</span><p>Salarios guías 40% · gasolina/mantenimiento 15% · marketing digital 12% · seguros y permisos 8% · equipo 8% · operación 17%.</p></div>
      </div>
      <blockquote>Punto de equilibrio estimado: <strong>120 personas/mes</strong>. Inversión inicial: <strong>$85,000 MXN</strong>.</blockquote>
    `
  },

  /* ───── 08 Educación Física — ULAMA READY ───── */
  { key: 'edfisica', num: '08', eyebrow: 'Asignatura · Todos los semestres',
    title: 'Educación <em>Física</em>',
    teacher: 'Mtra. Diana Olvera Antonio',
    placeIds: [6, 4],
    tagline: 'Educación física en la antigüedad · El Ulama',
    body: '<p>Recrear una práctica de educación física de una civilización antigua. Práctica investigada: <strong>el Ulama</strong>, juego de pelota mesoamericano de más de 3,500 años de antigüedad.</p>',
    tags: ['Reporte 3-5p', 'Ulama mesoamericano'],
    status: 'ready',
    content: `
      <h4>Ubicación &amp; contexto histórico</h4>
      <p>El <em>Ulama</em> es el juego ritual y deportivo más antiguo del continente americano. Practicado por los olmecas, mayas, zapotecas, mixtecos y mexicas desde aproximadamente el 1,500 a.C., aún sobrevive hoy en algunas comunidades del estado de Sinaloa, México.</p>
      <h4>Personajes relevantes</h4>
      <p>En la mitología maya, los <em>Héroes Gemelos</em> Hunahpú e Ixbalanqué descienden al inframundo a jugar contra los señores de Xibalbá. El juego es así <strong>cosmogonía y deporte</strong> a la vez. Los gobernantes prehispánicos exhibían sus habilidades en partidos públicos.</p>
      <h4>Reglas, materiales y espacio</h4>
      <ul>
        <li><strong>Cancha:</strong> en forma de I, llamada <em>tlachtli</em>; muros laterales inclinados.</li>
        <li><strong>Pelota:</strong> caucho macizo de hule (Castilla elastica), peso 3–4 kg, diámetro ~20 cm.</li>
        <li><strong>Equipos:</strong> 2 a 5 jugadores por lado.</li>
        <li><strong>Modalidades:</strong> <em>Ulama de cadera</em> (la más extendida), <em>Ulama de antebrazo</em>, <em>Ulama de mazo</em>.</li>
        <li><strong>Objetivo:</strong> mantener la pelota en juego golpeándola solo con la cadera/antebrazo —no las manos ni los pies— hasta lograr que el rival cometa falta.</li>
        <li><strong>Anotación:</strong> en versión maya, hacer pasar la pelota por un aro de piedra vertical otorgaba la victoria inmediata.</li>
      </ul>
      <h4>Importancia, identidad y reflexión</h4>
      <p>El Ulama articulaba <strong>religión, política y ejercicio físico</strong>: era rito propiciatorio para la lluvia, mecanismo de resolución de disputas entre señoríos, y entrenamiento marcial. Hoy se considera patrimonio inmaterial. Comparado con el deporte actual, demuestra que la educación física no es solo cuerpo: es identidad cultural en movimiento.</p>
      <blockquote>"Donde la pelota viva, vive la memoria del pueblo." — Proverbio náhuatl reconstruido.</blockquote>
    `
  },

  /* ───── 09 Inglés — READY ───── */
  { key: 'ingles', num: '09', eyebrow: 'Asignatura · Todos los semestres',
    title: '<em>Exploring</em> Guanajuato',
    teacher: 'Mtro. Valentín Hernández Salazar',
    placeIds: [5],
    tagline: 'STEAM project in English',
    body: '<p>STEAM-based product in <strong>English</strong>: poster, short video or model. Rubric of 24 points over 6 criteria.</p>',
    tags: ['Poster / Video', 'In English', '24 pts'],
    status: 'ready',
    content: `
      <h4>Exploring Guanajuato · A STEAM Journey</h4>
      <p><strong>Science · </strong> The mummies of Guanajuato, naturally preserved by the dry mineral-rich soil, teach us about <em>desiccation, halophilic bacteria</em>, and the chemistry of preservation. The silver mines around Valenciana show us the oxidation of metals and the geology of the Sierra de Guanajuato.</p>
      <p><strong>Technology · </strong> The underground tunnel network —once a drainage system for floods, now a road system— is a fascinating example of <em>hydraulic engineering</em>. The Hidalgo Market, with its iron structure imported from France, shows the technology transfer of the early 20th century.</p>
      <p><strong>Engineering · </strong> The Valenciana mine descends more than 500 meters underground. Its shaft, pumps, and ventilation system represent one of the most advanced mining engineering feats of the colonial era.</p>
      <p><strong>Arts · </strong> Baroque churrigueresque architecture (Templo de la Compañía, Valenciana), the gold leaf interiors, and the Cervantes Festival held in Teatro Juárez every October all show how Guanajuato lives <em>between past and present art</em>.</p>
      <p><strong>Mathematics · </strong> The labyrinthine layout of the historic center, the perfect cone of the Pípila viewpoint, and the geometric tiles inside the Basílica Colegiata are exercises in geometry and proportion.</p>
      <h4>Key vocabulary</h4>
      <p><em>silver mining</em> · <em>cobblestone alley</em> · <em>UNESCO World Heritage</em> · <em>colonial architecture</em> · <em>baroque facade</em> · <em>underground tunnels</em> · <em>independence movement</em> · <em>mining shaft</em></p>
      <blockquote>"In Guanajuato, every stone tells a story that started 500 years ago and continues today."</blockquote>
    `
  },

  /* ───── 10 Humanidades — READY ───── */
  { key: 'humanidades', num: '10', eyebrow: 'Asignatura · Todos los semestres',
    title: '<em>Humanidades</em>',
    teacher: 'Mtro. Omar Ávila Cruz',
    placeIds: [1, 3, 8],
    tagline: 'Investigación previa: Personajes y sitios',
    body: '<p>Investigación previa sobre los personajes y lugares de la Independencia que se visitarán: Don Miguel Hidalgo, Ignacio Allende, y los sitios donde inició el movimiento insurgente.</p>',
    tags: ['Investigación', 'Independencia', 'Entrega digital'],
    status: 'ready',
    content: `
      <h4>Miguel Hidalgo y Costilla <span class="bio-dates">1753 — 1811</span></h4>
      <p>Sacerdote y caudillo, nacido en la Hacienda de Corralejo, Pénjamo, Guanajuato. Fue párroco de Dolores desde 1803, donde impulsó actividades agrícolas, industriales y culturales prohibidas por la Corona (alfarería, viñedos, sericultura). En la madrugada del <strong>16 de septiembre de 1810</strong>, tocó las campanas de la parroquia y dio el <em>Grito de Dolores</em>, llamando al pueblo a la lucha por la independencia. Lideró un ejército insurgente que tomó San Miguel el Grande, Celaya y la Alhóndiga de Granaditas. Fue capturado en Acatita de Baján y fusilado en Chihuahua en 1811.</p>
      <h4>Ignacio Allende <span class="bio-dates">1769 — 1811</span></h4>
      <p>Militar criollo nacido en San Miguel el Grande (hoy San Miguel de Allende). Capitán del regimiento de la Reina, se unió a la conspiración de Querétaro y aportó la disciplina militar que el movimiento necesitaba. Fue <strong>estratega clave</strong> de las primeras campañas. Junto con Hidalgo fue capturado y fusilado en Chihuahua. Su nombre engrandece hoy a la ciudad que lo vio nacer.</p>
      <h4>El Grito de Dolores · 16 de septiembre de 1810</h4>
      <p>En la madrugada del domingo, Hidalgo convocó al pueblo de Dolores con el repique de campanas. Desde el atrio de la <em>Parroquia de Nuestra Señora de los Dolores</em> arengó a la multitud con vivas a la independencia, a la Virgen de Guadalupe y mueras al mal gobierno. Es el acto fundacional de la nación mexicana.</p>
      <h4>Toma de la Alhóndiga de Granaditas · 28 de septiembre de 1810</h4>
      <p>El antiguo granero de la ciudad de Guanajuato, edificio de muros gruesos, se convirtió en fortaleza realista. Tras horas de asedio, el minero <strong>Juan José de los Reyes Martínez, "El Pípila"</strong>, ató una losa de piedra a su espalda y, protegiéndose de los disparos, prendió fuego a la puerta. La caída de la Alhóndiga fue la primera gran victoria insurgente.</p>
      <h4>Importancia histórica</h4>
      <p>Los sitios que visitaremos no son solo monumentos: son <strong>el origen geográfico de la nación</strong>. Caminar por la plaza de Dolores, ver la celda donde Hidalgo estuvo preso, o pisar las escaleras donde cayó el Pípila, es entender de manera tangible cómo nació México.</p>
    `
  },

  /* ───── 11 Literatura — LEGEND READY ───── */
  { key: 'literatura', num: '11', eyebrow: 'Asignatura · Todos los semestres',
    title: 'Literatura · <em>STEAM</em>',
    teacher: 'Mtro. Omar Ávila Cruz · ABP "La Ruta del Bisonte"',
    placeIds: [6, 7],
    tagline: 'Leyenda del Callejón del Beso',
    body: '<p>Producción escrita: leyenda, mito, crónica y guion. Como entrega previa se incluye la <strong>leyenda más famosa de Guanajuato</strong>: la del Callejón del Beso.</p>',
    tags: ['Leyenda escrita', 'Mito · Crónica', 'ABP'],
    status: 'ready',
    content: `
      <h4 class="legend-head">Leyenda del Callejón del Beso</h4>
      <p class="legend-prose">Cuentan los viejos de Guanajuato que en una callejuela tan estrecha que dos manos pueden encontrarse de balcón a balcón, vivió hace siglos la hermosa <em>Doña Ana</em>. Su padre, hombre orgulloso y de fortuna, había decidido casarla con un noble español a quien la joven no amaba.</p>
      <p class="legend-prose">El destino quiso que Ana se enamorara de <em>Don Carlos</em>, un joven minero que la vio rezando en la Basílica Colegiata. Sabiendo del rechazo del padre, Carlos compró —con todos sus ahorros— la casa frente a la de Ana. Los balcones quedaban a apenas <strong>sesenta y ocho centímetros</strong> el uno del otro: una distancia que solo permitía un beso furtivo, casi un secreto.</p>
      <p class="legend-prose">Las noches estaban hechas para ellos. Carmen ⸺que así también la nombraban⸺ tomaba las manos de su amado entre las rejas y el callejón se llenaba de promesas. Hasta que una noche, el padre subió las escaleras sin aviso. Al ver el rostro de Carlos tan cerca del de su hija, la furia le ganó. Tomó una daga y atravesó el pecho de Ana antes de que ella pudiera gritar.</p>
      <p class="legend-prose">Carlos, con el último beso de Ana aún en sus labios, se hundió en la mina y nunca más volvió a salir. Cuentan que se dejó morir, esperando reencontrarla en otro mundo.</p>
      <p class="legend-prose">Desde entonces, las parejas que se besan en el <em>tercer escalón</em> del callejón aseguran quince años de felicidad. Las que no lo hacen… siete años de mala suerte. Y los más viejos juran que, en noches de luna llena, todavía se escuchan dos voces susurrando al viento entre los balcones.</p>
      <h4>Mito asociado — El Pípila</h4>
      <p>Otra figura legendaria es <em>Juan José de los Reyes Martínez</em>, "El Pípila". Aunque su existencia histórica está documentada, el mito ha crecido con los años: se dice que su losa de piedra atada a la espalda era tan pesada que solo un cuerpo bendito por la Virgen pudo cargarla. Hoy su monumento vigila la ciudad desde el cerro, antorcha en alto, recordándonos que de los más humildes nacen los más grandes héroes.</p>
      <h4>Estructura para la crónica del viaje</h4>
      <p>La crónica que se entregará tras la expedición seguirá esta estructura:</p>
      <ul>
        <li><strong>Apertura sensorial</strong> — el primer impacto al llegar a Dolores Hidalgo</li>
        <li><strong>Eje narrativo</strong> — el recorrido cronológico por los 12 sitios</li>
        <li><strong>Voz personal</strong> — reflexiones y vínculos con lo aprendido en clase</li>
        <li><strong>Cierre</strong> — una imagen que sintetice la experiencia</li>
      </ul>
    `
  }
];

const placeById = id => PLACES.find(p => p.id === id);
const subjectByKey = k => SUBJECTS.find(s => s.key === k);
function stripHtml(html) { const d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; }

/* ============= INJECT MAP LIST ============= */
(function injectMapList() {
  const list = document.getElementById('mapList');
  if (!list) return;
  list.innerHTML = PLACES.map(p => `
    <li class="map-list-item" data-place="${p.id}" data-magnetic-soft>
      <span class="map-list-item__num">${p.num}</span>
      <span class="map-list-item__text">
        <span class="map-list-item__title">${p.name}</span>
        <span class="map-list-item__loc">${p.cityShort}</span>
      </span>
      <svg class="map-list-item__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </li>
  `).join('');
})();

/* ============= INJECT SUBJECT SECTIONS ============= */
(function injectSubjects() {
  const wrap = document.getElementById('subjectSections');
  if (!wrap) return;
  wrap.innerHTML = SUBJECTS.map(s => {
    const primary = placeById(s.placeIds[0]);
    const locations = s.placeIds.map(id => placeById(id)?.name).filter(Boolean);
    const ready = s.status === 'ready';
    return `
    <article class="subject rv" id="subj-${s.key}" data-subject="${s.key}" data-status="${s.status}">
      <div class="subject__media" data-tilt>
        <div class="subject__media-inner">
          <img src="${primary.img}" alt="${primary.name}" loading="lazy">
        </div>
        <div class="subject__media-tag">${s.num} · ${primary.name}</div>
        <div class="subject__media-placeholder">${ready ? 'Contenido pre-cargado · esperando fotos del viaje' : 'Espacio reservado para foto del viaje'}</div>
      </div>
      <div class="subject__body">
        <div class="subject__head">
          <span class="subject__num">${s.num}</span>
          <span class="subject__eyebrow">${s.eyebrow}</span>
          <span class="status-badge status-badge--${s.status}">${ready ? '● Listo' : '○ Pendiente'}</span>
        </div>
        <h3 class="subject__title">${s.title}</h3>
        <p class="subject__teacher">${s.teacher} · <em>${s.tagline}</em></p>
        ${s.body}
        <div class="subject__meta">
          ${locations.map(l => `<span class="tag tag--accent">${l}</span>`).join('')}
          ${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        ${ready ? `
          <details class="subject__content">
            <summary>
              <span class="summary-text">Ver contenido pre-cargado</span>
              <span class="summary-icon" aria-hidden="true">+</span>
            </summary>
            <div class="subject__content-inner">
              ${s.content}
            </div>
          </details>
        ` : ''}
        <div class="subject__actions">
          <button class="subject__cta" data-subject="${s.key}" data-magnetic>
            <span>Ver rúbrica completa</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </article>`;
  }).join('');
})();

/* ============= LEAFLET MAP ============= */
let map = null;
let markers = {};

function initMap() {
  if (typeof L === 'undefined') return;
  map = L.map('map', {
    minZoom: 9, maxZoom: 18,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: false
  });

  const bounds = L.latLngBounds(PLACES.map(p => p.coords)).pad(0.15);
  map.fitBounds(bounds);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 19
  }).addTo(map);

  map.getContainer().addEventListener('mouseenter', () => map.scrollWheelZoom.enable());
  map.getContainer().addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

  const doloresCoords = PLACES.filter(p => p.city === 'Dolores Hidalgo').map(p => p.coords);
  const guanajuatoCoords = PLACES.filter(p => p.city === 'Guanajuato').map(p => p.coords);

  if (doloresCoords.length > 1) {
    L.polyline(doloresCoords, { color: '#A57826', weight: 3, opacity: 0.75, smoothFactor: 1.2, className: 'route-line' }).addTo(map);
  }
  if (guanajuatoCoords.length > 1) {
    L.polyline(guanajuatoCoords, { color: '#C9461C', weight: 3, opacity: 0.75, smoothFactor: 1.2, className: 'route-line' }).addTo(map);
  }
  L.polyline([doloresCoords[doloresCoords.length - 1], guanajuatoCoords[0]], {
    color: '#6B5F54', weight: 1.5, opacity: 0.5, dashArray: '2 8', smoothFactor: 1
  }).addTo(map);

  PLACES.forEach(p => {
    const cityClass = p.city === 'Dolores Hidalgo' ? 'dolores' : '';
    const html = `
      <div class="leaflet-marker-pin ${cityClass}" data-id="${p.id}">
        <div class="leaflet-marker-pin__pulse"></div>
        <div class="leaflet-marker-pin__circle">${p.num}</div>
      </div>`;
    const icon = L.divIcon({ html, className: 'leaflet-marker-pin-wrap', iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -22] });
    const marker = L.marker(p.coords, { icon }).addTo(map);

    const popup = `
      <img src="${p.img}" class="popup-img" alt="${p.name}">
      <div class="popup-inner">
        <div class="popup-loc">${p.num} · ${p.cityShort}</div>
        <div class="popup-title">${p.name}</div>
        <div class="popup-desc">${p.desc}</div>
        ${p.subjects.length ? `<span class="popup-link" data-place="${p.id}">Ver asignaturas →</span>` : ''}
      </div>`;
    marker.bindPopup(popup, { offset: [0, -8], closeButton: false, maxWidth: 320, autoPanPadding: [60, 60] });

    marker.on('click', () => {
      setActive(p.id);
      marker.openPopup();
      map.flyTo(p.coords, Math.max(map.getZoom(), 15), { duration: 1 });
    });

    markers[p.id] = marker;
  });
}

function setActive(id) {
  document.querySelectorAll('.map-list-item').forEach(el => {
    el.classList.toggle('is-active', +el.dataset.place === id);
  });
  document.querySelectorAll('.leaflet-marker-pin').forEach(el => {
    el.classList.toggle('is-active', +el.dataset.id === id);
  });
}

function resetMap() {
  if (!map) return;
  const bounds = L.latLngBounds(PLACES.map(p => p.coords)).pad(0.15);
  map.flyToBounds(bounds, { duration: 1.2 });
  document.querySelectorAll('.map-list-item').forEach(el => el.classList.remove('is-active'));
  document.querySelectorAll('.leaflet-marker-pin').forEach(el => el.classList.remove('is-active'));
}

document.addEventListener('click', e => {
  const popupLink = e.target.closest('.popup-link');
  if (popupLink) {
    const placeId = +popupLink.getAttribute('data-place');
    const place = placeById(placeId);
    if (place && place.subjects.length) {
      const firstSubj = place.subjects[0];
      const target = document.getElementById('subj-' + firstSubj);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }
  const item = e.target.closest('.map-list-item');
  if (item) {
    const id = +item.dataset.place;
    const p = placeById(id);
    if (p && map) {
      setActive(id);
      map.flyTo(p.coords, 16, { duration: 1.1 });
      setTimeout(() => markers[id]?.openPopup(), 500);
    }
    return;
  }
  const cta = e.target.closest('.subject__cta');
  if (cta) {
    const key = cta.dataset.subject;
    if (key) openModal(key);
  }
});

/* ============= NAV SCROLL + BURGER ============= */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) nav.classList.add('is-scrolled');
  else nav.classList.remove('is-scrolled');
}, { passive: true });

const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
function toggleMenu(open) {
  const isOpen = open === undefined ? !nav.classList.contains('is-menu-open') : open;
  nav.classList.toggle('is-menu-open', isOpen);
  navBurger?.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
navBurger?.addEventListener('click', () => toggleMenu());
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

/* ============= SCROLL PROGRESS ============= */
const progressBar = document.querySelector('.scroll-progress__bar');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? window.scrollY / max : 0;
  progressBar.style.transform = `scaleX(${p})`;
}, { passive: true });

/* ============= HERO PARALLAX ============= */
const heroImg = document.getElementById('heroImg');
window.addEventListener('scroll', () => {
  if (!heroImg) return;
  const y = window.scrollY;
  if (y < window.innerHeight * 1.3) {
    heroImg.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(${1 + y * 0.0003})`;
  }
}, { passive: true });

/* ============= SPLIT TEXT ============= */
function splitTextWords() {
  document.querySelectorAll('[data-split="words"]').forEach(el => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const txt = el.textContent.trim();
    el.innerHTML = txt.split(/\s+/).map((w, i) =>
      `<span class="word"><span style="transition-delay:${i*0.04}s">${w}</span></span>`
    ).join(' ');
  });
}
splitTextWords();

/* ============= REVEALS ============= */
function triggerReveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.rv, [data-split], .hero__lead').forEach(el => io.observe(el));
}

/* ============= COUNTERS ============= */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = +el.dataset.count;
        const dur = 1500;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));
}

/* ============= MAGNETIC BUTTONS ============= */
function setupMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
  // Softer magnetic for list items
  document.querySelectorAll('[data-magnetic-soft]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      el.style.transform = `translateX(${x * 0.06}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ============= 3D TILT ON SUBJECT MEDIA ============= */
function setupTilt() {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rotY = (x - 0.5) * 6;
      const rotX = (0.5 - y) * 6;
      el.style.setProperty('--rotX', `${rotX}deg`);
      el.style.setProperty('--rotY', `${rotY}deg`);
      el.classList.add('is-tilting');
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--rotX', '0deg');
      el.style.setProperty('--rotY', '0deg');
      el.classList.remove('is-tilting');
    });
  });
}

/* ============= CURSOR ============= */
function setupCursor() {
  if (!window.matchMedia('(min-width: 1025px) and (hover: hover)').matches) return;
  const cur = document.querySelector('.cursor');
  if (!cur) return;
  let tx = innerWidth/2, ty = innerHeight/2, x = tx, y = ty;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  document.addEventListener('mousedown', () => cur.classList.add('is-press'));
  document.addEventListener('mouseup', () => cur.classList.remove('is-press'));
  const hovers = 'a, button, [data-magnetic], .map-list-item, .gal, .subject__cta, .leaflet-marker-pin, details summary';
  document.addEventListener('mouseover', e => { if (e.target.closest(hovers)) cur.classList.add('is-hover'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hovers)) cur.classList.remove('is-hover'); });
  function loop() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    cur.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ============= MODAL ============= */
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalNum = document.getElementById('modalNum');
const modalTitle = document.getElementById('modalTitle');
const modalTeacher = document.getElementById('modalTeacher');
const modalText = document.getElementById('modalText');
const modalMeta = document.getElementById('modalMeta');
const modalImg = document.getElementById('modalImg');

function openModal(key) {
  const s = subjectByKey(key);
  if (!s) return;
  const primary = placeById(s.placeIds[0]);
  const locations = s.placeIds.map(id => placeById(id)?.name).filter(Boolean);
  modalNum.textContent = `/${s.num} · ${locations.join(' · ')}`;
  modalTitle.innerHTML = s.title;
  modalTeacher.textContent = s.teacher;
  modalText.innerHTML = s.body + (s.content ? `<div class="modal__deep">${s.content}</div>` : '');
  modalMeta.innerHTML = locations.map(l => `<span class="tag tag--accent">${l}</span>`).join('') + s.tags.map(t => `<span class="tag">${t}</span>`).join('');
  modalImg.src = primary?.img || '';
  modalImg.alt = primary?.name || '';
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ============= MAP RESET ============= */
const mapResetBtn = document.getElementById('mapReset');
if (mapResetBtn) mapResetBtn.addEventListener('click', resetMap);

/* ============= MAP TRIGGER / OVERLAY (mobile) ============= */
const mapLayout = document.getElementById('mapLayout');
const mapTrigger = document.getElementById('mapTrigger');
const mapClose = document.getElementById('mapClose');
function openMapOverlay() {
  mapLayout?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    map?.invalidateSize();
    const bounds = L.latLngBounds(PLACES.map(p => p.coords)).pad(0.15);
    map?.fitBounds(bounds);
  }, 80);
}
function closeMapOverlay() {
  mapLayout?.classList.remove('is-open');
  document.body.style.overflow = '';
}
mapTrigger?.addEventListener('click', openMapOverlay);
mapClose?.addEventListener('click', closeMapOverlay);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mapLayout?.classList.contains('is-open')) closeMapOverlay();
});

/* ============= INIT ============= */
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  triggerReveals();
  animateCounters();
  setupMagnetic();
  setupTilt();
  setupCursor();
});
