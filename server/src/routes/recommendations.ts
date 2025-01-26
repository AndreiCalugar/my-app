import { Router, Request, Response } from "express";
import { OpenAI } from "openai";

const router = Router();

// Initialize OpenAI API client
try {
  console.log("Initializing OpenAI client...");

  const openai = new OpenAI({
    apiKey: "your_actual_api_key_here",
  });

  console.log("OpenAI client initialized successfully.");
} catch (error) {
  console.error("Failed to initialize OpenAI client:", error);
}
router.post("/", async (req: Request, res: Response) => {
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
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    // Extract and format the AI's response
    const aiText = aiResponse.choices[0].message.content;

    res.json(aiText ? parseAIResponse(aiText) : []);
  } catch (error: any) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

// Function to parse the AI's response
function parseAIResponse(aiText: string): any[] {
  // Your existing parsing logic, adjusted if necessary
  return []; // Ensure the function returns an array
}

export default router;
