import React, { useState } from "react";
import { Todo } from "../stores/todo/interface";
interface EditModalProps {
  todo: Todo;
  onClose: () => void;
  onSubmit: (id: number, updatedTodo: Partial<Todo>) => void;
}

const EditModal: React.FC<EditModalProps> = ({ todo, onClose, onSubmit }) => {
  const [editedText, setEditedText] = useState(todo.text);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedStatus, setEditedStatus] = useState(todo.status);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditedDescription(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedStatus(event.target.value as "pending" | "completed");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(todo.id, {
      text: editedText,
      description: editedDescription,
      status: editedStatus,
    });

    onClose();
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
              onChange={handleTextChange}
              className="border border-gray-300 rounded-md py-2 px-4 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={editedDescription}
              onChange={handleDescriptionChange}
              className="border border-gray-300 rounded-md py-2 px-4 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={editedStatus}
              onChange={handleStatusChange}
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
