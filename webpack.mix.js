const mix = require('laravel-mix');
const fs = require('fs');

mix.options({
    terser: {
        extractComments: false,// Any other value will make the license header be removed
    },
});

mix.webpackConfig(webpack => {
    const package = JSON.parse(fs.readFileSync(__dirname + '/package.json'));

    return {
        output: {
            library: {
                name: 'PureCounter',
                type: 'umd',
            }
        },
        plugins: [
            new webpack.BannerPlugin({
                banner: [
                    'purecounter.js - A simple yet configurable native javascript counter which you can count on.',
                    'Author: Stig Rex',
                    'Version: ' + package.version,
                    'Url: https://github.com/srexi/purecounterjs',
                    'License: MIT',
                ].join("\n"),
            }),
        ]
    };
});

mix
    .js('js/purecounter_vanilla.js', 'dist/')
    .js('purecounter.js', 'dist/')
    .sourceMaps(true);// Enable source maps for better audits