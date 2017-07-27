var express = require('express');
var app = express();
var request = require('request');
var axios = require('axios');
var Site = require('../database/database.js');
// var queue = require('../server/server.js');


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
            console.log('We got HTML from the specified url => response.data');

            Site.sync({force: true}).then(function() {
              return Site.create({
                uniqueId: '1',
                url: 'www.google.com',
                html: '<!DOCTYPE html><html><head></head><body></body></html>'
              });
            });

            Site.findAll().then(function(sites) {
              console.log('this is the info in the database ', sites);
            })
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