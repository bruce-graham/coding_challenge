var express = require('express');
var app = express();
var request = require('request');
var axios = require('axios');
var Site = require('../database/database.js');


setInterval(function() {
  request('http://127.0.0.1:8888/api/worker', function (error, response, body) {
    if (error) {
      console.log('line 11 worker.js error', error);
    } else {
      if (body !== 'Nothing to dequeue') {
        var bodyObj = JSON.parse(body);
        var website = 'http://';
        website += bodyObj.url;

        axios.get(website)
          .then(function(response) {
            Site.sync({force: true}).then(function() {
              var uniqueId = bodyObj.uniqueId;
              var url = bodyObj.url
              var html = response.data;

              console.log('site.create =>', uniqueId, url, html);

              return Site.create({
                uniqueId: uniqueId,
                url: url,
                html: html
              });
            });
          })
          .catch(function(error) {
            console.log('error on worker.js ', error);
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