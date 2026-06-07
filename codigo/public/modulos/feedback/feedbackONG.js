(function () {
  const STAR_FILLED = '../../assets/images/imgs-feedback/star-solid-full.svg';
  const STAR_EMPTY = '../../assets/images/imgs-feedback/star-regular-full.svg';

  // ===== Caminho para o banco de dados =====
  const API = 'http://localhost:3000';

  // ===== Banco com persistência em localStorage + fetch do JSON Server =====
  const STORAGE_KEY = 'reviews-ong';

  let reviews = [];

  // Carrega reviews do JSON Server ou do localStorage como fallback
  async function loadreviews() {
    try {
      // Busca direto do endpoint /reviews
      const res = await fetch(API + '/reviews');
      reviews = await res.json();
      save(); // Atualiza localStorage com dados do servidor
    } catch (e) {
      // Se falhar, usa o que está no localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        reviews = JSON.parse(saved);
      } else {
        console.warn('Erro ao carregar reviews do servidor:', e);
        reviews = [];
      }
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  // ===== Contexto da avaliação atual (voluntário) =====
  const usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente')) || {
    id: 1,
    tipo: 'voluntario',
    nome: 'Voluntário'
  };

  // ===== Pega os dados da URL =====
  const params = new URLSearchParams(window.location.search);
  const CURRENT_TARGET_ID = Number(params.get('targetId')) || 2;
  const CURRENT_ACTION_ID = Number(params.get('actionId')) || 1;

  const CURRENT_AUTHOR_ID = usuarioCorrente.id;
  const CURRENT_TARGET_TYPE = "volunteer";

  console.log('Avaliação context:', {
    authorId: CURRENT_AUTHOR_ID,
    targetId: CURRENT_TARGET_ID,
    actionId: CURRENT_ACTION_ID,
    targetType: CURRENT_TARGET_TYPE
  });

  // ===== Estrelas =====
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

  // ===== Concluir =====
  document.getElementById('btnConcluir').addEventListener('click', async () => {
    const comentario = document.getElementById('comentario').value.trim();

    if (currentRating === 0) {
      alert('Por favor, selecione uma avaliação em estrelas antes de concluir.');
      return;
    }

    // O id é gerado automaticamente pelo JSON Server
    const novo = {
      authorId: CURRENT_AUTHOR_ID,
      targetType: CURRENT_TARGET_TYPE,
      targetId: CURRENT_TARGET_ID,
      actionId: CURRENT_ACTION_ID,
      rating: currentRating,
      comment: comentario,
      createdAt: todayISO(),
      deletedAt: null
    };

    try {
      // Envia pro servidor (JSON Server gera o ID automaticamente)
      const res = await fetch(API + '/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novo)
      });

      if (!res.ok) throw new Error('Erro ao salvar no servidor');

      const savedReview = await res.json();
      reviews.push(savedReview);
      save();

      console.log('Review criado:', savedReview);
      console.log('Lista atualizada:', reviews);

      alert('Avaliação enviada com sucesso! ⭐ ' + currentRating + '/5');

      // Reset
      currentRating = 0;
      paint(0);
      document.getElementById('comentario').value = '';
    } catch (e) {
      console.error('Erro ao salvar review:', e);
      alert('Erro ao salvar avaliação. Tente novamente.');
    }
  });

  // Carrega as reviews quando a página abre
  loadreviews().then(() => {
    console.log('reviews carregados:', reviews);
  });
})();