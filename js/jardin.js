/* =========================================================
   JOURNEY TO GUANAJUATO · JARDÍN (school herb garden)
   Six medicinal/culinary herbs watered by greywater from a
   handwashing sink. Bilingual (ES/EN), shared lang toggle.
   ========================================================= */
(function () {
  'use strict';

  const UI = {
    es: {
      kicker: 'Feria de Ciencias · Jardín sustentable',
      title: 'El jardín que riegas<br>al <em>lavarte las manos</em>.',
      lead: 'Un jardín de hierbas aromáticas conectado al desagüe de un lavabo: el agua con la que te lavas las manos no se desperdicia — viaja por una tubería y riega las plantas. Reutilización de aguas grises, hecha por estudiantes.',
      howTitle: '¿Cómo funciona?',
      steps: [
        ['Lavabo', 'Te lavas las manos con jabón biodegradable.'],
        ['Tubería', 'El agua (agua gris) baja por una tubería en lugar de ir al drenaje.'],
        ['Filtro', 'Pasa por un filtro simple que retiene residuos.'],
        ['Jardín', 'Riega las seis hierbas aromáticas del jardín escolar.']
      ],
      plantsTitle: 'Las seis hierbas',
      plantsLead: 'Aromáticas, medicinales y de cocina — resistentes y de bajo consumo de agua.',
      use: 'Usos', sci: 'Nombre científico',
      drop: 'Al lavarte las manos, riegas el jardín',
      backFair: 'Volver al recorrido', backMap: 'Ver mapa completo'
    },
    en: {
      kicker: 'Science Fair · Sustainable garden',
      title: 'The garden you water<br>by <em>washing your hands</em>.',
      lead: 'An aromatic herb garden connected to the drain of a handwashing sink: the water you wash your hands with is not wasted — it travels through a pipe and waters the plants. Greywater reuse, built by students.',
      howTitle: 'How does it work?',
      steps: [
        ['Sink', 'You wash your hands with biodegradable soap.'],
        ['Pipe', 'The water (greywater) flows down a pipe instead of going to the sewer.'],
        ['Filter', 'It passes through a simple filter that traps residue.'],
        ['Garden', 'It waters the six aromatic herbs of the school garden.']
      ],
      plantsTitle: 'The six herbs',
      plantsLead: 'Aromatic, medicinal and culinary — hardy and low water use.',
      use: 'Uses', sci: 'Scientific name',
      drop: 'Wash your hands, water the garden',
      backFair: 'Back to the tour', backMap: 'View full map'
    }
  };

  const PLANTS = [
    {
      img: 'assets/img/jardin/manzanilla.jpg', sci: 'Matricaria chamomilla',
      es: { name: 'Manzanilla', use: 'Infusión digestiva y relajante; calma la irritación de ojos y piel.',
            desc: 'De flores blancas con centro amarillo y aroma a manzana. Es de las hierbas medicinales más usadas en México.' },
      en: { name: 'Chamomile', use: 'Digestive and calming tea; soothes eye and skin irritation.',
            desc: 'White flowers with a yellow center and an apple-like scent. One of the most used medicinal herbs in Mexico.' }
    },
    {
      img: 'assets/img/jardin/tomillo.jpg', sci: 'Thymus vulgaris',
      es: { name: 'Tomillo', use: 'Condimento de guisos y caldos; infusión para la tos y la garganta.',
            desc: 'Arbusto pequeño y leñoso de hojas diminutas. Muy resistente a la sequía y al sol fuerte.' },
      en: { name: 'Thyme', use: 'Seasoning for stews and broths; tea for cough and sore throat.',
            desc: 'A small woody shrub with tiny leaves. Very resistant to drought and strong sun.' }
    },
    {
      img: 'assets/img/jardin/lavanda.jpg', sci: 'Lavandula angustifolia',
      es: { name: 'Lavanda', use: 'Aroma relajante; ayuda al sueño y ahuyenta insectos.',
            desc: 'Flores moradas en espiga con un perfume intenso. Atrae abejas y mariposas al jardín.' },
      en: { name: 'Lavender', use: 'Relaxing aroma; aids sleep and repels insects.',
            desc: 'Purple spike flowers with an intense perfume. Attracts bees and butterflies to the garden.' }
    },
    {
      img: 'assets/img/jardin/hierbabuena.jpg', sci: 'Mentha spicata',
      es: { name: 'Hierbabuena', use: 'Agua fresca y tés; condimenta sopas y guisos.',
            desc: 'De hojas verde brillante y sabor dulce y fresco. Crece rápido y necesita riego constante.' },
      en: { name: 'Spearmint', use: 'Cool drinks and teas; seasons soups and stews.',
            desc: 'Bright green leaves with a sweet, fresh taste. Grows fast and needs constant watering.' }
    },
    {
      img: 'assets/img/jardin/menta.jpg', sci: 'Mentha × piperita',
      es: { name: 'Menta', use: 'Infusión digestiva; sabor refrescante en postres y bebidas.',
            desc: 'Más intensa y mentolada que la hierbabuena. Es un híbrido natural de gran aroma.' },
      en: { name: 'Peppermint', use: 'Digestive tea; refreshing flavor in desserts and drinks.',
            desc: 'More intense and menthol-rich than spearmint. A natural hybrid with a strong aroma.' }
    },
    {
      img: 'assets/img/jardin/romero.jpg', sci: 'Salvia rosmarinus',
      es: { name: 'Romero', use: 'Condimento de carnes y papas; infusión para la circulación.',
            desc: 'Arbusto aromático de hojas como agujas y flores azules. Muy resistente; casi no necesita agua.' },
      en: { name: 'Rosemary', use: 'Seasoning for meats and potatoes; tea for circulation.',
            desc: 'Aromatic shrub with needle-like leaves and blue flowers. Very hardy; needs little water.' }
    }
  ];

  let LANG = (localStorage.getItem('viaje_lang') === 'es') ? 'es' : 'en';
  const t = k => UI[LANG][k];

  function render() {
    document.documentElement.lang = LANG;
    document.getElementById('jd-kicker').textContent = t('kicker');
    document.getElementById('jd-title').innerHTML = t('title');
    document.getElementById('jd-lead').textContent = t('lead');
    document.getElementById('jd-how-title').textContent = t('howTitle');
    document.getElementById('jd-plants-title').textContent = t('plantsTitle');
    document.getElementById('jd-plants-lead').textContent = t('plantsLead');
    document.getElementById('jd-drop-lbl').textContent = t('drop');
    document.getElementById('jd-back-fair').textContent = t('backFair');
    document.getElementById('jd-back-map').textContent = t('backMap');

    // Steps
    document.getElementById('jd-steps').innerHTML = t('steps').map((s, i) => `
      <li class="jd-step" data-anim>
        <span class="jd-step__n">${i + 1}</span>
        <div><strong>${s[0]}</strong><span>${s[1]}</span></div>
      </li>`).join('');

    // Plants
    document.getElementById('jd-grid').innerHTML = PLANTS.map(p => {
      const L = p[LANG];
      return `
      <article class="jd-card" data-anim>
        <div class="jd-card__img"><img src="${p.img}" alt="${L.name}" loading="lazy"></div>
        <div class="jd-card__body">
          <h3>${L.name}</h3>
          <p class="jd-card__sci">${t('sci')}: <em>${p.sci}</em></p>
          <p class="jd-card__desc">${L.desc}</p>
          <p class="jd-card__use"><strong>${t('use')}:</strong> ${L.use}</p>
        </div>
      </article>`;
    }).join('');

    const lt = document.getElementById('jd-lang');
    if (lt) lt.querySelector('span').textContent = LANG === 'es' ? 'EN' : 'ES';

    animateIn();
  }

  function animateIn() {
    if (typeof anime === 'undefined') return;
    anime({
      targets: '[data-anim]', translateY: [24, 0], opacity: [0, 1],
      delay: anime.stagger(60, { start: 80 }), duration: 640,
      easing: 'cubicBezier(.16,1,.3,1)'
    });
    runDrop();
  }

  /* Water drop travelling sink -> pipe -> garden, looping */
  function runDrop() {
    const drop = document.getElementById('jd-drop');
    const path = document.getElementById('jd-flow');
    if (!drop || !path || typeof anime === 'undefined') return;
    const len = path.getTotalLength ? path.getTotalLength() : 0;
    // animate dash to "fill" the pipe
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    anime({ targets: path, strokeDashoffset: [len, 0], duration: 2600, easing: 'easeInOutSine', loop: true });
    // move the drop along the path
    anime({
      targets: drop, loop: true, duration: 2600, easing: 'easeInOutSine',
      keyframes: pointsAlong(path, 24).map(pt => ({ translateX: pt.x, translateY: pt.y, opacity: 1 }))
    });
  }
  function pointsAlong(path, n) {
    const out = []; const len = path.getTotalLength();
    for (let i = 0; i <= n; i++) { const pt = path.getPointAtLength((len * i) / n); out.push({ x: pt.x, y: pt.y }); }
    return out;
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    const lt = document.getElementById('jd-lang');
    if (lt) lt.addEventListener('click', () => {
      LANG = (LANG === 'es') ? 'en' : 'es';
      localStorage.setItem('viaje_lang', LANG);
      render();
    });
  });
})();
