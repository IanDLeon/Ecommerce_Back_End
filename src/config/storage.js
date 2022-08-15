const { Storage } = require('@google-cloud/storage');
const path = require('path');
const config = require('./config');

const serviceKey = path.join(__dirname, './service-account.json');

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'trendwire',
});

const bucket = storage.bucket(config.storageBucket);

module.exports = {
  bucket,
};
