const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketHandler = require('./socketHandler');

const app = express();
app.use(cors());

// Root route to prevent 404 confusion on deployment
app.get("/", (req, res) => {
  res.send("ChatVerse backend running");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Using wildcard for production stability across various Vercel deployments
    methods: ["GET", "POST"]
  }
});

socketHandler(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
