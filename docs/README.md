
# Projeto: Voluntarize
**O Voluntarize** é uma plataforma web que conecta voluntários e ONGs de forma simples e eficiente. O objetivo é facilitar o encontro entre pessoas que querem ajudar e organizações que precisam de apoio, centralizando em um só lugar a publicação de vagas, pedidos de doação e chamados para ações presenciais.


 
* ## **Repositório GitHub:** 

https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0438100-equipe-voluntarize 


# Integrantes da equipe
  * [Bernardo Lopes Diniz (Líder)](https://github.com/bernardooldz) 
  * [Thiago de Castro](https://github.com/thiagolutes) 
  * [João Paulo de Castro](https://github.com/joaopcastro-dev) 
  * [Mateus Andrade Motta](https://github.com/MateusAndrade-1809) 
  * [Igor Bruno Rodrigues da Cruz](https://github.com/IgorCruz-73) 
  * [Luiz Gustavo Moura e Souza](https://github.com/LuizMoura06) 
  * [Daniel Viana Melchichi](https://github.com/danmilithi)

# Contexto do projeto
## Problema

O voluntariado no Brasil enfrenta um desafio estrutural: apesar do grande número de pessoas dispostas a ajudar e de ONGs que precisam de apoio, não existe uma forma centralizada e eficiente de conectar esses dois lados. Voluntários têm dificuldade em encontrar oportunidades que combinem com seu perfil, disponibilidade e localização, enquanto ONGs dependem de divulgação informal e fragmentada para recrutar colaboradores. 

Essa falta de conexão resulta em ações com baixa adesão e voluntários que desistem por não saber por onde começar.
É nesse contexto que a  **Voluntarize** entra. 


## Objetivos

O objetivo geral do projeto é desenvolver uma plataforma web que conecte voluntários e ONGs de forma simples, organizada e eficiente.

Nossos principais objetivos são:
- Facilitar a descoberta de oportunidades de voluntariado por meio de filtros de interesse e localização
- Oferecer às ONGs ferramentas para publicar vagas, gerenciar candidatos e avaliar a participação dos voluntários


## Justificativa

O voluntariado é uma prática essencial para o fortalecimento da sociedade civil, mas ainda carece de ferramentas digitais acessíveis que facilitem sua organização. A ausência de uma plataforma centralizada faz com que muitas ONGs operem com poucos voluntários não por falta de interesse da população, mas por falta de visibilidade. O Voluntarize surge para preencher essa lacuna, tornando o acesso a causas sociais mais fácil e impactante. 


## Público-Alvo

A plataforma possui dois perfis principais de usuários. 

O primeiro é o voluntário, pessoas de diferentes faixas etárias que desejam contribuir com causas sociais e buscam oportunidades que se encaixem em sua rotina, habilidades e localização. 

O segundo é a ONG ou instituição, organizações que precisam divulgar vagas, recrutar voluntários e gerenciar suas ações de forma mais organizada. Ambos os perfis possuem familiaridade básica com tecnologia e acesso à internet.


# Processo de Product Discovery


## Matriz CSD
![Matriz CSD](images/CSD.png)

## Mapa de stakeholders
![Mapa de stakeholders](images/stakeholders.png)

## Pesquisa e entendimento do problema:
A Pesquisa Voluntariado no Brasil 2021 revelou que 56% da população adulta já realizou alguma atividade voluntária, com cerca de 57 milhões de brasileiros ativamente engajados. IDIS Apesar desse potencial, a conexão entre quem quer ajudar e quem precisa ainda é extremamente precária. Cerca de 84% dos voluntários desconhecem plataformas e sites de promoção ao voluntariado Voluntarios, e 29% das pessoas que nunca voluntariaram afirmam que simplesmente nunca foram convidadas, enquanto 12% não sabem onde encontrar informações sobre o tema. Bhbit

Do lado das ONGs, o cenário é igualmente desafiador. O Brasil conta com cerca de 237 mil ONGs Worldpackers, mas a maioria depende de divulgação informal e fragmentada para recrutar colaboradores. A ausência de uma plataforma centralizada faz com que muitas organizações operem abaixo de sua capacidade por falta de visibilidade, não por falta de interesse da população.


## Personas

### Persona 1: 
![Persona 1 ](images/personas/persona1.png)
###  Persona 2: 
![Persona 2](images/personas/persona2.png)
###  Persona 3: 
![Persona 3 ](images/personas/persona3.png)
###  Persona 4: 
![Persona 4 ](images/personas/persona4.png)
###  Persona 5: 
![Persona 5 ](images/personas/persona5.png)



# Product Design

## Histórias de Usuários

Com base na análise das personas foram identificadas as seguintes histórias de usuários:

| Eu como... | Preciso de... | Para... |
|---|---|---|
| ONG/Instituição | Poder criar uma vaga | Encontrar pessoas interessadas em participar da minha ação |
| ONG/Instituição | Visualizar as pessoas que se voluntariaram para minha vaga/ação | Selecionar as mais relevantes e convidá-las a participar |
| Voluntário | Visualizar as vagas de ações disponíveis | Poder me voluntariar |
| Voluntário | Filtrar vagas por área de interesse | Encontrar oportunidades que combinam com meu perfil |
| Voluntário | Filtrar vagas nas proximidades | Facilitar a minha locomoção para vagas que combinam com meu perfil |
| Voluntário | Criar e editar meu perfil | Mostrar minhas habilidades e interesses |
| ONG/Instituição | Poder avaliar como foi a participação do voluntário | Reconhecer os melhores voluntários |
| Voluntário | Poder avaliar como foi a participação da ação | Validar instituições confiáveis |
| Administrador | Poder remover conteúdos inadequados | Manter a qualidade do sistema |



## Proposta de Valor

### Proposta de valor Persona 1: 

<br>

![Persona 1 ](images/personas/proposta1.png)
### Proposta de valor Persona 2: 
![Persona 2](images/personas/proposta2.png)
### Proposta de valor Persona 3: 
![Persona 3 ](images/personas/proposta3.png)
### Proposta de valor Persona 4: 
![Persona 4 ](images/personas/proposta4.png)
### Proposta de valor Persona 5: 
![Persona 5 ](images/personas/proposta5.png)

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

| ID | Descrição do Requisito | Prioridade |
|---|---|---|
| RF-001 | Permitir que ONGs publiquem vagas e necessidades | ALTA |
| RF-002 | Permitir que voluntários visualizem e filtrem vagas disponíveis | ALTA |
| RF-003 | Permitir filtro de vagas por área de interesse e localização | ALTA |
| RF-004 | Permitir que voluntários criem e editem seu perfil | ALTA |
| RF-005 | Permitir que ONGs visualizem os interessados em suas vagas | ALTA |
| RF-006 | Implementar sistema de avaliação mútua entre ONG e voluntário | MÉDIA |
| RF-007 | Histórico de participações do voluntário | MÉDIA |
| RF-008 | Permitir que administradores removam conteúdos inadequados | MÉDIA |
| RF-009 | Implementar sistema de validação de participação | MÉDIA |

### Requisitos não Funcionais

| ID | Descrição do Requisito | Prioridade |
|---|---|---|
| RNF-001 | O sistema deve ser responsivo para dispositivos móveis e desktop | ALTA |
| RNF-002 | A plataforma deve garantir a segurança dos dados dos usuários | ALTA |
| RNF-003 | O sistema deve processar requisições em no máximo 3 segundos | MÉDIA |


# Projeto de Interface

## Wireframes

### Landing Page
![1](images/wireframes/wire1.png)

### Home do Voluntário
![2](images/wireframes/wire2.png)

### Home da ONG
![3](images/wireframes/wire3.png)

### Busca e listagem de Vagas
![4](images/wireframes/wire4.png)

### Detalhes da Vaga
![5](images/wireframes/wire5.png)

### Lista de Candidatos
![6](images/wireframes/wire6.png)

### Perfil de Voluntário e ONG
![7](images/wireframes/wire7.png)

### Login
![8](images/wireframes/wire8.png)

### Cadastro
![9](images/wireframes/wire9.png)

### Criação de Vaga
![10](images/wireframes/wire10.png)

### Avaliação de Voluntário
![11](images/wireframes/wire11.png)

### Avaliação de ONG
![12](images/wireframes/wire12.png)

### Confirmação de Presença
![13](images/wireframes/wire13.png)




## User Flow

### Fluxo do Voluntário – Criar uma vaga
![1](images/userflow/userflow1.png)

### Fluxo da ONG – Confirmar Participação

![2](images/userflow/userflow2.png)

### Fluxo da ONG – Login

![3](images/userflow/userflow3.png)

### Fluxo da ONG – Cadastro

![4](images/userflow/userflow4.png)

### Fluxo da ONG – Avaliação ONG

![5](images/userflow/userflow5.png)

### Fluxo da ONG – Listar inscrições (Visão ONG)

![6](images/userflow/userflow6.png)

### Fluxo da ONG – Detalhes da Vaga (Visão ONG)

![7](images/userflow/userflow7.png)

### Fluxo da ONG – Avaliação do Voluntário

![8](images/userflow/userflow8.png)

### Fluxo da ONG – Inscrever-se em uma Vaga

![9](images/userflow/userflow9.png)

### Fluxo da ONG – Buscar Vagas (ONG)

![10](images/userflow/userflow10.png)


### Protótipo Interativo

* [Protótipo Interativo](https://www.figma.com/proto/9q3DFI9tyAeJaWsZYzHPY1/Projeto-de-Interfaces?node-id=111-3&t=F1bp8fa0YzESuUOh-1&starting-point-node-id=111%3A3)



# Metodologia


## Ferramentas: 



| Ambiente                    | Plataforma | Link de acesso ou justificativa                                    |
| --------------------------- | ---------- | -------------------------------------------------- |
| Editor de código | Visual Studio Code | Plataforma leve e gratuita |
| Linguagens | HTML, CSS e JavaScript | A base do desenvolvimento web |
| Comunicação | WhatsApp e Google Meet | Práticos e ágeis para a comunicação no dia a dia |
| Organização e planejamento | Miro e WhatsApp | Facilita a criação de quadros e colaboração entre a equipe |
| Processo de Design Thinking | Miro       | https://miro.com/app/board/uXjVGttpFEk=/        |
| Repositório de código     | GitHub     | https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0438100-equipe-voluntarize/tree/master/codigo      |
| Protótipo Interativo       | Figma  | https://www.figma.com/proto/9q3DFI9tyAeJaWsZYzHPY1/Projeto-de-Interfaces?node-id=111-3&t=F1bp8fa0YzESuUOh-1&starting-point-node-id=111%3A3   |



## Gerenciamento do Projeto e divisão de papéis

A equipe adotou uma abordagem colaborativa inspirada no Scrum, dividindo o projeto em etapas menores para facilitar o acompanhamento e permitir ajustes ao longo do caminho. A comunicação entre os membros foi feita principalmente via WhatsApp e Google Meet, onde o grupo organizava as tarefas pendentes e alinhava o progresso de cada etapa.

As entregas da fase de descoberta, como Personas, Matriz CSD, Mapa de Stakeholders e Proposta de Valor, foram construídas coletivamente, com todoscontribuindo com ideias e revisões. Ainda assim, cada membro assumiu responsabilidades específicas para garantir que nenhuma parte do projeto ficasse sem um responsável direto. Novas divisões serão definidas conforme o desenvolvimento da plataforma avançar.

### Divisão de papéis: 

* Bernardo Lopes Diniz - Criação do Figma (Protótipo), apresentação do projeto e desenvolvimento.
* Thiago de Castro - Criação do Figma (Protótipo), apresentação do projeto e desenvolvimento.
* João Paulo de Castro - Documentação do projeto e desenvolvimento.
* Mateus Andrade Motta - Criação dos Slides para apresentação e desenvolvimento.
* Daniel Viana Melchichi - Criação dos Slides para apresentação e desenvolvimento.
* Luiz Gustavo Moura e Souza - Criação dos wireframes e desenvolvimento.
* Igor Bruno Rodrigues da Cruz - Documento.

## Quadro de tarefas  (Kanban) 

- **Backlog:** 
- **A Fazer:** 
- **Em Andamento:** 
- **Concluído:** Matriz CSD, Mapa de Stakeholders, Personas, Proposta de Valor, 
Wireframe, Fluxo de Telas, Documentação, Código do Projeto, Apresentação e Codificação do projeto.

## Solução  Implementada

Esta seção apresenta todos os detalhes da solução criada no projeto.

## Vídeo do Projeto


[![Vídeo do projeto](../codigo/public/assets/images/logo/logo-icon.png)]()


## Funcionalidades
 
Esta seção apresenta as funcionalidades da solução.
 
### Funcionalidade 1 - Home (Dashboard)
 
Página inicial após login que exibe um resumo personalisado com ações recomendadas, candidaturas/vagas publicadas e atalhos rápidos para as principais funcionalidades. A interface varia conforme o tipo de usuário logado (voluntário ou ONG).
 
* Estrutura de dados: [Ações](#estrutura-de-dados---ações), [Candidaturas](#estrutura-de-dados---candidaturas) e [ONGs](#estrutura-de-dados---ongs)
* Instruções de acesso:
  * Faça login como voluntário ou ONG
  * Você é automaticamente redirecionado para a home (`modulos/home/home-voluntarios.html` ou `modulos/home/home-ong.html`)
* Tela da funcionalidade: ![Home](../codigo/public/assets/images/imgs-docs/1-home.png)
---
 
### Funcionalidade 2 - Cadastro de Voluntário
 
Permite que uma pessoa interessada em atuar como voluntária crie sua conta na plataforma, informando dados pessoais e de contato.
 
* Estrutura de dados: [Voluntários](#estrutura-de-dados---voluntários)
* Instruções de acesso:
  * Abra a página inicial do site (`index.html`)
  * Clique no botão **"Cadastrar"** (no topo) ou **"Quero ser voluntário"**
  * Preencha o formulário com nome, e-mail, senha, CPF, data de nascimento, CEP, telefone e bio
  * Clique em **"Cadastrar"** para concluir
* Tela da funcionalidade: ![Cadastro de Voluntário](../codigo/public/assets/images/imgs-docs/2-cadastroVoluntario.png)
---
 
### Funcionalidade 3 - Cadastro de ONG
 
Permite que uma organização sem fins lucrativos crie sua conta institucional na plataforma para publicar ações voluntárias.
 
* Estrutura de dados: [ONGs](#estrutura-de-dados---ongs)
* Instruções de acesso:
  * Abra a página inicial do site (`index.html`)
  * Clique no botão **"Sou uma ONG"** ou **"Cadastrar minha ONG"**
  * Preencha o formulário com nome da organização, e-mail, senha, CNPJ, data de fundação, CEP, endereço, descrição, responsável e telefone
  * Clique em **"Cadastrar"** para concluir
* Tela da funcionalidade: ![Cadastro de ONG](../codigo/public/assets/images/imgs-docs/3-cadastroONG.png)
---
 
### Funcionalidade 4 - Login
 
Permite que voluntários e ONGs acessem suas contas previamente cadastradas, sendo redirecionados para a home correspondente ao tipo de usuário.
 
* Estrutura de dados: [Voluntários](#estrutura-de-dados---voluntários) e [ONGs](#estrutura-de-dados---ongs)
* Instruções de acesso:
  * Abra a página inicial do site (`index.html`)
  * Clique no botão **"Entrar"**
  * Informe e-mail e senha cadastrados
  * Clique em **"Entrar"** para acessar o sistema
* Tela da funcionalidade: ![Login](../codigo/public/assets/images/imgs-docs/4-login.png)
---
 
### Funcionalidade 5 - Busca de Vagas
 
Permite que o voluntário visualize as ações voluntárias disponíveis publicadas pelas ONGs, com filtros por categoria/tag.
 
* Estrutura de dados: [Ações](#estrutura-de-dados---ações) e [Tags](#estrutura-de-dados---tags)
* Instruções de acesso:
  * Faça login como voluntário
  * Na home, clique em **"Ver vagas disponíveis"**, ou no menu superior em **"Vagas"**
* Tela da funcionalidade: ![Busca de Vagas](../codigo/public/assets/images/imgs-docs/5-busca.png)
---
 
### Funcionalidade 6 - Detalhes da Vaga
 
Exibe as informações completas de uma ação voluntária (descrição, local, data, vagas disponíveis, ONG responsável) e permite que o voluntário se candidate.
 
* Estrutura de dados: [Ações](#estrutura-de-dados---ações) e [Candidaturas](#estrutura-de-dados---candidaturas)
* Instruções de acesso:
  * Na tela **"Vagas"**, clique em qualquer card de ação
  * A página de detalhes é exibida com a opção de candidatura
* Tela da funcionalidade: ![Detalhes da Vaga](../codigo/public/assets/images/imgs-docs/6-detalhes.png)
---
 
### Funcionalidade 7 - Cadastro de Ação (Vaga)
 
Permite que a ONG publique uma nova ação voluntária, informando título, descrição, local, data, número de vagas e tags.
 
* Estrutura de dados: [Ações](#estrutura-de-dados---ações)
* Instruções de acesso:
  * Faça login como ONG
  * Na home da ONG, clique em **"Criar nova vaga"**
  * Preencha os campos da ação (título, descrição, local, data, vagas, tags)
  * Clique em **"Publicar"** para concluir
* Tela da funcionalidade: ![Cadastro de Ação](../codigo/public/assets/images/imgs-docs/7-cadastroacao.png)
---
 
### Funcionalidade 8 - Gerenciar Candidaturas (visão ONG)
 
Permite que a ONG visualize os voluntários inscritos em suas ações e aceite ou recuse cada candidatura.
 
* Estrutura de dados: [Candidaturas](#estrutura-de-dados---candidaturas)
* Instruções de acesso:
  * Faça login como ONG
  * Acesse a tela **"Gerenciar Candidaturas"** (`modulos/gerenciar-candidaturas-ong/index.html`)
  * Visualize a lista de candidatos e clique em **"Aceitar"** ou **"Recusar"** para cada um
* Tela da funcionalidade: ![Gerenciar Candidaturas](../codigo/public/assets/images/imgs-docs/8-gerenciaCand.png)
---
 
### Funcionalidade 9 - Minhas Candidaturas (visão Voluntário)
 
Permite que o voluntário acompanhe o status (pendente, aceita, recusada) das ações nas quais se candidatou.
 
* Estrutura de dados: [Candidaturas](#estrutura-de-dados---candidaturas)
* Instruções de acesso:
  * Faça login como voluntário
  * Acesse a tela **"Minhas Candidaturas"** (`modulos/manipulacao-candidaturas-voluntario/index.html`)
* Tela da funcionalidade: ![Minhas Candidaturas](../codigo/public/assets/images/imgs-docs/9-vagasinscritas.png)
---
 
### Funcionalidade 10 - Confirmação de Presença via QR Code
 
Permite confirmar a presença do voluntário no dia da ação: o voluntário gera um QR Code, que é escaneado pela ONG para validar o check-in.
 
* Estrutura de dados: [Confirmações de Presença](#estrutura-de-dados---confirmações-de-presença)
* Instruções de acesso:
  * Com uma candidatura aceita, a ong acessa a tela de presença (`modulos/presenca/presenca.html?volunteerId=<id>&actionId=<id>`)
  * Um QR Code é exibido na tela
  * O voluntário, com outro dispositivo, escaneia o QR Code (que abre `modulos/presenca/validar.html`)
  * A presença é validada e o status é atualizado automaticamente na tela do voluntário em até 3 segundos
* Tela da funcionalidade: ![Confirmação de Presença](../codigo/public/assets/images/imgs-docs/10-presenca.png)
---
 
### Funcionalidade 11 - Avaliação (Feedback)
 
Permite que o voluntário avalie a ONG após a realização de uma ação ou vice-versa, atribuindo nota e comentário.
 
* Estrutura de dados: [Avaliações](#estrutura-de-dados---avaliações)
* Instruções de acesso:
  * Após concluir uma ação, o voluntário ou a ONG acessa a tela de avaliação (`modulos/feedback/feedbackONG.html`) (`modulos/feedback/feedbackvolunteer.html`) 
  * Atribui uma nota de 1 a 5 estrelas e escreve um comentário
  * Clique em **"Enviar avaliação"**
* Tela da funcionalidade: ![Avaliação da ONG](../codigo/public/assets/images/imgs-docs/11-avaliacao.png)
---
 
### Funcionalidade 12 - Mapa de ONGs
 
Permite que o voluntário visualize, em um mapa interativo, as ONGs cadastradas próximas à sua localização.
 
* Estrutura de dados: [ONGs](#estrutura-de-dados---ongs)
* Instruções de acesso:
  * Faça login como voluntário
  * No menu superior, clique em **"Mapa de ONGs"**
* Tela da funcionalidade: ![Mapa de ONGs](../codigo/public/assets/images/imgs-docs/12-mapaongs.png)
---
 
### Funcionalidade 13 - Favoritar/Salvar Vagas
 
Permite que o voluntário marque ações de interesse como favoritas, para consultá-las depois em uma lista separada.
 
* Estrutura de dados: [Favoritos](#estrutura-de-dados---favoritos)
* Instruções de acesso:
  * Faça login como voluntário
  * Na tela **"Vagas"** ou **"Detalhes da Vaga"**, clique no ícone de favorito (estrela/coração)
  * Acesse a lista completa em **"Vagas salvas"** (`modulos/favoritar-salvar-vagas/index.html`)
* Tela da funcionalidade: ![Favoritar Vagas](../codigo/public/assets/images/imgs-docs/13-vagasSalvas.png)
---
 
### Funcionalidade 14 - Sistema de Seguidores
 
Permite que voluntários sigam ONGs (e vice-versa) para acompanhar novas ações publicadas.
 
* Estrutura de dados: [Seguidores](#estrutura-de-dados---seguidores)
* Instruções de acesso:
  * Faça login como voluntário ou ONG
  * Acesse o perfil detalhado de uma ONG ou voluntário
  * Clique no botão **"Seguir"**
  * Consulte a lista de conexões em **"Conexões voluntárias"** (`modulos/sistema-de-seguidores/index.html`)
* Tela da funcionalidade: ![Sistema de Seguidores](../codigo/public/assets/images/imgs-docs/14-sistemaSeguidores.png)
---
 
### Funcionalidade 15 - Visualização de Perfil Detalhado (ONG)
 
Exibe o perfil público completo de uma ONG: descrição, ações publicadas, avaliações recebidas e opção de seguir.
 
* Estrutura de dados: [ONGs](#estrutura-de-dados---ongs) e [Avaliações](#estrutura-de-dados---avaliações)
* Instruções de acesso:
  * Na tela **"Vagas"**, **"Mapa de ONGs"** ou **"Detalhes da Vaga"**, clique no nome/logo de uma ONG
* Tela da funcionalidade: ![Perfil da ONG](../codigo/public/assets/images/imgs-docs/15-visuONG.png)
---
 
### Funcionalidade 16 - Visualização de Perfil Detalhado (Voluntário)
 
Exibe o perfil público completo de um voluntário: bio, avaliações recebidas e opção de seguir.
 
* Estrutura de dados: [Voluntários](#estrutura-de-dados---voluntários) e [Avaliações](#estrutura-de-dados---avaliações)
* Instruções de acesso:
  * Na tela **"Gerenciar Candidaturas"**, clique no nome de um voluntário candidato
* Tela da funcionalidade: ![Perfil do Voluntário](../codigo/public/assets/images/imgs-docs/16-visuVolun.png)
---
 
### Funcionalidade 17 - Meu Perfil
 
Permite que o usuário (voluntário ou ONG) visualize e edite seus próprios dados cadastrais.
 
* Estrutura de dados: [Voluntários](#estrutura-de-dados---voluntários) ou [ONGs](#estrutura-de-dados---ongs)
* Instruções de acesso:
  * Faça login
  * No menu superior, clique em **"Perfil"**
* Tela da funcionalidade: ![Meu Perfil](../codigo/public/assets/images/imgs-docs/17-meuperfil.png)



## Estruturas de Dados

Descrição das estruturas de dados utilizadas na solução, com exemplos no formato JSON.

### Estrutura de Dados - Voluntários

Registro dos voluntários cadastrados na plataforma, utilizados para login e exibição do perfil.

```json
{
  "id": "1",
  "name": "Cláudia Mendes",
  "email": "claudia.mendes@email.com",
  "password": "123456",
  "cpf": "123.456.789-00",
  "birthDate": "2000-08-10",
  "cep": "30110-000",
  "bio": "Gosto de ajudar comunidades carentes e atuo em ações sociais há 4 anos.",
  "phone": "(31) 91234-5678",
  "profilePicture": "",
  "rating": 4.7,
  "createdAt": "2020-08-10",
  "deletedAt": null
}
```

### Estrutura de Dados - ONGs

Registro das ONGs e instituições cadastradas na plataforma, utilizadas para login e exibição do perfil institucional.

```json
{
  "id": "1",
  "name": "ONG Dia Feliz",
  "email": "contato@diafeliz.org",
  "password": "123456",
  "cnpj": "12.345.678/0001-99",
  "foundationDate": "2015-08-01",
  "cep": "30120-000",
  "address": "Jardim Felicidade, Belo Horizonte, MG",
  "city": "Belo Horizonte",
  "state": "MG",
  "latitude": -19.8194,
  "longitude": -43.9583,
  "description": "ONG focada em ações sociais e apoio comunitário em regiões periféricas de BH.",
  "responsibleName": "Carlos Henrique Souza",
  "phone": "(31) 3333-4444",
  "website": "https://www.diafeliz.org",
  "logo": "",
  "rating": 4.4,
  "createdAt": "2025-08-01",
  "deletedAt": null
}
```

### Estrutura de Dados - Ações

Vagas de trabalho voluntário publicadas pelas ONGs, exibidas para os voluntários na busca e nos detalhes da ação.

```json
{
  "id": "1",
  "title": "Distribuição de Cestas Básicas",
  "description": "Distribuição de cestas básicas para famílias em situação de vulnerabilidade no bairro Jardim Felicidade.",
  "location": "Rua das Flores, 215 - Jardim Felicidade, Belo Horizonte, MG",
  "date": "2026-06-20",
  "ongId": 1,
  "tags": ["Alimentação", "Comunidade"],
  "participants": [1, 2, 5],
  "vacancies": 20,
  "views": 217,
  "status": "open",
  "endDate": "2026-08-12",
  "image": "",
  "checkInCode": "CF-1A2B3C",
  "createdAt": "2026-07-20",
  "deletedAt": null
}
```

### Estrutura de Dados - Candidaturas

Inscrições realizadas por voluntários em ações publicadas pelas ONGs, conectando voluntários e ações.

```json
{
  "id": "2",
  "volunteerId": 2,
  "actionId": 1,
  "status": "accepted",
  "appliedAt": "2026-07-23",
  "confirmedAt": null,
  "attended": false
}
```

### Estrutura de Dados - Confirmações de Presença

Registro de presença dos voluntários nas ações, gerado a partir da leitura do QR Code de check-in pela ONG organizadora.

```json
{
  "id": 1,
  "volunteerId": 1,
  "actionId": 1,
  "token": "voluntarize:presenca:v1:a1:1771430400000",
  "validatedAt": "2026-06-20T14:32:00.000Z",
  "deletedAt": null
}
```

### Estrutura de Dados - Avaliações

Avaliações mútuas feitas por voluntários e ONGs após a realização de uma ação.

```json
{
  "id": "1",
  "authorId": 1,
  "targetType": "ong",
  "targetId": 1,
  "actionId": 7,
  "rating": 5,
  "comment": "Organização impecável, equipe muito atenciosa e ação muito bem planejada.",
  "createdAt": "2026-07-02",
  "deletedAt": null
}
```

### Estrutura de Dados - Seguidores

Relações de seguimento entre voluntários e ONGs.

```json
{
  "id": "1",
  "followerType": "volunteer",
  "followerId": 1,
  "targetType": "ong",
  "targetId": 1,
  "createdAt": "2026-05-10"
}
```

### Estrutura de Dados - Favoritos

Vagas salvas pelos voluntários para consulta posterior.

```json
{
  "id": "1",
  "volunteerId": 1,
  "actionId": 2,
  "createdAt": "2026-05-18"
}
```

### Estrutura de Dados - Tags

Categorias utilizadas para classificar ações e servir como filtro de busca.

```json
{
  "id": "1",
  "name": "Alimentação"
}
```

## Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução.

### Frameworks e Bibliotecas

#### Backend

* **Express** - https://expressjs.com/
  * Framework web para Node.js utilizado como servidor da aplicação.

* **JSON Server** - https://github.com/typicode/json-server
  * Servidor mock RESTful que fornece uma API completa baseada em arquivo JSON (`db.json`), utilizado para persistência de dados durante o desenvolvimento.

#### Frontend

* **Bootstrap 5** - https://getbootstrap.com/
  * Framework CSS responsivo utilizado para layout, componentes de interface e grid system em toda a aplicação.

* **Bootstrap 4** - https://getbootstrap.com/docs/4.0/
  * Versão anterior do Bootstrap, utilizada em alguns módulos legados.

* **Popper.js** - https://popper.js.org/
  * Biblioteca para posicionamento de elementos flutuantes (tooltips, dropdowns, popovers).

* **jQuery** - https://jquery.com/
  * Biblioteca JavaScript utilizada para manipulação simplificada do DOM e eventos em componentes específicos.

* **Font Awesome** - https://fontawesome.com/
  * Biblioteca de ícones vetoriais utilizada para ícones na interface (v6.5.0 e v6.5.1).

* **Leaflet** - https://leafletjs.com/
  * Biblioteca de mapas interativos de código aberto utilizada no módulo **"Mapa de ONGs"** para exibir localizações geográficas.

### APIs Externas

* **QR Server API** - https://api.qrserver.com/
  * API gratuita de geração de QR Code em tempo real. Utilizada no módulo **"Confirmação de Presença"** para gerar códigos QR dinâmicos com dados de validação.
  * Endpoint utilizado: `/v1/create-qr-code/` (GET)

* **Google Fonts API** - https://fonts.google.com/
  * API para carregamento de fontes personalizadas. A aplicação utiliza as famílias **Oxygen** (normal) e **Oxygen Mono** (monospace) para tipografia.

### APIs Internas

* **JSON Server REST API**
  * API RESTful fornecida pelo JSON Server para operações CRUD nos dados:
    * `GET /volunteers` — Listar todos os voluntários
    * `POST /volunteers` — Cadastrar novo voluntário
    * `GET /ongs` — Listar todas as ONGs
    * `POST /ongs` — Cadastrar nova ONG
    * `GET /actions` — Listar todas as ações
    * `POST /actions` — Publicar nova ação
    * `GET /applications` — Listar candidaturas
    * `POST /applications` — Criar candidatura
    * `PATCH /applications/:id` — Aceitar/recusar candidatura
    * `GET /reviews` — Listar avaliações
    * `POST /reviews` — Criar avaliação
    * `GET /follows` — Listar seguidores
    * `POST /follows` — Criar seguimento
    * `GET /favorites` — Listar favoritos
    * `POST /favorites` — Adicionar favorito
    * `DELETE /favorites/:id` — Remover favorito
    * `GET /attendances` — Listar confirmações de presença
    * `POST /attendances` — Registrar presença validada

### Design System

* **Globals.css (Design System Customizado)**
  * Sistema de design proprietário baseado em CSS Variables (custom properties).
  * Define paleta de cores neobrutalistra, tipografia, espaçamento, sombras e componentes reutilizáveis.
  * Implementado em `/design-system/css/globals.css` e utilizado em todas as páginas.
  * Cores principais: preto (#1c1c1c), branco (#ffffff), verde (#c1ff72), roxo (#b18cfe).
  * Fontes: Oxygen e Oxygen Mono (carregadas via Google Fonts).



# Referências

As referências utilizadas no trabalho foram:

*1.* IDIS – INSTITUTO PARA O DESENVOLVIMENTO DO INVESTIMENTO SOCIAL. O Brasil conta com 57 milhões de voluntários ativos, segundo Pesquisa Voluntariado no Brasil 2021. São Paulo, 2022. Disponível em: https://www.idis.org.br/o-brasil-conta-com-57-milhoes-de-voluntarios-ativos-segundo-pesquisa-voluntariado-no-brasil-2021/.

*2.* BRUDER, Mariana. Os números e a cara do voluntariado. Voluntários.com.br, 2023. Disponível em: https://voluntarios.com.br/blog/os-numeros-e-a-cara-do-voluntariado.

*3.* BHBIT. Voluntariado no Brasil: um campo ainda a ser explorado. Belo Horizonte, [s.d.]. Disponível em: https://www.bhbit.com.br/gestao/voluntariado-no-brasil-um-campo-ainda-ser-explorado/.


