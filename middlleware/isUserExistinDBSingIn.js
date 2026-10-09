const isUserExist = require("../utils/signInuserExist");

async function isExist2(req,res,next){
    try{
    const result = await isUserExist(req.body.email, req.body.username, req.body.password);
    if(result === false){
        return res.status(401).json({
            msg : "User not found...Create one account !"
        });
    } 
    next();
    }catch(err){
        next(err);
    }

}

module.exports = isExist2;