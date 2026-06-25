const express = require("express");
const app = express();
const connectDB = require("./config/database");

app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

connectDB().then(()=>{
    console.log("Database connected");
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
}).catch((err)=>{
    console.error("Error while connecting to database", err);
});

