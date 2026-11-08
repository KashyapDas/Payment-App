const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const { z } = require("zod");

const amtSchema = z.number().nonnegative();

const amountVerification = (req,res,next)=>{
    const {amount} = req.body;
    if(amount === undefined || amount === null){
        return res.json({
            msg : "Something went wrong"
        });
    }
    const {success} = amtSchema.safeParse(amount);
    if(!success){
        return res.json({
            msg : "Something went wrong"
        });
    }
    if(amount < 0 ){
        return res.json({
            msg : "Something went wrong"
        });
    }
    next();
}

module.exports = {
    amountVerification
};