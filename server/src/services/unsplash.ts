import { createApi } from "unsplash-js";
import nodeFetch from "node-fetch";

// Add global fetch for Node environment
global.fetch = require("node-fetch");

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
  fetch: nodeFetch as unknown as typeof fetch,
});

export async function getLocationImage(location: string) {
  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error("Missing Unsplash API key");
      return null;
    }

    // Debug: Log API key (first few characters)
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;
    console.log("Using API key:", apiKey.substring(0, 4) + "...");

    // Clean up the location string
    const cleanLocation = location
      .replace(/hotel/gi, "")
      .replace(/test/gi, "")
      .replace(/property/gi, "")
      .trim();

    console.log("Cleaned location:", cleanLocation);
    console.log("Final search query:", `luxury hotel ${cleanLocation}`);

    try {
      const result = await unsplash.search.getPhotos({
        query: `luxury hotel ${cleanLocation}`,
        page: 1,
        perPage: 1,
        orientation: "landscape",
      });

      console.log("Unsplash API response status:", result.type);
      console.log("Found results:", result.response?.results?.length || 0);

      if (result.response?.results[0]) {
        const imageUrl = result.response.results[0].urls.regular;
        console.log("Successfully found image URL:", imageUrl);
        return {
          url: imageUrl,
          credit: {
            name: result.response.results[0].user.name,
            link: result.response.results[0].user.links.html,
          },
        };
      }
    } catch (apiError) {
      console.error("Unsplash API error details:", apiError);
    }

    return null;
  } catch (error) {
    console.error("Top level error:", error);
    return null;
  }
}
