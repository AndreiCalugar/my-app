"use client";

import { useEffect, useRef } from "react";

interface Marker {
  position: [number, number];
  title: string;
  description: string;
  day: number;
}

interface MapProps {
  markers: Marker[];
}

export default function Map({ markers }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

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

      // Initialize the map
      mapInstance.current = new Map(mapRef.current, {
        zoom: 1,
        center: { lat: 0, lng: 0 },
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
      });

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();

        // Add markers
        markers.forEach((markerData) => {
          const marker = new Marker({
            position: {
              lat: markerData.position[0],
              lng: markerData.position[1],
            },
            map: mapInstance.current,
            title: markerData.title,
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold text-lg mb-1">Day ${markerData.day}</h3>
                <h4 class="font-semibold">${markerData.title}</h4>
                <p class="text-sm mt-1">${markerData.description}</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(mapInstance.current, marker);
          });

          markersRef.current.push(marker);
          bounds.extend(marker.getPosition() as google.maps.LatLng);
        });

        // Fit map to markers
        mapInstance.current.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }

  useEffect(() => {
    console.log("API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return;
    }

    // Load the Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta`;
    script.defer = true;
    script.async = true;

    window.initMap = initMap;
    script.onload = () => {
      initMap();
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.initMap;
    };
  }, [markers]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}
