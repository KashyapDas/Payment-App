const {z} = require("zod");


const userSignUpSchema = z.object({
    username : z.string(),
    password : z.string(),
    email : z.string().email()
}).strict();

module.exports = userSignUpSchema;