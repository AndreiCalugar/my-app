"use client";

import { useState } from "react";
import Map from "@/app/components/Map";

interface Activity {
  name: string;
  duration: string;
  cost: string;
  description: string;
  coordinates: [number, number];
}

interface DailyPlan {
  day: number;
  locations: string[];
  activities: Activity[];
  transportation: {
    method: string;
    duration: string;
    cost: string;
  };
  totalDayCost: string;
  image?: {
    url: string;
    credit: {
      name: string;
      link: string;
    };
  };
}

interface ItineraryProps {
  overview: string;
  dailyPlan: DailyPlan[];
  totalCost: string;
}

export default function Itinerary({
  overview,
  dailyPlan,
  totalCost,
}: ItineraryProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );

  // Get all markers for the selected day
  const currentDayMarkers =
    dailyPlan
      .find((day) => day.day === selectedDay)
      ?.activities.map((activity) => ({
        position: activity.coordinates,
        title: activity.name,
        description: activity.description,
        day: selectedDay,
      })) || [];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Overview Section */}
      <div className="p-8 bg-blue-700 text-white">
        <h2 className="text-3xl font-bold mb-4">Your Travel Itinerary</h2>
        <p className="text-lg leading-relaxed">{overview}</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
        {/* Day Selection and Details */}
        <div className="space-y-8">
          {/* Day Selector - Updated styling */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {dailyPlan.map((day) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`px-6 py-3 rounded-lg transition-all font-semibold ${
                  selectedDay === day.day
                    ? "bg-blue-700 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Day {day.day}
              </button>
            ))}
          </div>

          {/* Selected Day Details */}
          {dailyPlan
            .filter((day) => day.day === selectedDay)
            .map((day) => (
              <div key={day.day} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Day {day.day} Schedule
                  </h3>
                  {/* Added location summary */}
                  <div className="mt-4 p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-lg text-blue-800 mb-2">
                      Today's Destinations
                    </h4>
                    <p className="text-blue-700">
                      Exploring: {day.locations.join(" → ")}
                    </p>
                  </div>
                </div>

                {/* Activities - Updated styling */}
                <div className="space-y-4">
                  {day.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {activity.name}
                      </h4>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {activity.duration}
                        </span>
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {activity.cost}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transportation - Updated styling */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-800 mb-3">
                    Transportation Details
                  </h4>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Method:</span>
                      {day.transportation.method}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Duration:</span>
                      {day.transportation.duration}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Cost:</span>
                      {day.transportation.cost}
                    </p>
                  </div>
                </div>

                <div className="text-right font-bold text-lg text-gray-800">
                  Daily Total: {day.totalDayCost}
                </div>
              </div>
            ))}
        </div>

        {/* Map - responsive height */}
        <div className="h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
          <Map markers={currentDayMarkers} />
        </div>
      </div>

      {/* Full-width image section */}
      {dailyPlan.find((day) => day.day === selectedDay)?.image && (
        <div className="relative w-full h-[600px]">
          <img
            src={dailyPlan.find((day) => day.day === selectedDay)?.image?.url}
            alt={`${dailyPlan.find((day) => day.day === selectedDay)?.locations[0]}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imagesLoaded[selectedDay] ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() =>
              setImagesLoaded((prev) => ({
                ...prev,
                [selectedDay]: true,
              }))
            }
          />
          {!imagesLoaded[selectedDay] && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
            <h3 className="text-3xl font-bold text-white mb-3">
              {dailyPlan.find((day) => day.day === selectedDay)?.locations[0]}
            </h3>
            <p className="text-white/90 text-xl mb-4">
              Exploring this amazing destination on Day {selectedDay}
            </p>
            <div className="absolute bottom-4 right-4 text-white/70 text-sm">
              Photo by{" "}
              <a
                href={
                  dailyPlan.find((day) => day.day === selectedDay)?.image
                    ?.credit.link
                }
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {
                  dailyPlan.find((day) => day.day === selectedDay)?.image
                    ?.credit.name
                }
              </a>{" "}
              on{" "}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Unsplash
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Total Cost */}
      <div className="p-8 bg-gray-50 border-t border-gray-200">
        <div className="text-2xl font-bold text-right text-gray-800">
          Total Trip Cost: {totalCost}
        </div>
      </div>
    </div>
  );
}
