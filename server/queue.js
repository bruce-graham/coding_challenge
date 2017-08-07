var Queue = function () {
  var instance = {};

  instance.storage = {};
  instance.totalInQueue = 0;
  instance.currentNumber = 0;
  instance.uniqueId = 0;

  instance.enqueue = function(value) {
    instance.currentNumber++;
    instance.totalInQueue++;
    instance.storage[instance.currentNumber] = {value: value, id: instance.uniqueId};
  };

  instance.dequeueAll = function() {
    var websites = [];

    if (instance.size() > 0) {
      while (instance.size() > 0) {
        var site = {};
        instance.totalInQueue--;
        var temp = instance.storage[instance.currentNumber - instance.totalInQueue];
        delete instance.storage[instance.currentNumber - instance.totalInQueue];
        site.uniqueId = temp.id;
        site.url = temp.value;
        websites.push(site);
      }
      return websites;
    } else {
      return 'Nothing to dequeue';
    }
  };

  instance.size = function() {
    return instance.totalInQueue;
  };

  return instance;
};

exports.queue = Queue();