# Conventional Commits — Voluntarize

Padrão de mensagens de commit adotado pela equipe para manter o histórico do projeto organizado e legível.

---

## Formato

```
tipo: descrição curta no presente
```

- O **tipo** indica a natureza da mudança
- A **descrição** deve ser curta, objetiva e escrita com verbo no presente

---

## Tipos

| Tipo | Quando usar |
|---|---|
| `feat` | Adição de uma nova funcionalidade |
| `fix` | Correção de um bug |
| `docs` | Alterações apenas em documentação |
| `style` | Formatação, espaçamento, CSS — sem mudança de lógica |
| `refactor` | Reorganização de código sem alterar comportamento |
| `chore` | Configurações, dependências, arquivos de projeto |
| `test` | Adição ou correção de testes |

---

## Exemplos práticos

```bash
git commit -m "feat: cria tela de cadastro de voluntário"
git commit -m "fix: corrige validação do formulário da ONG"
git commit -m "docs: adiciona fluxo de contribuição"
git commit -m "style: ajusta espaçamento do card de oportunidade"
git commit -m "refactor: reorganiza componentes de perfil"
git commit -m "chore: adiciona json server"
git commit -m "test: cria testes de cadastro"
```

---

## Boas práticas

- Use verbos no presente: `cria`, `corrige`, `adiciona`, `remove`, `atualiza`
- Seja objetivo: a mensagem deve deixar claro o que foi feito sem precisar abrir o commit
- Evite mensagens vagas como `ajustes`, `mudanças`, `correções`, `wip` ou `update`
- Um commit deve representar uma única mudança coesa — se precisar usar "e" na mensagem, considere dividir em dois commits

### Exemplos do que evitar

| ❌ Ruim | ✅ Bom |
|---|---|
| `ajustes` | `style: ajusta espaçamento do header` |
| `mudanças no formulário` | `fix: corrige máscara do campo de telefone` |
| `update` | `feat: adiciona filtro por categoria na listagem` |
| `wip` | `feat: adiciona estrutura inicial da tela de login` |
