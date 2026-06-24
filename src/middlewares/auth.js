const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req, res, next)=>{
      try{
            const cookies = req.cookies;
            const {token} = cookies;
            
            // validating token
            const decodedObject = jwt.verify(token, "DevTinder@123");
            const {_id} = decodedObject;
            const user = await User.findById({_id});
            if(!user){
                  res.status(401).send("UnAuthorized Request");
                  throw new Error("User not found");
            }
            req.user = user;      
            next();
      } catch (error) {
            res.status(401).send("UnAuthorized Request: " + error.message);
      }
}

module.exports = {userAuth};