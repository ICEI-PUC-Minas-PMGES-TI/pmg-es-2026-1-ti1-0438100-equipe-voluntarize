(function () {
  const STAR_FILLED = '../../assets/images/imgs-feedback/star-solid-full.svg';
  const STAR_EMPTY = '../../assets/images/imgs-feedback/star-regular-full.svg';


  const API_BASE = (window.__ENV && window.__ENV.UR_API) ? window.__ENV.UR_API.replace(/\/$/, '') : '';

  function api(path) { return (API_BASE ? API_BASE : '') + path; }


  const STORAGE_KEY = 'reviews-volunteer';

  let reviews = [];

  async function loadreviews() {
    try {
      const res = await fetch(api('/reviews'));
      reviews = await res.json();
      save();
    } catch (e) {
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

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  // ===== Contexto da avaliação atual (voluntário) =====
  const usuarioCorrente = JSON.parse(localStorage.getItem('usuarioLogado')) || {
    id: 1,
    type: 1
  };

  // ===== Pega os dados da URL =====
  const params = new URLSearchParams(window.location.search);
  const CURRENT_TARGET_ID = Number(params.get('targetId') || params.get('volunteerId')) || 2;
  const CURRENT_ACTION_ID = Number(params.get('actionId')) || 1;

  const CURRENT_AUTHOR_ID = usuarioCorrente.id;
  const CURRENT_TARGET_TYPE = "volunteer";

  console.log('Avaliação context:', {
    authorId: CURRENT_AUTHOR_ID,
    targetId: CURRENT_TARGET_ID,
    actionId: CURRENT_ACTION_ID,
    targetType: CURRENT_TARGET_TYPE
  });

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

  // ===== Bloqueia avaliação duplicada: mesmo autor, mesmo alvo, mesma ação =====
  function jaAvaliado() {
    return reviews.some(r =>
      r.authorId === CURRENT_AUTHOR_ID &&
      r.targetId === CURRENT_TARGET_ID &&
      r.actionId === CURRENT_ACTION_ID &&
      r.targetType === CURRENT_TARGET_TYPE &&
      !r.deletedAt
    );
  }

  function bloquearFormulario() {
    const btnConcluir = document.getElementById('btnConcluir');
    const comentario = document.getElementById('comentario');
    if (btnConcluir) {
      btnConcluir.disabled = true;
      btnConcluir.textContent = 'Você já avaliou este voluntário';
    }
    if (comentario) comentario.disabled = true;
    stars.forEach(btn => btn.disabled = true);
  }

  async function atualizarRatingVoluntario(volunteerId) {
    try {
      const res = await fetch(api(`/reviews?targetType=volunteer&targetId=${volunteerId}`));
      const list = await res.json();
      const validas = list.filter(r => !r.deletedAt);

      if (validas.length === 0) return;

      const media = validas.reduce((sum, r) => sum + Number(r.rating), 0) / validas.length;
      const mediaArredondada = Math.round(media * 10) / 10;

      await fetch(api(`/volunteers/${volunteerId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: mediaArredondada })
      });

      console.log('Rating do voluntário atualizado:', mediaArredondada);
    } catch (e) {
      console.error('Erro ao atualizar rating do voluntário:', e);
    }
  }

  document.getElementById('btnConcluir').addEventListener('click', async () => {
    if (jaAvaliado()) {
      alert('Você já avaliou este voluntário nesta ação.');
      return;
    }

    const comentario = document.getElementById('comentario').value.trim();

    if (currentRating === 0) {
      alert('Por favor, selecione uma avaliação em estrelas antes de concluir.');
      return;
    }

    const novoId =
      reviews.length > 0
        ? Math.max(...reviews.map(r => Number(r.id) || 0)) + 1
        : 1;

    const novo = {
      id: novoId,
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
      const res = await fetch(api('/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novo)
      });

      if (!res.ok) throw new Error('Erro ao salvar no servidor');

      const savedReview = await res.json();
      reviews.push(savedReview);
      save();

      console.log('Review criado:', savedReview);

      // Atualiza o rating médio do voluntário no banco
      await atualizarRatingVoluntario(CURRENT_TARGET_ID);

      alert('Avaliação enviada com sucesso! ⭐ ' + currentRating + '/5');

      bloquearFormulario();
    } catch (e) {
      console.error('Erro ao salvar review:', e);
      alert('Erro ao salvar avaliação. Tente novamente.');
    }
  });

  loadreviews().then(() => {
    console.log('reviews carregados:', reviews);
    if (jaAvaliado()) bloquearFormulario();
  });
})();