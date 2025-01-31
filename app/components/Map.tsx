"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngBounds, LatLng } from "leaflet";
import { useEffect } from "react";

// Fix for the marker icon in Next.js
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to handle map bounds
function MapBounds({ markers }: { markers: Marker[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = new LatLngBounds([]);
      markers.forEach((marker) => {
        bounds.extend(new LatLng(marker.position[0], marker.position[1]));
      });

      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 13,
      });
    }
  }, [markers, map]);

  return null;
}

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
  const defaultCenter: [number, number] = [0, 0];

  useEffect(() => {
    // Fix for the marker icon in Next.js
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={defaultIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-1">Day {marker.day}</h3>
              <h4 className="font-semibold">{marker.title}</h4>
              <p className="text-sm mt-1">{marker.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapBounds markers={markers} />
    </MapContainer>
  );
}
