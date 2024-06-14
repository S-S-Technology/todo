// app.post("/todo", async (req, res) => {
//   try {
//     const { title, description, status } = req.body;

//     // Debug message to check received data
//     console.log("Received data:", { title, description, status });

//     const newTodo = {
//       id: Math.random().toString(36).substr(2, 9),
//       title,
//       description,
//       status,
//     };

//     // Insert the new todo into the database
//     await db.insert(todo).values(newTodo);

//     // Debug message to check successful insertion
//     console.log("Todo added to database:", newTodo);

//     notifyTodos();

//     res.status(201).json({ message: "Todo added successfully", todo: newTodo });
//   } catch (error) {
//     console.error("Error adding todo:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Route for deleting a todo
// app.delete("/todo/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Perform the delete operation
//     await db.delete(todo).where({ id });

//     notifyTodos();

//     res.status(200).json({ message: "Todo deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting todo:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Route for updating an existing todo
// app.put("/todo/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, status } = req.body;

//     // Check if any required fields are empty
//     if (!title || !description || !status) {
//       console.error("Error updating todo: Missing required fields");
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Perform the update operation
//     await db
//       .update(todo)
//       .set({ title, description, status })
//       .where(eq(todo.id, id));

//     notifyTodos();

//     // Respond with success message
//     res.status(200).json({ message: "Todo updated successfully" });
//   } catch (error) {
//     console.error("Error updating todo:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Route for deleting a todo
// app.delete("/todo/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Perform the delete operation
//     await db.delete(todo).where({ id });

//     notifyTodos();

//     res.status(200).json({ message: "Todo deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting todo:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Route for fetching all todos
// app.get("/todo", async (req, res) => {
//   try {
//     const todos = await db.select().from(todo);

//     res.status(200).json(todos);
//   } catch (error) {
//     console.error("Error fetching todos:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
