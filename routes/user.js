const express = require("express");
const jwt = require("jsonwebtoken");
const userSignUpSchema = require("../zod/userSignUpSchema");
const userExists = require("../utils/userExists");
const { userModel } = require("../database/model");

const router = express.Router();
require("dotenv").config();


router.post("/signup",async (req,res)=>{
    const userBody = req.body;
    const {success} = userSignUpSchema.safeParse(userBody);
    // check schema validation using zod
    if(!success){
        return res.status(400).json({
            msg : "Invalid Credintails..."
        })
    }
    // check is user exist in the database or not
    const isUserExist = await userExists(userBody.email, userBody.username);
    if(isUserExist == true){
        return res.status(400).json({
            msg : "User already exist...Plz signin to continue..."
        });
    }
    // first create the user
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