import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import { useTodoStore } from "../stores/todo/";
import EditModal from "./EditModal";
import axios from "axios";

const TodoList = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [todos, setTodos] = useState([]);

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

  const addTodo = useTodoStore((state) => state.addTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const handleAddTaskClick = () => {
    setShowAddTaskModal(true);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
  };

  const handleEdit = (todo: any) => {
    setSelectedTodo(todo);
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedTodo(null);
  };

  const handleRemove = (id: any) => {
    removeTodo(id);
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
      {/* Render the Add Task modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Add Todo</h2>
            <TodoForm
              onClose={handleCloseAddTaskModal}
              onSubmit={(todo) => {
                addTodo({
                  ...todo,
                });
                setShowAddTaskModal(false);
              }}
            />
          </div>
        </div>
      )}
      {/* Render todos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleEdit={handleEdit}
            handleRemove={handleRemove}
          />
        ))}
      </div>
      {/* Render edit modal */}
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

const TodoItem = ({ todo, handleEdit, handleRemove }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "Ongoing":
        return "bg-yellow-500";
      default:
        return "";
    }
  };

  return (
    <div className="bg-yellow-100 rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold">{todo.title}</h2>
      <p className="text-sm text-gray-500">{todo.description}</p>
      <div
        className={`text-sm font-bold inline-block px-2 py-1 rounded ${getStatusColor(
          todo.status
        )}`}
      >
        {todo.status}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="text-blue-500 mr-2" onClick={() => handleEdit(todo)}>
          Edit
        </button>
        <button className="text-red-500" onClick={() => handleRemove(todo.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoList;
