import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import EditModal from "./EditModal";
import axios from "axios";
import useWebSocket from "react-use-websocket";

const TodoList = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [todos, setTodos] = useState([]);
  const { sendJsonMessage, lastMessage } = useWebSocket(
    "ws://localhost:3000/todo"
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/todofetch");
        const fetchedTodos = response.data;
        setTodos(fetchedTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData && messageData.todos) {
        setTodos(messageData.todos);
      }
    }
  }, [lastMessage]);

  const addTodo = async (newTodo: any) => {
    try {
      await axios.post("http://localhost:3000/todo", newTodo);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const removeTodo = async (id: any) => {
    try {
      await axios.delete(`http://localhost:3000/tododelete/${id}`);
      sendJsonMessage(JSON.stringify({ action: "DELETE_TODO", id }));
    } catch (error) {
      console.error("Error removing todo:", error);
    }
  };

  const updateTodo = async (id: any, updatedTodo: any) => {
    try {
      await axios.put(`http://localhost:3000/todoupdate/${id}`, updatedTodo);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleAddTaskClick = () => {
    setShowAddTaskModal(true);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
  };

  const handleEdit = (todo: any) => {
    setSelectedTodo(todo); // Make sure the todo object contains the 'id' property
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedTodo(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Todo App</h1>
      <button
        onClick={handleAddTaskClick}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
      >
        Add Task
      </button>
      {showAddTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Add Todo</h2>
            <TodoForm onClose={handleCloseAddTaskModal} onSubmit={addTodo} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="bg-yellow-100 rounded-lg shadow-md p-4 mb-4"
          >
            <h2 className="text-lg font-semibold">{todo.title}</h2>
            <p className="text-sm text-gray-500">{todo.description}</p>
            <div
              className={`text-sm font-bold inline-block px-2 py-1 rounded ${
                todo.status === "pending"
                  ? "bg-blue-500"
                  : todo.status === "completed"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            >
              {todo.status}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="text-blue-500 mr-2"
                onClick={() => handleEdit(todo)}
              >
                Edit
              </button>
              <button
                className="text-red-500"
                onClick={() => removeTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showEditForm && (
        <EditModal
          todo={selectedTodo}
          onClose={handleCloseEditForm}
          onSubmit={updateTodo}
        />
      )}
    </div>
  );
};

export default TodoList;
