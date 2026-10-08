const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URL;

async function connectDatabase() {
    try{
        const connectionResult = await mongoose.connect(url);
        return connectionResult;
    }catch(e){
        console.log(e);
    }
}

module.exports = connectDatabase;
