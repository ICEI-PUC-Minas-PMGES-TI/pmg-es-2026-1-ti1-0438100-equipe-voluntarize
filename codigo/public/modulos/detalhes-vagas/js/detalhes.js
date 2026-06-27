(function () {
  const API = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';

  const find = (selector) => document.querySelector(selector);
  const setText = (selector, value) => { const el = find(selector); if (el) el.textContent = value; };

  const getActionId = () => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('id') || params.get('acaoId') || params.get('vagaId');
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

  const formatToday = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const setFavoriteFeedback = (message, isError = false) => {
    const feedback = find('[data-favorite-feedback]');
    if (!feedback) return;
    feedback.textContent = message;
    feedback.style.color = isError ? '#8f3232' : '';
  };

  const renderFavoriteButton = (btn, favorites, user, busy = false) => {
    if (!btn) return;
    const isVolunteer = user && user.type === 0;
    const isFavorite = favorites.length > 0;

    btn.disabled = !isVolunteer || busy;
    btn.classList.toggle('btn-secondary', isFavorite);
    btn.classList.toggle('btn-outline', !isFavorite);
    btn.textContent = isVolunteer
      ? (isFavorite ? 'Favoritada' : 'Favoritar')
      : 'Entre para favoritar';
    btn.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
    btn.setAttribute(
      'aria-label',
      isFavorite ? 'Remover vaga dos favoritos' : 'Adicionar vaga aos favoritos'
    );
  };

  const setupFavoriteButton = async (actionId, user) => {
    const btn = find('[data-favorite-button]');
    if (!btn) return;

    let favorites = [];
    let busy = false;
    let loadFailed = false;
    const isVolunteer = user && user.type === 0;

    renderFavoriteButton(btn, favorites, user);

    if (!isVolunteer) {
      setFavoriteFeedback('Faça login como voluntário para salvar esta vaga.');
      return;
    }

    try {
      busy = true;
      renderFavoriteButton(btn, favorites, user, busy);
      const response = await fetch(`${API}/favorites?volunteerId=${user.id}&actionId=${actionId}`);
      if (!response.ok) throw new Error('Erro ao consultar favoritos.');
      favorites = await response.json();
    } catch (error) {
      loadFailed = true;
      console.error(error);
      setFavoriteFeedback('Não foi possível consultar seus favoritos.', true);
    } finally {
      busy = false;
      renderFavoriteButton(btn, favorites, user);
    }

    if (loadFailed) {
      btn.disabled = true;
      return;
    }

    btn.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      renderFavoriteButton(btn, favorites, user, busy);
      setFavoriteFeedback('');

      try {
        if (favorites.length) {
          const responses = await Promise.all(
            favorites.map(favorite => fetch(`${API}/favorites/${favorite.id}`, { method: 'DELETE' }))
          );
          if (responses.some(response => !response.ok)) throw new Error('Erro ao remover favorito.');
          favorites = [];
          setFavoriteFeedback('Vaga removida dos favoritos.');
        } else {
          const queryResponse = await fetch(`${API}/favorites?volunteerId=${user.id}&actionId=${actionId}`);
          if (!queryResponse.ok) throw new Error('Erro ao verificar favorito existente.');
          const existingFavorites = await queryResponse.json();

          if (existingFavorites.length) {
            favorites = existingFavorites;
            setFavoriteFeedback('Esta vaga já estava nos seus favoritos.');
            return;
          }

          const response = await fetch(`${API}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              volunteerId: user.id,
              actionId,
              createdAt: formatToday()
            })
          });
          if (!response.ok) throw new Error('Erro ao adicionar favorito.');
          favorites = [await response.json()];
          setFavoriteFeedback('Vaga adicionada aos favoritos.');
        }
      } catch (error) {
        console.error(error);
        setFavoriteFeedback('Não foi possível atualizar o favorito.', true);
      } finally {
        busy = false;
        renderFavoriteButton(btn, favorites, user);
      }
    });
  };

  const renderSignupButton = (btn, application, action, user) => {
    if (!btn) return;
    const isVolunteer = user && user.type === 0;
    const isOpen = action.status === 'open';
    const hasApplication = !!application;

    btn.disabled = !isVolunteer || !isOpen;
    btn.textContent = hasApplication ? 'Cancelar inscrição' : 'Inscrever-se';
    btn.classList.toggle('btn-danger', hasApplication);
    btn.classList.toggle('btn-primary', !hasApplication);
    btn.dataset.applicationId = hasApplication ? application.id : '';
  };

  const formatDate = (date) => { const [y, m, d] = date.split('-'); return `${d}/${m}/${y}`; };
  const formatRating = (r) => Number(r).toFixed(1).replace('.', ',');
  const formatFollowers = (n) => n >= 1000 ? `${Math.round(n / 1000)}K` : String(n);

  const incrementViews = async (action) => {
    const currentViews = Number.isFinite(action.views) ? action.views : 0;

    const response = await fetch(`${API}/actions/${action.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ views: currentViews + 1 })
    });

    if (!response.ok) {
      throw new Error(`Não foi possível atualizar as visualizações da ação ${action.id}.`);
    }

    const updatedAction = await response.json();
    return Number.isFinite(updatedAction.views) ? updatedAction.views : currentViews + 1;
  };

  const renderTags = (tags) => {
    const container = find('[data-action-tags]');
    if (!container) return;
    container.innerHTML = '';
    tags.forEach((tag) => {
      const el = document.createElement('span');
      el.className = 'tag tag-green tag-xs tag-shadow-xs';
      el.textContent = tag;
      container.appendChild(el);
    });
  };

  const renderParticipants = (participants) => {
    const container = find('[data-participants]');
    if (!container) return;
    container.innerHTML = '';
    if (!participants.length) {
      const p = document.createElement('p');
      p.className = 'empty-message';
      p.textContent = 'Nenhum participante inscrito até o momento.';
      container.appendChild(p);
      return;
    }
    participants.forEach((participant) => {
      const card = document.createElement('article');
      card.className = 'surface surface-sm grid items-center gap-2 participant-card';
      const avatar = document.createElement('span');
      avatar.className = 'icon-token icon-purple entity-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
      const info = document.createElement('div');
      info.className = 'participant-card__info';
      const name = document.createElement('h3');
      name.textContent = participant.name;
      const stats = document.createElement('p');
      stats.textContent = `${formatRating(participant.rating)} | ${formatFollowers(participant.followers || 0)} seguidores`;
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary btn-pad-xs';
      btn.type = 'button';
      btn.textContent = 'Ver perfil';
      btn.addEventListener('click', () => {
        window.location.href = `../visualizacao-detalhada-voluntario/index.html?id=${participant.id}`;
      });
      info.append(name, stats);
      card.append(avatar, info, btn);
      container.appendChild(card);
    });
  };

  const loadDetails = async () => {
    const actionId = getActionId();
    if (!actionId) {
      console.error('Nenhum id de ação informado na URL.');
      return;
    }

    const user = getLoggedUser();

    try {
      const resAction = await fetch(`${API}/actions/${actionId}`);
      if (!resAction.ok) throw new Error(`Ação ${actionId} não encontrada.`);
      const action = await resAction.json();

      const resOng = await fetch(`${API}/ongs/${action.ongId}`);
      if (!resOng.ok) throw new Error(`ONG da ação não encontrada.`);
      const ong = await resOng.json();

      const participantResponses = await Promise.all(
        (action.participants || []).map((id) => fetch(`${API}/volunteers/${id}`))
      );
      const participants = (await Promise.all(
        participantResponses.map((r) => r.ok ? r.json() : null)
      )).filter(Boolean);

      setText('[data-action-title]', action.title);
      setText('[data-action-location]', action.location);
      setText('[data-action-date]', formatDate(action.date));
      setText('[data-action-description]', action.description);
      setText('[data-ong-name]', ong.name);
      setText('[data-ong-responsible]', ong.responsibleName);
      setText('[data-ong-rating]', formatRating(ong.rating));
      setText('[data-ong-followers]', formatFollowers(ong.followers || 0));

      renderTags(action.tags || []);
      renderParticipants(participants);
      setupFavoriteButton(actionId, user);

      try {
        const nextViews = await incrementViews(action);
        setText('[data-action-views]', nextViews);
      } catch (viewError) {
        console.error('Erro ao contabilizar visualização:', viewError);
        setText('[data-action-views]', (Number.isFinite(action.views) ? action.views : 0) + 1);
      }

      const organizerBtn = find('.organizer-profile');
      if (organizerBtn) {
        organizerBtn.addEventListener('click', () => {
          window.location.href = `../visualizacao-detalhada-ong/index.html?id=${ong.id}`;
        });
      }

      // Botão de inscrição
      const btn = find('[data-signup-button]');
      if (!btn) return;

      let currentApplication = null;

      if (user && user.type === 0) {
        const resApps = await fetch(`${API}/applications?volunteerId=${user.id}&actionId=${actionId}`);
        if (resApps.ok) {
          const apps = await resApps.json();
          currentApplication = apps.find(a => a.status !== 'rejected') || null;
        }
      }

      renderSignupButton(btn, currentApplication, action, user);

      btn.addEventListener('click', async () => {
        if (!user || user.type !== 0) return;
        btn.disabled = true;

        try {
          if (currentApplication) {
            const res = await fetch(`${API}/applications/${currentApplication.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Erro ao cancelar inscrição.');
            currentApplication = null;
          } else {
            const res = await fetch(`${API}/applications`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                volunteerId: user.id,
                actionId: actionId,
                status: 'pending',
                appliedAt: formatToday(),
                confirmedAt: null,
                attended: false
              })
            });
            if (!res.ok) throw new Error('Erro ao realizar inscrição.');
            currentApplication = await res.json();
          }
          renderSignupButton(btn, currentApplication, action, user);
        } catch (err) {
          console.error(err);
          btn.disabled = false;
        }
      });

    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    }
  };

  loadDetails();
})();
