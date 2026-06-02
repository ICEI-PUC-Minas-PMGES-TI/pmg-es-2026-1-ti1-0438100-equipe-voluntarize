(function () {
  const STAR_FILLED = '../../assets/images/imgs-feedback/star-solid-full.svg';
  const STAR_EMPTY = '../../assets/images/imgs-feedback/star-regular-full.svg';

  // ===== Caminho para o banco de dados =====
  const API_BASE = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';
  
  function api(path) { return (API_BASE ? API_BASE : '') + path; }

  // ===== Banco com persistência em localStorage + fetch do db.json =====
  const STORAGE_KEY = 'reviews-volunteer';

  let reviews = [];

  // Carrega reviews do localStorage ou do banco de dados
  async function loadreviews() {
      try {
        const res = await fetch(api('/reviews'));
        reviews = await res.json();
        save(); // Atualiza localStorage com dados do servidor
      } catch (e) {
        // Se falhar, usa o que está no localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          reviews = JSON.parse(saved);
        } else {
          console.warn('Erro ao carregar reviews e localStorage vazio:', e);
          reviews = [];
        }
      }
    }



  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }

  function nextReviewId() {
    return reviews.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }



  // Quando o real JSON SERVER for aplicado essa parte será modificada
  // Contexto da avaliação atual (voluntário)
  // Os dados do usuário logado devem vir de sessionStorage (como em home.js)
  const usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente')) || {
    id: 1,
    tipo: 'voluntario',
    nome: 'Voluntário'
  };

  const CURRENT_AUTHOR_ID   = usuarioCorrente.id;
  const CURRENT_TARGET_TYPE = "volunteer";
  const CURRENT_TARGET_ID   = 2; // ID do voluntário que está sendo avaliado (se quiser testar outros ids, só mudar)
  const CURRENT_ACTION_ID   = 1; // ID da ação ( se quiser testar outros ids, só mudar)

 // -------------------------------------------------------------------------------- 





  const stars = document.querySelectorAll('.star-btn');
  let currentRating = 0;

  function paint(rating) {
    stars.forEach((btn) => {
      const value = Number(btn.dataset.value);
      const img = btn.querySelector('img');
      const filled = value <= rating;
      img.src = filled ? STAR_FILLED : STAR_EMPTY;
      btn.setAttribute('aria-checked', filled ? 'true' : 'false');
    });
  }

  stars.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentRating = Number(btn.dataset.value);
      paint(currentRating);
    });
    btn.addEventListener('mouseenter', () => paint(Number(btn.dataset.value)));
    btn.addEventListener('mouseleave', () => paint(currentRating));
  });

  document.getElementById('btnConcluir').addEventListener('click', () => {
    const comentario = document.getElementById('comentario').value.trim();

    if (currentRating === 0) {
      alert('Por favor, selecione uma avaliação em estrelas antes de concluir.');
      return;
    }

    const novo = {
      id: nextReviewId(),
      authorId:   CURRENT_AUTHOR_ID,
      targetType: CURRENT_TARGET_TYPE,
      targetId:   CURRENT_TARGET_ID,
      actionId:   CURRENT_ACTION_ID,
      rating:     currentRating,
      comment:    comentario,
      createdAt:  todayISO(),
      deletedAt:  null
    };

    reviews.push(novo);
    save();

    console.log('Review criado:', novo);
    console.log('Lista atualizada:', reviews);

    alert('Avaliação enviada com sucesso! ⭐ ' + currentRating + '/5');

    
    currentRating = 0;
    paint(0);
    document.getElementById('comentario').value = '';
  });

  loadreviews().then(() => {
    console.log('reviews carregados:', reviews);
  });
})();