(function () {
  const API = {
    volunteers: "/volunteers",
    ongs: "/ongs",
    actions: "/actions",
    applications: "/applications",
    reviews: "/reviews"
  };

  const STORAGE_KEYS = {
    actionIndex: "voluntarize:visualizacao-detalhada-voluntario:acao",
    following: "voluntarize:visualizacao-detalhada-voluntario:seguindo"
  };

  const ASSETS = {
    action: "./assets/action-people.svg",
    star: "./assets/star.svg",
    reviewUser: "./assets/review-user.svg"
  };

  const state = {
    volunteers: [],
    ongs: [],
    actions: [],
    applications: [],
    reviews: [],
    profile: null,
    profileActions: [],
    profileReviews: [],
    actionIndex: 0,
    following: false,
    savingFollow: false
  };

  const elements = {
    status: document.getElementById("page-status"),
    contentBlocks: document.querySelectorAll(
      ".volunteer-main > section, .volunteer-main > .volunteer-divider"
    ),
    profileAvatar: document.querySelector(".profile-avatar"),
    name: document.getElementById("volunteer-name"),
    meta: document.getElementById("volunteer-meta"),
    rating: document.getElementById("volunteer-rating"),
    followers: document.getElementById("volunteer-followers"),
    followButton: document.getElementById("follow-button"),
    storyTitle: document.getElementById("story-title"),
    story: document.getElementById("volunteer-story"),
    previousAction: document.getElementById("previous-action"),
    nextAction: document.getElementById("next-action"),
    actionsList: document.getElementById("actions-list"),
    reviewVolunteerName: document.getElementById("review-volunteer-name"),
    reviewsList: document.getElementById("reviews-list")
  };

  function isActiveRecord(record) {
    return record && !record.deletedAt;
  }

  async function fetchJson(endpoint, options) {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options && options.headers)
      }
    });

    if (!response.ok) {
      throw new Error(`Falha ao acessar ${endpoint}: ${response.status}`);
    }

    return response.json();
  }

  async function loadData() {
    const [volunteers, ongs, actions, applications, reviews] = await Promise.all([
      fetchJson(API.volunteers),
      fetchJson(API.ongs),
      fetchJson(API.actions),
      fetchJson(API.applications),
      fetchJson(API.reviews)
    ]);

    state.volunteers = volunteers.filter(isActiveRecord);
    state.ongs = ongs.filter(isActiveRecord);
    state.actions = actions.filter(isActiveRecord);
    state.applications = applications;
    state.reviews = reviews.filter(isActiveRecord);
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function findRequestedProfile() {
    const requestedId = new URLSearchParams(window.location.search).get("id");

    if (requestedId) {
      const normalizedRequest = normalizeText(requestedId);

      return (
        state.volunteers.find((volunteer) => String(volunteer.id) === requestedId) ||
        state.volunteers.find((volunteer) => {
          const normalizedName = normalizeText(volunteer.name);
          const normalizedFirstName = normalizeText(getFirstName(volunteer.name));
          return normalizedName === normalizedRequest || normalizedFirstName === normalizedRequest;
        }) ||
        null
      );
    }

    return (
      state.volunteers.find((volunteer) => normalizeText(getFirstName(volunteer.name)) === "claudia") ||
      state.volunteers[0] ||
      null
    );
  }

  function getFirstName(name) {
    return String(name || "Voluntário").trim().split(/\s+/)[0];
  }

  function formatRating(value) {
    const rating = Number(value);

    if (!Number.isFinite(rating)) {
      return "—";
    }

    return rating.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  }

  function formatFollowers(value) {
    const followers = Number(value) || 0;

    if (followers >= 1000) {
      return `${(followers / 1000).toLocaleString("pt-BR", {
        maximumFractionDigits: followers % 1000 === 0 ? 0 : 1
      })}K`;
    }

    return followers.toLocaleString("pt-BR");
  }

  function parseDate(value) {
    if (!value) {
      return null;
    }

    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function capitalize(value) {
    return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";
  }

  function formatMembershipDate(value) {
    const date = parseDate(value);

    if (!date) {
      return "Data de entrada não informada";
    }

    return capitalize(
      date.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric"
      })
    );
  }

  function formatActionDate(value) {
    const date = parseDate(value);

    if (!date) {
      return "Data não informada";
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function appendText(parent, text, tagName, className) {
    const child = document.createElement(tagName);
    child.textContent = text;

    if (className) {
      child.className = className;
    }

    parent.appendChild(child);
    return child;
  }

  function createIcon(src, className, alt) {
    const icon = document.createElement("img");
    icon.src = src;
    icon.alt = alt || "";

    if (className) {
      icon.className = className;
    }

    return icon;
  }

  function getLocalImageSource(value, fallback) {
    const source = String(value || "").trim();

    if (!source || /^(?:https?:)?\/\//i.test(source) || /^data:/i.test(source)) {
      return fallback || "";
    }

    return source;
  }

  function getFollowingKey(profileId) {
    return `${STORAGE_KEYS.following}:${profileId}`;
  }

  function getActionIndexKey(profileId) {
    return `${STORAGE_KEYS.actionIndex}:${profileId}`;
  }

  function getProfileActions(profileId) {
    return state.actions
      .filter((action) => {
        const application = state.applications.find(
          (item) =>
            String(item.volunteerId) === String(profileId) &&
            String(item.actionId) === String(action.id)
        );

        if (application) {
          return application.attended || application.status === "accepted";
        }

        return Array.isArray(action.participants)
          ? action.participants.some((participantId) => String(participantId) === String(profileId))
          : false;
      })
      .sort((first, second) => String(second.date || "").localeCompare(String(first.date || "")));
  }

  function getProfileReviews(profileId) {
    return state.reviews
      .filter(
        (review) =>
          String(review.targetType).toLowerCase() === "volunteer" &&
          String(review.targetId) === String(profileId)
      )
      .sort((first, second) =>
        String(second.createdAt || "").localeCompare(String(first.createdAt || ""))
      );
  }

  function getActionRating(actionId) {
    const ratings = state.reviews
      .filter((review) => String(review.actionId) === String(actionId))
      .map((review) => Number(review.rating))
      .filter(Number.isFinite);

    if (!ratings.length) {
      return null;
    }

    return ratings.reduce((total, rating) => total + rating, 0) / ratings.length;
  }

  function getOngName(ongId) {
    const ong = state.ongs.find((item) => String(item.id) === String(ongId));
    return ong ? ong.name : "";
  }

  function setContentVisibility(visible) {
    elements.contentBlocks.forEach((block) => {
      block.hidden = !visible;
    });
  }

  function showStatus(message) {
    elements.status.textContent = message;
    elements.status.hidden = false;
  }

  function hideStatus() {
    elements.status.hidden = true;
    elements.status.textContent = "";
  }

  function renderProfileAvatar() {
    const source = getLocalImageSource(state.profile.profilePicture, "");
    elements.profileAvatar.textContent = "";
    elements.profileAvatar.classList.remove("has-image");

    if (!source) {
      return;
    }

    const image = createIcon(source, "profile-avatar-image", `Foto de ${state.profile.name}`);
    image.addEventListener("error", function () {
      image.remove();
      elements.profileAvatar.classList.remove("has-image");
    });
    elements.profileAvatar.classList.add("has-image");
    elements.profileAvatar.appendChild(image);
  }

  function renderFollowButton() {
    elements.followButton.disabled = state.savingFollow;
    elements.followButton.setAttribute("aria-busy", state.savingFollow ? "true" : "false");
    elements.followButton.setAttribute("aria-pressed", state.following ? "true" : "false");
    elements.followButton.textContent = state.savingFollow
      ? "Salvando..."
      : state.following
        ? "Seguindo"
        : "Seguir";
  }

  function renderProfile() {
    const profile = state.profile;

    document.title = `${profile.name} | Visualização Detalhada do Voluntário`;
    elements.name.textContent = profile.name;
    elements.rating.textContent = formatRating(profile.rating);
    elements.followers.textContent = formatFollowers(profile.followers);
    elements.meta.textContent = "";
    appendText(
      elements.meta,
      `Na Voluntarize desde ${formatMembershipDate(profile.createdAt)}`,
      "span"
    );

    renderProfileAvatar();
    renderFollowButton();
  }

  function renderStory() {
    const firstName = getFirstName(state.profile.name);
    const biography = String(state.profile.bio || "").trim();

    elements.storyTitle.textContent = `Conheça um pouco mais sobre ${firstName}`;
    elements.story.textContent = "";
    appendText(
      elements.story,
      biography || "Este voluntário ainda não adicionou uma descrição ao perfil.",
      "p"
    );
  }

  function getVisibleActionCount() {
    return window.matchMedia("(max-width: 840px)").matches ? 1 : 2;
  }

  function createEmptyState(message) {
    const emptyState = document.createElement("p");
    emptyState.className = "surface surface-xs empty-state text-sm";
    emptyState.textContent = message;
    return emptyState;
  }

  function renderActions() {
    const actions = state.profileActions;
    elements.actionsList.textContent = "";

    if (!actions.length) {
      elements.actionsList.appendChild(
        createEmptyState("Nenhuma ação vinculada a este voluntário.")
      );
      elements.previousAction.disabled = true;
      elements.nextAction.disabled = true;
      return;
    }

    const visibleCount = Math.min(getVisibleActionCount(), actions.length);
    state.actionIndex = ((state.actionIndex % actions.length) + actions.length) % actions.length;
    elements.previousAction.disabled = actions.length <= visibleCount;
    elements.nextAction.disabled = actions.length <= visibleCount;

    for (let index = 0; index < visibleCount; index += 1) {
      const action = actions[(state.actionIndex + index) % actions.length];
      elements.actionsList.appendChild(createActionCard(action));
    }
  }

  function createActionCard(action) {
    const card = document.createElement("article");
    const image = document.createElement("div");
    const imageSource = getLocalImageSource(action.image, ASSETS.action);
    const ratingValue = getActionRating(action.id);
    const meta = [formatActionDate(action.date), getOngName(action.ongId)].filter(Boolean).join(" • ");

    card.className = "action-card";
    image.className = "action-image";
    image.appendChild(
      createIcon(imageSource, "action-picture", `Imagem da ação ${action.title}`)
    );

    if (ratingValue !== null) {
      const rating = appendText(image, formatRating(ratingValue), "span", "action-rating");
      rating.appendChild(createIcon(ASSETS.star));
    }

    card.appendChild(image);
    appendText(card, action.title || "Ação sem título", "h3", "action-title");
    appendText(card, meta, "p", "action-meta text-2xs text-bold");
    appendText(
      card,
      action.description || "Descrição não informada.",
      "p",
      "action-description text-xs font-alt"
    );

    const detailsLink = document.createElement("a");
    detailsLink.className = "btn btn-secondary btn-pad-xs btn-shadow-xs btn-border-thin";
    detailsLink.href = "#";
    detailsLink.textContent = "Ver Detalhes";
    detailsLink.addEventListener("click", function (event) {
      event.preventDefault();
    });
    card.appendChild(detailsLink);
    return card;
  }

  function renderReviews() {
    elements.reviewVolunteerName.textContent = getFirstName(state.profile.name);
    elements.reviewsList.textContent = "";

    if (!state.profileReviews.length) {
      elements.reviewsList.appendChild(
        createEmptyState("Este voluntário ainda não recebeu avaliações.")
      );
      return;
    }

    state.profileReviews.forEach(function (review) {
      elements.reviewsList.appendChild(createReviewCard(review));
    });
  }

  function createReviewCard(review) {
    const authorProfile = state.volunteers.find(
      (volunteer) => String(volunteer.id) === String(review.authorId)
    );
    const authorName = authorProfile ? authorProfile.name : `Usuário ${review.authorId}`;
    const authorImage = getLocalImageSource(
      authorProfile && authorProfile.profilePicture,
      ASSETS.reviewUser
    );
    const card = document.createElement("a");
    const topline = document.createElement("div");
    const author = document.createElement("h3");

    card.className = "review-card";
    card.href = authorProfile ? `./index.html?id=${encodeURIComponent(authorProfile.id)}` : "#";
    card.setAttribute("aria-label", `Abrir perfil de ${authorName}`);

    if (!authorProfile) {
      card.addEventListener("click", function (event) {
        event.preventDefault();
      });
    }

    topline.className = "review-topline";
    author.className = "review-author";
    author.appendChild(createIcon(authorImage, "review-author-avatar"));
    appendText(author, authorName, "span", "review-author-name");
    topline.appendChild(author);

    const score = appendText(topline, formatRating(review.rating), "p", "review-score");
    score.appendChild(createIcon(ASSETS.star));
    card.appendChild(topline);
    appendText(
      card,
      review.comment || "Avaliação sem comentário.",
      "p",
      "review-text text-xs font-alt"
    );
    return card;
  }

  function saveActionIndex() {
    localStorage.setItem(getActionIndexKey(state.profile.id), String(state.actionIndex));
  }

  function moveActions(direction) {
    if (!state.profileActions.length) {
      return;
    }

    state.actionIndex =
      (state.actionIndex + direction + state.profileActions.length) % state.profileActions.length;
    saveActionIndex();
    renderActions();
  }

  async function toggleFollow() {
    if (!state.profile || state.savingFollow) {
      return;
    }

    const nextFollowing = !state.following;
    const currentFollowers = Number(state.profile.followers) || 0;
    const nextFollowers = Math.max(0, currentFollowers + (nextFollowing ? 1 : -1));

    state.savingFollow = true;
    elements.followButton.removeAttribute("title");
    renderFollowButton();

    try {
      const updatedProfile = await fetchJson(`${API.volunteers}/${state.profile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ followers: nextFollowers })
      });

      state.profile.followers = Number(updatedProfile.followers) || 0;
      state.following = nextFollowing;
      localStorage.setItem(getFollowingKey(state.profile.id), String(state.following));
    } catch (error) {
      elements.followButton.title = "Não foi possível atualizar os seguidores.";
      console.error("Erro ao atualizar seguidores via JSONServer:", error);
    } finally {
      state.savingFollow = false;
      renderProfile();
    }
  }

  function selectProfile(profile) {
    state.profile = profile;
    state.profileActions = getProfileActions(profile.id);
    state.profileReviews = getProfileReviews(profile.id);
    state.actionIndex = Number(localStorage.getItem(getActionIndexKey(profile.id))) || 0;
    state.following = localStorage.getItem(getFollowingKey(profile.id)) === "true";
  }

  function renderPage() {
    renderProfile();
    renderStory();
    renderActions();
    renderReviews();
  }

  async function initialize() {
    setContentVisibility(false);
    showStatus("Carregando perfil...");

    try {
      await loadData();
      const profile = findRequestedProfile();

      if (!profile) {
        showStatus("Voluntário não encontrado.");
        return;
      }

      selectProfile(profile);
      hideStatus();
      setContentVisibility(true);
      renderPage();
    } catch (error) {
      showStatus("Não foi possível carregar os dados do voluntário.");
      console.error("Erro ao carregar dados do JSONServer:", error);
    }
  }

  elements.followButton.addEventListener("click", toggleFollow);
  elements.previousAction.addEventListener("click", function () {
    moveActions(-1);
  });
  elements.nextAction.addEventListener("click", function () {
    moveActions(1);
  });
  window.addEventListener("resize", function () {
    if (state.profile) {
      renderActions();
    }
  });

  initialize();
})();
