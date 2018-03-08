const Server = require('../../src/server');
const getHash = require('../../src/helpers/getHash');
const Models = require('../../models');
const redis = require("redis");

const  client = redis.createClient();
describe('Test server for route /read: ', () => {
  beforeAll(() => {
    Models.urls.create({
      shorturl: 'random',
      longurl: 'http://www.thisisnotcorrect.com',
    });
  });
  afterAll(() => {
    Models.urls.destroy({
      where: {
        longurl: 'http://www.thisisnotcorrect.com',
      },
    });
  });
  test('Should return the statusCode 200 for an existing url: ', (done) => {
    const options = {
      url: '/read/random',
      method: 'GET',
    };

    Server.inject(options, (response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  test('Should return a longurl ', (done) => {
    const options = {
      url: '/read/random',
      method: 'GET',
    };

    Server.inject(options, (response) => {
      console.log(response.payload);
      expect(JSON.parse(response.payload).longurl).toBe('http://www.thisisnotcorrect.com');
      done();
    });
  });
  test('The redis db should return the longurl for given shorturl key ', (done) => {
    const options = {
      url: '/read/random',
      method: 'GET',
    };

    Server.inject(options, (response) => {
      client.get('random', function(err,data) {
        expect(data).toBe('http://www.thisisnotcorrect.com');
        done();
      })

    });
  });
});
