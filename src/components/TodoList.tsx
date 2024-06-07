// TodoList.tsx
import React, { useState } from "react";
import TodoForm from "./TodoForm";
import { useTodoStore } from "../stores/todo/";
import EditModal from "./EditModal";
import { Todo } from "../stores/todo/interface";
import axios from "axios";

const TodoList = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);

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

  const handleRemove = (id: number) => {
    removeTodo(id);
  };

  // Group todos based on their status
  const pendingTodos = todos.filter((todo) => todo.status === "pending");
  const completedTodos = todos.filter((todo) => todo.status === "completed");
  const ongoingTodos = todos.filter((todo) => todo.status === "Ongoing");

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
      {/* Render todos for each status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Pending todos section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Pending</h2>
          {pendingTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleEdit={handleEdit}
              handleRemove={handleRemove}
            />
          ))}
        </div>
        {/* Completed todos section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Completed</h2>
          {completedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleEdit={handleEdit}
              handleRemove={handleRemove}
            />
          ))}
        </div>
        {/* In progress todos section */}
        <div>
          <h2 className="text-xl font-bold mb-2">In Progress</h2>
          {ongoingTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleEdit={handleEdit}
              handleRemove={handleRemove}
            />
          ))}
        </div>
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

const TodoItem: React.FC<{
  todo: Todo;
  handleEdit: (todo: Todo) => void;
  handleRemove: (id: number) => void;
}> = ({ todo, handleEdit, handleRemove }) => {
  const getStatusColor = (status: string) => {
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
      {/* Added mb-4 for margin bottom */}
      <h2 className="text-lg font-semibold">{todo.text}</h2>
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
