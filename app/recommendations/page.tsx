"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FormDataContext } from "../context/FormDataContext";

export default function Recommendations() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formDataContext = useContext(FormDataContext);
  const formData = formDataContext ? formDataContext.formData : null;

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
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (error: any) {
        console.error("Error fetching recommendations:", error);
        setError("Failed to fetch recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [formData]);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Your Travel Recommendations
      </h1>

      {loading ? (
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Loading recommendations...
        </p>
      ) : error ? (
        <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
      ) : recommendations.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {recommendations.map((item, index) => (
            <li
              key={index}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {item.destination}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          No recommendations found.
        </p>
      )}

      <button
        onClick={() => router.push("/plan")}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Back to Plan
      </button>
    </main>
  );
}
