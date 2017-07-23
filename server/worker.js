var express = require('express');
var app = express();
var request = require('request');
var http = require('http');

var options = {
  host: "",
  port: 80,
  path: '/index.html'
};

setInterval(function() {
  request('http://127.0.0.1:8888/worker', function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log("it connected", body);
      if (body !== 'Nothing to dequeue') {
        options.host = body;

        http.get(options, function(response) {
          console.log(response.body);
        }).on('error', function (errror) {
          console.log(error);
        });
      }
    }
  })

  }, 10000
);

app.listen('8000', function() {
  console.log("Listening on port 8000");
});