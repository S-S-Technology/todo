import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useWebSocket, { ReadyState } from "react-use-websocket";

const TodoForm = ({ onClose }) => {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const { sendJsonMessage, readyState } = useWebSocket(
    "ws://192.168.1.117:3000"
  );

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const newTodo = {
      id: uuidv4(),
      title: text,
      description,
      status,
    };

    try {
      sendJsonMessage({ action: "ADD_TODO", todo: newTodo });
      onClose(); // Close the form
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Add Todo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full"
            placeholder="Enter todo text"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full"
            placeholder="Enter description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
  );
};

export default TodoForm;
