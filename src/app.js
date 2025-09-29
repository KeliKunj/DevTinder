const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async(req, res) => {
  // Creating a new instance of user model
  const user = new User(req.body);
  try{
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
  try {
    const user = await User.findByIdAndUpdate({_id: data.userId}, data,{returnDocument: 'after'});
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

