let mix = require('laravel-mix');

mix.js('js/purecounter_vanilla.js', 'dist/')
    .js('purecounter.js', 'dist/');