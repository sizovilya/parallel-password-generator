const crypto = require("crypto");

var waitDateOne = new Date();
while ((new Date()) - waitDateOne <= 5000) {
    //Nothing
}

process.send(crypto.randomBytes(20).toString('hex'))
process.disconnect();
