"use client";

import { useEffect, useRef, useState } from "react";

interface Marker {
  position: [number, number];
  title: string;
  description: string;
  day: number;
}

interface MapProps {
  markers: Marker[];
}

// Create a global script loader flag to prevent multiple script loads
let googleMapsScriptLoaded = false;

export default function Map({ markers }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  async function initMap() {
    if (!mapRef.current) return;

    try {
      // Request needed libraries
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      const { Marker } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      // Initialize the map with better default zoom
      mapInstance.current = new Map(mapRef.current, {
        zoom: 12, // Higher default zoom
        center: { lat: 0, lng: 0 },
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();

        // Add custom marker icons based on activity type
        const getMarkerIcon = (title: string) => {
          if (title.toLowerCase().includes("museum")) return "🏛️";
          if (title.toLowerCase().includes("restaurant")) return "🍽️";
          if (title.toLowerCase().includes("park")) return "🌳";
          return "📍";
        };

        // Add markers with improved styling
        markers.forEach((markerData) => {
          const marker = new Marker({
            position: {
              lat: markerData.position[0],
              lng: markerData.position[1],
            },
            map: mapInstance.current,
            title: markerData.title,
            animation: google.maps.Animation.DROP,
            label: getMarkerIcon(markerData.title),
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-3 max-w-xs">
                <h3 class="font-bold text-lg mb-1 text-blue-700">Day ${markerData.day}</h3>
                <h4 class="font-semibold text-gray-800">${markerData.title}</h4>
                <p class="text-sm mt-2 text-gray-600">${markerData.description}</p>
              </div>
            `,
            maxWidth: 300,
          });

          marker.addListener("click", () => {
            infoWindow.open(mapInstance.current, marker);
          });

          markersRef.current.push(marker);
          bounds.extend(marker.getPosition() as google.maps.LatLng);
        });

        // Fit map to markers with better padding
        if (mapInstance.current) {
          mapInstance.current.fitBounds(bounds, {
            top: 70,
            right: 70,
            bottom: 70,
            left: 70,
          });
        }

        // Set minimum zoom level to ensure we're not too zoomed in on a single marker
        const listener = google.maps.event.addListener(
          mapInstance.current,
          "idle",
          function () {
            if (
              mapInstance.current &&
              typeof mapInstance.current.getZoom === "function" &&
              mapInstance.current.getZoom() > 16
            ) {
              const map = mapInstance.current;
              map.setZoom(16);
            }
            google.maps.event.removeListener(listener);
          }
        );

        // If only one marker, set a reasonable zoom level
        if (markers.length === 1 && mapInstance.current) {
          mapInstance.current.setZoom(14);
        }
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Unable to load map. Please try again later.");
    }
  }

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      initMap();
      return;
    }

    // Check if script is already being loaded
    if (googleMapsScriptLoaded) {
      // Wait for the script to load
      const checkGoogleExists = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogleExists);
          setIsLoaded(true);
          initMap();
        }
      }, 100);
      return;
    }

    // Load the Google Maps script
    googleMapsScriptLoaded = true;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta`;
    script.defer = true;
    script.async = true;
    script.id = "google-maps-script";

    script.onload = () => {
      setIsLoaded(true);
      initMap();
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove the script on component unmount
      // Just clean up any event listeners
    };
  }, [markers]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg">
      {mapError && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-red-500 text-center p-4">{mapError}</div>
        </div>
      )}
      {!isLoaded && !mapError && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
