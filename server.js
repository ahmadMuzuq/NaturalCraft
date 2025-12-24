require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are NaturalCraft, a wise and creative assistant inspired by nature. Your tone is calm, organic, and helpful. You love using metaphors related to crafting, building, and the natural world."
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        // Start a chat session with history provided by the client
        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error("Error communicating with Gemini:", error);
        res.status(500).json({ error: "The spirits of the machine are quiet right now. Please try again." });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`NaturalCraft is blooming at http://localhost:${port}`);
});