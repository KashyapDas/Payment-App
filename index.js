const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/main");
const connectDatabase = require("./database/connect");

const app = express();

app.use(cors());
app.use(express.json());

(async function establishedConnextion() {
    await connectDatabase();
})();

app.use("/api/v1",mainRouter);

app.listen(3000,()=>console.log("Server started successfully..."));