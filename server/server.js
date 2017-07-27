var express = require('express');
var app = express();

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
  if (this.totalInQueue > 0) {
    this.totalInQueue--;
    var temp = this.storage[this.currentNumber - this.totalInQueue];
    delete this.storage[this.currentNumber - this.totalInQueue];
    return temp;
  }
  return 'Nothing to dequeue';
};

Queue.prototype.size = function() {
  return this.totalInQueue;
};

var queue = new Queue();

app.get('/api/sites/:url', function(req, res) {
  var url = req.params.url;
  queue.enqueue(url);
  var uniqueId = queue.totalInQueue.toString();
  res.send(uniqueId);
  console.log('This is the current queue :', queue.storage);
});

app.get('/api/jobs:id', function(req, res) {

});

app.get('/api/worker', function(req, res) {
  var value = queue.dequeue();
  console.log('FETCHED VALUE FROM WORKER =>', value);
  res.send(value);
});

app.listen(8888, function () {
  console.log("Listening on port 8888");
});

module.exports = queue;