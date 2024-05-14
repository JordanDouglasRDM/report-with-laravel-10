import './bootstrap.js';
import '~bootstrap/css/bootstrap.min.css';
import '~bootstrap/js/bootstrap.bundle.js';

window.IMask = IMask;

import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

window.initializeToast = initializeToast();
window.loading = loading();

import Alpine from 'alpinejs';
import IMask from "imask";

window.Alpine = Alpine;

Alpine.start();
