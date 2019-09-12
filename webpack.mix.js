let mix = require('laravel-mix');

mix.webpackConfig({
    output: {
        library: 'purecounter.js',
        path: path.join(__dirname, 'dist'),
        filename: path.join('[name]', 'purecounter.js'),
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
}).js('js/purecounter_vanilla.js', 'dist/')
    .js('purecounter.js', 'dist/');