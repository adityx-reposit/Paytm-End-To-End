const express = require('express');
const userRouter = express.Router();


module.exports=userRouter;

const { User } = require("../../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../../config");

// Signup route
userRouter.post("/signup", async (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    if (!username || !password || !firstname || !lastname) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const user = new User({ username, password, firstname, lastname });
        await user.save();
        const token = jwt.sign({ username, id: user._id }, JWT_SECRET);
        res.json({ message: "User created successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Signin route
userRouter.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    try {
        const { z } = require("zod");

        // Define Zod schema for signin
        const signinSchema = z.object({
            username: z.string().min(1, "Username is required"),
            password: z.string().min(1, "Password is required")
        });

        // Validate request body
        const parseResult = signinSchema.safeParse({ username, password });
        if (!parseResult.success) {
            return res.status(400).json({ message: parseResult.error.errors[0].message });
        }

        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({ username, id: user._id }, JWT_SECRET);
        res.json({ message: "Signed in successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});


userRouter.post("/update",async(req,res)=>{
    // Update user endpoint
    const { username, password, firstname, lastname } = req.body;
    if (!username) {
        return res.status(400).json({ message: "Username is required to update user" });
    }
    try {
        // Only update fields that are provided
        const updateFields = {};
        if (password) updateFields.password = password;
        if (firstname) updateFields.firstname = firstname;
        if (lastname) updateFields.lastname = lastname;

        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            message: "User updated successfully",
            user: {
                username: updatedUser.username,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
})


userRouter.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || " ";
    const users=await User.find({
        $or:[{
            firstname:{
                "$regex":filter
            }
            },
            {
            lastname:{
              "$regex":filter
            }
            }
        ]}
    )



    res.json({
        user:users.map(user=>({
           username:user.username,
           firstname:user.firstname,
           lastname:user.lastname,
           _id:user._id
        }))
    })
})