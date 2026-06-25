const express = require('express');
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestsRouter.post("/sendConnectionRequest", userAuth, (req, res)=>{
  try{
    const user = req.user;
    // Send connection request 
    
    res.send(user.firstName+" has sent a connection request.");
  }catch(err){
    res.status(400).send("ERROR: "+err.message);
  }
})

module.exports = requestsRouter;