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

  // Updated prompt for detailed itinerary
  const prompt = `You are a helpful travel planner assistant. Based on the following traveler preferences, provide a detailed day-by-day itinerary:

  Traveler Preferences:
  - Destinations: ${destinations || "No preference"}
  - Travel Time: ${travelTime} days
  - Budget: ${budget}
  - Trip Type: ${tripType}
  - Activities: ${activities}
  
  Please provide:
  1. A brief overview of why this itinerary suits their preferences
  2. A day-by-day breakdown including:
     - Day number
     - Locations to visit
     - Activities and attractions
     - Estimated time for each activity
     - Transportation details between locations
     - Estimated costs where relevant
  
  Format your response as JSON:
  {
    "overview": "Brief explanation of the itinerary",
    "dailyPlan": [
      {
        "day": 1,
        "locations": ["Location names"],
        "activities": [
          {
            "name": "Activity name",
            "duration": "Estimated duration",
            "cost": "Estimated cost",
            "description": "Brief description",
            "coordinates": [latitude, longitude]
          }
        ],
        "transportation": {
          "method": "Transportation method",
          "duration": "Travel duration",
          "cost": "Transportation cost"
        },
        "totalDayCost": "Total cost for the day"
      }
    ],
    "totalCost": "Total trip cost estimate"
  }

  Ensure all costs are within the specified budget of ${budget} and activities match the preferred trip type and interests.`;

  try {
    // Make a request to the OpenAI API
    const aiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful travel planner assistant. Provide responses in valid JSON format.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    // Parse the response
    const aiText = aiResponse.data.choices[0].message?.content;
    if (!aiText) {
      throw new Error("No response from OpenAI");
    }

    // Parse JSON response
    const itinerary = JSON.parse(aiText);
    res.json(itinerary);
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate itinerary" });
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
