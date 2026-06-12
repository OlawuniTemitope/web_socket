import express from "express";
import { db } from "./db/db.js";
import { demoUsers } from "./db/schema.js";
import { matchRouter } from "./routes/matches.js";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Hello from Express!" });
});

app.use('/matches', matchRouter)
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
