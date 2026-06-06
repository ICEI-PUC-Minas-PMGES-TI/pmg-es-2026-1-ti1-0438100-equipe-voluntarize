(function () {
  const API_BASE = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';
  
function api(path) { return (API_BASE ? API_BASE : '') + path; }

  const find = (selector) => document.querySelector(selector);

  const setText = (selector, value) => {
    const element = find(selector);

    if (element) {
      element.textContent = value;
    }
  };

  const getActionIdFromUrl = () => {
    if (!readIdFromUrl) {
      return null;
    }

    return readIdFromUrl({
      paramNames: ["id", "acaoId", "vagaId"],
      defaultValue: null
    });
  };

  const getPageData = (database) => {
    const actionId = getActionIdFromUrl();
    const action = findById ? findById(database.actions, actionId) : null;

    if (!action) {
      return null;
    }

    const ong = database.ongs.find((item) => item.id === action.ongId);
    const participants = action.participants
      .map((participantId) => database.volunteers.find((volunteer) => volunteer.id === participantId))
      .filter(Boolean);

    return { action, ong, participants };
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatRating = (rating) => {
    return rating.toFixed(1).replace(".", ",");
  };

  const formatFollowers = (followers) => {
    if (followers >= 1000) {
      return `${Math.round(followers / 1000)}K`;
    }

    return String(followers);
  };

  const countActionViews = (action) => {
    const storageKey = `voluntarize:action-views:${action.id}`;
    const baseViews = Number.isFinite(action.views) ? action.views : 0;
    const savedViews = Number(localStorage.getItem(storageKey));
    const nextViews = Number.isFinite(savedViews) ? savedViews + 1 : baseViews + 1;

    localStorage.setItem(storageKey, String(nextViews));
    return nextViews;
  };

  const createAvatar = () => {
    const avatar = document.createElement("span");
    avatar.className = "icon-token icon-purple entity-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20 21a8 8 0 0 0-16 0"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `;
    return avatar;
  };

  const renderTags = (tags) => {
    const tagsContainer = find("[data-action-tags]");
    tagsContainer.innerHTML = "";

    tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag tag-green tag-xs tag-shadow-xs";
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });
  };

  const renderParticipants = (participants) => {
    const participantsContainer = find("[data-participants]");
    participantsContainer.innerHTML = "";

    if (!participants.length) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "empty-message";
      emptyMessage.textContent = "Nenhum participante inscrito até o momento.";
      participantsContainer.appendChild(emptyMessage);
      return;
    }

    participants.forEach((participant) => {
      const card = document.createElement("article");
      card.className = "surface surface-sm grid items-center gap-2 participant-card";

      const info = document.createElement("div");
      info.className = "participant-card__info";

      const name = document.createElement("h3");
      name.textContent = participant.name;

      const stats = document.createElement("p");
      stats.textContent = `${formatRating(participant.rating)} | ${formatFollowers(participant.followers)} seguidores`;

      const button = document.createElement("button");
      button.className = "btn btn-primary btn-pad-xs";
      button.type = "button";
      button.textContent = "Ver perfil";

      info.append(name, stats);
      card.append(createAvatar(), info, button);
      participantsContainer.appendChild(card);
    });
  };

  const renderDetails = (database) => {
    const pageData = getPageData(database);

    if (!pageData || !pageData.ong) {
      redirectToLegacyUrl();
      return;
    }

    const { action, ong, participants } = pageData;

    setText("[data-action-title]", action.title);
    setText("[data-action-location]", action.location);
    setText("[data-action-date]", formatDate(action.date));
    setText("[data-action-description]", action.description);
    setText("[data-ong-name]", ong.name);
    setText("[data-ong-responsible]", ong.responsibleName);
    setText("[data-ong-rating]", formatRating(ong.rating));
    setText("[data-ong-followers]", formatFollowers(ong.followers));
    setText("[data-action-views]", countActionViews(action));

    renderTags(action.tags);
    renderParticipants(participants);

    // configurar botão 'Ver perfil da ONG' para redirecionar usando o helper
    try {
      const organizerBtn = find('.organizer-profile');
      if (organizerBtn) {
        const profileUrl = buildUrlWithId
          ? buildUrlWithId('../visualizacao-detalhada-ong/index.html', ong.id)
          : `../visualizacao-detalhada-ong/index.html?id=${ong.id}`;

        organizerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = profileUrl;
        });
      }
    } catch (err) {
      // não bloquear renderização se helper ausente
      // console.warn('Não foi possível configurar botão de perfil:', err);
    }
  };

  const loadDetails = async () => {
    try {
      const [resActions, resOngs, resVolunteers] = await Promise.all([
        fetch(api('/actions')),
        fetch(api('/ongs')),
        fetch(api('/volunteers'))
      ]);

      const [actions, ongs, volunteers] = await Promise.all([
        resActions.json(),
        resOngs.json(),
        resVolunteers.json()
      ]);

      const database = { actions, ongs, volunteers };
      renderDetails(database);
    } catch (error) {
      console.error("Não foi possível carregar o db.json.", error);
      elements.name.textContent = "Vaga não encontrada";
      elements.meta.textContent = "Verifique o identificador informado na URL.";
      elements.rating.textContent = "-";
      elements.followers.textContent = "0";
      elements.followButton.disabled = true;
      elements.storyTitle.textContent = "Sem dados disponíveis";
      elements.story.textContent = "Não foi possível localizar a vaga solicitada.";
      elements.actionsList.textContent = "";
      elements.reviewsList.textContent = "";
    }
  };

  loadDetails();

  async function carregarDb() {
    const [resActions, resOngs, resVolunteers] = await Promise.all([
      fetch(api('/actions')),
      fetch(api('/ongs')),
      fetch(api('/volunteers'))
    ]);

    const [actions, ongs, volunteers] = await Promise.all([
      resActions.json(),
      resOngs.json(),
      resVolunteers.json()
    ]);

    const db = { actions, ongs, volunteers };
    return db;
  }
  document.addEventListener('DOMContentLoaded', () => {
    carregarDb().catch(err => console.error('Erro ao carregar db.json:', err));
  });

})();

