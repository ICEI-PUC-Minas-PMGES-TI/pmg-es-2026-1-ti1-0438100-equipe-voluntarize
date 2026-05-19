(function () {
  const STORAGE_KEY = "voluntarize:visualizacao-detalhada-voluntario";
  const ACTION_KEY = "voluntarize:visualizacao-detalhada-voluntario:acao";
  const INDEX_KEY = "voluntarize:visualizacao-detalhada-voluntario:indice";

  const sampleVolunteer = {
    nome: "Cl\u00e1udia",
    voluntariaDesde: "ago. de 2020",
    usuariaDesde: "dez. de 2020",
    nota: 4.5,
    seguidores: 7000,
    seguindo: true,
    tituloHistoria: "Conhe\u00e7a um pouco mais sobre Cl\u00e1udia",
    historia: [
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.",
      "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English."
    ],
    acoes: [
      {
        id: 15,
        titulo: "A\u00e7\u00e3o do Dia 15",
        nota: 4.8,
        descricao:
          "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested..."
      },
      {
        id: 16,
        titulo: "A\u00e7\u00e3o do Dia 16",
        nota: 4.8,
        descricao:
          "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested..."
      },
      {
        id: 17,
        titulo: "A\u00e7\u00e3o do Dia 17",
        nota: 4.7,
        descricao:
          "Apoio na organiza\u00e7\u00e3o de kits, recep\u00e7\u00e3o dos participantes e suporte durante a atividade."
      }
    ],
    avaliacoes: [
      {
        autor: "ONG Dia",
        nota: 5.0,
        texto:
          "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below..."
      },
      {
        autor: "Jos\u00e9",
        nota: 4.5,
        texto:
          "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below..."
      },
      {
        autor: "Lucas",
        nota: 4.0,
        texto:
          "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below..."
      }
    ]
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
    actionFeedback: document.getElementById("action-feedback"),
    reviewVolunteerName: document.getElementById("review-volunteer-name"),
    reviewsList: document.getElementById("reviews-list")
  };

  let volunteer = loadVolunteer();
  let actionIndex = Number(localStorage.getItem(INDEX_KEY)) || 0;

  function loadVolunteer() {
    const savedVolunteer = localStorage.getItem(STORAGE_KEY);

    if (!savedVolunteer) {
      saveVolunteer(sampleVolunteer);
      return clone(sampleVolunteer);
    }

    try {
      return JSON.parse(savedVolunteer);
    } catch (error) {
      saveVolunteer(sampleVolunteer);
      return clone(sampleVolunteer);
    }
  }

  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function saveVolunteer(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

  function renderProfile() {
    elements.name.textContent = volunteer.nome;
    elements.rating.textContent = formatRating(volunteer.nota);
    elements.followers.textContent = formatFollowers(volunteer.seguidores);
    elements.followButton.textContent = volunteer.seguindo ? "Seguindo" : "Seguir";
    elements.followButton.setAttribute(
      "aria-pressed",
      volunteer.seguindo ? "true" : "false"
    );

    elements.meta.textContent = "";
    appendText(
      elements.meta,
      `Volunt\u00e1ria desde ${volunteer.voluntariaDesde}`,
      "span"
    );
    appendText(
      elements.meta,
      `Usu\u00e1ria da Voluntarize desde ${volunteer.usuariaDesde}`,
      "span"
    );
  }

  function renderStory() {
    elements.storyTitle.textContent = volunteer.tituloHistoria;
    elements.story.textContent = "";

    volunteer.historia.forEach(function (paragraph) {
      appendText(elements.story, paragraph, "p");
    });
  }

  function getVisibleActionCount() {
    return window.matchMedia("(max-width: 840px)").matches ? 1 : 2;
  }

  function renderActions() {
    const actions = volunteer.acoes;
    const visibleCount = Math.min(getVisibleActionCount(), actions.length);

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

    appendText(image, `${formatRating(action.nota)} \u2606`, "span", "action-rating");

    const person = document.createElement("span");
    person.className = "action-person";
    image.appendChild(person);

    card.appendChild(image);
    appendText(card, action.titulo, "h3", "action-title");
    appendText(card, action.descricao, "p", "action-description text-xs font-alt");

    const detailsButton = document.createElement("button");
    detailsButton.className =
      "btn btn-secondary btn-pad-xs btn-shadow-xs btn-border-thin";
    detailsButton.type = "button";
    detailsButton.textContent = "Ver Detalhes";
    detailsButton.addEventListener("click", function () {
      localStorage.setItem(ACTION_KEY, JSON.stringify(action));
      elements.actionFeedback.textContent = `${action.titulo} selecionada.`;
    });

    card.appendChild(detailsButton);
    return card;
  }

  function renderReviews() {
    elements.reviewVolunteerName.textContent = volunteer.nome;
    elements.reviewsList.textContent = "";

    volunteer.avaliacoes.forEach(function (review) {
      const card = document.createElement("article");
      card.className = "review-card";

      const topline = document.createElement("div");
      topline.className = "review-topline";
      appendText(topline, review.autor, "h3", "review-author");
      appendText(topline, `${formatRating(review.nota)} \u2606`, "p", "review-score");

      card.appendChild(topline);
      appendText(card, review.texto, "p", "text-xs font-alt");
      elements.reviewsList.appendChild(card);
    });
  }

  function moveActions(direction) {
    const totalActions = volunteer.acoes.length;

    if (totalActions === 0) {
      return;
    }

    actionIndex = (actionIndex + direction + totalActions) % totalActions;
    localStorage.setItem(INDEX_KEY, String(actionIndex));
    renderActions();
  }

  function toggleFollow() {
    volunteer.seguindo = !volunteer.seguindo;
    volunteer.seguidores += volunteer.seguindo ? 1 : -1;
    saveVolunteer(volunteer);
    renderProfile();
  }

  elements.followButton.addEventListener("click", toggleFollow);
  elements.previousAction.addEventListener("click", function () {
    moveActions(-1);
  });
  elements.nextAction.addEventListener("click", function () {
    moveActions(1);
  });
  window.addEventListener("resize", renderActions);

  renderProfile();
  renderStory();
  renderActions();
  renderReviews();
})();
