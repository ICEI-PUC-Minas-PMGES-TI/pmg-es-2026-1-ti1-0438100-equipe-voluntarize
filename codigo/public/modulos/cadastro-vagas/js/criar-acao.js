(function () {
  const API_BASE = (window.__ENV && window.__ENV.UR_API)
    ? window.__ENV.UR_API.replace(/\/$/, "")
    : "";
  const DB_FILE = "../../db/db.json";
  const HOME_ONG_URL = "../home/home-ong.html#vagas";

  const state = {
    tags: [],
    selectedTags: [],
    dropdownOpen: false
  };

  const form = document.getElementById("criarAcaoForm");
  const feedback = document.getElementById("feedback");
  const backButton = document.querySelector(".back-button");
  const submitButton = form.querySelector('button[type="submit"]');
  const tagsBox = document.getElementById("actionTagsBox");
  const selectedTagsContainer = document.getElementById("tagsSelecionadas");
  const tagsDropdown = document.getElementById("tagsDropdown");
  const addTagButton = document.getElementById("btnAddTag");

  const getFieldValue = (fieldName) => form.elements[fieldName].value.trim();

  const getLoggedOngId = () => {
    try {
      const session = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
      return session?.type === 1 && session.id != null ? Number(session.id) : null;
    } catch (error) {
      return null;
    }
  };

  const api = (path) => `${API_BASE}${path}`;

  const postAction = async (actionData) => {
    const response = await fetch(api("/actions"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actionData)
    });

    if (!response.ok) {
      throw new Error(`Erro ao cadastrar ação: ${response.status}`);
    }

    return response.json();
  };

  const setSubmitting = (isSubmitting) => {
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? "Cadastrando..." : "Concluir";
  };

  const showFeedback = (message, isError = false) => {
    feedback.textContent = message;
    feedback.classList.toggle("feedback--error", isError);
  };

  const openDropdown = () => {
    state.dropdownOpen = true;
    tagsDropdown.classList.add("open");
    tagsDropdown.setAttribute("aria-hidden", "false");
    addTagButton.setAttribute("aria-expanded", "true");
  };

  const closeDropdown = () => {
    state.dropdownOpen = false;
    tagsDropdown.classList.remove("open");
    tagsDropdown.setAttribute("aria-hidden", "true");
    addTagButton.setAttribute("aria-expanded", "false");
  };

  const createSelectedTag = (tagName) => {
    const tag = document.createElement("span");
    tag.className = "tag tag-white tag-xs tag-removable";

    const text = document.createElement("span");
    text.className = "tag-text";
    text.textContent = tagName;

    const removeButton = document.createElement("button");
    removeButton.className = "tag-remove";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remover ${tagName}`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      state.selectedTags = state.selectedTags.filter((tag) => tag !== tagName);
      renderSelectedTags();
      renderDropdown();
      showFeedback("");
    });

    tag.append(text, removeButton);
    return tag;
  };

  const renderSelectedTags = () => {
    selectedTagsContainer.innerHTML = "";

    if (!state.selectedTags.length) {
      const placeholder = document.createElement("span");
      placeholder.className = "action-tags-placeholder";
      placeholder.textContent = "Nenhuma tag selecionada";
      selectedTagsContainer.appendChild(placeholder);
      return;
    }

    state.selectedTags.forEach((tagName) => {
      selectedTagsContainer.appendChild(createSelectedTag(tagName));
    });
  };

  const renderDropdown = () => {
    tagsDropdown.innerHTML = "";

    state.tags.forEach((tag) => {
      const selected = state.selectedTags.includes(tag.name);
      const option = document.createElement("button");
      option.className = `btn btn-outline btn-pad-xs btn-rounded-full btn-shadow-xs action-tag-option${selected ? " selected" : ""}`;
      option.type = "button";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(selected));
      option.disabled = selected;
      option.textContent = selected ? `${tag.name} ✓` : tag.name;

      option.addEventListener("click", (event) => {
        event.stopPropagation();
        state.selectedTags.push(tag.name);
        renderSelectedTags();
        renderDropdown();
        showFeedback("");
      });

      tagsDropdown.appendChild(option);
    });
  };

  const loadTags = async () => {
    try {
      let response = await fetch(api("/tags"));
      let tags;

      if (!response.ok) {
        response = await fetch(DB_FILE);

        if (!response.ok) {
          throw new Error("Não foi possível carregar as tags.");
        }

        const database = await response.json();
        tags = database.tags;
      } else {
        tags = await response.json();
      }

      state.tags = Array.isArray(tags) ? tags : [];
      renderDropdown();

      if (!state.tags.length) {
        addTagButton.disabled = true;
        showFeedback("Nenhuma tag está disponível no momento.", true);
      }
    } catch (error) {
      addTagButton.disabled = true;
      showFeedback("Não foi possível carregar as tags. Atualize a página e tente novamente.", true);
    }
  };

  addTagButton.addEventListener("click", (event) => {
    event.stopPropagation();
    state.dropdownOpen ? closeDropdown() : openDropdown();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("#actionTagsBox")) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.dropdownOpen) {
      closeDropdown();
      addTagButton.focus();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      showFeedback("Preencha todos os campos obrigatórios.", true);
      return;
    }

    if (!state.selectedTags.length) {
      showFeedback("Selecione pelo menos uma tag para a ação.", true);
      openDropdown();
      addTagButton.focus();
      return;
    }

    const ongId = getLoggedOngId();

    if (ongId === null) {
      showFeedback("Entre com uma conta de ONG para cadastrar uma ação.", true);
      return;
    }

    const actionDate = getFieldValue("dataAcao");

    const actionData = {
      title: getFieldValue("nomeAcao"),
      description: getFieldValue("descricao"),
      location: getFieldValue("localizacao"),
      date: actionDate,
      ongId,
      tags: [...state.selectedTags],
      participants: [],
      vacancies: Number(getFieldValue("quantidadeVagas")),
      views: 0,
      status: "open",
      endDate: actionDate,
      image: "",
      checkInCode: `AC-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString().split("T")[0],
      deletedAt: null
    };

    setSubmitting(true);
    showFeedback("");

    try {
      await postAction(actionData);
      form.reset();
      state.selectedTags = [];
      renderSelectedTags();
      renderDropdown();
      closeDropdown();
      setTimeout(() => {
        window.location.href = HOME_ONG_URL;
      }, 700);
      showFeedback("Ação cadastrada com sucesso.");
    } catch (error) {
      console.error(error);
      showFeedback("Não foi possível cadastrar a ação. Verifique o servidor e tente novamente.", true);
    } finally {
      setSubmitting(false);
    }
  });

  backButton.addEventListener("click", () => {
    window.location.href = HOME_ONG_URL;
  });

  renderSelectedTags();
  loadTags();
})();
