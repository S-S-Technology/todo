import React, { useState } from "react";
import { Todo } from "../stores/todo/interface";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface EditModalProps {
  todo: Todo;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ todo, onClose }) => {
  const [editedText, setEditedText] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedStatus, setEditedStatus] = useState(todo.status);
  const { sendJsonMessage, readyState } = useWebSocket(
    "ws://192.168.1.117:3000" // Adjust WebSocket URL as needed
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Construct the updated todo object
    const updatedTodo: Partial<Todo> = {
      id: todo.id,
      title: editedText,
      description: editedDescription,
      status: editedStatus,
    };

    try {
      // Send the updated todo fields directly
      sendJsonMessage({
        action: "UPDATE_TODO",
        id: todo.id,
        title: editedText,
        description: editedDescription,
        status: editedStatus,
      });

      onClose(); // Close the modal after sending the update
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Todo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Text
            </label>
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={editedStatus}
              onChange={(e) =>
                setEditedStatus(e.target.value as Todo["status"])
              }
              className="border border-gray-300 rounded-md py-2 px-4 w-full"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              disabled={readyState !== ReadyState.OPEN}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
