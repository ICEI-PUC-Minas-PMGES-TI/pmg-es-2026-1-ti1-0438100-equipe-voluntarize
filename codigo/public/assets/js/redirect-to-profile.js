(function () {
  function getIdFromStorage() {
    try {
      const rawLocal = localStorage.getItem('usuarioLogado');
      if (rawLocal) {
        try {
          const parsed = JSON.parse(rawLocal);
          if (parsed && (parsed.id || parsed.id === 0)) return parsed.id;
          if (typeof parsed === 'number' || !isNaN(Number(parsed))) return Number(parsed);
        } catch (e) {
          if (!isNaN(Number(rawLocal))) return Number(rawLocal);
        }
      }

      const rawSession = sessionStorage.getItem('usuarioCorrente');
      if (rawSession) {
        try {
          const parsed = JSON.parse(rawSession);
          if (parsed && (parsed.id || parsed.id === 0)) return parsed.id;
        } catch (e) {
          // ignore
        }
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  window.redirectToProfile = function () {
    var id = getIdFromStorage();

    if (!id) {
      window.location.href = '/modulos/login/login.html';
      return;
    }

    var profileUrl = new URL('/modulos/meu-perfil/meu-perfil.html', window.location.origin);
    profileUrl.searchParams.set('id', String(id));
    window.location.href = profileUrl.href;
  };
})();