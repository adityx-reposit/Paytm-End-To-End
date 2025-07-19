import express from 'express';
import App from '../../src/App';
const userRouter = require("./user");

const router = express.Router();
router.use("/user",userRouter);


module.exports=router;

