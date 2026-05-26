require("dotenv").config();

const OpenAI = require("openai");

const getopenairesponse = async (message) => {

    try {

        const groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1"
        });

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        });

        return response.choices[0].message.content;

    } catch (err) {

        console.log("Groq Error:", err);

        return "AI response failed";

    }

};

module.exports = getopenairesponse;