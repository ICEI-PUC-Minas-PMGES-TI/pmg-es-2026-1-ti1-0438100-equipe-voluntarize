(function () {
      // ===== Caminho para o banco de dados =====
      const API = 'http://localhost:3000';
 
      // ===== Banco com persistência em localStorage + fetch do db.json =====
      const STORAGE_KEY = 'attendances';
 
      let attendances = [];
 
      // Carrega attendances do localStorage ou do banco de dados
      async function loadAttendances() {
        try {
          const res = await fetch(API);
          const db = await res.json();
          attendances = db.attendances || [];
          save();
        } catch (e) {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            attendances = JSON.parse(saved);
          } else {
            console.warn('Erro ao carregar db.json e localStorage vazio:', e);
            attendances = [];
          }
        }
      }
 
      function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(attendances));
      }
 
      function nextAttendanceId() {
        return attendances.reduce((max, a) => Math.max(max, a.id), 0) + 1;
      }
 
      function todayISO() {
        return new Date().toISOString();
      }
 
      // ===== Pega os dados da URL =====
      const params = new URLSearchParams(window.location.search);
      const CURRENT_VOLUNTEER_ID = Number(params.get('volunteerId')) || 1;
      const CURRENT_ACTION_ID = Number(params.get('actionId')) || 1;
 
      // ===== Gera token único para o QR Code =====
      const presenceToken = `voluntarize:presenca:v${CURRENT_VOLUNTEER_ID}:a${CURRENT_ACTION_ID}:${Date.now()}`;
 
      // ===== Render QR Code =====
      const qrWrapper = document.getElementById('qr-wrapper');
      const qrImg = document.createElement('img');
      qrImg.alt = 'QR Code de validacao de presenca';
      qrImg.width = 220;
      qrImg.height = 220;
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(presenceToken)}`;
      qrWrapper.appendChild(qrImg);
 
      // ===== Concluir =====
      document.getElementById('btnConcluir').addEventListener('click', () => {
        const novo = {
          id: nextAttendanceId(),
          volunteerId: CURRENT_VOLUNTEER_ID,
          actionId: CURRENT_ACTION_ID,
          token: presenceToken,
          validatedAt: todayISO(),
          deletedAt: null
        };
 
        attendances.push(novo);
        save();
 
        console.log('Presenca registrada:', novo);
        console.log('Lista atualizada:', attendances);
 
        alert('Presenca validada com sucesso!');
      });
 
      // Inicializa carregando as attendances
      loadAttendances().then(() => {
        console.log('attendances carregados:', attendances);
      });
    })();