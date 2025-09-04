const express = require("express");
const app = express();


app.use("/", (req, res, next) => {  
  console.log("/");
  next();
});
app.use("/user", (req, res, next) => {
 console.log("1st middleware");
  next();
}, (req, res, next) => {
  console.log("2nd middleware");
  next();    
}, (req, res, next) => {
  console.log("3rd middleware");
  res.send("Response from 3rd middleware");  
});

// app.use("/user", (req, res, next) => {
//   console.log("2nd middleware");
//   // res.send("Response from 2nd middleware");   
//   next();
// });
// app.use("/user", (req, res, next) => {
//   console.log("1st middleware");
//   next();
// });

// app.use("/user", (req, res, next) => {
//   console.log("1st middleware");
//   next();
// }, [(req, res, next) => {
//   console.log("2nd middleware");
//   next();    
// }, (req, res, next) => {
//   console.log("3rd middleware");
//   next();
// }], (req, res, next) => {
//   console.log("4th middleware");
//   next();  
// }, (req, res, next) => {
//     console.log("5th middleware");
//     next();
//   }
// );

// app.use("/user", (req, res, next) => {
//   next();
// }, (req, res, next) => {
//     next();    
//   }, (req, res, next) => {
//     next();
//   }
// );

// app.use("/user", (req, res, next) => {
//     console.log("1st middleware");
//     next();
//     // res.send("1st route handler");
//   }, (req, res) => {
//     console.log("2nd middleware");
//     res.send("2nd route handler");
//   }, (req, res) => {
//     console.log("3rd middleware");
//     res.send("3rd route handler");
//   }
// );

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
