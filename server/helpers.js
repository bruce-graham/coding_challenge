var axios = require('axios');
var queue = require('../server/queue.js');
var Site = require('../database/database.js');


exports.createDatabaseEntry = function (url, callback) {
  return Site.sync().then(function() {
    return Site.create({
      url: url,
      html: undefined
    });
  })
  .then(function (data) {
    if (!data) {
      callback('data not found')
    } else {
      queue.queue.uniqueId = data.dataValues.id.toString();
      queue.queue.enqueue(url);
      callback(queue.queue.uniqueId);
    }
  })
  .catch(function(error) {
    callback(error);
  });
};

exports.updateDatabase = function(response, callback) {
  return Site.sync()
    .then(function() {
      var html = encodeURIComponent(response.data);

      return Site.update({
          html: html
        }, {
          where: {
            id: queue.queue.uniqueId
          }
        });
    })
    .catch(function(error) {
      console.log('.catch() error 1', error);
      callback(error);
    });
};

exports.getWebsiteHtml = function (url, uniqueId, callback) {
  axios.get(url)
    .then(function(response) {
      exports.updateDatabase(response, callback);
    })
    .catch(function(error) {
      console.log('.catch() error 2', error);
      callback(error);
    });
};

exports.removeFromQueue = function (callback) {
  var value = queue.queue.dequeueAll();
  callback(value);
};

exports.findOneInDatabase = function (uniqueId, callback) {
  Site.findOne({where:{id: uniqueId}})
    .then(function(data) {
      var createdAt = data.dataValues.createdAt.toString();
      var updatedAt = data.dataValues.updatedAt.toString();
      var html = data.dataValues.html;
      var output = {}
      output.id = uniqueId;
      output.url = data.dataValues.url;

      if ((createdAt != updatedAt) && html === null) {
        output.html = 'Unable to retreive HTML for this website, our apologies.';
        callback(output);
      } else if ((createdAt === updatedAt) && html === null) {
        output.html = 'Server has not yet fetched the HTML associated with this ID, please try back later';
        callback(output);
      } else {
        output.html = decodeURIComponent(html);
        callback(output);
      }
    })
    .catch(function(error) {
      callback('Not a valid ID, please submit another ID.');
    });
};

exports.isUrl = function (str, callback) {
  var urlStr = str;
  var wwwTest = urlStr.substring(0, 5);
  var httpsTest = urlStr.substring(0, 7);
  var httpTest = urlStr.substring(0, 6);

  console.log('before ifs', urlStr);

  if (wwwTest !== 'www.') {
    if (httpsTest !== 'https://') {
      if (httpTest !== 'http://') {
        urlStr = 'www.' + str;
      }
    }
  }

  console.log('after ifs', urlStr);

  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  console.log('regex in helper.js => ', pattern.test(urlStr))

  return pattern.test(urlStr);
};