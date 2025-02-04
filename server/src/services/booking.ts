import Amadeus from "amadeus";
import { HotelOffer } from "../types/hotel";

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

export async function getHotelRecommendations(
  location: string,
  budget: number,
  checkIn: string,
  checkOut: string
): Promise<HotelOffer[]> {
  try {
    const amadeus = getAmadeusClient();

    // Extract city name from location (e.g., "Eiffel Tower Paris" -> "Paris")
    const cityName = location.split(" ").pop() || "Paris";
    const cityCode = CITY_CODES[cityName] || "PAR";

    console.log(`Searching hotels in ${cityName} (${cityCode})`);

    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode,
      radius: 5,
      radiusUnit: "KM",
    });

    return (response.data || []).slice(0, 3).map((hotel: any) => ({
      hotel_id: hotel.hotelId,
      name: hotel.name,
      price_per_night: "Contact for price",
      rating: parseInt(hotel.rating || "0"),
      description: `Hotel in ${hotel.address?.cityName || cityName}`,
      amenities: [],
      location: {
        latitude: hotel.geoCode.latitude,
        longitude: hotel.geoCode.longitude,
      },
      image_url: "",
      booking_url: `https://www.amadeus.com/hotel/${hotel.hotelId}`,
    }));
  } catch (error) {
    console.error("Error in getHotelRecommendations:", error);
    throw error;
  }
}
