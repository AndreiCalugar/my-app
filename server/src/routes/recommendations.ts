// src/routes/recommendations.ts

import { Router, Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  // Initialize OpenAI API client inside the route handler
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  // Extract form data from the request body
  const { destinations, travelTime, budget, tripType, activities } = req.body;

  // Create a prompt for the AI
  const prompt = `You are a helpful travel planner assistant. Based on the following traveler preferences, provide three vacation destination recommendations:

  Traveler Preferences:
  - Destinations: ${destinations || "No preference"}
  - Travel Time: ${travelTime} days
  - Budget: ${budget}
  - Trip Type: ${tripType}
  - Activities: ${activities}
  
  For each recommendation, include:
  1. The destination name.
  2. A brief description of the destination.
  3. An explanation of why it matches the traveler's preferences.
  
  Format your response as:
  1. **Destination Name**
     Description and explanation.
  
  2. **Destination Name**
     Description and explanation.
  
  3. **Destination Name**
     Description and explanation.
  
  Please ensure the recommendations are suitable based on the given budget and travel time.`;

  try {
    // Make a request to the OpenAI API
    const aiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful travel planner assistant.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    console.log("OpenAI response data:", aiResponse.data);
    // Check if choices exist and have at least one item
    if (!aiResponse.data.choices || aiResponse.data.choices.length === 0) {
      console.error("No choices returned from OpenAI");
      res
        .status(500)
        .json({ error: "No response choices returned from OpenAI" });
      return;
    }

    // Extract and format the AI's response
    const aiText = aiResponse.data.choices[0].message?.content;
    if (!aiText) {
      console.error("No text returned from OpenAI");
      res.status(500).json({ error: "No response from OpenAI" });
      return; // Exit early since there's no valid text
    }

    const recommendations = parseAIResponse(aiText);
    res.json(recommendations);
  } catch (error: any) {
    console.error(
      "Error generating recommendations:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

// Function to parse the AI's response
function parseAIResponse(aiText: string): any[] {
  if (!aiText) {
    return [];
  }

  const recommendations = [];
  const regex = /\d\.\s\*\*(.+?)\*\*\n\s*(.+)/g;
  let match;

  while ((match = regex.exec(aiText)) !== null) {
    const destination = match[1].trim();
    const description = match[2].trim();
    recommendations.push({ destination, description });
  }

  return recommendations;
}

export default router;
