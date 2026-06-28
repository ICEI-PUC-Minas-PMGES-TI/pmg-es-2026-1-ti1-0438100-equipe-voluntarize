(function () {
  const STAR_FILLED = '../../assets/images/imgs-feedback/star-solid-full.svg';
  const STAR_EMPTY = '../../assets/images/imgs-feedback/star-regular-full.svg';
  const API = 'http://localhost:3000';
  const STORAGE_KEY = 'reviews-ong';

  let reviews = [];

  async function loadreviews() {
    try {
      const res = await fetch(API + '/reviews');
      reviews = await res.json();
      save();
    } catch (e) {
      const saved = localStorage.getItem(STORAGE_KEY);
      reviews = saved ? JSON.parse(saved) : [];
    }
  }

  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)); }
  function todayISO() { return new Date().toISOString().slice(0, 10); }

  const usuarioCorrente = JSON.parse(localStorage.getItem('usuarioLogado')) || { id: 1, type: 0 };

  const params = new URLSearchParams(window.location.search);
  const CURRENT_TARGET_ID = Number(params.get('targetId') || params.get('ongId'));
  const CURRENT_ACTION_ID = Number(params.get('actionId')) || 1;
  const CURRENT_AUTHOR_ID = usuarioCorrente.id;
  const CURRENT_TARGET_TYPE = "ong";

  const stars = document.querySelectorAll('.star-btn');
  let currentRating = 0;

  function paint(rating) {
    stars.forEach((btn) => {
      const value = Number(btn.dataset.value);
      const img = btn.querySelector('img');
      img.src = value <= rating ? STAR_FILLED : STAR_EMPTY;
      btn.setAttribute('aria-checked', value <= rating ? 'true' : 'false');
    });
  }

  stars.forEach((btn) => {
    btn.addEventListener('click', () => { currentRating = Number(btn.dataset.value); paint(currentRating); });
    btn.addEventListener('mouseenter', () => paint(Number(btn.dataset.value)));
    btn.addEventListener('mouseleave', () => paint(currentRating));
  });

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
    const btn = document.getElementById('btnConcluir');
    if (btn) { btn.disabled = true; btn.textContent = 'Você já avaliou esta ONG'; }
    const comentario = document.getElementById('comentario');
    if (comentario) comentario.disabled = true;
    stars.forEach(b => b.disabled = true);
  }

  async function atualizarRatingOng(ongId) {
    try {
      const res = await fetch(`${API}/reviews?targetType=ong&targetId=${ongId}`);
      const list = (await res.json()).filter(r => !r.deletedAt);
      if (!list.length) return;
      const media = Math.round((list.reduce((s, r) => s + Number(r.rating), 0) / list.length) * 10) / 10;
      await fetch(`${API}/ongs/${ongId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: media })
      });
    } catch (e) {
      console.error('Erro ao atualizar rating da ONG:', e);
    }
  }

  document.getElementById('btnConcluir').addEventListener('click', async () => {
    if (jaAvaliado()) { alert('Você já avaliou esta ONG.'); return; }

    const comentario = document.getElementById('comentario').value.trim();
    if (currentRating === 0) { alert('Por favor, selecione uma avaliação em estrelas antes de concluir.'); return; }

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
      const res = await fetch(API + '/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novo)
      });
      if (!res.ok) throw new Error('Erro ao salvar no servidor');

      const savedReview = await res.json();
      reviews.push(savedReview);
      save();

      await atualizarRatingOng(CURRENT_TARGET_ID);

      alert('Avaliação enviada com sucesso! ⭐ ' + currentRating + '/5');
      bloquearFormulario();
    } catch (e) {
      console.error('Erro ao salvar review:', e);
      alert('Erro ao salvar avaliação. Tente novamente.');
    }
  });

  loadreviews().then(() => { if (jaAvaliado()) bloquearFormulario(); });
})();