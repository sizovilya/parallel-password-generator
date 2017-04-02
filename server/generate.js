const crypto = require("crypto");

function generate() {
    var waitDateOne = new Date();
    while ((new Date()) - waitDateOne <= 5000) {
        //Nothing
    }
    return crypto.randomBytes(20).toString('hex');
}

module.exports = generate;
