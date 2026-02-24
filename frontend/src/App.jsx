import { useEffect, useMemo } from "react";
import "./App.css";
import LocationList from "./components/LocationList";
import MapView from "./components/MapView";
import { useGeolocation } from "./hooks/useGeolocation";
import { useSocket } from "./hooks/useSocket";

function App() {
  const { position, error: geoError, permissionState } = useGeolocation();
  const { locations, emitLocation, connected, selfId } = useSocket();

  useEffect(() => {
    if (position) {
      emitLocation(position);
    }
  }, [position, emitLocation]);

  useEffect(() => {
    if (!position) return;
    const interval = setInterval(() => emitLocation(position), 4000);
    return () => clearInterval(interval);
  }, [emitLocation, position]);

  const selfLocation = useMemo(() => {
    return (
      locations.find((loc) => loc.id === selfId) ||
      (position
        ? {
            ...position,
            id: selfId,
          }
        : null)
    );
  }, [locations, position, selfId]);

  const otherLocations = useMemo(
    () => locations.filter((loc) => loc.id !== selfId),
    [locations, selfId],
  );

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Localização em tempo real</p>
          <h1>Mapa em tempo real entre utilizadores</h1>
          <p className="subtitle">
            Partilha a tua posição e acompanha quem está ligado no mesmo mapa.
          </p>
        </div>
        <div className="status-stack">
          <span className={`pill ${connected ? "pill-ok" : "pill-warn"}`}>
            {connected ? "Ligado ao servidor" : "A ligar..."}
          </span>
          <span className="pill">
            Permissão: {permissionState || "desconhecida"}
          </span>
        </div>
      </header>

      <main className="content">
        <section className="map-card">
          <MapView
            currentLocation={selfLocation}
            otherLocations={otherLocations}
          />
        </section>
        <section className="list-card">
          <LocationList
            selfLocation={selfLocation}
            others={otherLocations}
            geoError={geoError}
            permissionState={permissionState}
            connected={connected}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
