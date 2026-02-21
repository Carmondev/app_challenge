import { useEffect, useState } from "react";

export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState("prompt");

  useEffect(() => {
    let permissionHandle;

    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setPermissionState(result.state);
          const listener = () => setPermissionState(result.state);
          result.addEventListener("change", listener);
          permissionHandle = { result, listener };
        })
        .catch(() => {
          setPermissionState("unknown");
        });
    }

    return () => {
      if (permissionHandle) {
        permissionHandle.result.removeEventListener(
          "change",
          permissionHandle.listener
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada pelo navegador.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000,
    };

    const success = (pos) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
      setError(null);
    };

    const failure = (err) => {
      setError(err.message || "Não foi possível obter a localização.");
    };

    navigator.geolocation.getCurrentPosition(success, failure, options);
    const watchId = navigator.geolocation.watchPosition(
      success,
      failure,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { position, error, permissionState };
};
