const mongodb = require('../data/database');
const dotenv = require('dotenv');
dotenv.config();


const ObjectId = require('mongodb').ObjectId;

const getSingle = async (req, res) => {
    // swagger-tags=['Contacts']
    let db = mongodb.getDb();
    const id = req.params.id;
    const result = await db.collection('contacts').find({ _id: new ObjectId(id) });
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(contacts[0]));
    });
}

const getAll = async (req, res) => {
    // swagger-tags=['Contacts']
    let db = mongodb.getDb();
    const result = await db.collection('contacts').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(contacts));
    });
}

const updateContact = async (req, res) => {
    // swagger-tags=['Contacts']
    let db = mongodb.getDb();
    const id = req.params.id;
    const contact = req.body;
    db.collection('contacts').updateOne({ _id: new ObjectId(id) }, { $set: contact });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(contact));
}

const createContact = async (req, res) => {
    // swagger-tags=['Contacts']
    let db = mongodb.getDb();
    const contact = req.body;
    await db.collection('contacts').insertOne(contact);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(contact));
}

const deleteContact = async (req, res) => {
    // swagger-tags=['Contacts']
    let db = mongodb.getDb();
    const id = req.params.id;
    db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({}));
}

module.exports = {
    getSingle,
    getAll,
    updateContact,
    createContact,
    deleteContact
};