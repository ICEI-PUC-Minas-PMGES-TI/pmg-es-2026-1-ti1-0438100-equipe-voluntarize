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

function getVisibleCount() {
  return window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3;
}

function initHorizontalCarousel(trackId, prevId, nextId, cardClass) {
  const track   = document.getElementById(trackId);
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

async function initOngs() {
  const res = await fetch(API);
  const db  = await res.json();

  const ongCarousel = initHorizontalCarousel('carouselTrack', 'prevBtn', 'nextBtn', 'ong-card');
  if (ongCarousel) {
    db.ongs.forEach((ong, i) => ongCarousel.track.appendChild(renderOngCard(ong, i)));
    ongCarousel.update();
  }
}

initOngs();
