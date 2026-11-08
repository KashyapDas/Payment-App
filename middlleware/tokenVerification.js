const jwt = require("jsonwebtoken");


const tokenVerification = (req,res,next)=>{
    // check the token exits or not
    const token = req.headers && req.headers.authorization;
    if(!token){
        return res.json({
            msg : "Something went wrong"
        });
    }
    // check if Bearer exist or not
    if(!token.startsWith("Bearer")){
        return res.json({
            msg : "Something went wrong"
        });
    }
    // check for the original token
    const originalToken = token.split(" ")[1];
    if(!originalToken){
        return res.json({
            msg : "Something went wrong"
        });
    }
    const tokenDecoded = jwt.verify(originalToken,process.env.JWT_SECRET);
    if(!tokenDecoded.id){
        return res.json("Something went wrong");
    }
    req.tokenId = tokenDecoded.id;
    next();
}

module.exports = {
    tokenVerification
};