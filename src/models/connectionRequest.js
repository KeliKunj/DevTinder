const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // const userModel = mongoose.model("User", userSchema);
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: '{VALUE} is not supported'
        }
    }
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("A user cannot send a connection request to themselves.");
    }
    next();
});
