(function(){
  var container = document.getElementById('header-global');
  if(!container) return;

  var pathParts = location.pathname.split('/');
  var dirs = pathParts.slice(1, -1);
  var prefix = '';
  for(var i=0;i<dirs.length;i++) prefix += '../';

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

  var style = document.createElement('style');
  style.textContent = `
    .header-shell .mobile-toggle{
      display:none; border:none; background:transparent; font-size:20px;
    }
    .header-shell .mobile-nav{
      display:none; position:absolute; left:0; right:0; top:100%;
      background:var(--color-white); box-shadow:0 6px 18px rgba(0,0,0,0.08); z-index:50;
    }
    /* Links e botões do menu mobile — sem hover via atributo, só CSS puro */
    .header-shell .mobile-nav a,
    .header-shell .mobile-nav .btn-ghost{
      display:flex; align-items:center; gap:10px; padding:10px 12px;
      border-top:1px solid rgba(0,0,0,0.08); text-decoration:none;
      color:inherit; background:transparent; width:100%; box-sizing:border-box;
      text-align:left; cursor:pointer; border-left:none; border-right:none; border-bottom:none;
    }
    .header-shell .mobile-nav a:first-child,
    .header-shell .mobile-nav .btn-ghost:first-child{ border-top:0; }
    .header-shell .site-nav a{ display:inline-block; padding:6px 10px; }
    #header-user-menu{ border-radius:6px; overflow:hidden; }
    #logo-header{ cursor:pointer; }
    #header-user-menu .btn-ghost{
      display:flex; align-items:center; gap:10px; padding:6px 10px;
      border-top:1px solid rgba(0,0,0,0.06); background:var(--color-white);
      width:100%; box-sizing:border-box; text-align:left; color:inherit; cursor:pointer;
    }
    #header-user-menu .btn-ghost:first-child{ border-top:0; }
    #header-user-menu .btn-ghost i{ width:18px; text-align:center; }
    #header-user-menu .btn-ghost.logout{
      background:transparent; border-top:1px solid rgba(0,0,0,0.06);
    }
    #header-user-menu .btn-ghost .label{
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }
    @media (max-width:900px){
      .header-shell header{
        display:flex; align-items:center;
        justify-content:space-between; position:relative;
      }
      .header-shell .site-nav{ display:none; }
      .header-shell .header-user{ display:none !important; }
      .header-shell .mobile-toggle{
        display:flex; align-items:center;
        justify-content:center; margin-left:auto;
      }
      .header-shell .brand-logo{
        max-width:140px; height:auto; cursor:pointer;
      }
      .header-shell a:first-child{ flex-shrink:0; }
      #mobile-menu-deslogar{ display:block; }
    }
  `;
  document.head.appendChild(style);

  var html =
    '<div class="container header-shell">\n' +
    '  <header class="'+ (extraClass || 'site-header') +'">\n' +
    '    <span id="logo-header"><img class="brand-logo" src="'+logoSrc+'" alt="Voluntarize" /></span>\n' +
    '    <button class="mobile-toggle" id="header-mobile-toggle" aria-label="Abrir menu">\n' +
    '      <i class="fa-solid fa-bars"></i>\n' +
    '    </button>\n' +
    '    <nav class="site-nav" aria-label="Navegação principal">\n' +
    '      <a id="nav-home-desktop" style="cursor:pointer;"><i class="fa-solid fa-house"></i> Início</a>\n' +
    '      <a href="'+links.vagas+'"><i class="fa-solid fa-briefcase"></i> Vagas</a>\n' +
    '      <a href="'+links.mapa+'"><i class="fa-solid fa-map-pin"></i> Mapa de ONGs</a>\n' +
    '      <a href="'+links.candidaturas+'"><i class="fa-solid fa-list-ul"></i> Minhas Candidaturas</a>\n' +
    '    </nav>\n' +
    '    <div class="header-user" style="position:relative; display:inline-block;">\n' +
    '      <button id="header-user-btn" class="btn btn-secondary btn-icon-only btn-rounded-full btn-shadow-sm" aria-label="Usuário">\n' +
    '        <i class="fa-regular fa-user"></i>\n' +
    '      </button>\n' +
    '      <div id="header-user-menu" class="surface surface-white" style="position:absolute; right:0; top:calc(100% + 8px); display:none; min-width:200px; z-index:60;">\n' +
    '        <button id="menu-perfil-desktop" class="btn btn-ghost"><i class="fa-regular fa-user"></i> <span class="label">Ir para perfil</span></button>\n' +
    '        <button id="menu-deslogar-desktop" class="btn btn-ghost logout"><i class="fa-solid fa-right-from-bracket"></i> <span class="label">Deslogar</span></button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div id="header-mobile-nav" class="mobile-nav" aria-hidden="true">\n' +
    '      <a id="nav-home-mobile" style="cursor:pointer;"><i class="fa-solid fa-house"></i> Início</a>\n' +
    '      <a href="'+links.vagas+'"><i class="fa-solid fa-briefcase"></i> Vagas</a>\n' +
    '      <a href="'+links.mapa+'"><i class="fa-solid fa-map-pin"></i> Mapa de ONGs</a>\n' +
    '      <a href="'+links.candidaturas+'"><i class="fa-solid fa-list-ul"></i> Minhas Candidaturas</a>\n' +
    '      <button id="menu-perfil-mobile" class="btn btn-ghost"><i class="fa-regular fa-user"></i> <span class="label">Ir para perfil</span></button>\n' +
    '      <button id="menu-deslogar-mobile" class="btn btn-ghost logout"><i class="fa-solid fa-right-from-bracket"></i> <span class="label">Deslogar</span></button>\n' +
    '    </div>\n' +
    '  </header>\n' +
    '</div>';

  container.innerHTML = html;

  var usuarioLogado = (function(){
    try { return JSON.parse(localStorage.getItem('usuarioLogado')) || null; }
    catch(e){ return null; }
  })();

  var usuarioCorrente = usuarioLogado
    ? { id: usuarioLogado.id, tipo: usuarioLogado.type }
    : null;

  var homeDestino = (usuarioCorrente && usuarioCorrente.tipo === 0)
    ? links.homeVolunt
    : links.homeOng;

  var logoHeader      = document.getElementById('logo-header');
  var navHomeDesktop  = document.getElementById('nav-home-desktop');
  var navHomeMobile   = document.getElementById('nav-home-mobile');
  var userBtn         = document.getElementById('header-user-btn');
  var userMenu        = document.getElementById('header-user-menu');
  var mobileToggle    = document.getElementById('header-mobile-toggle');
  var mobileNav       = document.getElementById('header-mobile-nav');

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
    userBtn.addEventListener('focus', showUserMenu);
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
      if(!userMenu.contains(e.target) && !userBtn.contains(e.target)){ hideUserMenu(); }
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
      a.addEventListener('click', function(){ mobileNav.style.display = 'none'; });
    });


    var mobilePerfil  = document.getElementById('menu-perfil-mobile');
    var mobileLogout  = document.getElementById('menu-deslogar-mobile');

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