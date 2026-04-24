# Banco de Dados — Voluntarize

## Como funciona

O backend da plataforma utiliza o [JSON Server](https://github.com/typicode/json-server), uma ferramenta que simula uma API REST completa a partir de um arquivo JSON. Ao rodar o servidor, cada chave do `db.json` vira automaticamente um endpoint acessível via HTTP.

### Iniciando o servidor

```bash
cd codigo
npm install
npm start
```

O servidor sobe em `http://localhost:3000` e expõe os seguintes endpoints:

| Endpoint | Descrição |
|---|---|
| `GET /volunteers` | Lista todos os voluntários |
| `GET /ongs` | Lista todas as ONGs |
| `GET /actions` | Lista todas as ações |
| `GET /applications` | Lista todas as inscrições |
| `GET /reviews` | Lista todas as avaliações |
| `GET /tags` | Lista todas as tags |

O JSON Server suporta nativamente `GET`, `POST`, `PUT`, `PATCH` e `DELETE`, além de filtros por query string, ex: `GET /actions?status=open` ou `GET /applications?volunteerId=1`.

### Estrutura de arquivos

```
db/
├── db.json                  → Arquivo principal lido pelo servidor
├── estrutura_dados_sprint_1.json → Versão de referência/histórico
└── README.md                → Esta documentação
```

> Os arquivos dentro de `database/` são usados como referência durante o desenvolvimento. O servidor lê apenas o `db.json`.

---

## Entidades

### `volunteers`
Voluntários cadastrados na plataforma.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Identificador único |
| `name` | string | Nome completo |
| `email` | string | E-mail de acesso |
| `password` | string | Senha da conta |
| `cpf` | string | CPF do voluntário |
| `birthDate` | string (date) | Data de nascimento |
| `cep` | string | CEP do endereço, usado para filtro por proximidade |
| `bio` | string | Descrição pessoal exibida no perfil |
| `phone` | string | Telefone de contato |
| `profilePicture` | string (url) | URL da foto de perfil |
| `rating` | number | Média das avaliações recebidas pelas ONGs |
| `followers` | number | Quantidade de seguidores na plataforma |
| `createdAt` | string (date) | Data de criação da conta |
| `deletedAt` | string (date) \| null | Data de exclusão lógica. `null` se a conta estiver ativa |

---

### `ongs`
ONGs e instituições cadastradas na plataforma.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Identificador único |
| `name` | string | Nome da organização |
| `email` | string | E-mail de acesso |
| `password` | string | Senha da conta |
| `cnpj` | string | CNPJ da organização |
| `foundationDate` | string (date) | Data de fundação |
| `cep` | string | CEP da sede |
| `description` | string | Descrição exibida no perfil |
| `responsibleName` | string | Nome do responsável pela conta |
| `phone` | string | Telefone de contato |
| `website` | string (url) | Site institucional |
| `logo` | string (url) | URL do logotipo |
| `rating` | number | Média das avaliações recebidas pelos voluntários |
| `followers` | number | Quantidade de seguidores na plataforma |
| `createdAt` | string (date) | Data de criação da conta |
| `deletedAt` | string (date) \| null | Data de exclusão lógica. `null` se a conta estiver ativa |

---

### `actions`
Ações e vagas publicadas pelas ONGs.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Identificador único |
| `title` | string | Título da ação |
| `description` | string | Descrição detalhada |
| `location` | string | Endereço de realização |
| `date` | string (date) | Data de realização |
| `ongId` | number | ID da ONG responsável |
| `tags` | string[] | Categorias para filtro por interesse |
| `participants` | number[] | IDs dos voluntários confirmados |
| `vacancies` | number | Número máximo de vagas |
| `status` | string | `open`, `closed`, `completed` ou `cancelled` |
| `endDate` | string (date) | Data limite para inscrições |
| `image` | string (url) | Imagem de capa exibida no card |
| `createdAt` | string (date) | Data de publicação |
| `deletedAt` | string (date) \| null | Data de exclusão lógica. `null` se a ação estiver ativa |

---

### `applications`
Inscrições de voluntários em ações. Conecta `volunteers` e `actions`.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Identificador único |
| `volunteerId` | number | ID do voluntário inscrito |
| `actionId` | number | ID da ação |
| `status` | string | `pending`, `accepted` ou `rejected` |
| `appliedAt` | string (date) | Data da inscrição |
| `confirmedAt` | string (date) \| null | Data de confirmação de presença. `null` se não confirmada |
| `attended` | boolean | Se o voluntário compareceu à ação |

---

### `reviews`
Avaliações mútuas entre voluntários e ONGs após a realização de uma ação.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Identificador único |
| `authorId` | number | ID de quem avaliou (voluntário ou ONG) |
| `targetType` | string | Tipo do avaliado: `volunteer` ou `ong` |
| `targetId` | number | ID do avaliado |
| `actionId` | number | ID da ação vinculada à avaliação |
| `rating` | number | Nota de 1 a 5 |
| `comment` | string | Comentário da avaliação |
| `createdAt` | string (date) | Data do registro |
| `deletedAt` | string (date) \| null | Data de exclusão lógica. `null` se a avaliação estiver ativa |

---

### `tags`
Categorias para classificar ações, usadas como filtro de busca.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number | Identificador único |
| `name` | string | Nome da categoria exibido na interface |
