
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

* Bernardo Lopes Diniz - Criação do Figma (Protótipo) e Apresentação do projeto
* Thiago de Castro - Criação do Figma (Protótipo) e Apresentação do projeto
* Daniel Viana Melchichi - Criação dos Slides para apresentação 
* Mateus Andrade Motta - Criação dos Slides para apresentação 
* João Paulo de Castro - Documentação do projeto 
* Luiz Gustavo Moura e Souza - Criação dos wireframes 
* Igor Bruno Rodrigues da Cruz - Documentação do projeto 

## Quadro de taferas  (Kanban)

- **Backlog:** Codificação do projeto 
- **A Fazer:** 
- **Em Andamento:** 
- **Concluído:** Matriz CSD, Mapa de Stakeholders, Personas, Proposta de Valor, 
Wireframe, Fluxo de Telas, Documentação, Código do Projeto, Apresentação.



# Referências

As referências utilizadas no trabalho foram:

IDIS — Pesquisa Voluntariado no Brasil 2021: https://www.idis.org.br/o-brasil-conta-com-57-milhoes-de-voluntarios-ativos-segundo-pesquisa-voluntariado-no-brasil-2021/

Os Números e a Cara do Voluntariado: https://voluntarios.com.br/blog/os-numeros-e-a-cara-do-voluntariado

BHBit — Voluntariado no Brasil, um campo a ser explorado: https://www.bhbit.com.br/gestao/voluntariado-no-brasil-um-campo-ainda-ser-explorado/


