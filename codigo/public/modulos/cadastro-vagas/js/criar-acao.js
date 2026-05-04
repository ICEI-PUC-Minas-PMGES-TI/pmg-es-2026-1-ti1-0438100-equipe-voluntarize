(function () {
  const STORAGE_KEY = "acoesCadastradas";

  const form = document.getElementById("criarAcaoForm");
  const feedback = document.getElementById("feedback");
  const backButton = document.querySelector(".back-button");

  const getFieldValue = (fieldName) => form.elements[fieldName].value.trim();

  const parseTags = (tagsText) => {
    return tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const getStoredActions = () => {
    const storedActions = localStorage.getItem(STORAGE_KEY);

    if (!storedActions) {
      return [];
    }

    try {
      const parsedActions = JSON.parse(storedActions);
      return Array.isArray(parsedActions) ? parsedActions : [];
    } catch (error) {
      return [];
    }
  };

  const saveAction = (actionData) => {
    const actions = getStoredActions();
    actions.push(actionData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions, null, 2));
  };

  const showFeedback = (message, isError) => {
    feedback.textContent = message;
    feedback.classList.toggle("feedback--error", Boolean(isError));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      showFeedback("Preencha todos os campos obrigatórios.", true);
      return;
    }

    const actionData = {
      id: Date.now(),
      nomeAcao: getFieldValue("nomeAcao"),
      localizacao: getFieldValue("localizacao"),
      data: getFieldValue("dataAcao"),
      descricao: getFieldValue("descricao"),
      tags: parseTags(getFieldValue("tags")),
      criadoEm: new Date().toISOString()
    };

    saveAction(actionData);
    form.reset();
    showFeedback("Ação cadastrada com sucesso.");
  });

  backButton.addEventListener("click", () => {
    window.history.back();
  });
})();
