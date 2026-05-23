const PROFILE_STORAGE_KEY = "voluntarize_perfil_voluntario";
const CAROUSEL_MOBILE_QUERY = "(max-width: 820px)";

let currentProfile = null;
let currentActionIndex = 0;
let actionCardsPerView = getActionCardsPerView();

const defaultProfile = {
  volunteer: {
    name: "Cl\u00e1udia",
    since: "Volunt\u00e1ria desde Ago. de 2020",
    joined: "Usu\u00e1ria da Voluntarize desde Dez. 2026",
    rating: 4.5,
    followers: 7000,
    following: true,
  },
  actions: [
    {
      title: "A\u00e7\u00e3o do Dia 15",
      rating: 4.8,
      description:
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested...",
    },
    {
      title: "A\u00e7\u00e3o do Dia 15",
      rating: 4.8,
      description:
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested...",
    },
    {
      title: "A\u00e7\u00e3o do Dia 22",
      rating: 4.9,
      description:
        "Organiza\u00e7\u00e3o de kits de apoio e acolhimento para fam\u00edlias da comunidade...",
    },
    {
      title: "A\u00e7\u00e3o do Dia 30",
      rating: 4.7,
      description:
        "Apoio no registro de participantes e distribui\u00e7\u00e3o dos materiais da a\u00e7\u00e3o...",
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
      author: "Jos\u00e9",
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

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function mergeProfileList(savedList, defaultList) {
  if (!Array.isArray(savedList) || savedList.length === 0) {
    return cloneData(defaultList);
  }

  if (savedList.length >= defaultList.length) {
    return savedList;
  }

  return [...savedList, ...cloneData(defaultList.slice(savedList.length))];
}

function normalizeProfile(profile = {}) {
  const volunteer = {
    ...defaultProfile.volunteer,
    ...(profile.volunteer || {}),
  };

  volunteer.following =
    typeof volunteer.following === "boolean"
      ? volunteer.following
      : defaultProfile.volunteer.following;

  return {
    volunteer,
    actions: mergeProfileList(profile.actions, defaultProfile.actions),
    reviews: mergeProfileList(profile.reviews, defaultProfile.reviews),
  };
}

function loadProfile() {
  const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!savedProfile) {
    const profile = normalizeProfile(defaultProfile);
    saveProfile(profile);
    return profile;
  }

  try {
    const profile = normalizeProfile(JSON.parse(savedProfile));
    saveProfile(profile);
    return profile;
  } catch (error) {
    const profile = normalizeProfile(defaultProfile);
    saveProfile(profile);
    return profile;
  }
}

function getActionCardsPerView() {
  return window.matchMedia(CAROUSEL_MOBILE_QUERY).matches ? 1 : 2;
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

function createReviewProfileLink(review) {
  const author = document.createElement("a");
  const icon = document.createElement("span");
  const authorName = document.createElement("span");

  author.className = "review-author";
  author.href = "#";
  author.setAttribute("aria-label", `Abrir perfil de ${review.author}`);
  icon.className = "review-icon";
  authorName.className = "review-author-name";
  authorName.textContent = review.author;

  icon.append(
    createIcon("./assets/avaliacoes-user-bg.png", "", "review-icon-bg"),
    createIcon("./assets/avaliacoes-user.png", "", "review-icon-user")
  );
  author.append(icon, authorName);
  author.addEventListener("click", (event) => event.preventDefault());

  return author;
}

function createReviewCard(review) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const comment = document.createElement("p");

  card.className = "review-card";
  header.className = "review-header";
  comment.textContent = review.comment;

  header.append(createReviewProfileLink(review), createRatingBadge(review.rating, "review-rating"));
  card.append(header, comment);

  return card;
}

function getVisibleActions(actions) {
  if (actions.length <= actionCardsPerView) {
    return actions;
  }

  return Array.from({ length: actionCardsPerView }, (_, index) => {
    return actions[(currentActionIndex + index) % actions.length];
  });
}

function renderActionCarousel(actions = currentProfile.actions) {
  const actionsList = document.querySelector("#actions-list");

  if (!actionsList) {
    return;
  }

  actionsList.replaceChildren(...getVisibleActions(actions).map(createActionCard));
}

function moveActionCarousel(direction) {
  const actions = currentProfile.actions;

  if (!actions.length) {
    return;
  }

  currentActionIndex =
    (currentActionIndex + direction * actionCardsPerView + actions.length) % actions.length;
  renderActionCarousel(actions);
}

function handleCarouselResize() {
  const nextActionCardsPerView = getActionCardsPerView();

  if (nextActionCardsPerView === actionCardsPerView) {
    return;
  }

  actionCardsPerView = nextActionCardsPerView;
  if (!currentProfile.actions.length) {
    renderActionCarousel(currentProfile.actions);
    return;
  }

  currentActionIndex = currentActionIndex % currentProfile.actions.length;
  renderActionCarousel(currentProfile.actions);
}

function setupActionCarousel() {
  const controls = document.querySelectorAll(".actions-panel .carousel-control");
  const previousControl = controls[0];
  const nextControl = controls[1];

  if (previousControl) {
    previousControl.addEventListener("click", (event) => {
      event.preventDefault();
      moveActionCarousel(-1);
    });
  }

  if (nextControl) {
    nextControl.addEventListener("click", (event) => {
      event.preventDefault();
      moveActionCarousel(1);
    });
  }

  window.addEventListener("resize", handleCarouselResize);
}

function renderFollowButton(profile) {
  const followButton = document.querySelector(".follow-button");

  if (!followButton) {
    return;
  }

  followButton.textContent = profile.volunteer.following ? "Seguindo" : "Seguir";
  followButton.setAttribute("aria-pressed", String(profile.volunteer.following));
}

function setupFollowButton() {
  const followButton = document.querySelector(".follow-button");

  if (!followButton) {
    return;
  }

  followButton.addEventListener("click", (event) => {
    event.preventDefault();
    currentProfile.volunteer.following = !currentProfile.volunteer.following;
    saveProfile(currentProfile);
    renderFollowButton(currentProfile);
  });
}

function renderProfile(profile) {
  setText("#volunteer-name", profile.volunteer.name);
  setText("#volunteer-since", profile.volunteer.since);
  setText("#last-action", profile.volunteer.joined);
  setText("#volunteer-rating-value", formatRating(profile.volunteer.rating));
  setText("#volunteer-followers-value", formatFollowers(profile.volunteer.followers));
  setText("#about-title", `Conhe\u00e7a um pouco mais sobre ${profile.volunteer.name}`);
  setText(
    "#reviews-title",
    `Veja o que outros usu\u00e1rios disseram sobre trabalhar com ${profile.volunteer.name}`
  );

  const reviewsList = document.querySelector("#reviews-list");

  renderFollowButton(profile);
  renderActionCarousel(profile.actions);

  if (reviewsList) {
    reviewsList.replaceChildren(...profile.reviews.map(createReviewCard));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  currentProfile = loadProfile();
  renderProfile(currentProfile);
  setupActionCarousel();
  setupFollowButton();
});
