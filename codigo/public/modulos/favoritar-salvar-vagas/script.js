(function () {
  const CURRENT_VOLUNTEER_ID = 1;
  const STORAGE_KEY = `voluntarize:favoritas:${CURRENT_VOLUNTEER_ID}`;
  const DB_URLS = ["../../db/db.json", "/db/db.json", "http://localhost:3000/db/db.json"];

  const state = {
    db: { actions: [], ongs: [], favorites: [] },
    savedIds: new Set(),
    activeFilter: "salvas",
    search: "",
    fetchFailed: false
  };

  const elements = {
    search: document.getElementById("search-input"),
    tabs: document.querySelectorAll(".tab-button"),
    listTitle: document.getElementById("list-title"),
    listSubtitle: document.getElementById("list-subtitle"),
    listCount: document.getElementById("list-count"),
    cardsList: document.getElementById("cards-list"),
    dataWarning: document.getElementById("data-warning")
  };

  const filterCopy = {
    salvas: {
      title: "Vagas salvas",
      subtitle: "Oportunidades marcadas como interesse pelo voluntário."
    },
    todas: {
      title: "Todas as vagas",
      subtitle: "Escolha oportunidades para salvar e acompanhar depois."
    },
    abertas: {
      title: "Vagas abertas",
      subtitle: "Oportunidades disponíveis para novas candidaturas."
    },
    encerradas: {
      title: "Vagas encerradas",
      subtitle: "Oportunidades finalizadas que continuam no histórico."
    }
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatDate(date) {
    if (!date) return "Data não informada";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  function plural(value, singular, pluralText) {
    return `${value} ${value === 1 ? singular : pluralText}`;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  async function fetchDatabase() {
    for (const url of DB_URLS) {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (response.ok) return await response.json();
      } catch (error) {
        // Try the next source.
      }
    }

    state.fetchFailed = true;
    return { actions: [], ongs: [], favorites: [] };
  }

  function getInitialSavedIds(db) {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        return new Set(JSON.parse(stored).map(Number).filter(Boolean));
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    return new Set(
      (db.favorites || [])
        .filter((favorite) => Number(favorite.volunteerId) === CURRENT_VOLUNTEER_ID)
        .map((favorite) => Number(favorite.actionId))
    );
  }

  function persistSavedIds() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.savedIds]));
  }

  function getOngName(ongId) {
    const ong = state.db.ongs.find((item) => Number(item.id) === Number(ongId));
    return ong ? ong.name : "ONG";
  }

  function isSaved(actionId) {
    return state.savedIds.has(Number(actionId));
  }

  function getAvailableVacancies(action) {
    const participants = Array.isArray(action.participants) ? action.participants.length : 0;
    return Math.max(Number(action.vacancies || 0) - participants, 0);
  }

  function getActionText(action) {
    return normalize(
      [
        action.title,
        action.description,
        action.location,
        getOngName(action.ongId),
        ...(action.tags || [])
      ].join(" ")
    );
  }

  function getFilteredActions() {
    const query = normalize(state.search);

    return (state.db.actions || [])
      .filter((action) => !action.deletedAt)
      .filter((action) => {
        if (state.activeFilter === "salvas") return isSaved(action.id);
        if (state.activeFilter === "abertas") return action.status === "open";
        if (state.activeFilter === "encerradas") return action.status !== "open";
        return true;
      })
      .filter((action) => !query || getActionText(action).includes(query))
      .sort((a, b) => {
        const savedDiff = Number(isSaved(b.id)) - Number(isSaved(a.id));
        if (savedDiff) return savedDiff;
        return new Date(a.date || 0) - new Date(b.date || 0);
      });
  }

  function renderTabs() {
    elements.tabs.forEach((button) => {
      const isActive = button.dataset.filter === state.activeFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderEmpty() {
    const empty = createElement(
      "p",
      "empty-state",
      state.activeFilter === "salvas"
        ? "Nenhuma vaga salva encontrada. Veja todas as vagas e marque as que despertarem interesse."
        : "Nenhuma vaga encontrada para esta busca."
    );
    elements.cardsList.appendChild(empty);
  }

  function createStatusTag(action) {
    const tag = createElement(
      "span",
      `tag tag-xs tag-shadow-xs ${action.status === "open" ? "tag-green" : "tag-white"}`,
      action.status === "open" ? "Aberta" : "Encerrada"
    );
    return tag;
  }

  function createTags(tags) {
    const container = createElement("div", "card-tags");
    (tags || []).slice(0, 3).forEach((tag) => {
      container.appendChild(createElement("span", "tag tag-white tag-xs tag-shadow-xs", tag));
    });
    return container;
  }

  function createCard(action) {
    const saved = isSaved(action.id);
    const card = createElement("article", "job-card");

    const top = createElement("div", "card-top");
    const icon = createElement("span", "card-icon");
    icon.innerHTML = `<i class="${saved ? "fa-solid" : "fa-regular"} fa-bookmark" aria-hidden="true"></i>`;

    const titleGroup = createElement("div", "card-title-group");
    titleGroup.appendChild(createElement("h3", "", action.title));
    titleGroup.appendChild(createElement("p", "card-ong", `Por: ${getOngName(action.ongId)}`));
    top.append(icon, titleGroup);

    const description = createElement("p", "card-description", action.description || "Descrição não informada.");

    const meta = createElement("div", "card-meta");
    meta.appendChild(createMetaItem("fa-regular fa-calendar", formatDate(action.date)));
    meta.appendChild(createMetaItem("fa-solid fa-location-dot", action.location || "Local não informado"));
    meta.appendChild(createMetaItem("fa-solid fa-user-group", plural(getAvailableVacancies(action), "vaga", "vagas")));

    const footer = createElement("div", "card-actions");
    footer.appendChild(createStatusTag(action));

    const saveButton = createElement(
      "button",
      `btn btn-pad-xs btn-border-thin btn-shadow-sm btn-save ${saved ? "is-saved" : "btn-primary"}`,
      saved ? "Salva" : "Salvar"
    );
    saveButton.type = "button";
    saveButton.innerHTML = `<i class="${saved ? "fa-solid" : "fa-regular"} fa-bookmark" aria-hidden="true"></i>${saved ? "Salva" : "Salvar"}`;
    saveButton.addEventListener("click", () => toggleSaved(action.id));

    const detailsLink = createElement("a", "btn btn-secondary btn-pad-xs btn-border-thin btn-shadow-sm", "Ver vaga");
    detailsLink.href = "#";
    detailsLink.addEventListener("click", (event) => event.preventDefault());

    footer.append(saveButton, detailsLink);

    card.append(top, description, meta, createTags(action.tags), footer);
    return card;
  }

  function createMetaItem(iconClass, text) {
    const item = createElement("span");
    item.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>${text}`;
    return item;
  }

  function renderList() {
    const actions = getFilteredActions();
    const copy = filterCopy[state.activeFilter];

    elements.listTitle.textContent = copy.title;
    elements.listSubtitle.textContent = copy.subtitle;
    elements.listCount.textContent = plural(actions.length, "vaga", "vagas");
    elements.cardsList.textContent = "";

    if (!actions.length) {
      renderEmpty();
      return;
    }

    actions.forEach((action) => {
      elements.cardsList.appendChild(createCard(action));
    });
  }

  function render() {
    elements.dataWarning.hidden = !state.fetchFailed;
    renderTabs();
    renderList();
  }

  function toggleSaved(actionId) {
    const numericId = Number(actionId);

    if (state.savedIds.has(numericId)) {
      state.savedIds.delete(numericId);
    } else {
      state.savedIds.add(numericId);
    }

    persistSavedIds();
    render();
  }

  function bindEvents() {
    elements.search.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderList();
    });

    elements.tabs.forEach((button) => {
      button.addEventListener("click", () => {
        state.activeFilter = button.dataset.filter;
        render();
      });
    });
  }

  async function init() {
    bindEvents();
    const db = await fetchDatabase();
    state.db = {
      actions: db.actions || [],
      ongs: db.ongs || [],
      favorites: db.favorites || []
    };
    state.savedIds = getInitialSavedIds(state.db);
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
})();
