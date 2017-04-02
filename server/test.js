const assert = require('assert');
const generate = require('./generate');


  describe('#generate', function() {

    it('result returned', function() {
      var pass = generate();
      assert.equal(40, pass.length);
    });

    it('password length should be 40 characters', function() {
      var pass = generate();
      assert.equal(40, pass.length);
    });

  });
