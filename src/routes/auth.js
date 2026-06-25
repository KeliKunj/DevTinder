const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const {valdateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const cookie = require("cookie");

authRouter.post("/signup", async(req, res) => {
  try{
    let {firstName, lastName, emailId, password, age, gender, photoURL, about} = req.body;
    
    validateSignUpData(req);    
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({firstName, lastName, emailId, password: passwordHash, age, gender, photoURL, about});
    await user.save();

    res.send("User Added successfully");
  }catch(err){
    console.error("Error while creating user", err);
    res.status(400).send("Error occurred: "+ err.message);
  }
});

authRouter.post("/login", async(req, res)=>{
  try{
      const {emailId, password} = req.body;
      const user = await User.findOne({emailId: emailId});

    if(!user){
      throw new Error("Invalid EmailId: "+ emailId);
    }
    //Comparing Password with valid emailId
    const isPasswordValid = user.validatePassword(password);

    if(isPasswordValid){
      //Create a JWT Token at API Level
      // const token = jwt.sign({_id:user._id}, "DevTinder@123", {expiresIn: "7d"});

      //Calling the getJWT method defined at schema level to create JWT
      const token = await user.getJWT();
      console.log("JWT Token: ", token);

      //Add token in cookie and send it to the user
      res.cookie("token", token);
      // res.cookie("userId", isEmailValid._id, {httpOnly: true, maxAge: 24*60*60*1000}); // 1 day (H M S msec)
      res.send("Login Successful");
    }
    else{
      throw new Error("Invalid Password");
    }
  }catch(err){
    res.status(500).send("ERROR: "+ err.message);
  }
});

authRouter.post("/logout", async(req, res) => {
  try{
    // Clear Cokkies
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("Logged out successfully");
  }catch(err){
    res.status(400).send('ERROR: '+err.message);
  }
});

module.exports = authRouter;