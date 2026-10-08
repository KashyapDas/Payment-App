const connectDatabase = require("../database/connect");
const { userModel } = require("../database/model");

async function userExists(email,username) 
{
    try{
        if(connectDatabase){
            const isExist = await userModel.findOne({
                $or: [
                    { email },
                    { username }
                ]
            });
            if(isExist !== null){
                return true;
            }
            return false;
        }

    }catch(err){
        console.log("Error : ",err);
    }
}

module.exports = userExists;