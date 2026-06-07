(function () {
  const ASSETS = {
    volunteer: "./assets/profile-user.svg",
    ong: "./assets/follower-icon.svg"
  };

  const CURRENT_USER = {
    type: "volunteer",
    id: 1
  };

  const FALLBACK_DB = {
    volunteers: [
      {
        id: 1,
        name: "Cláudia Mendes",
        bio: "Voluntária em projetos sociais e educacionais na comunidade.",
        rating: 4.5
      },
      {
        id: 2,
        name: "Lucas Ferreira",
        bio: "Apoia causas ambientais, educação e ações comunitárias.",
        rating: 4.2
      },
      {
        id: 3,
        name: "Fernanda Oliveira",
        bio: "Atua em apoio emocional a populações vulneráveis.",
        rating: 4.8
      }
    ],
    ongs: [
      {
        id: 1,
        name: "ONG Dia Feliz",
        description: "ONG focada em ações sociais e apoio comunitário.",
        rating: 4.8
      },
      {
        id: 2,
        name: "Instituto Mãos Unidas",
        description: "Promove educação e capacitação para jovens.",
        rating: 4.6
      },
      {
        id: 3,
        name: "Lar dos Idosos São Francisco",
        description: "Cuidado, dignidade e qualidade de vida para idosos.",
        rating: 4.9
      }
    ],
    actions: [],
    applications: [],
    follows: [
      { id: 1, followerType: "volunteer", followerId: 1, targetType: "ong", targetId: 1 },
      { id: 2, followerType: "volunteer", followerId: 1, targetType: "ong", targetId: 2 },
      { id: 3, followerType: "volunteer", followerId: 2, targetType: "ong", targetId: 1 },
      { id: 4, followerType: "volunteer", followerId: 3, targetType: "ong", targetId: 3 },
      { id: 5, followerType: "ong", followerId: 1, targetType: "volunteer", targetId: 1 }
    ]
  };

  const state = {
    db: null,
    follows: [],
    activeTab: "seguidores",
    search: "",
    fetchFailed: false
  };

  const elements = {
    search: document.getElementById("search-input"),
    tabs: document.querySelectorAll(".tab-button"),
    listTitle: document.getElementById("list-title"),
    listCount: document.getElementById("list-count"),
    mainList: document.getElementById("main-list"),
    dataWarning: document.getElementById("data-warning")
  };

  const tabTitles = {
    seguidores: "Seguidores",
    seguindo: "Seguindo",
    ongs: "ONGs",
    voluntarios: "Voluntários"
  };

  async function loadDb() {
    const dbFileUrls = [
      "../../db/db.json",
      "/db/db.json",
      "http://localhost:3000/db/db.json"
    ];

    for (const url of dbFileUrls) {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        // Try the next source.
      }
    }

    const endpointRoots = ["", "http://localhost:3000"];
    for (const root of endpointRoots) {
      try {
        const [volunteers, ongs, actions, applications, follows] = await Promise.all([
          fetchJson(`${root}/volunteers`),
          fetchJson(`${root}/ongs`),
          fetchJson(`${root}/actions`),
          fetchJson(`${root}/applications`),
          fetchJson(`${root}/follows`)
        ]);

        return { volunteers, ongs, actions, applications, follows };
      } catch (error) {
        // Try the next endpoint root.
      }
    }

    state.fetchFailed = true;
    return FALLBACK_DB;
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Erro ao carregar ${url}`);
    }
    return response.json();
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getCollection(type) {
    return type === "ong" ? state.db.ongs : state.db.volunteers;
  }

  function getEntity(type, id) {
    return (getCollection(type) || []).find((item) => Number(item.id) === Number(id));
  }

  function getEntityName(type, id) {
    const entity = getEntity(type, id);
    return entity ? entity.name : type === "ong" ? "ONG" : "Voluntário";
  }

  function getEntityDescription(type, entity) {
    if (!entity) {
      return "Conexão cadastrada na rede de voluntariado.";
    }

    if (type === "ong") {
      return entity.description || "ONG com projetos ativos na Voluntarize.";
    }

    return entity.bio || "Voluntário com interesse em ações sociais.";
  }

  function getFollowersOf(type, id) {
    return state.follows.filter(
      (follow) => follow.targetType === type && Number(follow.targetId) === Number(id)
    );
  }

  function getFollowingOf(type, id) {
    return state.follows.filter(
      (follow) => follow.followerType === type && Number(follow.followerId) === Number(id)
    );
  }

  function isCurrentUserFollowing(type, id) {
    return state.follows.some(
      (follow) =>
        follow.followerType === CURRENT_USER.type &&
        Number(follow.followerId) === CURRENT_USER.id &&
        follow.targetType === type &&
        Number(follow.targetId) === Number(id)
    );
  }

  function toEntityItem(type, id, follow) {
    const entity = getEntity(type, id);
    return {
      id: Number(id),
      type,
      followId: follow ? follow.id : null,
      name: entity ? entity.name : getEntityName(type, id),
      description: getEntityDescription(type, entity),
      followers: getFollowersOf(type, id).length,
      rating: entity && entity.rating ? entity.rating : null
    };
  }

  function getFollowersRecent() {
    return state.follows
      .slice()
      .reverse()
      .map((follow) => toEntityItem(follow.followerType, follow.followerId, follow));
  }

  function getTabItems() {
    if (state.activeTab === "seguidores") {
      return getFollowersRecent();
    }

    if (state.activeTab === "seguindo") {
      return getFollowingOf(CURRENT_USER.type, CURRENT_USER.id).map((follow) =>
        toEntityItem(follow.targetType, follow.targetId, follow)
      );
    }

    if (state.activeTab === "ongs") {
      return (state.db.ongs || []).map((ong) => toEntityItem("ong", ong.id));
    }

    return (state.db.volunteers || []).map((volunteer) => toEntityItem("volunteer", volunteer.id));
  }

  function getFilteredItems(items) {
    const query = normalizeText(state.search);
    if (!query) {
      return items;
    }

    return items.filter((item) => {
      const typeLabel = item.type === "ong" ? "ONG" : "Voluntário";
      return normalizeText(`${item.name} ${typeLabel} ${item.description}`).includes(query);
    });
  }

  function formatCount(value) {
    const number = Number(value) || 0;
    if (number >= 1000) {
      const compact = number / 1000;
      return `${compact.toLocaleString("pt-BR", {
        maximumFractionDigits: compact >= 10 ? 0 : 1
      })}K`;
    }

    return String(number);
  }

  function formatFollowers(value) {
    const label = value === 1 ? "seguidor" : "seguidores";
    return `${formatCount(value)} ${label}`;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    return element;
  }

  function createTag(type) {
    const tag = createElement(
      "span",
      `tag ${type === "ong" ? "tag-green" : "tag-purple"} tag-xs tag-static`,
      type === "ong" ? "ONG" : "Voluntário"
    );
    return tag;
  }

  function createAvatar(type) {
    const avatar = createElement("span", `entity-avatar avatar-${type === "ong" ? "ong" : "volunteer"}`);
    const icon = document.createElement("img");
    icon.src = type === "ong" ? ASSETS.ong : ASSETS.volunteer;
    icon.alt = "";
    avatar.appendChild(icon);
    return avatar;
  }

  function createButton(label, variant, onClick) {
    const buttonClasses = {
      secondary: "btn btn-primary btn-pad-xs btn-shadow-sm btn-border-thin",
      outline: "btn btn-outline btn-pad-xs btn-shadow-sm btn-border-thin",
      default: "btn btn-secondary btn-pad-xs btn-shadow-sm btn-border-thin"
    };
    const button = createElement("button", buttonClasses[variant || "default"], label);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  }

  function createProfileLink() {
    const link = createElement("a", "btn btn-secondary btn-pad-xs btn-shadow-sm btn-border-thin", "Ver perfil");
    link.href = "#";
    link.addEventListener("click", (event) => event.preventDefault());
    return link;
  }

  function createEntityCard(item, options) {
    const card = createElement("article", "entity-card");
    card.appendChild(createAvatar(item.type));

    const copy = createElement("div", "entity-copy");
    const titleRow = createElement("div", "entity-title-row");
    titleRow.appendChild(createElement("h3", "", item.name));
    titleRow.appendChild(createTag(item.type));
    copy.appendChild(titleRow);
    copy.appendChild(createElement("p", "", item.description));
    card.appendChild(copy);

    const meta = createElement("div", "entity-meta");
    meta.appendChild(createElement("span", "entity-followers", formatFollowers(item.followers)));

    const actions = createElement("div", "entity-actions");
    if (options && options.allowRemove && item.followId) {
      actions.appendChild(createButton("Remover", "outline", () => removeFollow(item.followId)));
    }

    if (!(item.type === CURRENT_USER.type && Number(item.id) === CURRENT_USER.id)) {
      const following = isCurrentUserFollowing(item.type, item.id);
      actions.appendChild(
        createButton(following ? "Seguindo" : "Seguir", following ? "secondary" : "", () =>
          toggleFollow(item.type, item.id)
        )
      );
    }

    actions.appendChild(createProfileLink());
    meta.appendChild(actions);
    card.appendChild(meta);
    return card;
  }

  function renderEmpty(container, text) {
    container.textContent = "";
    container.appendChild(createElement("p", "empty-state", text));
  }

  function renderMainList() {
    const items = getFilteredItems(getTabItems());
    elements.mainList.textContent = "";
    elements.listTitle.textContent = tabTitles[state.activeTab];
    elements.listCount.textContent = `${items.length} ${items.length === 1 ? "item" : "itens"}`;

    if (!items.length) {
      renderEmpty(elements.mainList, "Nenhum resultado encontrado para esta busca.");
      return;
    }

    const allowRemove = state.activeTab === "seguidores";
    items.forEach((item) => {
      elements.mainList.appendChild(createEntityCard(item, { allowRemove }));
    });
  }

  function renderTabs() {
    elements.tabs.forEach((button) => {
      const isActive = button.dataset.tab === state.activeTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function render() {
    elements.dataWarning.hidden = !state.fetchFailed;

    renderTabs();
    renderMainList();
  }

  function removeFollow(followId) {
    state.follows = state.follows.filter((follow) => String(follow.id) !== String(followId));
    render();
  }

  function toggleFollow(type, id) {
    const existing = state.follows.find(
      (follow) =>
        follow.followerType === CURRENT_USER.type &&
        Number(follow.followerId) === CURRENT_USER.id &&
        follow.targetType === type &&
        Number(follow.targetId) === Number(id)
    );

    if (existing) {
      removeFollow(existing.id);
      return;
    }

    state.follows.push({
      id: `local-${Date.now()}`,
      followerType: CURRENT_USER.type,
      followerId: CURRENT_USER.id,
      targetType: type,
      targetId: Number(id),
      createdAt: new Date().toISOString().slice(0, 10)
    });

    render();
  }

  function bindEvents() {
    elements.tabs.forEach((button) => {
      button.addEventListener("click", () => {
        state.activeTab = button.dataset.tab;
        render();
      });
    });

    elements.search.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderMainList();
    });
  }

  async function init() {
    bindEvents();

    try {
      state.db = await loadDb();
      state.follows = Array.isArray(state.db.follows) ? state.db.follows.slice() : [];
    } catch (error) {
      state.fetchFailed = true;
      state.db = FALLBACK_DB;
      state.follows = FALLBACK_DB.follows.slice();
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
