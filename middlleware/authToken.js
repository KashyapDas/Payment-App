const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  const raw = req.cookies?.tokenId;
  const token = raw?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Token not exists" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.clientUserId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = { authToken };