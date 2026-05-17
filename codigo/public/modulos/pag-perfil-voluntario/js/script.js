const PROFILE_STORAGE_KEY = "voluntarize_perfil_voluntario";

const defaultProfile = {
  volunteer: {
    name: "Cláudia",
    since: "Voluntária desde Ago. de 2020",
    joined: "Usuária da Voluntarize desde Dez. 2026",
    rating: 4.5,
    followers: 7000,
  },
  actions: [
    {
      title: "Ação do Dia 15",
      rating: 4.8,
      description:
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested...",
    },
    {
      title: "Ação do Dia 15",
      rating: 4.8,
      description:
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested...",
    },
  ],
  reviews: [
    {
      author: "Ong Dia",
      rating: 5,
      comment:
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below...",
    },
    {
      author: "José",
      rating: 4.5,
      comment:
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below...",
    },
    {
      author: "Lucas",
      rating: 4,
      comment:
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below...",
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
    const parsedProfile = JSON.parse(savedProfile);

    return {
      volunteer: {
        ...defaultProfile.volunteer,
        ...parsedProfile.volunteer,
      },
      actions: parsedProfile.actions || defaultProfile.actions,
      reviews: parsedProfile.reviews || defaultProfile.reviews,
    };
  } catch (error) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
}

function formatRating(rating) {
  return Number(rating).toFixed(1).replace(".", ",");
}

function formatFollowers(followers) {
  return followers >= 1000
    ? `${Math.floor(followers / 1000)}K Seguidores`
    : `${followers} Seguidores`;
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function createIcon(src, alt = "", className = "") {
  const icon = document.createElement("img");
  icon.src = src;
  icon.alt = alt;
  icon.className = className;
  return icon;
}

function createRatingBadge(rating, className) {
  const badge = document.createElement("span");
  const value = document.createElement("span");

  badge.className = className;
  value.textContent = formatRating(rating);
  badge.append(value, createIcon("./assets/rating-star.png"));

  return badge;
}

function createActionCard(action) {
  const card = document.createElement("article");
  const media = document.createElement("div");
  const image = createIcon("./assets/historico-acao.png", `Imagem da ${action.title}`);
  const title = document.createElement("h3");
  const description = document.createElement("p");
  const details = document.createElement("a");

  card.className = "action-card";
  media.className = "action-media";
  title.textContent = action.title;
  description.textContent = action.description;
  details.className = "details-button";
  details.href = "#";
  details.textContent = "Ver Detalhes";

  media.append(image, createRatingBadge(action.rating, "action-rating"));
  card.append(media, title, description, details);

  return card;
}

function createReviewCard(review) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const author = document.createElement("span");
  const icon = document.createElement("span");
  const authorName = document.createElement("span");
  const comment = document.createElement("p");

  card.className = "review-card";
  header.className = "review-header";
  author.className = "review-author";
  icon.className = "review-icon";
  authorName.className = "review-author-name";
  authorName.textContent = review.author;
  comment.textContent = review.comment;

  icon.append(
    createIcon("./assets/avaliacoes-user-bg.png", "", "review-icon-bg"),
    createIcon("./assets/avaliacoes-user.png", "", "review-icon-user")
  );
  author.append(icon, authorName);
  header.append(author, createRatingBadge(review.rating, "review-rating"));
  card.append(header, comment);

  return card;
}

function renderProfile(profile) {
  setText("#volunteer-name", profile.volunteer.name);
  setText("#volunteer-since", profile.volunteer.since);
  setText("#last-action", profile.volunteer.joined);
  setText("#volunteer-rating-value", formatRating(profile.volunteer.rating));
  setText("#volunteer-followers-value", formatFollowers(profile.volunteer.followers));
  setText("#about-title", `Conheça um pouco mais sobre ${profile.volunteer.name}`);
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
