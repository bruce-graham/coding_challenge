var express = require('express');
var app = express();
var request = require('request');
var http = require('http');
var util = require('util');

var options = {
  host: '',
  port: 80,
  path: '/index.html'
};

setInterval(function() {
  request('http://127.0.0.1:8888/worker', function (error, response, body) {
    if (error) {
      console.log('line 14 worker.js error', error);
    } else {
      if (body !== 'Nothing to dequeue') {
        options.host = body;

        var content = '';

        var request = http.request(options, function(response) {
            response.setEncoding("utf8");
            response.on('data', function (chunk) {
              content += chunk;
            });

            response.on('end', function () {
              util.log('this is content :', content);
            });

            response.on('error', function (error) {
              console.log(error);
            });
        });

        request.end();
      } else {
        console.log("Worker checked queue and nothing was there");
      }
    }
  });
}, 5000);

app.listen('8000', function() {
  console.log("Listening on port 8000");
});