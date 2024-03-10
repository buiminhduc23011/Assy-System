'use strict'

console.log("Start Server IOT");
require('dotenv').config();
require('./config/logging.js');
require('./helpers/helper.js');
require('./services/router.js');
require('./queue/queue.js');