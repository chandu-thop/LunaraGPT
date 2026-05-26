const mongoose=require("mongoose");


const MessageSchema=mongoose.Schema({
    role:{
        type:String,
        enum:["user","assistant"],
        required:true,
    },
    content:{
        type:String,
        required:true,

    },
    timestamp:{
        type:Date,
        default:Date.now
    }

});


const ThreadSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    threadId:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        default:"New Chat"
    },
    messages:[MessageSchema],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now(),
    },

});


const Thread=mongoose.model("Thread",ThreadSchema);

module.exports={Thread};




