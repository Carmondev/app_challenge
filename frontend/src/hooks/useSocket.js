import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://mapp-app.onrender.com";

export const useSocket = () => {
  const [locations, setLocations] = useState([]);
  const [connected, setConnected] = useState(false);
  const [selfId, setSelfId] = useState(null);

  const socket = useMemo(
    () =>
      io(SOCKET_URL, {
        autoConnect: false,
      }),
    []
  );

  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, [socket]);

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      setSelfId(socket.id);
    };
    const handleDisconnect = () => {
      setConnected(false);
    };
    const handleLocations = (payload) => {
      setLocations(payload);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("locations", handleLocations);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("locations", handleLocations);
    };
  }, [socket]);

  const emitLocation = useCallback(
    (coords) => {
      if (!coords) return;
      socket.emit("location:update", {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    },
    [socket]
  );

  return { locations, emitLocation, connected, selfId };
};
