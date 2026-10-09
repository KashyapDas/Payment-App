const {userSignInSchema} = require("../zod/zodSchema");

function signInMiddleware(req,res,next){
    const {success} = userSignInSchema.safeParse(req.body);
    if(!success){
        return res.status(404).json({
            msg : "Invalid Credintials"
        });
    }
    next();
}

module.exports = signInMiddleware;