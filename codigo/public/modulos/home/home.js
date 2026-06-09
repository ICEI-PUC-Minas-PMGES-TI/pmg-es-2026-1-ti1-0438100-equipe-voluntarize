// API base configurável via env
const API_BASE = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : 'http://localhost:3000';

function api(path) { return API_BASE + path; }

// Logos usadas nos cards de ONG em ordem rotativa, já que o db não tem imagens.
// Quando as ONGs tiverem logo própria, usar ong.logo no lugar.
const ONG_LOGOS = [
  '../../assets/images/logo-ongs/logo-ong-acolheramor.png',
  '../../assets/images/logo-ongs/logo-ong-educanca.png',
  '../../assets/images/logo-ongs/logo-ong-ecoterra.png',
];

// Formata número de seguidores: 1200 → "1k", 1500000 → "1.5M"
function formatFollowers(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k';
  return n;
}

// Converte data ISO (yyyy-mm-dd) para o formato brasileiro (dd/mm/yyyy)
function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Quantidade de cards visíveis no carrossel horizontal por tamanho de tela
function getVisibleCount() {
  return window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3;
}

// Detecta qual home está ativa pelo título da página
const isVoluntario = document.title.includes('Voluntário');

// Lê o usuário logado do localStorage (salvo pelo login real)
// formato: { id, type }  — type 0 = voluntário, type 1 = ONG
const usuarioLogado = (() => {
  try { return JSON.parse(localStorage.getItem('usuarioLogado')) || null; } catch (e) { return null; }
})();

const usuarioCorrente = usuarioLogado
  ? { id: usuarioLogado.id, tipo: usuarioLogado.type === 0 ? 'voluntario' : 'ong' }
  : null;

// Inicializa um carrossel horizontal genérico.
// Retorna { track, update } para que o chamador possa inserir cards e disparar
// o primeiro update após popular o track.
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

// Inicializa um carrossel vertical genérico, exibindo 2 cards por vez.
// A altura do container é calculada dinamicamente com base no card real,
// por isso setHeight() deve ser chamado após os cards serem inseridos no DOM.
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

// Card do carrossel de ONGs populares (usado nas duas homes)
function renderOngCard(ong, index) {
  const logo = ONG_LOGOS[index % ONG_LOGOS.length];
  const div = document.createElement('div');
  div.className = 'ong-card surface';
  div.style.position = 'relative';
  const profileUrl = `../visualizacao-detalhada-ong/index.html?id=${ong.id}`;

  div.innerHTML = `
    <div style="width:100px;position:absolute;top:0;right:var(--space-4)">
      <div class="divider-line divider-black divider-prism-sm prism-right" aria-hidden="true"></div>
    </div>
    <img src="${logo}" alt="${ong.name}" class="ong-card-img" />
    <h3 class="text-lg text-bold mt-2">${ong.name}</h3>
    <p class="text-md text-muted mt-1">★ ${ong.rating.toFixed(1).replace('.', ',')} &nbsp;|&nbsp; ${formatFollowers(ong.followers)} seguidores</p>
    <div class="stack mt-4 gap-1 w-full">
      <button class="btn btn-primary btn-pad-sm w-full">Seguir</button>
      <a class="btn btn-secondary btn-pad-sm w-full" href="${profileUrl}">Ver Perfil</a>
    </div>
    <div style="width:100px;position:absolute;bottom:0;left:var(--space-4)">
      <div class="divider-line divider-black divider-prism-sm prism-left" aria-hidden="true"></div>
    </div>
  `;
  return div;
}

// Card do carrossel de vagas em alta — ordenadas por número de visualizações

function getOngViews(ongId, actions) {
  return actions
    .filter(action => action.ongId === ongId)
    .reduce((total, action) => total + (Number.isFinite(action.views) ? action.views : 0), 0);
}
function renderAltaCard(action, ongName) {
  const div = document.createElement('div');
  div.className = 'alta-card';
  const detailsUrl = `../detalhes-vagas/detalhes.html?id=${action.id}`;
  div.innerHTML = `
    <div class="alta-card-thumb">
      <i class="fa-solid fa-calendar-days"></i>
    </div>
    <h3 class="text-md text-bold">${action.title}</h3>
    <p class="text-sm text-muted">Por: ${ongName}</p>
    <p class="text-sm font-alt text-muted">${action.description}</p>
    <a class="btn btn-primary btn-pad-sm w-full mt-1" href="${detailsUrl}">Ver Detalhes</a>
  `;
  return div;
}

function getActionViews(action) {
  return Number.isFinite(action.views) ? action.views : 0;
}

// Card de vaga com duas variantes de botões e badge de status.
//
// variant 'ong'        → botões "Ver Detalhes" + "Editar"  (home da ONG)
// variant 'voluntario' → botões "Ver Detalhes" + "Ver ONG" (home do voluntário)
//
// appStatus: 'pending' | 'accepted' | 'rejected' | null
const STATUS_BADGE = {
  pending:  { label: 'Pendente',  cls: 'vaga-badge-pendente' },
  accepted: { label: 'Aprovado',  cls: 'vaga-badge-aprovado' },
  rejected: { label: 'Recusado', cls: 'vaga-badge-recusado' },
};

function renderVagaCard(action, ongName, variant = 'ong', appStatus = null) {
  const inscritos = action.participants ? action.participants.length : 0;
  const div = document.createElement('div');
  div.className = 'vaga-card surface surface-white';

  const badgeInfo = appStatus ? STATUS_BADGE[appStatus] : null;
  const badge = badgeInfo ? `<div class="${badgeInfo.cls}">${badgeInfo.label}</div>` : '';
  const detailsUrl = `../detalhes-vagas/detalhes.html?id=${action.id}`;
  const ongProfileUrl = action.ongId ? `../visualizacao-detalhada-ong/index.html?id=${action.ongId}` : '#';

  const manageUrl = `../gerenciar-candidaturas-ong/index.html?id=${action.id}`;

  const botoes = variant === 'ong'
    ? `<a class="btn btn-secondary btn-pad-xs rounded-xs w-full" href="${detailsUrl}">Ver Detalhes</a>
       <a class="btn btn-primary btn-pad-xs rounded-xs w-full" href="${manageUrl}">Candidatos</a>`
    : `<a class="btn btn-secondary btn-pad-xs rounded-xs w-full" href="${detailsUrl}">Ver Detalhes</a>
       <a class="btn btn-secondary btn-pad-xs rounded-xs w-full" href="${ongProfileUrl}">Ver ONG</a>`;

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
  try {
    const [resOngs, resActions, resApplications, resVolunteers] = await Promise.all([
      fetch(api('/ongs')),
      fetch(api('/actions')),
      fetch(api('/applications')),
      fetch(api('/volunteers'))
    ]);

    const [ongs, actions, applications, volunteers] = await Promise.all([
      resOngs.json(),
      resActions.json(),
      resApplications.json(),
      resVolunteers.json()
    ]);

    const ongMap = Object.fromEntries(ongs.map(o => [o.id, o.name]));

  // Carrossel de ONGs populares — exibe todas as ONGs do banco
  const ongCarousel = initHorizontalCarousel('carouselTrack', 'prevBtn', 'nextBtn', 'ong-card');
  if (ongCarousel) {
    ongs
      .slice()
      .sort((a, b) => getOngViews(b.id, actions) - getOngViews(a.id, actions))
      .forEach((ong, i) => ongCarousel.track.appendChild(renderOngCard(ong, i)));
    ongCarousel.update();
  }

  // Carrossel de vagas em alta — ações abertas ordenadas por mais visualizações (views)
  const altaCarousel = initHorizontalCarousel('altaTrack', 'altaPrevBtn', 'altaNextBtn', 'alta-card');
  if (altaCarousel) {
    actions
      .filter(a => a.status === 'open')
      .sort((a, b) => getActionViews(b) - getActionViews(a))
      .forEach(a => altaCarousel.track.appendChild(renderAltaCard(a, ongMap[a.ongId] || '')));
    altaCarousel.update();
  }

    // Carrossel vertical de vagas — conteúdo varia por tipo de usuário:
    // ONG       → suas próprias ações abertas
    // Voluntário → ações em que se inscreveu, com badge de status da candidatura
    const vagasCarousel = initVerticalCarousel('vagasTrack', 'vagasPrevBtn', 'vagasNextBtn');
    if (vagasCarousel) {
      if (isVoluntario && usuarioCorrente) {
        const actionMap = Object.fromEntries(actions.map(a => [a.id, a]));
        applications
          .filter(app => String(app.volunteerId) === String(usuarioCorrente.id))
          .forEach(app => {
            const action = actionMap[app.actionId];
            if (!action) return;
            vagasCarousel.track.appendChild(
              renderVagaCard(action, ongMap[action.ongId] || '', 'voluntario', app.status)
            );
          });
      } else if (!isVoluntario && usuarioCorrente) {
        actions
          .filter(a => a.status === 'open' && String(a.ongId) === String(usuarioCorrente.id))
          .forEach(a => vagasCarousel.track.appendChild(renderVagaCard(a, ongMap[a.ongId] || '', 'ong')));
      }
      vagasCarousel.setHeight();
      vagasCarousel.update();
    }
  } catch (err) {
    console.error('Erro ao inicializar home:', err);
  }
}

init();
