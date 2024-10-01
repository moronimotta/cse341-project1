const mongodb = require('../data/database');
const dotenv = require('dotenv');
dotenv.config();

const bankCollection = 'bank_accounts';
const ObjectId = require('mongodb').ObjectId;

const getBankAcc = async (req, res) => {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const id = req.params.id;
    const result = await db.collection(bankCollection).find({ _id: new ObjectId(id) });
    result.toArray().then((bkAccs) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(bkAccs[0]));
    });
}

const getBankAccs = async (req, res) => {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const result = await db.collection(bankCollection).find();
    result.toArray().then((bkAccs) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(bkAccs));
    });
}

const updateBankAcc = async (req, res) => {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const id = req.params.id;
    const bankAcc = req.body;
    db.collection(bankCollection).updateOne({ _id: new ObjectId(id) }, { $set: bankAcc });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(bankAcc));
}

const createBankAcc = async (req, res) => {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const bankAcc = req.body;
    await db.collection(bankCollection).insertOne(bankAcc);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(bankAcc));
}

const deleteBankAcc = async (req, res) => {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const id = req.params.id;
    db.collection(bankCollection).deleteOne({ _id: new ObjectId(id) });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({}));
}

module.exports = {
    getBankAcc,
    getBankAccs,
    updateBankAcc,
    createBankAcc,
    deleteBankAcc
};