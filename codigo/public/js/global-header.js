(function(){
  var container = document.getElementById('header-global');
  if(!container) return;

  var pathParts = location.pathname.split('/');
  var dirs = pathParts.slice(1, -1);
  var prefix = '';
  for(var i=0;i<dirs.length;i++) prefix += '../';

  var extraClass = container.getAttribute('data-header-class') || '';

  var links = {
    home: prefix + 'index.html',
    vagas: prefix + 'modulos/vagas/vagas.html',
    mapa: prefix + 'modulos/busca-ongs-mapa/index.html',
    candidaturas: prefix + 'modulos/manipulacao-candidaturas-voluntario/index.html',
    perfil: prefix + 'modulos/meu-perfil/meu-perfil.html',
    login: prefix + 'modulos/login/login.html'
  };

  var logoSrc = prefix + 'assets/images/logo/logo-horizontal.png';

  var style = document.createElement('style');
  style.textContent = '\n' +
    '.header-shell .mobile-toggle{ display:none; border:none; background:transparent; font-size:20px; }\n' +
    '.header-shell .mobile-nav{ display:none; position:absolute; left:0; right:0; top:100%; background:var(--color-white); box-shadow:0 6px 18px rgba(0,0,0,0.08); z-index:50; }\n' +
    '.header-shell .mobile-nav a, .header-shell .mobile-nav .btn-ghost{ display:flex; align-items:center; gap:10px; padding:10px 12px; border-top:1px solid rgba(0,0,0,0.08); text-decoration:none; color:inherit; background:transparent; }\n' +
    '.header-shell .mobile-nav a:first-child, .header-shell .mobile-nav .btn-ghost:first-child{ border-top:0; }\n' +
    '.header-shell .site-nav a{ display:inline-block; padding:6px 10px; }\n' +
    '#header-user-menu{ border-radius:6px; overflow:hidden; }\n' +
    '#header-user-menu .btn-ghost{ display:flex; align-items:center; gap:10px; padding:6px 10px; border-top:1px solid rgba(0,0,0,0.06); background:var(--color-white); width:100%; box-sizing:border-box; text-align:left; color:inherit; }\n' +
    '#header-user-menu .btn-ghost:first-child{ border-top:0; }\n' +
    '#header-user-menu .btn-ghost i{ width:18px; text-align:center; }\n' +
    '#header-user-menu .btn-ghost.logout{ background:transparent; border-top:1px solid rgba(0,0,0,0.06); }\n' +
    '#header-user-menu .btn-ghost .label{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }\n' +
    '@media (max-width:900px){\n' +
    '  .header-shell header{\n' +
    '    display:flex;\n' +
    '    align-items:center;\n' +
    '    justify-content:space-between;\n' +
    '    position:relative;\n' +
    '  }\n' +
    '\n' +
    '  .header-shell .site-nav{\n' +
    '    display:none;\n' +
    '  }\n' +
    '\n' +
    '  .header-shell .header-user{\n' +
    '    display:none !important;\n' +
    '  }\n' +
    '\n' +
    '  .header-shell .mobile-toggle{\n' +
    '    display:flex;\n' +
    '    align-items:center;\n' +
    '    justify-content:center;\n' +
    '    margin-left:auto;\n' +
    '  }\n' +
    '\n' +
    '  .header-shell .brand-logo{\n' +
    '    max-width:140px;\n' +
    '    height:auto;\n' +
    '  }\n' +
    '\n' +
    '  .header-shell a:first-child{\n' +
    '    flex-shrink:0;\n' +
    '  }\n' +
    '\n' +
    '  #mobile-menu-deslogar{\n' +
    '    display:block;\n' +
    '  }\n' +
    '}\n';
  document.head.appendChild(style);

  var html = ''+
    '<div class="container header-shell">\n' +
    '  <header class="'+ (extraClass || 'site-header') +'">\n' +
    '    <a href="'+links.home+'"><img class="brand-logo" src="'+logoSrc+'" alt="Voluntarize" /></a>\n' +
    '    <button class="mobile-toggle" id="header-mobile-toggle" aria-label="Abrir menu">\n' +
    '      <i class="fa-solid fa-bars"></i>\n' +
    '    </button>\n' +
    '    <nav class="site-nav" aria-label="Navegação principal">\n' +
    '      <a href="'+links.home+'"><i class="fa-solid fa-house"></i> Início</a>\n' +
    '      <a href="'+links.vagas+'"><i class="fa-solid fa-briefcase"></i> Vagas</a>\n' +
    '      <a href="'+links.mapa+'"><i class="fa-solid fa-map-pin"></i> Mapa de ONGs</a>\n' +
    '      <a href="'+links.candidaturas+'"><i class="fa-solid fa-list-ul"></i> Minhas Candidaturas</a>\n' +
    '    </nav>\n' +
    '    <div class="header-user" style="position: relative; display: inline-block;">\n' +
    '      <button id="header-user-btn" class="btn btn-secondary btn-icon-only btn-rounded-full btn-shadow-sm" aria-label="Usuário">\n' +
    '        <i class="fa-regular fa-user"></i>\n' +
    '      </button>\n' +
    '      <div id="header-user-menu" class="surface surface-white" style="position: absolute; right: 0; top: calc(100% + 8px); display: none; min-width: 200px; z-index:60;">\n' +
    '        <button id="menu-perfil" class="btn btn-ghost"><i class="fa-regular fa-user"></i> <span class="label">Ir para perfil</span></button>\n' +
    '        <button id="menu-deslogar" class="btn btn-ghost logout"><i class="fa-solid fa-right-from-bracket"></i> <span class="label">Deslogar</span></button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div id="header-mobile-nav" class="mobile-nav" aria-hidden="true">\n' +
    '      <a href="'+links.home+'"><i class="fa-solid fa-house"></i> Início</a>\n' +
    '      <a href="'+links.vagas+'"><i class="fa-solid fa-briefcase"></i> Vagas</a>\n' +
    '      <a href="'+links.mapa+'"><i class="fa-solid fa-map-pin"></i> Mapa de ONGs</a>\n' +
    '      <a href="'+links.candidaturas+'"><i class="fa-solid fa-list-ul"></i> Minhas Candidaturas</a>\n' +
    '      <button id="mobile-menu-deslogar" class="btn btn-ghost logout" style="width:100%; text-align:left; padding:10px 14px; border-top:1px solid rgba(0,0,0,0.06);"><i class="fa-solid fa-right-from-bracket"></i> <span class="label">Deslogar</span></button>\n' +
    '    </div>\n' +
    '  </header>\n' +
    '</div>';

  container.innerHTML = html;

  var userBtn = document.getElementById('header-user-btn');
  var userMenu = document.getElementById('header-user-menu');
  var mobileToggle = document.getElementById('header-mobile-toggle');
  var mobileNav = document.getElementById('header-mobile-nav');
  var mobileLogout = document.getElementById('mobile-menu-deslogar');

  if(userBtn && userMenu){
    var showUserMenu = function(){ userMenu.style.display = 'block'; };
    var hideUserMenu = function(){ userMenu.style.display = 'none'; };

    userBtn.addEventListener('mouseenter', showUserMenu);
    userBtn.addEventListener('focus', showUserMenu);
    userBtn.addEventListener('click', function(e){ e.stopPropagation(); userMenu.style.display = (userMenu.style.display==='block') ? 'none' : 'block'; });
    userMenu.addEventListener('mouseenter', showUserMenu);
    userMenu.addEventListener('mouseleave', hideUserMenu);

    document.getElementById('menu-perfil').addEventListener('click', function(){ window.location.href = links.perfil; });
    document.getElementById('menu-deslogar').addEventListener('click', function(){ try{ localStorage.removeItem('usuarioLogado'); }catch(e){} window.location.href = links.login; });

    document.addEventListener('click', function(e){ if(!userMenu.contains(e.target) && !userBtn.contains(e.target)){ hideUserMenu(); } });
  }

  if(mobileToggle && mobileNav){
    mobileToggle.addEventListener('click', function(e){
      e.stopPropagation();
      var open = mobileNav.style.display === 'block';
      mobileNav.style.display = open ? 'none' : 'block';
    });


    document.addEventListener('click', function(e){ if(!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)){ mobileNav.style.display = 'none'; } });


    Array.prototype.slice.call(mobileNav.querySelectorAll('a')).forEach(function(a){ a.addEventListener('click', function(){ mobileNav.style.display = 'none'; }); });

    if(mobileLogout){ mobileLogout.addEventListener('click', function(){ try{ localStorage.removeItem('usuarioLogado'); }catch(e){} window.location.href = links.login; }); }
  }

  document.dispatchEvent(new CustomEvent('headerGlobalLoaded'));
})();
