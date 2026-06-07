document.addEventListener('DOMContentLoaded', async () => {
  const API = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  const getOngId = () => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('id');
    return raw ? Number(raw) : null;
  };

  const formatRating = (r) => Number(r).toFixed(1).replace('.', ',');
  const formatFollowers = (n) => n >= 1000000
    ? (n / 1000000).toFixed(1).replace('.0', '') + 'M'
    : n >= 1000 ? Math.round(n / 1000) + 'k' : String(n);
  const formatDate = (iso) => { const [y] = iso.split('-'); return y; };

  const ongId = getOngId();
  if (!ongId) { console.error('Nenhum id de ONG informado na URL.'); return; }

  try {
    const [resOng, resActions, resReviews, resVolunteers] = await Promise.all([
      fetch(`${API}/ongs/${ongId}`),
      fetch(`${API}/actions?ongId=${ongId}`),
      fetch(`${API}/reviews?targetType=ong&targetId=${ongId}`),
      fetch(`${API}/volunteers`)
    ]);

    if (!resOng.ok) throw new Error(`ONG ${ongId} não encontrada.`);

    const [ong, actions, reviews, volunteers] = await Promise.all([
      resOng.json(),
      resActions.json(),
      resReviews.json(),
      resVolunteers.json()
    ]);

    // Cabeçalho
    setText('[data-ong-name]', ong.name);
    setText('[data-ong-responsible]', `Por: ${ong.responsibleName}`);
    setText('[data-ong-since]', `Desde ${formatDate(ong.createdAt)} na Voluntarize`);
    setText('[data-ong-rating]', `${formatRating(ong.rating)} ⭐`);
    setText('[data-ong-followers]', `👥 ${formatFollowers(ong.followers || 0)} Seguidores`);
    setText('[data-ong-description]', ong.description);

    // Botão seguir
    const btnSeguir = document.querySelector('.btn-seguir');
    if (btnSeguir) {
      let seguindo = false;
      btnSeguir.addEventListener('click', () => {
        seguindo = !seguindo;
        btnSeguir.textContent = seguindo ? 'Seguindo' : 'Seguir';
        btnSeguir.style.backgroundColor = seguindo ? '#28a745' : '';
        btnSeguir.style.color = seguindo ? '#ffffff' : '';
      });
    }

    // Ações
    const actionsContainer = document.querySelector('[data-actions-list]');
    if (actionsContainer) {
      actionsContainer.innerHTML = '';
      if (!actions.length) {
        actionsContainer.innerHTML = '<p class="text-sm text-muted">Nenhuma ação registrada.</p>';
      } else {
        actions.forEach((action) => {
          const card = document.createElement('article');
          card.className = 'surface action-card';
          card.innerHTML = `
            <div class="action-image">
              <span class="tag tag-purple tag-xs card-rate">${formatRating(action.rating || 0)} ⭐</span>
            </div>
            <div class="stack">
              <h3 class="text-lg text-bold">${action.title}</h3>
              <p class="text-sm text-muted font-alt">${action.description}</p>
              <a class="btn btn-secondary btn-pad-xs" href="../detalhes-vagas/detalhes.html?id=${action.id}">Ver detalhes</a>
            </div>
          `;
          actionsContainer.appendChild(card);
        });
      }
    }

    // Reviews
    const reviewsContainer = document.querySelector('[data-reviews-list]');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = '';
      if (!reviews.length) {
        reviewsContainer.innerHTML = '<p class="text-sm text-muted">Nenhuma avaliação ainda.</p>';
      } else {
        reviews.forEach((review) => {
          const author = volunteers.find((v) => v.id === review.authorId);
          const card = document.createElement('article');
          card.className = 'surface review-card';
          card.innerHTML = `
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="icon-token icon-sm icon-purple"><i class="fa-regular fa-user"></i></span>
                <strong>${author ? author.name : 'Usuário'}</strong>
              </div>
              <span class="tag tag-green tag-xs">${formatRating(review.rating)} ⭐</span>
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
