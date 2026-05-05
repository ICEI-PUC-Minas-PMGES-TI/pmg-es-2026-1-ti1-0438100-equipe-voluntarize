const API = '../../db/db.json';

const ONG_LOGOS = [
  '../../assets/images/logo-ongs/logo-ong-acolheramor.png',
  '../../assets/images/logo-ongs/logo-ong-educanca.png',
  '../../assets/images/logo-ongs/logo-ong-ecoterra.png',
];

function formatFollowers(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k';
  return n;
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function getVisibleCount() {
  return window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3;
}

const isVoluntario = document.title.includes('Voluntário');

function initHorizontalCarousel(trackId, prevId, nextId, cardClass) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (!track || !prevBtn || !nextBtn) return null;

  let index = 0;

  function getCardWidth() {
    const card = track.querySelector('.' + cardClass);
    if (!card) return 0;
    return card.offsetWidth + (parseInt(getComputedStyle(track).gap) || 16);
  }

  function getMaxIndex() {
    return Math.max(0, track.querySelectorAll('.' + cardClass).length - getVisibleCount());
  }

  function update() {
    track.style.transform = `translateX(-${index * getCardWidth()}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= getMaxIndex();
  }

  prevBtn.addEventListener('click', () => { if (index > 0) { index--; update(); } });
  nextBtn.addEventListener('click', () => { if (index < getMaxIndex()) { index++; update(); } });
  window.addEventListener('resize', () => { index = Math.min(index, getMaxIndex()); update(); });

  return { track, update };
}

function initVerticalCarousel(trackId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (!track || !prevBtn || !nextBtn) return null;

  const VISIBLE = 2;
  let index = 0;

  function getCardHeight() {
    const card = track.querySelector('.vaga-card');
    if (!card) return 0;
    return card.offsetHeight + (parseInt(getComputedStyle(track).gap) || 16);
  }

  function setHeight() {
    const card = track.querySelector('.vaga-card');
    if (!card) return;
    const gap = parseInt(getComputedStyle(track).gap) || 16;
    track.parentElement.style.height = (card.offsetHeight * VISIBLE + gap * (VISIBLE - 1)) + 'px';
  }

  function getMaxIndex() {
    return Math.max(0, track.querySelectorAll('.vaga-card').length - VISIBLE);
  }

  function update() {
    track.style.transform = `translateY(-${index * getCardHeight()}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= getMaxIndex();
  }

  prevBtn.addEventListener('click', () => { if (index > 0) { index--; update(); } });
  nextBtn.addEventListener('click', () => { if (index < getMaxIndex()) { index++; update(); } });
  window.addEventListener('resize', () => { setHeight(); index = Math.min(index, getMaxIndex()); update(); });

  return { track, setHeight, update };
}

function renderOngCard(ong, index) {
  const logo = ONG_LOGOS[index % ONG_LOGOS.length];
  const div = document.createElement('div');
  div.className = 'ong-card surface';
  div.style.position = 'relative';
  div.innerHTML = `
    <div style="width:100px;position:absolute;top:0;right:var(--space-4)">
      <div class="divider-line divider-black divider-prism-sm prism-right" aria-hidden="true"></div>
    </div>
    <img src="${logo}" alt="${ong.name}" class="ong-card-img" />
    <h3 class="text-lg text-bold mt-2">${ong.name}</h3>
    <p class="text-md text-muted mt-1">★ ${ong.rating.toFixed(1).replace('.', ',')} &nbsp;|&nbsp; ${formatFollowers(ong.followers)} seguidores</p>
    <div class="stack mt-4 gap-1 w-full">
      <button class="btn btn-primary btn-pad-sm w-full">Seguir</button>
      <button class="btn btn-secondary btn-pad-sm w-full">Ver Perfil</button>
    </div>
    <div style="width:100px;position:absolute;bottom:0;left:var(--space-4)">
      <div class="divider-line divider-black divider-prism-sm prism-left" aria-hidden="true"></div>
    </div>
  `;
  return div;
}

function renderAltaCard(action, ongName) {
  const div = document.createElement('div');
  div.className = 'alta-card';
  div.innerHTML = `
    <div class="alta-card-thumb">
      <i class="fa-solid fa-calendar-days"></i>
    </div>
    <h3 class="text-md text-bold">${action.title}</h3>
    <p class="text-sm text-muted">Por: ${ongName}</p>
    <p class="text-sm font-alt text-muted">${action.description}</p>
    <button class="btn btn-primary btn-pad-sm w-full mt-1">Ver Detalhes</button>
  `;
  return div;
}

function renderVagaCard(action, ongName, variant = 'ong', aprovado = false) {
  const inscritos = action.participants ? action.participants.length : 0;
  const div = document.createElement('div');
  div.className = 'vaga-card surface surface-white';

  const badge = aprovado ? `<div class="vaga-badge-aprovado">Aprovado</div>` : '';

  const botoes = variant === 'ong'
    ? `<button class="btn btn-secondary btn-pad-xs rounded-xs w-full">Ver Detalhes</button>
       <button class="btn btn-secondary btn-pad-xs rounded-xs w-full">Editar</button>`
    : `<button class="btn btn-secondary btn-pad-xs rounded-xs w-full">Ver Detalhes</button>
       <button class="btn btn-secondary btn-pad-xs rounded-xs w-full">Ver ONG</button>`;

  div.innerHTML = `
    ${badge}
    <div class="vaga-card-body flex justify-center gap-4 p-1">
      <div class="vaga-card-img">
        <i class="fa-solid fa-calendar-days"></i>
      </div>
      <div class="flex flex-col justify-center">
        <h3 class="text-md text-bold">${action.title}</h3>
        <p class="text-sm text-muted">${ongName} &nbsp;·&nbsp; ${formatDate(action.date)}</p>
        <p class="text-sm mt-1">${action.description}</p>
        <p class="text-xs text-muted mt-1">${action.vacancies} vagas &nbsp;·&nbsp; ${inscritos} inscritos</p>
      </div>
    </div>
    <div class="flex gap-1 mt-1 w-full pl-3 pr-3" style="align-items:center;justify-content:center">
      ${botoes}
    </div>
  `;
  return div;
}

async function init() {
  const res = await fetch(API);
  const db = await res.json();
  const ongMap = Object.fromEntries(db.ongs.map(o => [o.id, o.name]));

  const ongCarousel = initHorizontalCarousel('carouselTrack', 'prevBtn', 'nextBtn', 'ong-card');
  if (ongCarousel) {
    db.ongs.forEach((ong, i) => ongCarousel.track.appendChild(renderOngCard(ong, i)));
    ongCarousel.update();
  }

  const altaCarousel = initHorizontalCarousel('altaTrack', 'altaPrevBtn', 'altaNextBtn', 'alta-card');
  if (altaCarousel) {
    db.actions
      .filter(a => a.status === 'open')
      .sort((a, b) => b.participants.length - a.participants.length)
      .forEach(a => altaCarousel.track.appendChild(renderAltaCard(a, ongMap[a.ongId] || '')));
    altaCarousel.update();
  }

  const vagasCarousel = initVerticalCarousel('vagasTrack', 'vagasPrevBtn', 'vagasNextBtn');
  if (vagasCarousel) {
    if (isVoluntario) {
      const VOLUNTARIO_ID = 1;
      const actionMap = Object.fromEntries(db.actions.map(a => [a.id, a]));
      db.applications
        .filter(app => app.volunteerId === VOLUNTARIO_ID)
        .forEach(app => {
          const action = actionMap[app.actionId];
          if (!action) return;
          vagasCarousel.track.appendChild(
            renderVagaCard(action, ongMap[action.ongId] || '', 'voluntario', app.status === 'accepted')
          );
        });
    } else {
      db.actions
        .filter(a => a.status === 'open')
        .forEach(a => vagasCarousel.track.appendChild(renderVagaCard(a, ongMap[a.ongId] || '', 'ong')));
    }
    vagasCarousel.setHeight();
    vagasCarousel.update();
  }
}

init();
