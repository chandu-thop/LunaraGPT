const express=require("express");
const bcrypt=require('bcrypt');

const route=express.Router();
const { User }=require("../models/User.js");
const jwt =require("jsonwebtoken");


route.post("/register",async (req,res)=>{
    try{
        console.log("📝 Register request received:", req.body);
         let {username,email,password}=req.body;
        if(!username||!email||!password){
            return res.status(400).json({error:`Please provide all the required fields`});
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{username}, {email}] });
        if(existingUser){
            return res.status(400).json({error:`User already exists`});
        }
        
        const hashPassword=bcrypt.hashSync(password,10);
        const newUser = await User.create({
            username:username,
            email:email,
            password:hashPassword
        });
        const token=jwt.sign({
            userId: newUser._id
        },process.env.JWT_SECRET,{
            expiresIn:"1d",
        });
        
        console.log("✅ User registered successfully:", newUser.username);
        res.status(201).json({
            message:`User registered successfully`,
            token: token,
            user: {
                username: newUser.username,
                email: newUser.email,
                id: newUser._id
            }
        });
    }catch(err){
        console.log("❌ Register error:", err.message);
        return res.status(500).json({error:`Unable to register the user`});
    }
});

route.post("/login",async (req,res)=>{
    try{
        let {username,password}=req.body;
        if(!username||!password){
            return res.status(400).json({error:`please provide all the required fields`});
        }
        const user=await User.findOne({
            $or: [{ username: username }, { email: username }],
        });
        if(!user){
            return res.status(400).json({error:`User not found`});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({error:`Invalid credentials`});
        }

        const token=jwt.sign({
            userId: user._id
        },process.env.JWT_SECRET,{
            expiresIn:"1d",
        });
        
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({error:"unable to login the user"});
    }
});

module.exports=route;
