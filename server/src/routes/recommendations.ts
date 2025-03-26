// src/routes/recommendations.ts

import { Router, Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";
import { getLocationImage } from "../services/unsplash";

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
  const prompt = `You are a helpful travel planner assistant. Based on the following traveler preferences, provide TWO DIFFERENT detailed day-by-day itineraries:

  Traveler Preferences:
  - Destinations: ${destinations || "No preference"}
  - Travel Time: ${travelTime} days
  - Budget: ${budget}
  - Trip Type: ${tripType}
  - Activities: ${activities}
  
  Please provide TWO distinctly different itineraries in JSON format. Each itinerary MUST include exactly ${travelTime} days in the dailyPlan array, with AT LEAST TWO different locations/attractions to visit per day.
  {
    "itineraries": [
      {
        "name": "Option 1: [Compelling description of the itinerary emphasizing the theme and focus]",
        "overview": "A compelling explanation of this itinerary option",
        "dailyPlan": [
          {
            "day": number (1 to ${travelTime}),
            "locations": ["At least 2 location names per day"],
            "activities": [
              {
                "name": "Activity name",
                "duration": "Estimated duration",
                "cost": "Estimated cost",
                "description": "Compelling description",
                "coordinates": [latitude, longitude]
              }
            ],
            "transportation": {
              "method": "string",
              "duration": "string",
              "cost": "string"
            },
            "totalDayCost": "string"
          }
        ],
        "totalCost": "string"
      },
      {
        "name": "Option 2: [Different theme/focus]",
        "overview": "A compelling explanation of this itinerary option",
        "dailyPlan": [Same structure as Option 1, with ${travelTime} days],
        "totalCost": "Total trip cost estimate"
      }
    ]
  }

  Ensure each day has multiple attractions or points of interest to create a rich, engaging experience.`;

  try {
    // Make a request to the OpenAI API
    const aiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful travel planner assistant. Provide responses in valid JSON format only, without any markdown formatting or backticks.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    // Parse the response
    const aiText = aiResponse.data.choices[0].message?.content;
    if (!aiText) {
      throw new Error("No response from OpenAI");
    }

    // Clean up the response text before parsing
    const cleanedText = aiText
      .trim()
      .replace(/^```json\s*/, "") // Remove leading ```json
      .replace(/\s*```$/, "") // Remove trailing ```
      .replace(/^\s*`/, "") // Remove any leading backtick
      .replace(/`\s*$/, ""); // Remove any trailing backtick

    try {
      const itineraries = JSON.parse(cleanedText);

      // Process both itineraries
      for (const itinerary of itineraries.itineraries) {
        for (const day of itinerary.dailyPlan) {
          try {
            // Get image for the first location of each day
            if (day.locations && day.locations.length > 0) {
              console.log(`Processing images for day ${day.day}`);

              // Just pass the location name directly
              const locationImage = await getLocationImage(day.locations[0]);
              day.image = locationImage;
            }
          } catch (imageError) {
            console.error(
              `Error processing image for day ${day.day}:`,
              imageError
            );
            // Continue with the loop even if one image fails
          }
        }
      }

      res.json(itineraries);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Cleaned Text:", cleanedText);
      res.status(500).json({
        error: "Failed to parse itineraries",
        details: "Invalid JSON format received from AI",
      });
    }
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to generate itineraries",
      details: error.message,
    });
  }
});

export default router;
