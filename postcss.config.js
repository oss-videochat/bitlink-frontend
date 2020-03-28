const TailWindCss = require('tailwindcss');

module.exports = {
    plugins: [
        TailWindCss('./tailwind.js'),
        require('autoprefixer')
    ],
};