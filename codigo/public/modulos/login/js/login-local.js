const USERS_KEY = "tiaw_usuarios_voluntarios";
const CURRENT_USER_KEY = "usuarioCorrente";

const form = document.getElementById("loginForm");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("senha");
const message = document.getElementById("formMessage");
const backButton = document.getElementById("backButton");

function normalize(value) {
  return value.trim().toLowerCase();
}

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = type ? `form-message ${type}` : "form-message";
}

function setError(fieldName, text) {
  const error = document.getElementById(`erro-${fieldName}`);
  const field = fieldName === "email" ? emailField : passwordField;

  error.textContent = text;
  field.setAttribute("aria-invalid", text ? "true" : "false");
}

function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch (error) {
    return [];
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function validate() {
  const email = normalize(emailField.value);
  const password = passwordField.value;
  let valid = true;

  setError("email", "");
  setError("senha", "");
  setMessage("");

  if (!email) {
    setError("email", "Informe seu email.");
    valid = false;
  } else if (!isValidEmail(email)) {
    setError("email", "Digite um email valido.");
    valid = false;
  }

  if (!password) {
    setError("senha", "Informe sua senha.");
    valid = false;
  }

  if (!valid) {
    setMessage("Revise os campos destacados para entrar.", "error");
  }

  return valid;
}

function findUser(email, password) {
  return readUsers().find((user) => {
    const savedEmail = normalize(String(user.email || user.login || ""));
    return savedEmail === email && String(user.senha || "") === password;
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validate()) {
    return;
  }

  const user = findUser(normalize(emailField.value), passwordField.value);

  if (!user) {
    setMessage("Email ou senha incorretos.", "error");
    return;
  }

  const currentUser = {
    id: user.id,
    nome: user.nome,
    login: user.login || user.email,
    email: user.email,
    tipo: user.tipo || "voluntario"
  };

  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  setMessage("Login realizado com sucesso.", "success");
});

[emailField, passwordField].forEach((field) => {
  field.addEventListener("input", () => {
    setError(field.name, "");
    setMessage("");
  });
});

backButton.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.href = "../cadastro-usuario/index.html";
});
