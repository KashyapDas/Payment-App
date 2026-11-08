const { userModel } = require("../database/model");

// used in signup
const isUserExists = async (email, username)=>{
    // check if the email and username exists or not
    const result = await userModel.findOne({
        $and : [{ email}, {username}]
    });
    // console.log(result?._id); undefined
    return {
        isExist : Boolean(result),
        id : result?._id
    };
}


module.exports = {
    isUserExists
}
