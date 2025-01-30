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
  //not sure here
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
    console.log("Redirecting to /recommendations");
    router.push("/recommendations");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">
        Plan Your Trip
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg text-gray-800"
      >
        {/* Destinations Input */}
        <div className="mb-4">
          <label
            htmlFor="destinations"
            className="block text-gray-700 font-semibold mb-2"
          >
            Destinations:
          </label>
          <div className="relative">
            <input
              type="text"
              id="destinations"
              {...register("destinations", {
                required: "This field is required",
              })}
              name="destinations"
              value={formData.destinations}
              onChange={handleChange}
              placeholder="e.g., Europe, Asia, or leave blank"
              className="w-full pl-12 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              {/* Example icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {/* Icon path */}
              </svg>
            </div>
          </div>
          {errors.destinations && (
            <p className="text-red-500 text-sm mt-1">
              {errors.destinations?.message?.toString()}
            </p>
          )}
        </div>

        {/* Travel Time Input */}
        <div className="mb-4">
          <label htmlFor="travelTime" className="block font-semibold mb-2">
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
          <label htmlFor="budget" className="block font-semibold mb-2">
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
          <label htmlFor="tripType" className="block font-semibold mb-2">
            Trip Type:
          </label>
          <select
            name="tripType"
            id="tripType"
            value={formData.tripType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring focus:border-blue-500"
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
          <label htmlFor="activities" className="block font-semibold mb-2">
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
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none transition duration-300"
        >
          Get Recommendations
        </button>

        {/* Back to Homepage Link */}
        <p className="mt-4 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Homepage
          </Link>
        </p>
      </form>
    </main>
  );
}
