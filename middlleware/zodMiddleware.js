const {signupSchema, signinSchema} = require("../zod/zodSchema");

const signupSchemaValidate = (req,res,next)=>{
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            msg : "Something went wrong"
        });
    }
    next();
}

const signinSchemaValidate = (req,res,next)=>{
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            msg : "Something went wrong",
        });
    }
    next();
}


module.exports = {
    signupSchemaValidate,
    signinSchemaValidate
};