var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send({
    "Output": "Hello awesome guest. Stay tuned, EternalStore is being cooked for you!"
  });
});

app.post('/', function(req, res) {
  res.send({
    "Output": "Hello World!"
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
