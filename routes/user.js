const express = require("express");
const jwt = require("jsonwebtoken");
const signupMiddleware = require("../middlleware/signupMiddleware");
const isExist = require("../middlleware/isUserExistinDB");
const isExist2 = require("../middlleware/isUserExistinDBSingIn");
const { userModel } = require("../database/model");
const signInMiddleware = require("../middlleware/signInMiddleware");

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

router.post("/signin",signInMiddleware,isExist2,async (req,res)=>{
    // check the schema using zod - accept(username/email, password)
    // check if user exist, if yes then processed, and if not then donot processed
    // if yes then create an token and processed
    const {email, username, password} = req.body;
    const result = await userModel.findOne({
        ...(email ? { email } : { username }),
        password
    });
    const token = jwt.sign({
        userId : result._id
    }, process.env.JWT_SECRET);
    
    res.status(200).json({
        msg : "login successfull",
        token 
    })
})


module.exports = router;