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

app.get('/sites/:url', function(req, res) {
  var url = req.params.url;
  queue.enqueue(url);
  //eventually need to send back a uniqueId
  res.send(queue);
});

app.get('/worker', function(req, res) {
  var value = queue.dequeue();
  console.log('FETCHED VALUE FROM WORKER =>', value);
  res.send(value);
});

app.listen(8888, function () {
  console.log("Listening on port 8888");
});