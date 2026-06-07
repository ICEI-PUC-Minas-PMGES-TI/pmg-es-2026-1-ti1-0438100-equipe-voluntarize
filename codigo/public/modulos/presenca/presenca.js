(function () {
  const API = 'http://localhost:3000';
  const STORAGE_KEY = 'attendances';
  const EXPIRY_MS = 15 * 60 * 1000; // 15 minutos

  let attendances = [];

  async function loadAttendances() {
    try {
      const res = await fetch(`${API}/attendances`);
      attendances = await res.json();
      save();
    } catch (e) {
      const saved = localStorage.getItem(STORAGE_KEY);
      attendances = saved ? JSON.parse(saved) : [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendances));
  }

  function nextAttendanceId() {
    return attendances.reduce((max, a) => Math.max(max, a.id ?? 0), 0) + 1;
  }

  // ===== Pega os dados da URL =====
  const params = new URLSearchParams(window.location.search);
  const CURRENT_VOLUNTEER_ID = Number(params.get('volunteerId')) || 1;
  const CURRENT_ACTION_ID = Number(params.get('actionId')) || 1;

  
  const TOKEN_TIMESTAMP = Date.now();
  const presenceToken = `voluntarize:presenca:v${CURRENT_VOLUNTEER_ID}:a${CURRENT_ACTION_ID}:${TOKEN_TIMESTAMP}`;
  console.log('Token:', presenceToken);

  // ===== QR Code aponta para a URL de validação do organizador =====
  // O organizador escaneia e abre essa URL no celular dele
  const validationURL = `${window.location.origin}/modulos/presenca/validar.html?token=${encodeURIComponent(presenceToken)}`;

  const qrWrapper = document.getElementById('qr-wrapper');
  const qrImg = document.createElement('img');
  qrImg.alt = 'QR Code de validacao de presenca';
  qrImg.width = 220;
  qrImg.height = 220;
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(validationURL)}`;
  qrWrapper.appendChild(qrImg);

  // ===== Botão Concluir: só aparece após validação =====
  const btnConcluir = document.getElementById('btnConcluir');
  btnConcluir.disabled = true;
  btnConcluir.title = 'Aguardando o organizador escanear o QR Code';

  btnConcluir.addEventListener('click', () => {
    alert('Presença já validada! Obrigado por participar.');
    // Redireciona ou fecha — ajuste conforme o fluxo do projeto
    history.back();
  });

  // ===== Polling: verifica se o organizador já validou =====
  const expiresAt = TOKEN_TIMESTAMP + EXPIRY_MS;
  let pollInterval;

  async function checkValidation() {
    if (Date.now() > expiresAt) {
      clearInterval(pollInterval);
      btnConcluir.title = 'QR Code expirado. Recarregue a página.';
      return;
    }

    let validated = false;

    try {
      const res = await fetch(`${API}/attendances?volunteerId=${CURRENT_VOLUNTEER_ID}&actionId=${CURRENT_ACTION_ID}`);
      const list = await res.json();
      if (list.length > 0) validated = true;
    } catch {
      // JSON Server offline: verifica localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const list = JSON.parse(saved);
        if (list.find(a => a.token === presenceToken)) validated = true;
      }
    }

    if (validated) {
      clearInterval(pollInterval);
      btnConcluir.disabled = false;
      btnConcluir.textContent = '✓ Presença confirmada — Concluir';
    }
  }

  loadAttendances().then(() => {
    pollInterval = setInterval(checkValidation, 3000);
    checkValidation();
  });
})();