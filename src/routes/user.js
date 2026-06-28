const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName age gender about skills";

// GET all the requests received by loggedInUser
userRouter.get("/user/requests/received", userAuth, async(req, res)=>{
    try{        
        const loggedInUser = req.user;
        // Check Who has sent request: 
        // 1) check each Id and find fromUser 
        // 2) build relation between 2 Collection user.js and connectionRequest.js
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
        // .populate("fromUserId");
        .populate("fromUserId", USER_SAFE_DATA);
        // .populate("fromUserId", ["firstName", "lastName"]);
        res.status(200).json({
            message: "successfully fetched connection request sent to you",
            data: connectionRequest
        })
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            $or:[
                {toUserId: loggedInUser, status: "accepted"},
                {fromUserId: loggedInUser, status: "accepted"},
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
        
        const data = connectionRequest.map((row)=> {
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({
            message: "Accepted sent and received connections requests",
            // data: connectionRequest
            data: data
        })
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});

module.exports = userRouter