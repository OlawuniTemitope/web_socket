import express from "express";
import { db } from "./db/db.js";
import { demoUsers } from "./db/schema.js";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/users", async (req, res) => {
  try {
    const users = await db.select().from(demoUsers);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/users", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const inserted = await db.insert(demoUsers).values({ name }).returning();
    res.status(201).json(inserted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
