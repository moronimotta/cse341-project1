const mongodb = require('../data/database');
const dotenv = require('dotenv');
const createError = require('http-errors');
const { validateUserCreation } = require('../validator')
dotenv.config();

const userCollection = 'users';
const ObjectId = require('mongodb').ObjectId;

const getUser = async (req, res, next) => {
  try {
    const user = req.session.dbUser
 
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const id = req.params.id;
    const result = await db.collection(userCollection).find({ _id: new ObjectId(id) });
    const users = await result.toArray();

    res.setHeader('Content-Type', 'application/json');

    // compare both to see if they are the same user
    if ((users[0]._id.toString() !== user._id.toString() && user.role !== 'admin')) {        
      throw res.json(createError(403, 'Forbidden'));
    }

    res.status(200).json(users[0]);
  } catch (err) {
    throw res.json(createError(500, err.message));
  }
};

// get user by document
const getUserByDocument = async (req, res, next) => {
  try {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const document = req.params.document;
    const result = await db.collection(userCollection).find({ document: document });
    const users = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users[0]);
  } catch (err) {
    throw res.json(createError(500, err.message));
  }
};


const setUserAsAdmin = async (req, res, next) => {
  try {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const id = req.params.id;
    const role = "admin"
    await db.collection(userCollection).updateOne({ _id: new ObjectId(id) }, { $set: { role: role } });

    res.setHeader('Content-Type', 'application/json');
    req.session.dbUser.role = role;
    res.status(204).send();
  } catch (err) {
    throw res.json(createError(500, err.message));
  }
};

const getUserByEmailAndPassword = async (email, password) => {
      // swagger-tags=['Users']
  try {
      const db = mongodb.getDb();
      const user = await db.collection('users').findOne({ email: email, password: password });
      return user;
  } catch (err) {
      throw new Error(err.message);
  }
};



const getUserByGithubId = async (github_id) => {
      // swagger-tags=['Users']
  try {
    const db = mongodb.getDb();
    const user = await db.collection(userCollection).findOne({ github_id: github_id });
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}

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

    const role = req.session.dbUser.role || req.role || 'customer';

    const result = await db.collection(userCollection).find({ _id: new ObjectId(id) });
    const users = await result.toArray();

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if ((users[0]._id.toString() !== req.session.dbUser._id  && role !== 'admin')) {        
      return res.status(403).json({ message: 'Forbidden' });
    }

    await db.collection(userCollection).updateOne({ _id: new ObjectId(id) }, { $set: user });

    res.setHeader('Content-Type', 'application/json');
    return res.status(204).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res, next) => {
  try {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const user = req.body;
    console.log(user);

    if (!user.role) {
      user.role = 'customer';
    }
    
    await db.collection(userCollection).insertOne(user);

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
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
    deleteUser,
    getUserByGithubId,
    getUserByEmailAndPassword,
    setUserAsAdmin,
    getUserByDocument
};