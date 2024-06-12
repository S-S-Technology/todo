import create from "zustand";
import { Todo } from "./interface";

interface TodoStore {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "id">) => void;
  removeTodo: (id: number) => void;
  updateTodo: (id: number, updatedTodo: Partial<Todo>) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (todo) => {
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now(),
          title: todo.title,
          description: todo.description || "",
          status: todo.status || "",
        },
      ],
    }));
  },
  removeTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },
  updateTodo: (id, updatedTodo) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      ),
    }));
  },
}));
