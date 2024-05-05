import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resousces/css/tailwind.css',
                'resousces/css/bootstrap.css',
            ],
            refresh: true,
        }),
    ],
});
