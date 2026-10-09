const connectDatabase = require("../database/connect");
const {userModel} = require("../database/model");

async function isUserExist(email, username, password){
    try{
        if(!connectDatabase){
            throw new Error("Database not connected");    
        }
        const result = await userModel.findOne({
            ...(email ? { email } : { username }),
            password
        });
        return Boolean(result);
    }catch(err){
        console.error(err);
        throw err;
    }
}

module.exports = isUserExist;