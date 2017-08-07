var express = require('express');
var app = express();
var request = require('request');
var helpers = require ('../server/helpers.js');


var runWorker = function() {
  request('http://127.0.0.1:8888/api/worker', function (error, res, body) {
    if (error) {
      console.log('helper.js error');
    } else {
      if (body !== 'Nothing to dequeue') {
        var sites = JSON.parse(body);

        sites.forEach(function (site) {
          var url = 'http://' + site.url;
          var uniqueId = site.uniqueId;

          helpers.getWebsiteHtml(url, uniqueId, function (data) {
            if (!data) {
              console.log('error in setInterval');
            }
          });
        });
      }
    }
  });
};

setInterval(runWorker, 5000);


app.listen('8000', function() {
  console.log("Listening on port 8000");
});