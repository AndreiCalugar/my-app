"use client";

import { useContext, useEffect, useState } from "react";
import { FormDataContext } from "../context/FormDataContext";
import Link from "next/link";

interface Recommendation {
  destination: string;
  description: string;
}

export default function Recommendations() {
  const context = useContext(FormDataContext);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    throw new Error("FormDataContext must be used within a FormDataProvider");
  }
  const { formData } = context;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/recommendations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [formData]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
      {/* Header Section */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center">
        Your Travel Recommendations
      </h1>

      {/* Loading State */}
      {isLoading && (
        <div className="w-full max-w-6xl text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-xl">
            Generating your perfect travel recommendations...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="w-full max-w-6xl bg-red-50 text-red-600 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {/* Recommendations Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="bg-blue-600 p-4">
                <h2 className="text-2xl font-bold text-white">
                  {rec.destination}
                </h2>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-grow">
                <p className="text-gray-600">{rec.description}</p>
              </div>

              {/* Card Footer - Now fixed at bottom */}
              <div className="bg-gray-50 p-4 mt-auto border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      {formData.travelTime} days
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-600">${formData.budget}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Travel Tips Section */}
      <div className="mt-12 w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Travel Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Best Time to Visit</h3>
            <p>
              Consider traveling during shoulder season for better deals and
              fewer crowds.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Local Customs</h3>
            <p>
              Research local customs and etiquette for a more immersive
              experience.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Your Preferences</h3>
            <p>Trip Type: {formData.tripType}</p>
            <p>Activities: {formData.activities}</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 space-x-4">
        <Link
          href="/plan"
          className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition duration-300"
        >
          Back to Plan
        </Link>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Start Over
        </Link>
      </div>
    </main>
  );
}
