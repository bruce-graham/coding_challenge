var express = require('express');
var app = express();
var Site = require('../database/database.js');
var queue = require('../server/queue.js');

app.get('/api/sites/:url', function(req, res) {
  var websiteUrl = req.params.url;

  return Site.sync().then(function() {
    return Site.create({
      url: websiteUrl,
      html: undefined
    });
  })
  .then(function (data) {
    console.log('first console of queue in server.js', queue);

    var uniqueId = data.dataValues.id.toString();
    queue.tempId = uniqueId;
    queue.enqueue(websiteUrl);

    console.log('second console of queue in server.js', queue);

    res.send(uniqueId);
  });
});

app.get('/api/worker', function(req, res) {
  var value = queue.dequeue();
  console.log('server.js /api/worker  value =>', value);
  res.send(value);
});

app.get('/api/jobs/:id', function(req, res) {
  var uniqueId = req.params.id;

  Site.findOne({where:{id: queue.uniqueId}})
    .then(function(data) {
      var output = {}
      output.id = queue.uniqueId;

      if (data === null) {
        res.send('Not a valid ID, please submit another ID.');
      } else if (data.html === null) {
        output.url = data.url;
        output.html = 'Unable to retreive HTML for this website, our apologies.';
        res.send(output);
      } else {
        output.url = data.url;
        output.html = decodeURIComponent(data.html);
        res.send(output);
      }
    });
});

app.listen(8888, function () {
  console.log("Listening on port 8888");
});