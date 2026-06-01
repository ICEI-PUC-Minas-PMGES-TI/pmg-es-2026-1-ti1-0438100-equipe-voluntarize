const API_URL = '../../db/db.json';

const MAP_CENTER = [-19.923, -43.938];
const ONG_LOGOS = [
  '../../assets/images/logo-ongs/logo-ong-acolheramor.png',
  '../../assets/images/logo-ongs/logo-ong-educanca.png',
  '../../assets/images/logo-ongs/logo-ong-ecoterra.png'
];

const STATE = {
  ongs: [],
  actions: [],
  follows: [],
  map: null,
  markers: new Map(),
  activeId: null
};

function qs(selector) {
  return document.querySelector(selector);
}

function ce(tag, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function uniq(list) {
  return [...new Set(list.filter(Boolean))];
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getActionsByOng(ongId) {
  return STATE.actions.filter((action) => Number(action.ongId) === Number(ongId) && !action.deletedAt);
}

function getFollowersByOng(ongId) {
  return STATE.follows.filter((follow) => (
    follow.targetType === 'ong' && Number(follow.targetId) === Number(ongId)
  )).length;
}

function formatRating(value) {
  const rating = Number(value || 0);
  return rating.toFixed(1).replace('.', ',');
}

function pluralize(value, singular, plural) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function enhanceOng(ong, index) {
  const actions = getActionsByOng(ong.id);
  const openActions = actions.filter((action) => action.status === 'open');
  const actionTags = uniq(actions.flatMap((action) => action.tags || []));
  const searchableActionText = actions
    .map((action) => `${action.title || ''} ${action.description || ''} ${action.location || ''}`)
    .join(' ');

  const searchText = normalizeText([
    ong.name,
    ong.description,
    ong.responsibleName,
    ong.cep,
    ong.address,
    ong.city,
    ong.state,
    actionTags.join(' '),
    searchableActionText
  ].join(' '));

  const localText = normalizeText([
    ong.address,
    ong.city,
    ong.state,
    ong.cep,
    actions.map((action) => action.location).join(' ')
  ].join(' '));

  return {
    ...ong,
    logoSrc: ong.logo || ONG_LOGOS[index % ONG_LOGOS.length],
    actions,
    openActions,
    actionTags,
    followers: ong.followers || getFollowersByOng(ong.id),
    searchText,
    localText,
    normalizedTags: actionTags.map(normalizeText),
    latitude: Number(ong.latitude),
    longitude: Number(ong.longitude)
  };
}

function populateCauseSelect() {
  const select = qs('#filtroCausa');
  const causes = uniq(STATE.ongs.flatMap((ong) => ong.actionTags)).sort((a, b) => a.localeCompare(b));

  select.innerHTML = '<option value="">Todas as áreas</option>';
  causes.forEach((cause) => {
    const option = ce('option');
    option.value = cause;
    option.textContent = cause;
    select.appendChild(option);
  });
}

function getFilteredOngs() {
  const text = normalizeText(qs('#filtroTexto').value);
  const location = normalizeText(qs('#filtroLocal').value);
  const cause = normalizeText(qs('#filtroCausa').value);

  return STATE.ongs.filter((ong) => {
    const matchesText = !text || ong.searchText.includes(text);
    const matchesLocation = !location || ong.localText.includes(location);
    const matchesCause = !cause || ong.normalizedTags.includes(cause);
    return matchesText && matchesLocation && matchesCause;
  });
}

function createMarkerIcon(index, active) {
  return L.divIcon({
    className: '',
    html: `<span class="map-marker${active ? ' is-active' : ''}">${index + 1}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
}

function getPopupHtml(ong) {
  const tags = ong.actionTags.slice(0, 3).map((tag) => (
    `<span class="tag tag-green tag-xs tag-static">${escapeHtml(tag)}</span>`
  )).join('');

  return `
    <div class="stack gap-2">
      <strong class="text-sm text-uppercase">${escapeHtml(ong.name)}</strong>
      <span class="text-xs">${escapeHtml(ong.address || ong.cep || 'Localização não informada')}</span>
      <span class="text-xs text-bold">${formatRating(ong.rating)} estrelas · ${pluralize(ong.openActions.length, 'ação aberta', 'ações abertas')}</span>
      <div class="ong-card-tags">${tags}</div>
    </div>
  `;
}

function showMapFallback() {
  const fallback = qs('#mapaFallback');
  fallback.hidden = false;
}

function initMap() {
  if (!window.L) {
    showMapFallback();
    return;
  }

  STATE.map = L.map('mapaOngs', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(MAP_CENTER, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(STATE.map);
}

function updateMarkerIcons() {
  if (!STATE.map) return;

  STATE.markers.forEach(({ marker, index }, id) => {
    marker.setIcon(createMarkerIcon(index, Number(id) === Number(STATE.activeId)));
  });
}

function renderMarkers(ongs) {
  if (!STATE.map) return;

  STATE.markers.forEach(({ marker }) => marker.remove());
  STATE.markers.clear();

  const bounds = [];

  ongs.forEach((ong, index) => {
    if (!Number.isFinite(ong.latitude) || !Number.isFinite(ong.longitude)) return;

    const marker = L.marker([ong.latitude, ong.longitude], {
      icon: createMarkerIcon(index, Number(STATE.activeId) === Number(ong.id))
    }).addTo(STATE.map);

    marker.bindPopup(getPopupHtml(ong));
    marker.on('click', () => selectOng(ong.id, true));
    STATE.markers.set(ong.id, { marker, index });
    bounds.push([ong.latitude, ong.longitude]);
  });

  if (bounds.length > 1) {
    STATE.map.fitBounds(bounds, { padding: [42, 42] });
  } else if (bounds.length === 1) {
    STATE.map.setView(bounds[0], 13);
  } else {
    STATE.map.setView(MAP_CENTER, 12);
  }
}

function createTagList(tags) {
  const container = ce('div', 'ong-card-tags');

  tags.slice(0, 4).forEach((tag, index) => {
    const badge = ce('span', `tag ${index % 2 === 0 ? 'tag-green' : 'tag-purple'} tag-xs tag-static`);
    badge.textContent = tag;
    container.appendChild(badge);
  });

  if (!tags.length) {
    const badge = ce('span', 'tag tag-white tag-xs tag-static');
    badge.textContent = 'Sem área informada';
    container.appendChild(badge);
  }

  return container;
}

function createOngCard(ong, index) {
  const card = ce('article', 'surface surface-white ong-map-card stack gap-3');
  card.tabIndex = 0;
  card.dataset.ongId = ong.id;

  const head = ce('div', 'ong-card-head');
  const logo = ce('div', 'ong-card-logo');
  const img = ce('img');
  img.src = ong.logoSrc;
  img.alt = ong.name;
  logo.appendChild(img);

  const titleWrap = ce('div', 'stack gap-1');
  const title = ce('h3', 'text-md text-bold text-uppercase');
  title.textContent = `${index + 1}. ${ong.name}`;

  const location = ce('p', 'text-xs text-muted');
  location.textContent = ong.address || ong.cep || 'Localização não informada';

  titleWrap.appendChild(title);
  titleWrap.appendChild(location);
  head.appendChild(logo);
  head.appendChild(titleWrap);

  const description = ce('p', 'text-sm font-alt');
  description.textContent = ong.description || 'Descrição não informada.';

  const stats = ce('div', 'flex flex-wrap gap-2');
  const rating = ce('span', 'tag tag-white tag-xs tag-static');
  rating.textContent = `${formatRating(ong.rating)} estrelas`;
  const actions = ce('span', 'tag tag-green tag-xs tag-static');
  actions.textContent = pluralize(ong.openActions.length, 'ação aberta', 'ações abertas');
  const followers = ce('span', 'tag tag-purple tag-xs tag-static');
  followers.textContent = pluralize(ong.followers, 'seguidor', 'seguidores');
  stats.appendChild(rating);
  stats.appendChild(actions);
  stats.appendChild(followers);

  const actionsRow = ce('div', 'ong-card-actions');
  const profileLink = ce('a', 'btn btn-primary btn-pad-xs text-xs');
  profileLink.href = `../visualizacao-detalhada-ong/index.html?id=${ong.id}`;
  profileLink.textContent = 'Ver perfil';

  const focusButton = ce('button', 'btn btn-secondary btn-icon-only btn-icon-only-xs');
  focusButton.type = 'button';
  focusButton.setAttribute('aria-label', `Localizar ${ong.name} no mapa`);
  focusButton.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
  focusButton.addEventListener('click', (event) => {
    event.stopPropagation();
    selectOng(ong.id, true);
  });

  actionsRow.appendChild(profileLink);
  actionsRow.appendChild(focusButton);

  card.appendChild(head);
  card.appendChild(description);
  card.appendChild(stats);
  card.appendChild(createTagList(ong.actionTags));
  card.appendChild(actionsRow);

  card.addEventListener('click', () => selectOng(ong.id, false));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOng(ong.id, true);
    }
  });

  return card;
}

function renderEmptyState() {
  const container = qs('#listaOngs');
  container.innerHTML = '';

  const empty = ce('div', 'surface surface-white ong-empty');
  empty.innerHTML = `
    <span class="icon-token icon-lg icon-purple">
      <i class="fa-regular fa-face-smile"></i>
    </span>
    <p class="text-sm text-bold">Nenhuma ONG encontrada com esses filtros.</p>
  `;
  container.appendChild(empty);
}

function renderList(ongs) {
  const container = qs('#listaOngs');
  container.innerHTML = '';

  if (!ongs.length) {
    renderEmptyState();
    return;
  }

  ongs.forEach((ong, index) => {
    container.appendChild(createOngCard(ong, index));
  });
}

function updateSummary(ongs) {
  const summary = qs('#resultadoResumo');
  summary.textContent = pluralize(ongs.length, 'ONG encontrada', 'ONGs encontradas');
}

function setActiveCard() {
  document.querySelectorAll('.ong-map-card').forEach((card) => {
    card.classList.toggle('is-active', Number(card.dataset.ongId) === Number(STATE.activeId));
  });
}

function selectOng(id, openPopup) {
  STATE.activeId = id;
  setActiveCard();
  updateMarkerIcons();

  const selectedCard = document.querySelector(`.ong-map-card[data-ong-id="${id}"]`);
  if (selectedCard) {
    selectedCard.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  const markerData = STATE.markers.get(id);
  if (markerData) {
    STATE.map.panTo(markerData.marker.getLatLng(), { animate: true });
    if (openPopup) markerData.marker.openPopup();
  }
}

function applyFilters() {
  const filteredOngs = getFilteredOngs();
  const activeStillVisible = filteredOngs.some((ong) => Number(ong.id) === Number(STATE.activeId));

  STATE.activeId = activeStillVisible ? STATE.activeId : (filteredOngs[0] ? filteredOngs[0].id : null);

  updateSummary(filteredOngs);
  renderList(filteredOngs);
  renderMarkers(filteredOngs);
  setActiveCard();
  updateMarkerIcons();
}

function clearFilters() {
  qs('#filtroTexto').value = '';
  qs('#filtroLocal').value = '';
  qs('#filtroCausa').value = '';
  applyFilters();
}

function bindEvents() {
  qs('#btnBuscarMapa').addEventListener('click', applyFilters);
  qs('#btnLimparMapa').addEventListener('click', clearFilters);

  ['#filtroTexto', '#filtroLocal', '#filtroCausa'].forEach((selector) => {
    qs(selector).addEventListener('input', applyFilters);
  });
}

async function loadData() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Erro ao carregar db.json');

  const db = await response.json();
  STATE.actions = db.actions || [];
  STATE.follows = db.follows || [];
  STATE.ongs = (db.ongs || [])
    .filter((ong) => !ong.deletedAt)
    .map(enhanceOng);

  populateCauseSelect();
  applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  bindEvents();
  loadData().catch((error) => {
    console.error(error);
    qs('#resultadoResumo').textContent = 'Erro ao carregar';
    renderEmptyState();
    showMapFallback();
  });
});
