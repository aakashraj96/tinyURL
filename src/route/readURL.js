const Models = require('../../models');
const redis = require("redis");

const  client = redis.createClient();
  const handler = (request, reply) => {

  client.get(request.params.shorturl, function(err, data) {

    if(err)
    {
      console.log(err);
    }
    if(data){
      reply({
        longurl: data
      });
      console.log('from redis');
    }
    else{
      Models.urls.find({
        where: {
          shorturl: request.params.shorturl,
        },
        attributes: ['longurl'],
      }).then((url) => {
        if (url !== null) {
          client.set(request.params.shorturl,url.dataValues.longurl,redis.print);
          reply(url);
        } else {
          reply('Invalid URL!');
        }
      });
    }
  });

};


module.exports = {
  path: '/read/{shorturl}',
  method: 'GET',
  handler,
};
