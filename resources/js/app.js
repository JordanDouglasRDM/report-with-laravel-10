import './bootstrap.js';

import {initializeToast, loading} from './utilities.js';
window.IMask = IMask;

window.initializeToast = initializeToast;
window.loading = loading;

import * as bootstrap from 'bootstrap';

window.bootstrap = bootstrap;

import Alpine from 'alpinejs';
import IMask from "imask";

window.Alpine = Alpine;

Alpine.start();
