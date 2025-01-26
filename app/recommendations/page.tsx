// app/recommendations/page.tsx

"use client";
import { useContext, useEffect, useState } from "react";
import { FormDataContext } from "../context/FormDataContext";

import { useRouter } from "next/navigation";

export default function Recommendations() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState([]);
  const formDataContext = useContext(FormDataContext);
  const formData = formDataContext ? formDataContext.formData : null;

  // You might have passed the form data via query parameters or context
  // For now, we'll assume the form data is not directly accessible

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
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Your Travel Recommendations
      </h1>
      {recommendations.length > 0 ? (
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
          Loading recommendations...
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
