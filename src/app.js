const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

app.get("/profile", async(req, res)=>{
  const cookies = req.cookies;
  console.log("Cookies: ", cookies);
  const {token} = cookies;
  const decodedMessage = jwt.verify(token, "DevTinder@123");
  console.log(decodedMessage);
  const {_id} = decodedMessage;
  
  const user = await User.findById({_id});
  res.send(user);
});

app.post("/login", async(req, res)=>{
  try{
      const {emailId, password} = req.body;
      const user = await User.findOne({emailId: emailId});

    if(!user){
      throw new Error("Invalid EmailId: "+ emailId);
    }
    //Comparing Password with valid emailId
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(isPasswordValid){
      //Create a JWT Token
      const token = jwt.sign({_id:user._id}, "DevTinder@123");
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
    res.status(500).send("ERROR: Something went wrong"+ err.message);
  }
})

app.post("/signup", async(req, res) => {
  try{
    let {firstName, lastName, emailId, password, age, gender, photoURL, about} = req.body;
    // Validations on the user sign-up data
    validateSignUpData(req);
    
    //Encrypting the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Hashed password: ", passwordHash);    
    // user.password = passwordHash;

    // Creating a new instance of user model
    const user = new User({firstName, lastName, emailId, password: passwordHash, age, gender, photoURL, about});
    await user.save();
    res.send("User Added successfully");
  }catch(err){
    console.error("Error while creating user", err);
    res.status(400).send("Error occurred: "+ err.message);
  }
});

app.get("/user", async (req, res) => {
    // get user by emailId
    const email = req.body.emailId;
    try{
        const user = await User.findOne({emailId: email});
        // const user = await User.find({emailId: email}); // returns array of users matching the email
        // const user = await User.find({}); // No Filter
        if(!user){
          res.status(404).send("User not found");
        }
        else{
          res.send(user);
        }
    } catch(err){
        console.error("Error while fetching user", err);
        res.status(400).send("Error occurred: "+ err.message);
    }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({_id: userId});
    res.send("User deleted successfully", user);
  } catch (err) {
    console.error("Error while deleting user", err);
    res.status(500).send("Error occurred: " + err.message);
  }
});

app.patch("/user", async (req, res) => {
  const data = req.body;
  // Few schema values should not be updated like emailId, password, etc.
  const ALLOWED_UPDATES = ["userId", "firstName", "lastName", "age", "gender", "photoURL", "about", "skills"];
  const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
  
  try {
    if(!isUpdateAllowed){
      res.send("Invalid updates! Allowed updates are: " + ALLOWED_UPDATES.join(", "));
    }
    const user = await User.findByIdAndUpdate({_id: data.userId}, data,{returnDocument: 'after', runValidators: true});
    console.log(user);
    res.send("User updated successfully", user);
  } catch (err) {
    console.error("Error while updating user", err);
    res.status(500).send("Error occurred: " + err.message);
  }
});

connectDB().then(()=>{
    console.log("Database connected");
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
}).catch((err)=>{
    console.error("Error while connecting to database", err);
});

