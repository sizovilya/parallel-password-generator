const generate = require('./generate')

process.send(generate());
process.disconnect();
