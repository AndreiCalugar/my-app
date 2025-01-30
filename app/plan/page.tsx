// app/plan/page.tsx

"use client";
import { useContext } from "react";
import { FormDataContext } from "../context/FormDataContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function Plan() {
  const {
    register,
    formState: { errors },
  } = useForm();

  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("FormDataContext must be used within a FormDataProvider");
  }
  const { formData, setFormData } = context;
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/recommendations");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 sm:p-8">
      {/* Heading with animation */}
      <div className="text-center mb-8 transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">Plan Your Trip</h1>
        <p className="text-blue-100 text-lg">
          Tell us about your dream vacation
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white/95 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 transform transition-all duration-300 hover:shadow-3xl"
      >
        {/* Destinations Input */}
        <div className="group">
          <label
            htmlFor="destinations"
            className="block text-gray-700 font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200"
          >
            Where would you like to go?
          </label>
          <div className="relative transform transition-all duration-200 hover:translate-x-1">
            <input
              type="text"
              id="destinations"
              name="destinations"
              value={formData.destinations}
              onChange={handleChange}
              placeholder="e.g., Europe, Asia, or leave blank"
              className="w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Travel Time and Budget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Travel Time Input */}
          <div className="group">
            <label
              htmlFor="travelTime"
              className="block font-semibold mb-2 text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
            >
              Travel Time (days)
            </label>
            <input
              type="number"
              name="travelTime"
              id="travelTime"
              value={formData.travelTime}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md text-gray-800"
            />
          </div>

          {/* Budget Input */}
          <div className="group">
            <label
              htmlFor="budget"
              className="block font-semibold mb-2 text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
            >
              Budget
            </label>
            <input
              type="number"
              name="budget"
              id="budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md text-gray-800"
            />
          </div>
        </div>

        {/* Trip Type Select */}
        <div className="group">
          <label
            htmlFor="tripType"
            className="block font-semibold mb-2 text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
          >
            What type of trip?
          </label>
          <select
            name="tripType"
            id="tripType"
            value={formData.tripType}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md cursor-pointer text-gray-800"
          >
            <option value="">Select your trip type</option>
            <option value="relaxing">Relaxing</option>
            <option value="activities">Activities</option>
            <option value="backpacking">Backpacking</option>
            <option value="sightseeing">Sightseeing</option>
          </select>
        </div>

        {/* Activities Input */}
        <div className="group">
          <label
            htmlFor="activities"
            className="block font-semibold mb-2 text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
          >
            What activities interest you?
          </label>
          <input
            type="text"
            name="activities"
            id="activities"
            value={formData.activities}
            onChange={handleChange}
            placeholder="e.g., hiking, beach, culture"
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Buttons Container */}
        <div className="space-y-4">
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Get Recommendations
          </button>

          <Link
            href="/"
            className="block text-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 transform hover:scale-105"
          >
            ← Back to Homepage
          </Link>
        </div>
      </form>
    </main>
  );
}
