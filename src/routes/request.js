const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res)=>{
  try{
    // const loggedInUser = req.user._id;
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // 1. STATUS Validation
    const allowedStatus = ["iignored", "interested"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: `Invalid status type: '${status}'.`
      });
    }
    // 2. USER Validation
    // A) Check if the connection request already exists
    const exisstingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        {fromUserId: fromUserId, toUserId: toUserId},
        {fromUserid: toUserId, toUserId: fromUserId}
      ],
    });
    if(exisstingConnectionRequest){
      return res.status(400).json({
        message: "Connection request already exists between these users."
      });
    }

    // B) Check if the toUserId exists in DB
    const toUser = await User.findById(toUserId);
    if(!toUserId){
      return res.status(404).json({
        message: "User not found."
      });
    }

    // C) A user should not be able to send a connection request to themselves
    // Adding at Schema Level: ConnectionRequestModel
    
    const connectionRequest = new ConnectionRequestModel({ fromUserId, toUserId, status });
    const data = await connectionRequest.save();
    res.status(200).json({
      // message: "Connection Request sent successfully",
      message: `${fromUserId.firstName} has sent a connection request to ${toUserId.firstName}`,
      data: data
    });
  }catch(err){
    res.status(400).send("ERROR: "+err.message);
  }
});
module.exports = requestRouter;