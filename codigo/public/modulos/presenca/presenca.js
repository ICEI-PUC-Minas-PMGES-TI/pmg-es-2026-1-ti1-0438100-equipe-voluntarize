(function () {
  // PARA RODAR 
  // Descubra o IP local da sua máquina (ipconfig / ifconfig no cmd)
  // rode npx json-server codigo/public/db/db.json --host 0.0.0.0 --static codigo/public
  // Acesse pelo IP da sua máquina (não localhost)
  // para que o QR Code funcione com o celular.
  // Ex: http://192.168.1.8:3000/modulos/presenca/presenca.html?volunteerId=1&actionId=1
  const API = window.location.origin;
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

 
  const params = new URLSearchParams(window.location.search);
  const CURRENT_VOLUNTEER_ID = Number(params.get('volunteerId')) || 1;
  const CURRENT_ACTION_ID = Number(params.get('actionId')) || 1;

  const TOKEN_TIMESTAMP = Date.now();
  const presenceToken = `voluntarize:presenca:v${CURRENT_VOLUNTEER_ID}:a${CURRENT_ACTION_ID}:${TOKEN_TIMESTAMP}`;
  console.log('Token:', presenceToken);

  
  const validationURL = `${API}/modulos/presenca/validar.html?token=${encodeURIComponent(presenceToken)}`;

  const qrWrapper = document.getElementById('qr-wrapper');
  const qrImg = document.createElement('img');
  qrImg.alt = 'QR Code de validacao de presenca';
  qrImg.width = 220;
  qrImg.height = 220;
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(validationURL)}`;
  qrWrapper.appendChild(qrImg);

  
  const btnConcluir = document.getElementById('btnConcluir');
  btnConcluir.disabled = true;
  btnConcluir.title = 'Aguardando o organizador escanear o QR Code';

  btnConcluir.addEventListener('click', () => {
    alert('Presença já validada! Obrigado por participar.');
    history.back();
  });

  
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