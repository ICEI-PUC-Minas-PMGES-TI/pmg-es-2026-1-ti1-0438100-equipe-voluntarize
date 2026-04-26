# Git Workflow — Voluntarize

Guia prático do fluxo de contribuição adotado pela equipe. Siga estes passos sempre que for trabalhar em uma nova tarefa.

---

## 1. Clonar o repositório

Faça isso apenas uma vez, na primeira vez que for trabalhar no projeto.

```bash
git clone https://github.com/<org>/pmg-es-2026-1-ti1-0438100-equipe-voluntarize.git
cd pmg-es-2026-1-ti1-0438100-equipe-voluntarize
```

---

## 2. Ir para a branch develop e atualizá-la

Antes de começar qualquer coisa, garanta que sua develop está atualizada.

```bash
git checkout develop
git pull origin develop
```

> Faça isso toda vez que for iniciar uma nova tarefa, não apenas na primeira vez.

---

## 3. Criar sua branch

Crie uma branch a partir da develop seguindo o padrão de nomenclatura abaixo.

```bash
git checkout -b tipo/nome-descritivo
```

### Padrões de nomenclatura

| Prefixo | Quando usar |
|---|---|
| `feature/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `chore/` | Configuração, dependências, organização |
| `docs/` | Documentação |

### Exemplos

```bash
git checkout -b feature/tela-cadastro-voluntario
git checkout -b fix/validacao-formulario-ong
git checkout -b docs/guia-contribuicao
git checkout -b chore/configuracao-json-server
```

---

## 4. Desenvolver e commitar

Faça commits pequenos e frequentes ao longo do desenvolvimento. Evite acumular muitas mudanças em um único commit.

```bash
# Verificar o que foi alterado
git status

# Adicionar arquivos específicos (prefira isso ao invés de git add .)
git add public/modulos/cadastro/cadastro.html
git add public/assets/js/cadastro.js

# Fazer o commit
git commit -m "feat: cria estrutura da tela de cadastro de voluntário"
```

> Consulte o arquivo [conventional-commits.md](./conventional-commits.md) para saber como escrever boas mensagens de commit.

---

## 5. Manter sua branch atualizada

Enquanto você trabalha, outros integrantes podem fazer merge na develop. Atualize sua branch regularmente para evitar conflitos grandes no final.

```bash
git checkout develop
git pull origin develop
git checkout feature/sua-branch
git merge develop
```

> Faça isso pelo menos uma vez por dia quando estiver desenvolvendo ativamente.

---

## 6. Atualizar a documentação

Se sua tarefa impactar o funcionamento do projeto (nova rota, nova funcionalidade, mudança de estrutura), atualize o README ou a documentação relevante antes de abrir o PR.

---

## 7. Enviar a branch para o GitHub

```bash
git push origin feature/sua-branch
```

---

## 8. Abrir o Pull Request

1. Acesse o repositório no GitHub
2. Clique em **"Compare & pull request"**
3. Defina a base como `develop` (nunca `main`)
4. Preencha o título seguindo o padrão de commits: `feat: tela de cadastro de voluntário`
5. Descreva brevemente o que foi feito e, se houver, o que ainda precisa de atenção
6. Solicite revisão de pelo menos um integrante da equipe

---

## 9. Revisão e merge

- Aguarde a aprovação de pelo menos um colega
- Responda os comentários e faça ajustes se necessário
- Após aprovação, faça o merge para a `develop`
- Delete a branch após o merge

---

## Boas práticas

- Puxe atualizações da develop com frequência para evitar conflitos grandes
- Nunca commite diretamente na `develop` ou na `main`
- Nomeie branches de forma clara e objetiva
- Prefira commits pequenos e focados em uma única mudança
- Revise seu próprio código antes de abrir o PR (leia o diff no GitHub)
- Não deixe código comentado ou arquivos desnecessários no PR
