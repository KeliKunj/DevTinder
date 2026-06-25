const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateProfileEdit} = require("../utils/validation");

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
  try{
    if(!validateProfileEdit(req)){
      throw new Error("Invalid Profile Edit Request");
    }
    // Update user profile
    let loggedInUser = req.user;
    // loggedInUser.firstName = req.body.firstName || loggedInUser.firstName; // Bad Approach
    Object.keys(req.body).forEach((fields)=>{
      loggedInUser[fields] = req.body[fields];
    });
    await loggedInUser.save();
    // res.send("User Profile Updated Successfully"+ loggedInUser);
    res.json({
      messagge: `${loggedInUser.firstName} your profile has been updated successfully`,
      data: loggedInUser
    });
  }catch(err){
    res.status(400).send("ERROR: "+err.message);
  }
});

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;