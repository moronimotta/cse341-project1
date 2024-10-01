const mongodb = require('../data/database');
const dotenv = require('dotenv');
dotenv.config();

const userCollection = 'users';
const ObjectId = require('mongodb').ObjectId;

const getUser = async (req, res, next) => {
    
    const user = req.user;
    const role = user.role || 'user';

    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const id = req.params.id;
    const result = await db.collection(userCollection).find({ _id: new ObjectId(id) });
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');

        // compare both to see if they are the same user
        if (users[0]._id.toString() !== user._id.toString() && role !== 'admin') {
            res.status(401).json({ message: 'You are only authorize to view your information' });
            return;
        }

        res.send(JSON.stringify(users[0]));
    });
}

const getUsers = async (req, res) => {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const result = await db.collection(userCollection).find();
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(users));
    });
}

const updateUser = async (req, res) => {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const id = req.params.id;
    const user = req.body;
    db.collection(userCollection).updateOne({ _id: new ObjectId(id) }, { $set: user });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user));
}

const createUser = async (req, res) => {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const user = req.body;
    await db.collection(userCollection).insertOne(user);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user));
}

const deleteUser = async (req, res) => {
    // swagger-tags=['Users']
    let db = mongodb.getDb();
    const id = req.params.id;
    db.collection(userCollection).deleteOne({ _id: new ObjectId(id) });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({}));
}

module.exports = {
    getUser,
    getUsers,
    updateUser,
    createUser,
    deleteUser
};