const STORAGE_KEY = "tiaw_usuarios_voluntarios";

const form = document.getElementById("cadastroUsuarioForm");
const successPanel = document.getElementById("successPanel");
const formMessage = document.getElementById("formMessage");
const backButton = document.getElementById("backButton");
const prevButton = document.getElementById("prevStep");
const nextButton = document.getElementById("nextStep");
const submitButton = document.getElementById("submitForm");
const stepIntro = document.getElementById("stepIntro");
const stepIllustration = document.getElementById("stepIllustration");
const steps = Array.from(document.querySelectorAll(".form-step"));
const dots = Array.from(document.querySelectorAll(".step-dot"));

let currentStep = 0;

const introByStep = [
  "Venha fazer parte dessa comunidade!",
  "Precisamos de alguns dados para completar seu perfil.",
  "Conte um pouco mais sobre voce"
];

const illustrationByStep = [
  "assets/successful-person.svg",
  "assets/fingerprint-login.svg",
  "assets/living.svg"
];

const fieldsByStep = [
  ["nome", "email", "senha", "confirmarSenha"],
  ["telefone", "cpf", "cidade", "estado", "areaInteresse"],
  ["historia"]
];

function getField(name) {
  return form.elements[name];
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function normalizeText(value) {
  return value.trim().replace(/\s+/g, " ");
}

function setMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = type ? `form-message ${type}` : "form-message";
}

function setFieldError(name, message) {
  const errorElement = document.getElementById(`erro-${name}`);
  const field = getField(name);

  if (errorElement) {
    errorElement.textContent = message;
  }

  if (field) {
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }
}

function clearStepErrors(stepIndex) {
  fieldsByStep[stepIndex].forEach((fieldName) => setFieldError(fieldName, ""));
  setMessage("", "");
}

function formatCpf(value) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidCpf(cpfValue) {
  const cpf = onlyDigits(cpfValue);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  for (let size = 9; size < 11; size += 1) {
    let sum = 0;

    for (let index = 0; index < size; index += 1) {
      sum += Number(cpf[index]) * (size + 1 - index);
    }

    const digit = ((sum * 10) % 11) % 10;

    if (digit !== Number(cpf[size])) {
      return false;
    }
  }

  return true;
}

function readUsers() {
  const savedUsers = localStorage.getItem(STORAGE_KEY);

  if (!savedUsers) {
    return [];
  }

  try {
    const users = JSON.parse(savedUsers);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function emailAlreadyExists(email) {
  const normalizedEmail = email.toLowerCase();
  return readUsers().some((user) => String(user.email).toLowerCase() === normalizedEmail);
}

function cpfAlreadyExists(cpfValue) {
  const cpfDigits = onlyDigits(cpfValue);
  return readUsers().some((user) => onlyDigits(String(user.cpf || user.cpfNumeros || "")) === cpfDigits);
}

function createUserId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `vol-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function validateStep(stepIndex) {
  clearStepErrors(stepIndex);

  const nome = normalizeText(getField("nome").value);
  const email = normalizeText(getField("email").value);
  const senha = getField("senha").value;
  const confirmarSenha = getField("confirmarSenha").value;
  const telefone = getField("telefone").value;
  const cpf = getField("cpf").value;
  const cidade = normalizeText(getField("cidade").value);
  const estado = getField("estado").value;
  const areaInteresse = getField("areaInteresse").value;

  let isValid = true;

  if (stepIndex === 0) {
    if (!nome) {
      setFieldError("nome", "Informe seu nome completo.");
      isValid = false;
    }

    if (!email) {
      setFieldError("email", "Informe seu email.");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setFieldError("email", "Digite um email valido.");
      isValid = false;
    } else if (emailAlreadyExists(email)) {
      setFieldError("email", "Este email ja foi cadastrado.");
      isValid = false;
    }

    if (!senha) {
      setFieldError("senha", "Informe uma senha.");
      isValid = false;
    } else if (senha.length < 6) {
      setFieldError("senha", "Use pelo menos 6 caracteres.");
      isValid = false;
    }

    if (!confirmarSenha) {
      setFieldError("confirmarSenha", "Confirme sua senha.");
      isValid = false;
    } else if (senha !== confirmarSenha) {
      setFieldError("confirmarSenha", "As senhas nao conferem.");
      isValid = false;
    }
  }

  if (stepIndex === 1) {
    const phoneDigits = onlyDigits(telefone);

    if (!phoneDigits) {
      setFieldError("telefone", "Informe seu telefone.");
      isValid = false;
    } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      setFieldError("telefone", "Digite um telefone valido.");
      isValid = false;
    }

    if (!cpf) {
      setFieldError("cpf", "Informe seu CPF.");
      isValid = false;
    } else if (!isValidCpf(cpf)) {
      setFieldError("cpf", "Digite um CPF valido.");
      isValid = false;
    } else if (cpfAlreadyExists(cpf)) {
      setFieldError("cpf", "Este CPF ja foi cadastrado.");
      isValid = false;
    }

    if (!cidade) {
      setFieldError("cidade", "Informe sua cidade.");
      isValid = false;
    }

    if (!estado) {
      setFieldError("estado", "Informe seu estado.");
      isValid = false;
    }

    if (!areaInteresse) {
      setFieldError("areaInteresse", "Selecione uma area de interesse.");
      isValid = false;
    }
  }

  if (!isValid) {
    setMessage("Revise os campos destacados para continuar.", "error");
  }

  return isValid;
}

function validateAllSteps() {
  return steps.every((step, index) => validateStep(index));
}

function updateStep() {
  steps.forEach((step, index) => {
    step.hidden = index !== currentStep;
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentStep);
  });

  prevButton.hidden = currentStep === 0;
  nextButton.hidden = currentStep === steps.length - 1;
  submitButton.hidden = currentStep !== steps.length - 1;
  stepIntro.textContent = introByStep[currentStep];
  stepIllustration.src = illustrationByStep[currentStep];
  clearStepErrors(currentStep);
}

function goToStep(stepIndex) {
  currentStep = Math.max(0, Math.min(stepIndex, steps.length - 1));
  updateStep();
}

function buildUser() {
  const email = normalizeText(getField("email").value);
  const cpf = getField("cpf").value;

  return {
    id: createUserId(),
    tipo: "voluntario",
    nome: normalizeText(getField("nome").value),
    login: email,
    email,
    senha: getField("senha").value,
    telefone: getField("telefone").value,
    cpf,
    cpfNumeros: onlyDigits(cpf),
    cidade: normalizeText(getField("cidade").value),
    estado: getField("estado").value,
    areaInteresse: getField("areaInteresse").value,
    historia: normalizeText(getField("historia").value),
    criadoEm: new Date().toISOString()
  };
}

function handleSubmit(event) {
  event.preventDefault();

  if (!validateAllSteps()) {
    const firstInvalidStep = steps.findIndex((step, index) => {
      return fieldsByStep[index].some((fieldName) => {
        const field = getField(fieldName);
        return field && field.getAttribute("aria-invalid") === "true";
      });
    });

    goToStep(firstInvalidStep === -1 ? currentStep : firstInvalidStep);
    return;
  }

  const users = readUsers();
  const newUser = buildUser();

  users.push(newUser);
  saveUsers(users);

  form.hidden = true;
  successPanel.hidden = false;
  setMessage("", "");
}

backButton.addEventListener("click", () => {
  if (currentStep > 0) {
    goToStep(currentStep - 1);
    return;
  }

  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.href = "../login/login.html";
});

prevButton.addEventListener("click", () => {
  goToStep(currentStep - 1);
});

nextButton.addEventListener("click", () => {
  if (validateStep(currentStep)) {
    goToStep(currentStep + 1);
  }
});

form.addEventListener("submit", handleSubmit);

getField("cpf").addEventListener("input", (event) => {
  event.target.value = formatCpf(event.target.value);
});

getField("telefone").addEventListener("input", (event) => {
  event.target.value = formatPhone(event.target.value);
});

Array.from(form.elements).forEach((field) => {
  if (!field.name) {
    return;
  }

  field.addEventListener("input", () => {
    setFieldError(field.name, "");
    setMessage("", "");
  });
});

updateStep();
