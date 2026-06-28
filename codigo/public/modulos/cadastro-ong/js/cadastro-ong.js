const API_BASE = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, "") : "";
const STORAGE_KEY = "tiaw_ongs";

function api(path) {
  return API_BASE + path;
}

const choiceScreen = document.getElementById("choiceScreen");
const registerScreen = document.getElementById("registerScreen");
const form = document.getElementById("ongForm");
const successPanel = document.getElementById("successPanel");
const formMessage = document.getElementById("formMessage");
const backButton = document.getElementById("backButton");
const startButton = document.getElementById("startOng");
const prevButton = document.getElementById("prevStep");
const nextButton = document.getElementById("nextStep");
const submitButton = document.getElementById("submitForm");
const stepIntro = document.getElementById("stepIntro");
const stepIllustration = document.getElementById("stepIllustration");
const steps = Array.from(document.querySelectorAll(".form-step"));
const dots = Array.from(document.querySelectorAll(".dot"));
const choiceButtons = Array.from(document.querySelectorAll("[data-register-type]"));

let currentStep = 0;
let selectedRegisterType = "ongs";

const registerRoutes = {
  ongs: {
    jsonKey: "ongs",
    url: "./index.html"
  },
  volunteers: {
    jsonKey: "volunteers",
    url: "../cadastro-usuario/index.html?start=1"
  }
};

const introByStep = [
  "Venha fazer parte dessa comunidade!",
  "Venha fazer parte dessa comunidade!",
  "Venha fazer parte dessa comunidade!",
  "Conte um pouco mais sobre a ONG"
];

const illustrationByStep = [
  "assets/successful-group.svg",
  "assets/successful-group.svg",
  "assets/successful-group.svg",
  "assets/successful-person.svg"
];

const fieldsByStep = [
  ["nomeOng", "email", "senha", "confirmarSenha"],
  ["telefone", "cnpj", "cep", "dataFundacao"],
  ["responsavel", "cpfResponsavel", "emailResponsavel", "nascimentoResponsavel"],
  ["site", "historia"]
];

function field(name) {
  return form.elements[name];
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function normalizeText(value) {
  return value.trim().replace(/\s+/g, " ");
}

function setMessage(message, type = "") {
  formMessage.textContent = message;
  formMessage.className = type ? `form-message ${type}` : "form-message";
}

function setError(name, message) {
  const errorElement = document.getElementById(`erro-${name}`);
  const input = field(name);

  if (errorElement) {
    errorElement.textContent = message;
  }

  if (input) {
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }
}

function clearErrors(stepIndex) {
  fieldsByStep[stepIndex].forEach((name) => setError(name, ""));
  setMessage("");
}

function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function formatCpf(value) {
  return onlyDigits(value).slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCnpj(value) {
  return onlyDigits(value).slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatCep(value) {
  return onlyDigits(value).slice(0, 8).replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

function formatDate(value) {
  return onlyDigits(value).slice(0, 8)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isValidDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day);

  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day && date <= new Date();
}

function isValidCpf(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  for (let size = 9; size < 11; size += 1) {
    let sum = 0;
    for (let index = 0; index < size; index += 1) {
      sum += Number(cpf[index]) * (size + 1 - index);
    }

    const digit = ((sum * 10) % 11) % 10;
    if (digit !== Number(cpf[size])) return false;
  }

  return true;
}

function isValidCnpj(value) {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const calculateDigit = (size) => {
    const weights = size === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((total, weight, index) => total + Number(cnpj[index]) * weight, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return calculateDigit(12) === Number(cnpj[12]) && calculateDigit(13) === Number(cnpj[13]);
}

function readOngs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveOngs(ongs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ongs));
}

function emailAlreadyExists(email) {
  const comparable = email.toLowerCase();
  return readOngs().some((ong) => String(ong.email || "").toLowerCase() === comparable);
}

function cnpjAlreadyExists(cnpj) {
  const comparable = onlyDigits(cnpj);
  return readOngs().some((ong) => onlyDigits(String(ong.cnpj || ong.cnpjNumeros || "")) === comparable);
}

function validateStep(stepIndex) {
  clearErrors(stepIndex);

  let valid = true;
  const fail = (name, message) => {
    setError(name, message);
    valid = false;
  };

  if (stepIndex === 0) {
    const email = normalizeText(field("email").value);
    const senha = field("senha").value;

    if (!normalizeText(field("nomeOng").value)) fail("nomeOng", "Informe o nome da ONG.");
    if (!email) fail("email", "Informe o email.");
    else if (!isValidEmail(email)) fail("email", "Digite um email valido.");
    else if (emailAlreadyExists(email)) fail("email", "Este email ja foi cadastrado.");
    if (!senha) fail("senha", "Informe uma senha.");
    else if (senha.length < 6) fail("senha", "Use pelo menos 6 caracteres.");
    if (!field("confirmarSenha").value) fail("confirmarSenha", "Confirme sua senha.");
    else if (senha !== field("confirmarSenha").value) fail("confirmarSenha", "As senhas nao conferem.");
  }

  if (stepIndex === 1) {
    const phoneDigits = onlyDigits(field("telefone").value);
    const cnpj = field("cnpj").value;
    const cep = onlyDigits(field("cep").value);

    if (phoneDigits.length < 10 || phoneDigits.length > 11) fail("telefone", "Digite um telefone valido.");
    if (!isValidCnpj(cnpj)) fail("cnpj", "Digite um CNPJ valido.");
    else if (cnpjAlreadyExists(cnpj)) fail("cnpj", "Este CNPJ ja foi cadastrado.");
    if (cep.length !== 8) fail("cep", "Digite um CEP valido.");
    if (!isValidDate(field("dataFundacao").value)) fail("dataFundacao", "Digite uma data valida.");
  }

  if (stepIndex === 2) {
    const emailResponsavel = normalizeText(field("emailResponsavel").value);

    if (!normalizeText(field("responsavel").value)) fail("responsavel", "Informe o responsavel.");
    if (!isValidCpf(field("cpfResponsavel").value)) fail("cpfResponsavel", "Digite um CPF valido.");
    if (!emailResponsavel) fail("emailResponsavel", "Informe o email.");
    else if (!isValidEmail(emailResponsavel)) fail("emailResponsavel", "Digite um email valido.");
    if (!isValidDate(field("nascimentoResponsavel").value)) fail("nascimentoResponsavel", "Digite uma data valida.");
  }

  if (stepIndex === 3) {
    const site = normalizeText(field("site").value);
    if (site && !/^https?:\/\/.+\..+/.test(site)) fail("site", "Digite uma URL iniciando com http:// ou https://.");
    if (!normalizeText(field("historia").value)) fail("historia", "Conte a historia da ONG.");
  }

  if (!valid) {
    setMessage("Revise os campos destacados para continuar.", "error");
  }

  return valid;
}

function showRegister() {
  choiceScreen.hidden = true;
  registerScreen.hidden = false;
  backButton.hidden = false;
  updateStep();
}

function toIsoDate(value) {
  const [day, month, year] = value.split("/");
  return day && month && year ? `${year}-${month}-${day}` : value;
}

function selectRegisterType(type) {
  selectedRegisterType = type;

  choiceButtons.forEach((button) => {
    button.classList.remove("isActive");
    button.setAttribute("aria-pressed", "false");
  });

  const activeButton = choiceButtons.find(
    button => button.dataset.registerType === type
  );

  if (activeButton) {
    activeButton.classList.add("isActive");
    activeButton.setAttribute("aria-pressed", "true");
  }
}

function startSelectedRegister() {
  const route = registerRoutes[selectedRegisterType];

  if (!route) return;

  if (route.jsonKey === "volunteers") {
    window.location.href = route.url;
    return;
  }

  showRegister();
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
  clearErrors(currentStep);
}

function goToStep(stepIndex) {
  currentStep = Math.max(0, Math.min(stepIndex, steps.length - 1));
  updateStep();
}

async function createOng() {
  return {
    id: await generateNewId(),
    name: normalizeText(field("nomeOng").value),
    email: normalizeText(field("email").value),
    password: field("senha").value,
    cnpj: field("cnpj").value,
    foundationDate: toIsoDate(field("dataFundacao").value),
    cep: field("cep").value,
    address: "",
    city: "",
    state: "",
    latitude: null,
    longitude: null,
    description: normalizeText(field("historia").value),
    responsibleName: normalizeText(field("responsavel").value),
    responsibleCpf: field("cpfResponsavel").value,
    responsibleEmail: normalizeText(field("emailResponsavel").value),
    responsibleBirthDate: toIsoDate(field("nascimentoResponsavel").value),
    phone: field("telefone").value,
    website: normalizeText(field("site").value),
    logo: "",
    rating: 0,
    createdAt: new Date().toISOString().slice(0, 10),
    deletedAt: null
  };
}

async function generateNewId(){
  const listResponse = await fetch(api("/ongs"));

  if (!listResponse.ok) {
    throw new Error("Nao foi possivel consultar as ONGs.");
  }
  const ongs = await listResponse.json();
  return parseInt(ongs[ongs.length - 1].id) + 1;
}

async function postOng(ong) {  
  const response = await fetch(api("/ongs"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel salvar a ONG.");
  }

  return response.json();
}

function setSubmitting(isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "Cadastrando..." : "Cadastrar";
}

async function handleSubmit(event) {
  event.preventDefault();

  for (let index = 0; index < steps.length; index += 1) {
    if (!validateStep(index)) {
      currentStep = index;
      steps.forEach((step, stepIndex) => {
        step.hidden = stepIndex !== currentStep;
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === currentStep);
      });
      prevButton.hidden = currentStep === 0;
      nextButton.hidden = currentStep === steps.length - 1;
      submitButton.hidden = currentStep !== steps.length - 1;
      stepIntro.textContent = introByStep[currentStep];
      stepIllustration.src = illustrationByStep[currentStep];
      return;
    }
  }

  setSubmitting(true);
  setMessage("");

  try {
    const ong = await createOng();
    const savedOng = await postOng(ong);
    const ongs = readOngs();
    ongs.push(savedOng);
    saveOngs(ongs);

    form.hidden = true;
    successPanel.hidden = false;
    setMessage("", "success");
  } catch (error) {
    console.error(error);
    setMessage("Nao foi possivel salvar no servidor. Verifique se a API esta ativa.", "error");
  } finally {
    setSubmitting(false);
  }
}

startButton.addEventListener("click", startSelectedRegister);

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => selectRegisterType(button.dataset.registerType));
});

selectRegisterType(selectedRegisterType);

if (new URLSearchParams(window.location.search).get("start") === "1") {
  showRegister();
}

backButton.addEventListener("click", () => {
  if (!registerScreen.hidden && currentStep > 0) {
    goToStep(currentStep - 1);
    return;
  }

  if (!registerScreen.hidden) {
    registerScreen.hidden = true;
    choiceScreen.hidden = false;
    backButton.hidden = true;
    return;
  }

  if (window.history.length > 1) window.history.back();
});

prevButton.addEventListener("click", () => goToStep(currentStep - 1));

nextButton.addEventListener("click", () => {
  if (validateStep(currentStep)) {
    goToStep(currentStep + 1);
  }
});

form.addEventListener("submit", handleSubmit);

field("telefone").addEventListener("input", (event) => event.target.value = formatPhone(event.target.value));
field("cnpj").addEventListener("input", (event) => event.target.value = formatCnpj(event.target.value));
field("cep").addEventListener("input", (event) => event.target.value = formatCep(event.target.value));
field("dataFundacao").addEventListener("input", (event) => event.target.value = formatDate(event.target.value));
field("cpfResponsavel").addEventListener("input", (event) => event.target.value = formatCpf(event.target.value));
field("nascimentoResponsavel").addEventListener("input", (event) => event.target.value = formatDate(event.target.value));

Array.from(form.elements).forEach((input) => {
  if (!input.name) return;
  input.addEventListener("input", () => {
    setError(input.name, "");
    setMessage("");
  });
});
