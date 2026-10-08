const express = require("express");
const jwt = require("jsonwebtoken");
const signupMiddleware = require("../middlleware/signupMiddleware");
const isExist = require("../middlleware/isUserExistinDB");
const { userModel } = require("../database/model");

const router = express.Router();
require("dotenv").config();


router.post("/signup",signupMiddleware,isExist,async (req,res)=>{
    const userBody = req.body;
    const createUser = await userModel.create({
        username : userBody.username, 
        email : userBody.email, 
        password : userBody.password
    });
    
    // if not then create the jwt token
    const token = jwt.sign({
        userId : createUser._id
    }, process.env.JWT_SECRET)

    res.json({
        msg : "Signup successfull...",
        token : token
    });
})


module.exports = router;