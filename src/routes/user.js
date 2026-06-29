const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

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

userRouter.get("/feed", userAuth, async(req, res)=>{
    // User should see all the user cards except:
    // 0. his own card
    // 1. his connection
    // 2. ignored people
    // 3. already sent connection request

    // EXAMPLE: ["Rahul", "Akshay", "Elon", "Mark", "Donald", "MS Dhoni", "Virat"]
    // Rahul--------->Akshay                            Rahul--------->Elon
    // Rahul==feed===>>>>> ["Mark", "Donald", "MS Dhoni", "Virat"]
    // Rahul--------->Akshay--------->Rejected          Rahul--------->Elon--------->Accepted
    // Rahul==feed===>>>>> ["Mark", "Donald", "MS Dhoni", "Virat"]
    // Akshay==feed==>>>>> ["Elon", "Mark", "Donald", "MS Dhoni", "Virat"] (Rejected 'Rahul' (X))
    // Elon===feed===>>>>> ["Akshay", "Mark", "Donald", "MS Dhoni", "Virat"] (Accepted 'Rahul'(X))

    const loggedInUser = req.user;

    // Find connection requests (Sent + Received)
    const connectionRequests = await ConnectionRequestModel.find({
        $or:[
            {toUserId: loggedInUser},
            {fromUserId: loggedInUser}
        ]
    })
    .select("fromUserId toUserId")
    .populate("fromUserId", "firstName")
    .populate("toUserId", "firstName");
    
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId._id.toString());
        hideUsersFromFeed.add(req.toUserId._id.toString());
    });
    
    const page = req.query.page;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50 ? 50: limit;
    const skip = (page-1)*limit;

    const users = await User.find({
        //_id: {$nin: Array.from(hideUsersFromFeed), $ne: loggedInUser._id}
        $and:[
            {_id: {$nin: Array.from(hideUsersFromFeed)}}, 
            {_id: {$ne: loggedInUser._id}}]
    })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);
    res.json({
        message: loggedInUser.firstName+"'s feed fetched",
        data: users,
        totalData: users.length
    });
})

module.exports = userRouter