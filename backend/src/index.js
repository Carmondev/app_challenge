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
  }),
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

const webpush = require("web-push");

// Configurar VAPID keys
webpush.setVapidDetails(
  "mailto:seu-email@exemplo.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// Armazenar subscriptions
const subscriptions = new Map();

app.post("/api/subscribe", (req, res) => {
  const { userId, subscription } = req.body;
  subscriptions.set(userId, subscription);
  res.status(201).json({});
});

// Enviar notificação quando usuário se aproxima
function notifyNearbyUsers(userId, location, radius = 100) {
  const nearbyUsers = findUsersWithinRadius(userId, location, radius);

  nearbyUsers.forEach((nearbyUser) => {
    const subscription = subscriptions.get(nearbyUser.id);
    if (subscription) {
      webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "👋 Usuário próximo!",
          body: `${nearbyUser.name} está a menos de 100m de você`,
          icon: "/icon.png",
        }),
      );
    }
  });
}
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
