var Sequelize = require('sequelize');

var sequelize = new Sequelize('massdrop', 'root', 'javascript', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.authenticate()
  .then(function() {
    console.log('Connection has been established to database.');
  })
  .catch(function(err) {
    console.error('Unable to connect to the database: ', err);
  });

var Site = sequelize.define('sites', {
  uniqueId: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  html: {
    type: Sequelize.TEXT
  }
});


module.exports = Site;