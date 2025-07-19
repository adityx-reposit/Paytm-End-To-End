import mongoose from "mongoose";

const mongoose = mongoose.connect("mongodb://localhost:27017/Paytm");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
});

const User = mongoose.model(User,UserSchema);


module.exports = {
	User
};