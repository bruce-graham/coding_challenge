var express = require('express');
var app = express();
var Site = require('../database/database.js');
var tempId = 0;

var Queue = function() {
  this.storage = {};
  this.currentNumber = 0;
  this.totalInQueue = 0;
};

Queue.prototype.enqueue = function(value) {
  this.currentNumber++;
  this.totalInQueue++;
  this.storage[this.currentNumber] = {value: value, id: tempId};
};

Queue.prototype.dequeue = function() {
  var output = {};

  if (this.totalInQueue > 0) {
    this.totalInQueue--;
    var temp = this.storage[this.currentNumber - this.totalInQueue]['value'];
    delete this.storage[this.currentNumber - this.totalInQueue];
    output.uniqueId = tempId;
    output.url = temp;
    return output;
  }
  return 'Nothing to dequeue';
};

Queue.prototype.size = function() {
  return this.totalInQueue;
};

var queue = new Queue();

app.get('/api/sites/:url', function(req, res) {
  var websiteUrl = req.params.url;

  return Site.sync().then(function() {
    return Site.create({
      url: websiteUrl,
      html: undefined
    });
  })
  .then(function (data) {
    var uniqueId = data.dataValues.id.toString();
    tempId = uniqueId;
    queue.enqueue(websiteUrl);
    res.send(uniqueId);
  })
});

app.get('/api/worker', function(req, res) {
  var value = queue.dequeue();
  res.send(value);
});

app.get('/api/jobs/:id', function(req, res) {
  var uniqueId = req.params.id;

  Site.findOne({where:{id: uniqueId}})
    .then(function(data) {
      var output = {}
      output.id = uniqueId;

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
    })
});


app.listen(8888, function () {
  console.log("Listening on port 8888");
});