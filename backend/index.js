import express from "express";
const mainRouter = require("./routes/index")
const userRouter = require("./routes/index");
const app=express();

app.get("/api/v1",mainRouter);

app.get("api/v1/user",userRouter)

