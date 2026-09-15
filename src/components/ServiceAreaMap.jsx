import { useEffect } from "react";
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const zoneMarkerIcon = L.divIcon({
  className: "service-area__leafletMarker",
  html: '<span class="service-area__leafletMarkerInner"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitZoneBounds({ zonePolygon, zoneCities }) {
  const map = useMap();

  useEffect(() => {
    const polygonPoints = Array.isArray(zonePolygon) ? zonePolygon : [];
    const cityPoints = Array.isArray(zoneCities)
      ? zoneCities
          .map((city) => [city.lat, city.lng])
          .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng))
      : [];
    const allPoints = [...polygonPoints, ...cityPoints];
    if (allPoints.length) map.fitBounds(allPoints, { padding: [24, 24] });
  }, [map, zonePolygon, zoneCities]);

  return null;
}

export default function ServiceAreaMap({
  zoneCenter,
  zoneZoom,
  zonePolygon,
  zoneCities,
  featuredCities,
}) {
  return (
    <MapContainer
      center={zoneCenter}
      zoom={zoneZoom}
      scrollWheelZoom={false}
      className="service-area__map service-area__map--leaflet"
    >
      <FitZoneBounds zonePolygon={zonePolygon} zoneCities={zoneCities} />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Array.isArray(zonePolygon) && zonePolygon.length > 0 && (
        <Polygon
          positions={zonePolygon}
          pathOptions={{ weight: 2, opacity: 1, fillOpacity: 0.18 }}
        />
      )}
      {featuredCities.map((city) => (
        <Marker key={city.name} position={[city.lat, city.lng]} icon={zoneMarkerIcon}>
          <Popup>{city.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
