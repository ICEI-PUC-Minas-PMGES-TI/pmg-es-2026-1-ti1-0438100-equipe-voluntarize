(function () {
  const STORAGE_KEY = "voluntarize:visualizacao-detalhada-voluntario:perfis";
  const INDEX_KEY = "voluntarize:visualizacao-detalhada-voluntario:indice";
  const DEFAULT_PROFILE_ID = "claudia";
  const DATA_VERSION = 5;
  const ASSETS = {
    action: "../../assets/action-people.svg",
    star: "../../assets/star.svg",
    reviewUser: "../../assets/review-user.svg"
  };

  const initialState = {
    versao: DATA_VERSION,
    perfis: {
      claudia: createProfile({
        id: "claudia",
        nome: "Cl\u00e1udia",
        desdeLabel: "Volunt\u00e1ria",
        usuarioLabel: "Usu\u00e1ria",
        voluntariaDesde: "Ago. de 2020",
        usuariaDesde: "Dez. 2026",
        nota: 4.5,
        seguidores: 7000,
        seguindo: true,
        reviews: [
          { autor: "Ong Dia", nota: 5.0, profileId: "", texto: reviewText() },
          { autor: "Jos\u00e9", nota: 4.5, profileId: "jose", texto: reviewText() },
          { autor: "Lucas", nota: 4.0, profileId: "lucas", texto: reviewText() }
        ]
      }),
      jose: createProfile({
        id: "jose",
        nome: "Jos\u00e9",
        desdeLabel: "Volunt\u00e1rio",
        usuarioLabel: "Usu\u00e1rio",
        voluntariaDesde: "Mar. de 2021",
        usuariaDesde: "Jan. 2022",
        nota: 4.5,
        seguidores: 4200,
        seguindo: false,
        reviews: [
          { autor: "Ong Dia", nota: 4.7, profileId: "", texto: reviewText() },
          { autor: "Cl\u00e1udia", nota: 5.0, profileId: "claudia", texto: reviewText() },
          { autor: "Lucas", nota: 4.5, profileId: "lucas", texto: reviewText() }
        ]
      }),
      lucas: createProfile({
        id: "lucas",
        nome: "Lucas",
        desdeLabel: "Volunt\u00e1rio",
        usuarioLabel: "Usu\u00e1rio",
        voluntariaDesde: "Jun. de 2022",
        usuariaDesde: "Set. 2022",
        nota: 4.0,
        seguidores: 3100,
        seguindo: false,
        reviews: [
          { autor: "Ong Dia", nota: 4.0, profileId: "", texto: reviewText() },
          { autor: "Cl\u00e1udia", nota: 4.5, profileId: "claudia", texto: reviewText() },
          { autor: "Jos\u00e9", nota: 4.5, profileId: "jose", texto: reviewText() }
        ]
      })
    }
  };

  const elements = {
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

  let appState = loadState();
  let profileId = getSelectedProfileId();
  let actionIndex = getActionIndex();

  function createProfile(profile) {
    return {
      ...profile,
      tituloHistoria: `Conhe\u00e7a um pouco mais sobre ${profile.nome}`,
      historia: [
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.",
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English."
      ],
      acoes: [
        createAction(15, "A\u00e7\u00e3o do Dia 15", 4.8),
        createAction(22, "A\u00e7\u00e3o do Dia 22", 4.7),
        createAction(30, "A\u00e7\u00e3o do Dia 30", 4.9)
      ]
    };
  }

  function createAction(id, titulo, nota) {
    return {
      id,
      titulo,
      nota,
      descricao:
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested..."
    };
  }

  function reviewText() {
    return "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below...";
  }

  function loadState() {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      saveState(initialState);
      return clone(initialState);
    }

    try {
      const parsedState = JSON.parse(savedState);

      if (parsedState.versao !== DATA_VERSION || !parsedState.perfis) {
        saveState(initialState);
        return clone(initialState);
      }

      return parsedState;
    } catch (error) {
      saveState(initialState);
      return clone(initialState);
    }
  }

  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function saveState(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getSelectedProfileId() {
    const requestedId = new URLSearchParams(window.location.search).get("id");

    if (requestedId && appState.perfis[requestedId]) {
      return requestedId;
    }

    return DEFAULT_PROFILE_ID;
  }

  function getProfile() {
    return appState.perfis[profileId];
  }

  function getActionIndex() {
    return Number(localStorage.getItem(`${INDEX_KEY}:${profileId}`)) || 0;
  }

  function saveActionIndex() {
    localStorage.setItem(`${INDEX_KEY}:${profileId}`, String(actionIndex));
  }

  function formatRating(value) {
    return Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  }

  function formatFollowers(value) {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`;
    }

    return String(value);
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

  function createIcon(src) {
    const icon = document.createElement("img");
    icon.src = src;
    icon.alt = "";
    return icon;
  }

  function renderProfile() {
    const profile = getProfile();

    document.title = `${profile.nome} | Visualiza\u00e7\u00e3o Detalhada do Volunt\u00e1rio`;
    elements.name.textContent = profile.nome;
    elements.rating.textContent = formatRating(profile.nota);
    elements.followers.textContent = formatFollowers(profile.seguidores);
    elements.followButton.textContent = profile.seguindo ? "Seguindo" : "Seguir";
    elements.followButton.setAttribute("aria-pressed", profile.seguindo ? "true" : "false");

    elements.meta.textContent = "";
    appendText(elements.meta, `${profile.desdeLabel} desde ${profile.voluntariaDesde}`, "span");
    appendText(elements.meta, `${profile.usuarioLabel} da Voluntarize desde ${profile.usuariaDesde}`, "span");
  }

  function renderStory() {
    const profile = getProfile();

    elements.storyTitle.textContent = profile.tituloHistoria;
    elements.story.textContent = "";
    profile.historia.forEach(function (paragraph) {
      appendText(elements.story, paragraph, "p");
    });
  }

  function getVisibleActionCount() {
    return window.matchMedia("(max-width: 840px)").matches ? 1 : 2;
  }

  function renderActions() {
    const actions = getProfile().acoes;
    const visibleCount = Math.min(getVisibleActionCount(), actions.length);

    actionIndex %= actions.length;
    elements.actionsList.textContent = "";
    elements.previousAction.disabled = actions.length <= visibleCount;
    elements.nextAction.disabled = actions.length <= visibleCount;

    for (let index = 0; index < visibleCount; index += 1) {
      const currentAction = actions[(actionIndex + index) % actions.length];
      elements.actionsList.appendChild(createActionCard(currentAction));
    }
  }

  function createActionCard(action) {
    const card = document.createElement("article");
    card.className = "action-card";

    const image = document.createElement("div");
    image.className = "action-image";
    image.setAttribute("aria-hidden", "true");

    const actionPicture = createIcon(ASSETS.action);
    actionPicture.className = "action-picture";
    image.appendChild(actionPicture);

    const rating = appendText(image, formatRating(action.nota), "span", "action-rating");
    rating.appendChild(createIcon(ASSETS.star));

    const detailsLink = document.createElement("a");
    detailsLink.className = "btn btn-secondary btn-pad-xs btn-shadow-xs btn-border-thin";
    detailsLink.href = "#";
    detailsLink.textContent = "Ver Detalhes";
    detailsLink.addEventListener("click", function (event) {
      event.preventDefault();
    });

    card.appendChild(image);
    appendText(card, action.titulo, "h3", "action-title");
    appendText(card, action.descricao, "p", "action-description text-xs font-alt");
    card.appendChild(detailsLink);
    return card;
  }

  function renderReviews() {
    const profile = getProfile();

    elements.reviewVolunteerName.textContent = profile.nome;
    elements.reviewsList.textContent = "";

    profile.reviews.forEach(function (review) {
      const card = document.createElement("a");
      const hasProfileLink = review.profileId && appState.perfis[review.profileId];
      card.className = "review-card";
      card.href = hasProfileLink ? `./index.html?id=${review.profileId}` : "#";
      card.setAttribute("aria-label", `Ver avalia\u00e7\u00e3o de ${review.autor}`);

      if (!hasProfileLink) {
        card.addEventListener("click", function (event) {
          event.preventDefault();
        });
      }

      const topline = document.createElement("div");
      topline.className = "review-topline";

      const author = appendText(topline, review.autor, "h3", "review-author");
      author.prepend(createIcon(ASSETS.reviewUser));

      const score = appendText(topline, formatRating(review.nota), "p", "review-score");
      score.appendChild(createIcon(ASSETS.star));

      card.appendChild(topline);
      appendText(card, review.texto, "p", "review-text text-xs font-alt");
      elements.reviewsList.appendChild(card);
    });
  }

  function moveActions(direction) {
    const totalActions = getProfile().acoes.length;

    if (totalActions === 0) {
      return;
    }

    actionIndex = (actionIndex + direction + totalActions) % totalActions;
    saveActionIndex();
    renderActions();
  }

  function toggleFollow() {
    const profile = getProfile();
    profile.seguindo = !profile.seguindo;
    profile.seguidores += profile.seguindo ? 1 : -1;
    saveState(appState);
    renderProfile();
  }

  function renderPage() {
    renderProfile();
    renderStory();
    renderActions();
    renderReviews();
  }

  elements.followButton.addEventListener("click", toggleFollow);
  elements.previousAction.addEventListener("click", function () {
    moveActions(-1);
  });
  elements.nextAction.addEventListener("click", function () {
    moveActions(1);
  });
  window.addEventListener("resize", renderActions);

  renderPage();
})();
