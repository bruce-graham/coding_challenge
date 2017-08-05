var Queue = function() {
  this.storage = {};
  this.currentNumber = 0;
  this.totalInQueue = 0;
  this.tempId = 0;
};

Queue.prototype.enqueue = function(value) {
  this.currentNumber++;
  this.totalInQueue = this.totalInQueue + 1;
  this.storage[this.currentNumber] = {value: value, id: this.tempId};
};

Queue.prototype.dequeue = function() {
  var output = {};

  if (this.totalInQueue > 0) {
    this.totalInQueue--;
    var temp = this.storage[this.currentNumber - this.totalInQueue]['value'];
    delete this.storage[this.currentNumber - this.totalInQueue];
    output.uniqueId = this.tempId;
    output.url = temp;
    return output;
  }

  return 'Nothing to dequeue';
};

Queue.prototype.size = function() {
  return this.totalInQueue;
};

console.log('if statement in queue.js about module.exports =>', module.exports.queue);

if (module.exports.queue === undefined) {
  var queue = new Queue();
}


module.exports = queue;