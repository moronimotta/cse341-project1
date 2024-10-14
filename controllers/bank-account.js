const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const usersController = require('./users');
const transactionsController = require('./transactions');

const bankCollection = 'bank_accounts';
const getBankAcc = async (req, res, next) => {
  try {
    const user = req.session.dbUser;

    let db = mongodb.getDb();
    const id = req.params.id;
    const result = await db.collection(bankCollection).find({ _id: new ObjectId(id) });
    const bkAccs = await result.toArray();


    if (bkAccs[0]._id.toString() !== user._id && user.role !== 'admin') {
      return res.status(403).json(createError(403, 'Forbidden'));
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(bkAccs[0]);
  } catch (err) {
    return res.status(500).json(createError(500, err.message));
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

    if(bankAcc.balance !== undefined && req.session.dbUser.role !== 'admin') {
      return res.status(400).json(createError(400, 'Balance cannot be updated'));
    }

    const userBkAcc = req.session.dbUser._id;
    if (userBkAcc !== bankAcc.user_id && req.session.dbUser.role !== 'admin') {
      res.json(createError(403, 'Forbidden'));
    }

    await db.collection(bankCollection).updateOne({ _id: new ObjectId(id) }, { $set: bankAcc });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(bankAcc);
  } catch (err) {
    res.json(createError(500, err.message));
  }
};

const transferMoney = async (req, res, next) => {
  try {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();

    const { sourceid, destid } = req.params;
    const { amount } = req.body;

    const sourceBankAcc = await db.collection(bankCollection).findOne({ _id: new ObjectId(sourceid) });
    if (!sourceBankAcc) {
      return res.status(404).json(createError(404, 'Source Bank Account not found'));
    }

    if (sourceBankAcc.balance < amount) {
      return res.status(400).json(createError(400, 'Insufficient funds'));
    }

    const destBankAcc = await db.collection(bankCollection).findOne({ _id: new ObjectId(destid) });
    if (!destBankAcc) {
      return res.status(404).json(createError(404, 'Destination Bank Account not found'));
    }

    sourceBankAcc.balance -= amount;
    destBankAcc.balance += amount;

    await db.collection(bankCollection).updateOne(
      { _id: new ObjectId(sourceid) },
      { $set: { balance: sourceBankAcc.balance } }
    );

    let ok = await transactionsController.createTransaction(-amount, sourceid, sourceBankAcc.user_id, "Transfer to " + destBankAcc._id);
    if (!ok) {
      return res.status(500).json(createError(500, 'Could not create transaction for source account'));
    }

    await db.collection(bankCollection).updateOne(
      { _id: new ObjectId(destid) },
      { $set: { balance: destBankAcc.balance } }
    );

    ok = await transactionsController.createTransaction(amount, destid, destBankAcc.user_id, "Recieved from " + sourceBankAcc._id);
    if (!ok) {
      return res.status(500).json(createError(500, 'Could not create transaction for destination account'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ sourceBankAcc, destBankAcc });
  } catch (err) {
    res.status(500).json(createError(500, err.message));
  }
};



const createBankAcc = async (req, res, next) => {
  try {
    // swagger-tags=['Bank Accounts']
    let db = mongodb.getDb();
    const bankAcc = req.body;
    let id = req.session.dbUser._id;

    if (bankAcc.user_id !== undefined) {
      if (req.session.dbUser.role !== 'admin' && req.session.dbUser._id !== bankAcc.user_id) {
        res.json(createError(403, 'Forbidden'));

      } else {
        id = bankAcc.user_id;
      }
    }

    bankAcc.balance = 500;
    bankAcc.user_id = id;

    // create query to get user by id
    const result = await db.collection('users').find({ _id: new ObjectId(id) });
    const user = await result.toArray();

    if (!user[0] === undefined) {
      res.json(createError(404, 'User not found'));
    }

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
  transferMoney
};