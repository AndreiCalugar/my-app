import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
  fetch: fetch as any,
});

export async function getLocationImage(location: string) {
  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error("Missing Unsplash API key");
      return null;
    }

    console.log(`Fetching image for location: ${location}`); // Debug log

    const result = await unsplash.search.getPhotos({
      query: location,
      page: 1,
      perPage: 1,
      orientation: "landscape",
    });

    if (result.errors) {
      console.error("Unsplash API errors:", result.errors);
      return null;
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
    return null;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}
