import express from "express";
import http from 'http'
import { db } from "./db/db.js";
import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";
import { commentaryRouter } from "./routes/commentary.js";

const PORT=Number(process.env.PORT || 8000);
const HOST= process.env.HOST || "0.0.0.0";

const app = express();
const port = 8000;

const server = http.createServer(app)
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Hello from Express!" });
});

app.use(securityMiddleware())

app.use('/matches', matchRouter)
app.use('/matches/:id/commentary', commentaryRouter)

const {broadcastMatchCreated, broadcastCommentary} = attachWebSocketServer(server)
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;


server.listen(port, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:{PORT}`
  
  console.log(`Server listening on ${baseUrl}`);
  console.log(`websocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);
});
