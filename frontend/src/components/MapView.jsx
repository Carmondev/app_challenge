import { useEffect } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  ScaleControl,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RecenterOnUser = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 14, { animate: true });
    }
  }, [map, position]);

  return null;
};

const mozCenter = [-18.665695, 35.529562];

const MapView = ({ currentLocation, otherLocations }) => {
  const center = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : mozCenter;

  return (
    <div className="map-shell">
      <MapContainer
        center={center}
        zoom={currentLocation ? 17 : 6}
        maxZoom={19}
        scrollWheelZoom
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ScaleControl position="bottomleft" />

        {currentLocation && (
          <>
            <Circle
              center={[currentLocation.latitude, currentLocation.longitude]}
              radius={currentLocation.accuracy || 15}
              pathOptions={{
                color: "#f87171",
                fillColor: "#fecdd3",
                fillOpacity: 0.2,
                weight: 1,
              }}
            />
            <CircleMarker
              center={[currentLocation.latitude, currentLocation.longitude]}
              radius={10}
              color="#e11d48"
              fillColor="#e11d48"
              fillOpacity={0.4}
              stroke={false}
            />
            <Marker
              position={[currentLocation.latitude, currentLocation.longitude]}
              icon={L.divIcon({
                className: "me-icon",
                html: '<div class="me-icon__dot"></div><span class="me-icon__label">eu</span>',
                iconSize: [64, 30],
                iconAnchor: [16, 16],
              })}
              opacity={1}
            />
          </>
        )}

        {otherLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            opacity={0.85}
          />
        ))}

        <RecenterOnUser
          position={
            currentLocation && [
              currentLocation.latitude,
              currentLocation.longitude,
            ]
          }
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
