const API_BASE = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';

function api(path) {
  return API_BASE + path;
}

function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function ce(tag, cls) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function showToast(msg, dur = 5000) {
  // configurado para duras 5segundos (frmatei em milleseconds)
  const old = document.querySelector('.mp-toast');
  if (old) old.remove();
  const t = ce('div', 'mp-toast');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), dur);
}

function getSession() {
  try {
    const raw = localStorage.getItem('usuarioLogado');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.id !== undefined)) return parsed;
    return null;
  } catch {
    return null;
  }
}

const STATE = {
  session: null,
  user: null,
  acoes: [],
  tags: [],
};

function endpoint(type) {
  return type === 1 ? '/ongs' : '/volunteers';
}

async function fetchUser(id, type) {
  const res = await fetch(api(`${endpoint(type)}/${id}`));
  if (!res.ok) throw new Error('Usuário não encontrado');
  return res.json();
}

async function patchUser(id, type, body) {
  const res = await fetch(api(`${endpoint(type)}/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Erro ao salvar');
  return res.json();
}

async function fetchAcoesOng(ongId) {
  const res = await fetch(api(`/actions?ongId=${ongId}`));
  if (!res.ok) return [];
  return res.json();
}

async function fetchTags() {
  try {
    const res = await fetch(api('/tags'));
    return res.ok ? res.json() : [];
  } catch { return []; }
}

async function patchAcao(id, body) {
  const res = await fetch(api(`/actions/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Erro ao salvar ação');
  return res.json();
}

async function postAcao(body) {
  const res = await fetch(api('/actions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Erro ao criar ação');
  return res.json();
}

function renderPerfil(user, type) {
  const isOng = type === 1;

  document.title = `${user.name} | Meu Perfil`;

  qs('#profile-name').textContent = user.name || '';
  qs('#profile-meta').textContent = user.createdAt
    ? `Desde ${formatDate(user.createdAt)}`
    : '';
  qs('#profile-type-badge').textContent = isOng ? 'ONG' : 'Voluntário(a)';
  qs('#profile-rating').textContent =
    user.rating != null ? Number(user.rating).toFixed(1) : '—';

  qs('#profile-followers').textContent = user.followers ?? '—';

  qs('#profile-bio').textContent = isOng
    ? (user.description || '')
    : (user.bio || '');

  const secInfo = qs('#section-infos');
  secInfo.innerHTML = '<h3>Informações</h3>';

  const infos = isOng
    ? [
        ['E-mail',        user.email],
        ['Telefone',      user.phone],
        ['CNPJ',          user.cnpj],
        ['Data de Fundação', formatDate(user.foundationDate)],
        ['CEP',           user.cep],
        ['Responsável',   user.responsibleName],
        ['Website',       user.website || '—'],
      ]
    : [
        ['E-mail',        user.email],
        ['Telefone',      user.phone],
        ['CPF',           user.cpf],
        ['Data de Nascimento', formatDate(user.birthDate)],
        ['CEP',           user.cep],
      ];

  infos.forEach(([label, val]) => {
    const p = ce('p');
    p.innerHTML = `<strong>${label}:</strong> <span>${val || '—'}</span>`;
    secInfo.appendChild(p);
  });
}

function buildFieldGroup(id, label, value, type = 'text', extra = '') {
  return `
    <div class="mp-field-group">
      <label for="${id}">${label}</label>
      <div class="field">
        <input
          id="${id}" name="${id}"
          type="${type}"
          class="field-input"
          value="${value || ''}"
          ${extra}
        />
      </div>
    </div>`;
}

function buildTextareaGroup(id, label, value) {
  return `
    <div class="mp-field-group">
      <label for="${id}">${label}</label>
      <div class="field field-textarea">
        <textarea id="${id}" name="${id}" class="field-input">${value || ''}</textarea>
      </div>
    </div>`;
}

function openModalEdicao() {
  const user   = STATE.user;
  const isOng  = STATE.session.type === 1;
  const form   = qs('#form-edicao');

  if (isOng) {
    form.innerHTML =
      buildFieldGroup('edit-name',            'Nome',              user.name)
    + buildFieldGroup('edit-email',           'E-mail',            user.email, 'email')
    + buildFieldGroup('edit-phone',           'Telefone',          user.phone)
    + buildFieldGroup('edit-cep',             'CEP',               user.cep)
    + buildFieldGroup('edit-responsibleName', 'Responsável',       user.responsibleName)
    + buildFieldGroup('edit-website',         'Website',           user.website)
    + buildTextareaGroup('edit-description',  'Descrição',         user.description);
  } else {
    form.innerHTML =
      buildFieldGroup('edit-name',      'Nome',                user.name)
    + buildFieldGroup('edit-email',     'E-mail',              user.email, 'email')
    + buildFieldGroup('edit-phone',     'Telefone',            user.phone)
    + buildFieldGroup('edit-cep',       'CEP',                 user.cep)
    + buildTextareaGroup('edit-bio',    'Sobre você',          user.bio);
  }

  qs('#modal-edicao').removeAttribute('hidden');
}

function closeModalEdicao() {
  qs('#modal-edicao').setAttribute('hidden', '');
}

async function salvarEdicao(e) {
  e.preventDefault();
  const isOng = STATE.session.type === 1;
  const form  = qs('#form-edicao');
  const val   = (id) => (form.querySelector(`#${id}`)?.value || '').trim();

  const body = isOng
    ? {
        name:            val('edit-name'),
        email:           val('edit-email'),
        phone:           val('edit-phone'),
        cep:             val('edit-cep'),
        responsibleName: val('edit-responsibleName'),
        website:         val('edit-website'),
        description:     val('edit-description'),
      }
    : {
        name:  val('edit-name'),
        email: val('edit-email'),
        phone: val('edit-phone'),
        cep:   val('edit-cep'),
        bio:   val('edit-bio'),
      };

  try {
    const updated = await patchUser(STATE.user.id, STATE.session.type, body);
    STATE.user = updated;
    renderPerfil(updated, STATE.session.type);
    closeModalEdicao();
    showToast('Perfil atualizado com sucesso!');
  } catch (err) {
    showToast('Erro ao salvar. Tente novamente.');
    console.error(err);
  }
}

function openModalInativar() {
  qs('#modal-inativar').removeAttribute('hidden');
}
function closeModalInativar() {
  qs('#modal-inativar').setAttribute('hidden', '');
}

async function confirmarInativacao() {
  try {
    await patchUser(STATE.user.id, STATE.session.type, {
      deletedAt: new Date().toISOString().split('T')[0],
    });
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioLogado');
    updateButtonsVisibility(false);
    showToast('Conta inativada. Redirecionando...');
    setTimeout(() => {
      window.location.href = '../../index.html';
    }, 2000);
  } catch (err) {
    showToast('Erro ao inativar conta.');
    console.error(err);
  }
}

function renderAcoesOng(acoes) {
  const lista = qs('#lista-acoes-ong');
  lista.innerHTML = '';

  if (!acoes.length) {
    const p = ce('p', 'text-sm font-alt text-muted');
    p.textContent = 'Nenhuma ação cadastrada ainda.';
    lista.appendChild(p);
    return;
  }

  acoes.forEach(acao => {
    const card = ce('div', 'acao-card');

    const header = ce('div', 'acao-card-header');
    const title  = ce('h4', 'acao-card-title');
    title.textContent = acao.title;

    const statusClass =
      acao.status === 'open'      ? 'acao-status-open'
      : acao.status === 'completed' ? 'acao-status-completed'
      : 'acao-status-cancelled';

    const badge = ce('span', `acao-status-badge ${statusClass}`);
    badge.textContent =
      acao.status === 'open' ? 'Aberta'
      : acao.status === 'completed' ? 'Encerrada'
      : 'Cancelada';

    header.appendChild(title);
    header.appendChild(badge);

    const meta = ce('p', 'acao-card-meta');
    meta.textContent = `📅 ${formatDate(acao.date)} · 📍 ${acao.location || '—'} · ${acao.vacancies ?? '?'} vagas`;

    const desc = ce('p', 'acao-card-desc');
    desc.textContent =
      acao.description && acao.description.length > 100
        ? acao.description.slice(0, 100) + '...'
        : (acao.description || '');

    const actBtns = ce('div', 'acao-card-actions');

    const btnEdit = ce('button', 'btn btn-primary btn-pad-xs btn-shadow-sm text-xs');
    btnEdit.innerHTML = '<i class="fa-solid fa-pen"></i> Editar';
    btnEdit.addEventListener('click', () => openModalAcao(acao));

    const btnInativar = ce('button', 'btn btn-outline btn-pad-xs btn-shadow-sm text-xs');
    btnInativar.innerHTML = '<i class="fa-solid fa-ban"></i> Encerrar';
    btnInativar.disabled = acao.status !== 'open';
    btnInativar.addEventListener('click', () => encerrarAcao(acao));

    actBtns.appendChild(btnEdit);
    actBtns.appendChild(btnInativar);

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(desc);
    card.appendChild(actBtns);
    lista.appendChild(card);
  });
}

async function encerrarAcao(acao) {
  if (!confirm(`Deseja encerrar a ação "${acao.title}"?`)) return;
  try {
    const updated = await patchAcao(acao.id, { status: 'completed' });
    const idx = STATE.acoes.findIndex(a => a.id === acao.id);
    if (idx !== -1) STATE.acoes[idx] = updated;
    renderAcoesOng(STATE.acoes);
    showToast('Ação encerrada.');
  } catch (err) {
    showToast('Erro ao encerrar ação.');
    console.error(err);
  }
}

function updateButtonsVisibility(isLogged) {
  const btnLogado = qs('#buttons-action-profile');
  const profileInfoCount = qs('#profile-infos-count');
  const profileInfoPhoto = qs('#profile-infos-photo');
  const btnDeslogado = qs('#buttons-action-profile-deslog');

  if (!btnLogado || !btnDeslogado) return;

  btnLogado.style.display = isLogged ? 'block' : 'none';
  profileInfoCount.style.display = isLogged ? 'block' : 'none';
  profileInfoPhoto.style.display = isLogged ? 'block' : 'none';
  btnDeslogado.style.display = isLogged ? 'none' : 'block';
}

function redirectTo(path) {
  location.href = path;
}

function buildAcaoForm(acao = null) {
  const v = (field) => acao ? (acao[field] ?? '') : '';
  const tagsOpcoes = STATE.tags
    .map(t => {
      const sel = acao && (acao.tags || []).includes(t.name) ? 'selected' : '';
      return `<option value="${t.name}" ${sel}>${t.name}</option>`;
    })
    .join('');

  return `
    ${buildFieldGroup('acao-title',       'Título',      v('title'))}
    ${buildTextareaGroup('acao-desc',     'Descrição',   v('description'))}
    ${buildFieldGroup('acao-location',    'Local',       v('location'))}
    ${buildFieldGroup('acao-date',        'Data',        v('date'), 'date')}
    ${buildFieldGroup('acao-endDate',     'Prazo inscrição', v('endDate'), 'date')}
    ${buildFieldGroup('acao-vacancies',   'Vagas',       v('vacancies'), 'number', 'min="1"')}
    <div class="mp-field-group">
      <label for="acao-tags">Tags (segure Ctrl/Cmd para múltiplas)</label>
      <div class="field" style="padding:4px 8px;">
        <select id="acao-tags" name="acao-tags" class="field-input" multiple style="min-height:90px;border:none;outline:none;background:transparent;">
          ${tagsOpcoes}
        </select>
      </div>
    </div>
    <div class="mp-field-group">
      <label for="acao-status">Status</label>
      <div class="field" style="padding:4px 8px;">
        <select id="acao-status" name="acao-status" class="field-input" style="border:none;outline:none;background:transparent;">
          <option value="open"      ${v('status')==='open'?'selected':''}>Aberta</option>
          <option value="completed" ${v('status')==='completed'?'selected':''}>Encerrada</option>
        </select>
      </div>
    </div>`;
}

let _editandoAcaoId = null;

function openModalAcao(acao = null) {
  _editandoAcaoId = acao ? acao.id : null;
  qs('#modal-acao-title').textContent = acao ? 'Editar Ação' : 'Nova Ação';
  qs('#form-acao').innerHTML = buildAcaoForm(acao);
  qs('#modal-acao').removeAttribute('hidden');
}

function closeModalAcao() {
  qs('#modal-acao').setAttribute('hidden', '');
  _editandoAcaoId = null;
}

async function salvarAcao(e) {
  e.preventDefault();
  const form   = qs('#form-acao');
  const val    = (id) => (form.querySelector(`#${id}`)?.value || '').trim();
  const selEl  = form.querySelector('#acao-tags');
  const tags   = selEl
    ? Array.from(selEl.selectedOptions).map(o => o.value)
    : [];

  const body = {
    title:       val('acao-title'),
    description: val('acao-desc'),
    location:    val('acao-location'),
    date:        val('acao-date'),
    endDate:     val('acao-endDate'),
    vacancies:   Number(val('acao-vacancies')) || 0,
    tags,
    status:      form.querySelector('#acao-status')?.value || 'open',
  };

  try {
    if (_editandoAcaoId) {
      const updated = await patchAcao(_editandoAcaoId, body);
      const idx = STATE.acoes.findIndex(a => a.id === _editandoAcaoId);
      if (idx !== -1) STATE.acoes[idx] = updated;
      showToast('Ação atualizada!');
    } else {
      const nova = await postAcao({
        ...body,
        ongId:       STATE.user.id,
        participants: [],
        image:        '',
        checkInCode:  '',
        createdAt:    new Date().toISOString().split('T')[0],
        deletedAt:    null,
      });
      STATE.acoes.unshift(nova);
      showToast('Ação criada!');
    }
    renderAcoesOng(STATE.acoes);
    closeModalAcao();
  } catch (err) {
    showToast('Erro ao salvar ação.');
    console.error(err);
  }
}

function showError(msg) {
  qs('#profile-name').textContent = 'Perfil não encontrado';
  qs('#profile-bio').textContent  = msg;
  updateButtonsVisibility(false);
}


async function init() {
  const session = getSession();

  if (!session || session.id === undefined) {
    showError('Nenhum usuário logado. Faça login para ver seu perfil.');
    qs('#btn-login').addEventListener('click', () => {redirectTo('./../login/login.html')});
    return;
  }

  STATE.session = session;

  try {
    const [user, tags] = await Promise.all([
      fetchUser(session.id, session.type),
      fetchTags(),
    ]);

    STATE.user = user;
    STATE.tags = tags;
    updateButtonsVisibility(true);
    renderPerfil(user, session.type);

    if (session.type === 1) {
      const acoes = await fetchAcoesOng(user.id);
      STATE.acoes = acoes;
      qs('#section-acoes-ong').style.display = '';
      renderAcoesOng(acoes);
    }

    fetch(api(`/follows?targetType=${session.type === 1 ? 'ong' : 'volunteer'}&targetId=${user.id}`))
      .then(r => r.json())
      .then(follows => {
        qs('#profile-followers').textContent = follows.length;
      })
      .catch(() => {});

  } catch (err) {
    showError('Não foi possível carregar os dados do usuário.');
    console.error(err);
    return;
  }

  qs('#btn-editar').addEventListener('click', openModalEdicao);
  qs('#btn-fechar-modal').addEventListener('click', closeModalEdicao);
  qs('#btn-cancelar-modal').addEventListener('click', closeModalEdicao);
  qs('#form-edicao').addEventListener('submit', salvarEdicao);

  qs('#btn-inativar').addEventListener('click', openModalInativar);  
  qs('#btn-cancelar-inativar').addEventListener('click', closeModalInativar);
  qs('#btn-confirmar-inativar').addEventListener('click', confirmarInativacao);

  qs('#btn-nova-acao')?.addEventListener('click', () => {redirectTo('./../cadastro-vagas/criar-acao.html')});
  qs('#btn-fechar-modal-acao').addEventListener('click', closeModalAcao);
  qs('#btn-cancelar-modal-acao').addEventListener('click', closeModalAcao);
  qs('#form-acao').addEventListener('submit', salvarAcao);

  qs('#modal-edicao').addEventListener('click', (e) => {
    if (e.target === qs('#modal-edicao')) closeModalEdicao();
  });
  qs('#modal-acao').addEventListener('click', (e) => {
    if (e.target === qs('#modal-acao')) closeModalAcao();
  });
  qs('#modal-inativar').addEventListener('click', (e) => {
    if (e.target === qs('#modal-inativar')) closeModalInativar();
  });
}

document.addEventListener('DOMContentLoaded', init);