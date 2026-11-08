const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true,
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})

const userModel = mongoose.model("users",userSchema);
const accountModel = mongoose.model("accounts",accountSchema);

module.exports = {
    userModel,
    accountModel
};


