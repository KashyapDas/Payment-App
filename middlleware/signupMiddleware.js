const userSignUpSchema = require("../zod/userSignUpSchema");

function validate(req,res,next){
    const userBody = req.body;
    const {success} = userSignUpSchema.safeParse(userBody);
    if(!success){
        return res.status(400).json({
            msg : "Invalid Credintails..."
        })
    }
    next();
}


module.exports = validate;