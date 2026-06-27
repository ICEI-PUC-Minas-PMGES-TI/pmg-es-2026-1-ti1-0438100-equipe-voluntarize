(function () {
  const API = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';

  const find = (selector) => document.querySelector(selector);
  const setText = (selector, value) => { const el = find(selector); if (el) el.textContent = value; };

  const getActionId = () => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('id') || params.get('actionId');
    return raw ? Number(raw) : null;
  };

  const getLoggedUser = () => {
    try {
      const raw = localStorage.getItem('usuarioLogado');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return (parsed && parsed.id != null) ? parsed : null;
    } catch (e) {
      return null;
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const STATUS_LABEL = { pending: 'Pendente', accepted: 'Aceito', rejected: 'Recusado' };
  const STATUS_CLS   = { pending: 'tag-yellow', accepted: 'tag-green', rejected: 'tag-red' };

  const renderEmpty = (container, msg) => {
    const p = document.createElement('p');
    p.className = 'text-sm text-muted';
    p.textContent = msg;
    container.appendChild(p);
  };

  const renderCard = (application, volunteer, onAction) => {
    const card = document.createElement('article');
    card.className = 'surface candidate-card';

    const statusCls = STATUS_CLS[application.status] || '';
    const statusLabel = STATUS_LABEL[application.status] || application.status;

    card.innerHTML = `
      <div class="candidate-info">
        <span class="icon-token icon-purple icon-sm" aria-hidden="true">
          <i class="fa-regular fa-user"></i>
        </span>
        <div>
          <h3 class="text-md text-bold">${volunteer ? volunteer.name : 'Voluntário #' + application.volunteerId}</h3>
          <p class="text-xs text-muted">Inscrito em: ${formatDate(application.appliedAt)}</p>
          ${volunteer ? `<p class="text-xs text-muted">★ ${Number(volunteer.rating || 0).toFixed(1).replace('.', ',')} &nbsp;·&nbsp; ${volunteer.email}</p>` : ''}
        </div>
        <span class="tag tag-xs ${statusCls} candidate-status">${statusLabel}</span>
      </div>
      <div class="candidate-actions" data-card-actions></div>
    `;

    const actionsEl = card.querySelector('[data-card-actions]');

    if (application.status === 'pending') {
      const btnAccept = document.createElement('button');
      btnAccept.className = 'btn btn-primary btn-pad-xs';
      btnAccept.textContent = 'Aceitar';
      btnAccept.addEventListener('click', () => onAction(application, 'accepted', card));

      const btnReject = document.createElement('button');
      btnReject.className = 'btn btn-outline btn-pad-xs';
      btnReject.textContent = 'Recusar';
      btnReject.addEventListener('click', () => onAction(application, 'rejected', card));

      actionsEl.append(btnAccept, btnReject);
    } else if (application.status === 'accepted') {
      const btnReject = document.createElement('button');
      btnReject.className = 'btn btn-outline btn-pad-xs';
      btnReject.textContent = 'Recusar';
      btnReject.addEventListener('click', () => onAction(application, 'rejected', card));
      actionsEl.append(btnReject);
    } else if (application.status === 'rejected') {
      const btnAccept = document.createElement('button');
      btnAccept.className = 'btn btn-primary btn-pad-xs';
      btnAccept.textContent = 'Aceitar';
      btnAccept.addEventListener('click', () => onAction(application, 'accepted', card));
      actionsEl.append(btnAccept);
    }

    return card;
  };

  const init = async () => {
    const actionId = getActionId();
    const user = getLoggedUser();

    if (!actionId) {
      setText('[data-action-title]', 'Nenhuma ação selecionada.');
      return;
    }

    if (!user || user.type !== 1) {
      setText('[data-action-title]', 'Acesso restrito à ONG responsável.');
      return;
    }

    try {
      const [resAction, resApplications] = await Promise.all([
        fetch(`${API}/actions/${actionId}`),
        fetch(`${API}/applications?actionId=${actionId}`)
      ]);

      if (!resAction.ok) throw new Error('Ação não encontrada.');
      const action = await resAction.json();

      // Garante que a ONG logada é dona da ação
      if (String(action.ongId) !== String(user.id)) {
        setText('[data-action-title]', 'Acesso negado: esta ação não pertence à sua ONG.');
        return;
      }

      setText('[data-action-title]', action.title);
      setText('[data-action-meta]', `${action.vacancies} vagas · ${formatDate(action.date)}`);

      const applications = await resApplications.json();

      // Carrega dados dos voluntários de uma vez
      const volunteerIds = [...new Set(applications.map(a => a.volunteerId))];
      const volunteers = await Promise.all(
        volunteerIds.map(id => fetch(`${API}/volunteers/${id}`).then(r => r.ok ? r.json() : null))
      );
      const volunteerMap = Object.fromEntries(
        volunteers.filter(Boolean).map(v => [String(v.id), v])
      );

      const listPending  = find('[data-list-pending]');
      const listAccepted = find('[data-list-accepted]');
      const listRejected = find('[data-list-rejected]');

      const byStatus = { pending: [], accepted: [], rejected: [] };
      applications.forEach(app => {
        if (byStatus[app.status]) byStatus[app.status].push(app);
      });

      const onAction = async (application, newStatus, card) => {
        const btns = card.querySelectorAll('button');
        btns.forEach(b => b.disabled = true);

        try {
          const res = await fetch(`${API}/applications/${application.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          });

          if (!res.ok) throw new Error('Erro ao atualizar candidatura.');

          application.status = newStatus;

          // Move o card para a seção correta
          card.remove();
          const volunteer = volunteerMap[String(application.volunteerId)];
          const newCard = renderCard(application, volunteer, onAction);

          const targetList = newStatus === 'accepted' ? listAccepted : listRejected;
          const emptyMsg = targetList.querySelector('p');
          if (emptyMsg) emptyMsg.remove();
          targetList.appendChild(newCard);

          // Adiciona mensagem de vazio nas listas que ficaram sem cards
          [listPending, listAccepted, listRejected].forEach((list, i) => {
            const statuses = ['pending', 'accepted', 'rejected'];
            if (!list.querySelector('.candidate-card')) {
              list.innerHTML = '';
              renderEmpty(list, `Nenhuma candidatura ${STATUS_LABEL[statuses[i]].toLowerCase()}.`);
            }
          });

        } catch (err) {
          console.error(err);
          btns.forEach(b => b.disabled = false);
        }
      };

      // Renderiza cada seção
      const volunteer = (app) => volunteerMap[String(app.volunteerId)];

      if (!byStatus.pending.length)  renderEmpty(listPending,  'Nenhuma candidatura pendente.');
      else byStatus.pending.forEach(app => listPending.appendChild(renderCard(app, volunteer(app), onAction)));

      if (!byStatus.accepted.length) renderEmpty(listAccepted, 'Nenhuma candidatura aceita.');
      else byStatus.accepted.forEach(app => listAccepted.appendChild(renderCard(app, volunteer(app), onAction)));

      if (!byStatus.rejected.length) renderEmpty(listRejected, 'Nenhuma candidatura recusada.');
      else byStatus.rejected.forEach(app => listRejected.appendChild(renderCard(app, volunteer(app), onAction)));

    } catch (err) {
      console.error('Erro ao carregar candidaturas:', err);
      setText('[data-action-title]', 'Erro ao carregar dados.');
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();
