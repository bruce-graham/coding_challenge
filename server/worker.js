var express = require('express');
var app = express();
var request = require('request');
var axios = require('axios');
var Site = require('../database/database.js');


setInterval(function() {
  request('http://127.0.0.1:8888/api/worker', function (error, response, body) {
    if (error) {
      console.log('line 11 in worker.js error', error);
    } else {
      if (body !== 'Nothing to dequeue') {
        var jsonData = JSON.parse(body);
        var website = 'http://' + jsonData.url;

        axios.get(website)
          .then(function(response) {
            return Site.sync()
              .then(function() {
                var url = jsonData.url;
                var uniqueId = jsonData.uniqueId;
                var html = encodeURIComponent(response.data);

                return Site.update({
                    html: html
                  }, {
                    where: {
                      id: uniqueId
                    }
                  });
              });
          })
          .catch(function(error) {
            console.log('Line 35 error in worker.js ', error);

          });
      }
    }
  });
}, 2000);


app.listen('8000', function() {
  console.log("Listening on port 8000");
});