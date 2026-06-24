const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 4,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,        
    },
    password: {
        type: String,       
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,               
    },
    photoURL:{
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",       
    },
    about:{
        type: String,
        default: "Hey there! I am using DevTinder. I am JS developer and I love coding.",
    },
    skills:{
        type: [String],        
    },       
},{
        timestamps: true,
});

// Creatinf JWT at schema Level
userSchema.methods.getJWT = async function(){
    try{
        const user = this;
        const token = await jwt.sign({_id:user._id}, "DevTinder@123", {expiresIn: "7d"});
        return token;
    }catch(err){
        throw new Error("Error in creating JWT at schema level: "+ err.message);
    }
};

userSchema.methods.validatePassword = async function(passWordByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passWordByUser, passwordHash);
    return isPasswordValid;
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
// ------------------------OR-------------------------------
// module.exports = mongoose.model("User", userSchema);
