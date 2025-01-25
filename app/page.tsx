// app/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      {/* Hero Section */}
      <div className="text-center px-4 sm:px-0">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          Discover Your Next Adventure
        </h1>
        <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
          Plan your perfect trip with our AI-powered travel planner. Get
          personalized recommendations tailored to your preferences.
        </p>
        <Link href="/plan">
          <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
            Start Planning
          </button>
        </Link>
      </div>

      {/* Decorative Image */}
      <div className="mt-16">
        <Image
          src="/world-map.jpeg"
          alt="World Map"
          width={600}
          height={400}
          className="opacity-80"
        />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-sm">
        © {new Date().getFullYear()} Travel Planner App. All rights reserved.
      </footer>
    </main>
  );
}
