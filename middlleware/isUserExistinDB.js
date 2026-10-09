const userExists = require("../utils/userExists");

async function isExist(req,res,next){
    const result = await userExists(req.body.email, req.body.username);
    if(result==true){
        return res.status(400).json({
            msg : "User already exist...Plz signin to continue..."
        });
    }
    next();
}

module.exports = isExist;