const child_process = require('child_process')
const express = require('express')
const bodyParser = require('body-parser')
const isRunning = require('is-running')

let app = express();

/* for webpack dev server */
app.use(function(req, res, next) {
    var origin = 'http://localhost:8080';
    res.header('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

/* route for passwords generating */
app.post('/generate', function(req, res, next) {
    const pwdCount = req.body.pwdCount;
    let threads = [];
    let passwords = [];
    let done = 0;

    for (let i = 0; i < pwdCount; i++) {
        let child = child_process.fork('./generator');
        threads.push(child.pid);
        child.on('message', function(message) {
            passwords.push(message);
            ++done;

            if (done === pwdCount) {
                res.json({passwords: passwords});
            }
        })
    }

    req.connection.on('close', function() {
        threads.forEach((pid) => {
            if (isRunning(pid))
                process.kill(pid, 0);
            }
        );
    });

});

//middleware for all errors handling
app.use(function(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.json({error: err});
});

app.listen(3000);
console.log('API работает на http://localhost:3000/');
