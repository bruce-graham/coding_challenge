var express = require('express');
var app = express();
var request = require('request');
var axios = require('axios');


setInterval(function() {
  request('http://127.0.0.1:8888/api/worker', function (error, response, body) {

    if (error) {
      console.log('line 11 worker.js error', error);
    } else {
      if (body !== 'Nothing to dequeue') {
        var url = 'http://';
        url = url + body

        axios.get(url)
          .then(function(response) {
            console.log('response.data => ', response.data);
          })
          .catch(function(error) {
            console.log('error on worker.js line 24', error);
          });
      } else {
        console.log("Worker checked queue and nothing was there");
      }
    }
  });
}, 5000);


app.listen('8000', function() {
  console.log("Listening on port 8000");
});