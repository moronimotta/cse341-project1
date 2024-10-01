const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');

const getBankAcc = async (req, res, next) => {
  try {

    const user = req.user;
    const role = user.role || 'user';

    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const id = req.params.id;
    const result = await db.collection(bankCollection).find({ _id: new ObjectId(id) });
    const bkAccs = await result.toArray();

    if (bkAccs[0]._id.toString() !== user._id.toString() && role !== 'admin') {
      res.json(createError(403, 'Forbidden'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(bkAccs[0]);
  } catch (err) {
    res.json(createError(500, err.message));
  }
};

const getBankAccs = async (req, res, next) => {
  try {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const result = await db.collection(bankCollection).find();
    const bkAccs = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(bkAccs);
  } catch (err) {
    res.json(createError(500, err.message));
  }
};

const updateBankAcc = async (req, res, next) => {
  try {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const id = req.params.id;
    const bankAcc = req.body;
    await db.collection(bankCollection).updateOne({ _id: new ObjectId(id) }, { $set: bankAcc });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(bankAcc);
  } catch (err) {
    res.json(createError(500, err.message));
  }
};

const createBankAcc = async (req, res, next) => {
  try {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const bankAcc = req.body;
    await db.collection(bankCollection).insertOne(bankAcc);
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(bankAcc);
  } catch (err) {
    res.json(createError(500, err.message));
  }
};

const deleteBankAcc = async (req, res, next) => {
  try {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const id = req.params.id;
    await db.collection(bankCollection).deleteOne({ _id: new ObjectId(id) });
    res.setHeader('Content-Type', 'application/json');
    res.status(204).json({});
  } catch (err) {
    res.json(createError(500, err.message));
  }
};

module.exports = {
  getBankAcc,
  getBankAccs,
  updateBankAcc,
  createBankAcc,
  deleteBankAcc,
};