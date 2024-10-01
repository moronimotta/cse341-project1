const mongodb = require('../data/database');
const dotenv = require('dotenv');
const createError = require('http-errors');
dotenv.config();

const userCollection = 'users';
const ObjectId = require('mongodb').ObjectId;

const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    const role = user.role || 'user';

    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const id = req.params.id;
    const result = await db.collection(userCollection).find({ _id: new ObjectId(id) });
    const users = await result.toArray();

    res.setHeader('Content-Type', 'application/json');

    // compare both to see if they are the same user
    if (users[0]._id.toString() !== user._id.toString() && role !== 'admin') {
        throw res.json(createError(403, 'Forbidden'));
    }

    res.status(200).json(users[0]);
  } catch (err) {
    throw res.json(createError(500, err.message));
  }
};

const getUsers = async (req, res, next) => {
  try {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const result = await db.collection(userCollection).find();
    const users = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    throw res.json(createError(500, err.message));
}
};

const updateUser = async (req, res, next) => {
  try {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const id = req.params.id;
    const user = req.body;
    await db.collection(userCollection).updateOne({ _id: new ObjectId(id) }, { $set: user });

    res.setHeader('Content-Type', 'application/json');
    res.status(204).json(user);
  } catch (err) {
    throw res.json(createError(500, err.message));
  }
};

const createUser = async (req, res, next) => {
  try {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const user = req.body;
    await db.collection(userCollection).insertOne(user);

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(user);
  } catch (err) {
    throw res.json(createError(500, err.message));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const id = req.params.id;
    await db.collection(userCollection).deleteOne({ _id: new ObjectId(id) });

    res.setHeader('Content-Type', 'application/json');
    res.status(204).send();
  } catch (err) {
    throw res.json(createError(500, err.message));
  }
};

module.exports = {
    getUser,
    getUsers,
    updateUser,
    createUser,
    deleteUser
};