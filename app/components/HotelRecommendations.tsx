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
            <div className="relative h-48">
              <img
                src={
                  hotel.image_url ||
                  "https://source.unsplash.com/random/800x600/?luxury+hotel"
                }
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://source.unsplash.com/random/800x600/?luxury+hotel";
                }}
              />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-bold text-blue-700">
                {hotel.rating}/5
              </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h4 className="font-bold text-lg mb-1 text-gray-800">
                {hotel.name}
              </h4>
              <p className="text-gray-500 text-sm mb-2">{hotel.city}</p>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                {hotel.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {hotel.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-800">
                  {hotel.price_per_night}
                </span>
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
