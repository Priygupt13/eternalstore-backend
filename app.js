const dotenv = require("dotenv");
dotenv.config();

var express = require('express');
var app = express();

let current_env = process.env.NODE_ENV || "local";
let db_host = process.env.AWS_DB_HOST || "localhost"l

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello awesome guest. Stay tuned, EternalStore is being cooked for you! We are currently hosted in " 
              + current_env
              + ". And our db is hosted at "
              + db_host
  });
});

app.post('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
