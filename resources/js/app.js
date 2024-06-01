import './bootstrap.js';
import '~bootstrap/css/bootstrap.min.css';

window.IMask = IMask;

import * as bootstrap from 'bootstrap';

window.bootstrap = bootstrap;

import Alpine from 'alpinejs';
import IMask from "imask";

window.Alpine = Alpine;

Alpine.start();


//handle theme
alterTheme();
function alterTheme() {
    const switchTheme = document.querySelector(".selector-theme-toggle-button");

    // Carregar o tema salvo do Local Storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
        switchTheme.checked = (savedTheme === 'dark');
    }

    switchTheme.addEventListener('change', (e) => {
        if (switchTheme.checked) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    });

    function applyTheme(theme) {
        const body = document.querySelector('body');
        const html = document.documentElement;
        const imgClear = document.getElementById('img-clear-filters');
        if (imgClear) {
            imgClear.src = `/assets/img/broom-${theme}.png`;
            const anchorElement = imgClear.closest('a');
            if (theme === 'dark') {
                anchorElement.classList.remove('btn-outline-info');
                anchorElement.classList.add('btn-outline-secondary');
            } else {
                anchorElement.classList.remove('btn-outline-secondary');
                anchorElement.classList.add('btn-outline-info');
            }
        }

        // Ajuste do tema para Bootstrap
        body.setAttribute('data-bs-theme', theme);

        // Ajuste do tema para Tailwind CSS
        if (theme === 'dark') {
            html.classList.add('tw-dark');
        } else {
            html.classList.remove('tw-dark');
        }
        // Salvar o tema no Local Storage
        localStorage.setItem('theme', theme);
    }
}
