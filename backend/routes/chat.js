const express=require("express");
const {Thread}=require("../models/Thread.js");
const getopenairesponse=require("../utils/openai.js");
const authMiddleWare=require("../middleware/auth.js");

const route=express.Router();

route.use(authMiddleWare); // Apply authentication middleware to all routes in this router

route.post("/test",async (req,res)=>{
    try{
        await Thread.create({
            threadId:"kkk",
            title:"testing is awesome",
        });
        res.send("dat is uploded in Db");

    }catch(err){
        console.log(err);
        res.status(500).json({message:err});
        }
    
});
route.get("/thread",async (req,res)=>{
    try{
        const threads=await Thread.find({userId:req.userId}).sort({updatedAt:-1});
        res.json(threads);


    }catch(err){
        console.log(err);
        res.status(500).json({message:`cannot the fech data from DB`});
    }
});
route.get("/thread/:threadId",async (req,res)=>{
    try{
        let {threadId}=req.params;
       const thread=await Thread.findOne({threadId,userId:req.userId});
       if(!thread){
        return res.status(404).json({error:`Thread not found`}); 
       }
       
    res.json(thread.messages);

    }catch(err){
        console.log(err);
        res.status(500).json({message:`unable to fetch the data from DB`});
    }
});

route.delete("/thread/:threadId",async (req,res)=>{
    try{
        let {threadId}=req.params;
        let deletedThread=await Thread.findOneAndDelete({threadId:threadId,userId:req.userId});
        if(!deletedThread){
            return res.status(404).json({error:`thread not found deleted`});
        }
        res.status(200).json({message:`Thread is deleted succesfully`});

    }catch(err){
        res.status(500).json({error:err});
    }
});

route.post("/chat",async (req,res)=>{
    const {threadId,message}=req.body;
    try{
        if(!threadId||!message){
            return res.status(400).json({error:`missing required field`});
        }
        let thread=await Thread.findOne({threadId,userId:req.userId});

        if(!thread){
            //create new Thread
           thread=await Thread.create({
                userId:req.userId,
                threadId:threadId,
                title:message,
                messages:[{role:"user",content:message}],
            });
        }
        else{
            thread.messages.push({role:"user",content:message});
        }
        const assistantMessage=await getopenairesponse(message);
        thread.messages.push({role:"assistant",content:assistantMessage});
        thread.updatedAt=new Date();
        await thread.save();
        res.json({reply:assistantMessage});
        console.log(assistantMessage);


    }catch(err){
        console.log(err);
        const isMissingGroqKey = err.message === "GROQ_API_KEY is not configured";
        const providerStatus = err.status || err.code;
        const providerMessage = err.error?.message || err.message;

        let error = "Unable to get an AI response. Check the backend logs for the Groq error.";

        if (isMissingGroqKey) {
            error = "AI provider is not configured. Set GROQ_API_KEY on the deployed backend.";
        } else if (providerStatus === 401) {
            error = "Groq API key is invalid or missing on the deployed backend.";
        } else if (providerStatus === 429) {
            error = "Groq rate limit or quota exceeded. Please wait and try again, or check your Groq dashboard.";
        } else if (providerStatus === 400 && providerMessage) {
            error = `Groq request failed: ${providerMessage}`;
        } else if (providerStatus === 404 && providerMessage) {
            error = `Groq model error: ${providerMessage}`;
        }

        res.status(500).json({error});

    }
});

module.exports=route
