import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  subTasks: [""],
  todos: [],
  editIndex: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },

    addSubTask: (state) => {
      state.subTasks.push("");
    },

    updateSubTask: (state, action) => {
      const { index, value } = action.payload;
      state.subTasks[index] = value;
    },

    saveTodo: (state) => {
      if (!state.title.trim()) return;

      const newTodo = {
        title: state.title,
        subTasks: state.subTasks.filter((t) => t.trim() !== ""),
      };

      if (state.editIndex !== null) {
        state.todos[state.editIndex] = newTodo;
        state.editIndex = null;
      } else {
        state.todos.push(newTodo);
      }

      state.title = "";
      state.subTasks = [""];
    },

    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((_, i) => i !== action.payload);
    },

    editTodo: (state, action) => {
      const todo = state.todos[action.payload];
      state.title = todo.title;
      state.subTasks = todo.subTasks.length ? todo.subTasks : [""];
      state.editIndex = action.payload;
    },
  },
});

export const {
  setTitle,
  addSubTask,
  updateSubTask,
  saveTodo,
  deleteTodo,
  editTodo,
} = todoSlice.actions;

export default todoSlice.reducer;
