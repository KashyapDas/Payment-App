const { z } = require("zod");

const signupSchema = z.object({
  email : z.email(),
  username : z.string().min(1),
  password : z.string().min(6)
}).strict();


const signinSchema = z.object({
  firstfield : z.string().min(1),
  lastfield : z.string().min(6),
}).strict();


module.exports = {
  signupSchema,
  signinSchema
};