// require PureCounter from './js/purecounter.js';
// Store it as consant
const PureCounter = require('./js/purecounter').default;

// Set module Export to PureCounter class, so it can be initialize as class
module.exports = PureCounter;