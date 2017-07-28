var express = require('express');
var app = express();
var Site = require('../database/database.js');

var Queue = function() {
  this.storage = {};
  this.currentNumber = 0;
  this.totalInQueue = 0;
};

Queue.prototype.enqueue = function(value) {
  this.currentNumber++;
  this.totalInQueue++;
  this.storage[this.currentNumber] = value;
};

Queue.prototype.dequeue = function() {
  var output = {};

  if (this.totalInQueue > 0) {
    this.totalInQueue--;
    var temp = this.storage[this.currentNumber - this.totalInQueue];
    delete this.storage[this.currentNumber - this.totalInQueue];
    output.uniqueId = this.currentNumber;
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
  queue.enqueue(req.params.url);
  var uniqueId = queue.currentNumber.toString();
  res.send(uniqueId);
});

app.get('/api/worker', function(req, res) {
  var value = queue.dequeue();
  console.log('FETCHED VALUE FROM WORKER =>', value);
  res.send(value);
});

app.get('/api/jobs/:id', function(req, res) {
  var id = req.params.id;

  Site.find({where:{uniqueId: id}})
    .complete(function(err, data) {
      if (err) {
        console.log('Site.find error', err);
        res.send(err);
      } else {
        res.send(data);
      }
    })
});


app.listen(8888, function () {
  console.log("Listening on port 8888");
});