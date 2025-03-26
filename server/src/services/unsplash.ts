import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
  fetch: fetch as any,
});

// Fallback images for when the API fails or rate limits
const FALLBACK_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1500835556837-99ac94a94552",
    credit: {
      name: "Dino Reichmuth",
      link: "https://unsplash.com/@dinoreichmuth",
    },
  },
  {
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    credit: {
      name: "Brigitte Tohm",
      link: "https://unsplash.com/@brigittetohm",
    },
  },
  {
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    credit: {
      name: "Norbert Kowalczyk",
      link: "https://unsplash.com/@norbertkowalczyk",
    },
  },
  {
    url: "https://images.unsplash.com/photo-1488085061387-422e29b40080",
    credit: {
      name: "Jaime Dantas",
      link: "https://unsplash.com/@jaimedantas",
    },
  },
  {
    url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a",
    credit: {
      name: "Toa Heftiba",
      link: "https://unsplash.com/@heftiba",
    },
  },
];

export async function getLocationImage(location: string) {
  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.log("Missing Unsplash API key, using fallback image");
      return getRandomFallbackImage();
    }

    console.log(`Fetching image for location: ${location}`);

    try {
      const result = await unsplash.search.getPhotos({
        query: location,
        page: 1,
        perPage: 1,
        orientation: "landscape",
      });

      if (result.errors) {
        console.error("Unsplash API errors:", result.errors);
        return getRandomFallbackImage();
      }

      if (result.response?.results[0]) {
        return {
          url: result.response.results[0].urls.regular,
          credit: {
            name: result.response.results[0].user.name,
            link: result.response.results[0].user.links.html,
          },
        };
      }

      // No results found, use fallback
      console.log(`No images found for "${location}", using fallback`);
      return getRandomFallbackImage();
    } catch (apiError) {
      console.error("API error (likely rate limit):", apiError);
      return getRandomFallbackImage();
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    return getRandomFallbackImage();
  }
}

// Helper function to get a random fallback image
function getRandomFallbackImage() {
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  console.log(`Using fallback image #${randomIndex + 1}`);
  return FALLBACK_IMAGES[randomIndex];
}
