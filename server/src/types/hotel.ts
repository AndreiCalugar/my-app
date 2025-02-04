export interface HotelOffer {
  hotel_id: string;
  name: string;
  price_per_night: string;
  rating: number;
  description: string;
  amenities: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  image_url: string;
  booking_url: string;
}
