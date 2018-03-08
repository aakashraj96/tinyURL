const Models = require('../../models');

async function recursiveCreate(longurl, shorturlHash, start, size) {
  const shorturl = shorturlHash.substr(start, size);
  console.log('shortUrlHash: ', shorturl);
  console.log('start is: ',start);
  console.log('size is: ',size);
  const response = await Models.urls.find({
    where: {
      shorturl,
    },
  });
  if ((response === null)) {
    let result;
    try{
      // console.log('inside the null part');
      result = await Models.urls.create({
        shorturl,
        longurl,
      });
      // console.log('For this shorturl: ',shorturl,' the inserted part is; ',result);
      // console.log('THE INSERTED VALUE IS: ',result.shorturl);

    }catch(e) {
      console.log('the error is: ', e);
    }
    return result.shorturl;

  } else if (response.dataValues.longurl === longurl) {
    return shorturl;
  }
  console.log('***************************');
  console.log('Collision');
  console.log('***************************');
  return recursiveCreate(longurl, shorturlHash, start+1, size);
}

module.exports = recursiveCreate;
