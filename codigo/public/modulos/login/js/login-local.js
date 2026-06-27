const API_BASE = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';

function api(path) {
  return API_BASE + path;
}

const REDIRECT = {
  0: '../../modulos/home/home-voluntarios.html',
  1: '../../modulos/home/home-ong.html',
};

const form          = document.getElementById('loginForm');
const emailField    = document.getElementById('email');
const passwordField = document.getElementById('senha');
const message       = document.getElementById('formMessage');
const backButton    = document.getElementById('backButton');

function normalize(value) {
  return (value || '').trim().toLowerCase();
}

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = type ? `form-message ${type}` : 'form-message';
}

function setError(fieldName, text) {
  const error = document.getElementById(`erro-${fieldName}`);
  const field = fieldName === 'email' ? emailField : passwordField;
  if (error) error.textContent = text;
  field.setAttribute('aria-invalid', text ? 'true' : 'false');
}

function setLoading(isLoading) {
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Entrando...' : 'Entrar';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function validate() {
  const email    = normalize(emailField.value);
  const password = passwordField.value;
  let valid = true;

  setError('email', '');
  setError('senha', '');
  setMessage('');

  if (!email) {
    setError('email', 'Informe seu e-mail.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setError('email', 'Digite um e-mail válido.');
    valid = false;
  }

  if (!password) {
    setError('senha', 'Informe sua senha.');
    valid = false;
  }

  if (!valid) {
    setMessage('Revise os campos destacados para continuar.', 'error');
  }

  return valid;
}

async function findUserInApi(email, password) {
  const [resVolunteers, resOngs] = await Promise.all([
    fetch(api('/volunteers')),
    fetch(api('/ongs')),
  ]);

  if (!resVolunteers.ok || !resOngs.ok) {
    throw new Error('Erro ao conectar com o servidor.');
  }

  const [volunteers, ongs] = await Promise.all([
    resVolunteers.json(),
    resOngs.json(),
  ]);

  const volunteer = volunteers.find(u =>
    normalize(u.email) === email &&
    String(u.password) === password &&
    u.deletedAt === null
  );

  if (volunteer) {
    return { user: volunteer, type: 0 };
  }

  const ong = ongs.find(u =>
    normalize(u.email) === email &&
    String(u.password) === password &&
    u.deletedAt === null
  );

  if (ong) {
    return { user: ong, type: 1 };
  }

  return null;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validate()) return;

  const email    = normalize(emailField.value);
  const password = passwordField.value;

  setLoading(true);
  setMessage('');

  try {
    const result = await findUserInApi(email, password);

    if (!result) {
      setMessage('E-mail ou senha incorretos.', 'error');
      setLoading(false);
      return;
    }

    const { user, type } = result;
    const session = {
      id:   Number(user.id),
      type: type,
    };
    localStorage.setItem('usuarioLogado', JSON.stringify(session));

    setMessage('Login realizado com sucesso! Redirecionando...', 'success');

    setTimeout(() => {
      window.location.href = REDIRECT[type];
    }, 800);

  } catch (err) {
    console.error(err);
    setMessage('Não foi possível conectar ao servidor. Tente novamente.', 'error');
    setLoading(false);
  }
});

[emailField, passwordField].forEach(field => {
  field.addEventListener('input', () => {
    setError(field.name === 'senha' ? 'senha' : 'email', '');
    setMessage('');
  });
});

backButton.addEventListener('click', () => {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.location.href = '../cadastro-usuario/index.html';
});