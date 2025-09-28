const express = require("express");
const app = express();
const adminAuth = require("./middlewares/auth");

// app.use("/admin", (req, res, next) => {
//   //logic of checking if request is authorizezed or not
//   const token = "xyz";
//   const isAuthorized = token === "xyz";
//   if (isAuthorized) {
//     next();
//     res.send("All Data sent");
//   } else {
//     res.status(401).send("Not Authorized");
//   }
// });

app.use("/admin", adminAuth.authAdmin);

app.get('/user', adminAuth.authUser, (req, res)=>{
    res.send("User Route");
});

app.get("/admin/getAllData", (req, res, next) => {
  res.send("get All User Data");
});

app.delete("/admin/deleteUser", (req, res, next) => {
  res.send("Deleted User");
});

app.use("/", (err, req, res, next) => {
  if (err) {
  res.status(500).send("Something broke!");
}
});

app.get("/getUserData", (req, res, next) => {
  try {
    throw new Error("Some error occured");
    // Logic to call database and get user data
    res.send("get User Data");
  } catch (error) {
    res.status(500).send("Something went wrong! Contact admin");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
