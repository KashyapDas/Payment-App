const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/main");
const connectDatabase = require("./database/connect");
const cookieParser = require("cookie-parser");


const app = express();

app.use(cors({
  origin: "http://localhost:5173", // your exact frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());



app.use("/api/v1",mainRouter);

app.listen(3000,async ()=>{
    await connectDatabase();
    console.log("server started successfully...");
});