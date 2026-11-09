const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {signupSchemaValidate, signinSchemaValidate} = require("../middlleware/zodMiddleware");
const { isUserExists } = require("../utils/isUserExists");
const { userModel, accountModel} = require("../database/model");
const { isUserExists2 } = require("../utils/isUserExists2");


require("dotenv").config();

// this route allow us to create account if the acc is not already exists.
router.post("/signup",signupSchemaValidate,async (req,res)=>{

    const {email, username, password } = req.body;
    // check if the user exists or not
    const { isExist } = await isUserExists(email, username);
    if(isExist){
        return res.status(409).json({
            msg : "User already exists"
        });
    }
    // here line comes means not exists -> create user, account, token id
    const user = await userModel.create({
        email, username, password 
    });

    if(!user){
        return res.status(500).json({ msg : "Something went wrong"})
    }

    const account = await accountModel.create({
        userId : user._id,
        balance : 1000
    });

    if(!account){
        return res.status(500).json({ msg : "Something went wrong"});
    }
    
    const token = jwt.sign({
        id : user._id
    }, process.env.JWT_SECRET);

    const originalToken = "Bearer" + " " +token;

    // set the token to the cookie
    res.cookie("tokenId", originalToken, {
        httpOnly: true,      // JavaScript can't read it (protects against XSS)
        secure: true,        // only sent over HTTPS (use false only on localhost)
        sameSite: "lax",     // helps protect against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        path: "/",           // available across the whole site
    });


    res.json({
        msg : "user created successfully",
        user : user.username
    });
})

// This route allow us to enter the webiste if the user is already exits.
router.post("/signin",signinSchemaValidate,async (req,res)=>{
    const tokenId = req.cookies && req.cookies.tokenId;

    if(tokenId){
        const originalToken = tokenId.split(" ")[1];
        if(originalToken){
            const tokenDecoded = jwt.verify(originalToken, process.env.JWT_SECRET);
            if(!tokenDecoded.id){
                return res.json({ msg : "Something went wrong"});
            }
            // check if the user exist or not
            const userExist = await userModel.findById({
                _id : tokenDecoded.id
            })

            if(!userExist) res.json({ msg : "user not exists"}); 
            
            return res.json({
                msg : "User signin successfully"
            });        
        }
    }
    // if token not exists
    const { firstfield, lastfield } = req.body;

    // check if the user exists ot not
    const { isExist, id } = await isUserExists2(firstfield, lastfield);
    if(isExist === false){
        return res.json({ msg : "User not exists"});
    }
    // else exist and create the token
    const token = jwt.sign({
        id
    }, process.env.JWT_SECRET);
    const originalToken = "Bearer" + " " + token;

    res.cookie("tokenId",originalToken,{
        httpOnly : true,
        secure : true,
        sameSite : "lax",
        maxAge : 7 * 24 * 60 * 60 * 1000,
        path : "/"
    });

    res.json({
        msg : "User signin successfully",
        token : "Bearer" + " " + token
    });
})

// This route allow us to send an otp to the email 
router.put("/forgot-password",async (req,res)=>{
    // get the email,
    const { email, username, password } = req.body;
    const result = await userModel.findOne({ email, username });

    if(!result) res.json({ msg : "Something went wrong"});
    
    const passChanged = await userModel.updateOne({email, username}, { password });

    if(!passChanged) res.json({ msg : "Something went wrong"});
    
    res.json({
        msg : "password changed successfully"
    });
})

// this is an open route that is accessed for all
router.get("/bulk",async (req,res)=>{
    const filter = req.query.filter || "";
    const users = await userModel.find({
        username : {
            "$regex" : filter
        }
    });
    res.json({
        user : users
    }); 
})



module.exports = router;