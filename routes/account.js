const express = require("express");
const { accountModel, transactionModel } = require("../database/model");
const { tokenVerification } = require("../middlleware/tokenVerification");
const { amountVerification } = require("../middlleware/amountVerification");
const { default: mongoose } = require("mongoose");
const router = express.Router();

// This provide the user their actuall balance
router.post("/show-balance",tokenVerification,async (req,res)=>{
    const tokenId = req.tokenId;
    // get the userId and do search in the account schema
    const result = await accountModel.find({
        userId : tokenId
    }).select("balance");
    // if the bank is down
    if(!result) return res.json({ msg : "Server is down...Please try again later"});
    
    res.json({
        msg : "Balance fetch successfully",
        result
    });

})

// This allow the transcation betweent two person and update their balance
router.post("/money-transaction",tokenVerification,amountVerification,async (req,res)=>{
    // get the token, verify it and then extract the userId
    // make sure the amount should not be neagtive, if then throw error
    // check if that secific user has the money above the amount.
    // commit the transaction when process get completed
    const {toAccount, amount} = req.body;
    const session = await mongoose.startSession();
    // start the Transaction for all the processes
    session.startTransaction();    
    
    const fromAcc = await accountModel.findOne({
        userId : req.tokenId
    }).session(session);
    if(!fromAcc){
        // abort the transaction if error occur
        await session.abortTransaction();
        return res.status(500).json({
            msg : "Something went wrong"
        });
    }
    if(fromAcc.balance < amount){
        await session.abortTransaction();
        return res.status(201).json("Insufficient ammount");
    }

    const toAcc = await accountModel.findOne({
        userId : toAccount
    }).session(session);
    if(!toAcc){
        await session.abortTransaction();
        return res.status(500).json({
            msg : "Something went wrong"
        });
    }
    // do the transfer operation
    await accountModel.updateMany({
      userId : fromAcc.userId  
    },{
        $inc : { balance : -amount}
    }).session(session);

    await accountModel.updateMany({
        userId : toAcc.userId
    },{
        $inc : { balance : amount}
    })
    const moneyHistoriesResult = await transactionModel.create({
        fromAccount : fromAcc.userId,
        toAccount : toAcc.userId,
        balanceTransfer : amount
    })
    if(!moneyHistoriesResult){
        session.abortTransaction();
        return res.status(500).json({ msg : "Something went wrong"});
    }
    // commit the transaction
    session.commitTransaction();
    // save the transaction in the moneyHistories    
    res.status(200).json({
        msg : "Money transfered successfully"
    });
})

// this allow us to view the transaction history of a version
router.post("/transaction-history",(req,res)=>{

})

module.exports = router;