const mongodb = require('../data/database');
const createError = require('http-errors');

const transactionsCollection = 'transactions';

const getAccountTransactions = async (req, res, next) => {
    try {
        // swagger-tags=['Transactions']
        let db = mongodb.getDb();
        const id = req.params.userid;
        const result = await
            db.collection(transactionsCollection).find({ user_id: id });
        const transactions = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(transactions);
    }
    catch (err) {
        res.json(createError(500, err.message));
    }
}

const getTransactions = async (req, res, next) => {
    try {
        // swagger-tags=['Transactions']
        let db = mongodb.getDb();
        const result = await db.collection(transactionsCollection).find();
        const transactions = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(transactions);
    } catch (err) {
        res.json(createError(500, err.message));
    }

}

const createTransaction = async ( value, bank_account_id, user_id, description) => {
    try {
        // swagger-tags=['Transactions']
        let db = mongodb.getDb();
        let transaction = {
            value: value,
            account_id: bank_account_id,
            user_id: user_id,
            date : new Date(),
            description :  description
        };
        const result = await db.collection(transactionsCollection).insertOne(transaction);
        if (result.insertedCount === 0) {
            throw new Error('Could not create transaction');
        }
        return true
    }
    catch (err) {
        return false;
    }

}



module.exports = {
    getAccountTransactions,
    getTransactions,
    createTransaction
};