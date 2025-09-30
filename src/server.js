require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routerMain = require("./routes/router.js");
const master = require("./middleware/master.middleware.js")();
const { Sequelize } = require("sequelize");
require("dotenv").config();

const app = express();

PORT = process.env.PORT || 3000;

// real-time
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods : ["GET", "POST", "PUT", "DELETE", "get", "post", "put", "delete"],
    allowedHeaders: ["CorouterMainntent-type", "Authorization"],
  },
});

app.use(async (req, res, next) => {
  (req.io = io), next();
});

app.set("socketio", io);
io.on("connect", (socket) => {
  console.log(`Novo usuário connectado ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("Desconetou");
  });
});
// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["get", "post", "put", "delete", "GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(express.json());


// Rotas
app.use("/", routerMain);

// Inicialização do Servidor
app.get("/", (req, res) => {
  res.send("Sistema de API Funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor Online, Servidor Rodando na porta ${PORT}`);
});
