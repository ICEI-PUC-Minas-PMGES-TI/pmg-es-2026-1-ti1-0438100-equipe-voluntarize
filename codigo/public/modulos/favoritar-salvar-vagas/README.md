# Favoritar/Salvar Vagas

## Como executar

Abra um terminal na raiz do projeto, ou seja, na pasta que contem `codigo/`.

Rode o JSON Server servindo a pasta publica:

```powershell
npx.cmd json-server --watch codigo/public/db/db.json --static codigo/public --port 3000
```

Depois acesse a funcionalidade no navegador:

```text
http://localhost:3000/modulos/favoritar-salvar-vagas/index.html
```

## Observacao

A tela utiliza o arquivo `codigo/public/db/db.json` para carregar vagas, ONGs e registros de favoritos. Os links de navegacao que ainda dependem da integracao final do projeto foram mantidos com `#`.
