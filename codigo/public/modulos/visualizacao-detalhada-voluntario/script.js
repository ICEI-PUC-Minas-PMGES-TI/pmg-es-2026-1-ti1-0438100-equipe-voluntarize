(function () {
  'use strict';

  const API = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';

  const MONTHS_BR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const qs = (id) => document.getElementById(id);

  const el = {
    name: qs('volunteer-name'),
    meta: qs('volunteer-meta'),
    rating: qs('volunteer-rating'),
    followers: qs('volunteer-followers'),
    followButton: qs('follow-button'),
    storyTitle: qs('story-title'),
    story: qs('volunteer-story'),
    prevAction: qs('previous-action'),
    nextAction: qs('next-action'),
    actionsList: qs('actions-list'),
    reviewName: qs('review-volunteer-name'),
    reviewsList: qs('reviews-list')
  };

  let allActions = [];
  let actionIndex = 0;
  let followersCount = 0;
  let currentFollowId = null;

  const getVolunteerId = () => {
    const raw = new URLSearchParams(window.location.search).get('id');
    return raw ? Number(raw) : null;
  };

  const getSession = () => {
    try { return JSON.parse(localStorage.getItem('usuarioLogado')) || null; }
    catch { return null; }
  };

  const fmt = (v) =>
    Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const fmtFollowers = (v) =>
    v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(v);

  const fmtDate = (iso) => {
    if (!iso) return '';
    const [y, m] = iso.split('-');
    const idx = parseInt(m, 10);
    if (!y || !idx || idx < 1 || idx > 12) return '';
    return `${MONTHS_BR[idx - 1]}. de ${y}`;
  };

  function updateFollowUI() {
    const following = currentFollowId !== null;
    el.followButton.innerHTML = following
      ? '<i class="fa-solid fa-check"></i> Seguindo'
      : '<i class="fa-solid fa-heart"></i> Seguir';
    el.followButton.setAttribute('aria-pressed', String(following));
    el.followers.textContent = fmtFollowers(followersCount);
  }

  const getCardWidth = () => {
    const card = el.actionsList.querySelector('.action-card');
    if (!card) return 0;
    return card.offsetWidth + (parseInt(getComputedStyle(el.actionsList).gap) || 12);
  };

  const getMaxIndex = () => Math.max(0, allActions.length - 2);

  function updateCarousel() {
    el.actionsList.style.transform = `translateX(-${actionIndex * getCardWidth()}px)`;
    el.prevAction.disabled = actionIndex === 0;
    el.nextAction.disabled = actionIndex >= getMaxIndex();
  }

  function renderActions() {
    el.actionsList.innerHTML = '';

    if (!allActions.length) {
      el.actionsList.innerHTML = '<p class="text-sm text-muted">Este voluntário ainda não participou de nenhuma ação.</p>';
      el.prevAction.disabled = true;
      el.nextAction.disabled = true;
      return;
    }

    allActions.forEach((action) => {
      const actionRating = action._avgRating !== null
        ? `<span class="tag tag-purple tag-xs card-rate"><i class="fa-solid fa-star"></i> ${fmt(action._avgRating)}</span>`
        : '';

      const imageContent = action.image
        ? `<img src="${action.image}" alt="${action.title}" />`
        : `<span class="action-placeholder-icon"><i class="fa-solid fa-hand-holding-heart"></i></span>`;

      const statusTag = action.status === 'completed'
        ? `<span class="tag tag-white tag-xs"><i class="fa-solid fa-flag-checkered"></i> Concluída</span>`
        : `<span class="tag tag-green tag-xs"><i class="fa-solid fa-circle-dot"></i> Aberta</span>`;

      const card = document.createElement('article');
      card.className = 'surface action-card';
      card.innerHTML = `
        <div class="action-image">
          ${imageContent}
          ${actionRating}
        </div>
        <div class="stack gap-2">
          ${statusTag}
          <h3 class="text-md text-bold">${action.title}</h3>
          <p class="text-sm text-muted font-alt">${action.description}</p>
          <a class="btn btn-secondary btn-pad-xs" href="../detalhes-vagas/detalhes.html?id=${action.id}">
            <i class="fa-solid fa-arrow-right"></i> Ver detalhes
          </a>
        </div>
      `;
      el.actionsList.appendChild(card);
    });

    updateCarousel();
  }

  function renderReviews(reviews, authorsMap) {
    el.reviewsList.innerHTML = '';

    if (!reviews.length) {
      el.reviewsList.innerHTML = '<p class="text-sm text-muted">Este voluntário ainda não possui avaliações.</p>';
      return;
    }

    reviews.forEach((review) => {
      const author = authorsMap[review.authorId];

      const starsHtml = Array.from({ length: 5 }, (_, i) =>
        `<i class="fa-${i < Math.round(review.rating) ? 'solid' : 'regular'} fa-star"></i>`
      ).join('');

      const card = document.createElement('article');
      card.className = 'surface review-card stack gap-2';
      card.innerHTML = `
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="icon-token icon-sm icon-purple">
              <i class="fa-regular fa-user"></i>
            </span>
            <strong class="text-sm">${author ? author.name : 'Usuário'}</strong>
          </div>
          <span class="tag tag-green tag-xs flex items-center gap-1">
            ${starsHtml} ${fmt(review.rating)}
          </span>
        </div>
        <p class="text-sm text-muted font-alt">${review.comment}</p>
      `;
      el.reviewsList.appendChild(card);
    });
  }

  async function handleFollowClick(volunteerId) {
    const session = getSession();
    if (!session) {
      window.location.href = '../login/login.html';
      return;
    }

    el.followButton.disabled = true;

    try {
      if (currentFollowId !== null) {
        const res = await fetch(`${API}/follows/${currentFollowId}`, { method: 'DELETE' });
        if (res.ok) {
          currentFollowId = null;
          followersCount = Math.max(0, followersCount - 1);
        }
      } else {
        const followerType = session.type === 0 ? 'volunteer' : 'ong';
        const res = await fetch(`${API}/follows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            followerType,
            followerId: Number(session.id),
            targetType: 'volunteer',
            targetId: volunteerId,
            createdAt: new Date().toISOString().split('T')[0]
          })
        });
        if (res.ok) {
          const nf = await res.json();
          currentFollowId = nf.id;
          followersCount++;
        }
      }
      updateFollowUI();
    } catch (err) {
      console.error('Erro ao atualizar seguimento:', err);
    } finally {
      el.followButton.disabled = false;
    }
  }

  async function init() {
    const volunteerId = getVolunteerId();
    if (!volunteerId) {
      console.error('ID de voluntário não informado na URL.');
      return;
    }

    const session = getSession();

    try {
      const requests = [
        fetch(`${API}/volunteers/${volunteerId}`),
        fetch(`${API}/actions`),
        fetch(`${API}/reviews?targetType=volunteer&targetId=${volunteerId}`),
        fetch(`${API}/volunteers`),
        fetch(`${API}/ongs`),
        fetch(`${API}/follows?targetType=volunteer&targetId=${volunteerId}`)
      ];

      if (session) {
        const ft = session.type === 0 ? 'volunteer' : 'ong';
        requests.push(
          fetch(`${API}/follows?followerType=${ft}&followerId=${session.id}&targetType=volunteer&targetId=${volunteerId}`)
        );
      }

      const responses = await Promise.all(requests);

      if (!responses[0].ok) {
        el.name.textContent = 'Voluntário não encontrado';
        return;
      }

      const data = await Promise.all(responses.map(r => r.json()));
      const volunteer = data[0];
      const actions = data[1] || [];
      const reviews = data[2] || [];
      const allVols = data[3] || [];
      const allOngs = data[4] || [];
      const allFollows = data[5] || [];
      const myFollows = data[6] || [];

      followersCount = allFollows.length;
      currentFollowId = myFollows.length > 0 ? myFollows[0].id : null;

      const authorsMap = {};
      allVols.forEach(v => { authorsMap[v.id] = v; });
      allOngs.forEach(o => { if (!authorsMap[o.id]) authorsMap[o.id] = o; });

      const ratingsByAction = {};
      reviews.forEach(r => {
        if (r.actionId == null) return;
        if (!ratingsByAction[r.actionId]) ratingsByAction[r.actionId] = [];
        ratingsByAction[r.actionId].push(Number(r.rating));
      });

      allActions = actions
        .filter(a => (a.participants || []).some(id => String(id) === String(volunteerId)))
        .map(a => {
          const ratings = ratingsByAction[a.id];
          const _avgRating = ratings && ratings.length
            ? ratings.reduce((s, v) => s + v, 0) / ratings.length
            : null;
          return { ...a, _avgRating };
        });

      document.title = `${volunteer.name} | Voluntarize`;

      el.name.textContent = volunteer.name;

      el.meta.innerHTML = '';
      const s1 = document.createElement('span');
      s1.textContent = `Voluntário(a) desde ${fmtDate(volunteer.createdAt)}`;
      const s2 = document.createElement('span');
      s2.textContent = `Usuário(a) da Voluntarize desde ${fmtDate(volunteer.createdAt)}`;
      el.meta.append(s1, s2);

      el.rating.textContent = fmt(volunteer.rating);

      updateFollowUI();

      el.storyTitle.textContent = `Conheça um pouco mais sobre ${volunteer.name}`;

      el.story.innerHTML = '';
      const bio = document.createElement('p');
      bio.textContent = volunteer.bio || 'Sem biografia disponível.';
      el.story.appendChild(bio);

      el.reviewName.textContent = volunteer.name;

      renderActions();
      renderReviews(reviews, authorsMap);

      el.prevAction.addEventListener('click', () => {
        if (actionIndex > 0) { actionIndex--; updateCarousel(); }
      });
      el.nextAction.addEventListener('click', () => {
        if (actionIndex < getMaxIndex()) { actionIndex++; updateCarousel(); }
      });
      window.addEventListener('resize', () => {
        actionIndex = Math.min(actionIndex, getMaxIndex());
        updateCarousel();
      });

      el.followButton.addEventListener('click', () => handleFollowClick(volunteerId));

    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    }
  }

  init();
})();
