const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const e = require("express");

app.post("/signup", async(req, res) => {
  const userObject = {
    _id:"abc123",
    firstName: "Garima",
    lastName: "Negi",
    emailId: "garimanegi@gmail.com",
    password: "garima123",
    age: 22,
    gender: "Female"
  };
  // Creating a new instance of user model
  try{
    const user = new User(userObject);
    await user.save();
    res.send("User Added successfully");
  }catch(err){
    console.error("Error while creating user", err);
    res.status(400).send("Error occurred: "+ err.message);
  }
  // ------------OR----------------
  // const user = new User({
  //   firstName: "Garima",
  //   lastName: "Negi",
  //   emailId: "garimanegi@gmail.com",
  //   password: "garima123",
  //   age: 26,
  //   gender: "Female"
  // });
});

connectDB().then(()=>{
    console.log("Database connected");
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
}).catch((err)=>{
    console.error("Error while connecting to database", err);
});

