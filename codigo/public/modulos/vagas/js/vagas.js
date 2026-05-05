const API = '../../db/db.json';

const STATE = {
  actions: [],
  ongs: [],
  tags: [],
  tagsSelecionadas: [],
  paginaAtual: 1,
  porPagina: 6,
  dropdownAberto: false
};

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function normalizar(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function qs(sel) { return document.querySelector(sel); }

function ce(tag, cls) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
}

function abrirDropdown() {
  const dropdown = qs('#tagsDropdown');
  const btn = qs('#btnAddTag');
  STATE.dropdownAberto = true;
  dropdown.classList.add('aberto');
  dropdown.setAttribute('aria-hidden', 'false');
  btn.setAttribute('aria-expanded', 'true');
}

function fecharDropdown() {
  const dropdown = qs('#tagsDropdown');
  const btn = qs('#btnAddTag');
  STATE.dropdownAberto = false;
  dropdown.classList.remove('aberto');
  dropdown.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'false');
}

function toggleDropdown() {
  STATE.dropdownAberto ? fecharDropdown() : abrirDropdown();
}

function renderDropdown() {
  const dropdown = qs('#tagsDropdown');
  dropdown.innerHTML = '';

  STATE.tags.forEach(tag => {
    const isSelecionada = STATE.tagsSelecionadas.includes(tag.name);

    const opcao = ce('button', `vagas-tag-opcao${isSelecionada ? ' selecionada' : ''}`);
    opcao.type = 'button';
    opcao.textContent = tag.name;
    if (isSelecionada) {
      opcao.innerHTML += ' <i class="fa-solid fa-check"></i>';
      opcao.setAttribute('aria-pressed', 'true');
    } else {
      opcao.setAttribute('aria-pressed', 'false');
    }

    if (!isSelecionada) {
      opcao.addEventListener('click', () => {
        STATE.tagsSelecionadas.push(tag.name);
        STATE.paginaAtual = 1;
        atualizarTagsUI();
        renderDropdown();
        aplicarFiltros();
      });
    }

    dropdown.appendChild(opcao);
  });
}

function criarTagBadge(nome) {
  const span = ce('span', 'tag tag-white tag-xs tag-removable');

  const text = ce('span', 'tag-text');
  text.textContent = nome;

  const btn = ce('button', 'tag-remove');
  btn.type = 'button';
  btn.setAttribute('aria-label', `Remover ${nome}`);
  btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  btn.addEventListener('click', () => {
    STATE.tagsSelecionadas = STATE.tagsSelecionadas.filter(t => t !== nome);
    atualizarTagsUI();
    renderDropdown();
    STATE.paginaAtual = 1;
    aplicarFiltros();
  });

  span.appendChild(text);
  span.appendChild(btn);
  return span;
}

function atualizarTagsUI() {
  const container = qs('#tagsSelecionadas');
  container.innerHTML = '';
  STATE.tagsSelecionadas.forEach(nome => {
    container.appendChild(criarTagBadge(nome));
  });
}

function renderCardVaga(action, nomeOng) {
  const card = ce('article', 'vaga-card');

  const thumb = ce('div', 'vaga-card-thumb');
  thumb.innerHTML = '<i class="fa-regular fa-image"></i>';

  const body = ce('div', 'vaga-card-body');

  const titulo = ce('h3', 'vaga-card-titulo');
  titulo.textContent = action.title;

  const ong = ce('p', 'vaga-card-ong');
  ong.textContent = `Por: ${nomeOng}`;

  const desc = ce('p', 'vaga-card-desc');
  const textoDesc = action.description.length > 80
    ? action.description.slice(0, 80) + '...'
    : action.description;
  desc.textContent = textoDesc;

  const cta = ce('div', 'vaga-card-cta');
  const btn = ce('button', 'btn btn-primary');
  btn.textContent = 'Ver Detalhes';
  cta.appendChild(btn);

  body.appendChild(titulo);
  body.appendChild(ong);
  body.appendChild(desc);
  body.appendChild(cta);

  card.appendChild(thumb);
  card.appendChild(body);

  return card;
}

function atualizarPaginacao(lista) {
  const totalPag = Math.max(1, Math.ceil(lista.length / STATE.porPagina));
  if (STATE.paginaAtual > totalPag) STATE.paginaAtual = totalPag;

  qs('#btnPaginaPrev').disabled = STATE.paginaAtual <= 1;
  qs('#btnPaginaNext').disabled = STATE.paginaAtual >= totalPag;
  qs('#btnVerMais').disabled = STATE.paginaAtual >= totalPag;
}

function renderLista(lista) {
  const cont = qs('#listaVagas');
  cont.innerHTML = '';

  const inicio = (STATE.paginaAtual - 1) * STATE.porPagina;
  const slice = lista.slice(inicio, inicio + STATE.porPagina);

  if (!slice.length) {
    const p = ce('p', 'vagas-empty');
    p.textContent = 'Nenhuma vaga encontrada com os filtros selecionados.';
    cont.appendChild(p);
    return;
  }

  const ongMap = Object.fromEntries(STATE.ongs.map(o => [o.id, o.name]));
  slice.forEach(a => {
    cont.appendChild(renderCardVaga(a, ongMap[a.ongId] || 'ONG'));
  });
}

function getListaFiltrada() {
  const titulo = normalizar(qs('#filtroTitulo').value);
  const local = normalizar(qs('#filtroLocal').value);
  const tagsAtivas = STATE.tagsSelecionadas.map(normalizar);

  let filtradas = STATE.actions.filter(a => a.status === 'open');

  if (titulo) {
    filtradas = filtradas.filter(a => normalizar(a.title).includes(titulo));
  }
  if (local) {
    filtradas = filtradas.filter(a => normalizar(a.location).includes(local));
  }
  if (tagsAtivas.length) {
    filtradas = filtradas.filter(a => {
      const tags = (a.tags || []).map(normalizar);
      return tagsAtivas.every(t => tags.includes(t));
    });
  }

  return filtradas;
}

function aplicarFiltros() {
  const lista = getListaFiltrada();
  atualizarPaginacao(lista);
  renderLista(lista);
}

function limparFiltros() {
  qs('#filtroTitulo').value = '';
  qs('#filtroLocal').value = '';
  STATE.tagsSelecionadas = [];
  STATE.paginaAtual = 1;
  atualizarTagsUI();
  renderDropdown();
  fecharDropdown();
  aplicarFiltros();
}

function initEventos() {
  qs('#btnAddTag').addEventListener('click', e => {
    e.stopPropagation();
    toggleDropdown();
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.vagas-tags-box')) {
      fecharDropdown();
    }
  });

  qs('#btnBuscar').addEventListener('click', () => {
    STATE.paginaAtual = 1;
    aplicarFiltros();
  });

  ['#filtroTitulo', '#filtroLocal'].forEach(id => {
    qs(id).addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        STATE.paginaAtual = 1;
        aplicarFiltros();
      }
    });
  });

  qs('#btnLimpar').addEventListener('click', limparFiltros);

  qs('#btnPaginaPrev').addEventListener('click', () => {
    if (STATE.paginaAtual > 1) { STATE.paginaAtual--; aplicarFiltros(); }
  });

  qs('#btnPaginaNext').addEventListener('click', () => {
    STATE.paginaAtual++;
    aplicarFiltros();
  });

  qs('#btnVerMais').addEventListener('click', () => {
    STATE.paginaAtual++;
    aplicarFiltros();
  });
}

async function carregarDb() {
  const res = await fetch(API);
  const db = await res.json();

  STATE.actions = db.actions;
  STATE.ongs = db.ongs;
  STATE.tags = db.tags;

  renderDropdown();
  aplicarFiltros();
}

document.addEventListener('DOMContentLoaded', () => {
  initEventos();
  carregarDb().catch(err => console.error('Erro ao carregar db.json:', err));
});