import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { db } from "./db/db_config.js";
import { todo } from "./schema/todoschema.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.post("/todo", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    await db.insert(todo).values({
      title,
      description,
      status,
    });

    // Notify connected WebSocket clients about the new todo
    notifyTodos();

    res.status(201).json({ message: "Todo added successfully" });
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/todofetch", async (req, res) => {
  try {
    const todos = await db.select().from(todo);

    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/todoupdate", async (req, res) => {
  try {
    const todos = await db.update().from(todo).wh;

    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

wss.on("connection", async (ws) => {
  try {
    console.log("A client connected.");

    const todos = await db.select().from(todo);

    ws.send(JSON.stringify({ todos }));

    ws.on("message", async (message) => {
      try {
        console.log(todos);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  } catch (error) {
    console.error("Error handling client connection:", error);
  }
});

const notifyTodos = async () => {
  try {
    const todos = await db.select().from(todo);
    const message = JSON.stringify({ todos });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(message);
      }
    });
  } catch (error) {
    console.error("Error notifying todos to clients:", error);
  }
};

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
