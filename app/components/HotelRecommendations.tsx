import { HotelOffer } from "../../server/src/types/hotel";

interface HotelRecommendationsProps {
  hotels: HotelOffer[];
  isLoading: boolean;
}

export default function HotelRecommendations({
  hotels,
  isLoading,
}: HotelRecommendationsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Recommended Hotels
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotels.slice(0, 3).map((hotel) => (
          <div
            key={hotel.hotel_id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
          >
            <img
              src={hotel.image_url || "/hotel-placeholder.jpg"}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h4 className="font-bold text-lg mb-2 text-gray-800">
                {hotel.name}
              </h4>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-gray-700">{hotel.rating}/5</span>
                <span className="ml-auto font-bold text-gray-800">
                  {hotel.price_per_night}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                {hotel.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              <a
                href={hotel.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition-colors mt-auto"
              >
                Book Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
