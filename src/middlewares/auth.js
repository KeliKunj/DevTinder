const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const cookieParser = require("cookie-parser");

const userAuth = async(req, res, next)=>{
      try{
            const cookie = req.headers.cookie;                        
            const token = cookie.split("=")[1];
            
            // validating token
            const decodedObject =  jwt.verify(token, "DevTinder@123");            
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