"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openai_1 = require("openai");
const router = (0, express_1.Router)();
// Initialize OpenAI API client
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { destinations, travelTime, budget, tripType, activities } = req.body;
    // Create a prompt for the AI
    const prompt = `Provide three vacation options for a traveler with the following preferences:
  - Destinations: ${destinations || "No preference"}
  - Travel time: ${travelTime} days
  - Budget: ${budget}
  - Trip type: ${tripType}
  - Activities: ${activities}

  Include a brief description for each recommendation.`;
    try {
        // Make a request to the OpenAI API
        const aiResponse = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });
        // Extract and format the AI's response
        const aiText = aiResponse.choices[0].message.content;
        res.json(aiText ? parseAIResponse(aiText) : []);
    }
    catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
}));
// Function to parse the AI's response
function parseAIResponse(aiText) {
    // Your existing parsing logic, adjusted if necessary
    return []; // Ensure the function returns an array
}
exports.default = router;
