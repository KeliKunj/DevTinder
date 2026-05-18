const mongoose = require('mongoose');
const validator = require('validator');
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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email format: "+ value);
            }
        }
    },
    password: {
        type: String,
        validate(value){
            if(!validator.isStrongPassword(value, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
                throw new Error("Weak password. "+value);
            }
        }
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,        
        // enum: ["Male", "Female", "Other"],
        // Custom Validation
        validate(value){
            if(!["Male", "Female", "Other"].includes(value)){
                throw new Error("Invalid gender value. Allowed values are: Male, Female, Other");
            }
        }
    },
    photoURL:{
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photoURL format: "+ value);
            }
        }
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

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
// ------------------------OR-------------------------------
// module.exports = mongoose.model("User", userSchema);
