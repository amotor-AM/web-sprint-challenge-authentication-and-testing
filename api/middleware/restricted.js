const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  try {
    const authorization = req.headers.cookie
    if(!authorization) {
      return res.status(401).json({error: "token required"})
    }
    const token = authorization.slice(6, authorization.length)
    jwt.verify(token, "secret", (error, decoded) => {
      if(error) {
        return res.status(401).json({error: "Token Invalid"})
      } else {
        req.token = decoded
        next()
      }
    })
  } catch(err) {
    res.status(400).json(err)
  }
  
};
