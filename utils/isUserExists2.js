const { userModel } = require("../database/model");

//  used in signin
const isUserExists2 = async (firstfield,lastfield)=>{
    const result = await userModel.findOne({
        $or : [ {email : firstfield}, {username : firstfield}],
        password : lastfield
    });
    return {
        isExist : Boolean(result),
        id : result?._id,
        username : result.username
    };
}

module.exports = {
    isUserExists2
};