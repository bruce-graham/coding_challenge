var express = require('express');
var app = express();
var helpers = require ('../server/helpers.js');


app.get('/api/sites/:url', function(req, res) {
  var url = req.params.url;

  helpers.createDatabaseEntry(url, function(created) {
    if (created) {
      res.send(created);
    } else {
      res.send('url not added to database');
    }
  });
});

app.get('/api/worker', function(req, res) {

  helpers.removeFromQueue(function (removed) {
    if (removed) {
      res.send(removed);
    } else {
      res.send('url was dequeued');
    }
  });
});

app.get('/api/jobs/:id', function(req, res) {
  var uniqueId = req.params.id;

  helpers.findOneInDatabase(uniqueId, function (found) {
    if (found) {
      res.send(found);
    } else {
      res.send('Unable to find data associated with this ID');
    }
  });
});

app.listen(8888, function () {
  console.log("Listening on port 8888");
});