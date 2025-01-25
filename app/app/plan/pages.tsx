// app/plan/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Plan() {
  const [formData, setFormData] = useState({
    destinations: "",
    travelTime: "",
    budget: "",
    tripType: "",
    activities: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, log the form data to the console
    console.log("Form Data Submitted:", formData);
    // Later, navigate to recommendations or process data
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Plan Your Trip
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        {/* Destinations Input */}
        <div className="mb-4">
          <label htmlFor="destinations" className="block text-gray-700 dark:text-gray-300 mb-2">
            Destinations:
          </label>
          <input
            type="text"
            name="destinations"
            id="destinations"
            value={formData.destinations}
            onChange={handleChange}
            placeholder="e.g., Europe, Asia, or leave blank"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        {/* Travel Time Input */}
        <div className="mb-4">
          <label htmlFor="travelTime" className="block text-gray-700 dark:text-gray-300 mb-2">
            Travel Time (in days):
          </label>
          <input
            type="number"
            name="travelTime"
            id="travelTime"
            value={formData.travelTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        {/* Budget Input */}
        <div className="mb-4">
          <label htmlFor="budget" className="block text-gray-700 dark:text-gray-300 mb-2">
            Budget (in your currency):
          </label>
          <input
            type="number"
            name="budget"
            id="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        {/* Trip Type Select */}
        <div className="mb-4">
          <label htmlFor="tripType" className="block text-gray-700 dark:text-gray-300 mb-2">
            Trip Type:
          </label>
          <select
            name="tripType"
            id="tripType"
            value={formData.tripType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="">Select one</option>
            <option value="relaxing">Relaxing</option>
            <option value="activities">Activities</option>
            <option value="backpacking">Backpacking</option>
            <option value="sightseeing">Sightseeing</option>
          </select>
        </div>
        {/* Activities Input */}
        <div className="mb-6">
          <label htmlFor="activities" className="block text-gray-700 dark:text-gray-300 mb-2">
            Preferred Activities:
          </label>
          <input
            type="text"
            name="activities"
            id="activities"
            value={formData.activities}
            onChange={handleChange}
            placeholder="e.g., hiking, beach, culture"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Get Recommendations
        </button>
      </form>
    </main>
  );
}