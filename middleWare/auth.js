const jwt = require("jsonwebtoken");
const userModel = require("../DB/Model/userModel");
const auth = (accessRoles) => {
  return async (req, res, next) => {
    try {
        let headerToken = req.headers["authorization"];
        if (
          !headerToken ||
          headerToken == null ||
          headerToken == undefined ||
          !headerToken.startsWith(`${process.env.BEARERTOKEN} `)
        ) {
          res.json({ message: "Invalid header token" });
        } else {
          const token = headerToken.split(" ")[1];
          if (!token || token == null || token == undefined || token.length < 1) {
            res.json({ message: "Invalid token" });
          } else {
            const decoded = jwt.verify(token, process.env.TOKENSIGNATURE);
            // console.log(decoded);
            const findUser = await userModel
              .findById(decoded.id)
              .select("name email role");
            if (!findUser) {
              res.json({ message: "Invalid loggin user" });
            } else {
              if (accessRoles.includes(findUser.role)) {
                req.user = findUser;
                next();
              } else {
                res.json({ message: "Not authorized to do it" });
              }
            }
          }
        }
        
    } catch (error) {
        res.json({ message: "Token catch error" });
        
    }
  
  };
};
module.exports = auth;
