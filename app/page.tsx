// app/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of travel images with their descriptions
  const images = [
    {
      src: "/world-map.jpeg",
      alt: "World Map",
      title: "Explore The World",
      description: "Your next adventure awaits",
    },
    {
      src: "/beach.jpg", // You'll need to add these images to your public folder
      alt: "Tropical Beach",
      title: "Paradise Beaches",
      description: "Discover pristine coastlines",
    },
    {
      src: "/mountains.jpg",
      alt: "Mountain Range",
      title: "Mountain Escapes",
      description: "Conquer new heights",
    },
    {
      src: "/city.jpg",
      alt: "City Skyline",
      title: "Urban Adventures",
      description: "Experience vibrant city life",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  // Manual navigation functions
  const goToNextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      {/* Hero Section */}
      <div className="text-center px-4 sm:px-0 mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 animate-fade-in">
          Discover Your Next Adventure
        </h1>
        <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
          Plan your perfect trip with our AI-powered travel planner. Get
          personalized recommendations tailored to your preferences.
        </p>
        <Link href="/plan">
          <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 hover:shadow-xl">
            Start Planning
          </button>
        </Link>
      </div>

      {/* Image Carousel */}
      <div className="relative w-full max-w-4xl mx-auto px-4 mb-16">
        <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl group">
          {/* Current Image */}
          <Image
            src={images[currentImageIndex].src}
            alt={images[currentImageIndex].alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />

          {/* Image Overlay with Text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold mb-2">
              {images[currentImageIndex].title}
            </h3>
            <p className="text-lg">{images[currentImageIndex].description}</p>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mb-16">
        {[
          {
            title: "AI-Powered",
            description: "Smart recommendations based on your preferences",
            icon: "🤖",
          },
          {
            title: "Personalized",
            description: "Tailored itineraries just for you",
            icon: "🎯",
          },
          {
            title: "Easy to Use",
            description: "Simple and intuitive planning process",
            icon: "✨",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/20"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-white/80">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-sm mb-8">
        © {new Date().getFullYear()} Travel Planner App. All rights reserved.
      </footer>
    </main>
  );
}
