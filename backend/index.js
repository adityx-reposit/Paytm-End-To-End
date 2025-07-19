import express from "express";
const mainRouter = require("./routes/index")
const userRouter = require("./routes/index");
const app=express();
const cors = require("cors")
app.use(cors())
app.use(express.json())
app.get("/api/v1",mainRouter);

app.get("api/v1/user",userRouter)

app.listen(3000);