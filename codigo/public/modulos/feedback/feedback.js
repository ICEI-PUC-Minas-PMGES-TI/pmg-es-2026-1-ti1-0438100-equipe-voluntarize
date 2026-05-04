const STAR_FILLED = "star-solid-full.svg";
const STAR_EMPTY  = "star-regular-full.svg";

let rating = 0;
const stars = document.querySelectorAll(".star-btn");

function paint(value) {
  stars.forEach((btn) => {
    const v = Number(btn.dataset.value);
    const img = btn.querySelector("img");
    img.src = v <= value ? STAR_FILLED : STAR_EMPTY;
  });
}

stars.forEach((btn) => {
  const value = Number(btn.dataset.value);

  btn.addEventListener("click", () => {
    rating = value;
    paint(rating);
  });

  btn.addEventListener("mouseenter", () => paint(value));
  btn.addEventListener("mouseleave", () => paint(rating));
});

document.getElementById("btnConcluir").addEventListener("click", () => {
  if (rating === 0) {
    alert("Por favor, selecione uma avaliação em estrelas antes de concluir.");
    return;
  }
  const comentario = document.getElementById("comentario").value.trim();
  console.log("Avaliação enviada:", { estrelas: rating, comentario });
  alert(`Avaliação enviada com sucesso! ⭐ ${rating}/5`);
});
