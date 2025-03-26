import Amadeus from "amadeus";
import { HotelOffer } from "../types/hotel";
import { getLocationImage } from "../services/unsplash";

// Initialize Amadeus client with proper error handling
function getAmadeusClient() {
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    throw new Error("Missing Amadeus credentials");
  }

  try {
    console.log("Creating Amadeus client...");
    const client = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    });

    return client;
  } catch (error) {
    console.error("Error creating Amadeus client:", error);
    throw error;
  }
}

// City code mapping
const CITY_CODES: { [key: string]: string } = {
  Bucharest: "BUH",
  "Cluj-Napoca": "CLJ",
  Timisoara: "TSR",
  Sibiu: "SBZ",
  Brasov: "BRV",
  Iasi: "IAS",
  Paris: "PAR",
};

function getIATACode(location: string): string {
  const cityName =
    location
      .split(/[,\s]+/)
      .pop()
      ?.trim() || "";
  return CITY_CODES[cityName] || "PAR";
}

export async function getHotelRecommendations(
  location: string,
  budget: number,
  checkIn: string,
  checkOut: string
): Promise<HotelOffer[]> {
  try {
    const amadeus = getAmadeusClient();
    const cityCode = getIATACode(location);

    console.log(`Searching hotels in ${location} (${cityCode})`);

    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode,
      radius: 5,
      radiusUnit: "KM",
    });

    // Process hotels with images in parallel
    const hotelsWithImages = await Promise.all(
      (response.data || []).slice(0, 3).map(async (hotel: any) => {
        // Improved hotel image search
        const searchQuery = `${hotel.name} ${hotel.address?.cityName || location} luxury hotel exterior`;
        let imageData = await getLocationImage(searchQuery);

        // If no specific hotel image found, use a generic luxury hotel image
        if (!imageData) {
          console.log("Using fallback image for:", hotel.name);
          imageData = await getLocationImage("luxury hotel building");
        }

        // Add more hotel details
        return {
          hotel_id: hotel.hotelId,
          name: hotel.name,
          price_per_night: "Contact for price",
          rating: parseInt(hotel.rating || "0"),
          description: `${hotel.name} is located in ${hotel.address?.cityName || location}. This ${parseInt(hotel.rating || "3")}-star accommodation offers comfortable rooms and convenient access to local attractions.`,
          amenities: ["WiFi", "Air conditioning", "24-hour reception"],
          location: {
            latitude: hotel.geoCode.latitude,
            longitude: hotel.geoCode.longitude,
          },
          address: hotel.address?.lines?.join(", ") || "",
          city: hotel.address?.cityName || location,
          image_url: imageData?.url || "", // Will be handled by onError in component
          booking_url: `https://www.amadeus.com/hotel/${hotel.hotelId}`,
        };
      })
    );

    return hotelsWithImages;
  } catch (error) {
    console.error("Error in getHotelRecommendations:", error);
    throw error;
  }
}
