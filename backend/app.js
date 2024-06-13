import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { db } from "./db/db_config.js";
import { todo } from "./schema/todoschema.js";
import { eq } from "drizzle-orm";

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

    const newTodo = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      status,
    };

    await db.insert(todo).values(newTodo);

    notifyTodos();

    res.status(201).json({ message: "Todo added successfully", todo: newTodo });
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/todoupdate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Log the received values for debugging
    console.log("Received update request for todo with ID:", id);
    console.log("New title:", title);
    console.log("New description:", description);
    console.log("New status:", status);

    // Check if any required fields are empty
    if (!title || !description || !status) {
      console.error("Error updating todo: Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Perform the update operation
    await db
      .update(todo)
      .set({ title, description, status })
      .where(eq(todo.id, id));

    notifyTodos();

    // Respond with success message
    res.status(200).json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/tododelete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(todo).where({ id });

    notifyTodos();

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
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
        console.log(message);
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
