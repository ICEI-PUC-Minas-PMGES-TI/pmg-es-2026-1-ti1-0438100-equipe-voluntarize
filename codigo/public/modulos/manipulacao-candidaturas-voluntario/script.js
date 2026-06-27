import database from "../../db/estrutura_dados_sprint_2.json" with { type: "json" };

(function () {
  const APPLICATIONS_KEY = "voluntarize_candidaturas_voluntario_sprint_2";
  const ACTION_KEY = "actionId";
  const CURRENT_USER_KEY = "usuarioCorrente";

  const state = {
    actionId: 1,
    applications: [],
    currentUser: null
  };

  const find = (selector) => document.querySelector(selector);

  const setText = (selector, value) => {
    const element = find(selector);

    if (element) {
      element.textContent = value;
    }
  };

  const normalizeId = (value) => String(value ?? "");

  const idsEqual = (firstValue, secondValue) => normalizeId(firstValue) === normalizeId(secondValue);

  const clone = (data) => JSON.parse(JSON.stringify(data));

  const readJson = (storage, fallback) => {
    try {
      const parsed = JSON.parse(storage || "");
      return parsed || fallback;
    } catch (error) {
      return fallback;
    }
  };

  const saveApplications = () => {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(state.applications));
  };

  const loadApplications = () => {
    const saved = localStorage.getItem(APPLICATIONS_KEY);

    if (!saved) {
      state.applications = clone(database.applications || []);
      saveApplications();
      return;
    }

    const applications = readJson(saved, []);
    state.applications = Array.isArray(applications) ? applications : clone(database.applications || []);
  };

  const getCurrentUser = () => {
    const savedUser = readJson(sessionStorage.getItem(CURRENT_USER_KEY), null);
    const fallback = { id: "voluntario-local", nome: "Voluntário", tipo: "voluntario" };
    const user = savedUser && savedUser.id ? savedUser : fallback;

    return {
      id: user.id,
      name: user.nome || user.name || "Voluntário",
      type: user.tipo || "voluntario"
    };
  };

  const getActionIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const rawId = params.get("id") || params.get("acaoId") || params.get("vagaId") || localStorage.getItem(ACTION_KEY);
    const actionId = Number(rawId);

    return Number.isInteger(actionId) && actionId > 0 ? actionId : 1;
  };

  const getAction = () => {
    return database.actions.find((action) => action.id === state.actionId) || database.actions[0];
  };

  const getOng = (action) => {
    return database.ongs.find((ong) => ong.id === action.ongId);
  };

  const getCurrentApplication = () => {
    return state.applications.find((application) => {
      return application.actionId === state.actionId
        && idsEqual(application.volunteerId, state.currentUser.id)
        && application.status !== "rejected";
    });
  };

  const getActionApplications = (actionId) => {
    return state.applications.filter((application) => {
      return application.actionId === actionId && application.status !== "rejected";
    });
  };

  const getVolunteer = (volunteerId) => {
    if (idsEqual(volunteerId, state.currentUser.id)) {
      return {
        id: state.currentUser.id,
        name: state.currentUser.name,
        rating: 0
      };
    }

    return database.volunteers.find((volunteer) => idsEqual(volunteer.id, volunteerId));
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatRating = (rating) => {
    return Number(rating || 0).toFixed(1).replace(".", ",");
  };

  const formatFollowers = (ong) => {
    if (typeof ong.followers === "number") {
      return ong.followers >= 1000 ? `${Math.round(ong.followers / 1000)}K` : String(ong.followers);
    }

    const followers = (database.follows || []).filter((follow) => {
      return follow.targetType === "ong" && idsEqual(follow.targetId, ong.id);
    }).length;

    return String(followers);
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

  const renderParticipants = (actionId) => {
    const participantsContainer = find("[data-participants]");
    participantsContainer.innerHTML = "";

    const participants = getActionApplications(actionId)
      .map((application) => getVolunteer(application.volunteerId))
      .filter(Boolean);

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
      stats.textContent = `${formatRating(participant.rating)} | voluntário`;

      const button = document.createElement("button");
      button.className = "btn btn-primary btn-pad-xs";
      button.type = "button";
      button.textContent = "Ver perfil";

      info.append(name, stats);
      card.append(createAvatar(), info, button);
      participantsContainer.appendChild(card);
    });
  };

  const renderSignupButton = (action) => {
    const button = find("[data-signup-button]");
    const application = getCurrentApplication();
    const activeApplications = getActionApplications(action.id);
    const hasVacancy = activeApplications.length < action.vacancies;
    const isOpen = action.status === "open";

    button.disabled = !isOpen || (!application && !hasVacancy) || state.currentUser.type !== "voluntario";
    button.classList.toggle("is-cancel", Boolean(application));
    button.setAttribute("aria-pressed", String(Boolean(application)));
    button.textContent = application ? "Cancelar inscrição" : "Inscrever-se";
  };

  const renderDetails = () => {
    const action = getAction();
    const ong = getOng(action);

    if (!action || !ong) {
      return;
    }

    setText("[data-action-title]", action.title);
    setText("[data-action-location]", action.location);
    setText("[data-action-date]", formatDate(action.date));
    setText("[data-action-description]", action.description);
    setText("[data-ong-name]", ong.name);
    setText("[data-ong-responsible]", ong.responsibleName);
    setText("[data-ong-rating]", formatRating(ong.rating));
    setText("[data-ong-followers]", formatFollowers(ong));

    renderTags(action.tags || []);
    renderParticipants(action.id);
    renderSignupButton(action);
  };

  const createApplication = () => {
    const nextId = state.applications.reduce((maxId, application) => {
      const id = Number(application.id);
      return Number.isFinite(id) ? Math.max(maxId, id) : maxId;
    }, 0) + 1;

    state.applications.push({
      id: nextId,
      volunteerId: state.currentUser.id,
      actionId: state.actionId,
      status: "pending",
      appliedAt: formatToday(),
      confirmedAt: null,
      attended: false
    });
  };

  const cancelApplication = () => {
    state.applications = state.applications.filter((application) => {
      return !(application.actionId === state.actionId && idsEqual(application.volunteerId, state.currentUser.id));
    });
  };

  const toggleApplication = () => {
    if (getCurrentApplication()) {
      cancelApplication();
    } else {
      createApplication();
    }

    saveApplications();
    renderDetails();
  };

  const init = () => {
    state.currentUser = getCurrentUser();
    state.actionId = getActionIdFromUrl();
    localStorage.setItem(ACTION_KEY, String(state.actionId));
    loadApplications();

    find("[data-signup-button]").addEventListener("click", toggleApplication);
    renderDetails();
  };

  document.addEventListener("DOMContentLoaded", init);
})();
