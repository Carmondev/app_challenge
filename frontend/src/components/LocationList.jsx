const formatCoord = (value) =>
  typeof value === "number" ? value.toFixed(6) : "—";

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "sem timestamp";
  const diff = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (diff < 5) return "agora";
  if (diff < 60) return `${diff}s atrás`;
  const minutes = Math.floor(diff / 60);
  return `${minutes}min atrás`;
};

const LocationList = ({
  selfLocation,
  others,
  geoError,
  permissionState,
  connected,
}) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Sessão actual</p>
          <h2>Coordenadas em direto</h2>
        </div>
        <div className="status-stack">
          <span className={`pill ${connected ? "pill-ok" : "pill-warn"}`}>
            {connected ? "Servidor ligado" : "Servidor desligado"}
          </span>
          <span className="pill">
            Permissão: {permissionState || "desconhecida"}
          </span>
        </div>
      </div>

      {geoError && <div className="alert">{geoError}</div>}

      <div className="list-section">
        <div className="section-title">A tua localização</div>
        {selfLocation ? (
            <div className="location-card">
              <div className="location-label">Tu</div>
              <div className="coords">
                <span>Lat: {formatCoord(selfLocation.latitude)}</span>
                <span>Lng: {formatCoord(selfLocation.longitude)}</span>
              </div>
              <a
                className="meta-link"
                href={`https://www.google.com/maps?q=${selfLocation.latitude},${selfLocation.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Abrir no Google Maps
              </a>
              {selfLocation.accuracy && (
                <span className="meta">
                  Precisão ~{Math.round(selfLocation.accuracy)}m
                </span>
              )}
          </div>
        ) : (
          <p className="muted">A aguardar autorização de localização.</p>
        )}
      </div>

      <div className="list-section">
        <div className="section-title">
          Outros utilizadores ({others.length})
        </div>
        {others.length === 0 ? (
          <p className="muted">Nenhum utilizador extra ligado agora.</p>
        ) : (
          <ul className="locations-list">
            {others.map((loc) => (
              <li key={loc.id} className="location-card">
                <div className="location-label">
                  Utilizador #{loc.id.slice(-5)}
                </div>
                <div className="coords">
                  <span>Lat: {formatCoord(loc.latitude)}</span>
                  <span>Lng: {formatCoord(loc.longitude)}</span>
                </div>
                <span className="meta">
                  Atualizado {formatRelativeTime(loc.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LocationList;
