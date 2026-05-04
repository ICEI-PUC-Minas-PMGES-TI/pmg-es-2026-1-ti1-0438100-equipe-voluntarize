const PROFILE_STORAGE_KEY = "voluntarize_perfil_voluntario";

const defaultProfile = {
  volunteer: {
    name: "Cláudia",
    since: "Voluntária desde Ago. de 2020",
    joined: "Usuária da Voluntarize desde Dez. 2020",
    rating: 4.5,
    followers: 7000,
    about:
      "Contrary to popular belief, o trabalho voluntário de Cláudia combina acolhimento, organização e presença constante em ações sociais. Ela atua em campanhas de arrecadação, apoio comunitário e atividades educativas para famílias em vulnerabilidade.",
  },
  actions: [
    {
      title: "Ação do Dia 15",
      rating: 4.8,
      description:
        "Distribuição de alimentos e organização de kits para comunidades carentes.",
      image: "./img/profile-illustration.png",
    },
    {
      title: "Ação do Dia 15",
      rating: 4.8,
      description:
        "Apoio no acolhimento de famílias e registro dos participantes da ação.",
      image: "./img/profile-illustration.png",
    },
  ],
  reviews: [
    {
      author: "Ong Dia",
      rating: 5,
      comment:
        "Cláudia foi pontual, cuidadosa e muito comprometida com a ação.",
    },
    {
      author: "José",
      rating: 4.5,
      comment:
        "Trabalhou muito bem em equipe e ajudou além do esperado.",
    },
    {
      author: "Lucas",
      rating: 4,
      comment:
        "Demonstrou empatia, organização e disposição durante toda a atividade.",
    },
  ],
};

function loadProfile() {
  const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!savedProfile) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  try {
    return JSON.parse(savedProfile);
  } catch (error) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
}

function formatRating(rating) {
  return `${Number(rating).toFixed(1).replace(".", ",")} ☆`;
}

function formatFollowers(followers) {
  if (followers >= 1000) {
    return `${Math.floor(followers / 1000)}K Seguidores`;
  }

  return `${followers} Seguidores`;
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function createActionCard(action) {
  const card = document.createElement("article");
  card.className = "action-card";

  const media = document.createElement("div");
  media.className = "action-media";

  const image = document.createElement("img");
  image.src = action.image;
  image.alt = `Imagem da ${action.title}`;

  const rating = document.createElement("span");
  rating.className = "action-rating";
  rating.textContent = formatRating(action.rating);

  const title = document.createElement("h3");
  title.textContent = action.title;

  const description = document.createElement("p");
  description.textContent = action.description;

  const details = document.createElement("a");
  details.className = "details-button";
  details.href = "#";
  details.textContent = "Ver detalhes";

  media.append(image, rating);
  card.append(media, title, description, details);

  return card;
}

function createReviewCard(review) {
  const card = document.createElement("article");
  card.className = "review-card";

  const header = document.createElement("div");
  header.className = "review-header";

  const author = document.createElement("span");
  author.textContent = review.author;

  const rating = document.createElement("strong");
  rating.textContent = formatRating(review.rating);

  const comment = document.createElement("p");
  comment.textContent = review.comment;

  header.append(author, rating);
  card.append(header, comment);

  return card;
}

function renderProfile(profile) {
  setText("#volunteer-name", profile.volunteer.name);
  setText("#volunteer-since", profile.volunteer.since);
  setText("#last-action", profile.volunteer.joined);
  setText("#volunteer-rating", formatRating(profile.volunteer.rating));
  setText("#volunteer-followers", formatFollowers(profile.volunteer.followers));
  setText("#about-text", profile.volunteer.about);
  setText(
    "#about-title",
    `Conheça um pouco mais sobre ${profile.volunteer.name}`
  );
  setText(
    "#reviews-title",
    `Veja o que outros usuários disseram sobre trabalhar com ${profile.volunteer.name}`
  );

  const actionsList = document.querySelector("#actions-list");
  const reviewsList = document.querySelector("#reviews-list");

  if (actionsList) {
    actionsList.replaceChildren(...profile.actions.map(createActionCard));
  }

  if (reviewsList) {
    reviewsList.replaceChildren(...profile.reviews.map(createReviewCard));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProfile(loadProfile());
});
