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

// Middleware to allow Cross-Origin Resource Sharing (CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

wss.on("connection", async (ws) => {
  try {
    console.log("A client connected.");

    const todos = await db.select().from(todo);

    ws.send(JSON.stringify({ todos }));

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received message:", data);

        if (data.action === "DELETE_TODO") {
          const { id } = data;
          await db.delete(todo).where({ id });

          notifyTodos();
        } else if (data.action === "UPDATE_TODO") {
          const { id, title, description, status } = data;
          await db
            .update(todo)
            .set({ title, description, status })
            .where({ id });

          notifyTodos();
        } else if (data.action === "ADD_TODO") {
          const { title, description, status } = data.todo;
          const newTodo = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            description,
            status,
          };
          await db.insert(todo).values(newTodo).execute();

          notifyTodos();
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
  } catch (error) {
    console.error("Error handling client connection:", error);
  }
});

// Function to notify clients about todos
const notifyTodos = async () => {
  try {
    const todos = await db.select().from(todo);
    const message = JSON.stringify({ todos });

    wss.clients.forEach((client) => {
      client.send(message);
    });
  } catch (error) {
    console.error("Error notifying todos to clients:", error);
  }
};

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
