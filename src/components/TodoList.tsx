import React, { useState, useEffect, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import TodoForm from "./TodoForm";
import EditModal from "./EditModal";
import { Todo } from "../stores/todo/interface";

const TodoList: React.FC = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const { sendJsonMessage, lastMessage } = useWebSocket(
    "ws://192.168.1.117:3000/todo",
    {
      onOpen: () => {
        console.log("WebSocket connection opened.");
        fetchTodos();
      },
      onClose: () => console.log("WebSocket connection closed."),
      onError: (error) => console.error("WebSocket error:", error),
    }
  );

  const fetchTodos = useCallback(() => {
    sendJsonMessage({ action: "FETCH_TODOS" });
  }, [sendJsonMessage]);

  useEffect(() => {
    if (lastMessage?.data) {
      const messageData = JSON.parse(lastMessage.data);
      console.log("Received message:", messageData);
      if (messageData.todos) {
        setTodos(messageData.todos);
      } else {
        console.log("No todos in messageData");
      }
    }
  }, [lastMessage]);

  const addTodo = (newTodo: any) => {
    sendJsonMessage({ action: "ADD_TODO", todo: newTodo });
  };

  const removeTodo = (id: string) => {
    sendJsonMessage({ action: "DELETE_TODO", id });
  };

  const updateTodo = (id: string, updatedTodo: any) => {
    sendJsonMessage({ action: "UPDATE_TODO", id, todo: updatedTodo });
  };

  const handleAddTaskClick = () => {
    setShowAddTaskModal(true);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
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
