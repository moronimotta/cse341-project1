const mongodb = require('../data/database');
const dotenv = require('dotenv');
dotenv.config();


const ObjectId = require('mongodb').ObjectId;

const getSingle = async (req, res) => {
    let db = mongodb.getDb();
    const id = req.params.id;
    const result = await db.collection('users').find({ _id: new ObjectId(id) });
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(users[0]));
    });
}

const getAll = async (req, res) => {
    let db = mongodb.getDb();
    const result = await db.collection('users').find();
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(users));
    });
}

module.exports = {
    getSingle,
    getAll
};