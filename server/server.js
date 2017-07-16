var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello, whats up?')
});

app.listen(8888, function () {
  console.log("Listening on port 8888");
});