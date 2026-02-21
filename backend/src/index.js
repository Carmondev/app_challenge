const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ||
  "https://mapapp-git-main-monjane10s-projects.vercel.app";

const app = express();
app.use(
  cors({
    // Abrir CORS para simplificar deploy; ajuste CLIENT_ORIGIN se quiser restringir.
    origin: "*",
    credentials: false,
  })
);

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const clients = new Map();

const broadcastLocations = () => {
  const payload = Array.from(clients.entries()).map(([socketId, data]) => ({
    id: socketId,
    ...data,
  }));

  io.emit("locations", payload);
};

io.on("connection", (socket) => {
  socket.on("location:update", (coords) => {
    const latitude = Number(coords?.latitude);
    const longitude = Number(coords?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    clients.set(socket.id, {
      latitude,
      longitude,
      updatedAt: Date.now(),
    });

    broadcastLocations();
  });

  socket.on("disconnect", () => {
    clients.delete(socket.id);
    broadcastLocations();
  });

  broadcastLocations();
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
