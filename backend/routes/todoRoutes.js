import express from "express";
import { db } from "../db/db_config.js";
import { todo } from "../schema/todoschema.js";

const router = express.Router();

export async function insert(req, res) {
  try {
    const { title, description, status } = req.body;

    await db.insert(todo).values({
      title,
      description,
      status,
    });

    res.status(201).json({ message: "Task Inserted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function fetch(req, res) {
  try {
    await db.select(todo);

    res.status(201).json({ message: "Task Inserted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default router;
