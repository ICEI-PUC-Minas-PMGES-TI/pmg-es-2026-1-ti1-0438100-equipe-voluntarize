const API_BASE = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';
function api(path) { return (API_BASE ? API_BASE : '') + path; }

(function () {
  const ACTION_KEY = "actionId";
  const CURRENT_USER_KEY = "usuarioCorrente";

  const state = {
    actionId: 1,
    action: null,
    ong: null,
    applications: [],
    volunteers: [],
    follows: [],
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

  const readJson = (storage, fallback) => {
    try {
      const parsed = JSON.parse(storage || "");
      return parsed || fallback;
    } catch (error) {
      return fallback;
    }
  };

  const requestJson = async (path, options = {}) => {
    const response = await fetch(api(path), options);

    if (!response.ok) {
      throw new Error(`Erro ao acessar ${path}.`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  const isVolunteerSession = (user) => {
    return user && (user.type === 0 || user.tipo === "voluntario" || user.type === "voluntario");
  };

  const getCurrentUser = () => {
    const loggedUser = readJson(localStorage.getItem("usuarioLogado"), null);

    if (loggedUser && loggedUser.id != null) {
      return {
        id: loggedUser.id,
        name: loggedUser.nome || loggedUser.name || "Voluntario",
        type: loggedUser.type
      };
    }

    const savedUser = readJson(sessionStorage.getItem(CURRENT_USER_KEY), null);

    if (!savedUser || savedUser.id == null) {
      return null;
    }

    return {
      id: savedUser.id,
      name: savedUser.nome || savedUser.name || "Voluntario",
      type: savedUser.tipo || savedUser.type || "voluntario"
    };
  };

  const getActionIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const rawId = params.get("id") || params.get("acaoId") || params.get("vagaId") || localStorage.getItem(ACTION_KEY);
    const actionId = Number(rawId);

    return Number.isInteger(actionId) && actionId > 0 ? actionId : 1;
  };

  const getCurrentApplication = () => {
    if (!state.currentUser) {
      return null;
    }

    return state.applications.find((application) => {
      return idsEqual(application.actionId, state.actionId)
        && idsEqual(application.volunteerId, state.currentUser.id)
        && application.status !== "rejected";
    }) || null;
  };

  const getActionApplications = (actionId) => {
    return state.applications.filter((application) => {
      return idsEqual(application.actionId, actionId) && application.status !== "rejected";
    });
  };

  const getVolunteer = (volunteerId) => {
    if (state.currentUser && idsEqual(volunteerId, state.currentUser.id)) {
      const volunteer = state.volunteers.find((item) => idsEqual(item.id, volunteerId));

      return volunteer || {
        id: state.currentUser.id,
        name: state.currentUser.name,
        rating: 0
      };
    }

    return state.volunteers.find((volunteer) => idsEqual(volunteer.id, volunteerId));
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

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

    const followers = state.follows.filter((follow) => {
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

    if (!tagsContainer) {
      return;
    }

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

    if (!participantsContainer) {
      return;
    }

    participantsContainer.innerHTML = "";

    const participants = getActionApplications(actionId)
      .map((application) => getVolunteer(application.volunteerId))
      .filter(Boolean);

    if (!participants.length) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "empty-message";
      emptyMessage.textContent = "Nenhum participante inscrito ate o momento.";
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
      stats.textContent = `${formatRating(participant.rating)} | voluntario`;

      const button = document.createElement("button");
      button.className = "btn btn-primary btn-pad-xs";
      button.type = "button";
      button.textContent = "Ver perfil";
      button.addEventListener("click", () => {
        window.location.href = `../visualizacao-detalhada-voluntario/index.html?id=${participant.id}`;
      });

      info.append(name, stats);
      card.append(createAvatar(), info, button);
      participantsContainer.appendChild(card);
    });
  };

  const renderSignupButton = () => {
    const button = find("[data-signup-button]");

    if (!button || !state.action) {
      return;
    }

    const application = getCurrentApplication();
    const activeApplications = getActionApplications(state.action.id);
    const hasVacancy = activeApplications.length < state.action.vacancies;
    const isOpen = state.action.status === "open";
    const isVolunteer = isVolunteerSession(state.currentUser);

    button.disabled = !isOpen || (!application && !hasVacancy) || !isVolunteer;
    button.classList.toggle("is-cancel", Boolean(application));
    button.setAttribute("aria-pressed", String(Boolean(application)));
    button.textContent = application ? "Cancelar inscricao" : "Inscrever-se";
  };

  const renderDetails = () => {
    const { action, ong } = state;

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
    renderSignupButton();
  };

  const loadPageData = async () => {
    state.action = await requestJson(`/actions/${state.actionId}`);

    const [ong, applications, volunteers, follows] = await Promise.all([
      requestJson(`/ongs/${state.action.ongId}`),
      requestJson(`/applications?actionId=${state.actionId}`),
      requestJson("/volunteers"),
      requestJson("/follows")
    ]);

    state.ong = ong;
    state.applications = Array.isArray(applications) ? applications : [];
    state.volunteers = Array.isArray(volunteers) ? volunteers : [];
    state.follows = Array.isArray(follows) ? follows : [];
  };

  const createApplication = async () => {
    const application = await requestJson("/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        volunteerId: state.currentUser.id,
        actionId: state.actionId,
        status: "pending",
        appliedAt: formatToday(),
        confirmedAt: null,
        attended: false
      })
    });

    state.applications.push(application);
  };

  const cancelApplication = async (application) => {
    await requestJson(`/applications/${application.id}`, { method: "DELETE" });
    state.applications = state.applications.filter((item) => !idsEqual(item.id, application.id));
  };

  const toggleApplication = async () => {
    const button = find("[data-signup-button]");
    const currentApplication = getCurrentApplication();

    if (!state.currentUser || !isVolunteerSession(state.currentUser)) {
      return;
    }

    if (button) {
      button.disabled = true;
    }

    try {
      if (currentApplication) {
        await cancelApplication(currentApplication);
      } else {
        await createApplication();
      }

      renderDetails();
    } catch (error) {
      console.error("Erro ao atualizar candidatura:", error);
      renderSignupButton();
    }
  };

  const bindOrganizerProfile = () => {
    const button = find(".organizer-profile");

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      if (state.ong) {
        window.location.href = `../visualizacao-detalhada-ong/index.html?id=${state.ong.id}`;
      }
    });
  };

  const init = async () => {
    state.currentUser = getCurrentUser();
    state.actionId = getActionIdFromUrl();
    localStorage.setItem(ACTION_KEY, String(state.actionId));

    const signupButton = find("[data-signup-button]");

    if (signupButton) {
      signupButton.disabled = true;
      signupButton.addEventListener("click", toggleApplication);
    }

    bindOrganizerProfile();

    try {
      await loadPageData();
      renderDetails();
    } catch (error) {
      console.error("Erro ao carregar dados pelo JSON Server:", error);
      setText("[data-action-title]", "Nao foi possivel carregar esta vaga.");
      renderSignupButton();
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
