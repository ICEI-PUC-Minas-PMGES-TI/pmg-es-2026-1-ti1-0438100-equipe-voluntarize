(function () {
  const API = 'http://localhost:3000';

  const ASSETS = {
    action: '../../assets/images/action-people.svg',
    star: '../../assets/images/star.svg',
    reviewUser: '../../assets/images/review-user.svg'
  };

  const elements = {
    name: document.getElementById('volunteer-name'),
    meta: document.getElementById('volunteer-meta'),
    rating: document.getElementById('volunteer-rating'),
    followers: document.getElementById('volunteer-followers'),
    followButton: document.getElementById('follow-button'),
    storyTitle: document.getElementById('story-title'),
    story: document.getElementById('volunteer-story'),
    previousAction: document.getElementById('previous-action'),
    nextAction: document.getElementById('next-action'),
    actionsList: document.getElementById('actions-list'),
    reviewVolunteerName: document.getElementById('review-volunteer-name'),
    reviewsList: document.getElementById('reviews-list')
  };

  let allActions = [];
  let actionIndex = 0;

  const getVolunteerId = () => {
    const raw = new URLSearchParams(window.location.search).get('id');
    return raw ? Number(raw) : null;
  };

  const formatRating = (v) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const formatFollowers = (v) => v >= 1000 ? `${Math.round(v / 1000)}K` : String(v);
  const formatDate = (iso) => { const [y] = iso.split('-'); return y; };

  function getVisibleCount() {
    return window.matchMedia('(max-width: 840px)').matches ? 1 : 2;
  }

  function createIcon(src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    return img;
  }

  function renderActions() {
    if (!allActions.length) return;
    const visible = getVisibleCount();
    elements.actionsList.innerHTML = '';
    elements.previousAction.disabled = allActions.length <= visible;
    elements.nextAction.disabled = allActions.length <= visible;

    for (let i = 0; i < visible; i++) {
      const action = allActions[(actionIndex + i) % allActions.length];
      const card = document.createElement('article');
      card.className = 'action-card';

      const image = document.createElement('div');
      image.className = 'action-image';
      image.setAttribute('aria-hidden', 'true');
      image.appendChild(createIcon(ASSETS.action));
      const ratingSpan = document.createElement('span');
      ratingSpan.className = 'action-rating';
      ratingSpan.textContent = formatRating(action.rating || 0);
      ratingSpan.appendChild(createIcon(ASSETS.star));
      image.appendChild(ratingSpan);

      const title = document.createElement('h3');
      title.className = 'action-title';
      title.textContent = action.title;

      const desc = document.createElement('p');
      desc.className = 'action-description text-xs font-alt';
      desc.textContent = action.description;

      const link = document.createElement('a');
      link.className = 'btn btn-secondary btn-pad-xs btn-shadow-xs btn-border-thin';
      link.href = `../detalhes-vagas/detalhes.html?id=${action.id}`;
      link.textContent = 'Ver Detalhes';

      card.append(image, title, desc, link);
      elements.actionsList.appendChild(card);
    }
  }

  function renderReviews(reviews, volunteersMap) {
    elements.reviewsList.innerHTML = '';
    reviews.forEach((review) => {
      const author = volunteersMap[review.authorId];
      const card = document.createElement('a');
      card.className = 'review-card';
      card.href = author ? `./index.html?id=${author.id}` : '#';
      card.setAttribute('aria-label', `Ver avaliação de ${author ? author.name : 'Usuário'}`);

      const topline = document.createElement('div');
      topline.className = 'review-topline';

      const authorEl = document.createElement('h3');
      authorEl.className = 'review-author';
      authorEl.prepend(createIcon(ASSETS.reviewUser));
      authorEl.append(document.createTextNode(author ? author.name : 'Usuário'));

      const score = document.createElement('p');
      score.className = 'review-score';
      score.textContent = formatRating(review.rating);
      score.appendChild(createIcon(ASSETS.star));

      topline.append(authorEl, score);

      const text = document.createElement('p');
      text.className = 'review-text text-xs font-alt';
      text.textContent = review.comment;

      card.append(topline, text);
      elements.reviewsList.appendChild(card);
    });
  }

  async function init() {
    const volunteerId = getVolunteerId();
    if (!volunteerId) {
      console.error('Nenhum id de voluntário informado na URL.');
      return;
    }

    try {
      const [resVolunteer, resActions, resReviews, resAllVolunteers] = await Promise.all([
        fetch(`${API}/volunteers/${volunteerId}`),
        fetch(`${API}/actions`),
        fetch(`${API}/reviews?targetType=volunteer&targetId=${volunteerId}`),
        fetch(`${API}/volunteers`)
      ]);

      if (!resVolunteer.ok) throw new Error(`Voluntário ${volunteerId} não encontrado.`);

      const [volunteer, actions, reviews, allVolunteers] = await Promise.all([
        resVolunteer.json(),
        resActions.json(),
        resReviews.json(),
        resAllVolunteers.json()
      ]);

      // ações em que o voluntário participou
      allActions = actions.filter((a) => (a.participants || []).some((id) => String(id) === String(volunteerId)));

      const volunteersMap = Object.fromEntries(allVolunteers.map((v) => [v.id, v]));

      // cabeçalho
      document.title = `${volunteer.name} | Visualização Detalhada do Voluntário`;
      elements.name.textContent = volunteer.name;
      elements.rating.textContent = formatRating(volunteer.rating);
      elements.followers.textContent = formatFollowers(volunteer.followers || 0);
      elements.followButton.textContent = 'Seguir';

      elements.meta.innerHTML = '';
      const s1 = document.createElement('span');
      s1.textContent = `Voluntário(a) desde ${formatDate(volunteer.createdAt)}`;
      const s2 = document.createElement('span');
      s2.textContent = `Usuário(a) da Voluntarize desde ${formatDate(volunteer.createdAt)}`;
      elements.meta.append(s1, s2);

      // história (bio)
      elements.storyTitle.textContent = `Conheça um pouco mais sobre ${volunteer.name}`;
      elements.story.innerHTML = '';
      const bio = document.createElement('p');
      bio.textContent = volunteer.bio || 'Sem biografia disponível.';
      elements.story.appendChild(bio);

      elements.reviewVolunteerName.textContent = volunteer.name;

      renderActions();
      renderReviews(reviews, volunteersMap);

      elements.previousAction.addEventListener('click', () => {
        actionIndex = (actionIndex - 1 + allActions.length) % allActions.length;
        renderActions();
      });
      elements.nextAction.addEventListener('click', () => {
        actionIndex = (actionIndex + 1) % allActions.length;
        renderActions();
      });
      window.addEventListener('resize', renderActions);

      elements.followButton.addEventListener('click', () => {
        const seguindo = elements.followButton.textContent === 'Seguindo';
        elements.followButton.textContent = seguindo ? 'Seguir' : 'Seguindo';
        elements.followButton.setAttribute('aria-pressed', String(!seguindo));
      });

    } catch (error) {
      console.error('Erro ao carregar perfil do voluntário:', error);
    }
  }

  init();
})();
