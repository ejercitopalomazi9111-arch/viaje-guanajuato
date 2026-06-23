/* =========================================================
   JOURNEY TO GUANAJUATO · shared itinerary data
   Extracted from main.js so feria.html can reuse it.
   Exposes window.PLACES_DATA (English primary; ES in i18n.js).
   ========================================================= */
window.PLACES_DATA = [
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
    history: 'Inaugurated in 1939, this 28-metre pink-quarry statue honours <strong>Juan José de los Reyes Martínez, "El Pípila"</strong>, the young miner who —tying a flat stone to his back as a shield— set fire to the wooden door of the Alhóndiga de Granaditas, allowing the insurgents to take the building. The monument bears the inscription <em>"Aún hay otras Alhóndigas por incendiar"</em> ("There are still other Alhóndigas to burn"). From its base, the entire historic centre unfolds below.',
    highlights: ['28-metre monumental statue', 'Best panoramic view of Guanajuato', 'Accessible by funicular or stairway', 'Famous historical inscription on the pedestal'],
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
    short: 'Historic wrought-iron market opened in 1910 — gastronomy, crafts, and colour.',
    history: 'Inaugurated on September 16, 1910 to celebrate the centennial of the Independence, this market was built with a metal structure imported from <strong>France</strong> —the same style as the Eiffel Tower— and was originally planned as a railway station. Its 16-metre-high central clock and its mezzanine floor of artisan stalls make it one of the most photographed civic buildings in the state.',
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
    history: 'Discovered in 1768 by Antonio Obregón y Alcocer, this mine became the largest silver producer in colonial New Spain —at its peak it produced two-thirds of all the silver in the world. The main shaft, the <em>Tiro de San Cayetano</em>, descends more than 500 metres. Next to it stands the <strong>Templo de San Cayetano</strong>, a Churrigueresque jewel financed entirely with the mine\'s silver, with three altarpieces covered in 23-karat gold leaf.',
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
  },
  {
    id: 13, num: '12', name: 'Casa de la Tía Aura',
    nameEn: 'House of Aunt Aura',
    city: 'Guanajuato', cityShort: 'Guanajuato',
    coords: [21.0089, -101.2480], img: 'assets/img/gto-tia-aura.jpg',
    short: 'A 19th-century mansion turned living museum of legend, mystery, and the Inquisition.',
    history: 'On the elegant <em>Paseo de la Presa</em>, this 19th-century mansion is the setting of one of Guanajuato\'s most famous legends. Around 1840, <strong>Aura</strong>, a wealthy and joyful woman from Cádiz, Spain, came to live in the house built by her ancestors. Her sudden death opened a chain of dark events: her eldest daughter Cristina was walled up alive for a forbidden love, and her youngest, Carlota, was murdered by her own husband. Reopened as a museum on April 2, 1999, it now holds eight rooms that recreate the tragedy and exhibit the punishments of the Inquisition era.',
    highlights: ['Authentic 19th-century mansion on Paseo de la Presa', 'Eight themed rooms with scenic ambience', 'Legend of Aura, Cristina and Carlota', 'Replicas of Inquisition-era instruments'],
    ticket: {
      url: 'https://guanajuato.mx/en/blog/experiences/la-casa-de-la-tia-aura-an-unforgettable-experience-in-guanajuato/',
      operator: 'Museo Casa de la Tía Aura · Paseo de la Presa 62',
      note: 'Daily tours · evening sessions recommended · ticket at the door'
    }
  },
  {
    id: 14, num: '13', name: 'Ex-Hacienda del Cochero',
    nameEn: 'Former Cochero Estate',
    city: 'Guanajuato', cityShort: 'Guanajuato',
    coords: [21.0411, -101.2456], img: 'assets/img/gto-cochero.jpg',
    short: 'A 1692 mining estate that hid a secret Inquisition dungeon — today a museum of torture and legend.',
    history: 'Built in <strong>1692</strong> by order of the Marqués de Rayas to process ore from the nearby mines, this stone estate on the road to Dolores held a chilling secret. Around 1764 it began to serve as a clandestine prison: the Marqués, a friend of the inquisitor Fernando de Miera, allowed those accused of <em>blasphemy, heresy and sorcery</em> to be brought here. In 1954 the landowner Manuel Valenzuela uncovered a hidden cell block and a small cemetery with human remains and torture devices. Opened to the public in 2000, the museum is led by guides dressed as monks.',
    highlights: ['17th-century mining estate in masonry stone', 'Hidden Inquisition dungeon discovered in 1954', 'Original torture instruments on display', 'Guided tours with costumed monks'],
    ticket: {
      url: 'https://guanajuato.travel/spot/museo-ex-hacienda-del-cochero/',
      operator: 'Museo Ex-Hacienda del Cochero · Carretera a Dolores, Valenciana',
      note: 'Mon–Sun 10–19h · guided tours · ticket at the door'
    }
  }
];
