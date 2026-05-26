const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");
const mongoose=require("mongoose");
const chatRoute=require("./routes/chat.js");
const authRoute=require("./routes/auth.js");

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

// Auth routes MUST come first (no authentication required)
app.use("/api/auth",authRoute);

// Chat routes come after (requires authentication)
app.use("/api",chatRoute);

const PORT = process.env.PORT || 8080;

const connectDB=async(message)=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("data is connected succesfuul to db");

    }catch(err){
        console.log(err);
    }
}
app.get("/",(req,res)=>{
    res.send("hi,i am here");
});

// const groq = new OpenAI({
//     apiKey: process.env.GROQ_API_KEY,
//     baseURL: "https://api.groq.com/openai/v1"
// });

// app.get("/", async (req, res) => {
//     try {
//         const response = await groq.chat.completions.create({
//             model: "llama-3.3-70b-versatile",
//             messages: [{ role: "user", content: "explain what is api?" }]
//         });

//         console.log("AI Response:", response.choices[0].message.content);
//         res.send(`AI Response: ${response.choices[0].message.content}`); 
//     } catch (err) {
//         console.error("Groq Error:", err);
//         res.status(500).send("Failed to get response from Groq.");
//     }
// });
connectDB();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    
});
