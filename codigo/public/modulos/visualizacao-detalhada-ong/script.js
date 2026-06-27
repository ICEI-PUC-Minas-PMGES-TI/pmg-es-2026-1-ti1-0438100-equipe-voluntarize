document.addEventListener('DOMContentLoaded', async () => {
  const API = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';

  const getOngId = () => {
    const raw = new URLSearchParams(window.location.search).get('id');
    return raw ? Number(raw) : null;
  };

  const formatRating = (r) => Number(r).toFixed(1).replace('.', ',');

  const formatFollowers = (n) => {
    n = Number(n);
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (n >= 1000) return Math.round(n / 1000) + 'k';
    return String(n);
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const [y, m] = iso.split('-');
    const months = ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.',
      'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'];
    return `${months[parseInt(m, 10) - 1]} de ${y}`;
  };

  const ongId = getOngId();
  if (!ongId) { console.error('Nenhum id de ONG informado na URL.'); return; }

  const usuario = (() => {
    try { return JSON.parse(localStorage.getItem('usuarioLogado')) || null; }
    catch (e) { return null; }
  })();

  try {
    const [resOng, resActions, resReviews, resVolunteers, resFollows] = await Promise.all([
      fetch(`${API}/ongs/${ongId}`),
      fetch(`${API}/actions?ongId=${ongId}`),
      fetch(`${API}/reviews?targetType=ong&targetId=${ongId}`),
      fetch(`${API}/volunteers`),
      fetch(`${API}/follows?targetType=ong&targetId=${ongId}`)
    ]);

    if (!resOng.ok) throw new Error(`ONG ${ongId} não encontrada.`);

    const [ong, actions, reviews, volunteers, follows] = await Promise.all([
      resOng.json(), resActions.json(), resReviews.json(), resVolunteers.json(), resFollows.json()
    ]);

    const nameEl = document.querySelector('[data-ong-name]');
    if (nameEl) nameEl.textContent = ong.name;

    const responsibleEl = document.querySelector('[data-ong-responsible]');
    if (responsibleEl) responsibleEl.textContent = `Por: ${ong.responsibleName}`;

    const sinceEl = document.querySelector('[data-ong-since]');
    if (sinceEl) sinceEl.textContent = `Desde ${formatDate(ong.createdAt)} na Voluntarize`;

    const ratingEl = document.querySelector('[data-ong-rating]');
    if (ratingEl) ratingEl.innerHTML = `<i class="fa-solid fa-star"></i> ${formatRating(ong.rating)}`;

    let currentFollowersCount = follows.length;
    const followersEl = document.querySelector('[data-ong-followers]');

    const renderFollowers = () => {
      if (followersEl) {
        followersEl.innerHTML = `<i class="fa-solid fa-users"></i> ${formatFollowers(currentFollowersCount)} Seguidores`;
      }
    };
    renderFollowers();

    const avatarEl = document.querySelector('[data-ong-avatar]');
    if (avatarEl && ong.logo) {
      avatarEl.innerHTML = `<img src="${ong.logo}" alt="${ong.name}" class="ong-logo-img" />`;
    }

    const descEl = document.querySelector('[data-ong-description]');
    if (descEl) descEl.textContent = ong.description;

    const btnSeguir = document.querySelector('.btn-seguir');
    if (btnSeguir) {
      let followId = null;
      let seguindo = false;

      if (usuario && usuario.type === 0) {
        const resMyFollow = await fetch(
          `${API}/follows?followerType=volunteer&followerId=${usuario.id}&targetType=ong&targetId=${ongId}`
        );
        const myFollows = await resMyFollow.json();
        if (myFollows.length > 0) {
          seguindo = true;
          followId = myFollows[0].id;
        }
      }

      const updateBtn = () => {
        if (seguindo) {
          btnSeguir.innerHTML = '<i class="fa-solid fa-user-check"></i> Seguindo';
          btnSeguir.classList.remove('btn-secondary');
          btnSeguir.classList.add('btn-outline');
        } else {
          btnSeguir.innerHTML = '<i class="fa-solid fa-user-plus"></i> Seguir';
          btnSeguir.classList.remove('btn-outline');
          btnSeguir.classList.add('btn-secondary');
        }
      };
      updateBtn();

      btnSeguir.addEventListener('click', async () => {
        if (!usuario || usuario.type !== 0) return;

        if (!seguindo) {
          const res = await fetch(`${API}/follows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              followerType: 'volunteer',
              followerId: usuario.id,
              targetType: 'ong',
              targetId: ongId,
              createdAt: new Date().toISOString().split('T')[0]
            })
          });
          const follow = await res.json();
          followId = follow.id;
          seguindo = true;
          currentFollowersCount++;
        } else {
          await fetch(`${API}/follows/${followId}`, { method: 'DELETE' });
          followId = null;
          seguindo = false;
          currentFollowersCount = Math.max(0, currentFollowersCount - 1);
        }

        updateBtn();
        renderFollowers();
      });
    }

    const actionRatings = {};
    reviews.forEach((r) => {
      const key = Number(r.actionId);
      if (!key) return;
      if (!actionRatings[key]) actionRatings[key] = [];
      actionRatings[key].push(r.rating);
    });

    const getActionRating = (id) => {
      const ratings = actionRatings[Number(id)];
      if (!ratings || !ratings.length) return null;
      return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    };

    const actionsContainer = document.querySelector('[data-actions-list]');
    const prevBtn = document.querySelector('[data-actions-prev]');
    const nextBtn = document.querySelector('[data-actions-next]');

    let actionIndex = 0;

    const getCardWidth = () => {
      const card = actionsContainer.querySelector('.action-card');
      if (!card) return 0;
      return card.offsetWidth + (parseInt(getComputedStyle(actionsContainer).gap) || 12);
    };

    const getMaxIndex = () => Math.max(0, actions.length - 2);

    const updateCarousel = () => {
      actionsContainer.style.transform = `translateX(-${actionIndex * getCardWidth()}px)`;
      if (prevBtn) prevBtn.disabled = actionIndex === 0;
      if (nextBtn) nextBtn.disabled = actionIndex >= getMaxIndex();
    };

    if (actionsContainer) {
      if (!actions.length) {
        actionsContainer.innerHTML = '<p class="text-sm text-muted">Nenhuma ação registrada para esta ONG.</p>';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
      } else {
        actions.forEach((action) => {
          const actionRating = getActionRating(action.id);
          const ratingHtml = actionRating !== null
            ? `<span class="tag tag-purple tag-xs card-rate"><i class="fa-solid fa-star"></i> ${formatRating(actionRating)}</span>`
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
              ${ratingHtml}
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
          actionsContainer.appendChild(card);
        });

        updateCarousel();

        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            if (actionIndex > 0) { actionIndex--; updateCarousel(); }
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (actionIndex < getMaxIndex()) { actionIndex++; updateCarousel(); }
          });
        }
        window.addEventListener('resize', () => {
          actionIndex = Math.min(actionIndex, getMaxIndex());
          updateCarousel();
        });
      }
    }

    const reviewsContainer = document.querySelector('[data-reviews-list]');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = '';

      if (!reviews.length) {
        reviewsContainer.innerHTML = '<p class="text-sm text-muted">Nenhuma avaliação ainda.</p>';
      } else {
        reviews.forEach((review) => {
          const author = volunteers.find((v) => String(v.id) === String(review.authorId));

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
                ${starsHtml} ${formatRating(review.rating)}
              </span>
            </div>
            <p class="text-sm text-muted font-alt">${review.comment}</p>
          `;
          reviewsContainer.appendChild(card);
        });
      }
    }

  } catch (error) {
    console.error('Erro ao carregar perfil da ONG:', error);
  }
});
