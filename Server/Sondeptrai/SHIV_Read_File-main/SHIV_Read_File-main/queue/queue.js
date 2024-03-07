'use strict'

const getData     = require('./get-data.js');
const setTimeMove = require('./set.timeout.move.machine.production');

(async() => {
    await getData.run();
    
})();

