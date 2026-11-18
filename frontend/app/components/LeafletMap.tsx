"use client";

import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface WatershedPolygon {
  id: number;
  name: string;
  color: string;
  coords: [number, number][];
}

interface Props {
  polygons: WatershedPolygon[];
}

export default function LeafletMap({ polygons }: Props) {
  return (
    <MapContainer
      center={[26.5, 82.0]}
      zoom={5}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {polygons.map((ws) => (
        <Polygon
          key={ws.id}
          positions={ws.coords}
          pathOptions={{ color: ws.color, fillColor: ws.color, fillOpacity: 0.2, weight: 2 }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{ws.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">12 images · 4 layers</p>
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
}

