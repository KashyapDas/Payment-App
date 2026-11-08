const express = require("express");
const jwt  = require("jsonwebtoken");
const { userModel, accountModel } = require("../database/model");
const router = express.Router();

router.post("/show-balance",async (req,res)=>{
    const token = req.headers.authorization;
    const originalToken = token.split(" ")[1];
    // check if the token exist or not
    if(!token && token.split(" ")[0] != "Bearer" && !originalToken){
        return res.json({
            msg : "Something went wrong"
        });
    }
    // extract the userId and check if user exist in the db or not
    const tokenDecoded = jwt.verify(originalToken,process.env.JWT_SECRET);
    if(!tokenDecoded.id){
        return res.json({ msg : "Something went wrong"});
    }
    const result = await userModel.findById({
        _id : tokenDecoded.id 
    });
    // if not exist then
    if(!result) return res.json({ msg : "Something went wrong"});
    // if exist then
    const result2 = await accountModel.find({
        userId : tokenDecoded.id
    }).select("balance");
    // if the bank is down
    if(!result2) return res.json({ msg : "Server is down...Please try again later"});
    
    res.json({
        msg : "Balance fetch successfully",
        result2
    });

})


module.exports = router;