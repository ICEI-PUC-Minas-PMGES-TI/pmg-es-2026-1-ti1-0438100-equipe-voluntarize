document.addEventListener('DOMContentLoaded', () => {

    const btnSeguir = document.querySelector('.btn-seguir');

    if (btnSeguir) {

        let seguindo = false;

        btnSeguir.addEventListener('click', () => {

            seguindo = !seguindo;

            if (seguindo) {
                btnSeguir.textContent = 'Seguindo';
                btnSeguir.style.backgroundColor = '#28a745';
                btnSeguir.style.color = '#ffffff';
            } else {
                btnSeguir.textContent = 'Seguir';
                btnSeguir.style.backgroundColor = '';
                btnSeguir.style.color = '';
            }

        });
    }

    // =========================================
    // CARROSSEL
    // =========================================
    const carousel = document.querySelector('.actions-carousel');

    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');

    const scrollAmount = 320;

    if (leftArrow && carousel) {

        leftArrow.addEventListener('click', () => {

            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });

        });

    }

    if (rightArrow && carousel) {

        rightArrow.addEventListener('click', () => {

            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });

        });

    }


    const botoesDetalhes = document.querySelectorAll('.btn-ver-detalhes');

    botoesDetalhes.forEach(botao => {

        botao.addEventListener('click', (e) => {

            const card = e.target.closest('.action-card');

            const titulo = card.querySelector('h3').innerText;

            alert(`Abrindo detalhes da ação: ${titulo}`);

        });

    });


    const navLinks = document.querySelectorAll('.main-nav nav a');

    navLinks.forEach(link => {

        link.addEventListener('click', () => {

            navLinks.forEach(l => {
                l.classList.remove('active');
            });

            link.classList.add('active');

        });

    });

});