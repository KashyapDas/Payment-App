const jwt = require("jsonwebtoken");


const tokenVerification = (req,res,next)=>{
    // check the token exits or not
    const token = req.cookies.tokenId;
    if(!token){
        return res.status(400).json({
            msg : "Something went wrong"
        });
    }
    // check if Bearer exist or not
    if(!token.startsWith("Bearer")){
        return res.status(400).json({
            msg : "Something went wrong"
        });
    }
    // check for the original token
    const originalToken = token.split(" ")[1];
    if(!originalToken){
        return res.status(400).json({
            msg : "Something went wrong"
        });
    }
    const tokenDecoded = jwt.verify(originalToken,process.env.JWT_SECRET);
    if(!tokenDecoded.id){
        return res.status(400).json("Something went wrong");
    }
    req.tokenId = tokenDecoded.id;
    next();
}

module.exports = {
    tokenVerification
};