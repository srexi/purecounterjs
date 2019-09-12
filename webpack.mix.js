let mix = require('laravel-mix');

mix.js('js/purecounter.js', 'dist/')
    .js('js/purecounter_vanilla.js', 'dist/')
    .js('app.js', 'asset/');