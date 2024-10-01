const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
let _db;

const initDb = (callback) => {
  if (_db) {
    return callback(null, _db);
  }

  MongoClient.connect(uri)
    .then((client) => {
      _db = client.db(dbName);
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw new Error('DB not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};