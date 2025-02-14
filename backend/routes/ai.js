const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// Load API key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// AI Summarization and Categorization
router.post("/process-note", async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: "Note content is required" });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
            {
                prompt: `Summarize the following note and suggest a category (Work, Personal, Ideas, etc.):\n${content}`,
                temperature: 0.7,
                max_tokens: 100
            }
        );

        console.log("AI Response:", response.data);

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const aiText = response.data.candidates[0].output;

            // Extract summary and category (simple parsing, can be improved)
            const summary = aiText.split("\n")[0]; // First line as summary
            const category = aiText.includes("Category:") ? aiText.split("Category:")[1].trim() : "Uncategorized";

            return res.json({ summary, category });
        }

        res.status(500).json({ error: "Failed to process AI response" });
    } catch (error) {
        console.error("Error processing AI request:", error.response?.data || error.message);
        res.status(500).json({ error: "AI service error" });
    }
});

module.exports = router;
