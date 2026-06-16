/* =========================================================
   JOURNEY TO GUANAJUATO · FERIA (science-fair kiosk)
   Mobile-first page opened from the QR next to each model.
   Reuses window.PLACES_DATA (en) + window.ES_PLACES (es) +
   the shared language toggle (localStorage 'viaje_lang').
   ========================================================= */
(function () {
  'use strict';

  /* ---- Fair route: order in which "→ next destination" walks the stops.
     `maqueta:true` stops are the physical models with an orbital video.    */
  const FERIA_ORDER = [
    { id: 10, slug: 'mina',   maqueta: true,  video: 'assets/video/maqueta-mina.mp4'   },
    { id: 11, slug: 'universidad' },
    { id: 12, slug: 'teatro' },
    { id: 7,  slug: 'basilica' },
    { id: 8,  slug: 'alhondiga' },
    { id: 9,  slug: 'mercado' },
    { id: 13, slug: 'tia-aura' },
    { id: 14, slug: 'cochero' },
    { id: 1,  slug: 'parroquia' },
    { id: 2,  slug: 'carcel' },
    { id: 3,  slug: 'casa-hidalgo' },
    { id: 4,  slug: 'plaza' },
    { id: 5,  slug: 'pipila', maqueta: true,  video: 'assets/video/maqueta-pipila.mp4' }
  ];

  /* ---- UI strings (ES/EN) for the fair-only labels ---- */
  const FERIA_UI = {
    es: {
      kicker: 'Feria de Ciencias · Recorrido virtual',
      maqueta: 'Maqueta física · vista orbital',
      virtual: 'Recorrido virtual · sin maqueta',
      videoSoon: 'Video próximamente',
      videoSoonSub: 'El video orbital de esta maqueta se publicará pronto.',
      highlights: 'Lo destacado',
      next: 'Siguiente destino',
      prev: 'Anterior',
      stop: 'Parada',
      of: 'de',
      mapLink: 'Ver mapa completo',
      gardenLink: 'Ver el jardín',
      end: 'Fin del recorrido',
      endSub: '¡Gracias por recorrer la expedición!',
      official: 'Sitio oficial'
    },
    en: {
      kicker: 'Science Fair · Virtual tour',
      maqueta: 'Physical model · orbital view',
      virtual: 'Virtual tour · no model',
      videoSoon: 'Video coming soon',
      videoSoonSub: 'The orbital video of this model will be published soon.',
      highlights: 'Highlights',
      next: 'Next destination',
      prev: 'Previous',
      stop: 'Stop',
      of: 'of',
      mapLink: 'View full map',
      gardenLink: 'See the garden',
      end: 'End of the tour',
      endSub: 'Thank you for exploring the expedition!',
      official: 'Official site'
    }
  };

  /* ---- Language (shared with the rest of the site) ---- */
  let LANG = (localStorage.getItem('viaje_lang') === 'es') ? 'es' : 'en';
  const PLACES = window.PLACES_DATA || [];
  const ES_P = window.ES_PLACES || {};

  const byId = id => PLACES.find(p => p.id === id);
  const ph = (p, f) => (LANG === 'es' && ES_P[p.id] && ES_P[p.id][f] != null) ? ES_P[p.id][f] : p[f];
  const pnote = p => (LANG === 'es' && ES_P[p.id] && ES_P[p.id].note != null)
    ? ES_P[p.id].note : (p.ticket && p.ticket.note);
  const t = k => (FERIA_UI[LANG] && FERIA_UI[LANG][k] != null) ? FERIA_UI[LANG][k] : FERIA_UI.en[k];

  /* ---- Which stop are we on? from ?stop=slug | ?id=10 | ?i=0 ---- */
  function resolveIndex() {
    const q = new URLSearchParams(location.search);
    const slug = q.get('stop');
    const id = q.get('id');
    const i = q.get('i');
    if (slug != null) {
      const k = FERIA_ORDER.findIndex(s => s.slug === slug.toLowerCase());
      if (k >= 0) return k;
    }
    if (id != null) {
      const k = FERIA_ORDER.findIndex(s => String(s.id) === id);
      if (k >= 0) return k;
    }
    if (i != null && FERIA_ORDER[+i]) return +i;
    return 0; // default: first model (mina)
  }

  let idx = resolveIndex();

  /* ---- Render one stop ---- */
  function render() {
    const step = FERIA_ORDER[idx];
    const p = byId(step.id);
    if (!p) return;

    const total = FERIA_ORDER.length;
    const isLast = idx === total - 1;
    const isFirst = idx === 0;

    // Media block
    let media;
    if (step.maqueta) {
      media = `
        <div class="fr-media fr-media--video">
          <video class="fr-video" playsinline muted loop autoplay preload="metadata"
                 poster="${p.img}">
            <source src="${step.video}" type="video/mp4">
          </video>
          <div class="fr-video-soon" hidden>
            <img src="${p.img}" alt="${p.name}">
            <div class="fr-video-soon__panel">
              <span class="fr-video-soon__spin"></span>
              <strong>${t('videoSoon')}</strong>
              <span>${t('videoSoonSub')}</span>
            </div>
          </div>
          <span class="fr-tag fr-tag--maqueta">${t('maqueta')}</span>
        </div>`;
    } else {
      media = `
        <div class="fr-media fr-media--photo">
          <img class="fr-photo" src="${p.img}" alt="${p.name}" loading="eager">
          <span class="fr-tag">${t('virtual')}</span>
        </div>`;
    }

    const ticketUrl = p.ticket && p.ticket.url;
    const note = pnote(p);

    const html = `
      <article class="fr-card" data-anim>
        <header class="fr-head" data-anim>
          <span class="fr-num">${p.num}</span>
          <div>
            <h1 class="fr-name">${p.name}</h1>
            <p class="fr-name-en">${p.nameEn}</p>
            <p class="fr-city">${p.cityShort}</p>
          </div>
        </header>

        <div data-anim>${media}</div>

        <p class="fr-short" data-anim>${ph(p, 'short')}</p>
        <div class="fr-history" data-anim>${ph(p, 'history')}</div>

        <div class="fr-hl" data-anim>
          <h2>${t('highlights')}</h2>
          <ul>${(ph(p, 'highlights') || []).map(h => `<li>${h}</li>`).join('')}</ul>
        </div>

        ${note ? `<p class="fr-note" data-anim>${ticketUrl
            ? `<a href="${ticketUrl}" target="_blank" rel="noopener">${t('official')} ↗</a> · ` : ''}${note}</p>` : ''}
      </article>`;

    document.getElementById('fr-stage').innerHTML = html;

    // Progress + nav
    document.getElementById('fr-progress-now').textContent = idx + 1;
    document.getElementById('fr-progress-total').textContent = total;
    document.getElementById('fr-stop-lbl').textContent = t('stop');
    document.getElementById('fr-of').textContent = t('of');

    buildDots(total);

    const prevBtn = document.getElementById('fr-prev');
    const nextBtn = document.getElementById('fr-next');
    prevBtn.disabled = isFirst;
    prevBtn.querySelector('span').textContent = t('prev');

    if (isLast) {
      nextBtn.classList.add('is-end');
      nextBtn.querySelector('span').textContent = t('end');
    } else {
      nextBtn.classList.remove('is-end');
      nextBtn.querySelector('span').textContent = t('next');
    }

    // End panel links
    document.getElementById('fr-map-link').textContent = t('mapLink');
    document.getElementById('fr-garden-link').textContent = t('gardenLink');
    document.getElementById('fr-end-panel').hidden = !isLast;
    document.getElementById('fr-end-sub').textContent = t('endSub');

    // Video graceful fallback
    const vid = document.querySelector('.fr-video');
    if (vid) {
      const soon = document.querySelector('.fr-video-soon');
      const showSoon = () => { if (soon) soon.hidden = false; vid.style.display = 'none'; };
      vid.addEventListener('error', showSoon);
      vid.querySelector('source').addEventListener('error', showSoon);
      // If the file is missing, browsers fire error on the source; double-check after load attempt
      vid.addEventListener('loadeddata', () => { if (soon) soon.hidden = true; vid.style.display = ''; });
    }

    animateIn();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildDots(total) {
    const wrap = document.getElementById('fr-dots');
    wrap.innerHTML = '';
    for (let k = 0; k < total; k++) {
      const d = document.createElement('button');
      d.className = 'fr-dot' + (k === idx ? ' is-active' : '') + (FERIA_ORDER[k].maqueta ? ' is-maqueta' : '');
      d.setAttribute('aria-label', 'Parada ' + (k + 1));
      d.addEventListener('click', () => { idx = k; sync(); });
      wrap.appendChild(d);
    }
  }

  function animateIn() {
    if (typeof anime === 'undefined') return;
    anime({
      targets: '#fr-stage [data-anim]',
      translateY: [22, 0],
      opacity: [0, 1],
      delay: anime.stagger(70, { start: 60 }),
      duration: 620,
      easing: 'cubicBezier(.16,1,.3,1)'
    });
  }

  function sync() {
    const step = FERIA_ORDER[idx];
    const url = new URL(location);
    url.searchParams.set('stop', step.slug);
    history.replaceState(null, '', url);
    render();
  }

  /* ---- Controls ---- */
  function bind() {
    document.getElementById('fr-prev').addEventListener('click', () => {
      if (idx > 0) { idx--; sync(); }
    });
    document.getElementById('fr-next').addEventListener('click', () => {
      if (idx < FERIA_ORDER.length - 1) { idx++; sync(); }
      else document.getElementById('fr-end-panel').scrollIntoView({ behavior: 'smooth' });
    });

    const lt = document.getElementById('fr-lang');
    if (lt) {
      lt.addEventListener('click', () => {
        LANG = (LANG === 'es') ? 'en' : 'es';
        localStorage.setItem('viaje_lang', LANG);
        document.documentElement.lang = LANG;
        lt.querySelector('span').textContent = LANG === 'es' ? 'EN' : 'ES';
        document.getElementById('fr-kicker').textContent = t('kicker');
        render();
      });
      lt.querySelector('span').textContent = LANG === 'es' ? 'EN' : 'ES';
    }
  }

  /* ---- Boot ---- */
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = LANG;
    document.getElementById('fr-kicker').textContent = t('kicker');
    bind();
    render();
  });
})();
