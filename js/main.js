/* =========================================================
   JOURNEY TO GUANAJUATO · v9 (English · 2nd semester)
   Leaflet + 12 places + 7 subjects (separate sections)
   ========================================================= */

/* ============= QR CODE HELPER =============
   Renders a QR via api.qrserver.com (no JS library needed).
   Colors match the site palette (ink on paper).
*/
function qrUrl(targetUrl, size = 220) {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data: targetUrl,
    color: 'E3DDD5',
    bgcolor: '171A22',
    qzone: '2',
    margin: '0',
    format: 'svg'
  });
  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
}

/* ============= PLACES — 12 real stops ============= */
const PLACES = [
  {
    id: 1, num: '01', name: 'Parroquia de Dolores',
    nameEn: 'Parish of Our Lady of Sorrows',
    city: 'Dolores Hidalgo', cityShort: 'Dolores',
    coords: [21.1567, -100.9343], img: 'assets/img/dol-parroquia.jpg',
    short: 'Where Father Hidalgo rang the bells of the Mexican Independence on September 16, 1810.',
    history: 'Built between 1712 and 1778, this 18th-century Baroque parish is one of the most important historical monuments in Mexico. From its atrium, the priest Miguel Hidalgo y Costilla rang the bells at dawn on September 16, 1810, and called the people to fight for independence —an event known as the <em>Grito de Dolores</em>. Its Churrigueresque facade in pink quarry stone hides two interior altars covered in gold leaf.',
    highlights: ['Churrigueresque pink quarry-stone facade', 'Twin gold-leaf altars inside', 'Original bell that summoned the people in 1810', 'National Historic Monument since 1932'],
    ticket: {
      url: 'https://doloreshidalgo.gob.mx/oficial/',
      operator: 'Municipality of Dolores Hidalgo',
      note: 'Free entry · Plaza del Grande Hidalgo s/n'
    }
  },
  {
    id: 2, num: '02', name: 'Antigua Cárcel',
    nameEn: 'Former Royal Prison',
    city: 'Dolores Hidalgo', cityShort: 'Dolores',
    coords: [21.1573, -100.9342], img: 'assets/img/dol-carcel.jpg',
    short: 'Today the National Museum of Independence — memory of the insurgent movement.',
    history: 'This colonial building served as the royal jail of Dolores until the early 19th century. On the night of September 15, 1810, Hidalgo himself ordered the release of all the prisoners as one of the first acts of the insurgent movement. Today it houses the <strong>National Museum of Independence</strong>, with documents, weapons, paintings, and personal objects from the heroes of 1810.',
    highlights: ['National Museum of Independence', 'Original 18th-century cells preserved', 'Permanent collection of insurgent objects', 'Stone arcades and central courtyard'],
    ticket: {
      url: 'https://sic.cultura.gob.mx/ficha.php?table=museo&table_id=197',
      operator: 'Secretaría de Cultura · Museo de la Independencia Nacional',
      note: 'Mon–Sat 9–16h · $20 general · Sun free'
    }
  },
  {
    id: 3, num: '03', name: 'Casa de Hidalgo',
    nameEn: 'House of Father Hidalgo',
    city: 'Dolores Hidalgo', cityShort: 'Dolores',
    coords: [21.1583, -100.9352], img: 'assets/img/dol-casa-hidalgo.jpg',
    short: 'Home of the priest Miguel Hidalgo y Costilla, Father of the Nation.',
    history: 'Hidalgo lived in this modest house from 1804 to 1810 while serving as parish priest. Inside, he promoted activities forbidden by the Spanish Crown: pottery, silk-worm breeding, beekeeping, vineyards, and even a small brick factory. The conspiracy meetings before the Grito were held in its inner rooms. It is now a museum that preserves his personal belongings, furniture, and books.',
    highlights: ['Hidalgo\'s personal library', 'Original 19th-century furniture', 'Workshop and patio where he taught crafts', 'Site declared National Monument'],
    ticket: {
      url: 'https://www.inah.gob.mx/museos/museo-historico-curato-de-dolores',
      operator: 'INAH · Museo Histórico Curato de Dolores (Casa de Hidalgo)',
      note: 'Wed–Sat 10–16h · $75 general · Sun free for nationals'
    }
  },
  {
    id: 4, num: '04', name: 'Plaza Principal',
    nameEn: 'Main Square of Dolores',
    city: 'Dolores Hidalgo', cityShort: 'Dolores',
    coords: [21.1576, -100.9347], img: 'assets/img/dol-plaza.jpg',
    short: 'The civic heart of the city — where the bells of the Grito were heard in 1810.',
    history: 'This tree-lined garden is the geographical and symbolic center of Dolores Hidalgo. It hosts a bronze statue of Hidalgo holding the standard of the Virgin of Guadalupe. Around it stand the Parish, the Municipal Palace, and traditional <em>nieve</em> (ice cream) stands famous all over Mexico for their bold flavors —avocado, mole, beer, shrimp— a 19th-century local tradition.',
    highlights: ['Bronze statue of Hidalgo with the Guadalupan standard', 'Iconic ice-cream stands with unusual flavors', 'Site of the annual September 16 ceremony', 'Surrounded by colonial buildings'],
    ticket: {
      url: 'https://doloreshidalgo.gob.mx/oficial/',
      operator: 'Municipality of Dolores Hidalgo',
      note: 'Public square (Jardín del Grande Hidalgo) · free access 24/7'
    }
  },
  {
    id: 5, num: '05', name: 'Monumento al Pípila',
    nameEn: 'Monument to El Pípila',
    city: 'Guanajuato', cityShort: 'Guanajuato',
    coords: [21.0144, -101.2557], img: 'assets/img/gto-pipila.jpg',
    short: 'Panoramic lookout — statue of the hero who set the Alhóndiga on fire in 1810.',
    history: 'Inaugurated in 1939, this 28-meter pink-quarry statue honors <strong>Juan José de los Reyes Martínez, "El Pípila"</strong>, the young miner who —tying a flat stone to his back as a shield— set fire to the wooden door of the Alhóndiga de Granaditas, allowing the insurgents to take the building. The monument bears the inscription <em>"Aún hay otras Alhóndigas por incendiar"</em> ("There are still other Alhóndigas to burn"). From its base, the entire historic center unfolds below.',
    highlights: ['28-meter monumental statue', 'Best panoramic view of Guanajuato', 'Accessible by funicular or stairway', 'Famous historical inscription on the pedestal'],
    ticket: {
      url: 'https://guanajuato.travel/el-funicular-panoramico-de-guanajuato/',
      operator: 'Guanajuato Travel · Funicular Panorámico',
      note: 'Free monument · funicular $35 one-way / $70 round trip'
    }
  },
  {
    id: 7, num: '06', name: 'Basílica Colegiata',
    nameEn: 'Collegiate Basilica of Our Lady of Guanajuato',
    city: 'Guanajuato', cityShort: 'Guanajuato',
    coords: [21.0185, -101.2578], img: 'assets/img/gto-basilica.png',
    short: 'Patron church of the city — Baroque yellow facade, jewel of the historic center.',
    history: 'Built between 1671 and 1696, this Baroque basilica houses the image of <strong>Our Lady of Guanajuato</strong>, a 7th-century carving donated by King Philip II of Spain in 1557 — the oldest Christian image in the Americas. Its yellow exterior with white trim is the visual heart of the city. Inside, an altarpiece of solid gold and an organ from 1908 still in use.',
    highlights: ['7th-century image of Our Lady', 'Baroque yellow facade — symbol of Guanajuato', 'Solid-gold main altarpiece', '1908 organ still in liturgical use'],
    ticket: {
      url: 'https://www.guanajuatocapital.gob.mx/ova_por/basilica-de-guanajuato/',
      operator: 'Municipality of Guanajuato Capital',
      note: 'Free entry · Mon–Fri 9:30–16h · Sat 9:30–12:30h'
    }
  },
  {
    id: 8, num: '07', name: 'Alhóndiga de Granaditas',
    nameEn: 'Alhóndiga (Royal Granary)',
    city: 'Guanajuato', cityShort: 'Guanajuato',
    coords: [21.0214, -101.2585], img: 'assets/img/gto-alhondiga.jpg',
    short: 'Former granary, site of the first great insurgent victory. Today a regional museum.',
    history: 'Completed in 1809, this Neoclassical building was used as a public granary. On <strong>September 28, 1810</strong>, the royalist forces took refuge inside as the insurgent army arrived. After hours of siege, El Pípila set fire to the door and the insurgents took the building. After the war, the heads of Hidalgo, Allende, Aldama, and Jiménez were exhibited from its four corners for ten years as a warning. Today it is the <em>Museo Regional de Guanajuato</em>, with murals by José Chávez Morado.',
    highlights: ['Neoclassical facade in pink quarry stone', 'Murals by José Chávez Morado', 'Iron hooks where the heroes\' heads were exhibited', 'Permanent archaeological and historical collection'],
    ticket: {
      url: 'https://www.inah.gob.mx/museos/museo-regional-de-guanajuato-alhondiga-de-granaditas',
      operator: 'INAH · Museo Regional de Guanajuato',
      note: 'Tue–Sat 10–18h · Sun 10–15h · $90 general · Sun free for nationals'
    }
  },
  {
    id: 9, num: '08', name: 'Mercado Hidalgo',
    nameEn: 'Hidalgo Market',
    city: 'Guanajuato', cityShort: 'Guanajuato',
    coords: [21.0188, -101.2602], img: 'assets/img/gto-mercado.jpg',
    short: 'Historic wrought-iron market opened in 1910 — gastronomy, crafts, and color.',
    history: 'Inaugurated on September 16, 1910 to celebrate the centennial of the Independence, this market was built with a metal structure imported from <strong>France</strong> —the same style as the Eiffel Tower— and was originally planned as a railway station. Its 16-meter-high central clock and its mezzanine floor of artisan stalls make it one of the most photographed civic buildings in the state.',
    highlights: ['French wrought-iron structure (1910)', 'Central tower with original 16 m clock', 'Two floors: food downstairs, crafts upstairs', 'Local specialties: enchiladas mineras, charamuscas'],
    ticket: {
      url: 'https://guanajuato.travel/spots/listing/mercado-hidalgo/',
      operator: 'Guanajuato Travel · Mercado Hidalgo',
      note: 'Public market · free entry · daily 9–18h'
    }
  },
  {
    id: 10, num: '09', name: 'Mina La Valenciana',
    nameEn: 'Valenciana Silver Mine',
    city: 'Guanajuato', cityShort: 'Guanajuato',
    coords: [21.0341, -101.2516], img: 'assets/img/gto-valenciana.jpg',
    short: 'One of the most productive silver mines in the world in the 18th century. Baroque temple next door.',
    history: 'Discovered in 1768 by Antonio Obregón y Alcocer, this mine became the largest silver producer in colonial New Spain —at its peak it produced two-thirds of all the silver in the world. The main shaft, the <em>Tiro de San Cayetano</em>, descends more than 500 meters. Next to it stands the <strong>Templo de San Cayetano</strong>, a Churrigueresque jewel financed entirely with the mine\'s silver, with three altarpieces covered in 23-karat gold leaf.',
    highlights: ['Original 500 m mine shaft', 'Templo de San Cayetano with three gold altarpieces', 'Guided tours into the mining tunnels', 'Old miners\' tools and explosives exhibition'],
    ticket: {
      url: 'https://valenciana1791.webnode.es/',
      operator: 'Museo Mina Valenciana 1791',
      note: 'Guided tours · Fri–Sat 10–18h, Sun 10–17h · $50 MXN general'
    }
  },
  {
    id: 11, num: '10', name: 'Universidad de Guanajuato',
    nameEn: 'University of Guanajuato',
    city: 'Guanajuato', cityShort: 'Guanajuato',
    coords: [21.0186, -101.2575], img: 'assets/img/gto-universidad.jpg',
    short: 'Central building with an iconic white facade and its 113-step stairway.',
    history: 'Heir to the Jesuit school of the Holy Trinity (1732), the University of Guanajuato has its <strong>Central Building</strong> raised on a steep slope, with a green-and-white quarry facade in Modern Mexican Plateresque style designed by Vicente Urquiaga in 1955. Its <strong>113-step stairway</strong> is one of the city\'s symbols and a stage for the annual Cervantes Festival. It hosts about 40,000 students across its campuses.',
    highlights: ['Iconic 113-step stairway', 'Modern Mexican Plateresque facade (1955)', 'Active venue of the Cervantino Festival', 'Adjacent Jesuit church of La Compañía'],
    ticket: {
      url: 'https://www.ugto.mx/',
      operator: 'Universidad de Guanajuato',
      note: 'Public access to the building · guided tours via the University'
    }
  },
  {
    id: 12, num: '11', name: 'Teatro Juárez',
    nameEn: 'Juárez Theatre',
    city: 'Guanajuato', cityShort: 'Guanajuato',
    coords: [21.0186, -101.2562], img: 'assets/img/gto-teatro.jpg',
    short: 'Architectural jewel of the Porfiriato — main stage of the International Cervantino Festival.',
    history: 'Inaugurated by President Porfirio Díaz on October 27, 1903, this theatre is considered one of the most beautiful in Latin America. Its facade combines Doric columns with bronze sculptures of the nine Muses; its interior is an explosion of <em>Moorish-Art Nouveau</em> style with red velvet, gilded plaster, and walnut wood. It is the main venue of the International Cervantino Festival each October.',
    highlights: ['Eclectic facade with the nine Muses in bronze', 'Moorish-Art Nouveau interior', 'Capacity of 902 seats', 'Main stage of the Cervantino Festival'],
    ticket: {
      url: 'https://cultura.guanajuato.gob.mx/index.php/tag/teatro-juarez/',
      operator: 'Secretaría de Cultura de Guanajuato · Teatro Juárez',
      note: 'Programming &amp; box office · Sopeña s/n · Wed–Sun 10–15h, 17–19h'
    }
  }
];

/* ============= SUBJECTS — 7 academic subjects (2nd semester / all) ============= */
const SUBJECTS = [
  /* ───── 01 Chemistry & Biology ───── */
  {
    key: 'quimica', num: '01', eyebrow: 'Subject · 2nd semester',
    title: 'Chemistry &amp; <em>Biology</em>',
    teacher: 'Prof. Michelle Ramírez Almaraz',
    placeIds: [9, 10],
    tagline: 'The science behind the history',
    body: '<p>Analysis of chemical and biological processes present in the visited sites: <strong>oxidation of metal structures</strong>, local biodiversity, and the mineral composition of the silver mines of Guanajuato.</p>',
    tags: ['Documentary video', '5–8 min', '4 scientific journals'],
    status: 'ready',
    content: `
      <h4>Documentary video</h4>
      <p>Filmed and edited during the expedition. It explores the chemistry of the silver mines around Valenciana —oxidation of metals, sulfide ores— and the biology of the Hidalgo Market produce, with field observations from the historic center of Guanajuato.</p>
      <div class="video-embed">
        <iframe
          src="https://www.youtube.com/embed/8FbQBO30PzQ"
          title="Chemistry &amp; Biology — Trip Documentary"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen></iframe>
      </div>
      <h4>What you'll see</h4>
      <ul>
        <li><strong>Mineralogy:</strong> samples and surfaces from the Valenciana silver mine, with notes on <em>oxidation states</em> and the geology of the Sierra de Guanajuato.</li>
        <li><strong>Biological diversity:</strong> flora and fruits observed in Mercado Hidalgo, linking the regional agriculture to the local biome.</li>
        <li><strong>Field method:</strong> direct observation, photographic record and brief on-site interviews.</li>
      </ul>
      <h4>Scientific journals (Bitácoras)</h4>
      <p>Four field journals written after the trip, each with introduction, development, evidence, conclusion and APA references. They expand on the topics shown in the documentary.</p>
      <div class="bitacoras">
        <div class="bitacoras__head">
          <span class="bitacoras__label">Deliverable · 4 entries · APA format</span>
          <a class="bitacoras__dl" href="assets/docs/bitacoras-cientificas.docx" download>Download .docx</a>
        </div>
        <div class="bitacoras__grid">
          <article class="bitacora-card">
            <span class="bitacora-card__num">01</span>
            <h5 class="bitacora-card__title">Oxidación de Estructuras Metálicas</h5>
            <p class="bitacora-card__body">Iron reacting with oxygen and moisture: how corrosion forms reddish iron-oxide patches and weakens the metalwork observed on site.</p>
            <div class="bitacora-card__meta"><strong>3</strong> APA refs · Callister · Jones · Smith</div>
          </article>
          <article class="bitacora-card">
            <span class="bitacora-card__num">02</span>
            <h5 class="bitacora-card__title">Conservación de las Momias de Guanajuato</h5>
            <p class="bitacora-card__body">Natural mummification at the Santa Paula cemetery — low humidity, ventilation and mineral soil — and how the museum preserves the bodies today.</p>
            <div class="bitacora-card__meta"><strong>3</strong> APA refs · Museo · Tiesler · SECTUR</div>
          </article>
          <article class="bitacora-card">
            <span class="bitacora-card__num">03</span>
            <h5 class="bitacora-card__title">Biodiversidad Local</h5>
            <p class="bitacora-card__body">Plants, birds and insects of the regional ecosystem; pressures from pollution, deforestation and urban growth, with notes on conservation.</p>
            <div class="bitacora-card__meta"><strong>3</strong> APA refs · CONABIO · SEMARNAT · Odum</div>
          </article>
          <article class="bitacora-card">
            <span class="bitacora-card__num">04</span>
            <h5 class="bitacora-card__title">Minerales y Composición Química</h5>
            <p class="bitacora-card__body">Silicates, oxides, carbonates and sulfides — quartz, calcite and hematite — linked to the geology of the Sierra de Guanajuato and the silver mines.</p>
            <div class="bitacora-card__meta"><strong>2</strong> APA refs · Klein &amp; Dutrow · Tarbuck &amp; Lutgens</div>
          </article>
        </div>
      </div>
    `
  },

  /* ───── 02 Digital Tools ───── */
  {
    key: 'herramientas', num: '02', eyebrow: 'Subject · 2nd semester',
    title: 'Digital <em>Tools</em>',
    teacher: 'Prof. María Fernanda Rosas Mendoza',
    placeIds: [12],
    tagline: 'Interactive digital tourist guide',
    body: '<p>Build an interactive guide about Guanajuato integrating maps, routes, photographs, videos, recommendations, and QR codes linked to points of interest.</p>',
    tags: ['Digital guide', 'Maps + QR', 'Multimedia'],
    status: 'ready',
    content: `
      <h4>Proposal</h4>
      <p>This very website —the one you are browsing— is the deliverable interactive digital tourist guide. It meets every criterion of the rubric:</p>
      <ul>
        <li><strong>Tourist content:</strong> 12 historic sites described in detail.</li>
        <li><strong>Maps and routes:</strong> interactive Leaflet map with a polyline route connecting the stops.</li>
        <li><strong>Multimedia resources:</strong> 12 high-resolution images from Wikimedia Commons.</li>
        <li><strong>QR integration:</strong> deploying the site on GitHub Pages generates a QR for mobile access.</li>
        <li><strong>Digital design:</strong> editorial Anthropic-style typography (Newsreader + Inter), smooth animations, warm Mexican palette.</li>
        <li><strong>Writing &amp; communication:</strong> English text without errors, clear hierarchy.</li>
        <li><strong>Creativity &amp; innovation:</strong> built with Leaflet + OpenStreetMap, particles, marquees, magnetic buttons, scroll progress, custom cursor.</li>
      </ul>
      <h4>Tech stack</h4>
      <ul>
        <li>Semantic HTML5 · CSS3 with variables and grid · Vanilla JavaScript ES6+</li>
        <li>Leaflet 1.9.4 + CartoDB Voyager tiles</li>
        <li>Google Fonts (Newsreader, Inter, JetBrains Mono)</li>
        <li>Wikimedia Commons (Creative Commons imagery)</li>
        <li>Deployment: GitHub Pages</li>
      </ul>
    `
  },

  /* ───── 03 Multimedia Design ───── */
  {
    key: 'multimedia', num: '03', eyebrow: 'Subject · 2nd semester',
    title: 'Multimedia <em>Design</em>',
    teacher: 'Prof. Patricia Martínez',
    placeIds: [8, 7],
    tagline: 'Poster and photo-montage of the trip',
    body: '<p>Create a <strong>digital poster/banner</strong> and a <strong>creative photo-montage</strong> based on the experience of the trip. Evaluated criteria: composition, color, typography, creativity, editing, and command of Canva / Photoshop.</p>',
    tags: ['Digital poster', 'Photo-montage', 'Adobe / Canva'],
    status: 'ready',
    content: `
      <h4>Photo-montage poster</h4>
      <p>Vertical composition built around the great stone arch of Guanajuato, with framed insets of El Pípila, the Basilica of Valenciana, a walk through the historic center, the Plaza de Dolores and a portrait scene labelled <em>Mystical Stories</em>. The tagline <strong>"EXPLORE · CAPTURE · REMEMBER"</strong> ties the design to the trip's narrative.</p>
      <figure class="poster-figure">
        <img src="assets/img/cartel-multimedia.jpg" alt="Photo-montage poster — Unforgettable Journey Through Guanajuato" loading="lazy">
        <figcaption>Photo-montage · Unforgettable Journey Through Guanajuato</figcaption>
      </figure>
      <h4>Design choices</h4>
      <ul>
        <li><strong>Composition:</strong> a hero arch as background unifies the frame; smaller insets create visual rhythm.</li>
        <li><strong>Color:</strong> warm sandstone, ochres and a deep red accent — consistent with the Guanajuato palette of the site.</li>
        <li><strong>Typography:</strong> uppercase serif headings for monumentality, contrasted with a thin all-caps tagline.</li>
        <li><strong>Editing technique:</strong> isolated cut-outs with shaped frames, drop shadow, and a paper-texture base layer.</li>
      </ul>
    `
  },

  /* ───── 04 Physical Education ───── */
  {
    key: 'edfisica', num: '04', eyebrow: 'Subject · All semesters',
    title: 'Physical <em>Education</em>',
    teacher: 'Prof. Diana Olvera Antonio',
    placeIds: [4],
    tagline: 'Physical education in antiquity — The Ulama',
    body: '<p>Recreate a physical-education practice from an ancient civilization. The chosen practice: <strong>Ulama</strong>, the Mesoamerican ball game with more than 3,500 years of history.</p>',
    tags: ['Report 3–5 pages', 'Mesoamerican Ulama'],
    status: 'ready',
    content: `
      <h4>Location &amp; Historical Context</h4>
      <p>The <em>Ulama</em> is the oldest ritual and sporting game on the American continent. Practiced by the Olmecs, Maya, Zapotecs, Mixtecs, and Aztecs from around 1,500 BCE, it still survives today in some communities of the state of Sinaloa, Mexico.</p>
      <h4>Relevant Figures</h4>
      <p>In Maya mythology, the <em>Hero Twins</em> Hunahpú and Ixbalanqué descend to the underworld to play against the lords of Xibalbá. The game is therefore <strong>cosmogony and sport</strong> at the same time. Pre-Hispanic rulers would publicly display their skills.</p>
      <h4>Rules, Materials and Court</h4>
      <ul>
        <li><strong>Court:</strong> I-shaped, called <em>tlachtli</em>; sloped lateral walls.</li>
        <li><strong>Ball:</strong> solid rubber (Castilla elastica), 3–4 kg in weight, ~20 cm in diameter.</li>
        <li><strong>Teams:</strong> 2 to 5 players per side.</li>
        <li><strong>Modalities:</strong> <em>Hip Ulama</em> (the most widespread), <em>Forearm Ulama</em>, <em>Mallet Ulama</em>.</li>
        <li><strong>Goal:</strong> keep the ball in play striking it only with hip or forearm —not hands or feet— until the rival commits a fault.</li>
        <li><strong>Scoring:</strong> in the Maya version, passing the ball through a vertical stone ring gave instant victory.</li>
      </ul>
      <h4>Importance, Identity &amp; Reflection</h4>
      <p>The Ulama articulated <strong>religion, politics and physical exercise</strong>: it was a rain-bringing rite, a mechanism for resolving disputes between lordships, and martial training. Today it is considered intangible heritage. Compared to current sports, it shows that physical education is not only the body: it is cultural identity in motion.</p>
      <blockquote>"Where the ball lives, the memory of the people lives." — Reconstructed Nahuatl proverb.</blockquote>
    `
  },

  /* ───── 05 English ───── */
  {
    key: 'ingles', num: '05', eyebrow: 'Subject · All semesters',
    title: '<em>Exploring</em> Guanajuato',
    teacher: 'Prof. Valentín Hernández Salazar',
    placeIds: [5],
    tagline: 'STEAM project in English',
    body: '<p>STEAM-based product in <strong>English</strong>: poster, short video or model. Rubric of 24 points over 6 criteria.</p>',
    tags: ['Poster / Video', 'In English', '24 pts'],
    status: 'ready',
    content: `
      <h4>STEAM poster</h4>
      <figure class="poster-figure poster-figure--wide">
        <img src="assets/img/cartel-ingles.jpg" alt="STEAM poster — Unforgettable Journey Through Mexico" loading="lazy">
        <figcaption>Poster · Unforgettable Journey Through Mexico</figcaption>
      </figure>
      <h4>Exploring Guanajuato · A STEAM Journey</h4>
      <p><strong>Science · </strong> The mummies of Guanajuato, naturally preserved by the dry mineral-rich soil, teach us about <em>desiccation, halophilic bacteria</em>, and the chemistry of preservation. The silver mines around Valenciana show us the oxidation of metals and the geology of the Sierra de Guanajuato.</p>
      <p><strong>Technology · </strong> The underground tunnel network —once a drainage system for floods, now a road system— is a fascinating example of <em>hydraulic engineering</em>. The Hidalgo Market, with its iron structure imported from France, shows the technology transfer of the early 20th century.</p>
      <p><strong>Engineering · </strong> The Valenciana mine descends more than 500 meters underground. Its shaft, pumps, and ventilation system represent one of the most advanced mining engineering feats of the colonial era.</p>
      <p><strong>Arts · </strong> Baroque Churrigueresque architecture (Templo de la Compañía, Valenciana), the gold-leaf interiors, and the Cervantes Festival held in Teatro Juárez every October all show how Guanajuato lives <em>between past and present art</em>.</p>
      <p><strong>Mathematics · </strong> The labyrinthine layout of the historic center, the perfect cone of the Pípila viewpoint, and the geometric tiles inside the Basílica Colegiata are exercises in geometry and proportion.</p>
      <h4>Key vocabulary</h4>
      <p><em>silver mining</em> · <em>cobblestone alley</em> · <em>UNESCO World Heritage</em> · <em>colonial architecture</em> · <em>Baroque facade</em> · <em>underground tunnels</em> · <em>independence movement</em> · <em>mining shaft</em></p>
      <blockquote>"In Guanajuato, every stone tells a story that started 500 years ago and continues today."</blockquote>
    `
  },

  /* ───── 06 Humanities ───── */
  {
    key: 'humanidades', num: '06', eyebrow: 'Subject · All semesters',
    title: '<em>Humanities</em>',
    teacher: 'Prof. Omar Ávila Cruz',
    placeIds: [1, 3, 8],
    tagline: 'Preliminary research: figures and sites',
    body: '<p>Preliminary research on the figures and places of the Independence that will be visited: Don Miguel Hidalgo, Ignacio Allende, and the sites where the insurgent movement began.</p>',
    tags: ['Research', 'Independence', 'Digital submission'],
    status: 'ready',
    content: `
      <h4>Miguel Hidalgo y Costilla <span class="bio-dates">1753 — 1811</span></h4>
      <p>Priest and military leader, born on the Corralejo Estate, Pénjamo, Guanajuato. He was parish priest of Dolores from 1803, where he encouraged agricultural, industrial, and cultural activities forbidden by the Spanish Crown (pottery, vineyards, sericulture). At dawn on <strong>September 16, 1810</strong>, he rang the bells of the parish and gave the <em>Grito de Dolores</em>, calling the people to fight for independence. He led an insurgent army that took San Miguel el Grande, Celaya, and the Alhóndiga de Granaditas. He was captured at Acatita de Baján and executed in Chihuahua in 1811.</p>
      <h4>Ignacio Allende <span class="bio-dates">1769 — 1811</span></h4>
      <p>Creole military officer born in San Miguel el Grande (today San Miguel de Allende). Captain of the Queen\'s Regiment, he joined the Querétaro conspiracy and brought the military discipline the movement needed. He was a <strong>key strategist</strong> of the first campaigns. He was captured together with Hidalgo and executed in Chihuahua. His name today honors the city that saw him born.</p>
      <h4>The Grito de Dolores · September 16, 1810</h4>
      <p>In the early hours of that Sunday, Hidalgo summoned the people of Dolores with the ringing of bells. From the atrium of the <em>Parish of Our Lady of Sorrows</em>, he addressed the crowd with cheers for independence, for the Virgin of Guadalupe, and death to bad government. It is the founding act of the Mexican nation.</p>
      <h4>The Storming of the Alhóndiga de Granaditas · September 28, 1810</h4>
      <p>The old granary of the city of Guanajuato, a building of thick walls, became a royalist fortress. After hours of siege, the miner <strong>Juan José de los Reyes Martínez, "El Pípila"</strong>, tied a stone slab to his back and —protecting himself from the gunfire— set fire to the door. The fall of the Alhóndiga was the first great insurgent victory.</p>
      <h4>Historical Importance</h4>
      <p>The sites we will visit are not just monuments: they are <strong>the geographical origin of the nation</strong>. Walking through the square of Dolores, seeing the cell where Hidalgo was held, or stepping on the stairs where El Pípila fell, is to understand in a tangible way how Mexico was born.</p>
    `
  },

  /* ───── 07 Literature ───── */
  {
    key: 'literatura', num: '07', eyebrow: 'Subject · All semesters',
    title: 'Literature · <em>STEAM</em>',
    teacher: 'Prof. Omar Ávila Cruz · PBL "The Bison Route"',
    placeIds: [7],
    tagline: 'Legend of the Alley of the Kiss',
    body: '<p>Written production: legend, myth, chronicle, and script. As a preliminary deliverable, the <strong>most famous legend of Guanajuato</strong> is included: that of the Alley of the Kiss.</p>',
    tags: ['Written legend', 'Myth · Chronicle', 'PBL'],
    status: 'ready',
    content: `
      <h4 class="legend-head">Legend of the Alley of the Kiss</h4>
      <p class="legend-prose">The elders of Guanajuato tell that, in an alley so narrow that two hands could meet from balcony to balcony, the beautiful <em>Doña Ana</em> lived centuries ago. Her father, a proud and wealthy man, had decided to marry her to a Spanish nobleman the young woman did not love.</p>
      <p class="legend-prose">Fate willed that Ana would fall in love with <em>Don Carlos</em>, a young miner who saw her praying at the Collegiate Basilica. Knowing of the father\'s rejection, Carlos bought —with all his savings— the house facing Ana\'s. The balconies stood just <strong>sixty-eight centimeters</strong> apart from each other: a distance that allowed only a furtive kiss, almost a secret.</p>
      <p class="legend-prose">The nights were made for them. Carmen —as she was also called— would take her beloved\'s hands through the railings, and the alley filled with promises. Until one night, the father climbed the stairs without warning. When he saw Carlos\'s face so close to his daughter\'s, fury overcame him. He took a dagger and pierced Ana\'s chest before she could even cry out.</p>
      <p class="legend-prose">Carlos, with Ana\'s last kiss still on his lips, sank into the mine and never came out again. They say he let himself die, hoping to meet her again in another world.</p>
      <p class="legend-prose">Since then, the couples who kiss on the <em>third step</em> of the alley are promised fifteen years of happiness. Those who do not… seven years of bad luck. And the eldest swear that, on full-moon nights, two voices can still be heard whispering in the wind between the balconies.</p>
      <h4>Associated Myth — El Pípila</h4>
      <p>Another legendary figure is <em>Juan José de los Reyes Martínez</em>, "El Pípila". Although his historical existence is documented, the myth has grown over the years: it is said that the stone slab tied to his back was so heavy that only a body blessed by the Virgin could carry it. Today his monument watches over the city from the hill, torch raised, reminding us that from the humblest the greatest heroes are born.</p>
      <h4>Structure for the Travel Chronicle</h4>
      <p>The chronicle to be submitted after the expedition will follow this structure:</p>
      <ul>
        <li><strong>Sensory opening</strong> — the first impact upon arriving at Dolores Hidalgo</li>
        <li><strong>Narrative axis</strong> — the chronological tour of the 12 sites</li>
        <li><strong>Personal voice</strong> — reflections and links to what was learned in class</li>
        <li><strong>Closing</strong> — a single image that captures the experience</li>
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

/* ============= INJECT PLACE SECTIONS (NEW) ============= */
(function injectPlaces() {
  const wrap = document.getElementById('placeSections');
  if (!wrap) return;
  wrap.innerHTML = PLACES.map(p => {
    const t = p.ticket;
    const bookingHtml = t ? `
      <div class="place-card__booking">
        <div class="place-card__booking-head">
          <h5>Booking &amp; Tickets</h5>
          <span class="mono">Scan or tap</span>
        </div>
        <div class="place-card__booking-row">
          <a class="place-card__qr" href="${t.url}" target="_blank" rel="noopener" aria-label="Open official site for ${p.name}">
            <img src="${qrUrl(t.url, 220)}" alt="QR code to ${t.operator}" loading="lazy" width="120" height="120">
          </a>
          <div class="place-card__booking-info">
            <span class="place-card__booking-operator">${t.operator}</span>
            <span class="place-card__booking-note">${t.note}</span>
            <a class="place-card__booking-link" href="${t.url}" target="_blank" rel="noopener">
              <span>Open official site</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
            </a>
          </div>
        </div>
      </div>
    ` : '';
    return `
    <article class="place-card rv" id="place-${p.id}" data-place-card="${p.id}">
      <div class="place-card__media">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="place-card__num">${p.num}</span>
        <span class="place-card__city mono">${p.city}</span>
      </div>
      <div class="place-card__body">
        <h3 class="place-card__title">${p.name}</h3>
        <p class="place-card__sub"><em>${p.nameEn}</em></p>
        <p class="place-card__short">${p.short}</p>
        <details class="place-card__more">
          <summary>
            <span class="summary-text">Read history</span>
            <span class="summary-icon" aria-hidden="true">+</span>
          </summary>
          <div class="place-card__deep">
            <p>${p.history}</p>
            <h5>Highlights</h5>
            <ul>
              ${p.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
            ${bookingHtml}
          </div>
        </details>
        <button class="place-card__locate" type="button" data-locate-place="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-7-7.58-7-13a7 7 0 0 1 14 0c0 5.42-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <span>Locate on map</span>
        </button>
      </div>
    </article>`;
  }).join('');
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
    <article class="subject rv" id="subj-${s.key}" data-subject="${s.key}" data-subject-num="${s.num}" data-status="${s.status}">
      <div class="subject__media" data-tilt>
        <div class="subject__media-inner">
          <img src="${primary.img}" alt="${primary.name}" loading="lazy">
        </div>
        <div class="subject__media-tag">${s.num} · ${primary.name}</div>
        <div class="subject__media-placeholder">${ready ? 'Content available · photos from the trip' : 'Pending deliverable'}</div>
      </div>
      <div class="subject__body">
        <div class="subject__head">
          <span class="subject__num">${s.num}</span>
          <span class="subject__eyebrow">${s.eyebrow}</span>
          <span class="status-badge status-badge--${s.status}">${ready ? '● Ready' : '○ Pending'}</span>
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
              <span class="summary-text">Content</span>
              <span class="summary-icon" aria-hidden="true">+</span>
            </summary>
            <div class="subject__content-inner">
              ${s.content}
            </div>
          </details>
        ` : ''}
        <div class="subject__actions">
          <button class="subject__cta" data-subject="${s.key}" data-magnetic>
            <span>View full rubric</span>
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
let routeLines = { dolores: null, gto: null, link: null };
let visitedIds = new Set();
let currentFilter = 'all';
let activeId = null;

function initMap() {
  if (typeof L === 'undefined') return;
  const mapEl = document.getElementById('leafletMap');
  if (!mapEl) return;
  map = L.map('leafletMap', {
    minZoom: 9, maxZoom: 18,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: false
  });

  const bounds = L.latLngBounds(PLACES.map(p => p.coords)).pad(0.15);
  map.fitBounds(bounds);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 19
  }).addTo(map);

  map.getContainer().addEventListener('mouseenter', () => map.scrollWheelZoom.enable());
  map.getContainer().addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

  const doloresCoords = PLACES.filter(p => p.city === 'Dolores Hidalgo').map(p => p.coords);
  const guanajuatoCoords = PLACES.filter(p => p.city === 'Guanajuato').map(p => p.coords);

  if (doloresCoords.length > 1) {
    routeLines.dolores = L.polyline(doloresCoords, { color: '#C49A3C', weight: 2.5, opacity: 0.85, smoothFactor: 1.2, className: 'route-line route-line--dolores' }).addTo(map);
  }
  if (guanajuatoCoords.length > 1) {
    routeLines.gto = L.polyline(guanajuatoCoords, { color: '#E05835', weight: 2.5, opacity: 0.85, smoothFactor: 1.2, className: 'route-line route-line--gto' }).addTo(map);
  }
  routeLines.link = L.polyline([doloresCoords[doloresCoords.length - 1], guanajuatoCoords[0]], {
    color: '#4A4642', weight: 1.5, opacity: 0.5, dashArray: '2 8', smoothFactor: 1, className: 'route-line route-line--link'
  }).addTo(map);

  // Pre-set the solid routes to the "undrawn" state for the draw-in animation
  // (the dashed link line is not animated so its dotted pattern is preserved).
  setTimeout(() => {
    [routeLines.dolores, routeLines.gto].forEach(line => {
      if (!line) return;
      const path = line._path;
      if (!path) return;
      try {
        const len = path.getTotalLength();
        path.style.transition = 'none';
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      } catch (e) { /* noop */ }
    });
    if (routeLines.link?._path) {
      routeLines.link._path.style.opacity = '0';
      routeLines.link._path.style.transition = 'opacity 1.2s ease 1.6s';
    }
  }, 0);

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
        <div class="popup-desc">${p.short}</div>
        <span class="popup-link" data-place="${p.id}">Read history →</span>
      </div>`;
    marker.bindPopup(popup, { offset: [0, -8], closeButton: false, maxWidth: 320, autoPanPadding: [60, 60] });

    marker.on('click', () => {
      setActive(p.id);
      marker.openPopup();
      map.flyTo(p.coords, Math.max(map.getZoom(), 15), { duration: 1 });
      burstConfettiAtMarker(p.id);
    });

    markers[p.id] = marker;
  });
}

/* ============= CONFETTI BURST AT MARKER ============= */
function burstConfettiAtMarker(id) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pin = document.querySelector(`.leaflet-marker-pin[data-id="${id}"]`);
  if (!pin) return;
  const old = pin.querySelector('.confetti-burst');
  if (old) old.remove();
  const burst = document.createElement('div');
  burst.className = 'confetti-burst';
  burst.innerHTML = '<i></i>'.repeat(12);
  pin.appendChild(burst);
  setTimeout(() => burst.remove(), 1000);
}

function setActive(id) {
  activeId = id;
  document.querySelectorAll('.map-list-item').forEach(el => {
    el.classList.toggle('is-active', +el.dataset.place === id);
  });
  document.querySelectorAll('.leaflet-marker-pin').forEach(el => {
    el.classList.toggle('is-active', +el.dataset.id === id);
  });
  if (id != null) {
    visitedIds.add(id);
    updateActiveCard(id);
    updateNavProgress();
  }
}

function resetMap() {
  if (!map) return;
  const bounds = L.latLngBounds(PLACES.map(p => p.coords)).pad(0.15);
  map.flyToBounds(bounds, { duration: 1.2 });
  document.querySelectorAll('.map-list-item').forEach(el => el.classList.remove('is-active'));
  document.querySelectorAll('.leaflet-marker-pin').forEach(el => el.classList.remove('is-active'));
  clearActiveCard();
  activeId = null;
}

document.addEventListener('click', e => {
  const popupLink = e.target.closest('.popup-link');
  if (popupLink) {
    const placeId = +popupLink.getAttribute('data-place');
    const target = document.getElementById('place-' + placeId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const details = target.querySelector('details');
      if (details) details.open = true;
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
  const locateBtn = e.target.closest('[data-locate-place]');
  if (locateBtn) {
    const id = +locateBtn.getAttribute('data-locate-place');
    const p = placeById(id);
    if (p && map) {
      document.getElementById('map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        setActive(id);
        map.flyTo(p.coords, 16, { duration: 1.1 });
        setTimeout(() => markers[id]?.openPopup(), 500);
      }, 600);
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

/* ============= HERO PARALLAX (scroll) ============= */
const heroImg = document.getElementById('heroImg');
window.addEventListener('scroll', () => {
  if (!heroImg) return;
  const y = window.scrollY;
  if (y < window.innerHeight * 1.4) {
    heroImg.style.transform = `translate3d(0, ${y * 0.16}px, 0) scale(${1 + y * 0.00018})`;
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

/* ============= CARD TILT (place-cards + gallery) ============= */
function setupCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.place-card, .gal').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
      el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
      el.classList.add('is-tilting');
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.classList.remove('is-tilting');
    });
  });
}

/* ============= HERO PARALLAX (mouse-driven 3D) ============= */
function setupHeroParallax() {
  if (window.matchMedia('(hover: none) or (prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  let raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width  - 0.5);
    ty = ((e.clientY - r.top)  / r.height - 0.5);
    if (!raf) raf = requestAnimationFrame(tick);
  });
  hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
  function tick() {
    cx += (tx - cx) * 0.07;
    cy += (ty - cy) * 0.07;
    const frame   = hero.querySelector('.hero__frame');
    const content = hero.querySelector('.hero__content');
    const stamp   = hero.querySelector('.hero__stamp');
    if (frame)   frame.style.transform   = `perspective(1400px) rotateY(${-8 + cx * 5}deg) rotateX(${3 + cy * -3}deg)`;
    if (content) content.style.transform = `translate3d(${cx * 7}px, ${cy * 4}px, 0)`;
    if (stamp)   stamp.style.transform   = `translate3d(${cx * 16}px, ${cy * 10}px, 0) rotate(-12deg)`;
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }
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
  const hovers = 'a, button, [data-magnetic], .map-list-item, .gal, .subject__cta, .place-card__locate, .leaflet-marker-pin, details summary';
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

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { map?.invalidateSize(); }, 200);
});

/* ============= ROUTE DRAW ANIMATION ============= */
function animateRouteDraw() {
  const lines = [routeLines.dolores, routeLines.gto].filter(Boolean);
  lines.forEach((line, i) => {
    const path = line._path;
    if (!path) return;
    try {
      path.style.transition = `stroke-dashoffset 1.8s cubic-bezier(.2,.7,0,1) ${i * 0.6}s`;
      void path.getBoundingClientRect();
      path.style.strokeDashoffset = '0';
    } catch (err) { /* noop */ }
  });
  if (routeLines.link?._path) {
    routeLines.link._path.style.opacity = '';
  }
}

function setupRouteDrawOnView() {
  const sec = document.getElementById('map');
  if (!sec) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(animateRouteDraw, 250);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  io.observe(sec);
}

/* ============= DISTANCE (Haversine, km) ============= */
function haversineKm(a, b) {
  const toRad = (d) => d * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]), lat2 = toRad(b[0]);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ============= ACTIVE CARD ============= */
const activeCard = document.getElementById('mapActiveCard');
const activeCardImg = document.getElementById('activeCardImg');
const activeCardNum = document.getElementById('activeCardNum');
const activeCardCity = document.getElementById('activeCardCity');
const activeCardTitle = document.getElementById('activeCardTitle');
const activeCardDesc = document.getElementById('activeCardDesc');
const activeCardDist = document.getElementById('activeCardDist');
const activeCardCta = document.getElementById('activeCardCta');
const activeCardClose = document.getElementById('activeCardClose');

function updateActiveCard(id) {
  if (!activeCard) return;
  const p = placeById(id);
  if (!p) return;
  activeCardImg.src = p.img;
  activeCardImg.alt = p.name;
  activeCardNum.textContent = p.num;
  activeCardCity.textContent = p.cityShort;
  activeCardTitle.textContent = p.name;
  activeCardDesc.textContent = p.short;

  const idx = PLACES.findIndex(x => x.id === id);
  const next = PLACES[idx + 1];
  if (next) {
    const km = haversineKm(p.coords, next.coords);
    const lbl = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
    activeCardDist.textContent = `→ next · ${lbl} · ${next.name}`;
    activeCardDist.style.visibility = 'visible';
  } else {
    activeCardDist.textContent = '✦ last stop';
    activeCardDist.style.visibility = 'visible';
  }

  activeCardCta.dataset.placeId = String(p.id);
  activeCardCta.style.display = '';

  activeCard.classList.add('is-open');
  activeCard.setAttribute('aria-hidden', 'false');
}

function clearActiveCard() {
  if (!activeCard) return;
  activeCard.classList.remove('is-open');
  activeCard.setAttribute('aria-hidden', 'true');
}

activeCardClose?.addEventListener('click', clearActiveCard);
activeCardCta?.addEventListener('click', () => {
  const placeId = +(activeCardCta.dataset.placeId || 0);
  if (!placeId) return;
  const target = document.getElementById('place-' + placeId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const details = target.querySelector('details');
    if (details) details.open = true;
  }
});

/* ============= FILTER CHIPS ============= */
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.chip').forEach(btn => {
    const on = btn.dataset.filter === filter;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', String(on));
  });
  let visible = 0;
  PLACES.forEach(p => {
    const show = filter === 'all' || p.city === filter;
    const m = markers[p.id];
    if (!m) return;
    if (show) {
      if (!map.hasLayer(m)) m.addTo(map);
      visible++;
    } else {
      if (map.hasLayer(m)) map.removeLayer(m);
    }
    const li = document.querySelector(`.map-list-item[data-place="${p.id}"]`);
    if (li) li.style.display = show ? '' : 'none';
  });

  if (routeLines.dolores) {
    const showD = filter === 'all' || filter === 'Dolores Hidalgo';
    showD ? (map.hasLayer(routeLines.dolores) || routeLines.dolores.addTo(map)) : map.removeLayer(routeLines.dolores);
  }
  if (routeLines.gto) {
    const showG = filter === 'all' || filter === 'Guanajuato';
    showG ? (map.hasLayer(routeLines.gto) || routeLines.gto.addTo(map)) : map.removeLayer(routeLines.gto);
  }
  if (routeLines.link) {
    filter === 'all'
      ? (map.hasLayer(routeLines.link) || routeLines.link.addTo(map))
      : map.removeLayer(routeLines.link);
  }

  document.getElementById('mapSidebarCount').textContent = visible;

  const visiblePlaces = PLACES.filter(p => filter === 'all' || p.city === filter);
  if (visiblePlaces.length) {
    const b = L.latLngBounds(visiblePlaces.map(p => p.coords)).pad(0.18);
    map.flyToBounds(b, { duration: 0.9 });
  }
}

document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

/* ============= HOVER PREVIEW (SIDEBAR) ============= */
function setupSidebarHoverPreview() {
  document.querySelectorAll('.map-list-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const id = +el.dataset.place;
      const pin = document.querySelector(`.leaflet-marker-pin[data-id="${id}"]`);
      pin?.classList.add('is-bounce');
      updateActiveCard(id);
    });
    el.addEventListener('mouseleave', () => {
      const id = +el.dataset.place;
      const pin = document.querySelector(`.leaflet-marker-pin[data-id="${id}"]`);
      pin?.classList.remove('is-bounce');
      if (activeId !== id) {
        if (activeId) updateActiveCard(activeId);
        else clearActiveCard();
      }
    });
  });
}

/* ============= PLACE SCROLL SYNC ============= */
function setupPlaceScrollSync() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = +(e.target.dataset.placeCard || 0);
      if (id) {
        visitedIds.add(id);
        updateNavProgress();
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.place-card').forEach(s => io.observe(s));
}

/* ============= NAV PROGRESS RING ============= */
function updateNavProgress() {
  const ring = document.getElementById('navProgressFg');
  const num = document.getElementById('navProgressNum');
  const wrap = document.getElementById('navProgress');
  if (!ring || !num) return;
  const total = PLACES.length;
  const count = Math.min(visitedIds.size, total);
  const r = 15.9;
  const C = 2 * Math.PI * r;
  ring.style.strokeDasharray = C;
  ring.style.strokeDashoffset = C - (count / total) * C;
  num.textContent = count;
  wrap?.classList.toggle('is-on', count > 0);
  if (count === total) wrap?.classList.add('is-complete');
}

/* ============= HERO 3D CANVAS (constellation particles) ============= */
function initHero3D() {
  const canvas = document.getElementById('hero3d');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Palette weighted: gold 55%, coral 25%, cream 20%
  const palette = [
    [184,133, 53],[184,133, 53],[184,133, 53],
    [201, 67, 28],[201, 67, 28],
    [235,228,216],[235,228,216],
  ];
  const N    = 110;
  const LINK = 165;

  const pts = Array.from({ length: N }, () => {
    const z   = 0.28 + Math.random() * 0.72;
    const col = palette[Math.floor(Math.random() * palette.length)];
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      z,
      vx: (Math.random() - 0.5) * 0.20 * z,
      vy: (Math.random() - 0.5) * 0.20 * z,
      r:  0.5 + z * 2.8,
      a:  0.07 + z * 0.40,
      col,
    };
  });

  let mx = -9999, my = -9999;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  let running = true;
  let animId  = null;

  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    const obs = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running && !animId) tick();
    });
    obs.observe(heroEl);
  }

  function tick() {
    animId = requestAnimationFrame(tick);
    if (!running) { cancelAnimationFrame(animId); animId = null; return; }

    ctx.clearRect(0, 0, W, H);

    // Draw constellation lines
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.09;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(184,133,53,${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    pts.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mx, dy = p.y - my;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 200 && d > 0.1) {
        const f = (1 - d / 200) * 0.004 * p.z;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
      p.vx *= 0.978;
      p.vy *= 0.978;
      p.x   = ((p.x + p.vx) + W) % W;
      p.y   = ((p.y + p.vy) + H) % H;

      const [r, g, b] = p.col;
      // Soft glow
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5.5);
      grd.addColorStop(0, `rgba(${r},${g},${b},${p.a * 0.65})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      // Hard core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(p.a * 2, 0.92)})`;
      ctx.fill();
    });
  }

  tick();
}

/* ============= INIT ============= */
document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initMap();
  triggerReveals();
  animateCounters();
  setupMagnetic();
  setupTilt();
  setupCardTilt();
  setupHeroParallax();
  setupCursor();
  setupRouteDrawOnView();
  setupSidebarHoverPreview();
  setupPlaceScrollSync();
  updateNavProgress();
});
