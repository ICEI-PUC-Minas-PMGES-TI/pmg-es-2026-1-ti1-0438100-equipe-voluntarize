(function(){
  var container = document.getElementById('header-global');
  if(!container) return;

  var pathParts = location.pathname.split('/');
  var dirs = pathParts.slice(1, -1);
  var prefix = '';
  for(var i = 0; i < dirs.length; i++) prefix += '../';

  var extraClass = container.getAttribute('data-header-class') || '';

  var links = {
    homeOng:      prefix + 'modulos/home/home-ong.html',
    homeVolunt:   prefix + 'modulos/home/home-voluntarios.html',
    vagas:        prefix + 'modulos/vagas/vagas.html',
    mapa:         prefix + 'modulos/busca-ongs-mapa/index.html',
    candidaturas: prefix + 'modulos/manipulacao-candidaturas-voluntario/index.html',
    perfil:       prefix + 'modulos/meu-perfil/meu-perfil.html',
    login:        prefix + 'modulos/login/login.html'
  };

  var logoSrc = prefix + 'assets/images/logo/logo-horizontal.png';

  var cssHref = prefix + 'assets/css/global.css';
  if(!document.querySelector('link[href="' + cssHref + '"]')){
    var link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
  }

  var html = `
    <div class="container header-shell">
      <header class="${extraClass || 'site-header'}">

        <span id="logo-header">
          <img class="brand-logo" src="${logoSrc}" alt="Voluntarize" />
        </span>

        <button class="mobile-toggle" id="header-mobile-toggle" aria-label="Abrir menu">
          <i class="fa-solid fa-bars"></i>
        </button>

        <nav class="site-nav" aria-label="Navegação principal">
          <a id="nav-home-desktop" style="cursor:pointer;">
            <i class="fa-solid fa-house"></i> Início
          </a>
          <a href="${links.vagas}">
            <i class="fa-solid fa-briefcase"></i> Vagas
          </a>
          <a href="${links.mapa}">
            <i class="fa-solid fa-map-pin"></i> Mapa de ONGs
          </a>
          <a href="${links.candidaturas}">
            <i class="fa-solid fa-list-ul"></i> Minhas Candidaturas
          </a>
        </nav>

        <div class="header-user" style="position:relative; display:inline-block;">
          <button id="header-user-btn"
            class="btn btn-secondary btn-icon-only btn-rounded-full btn-shadow-sm"
            aria-label="Usuário">
            <i class="fa-regular fa-user"></i>
          </button>
          <div id="header-user-menu" class="surface surface-white"
            style="position:absolute; right:0; top:calc(100% + 8px); display:none; min-width:200px; z-index:60;">
            <button id="menu-perfil-desktop" class="btn btn-ghost">
              <i class="fa-regular fa-user"></i>
              <span class="label">Ir para perfil</span>
            </button>
            <button id="menu-deslogar-desktop" class="btn btn-ghost logout">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span class="label">Deslogar</span>
            </button>
          </div>
        </div>

        <div id="header-mobile-nav" class="mobile-nav" aria-hidden="true">
          <a id="nav-home-mobile" style="cursor:pointer;">
            <i class="fa-solid fa-house"></i> Início
          </a>
          <a href="${links.vagas}">
            <i class="fa-solid fa-briefcase"></i> Vagas
          </a>
          <a href="${links.mapa}">
            <i class="fa-solid fa-map-pin"></i> Mapa de ONGs
          </a>
          <a href="${links.candidaturas}">
            <i class="fa-solid fa-list-ul"></i> Minhas Candidaturas
          </a>
          <button id="menu-perfil-mobile" class="btn btn-ghost">
            <i class="fa-regular fa-user"></i>
            <span class="label">Ir para perfil</span>
          </button>
          <button id="menu-deslogar-mobile" class="btn btn-ghost logout">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span class="label">Deslogar</span>
          </button>
        </div>

      </header>
    </div>`;

  container.innerHTML = html;

  var usuarioLogado = (function(){
    try { return JSON.parse(localStorage.getItem('usuarioLogado')) || null; }
    catch(e){ return null; }
  })();

  var usuarioCorrente = usuarioLogado ? { id: usuarioLogado.id, tipo: usuarioLogado.type } : null;
  var homeDestino = (usuarioCorrente && usuarioCorrente.tipo === 0) ? links.homeVolunt : links.homeOng;
  var logoHeader = document.getElementById('logo-header');
  var navHomeDesktop = document.getElementById('nav-home-desktop');
  var navHomeMobile = document.getElementById('nav-home-mobile');
  var userBtn = document.getElementById('header-user-btn');
  var userMenu = document.getElementById('header-user-menu');
  var mobileToggle = document.getElementById('header-mobile-toggle');
  var mobileNav = document.getElementById('header-mobile-nav');

  if(logoHeader){
    logoHeader.addEventListener('click', function(){
      window.location.href = homeDestino;
    });
  }

  if(navHomeDesktop){
    navHomeDesktop.addEventListener('click', function(){
      window.location.href = homeDestino;
    });
  }

  if(navHomeMobile){
    navHomeMobile.addEventListener('click', function(){
      mobileNav.style.display = 'none';
      window.location.href = homeDestino;
    });
  }

  if(userBtn && userMenu){
    var showUserMenu = function(){ userMenu.style.display = 'block'; };
    var hideUserMenu = function(){ userMenu.style.display = 'none'; };

    userBtn.addEventListener('mouseenter', showUserMenu);
    userBtn.addEventListener('focus',      showUserMenu);
    userBtn.addEventListener('click', function(e){
      e.stopPropagation();
      userMenu.style.display = (userMenu.style.display === 'block') ? 'none' : 'block';
    });

    userMenu.addEventListener('mouseenter', showUserMenu);
    userMenu.addEventListener('mouseleave', hideUserMenu);

    document.getElementById('menu-perfil-desktop').addEventListener('click', function(){
      window.location.href = links.perfil;
    });

    document.getElementById('menu-deslogar-desktop').addEventListener('click', function(){
      try{ localStorage.removeItem('usuarioLogado'); }catch(e){}
      window.location.href = links.login;
    });

    document.addEventListener('click', function(e){
      if(!userMenu.contains(e.target) && !userBtn.contains(e.target)){
        hideUserMenu();
      }
    });
  }

  if(mobileToggle && mobileNav){
    mobileToggle.addEventListener('click', function(e){
      e.stopPropagation();
      var open = mobileNav.style.display === 'block';
      mobileNav.style.display = open ? 'none' : 'block';
    });

    document.addEventListener('click', function(e){
      if(!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)){
        mobileNav.style.display = 'none';
      }
    });

    Array.prototype.slice.call(mobileNav.querySelectorAll('a')).forEach(function(a){
      a.addEventListener('click', function(){
        mobileNav.style.display = 'none';
      });
    });

    var mobilePerfil = document.getElementById('menu-perfil-mobile');
    var mobileLogout = document.getElementById('menu-deslogar-mobile');

    if(mobilePerfil){
      mobilePerfil.addEventListener('click', function(){
        mobileNav.style.display = 'none';
        window.location.href = links.perfil;
      });
    }

    if(mobileLogout){
      mobileLogout.addEventListener('click', function(){
        try{ localStorage.removeItem('usuarioLogado'); }catch(e){}
        window.location.href = links.login;
      });
    }
  }

  document.dispatchEvent(new CustomEvent('headerGlobalLoaded'));
})();