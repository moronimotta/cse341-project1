const mongodb = require('../data/database');
const dotenv = require('dotenv');
dotenv.config();


const ObjectId = require('mongodb').ObjectId;

const getSingle = async (req, res) => {
    let db = mongodb.getDb();
    const id = req.params.id;
    const result = await db.collection('contacts').find({ _id: new ObjectId(id) });
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(contacts[0]));
    });
}

const getAll = async (req, res) => {
    let db = mongodb.getDb();
    const result = await db.collection('contacts').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(contacts));
    });
}

module.exports = {
    getSingle,
    getAll
};