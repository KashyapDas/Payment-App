const {z} = require("zod");


const userSignUpSchema = z.object({
    username : z.string(),
    password : z.string(),
    email : z.email()
}).strict();


const userSignInSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string(),
  })
  .refine(
    (data) => Boolean(data.username) !== Boolean(data.email),
    {
      message: "Provide either username or email, not both",
    }
  );


module.exports = {userSignUpSchema, userSignInSchema};