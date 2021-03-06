const urlPair = require('../src/helpers/getUrls');
const Models = require('../models');
var redis = require("redis");
    client = redis.createClient({
      host:'18.219.220.22'
    });
module.exports = {
  up: (queryInterface, Sequelize) => {
    client.set("string key", "string val", redis.print);
    urlPair.forEach((url) => {
      client.set(url.shorturl,url.longurl);
    });
    return queryInterface.bulkInsert('urls', urlPair, {});

  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('urls'),
};
