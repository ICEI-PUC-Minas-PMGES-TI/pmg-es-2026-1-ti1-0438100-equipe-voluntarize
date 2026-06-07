**Dynamic Page Helper — Voluntarize**

Resumo
- **Propósito:** Fornecer funções reutilizáveis em JavaScript puro para usar IDs vindos da URL, buscar o `db.json` local e localizar registros por `id`, sem depender de frameworks.
- **Escopo do teste:** integrado apenas nas páginas *home* (home de ONG e home de voluntário) para verificação inicial — não altera outras páginas do time.

Arquivos relevantes
- Helper: [codigo/public/assets/js/dynamic-page.js](codigo/public/assets/js/dynamic-page.js#L1)
- Homes (alteradas para carregar o helper): [codigo/public/modulos/home/home-ong.html](codigo/public/modulos/home/home-ong.html#L1) e [codigo/public/modulos/home/home-voluntarios.html](codigo/public/modulos/home/home-voluntarios.html#L1)
- Script das homes (onde os links foram gerados): [codigo/public/modulos/home/home.js](codigo/public/modulos/home/home.js#L1)
- Página de detalhes (consome o id via helper): [codigo/public/modulos/detalhes-vagas/detalhes.html](codigo/public/modulos/detalhes-vagas/detalhes.html#L1)

Como funciona (fluxo)
1. A home carrega `dynamic-page.js` antes do `home.js`.
2. Ao montar cards de vaga/ONG a home usa `buildUrlWithId()` para gerar links do tipo `detalhes.html?id=123`.
3. A página `detalhes.html` usa `readIdFromUrl()` para extrair `id` (aceita `id`, `acaoId`, `vagaId` como nomes de parâmetro) e `fetchJson()` para carregar `db.json`.
4. Com os dados em memória, `findById()` localiza o registro desejado e a página renderiza os campos dinamicamente.

API do helper
- `readIdFromUrl(options)` — lê o `id` da URL. Options: `paramNames` (array), `allowPathId` (boolean), `defaultValue`.
- `fetchJson(url)` — faz `fetch` e retorna o JSON (lança erro em status não-ok).
- `findById(items, id, key='id')` — localiza um item numa coleção comparando o campo `key`.
- `buildUrlWithId(path, id, paramName='id')` — constrói uma URL absoluta relativa à página atual com `?paramName=id`.

Exemplos mínimos

- Gerar link em `home.js` (cards):

  const detailsUrl = buildUrlWithId('../detalhes-vagas/detalhes.html', action.id);
  // usar em <a href="...">Ver Detalhes</a>

- Ler e carregar na `detalhes.js`:

  const id = VoluntarizePageData.readIdFromUrl({ paramNames: ['id','acaoId','vagaId'], defaultValue: null });
  const db = await VoluntarizePageData.fetchJson('../../db/db.json');
  const action = VoluntarizePageData.findById(db.actions, id);

Observações e dicas
- Coloque sempre o script do helper antes do `home.js`/`detalhes.js` no HTML para garantir que `window.VoluntarizePageData` exista.
- O helper aceita `id` tanto por query string como por um número ao final do caminho (legacy path), quando `allowPathId` estiver habilitado.
- Para adaptar a outras páginas (perfil de ONG, perfil de voluntário) reaproveite `findById(db.ongs, id)` ou `findById(db.volunteers, id)` e implemente renderizadores mínimos por página.

Próximos passos sugeridos
- Teste clicando em "Ver Detalhes" nas homes e verifique a rota: deve abrir `detalhes.html?id=<n>` e preencher os campos.
- Reaplicar o padrão nas páginas de perfil apenas quando a equipe concordar — assim mantém a área de autoria de terceiros intocada.

-- Fim
