import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseclient";



export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
});

export const deleteTodoAsync = createAsyncThunk(
  "todos/deleteTodo",
  async (index, { getState }) => {
    const todo = getState().todos.todos[index];

    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", todo.id);

    if (error) throw error;

    return index;
  }
);

export const saveTodoAsync = createAsyncThunk(
  "todos/saveTodo",
  async (_, { getState }) => {
    try {
      const state = getState().todos;
      if (!state.title.trim()) return;

      const newTodo = {
        title: state.title,
        subtasks: state.subTasks.filter((t) => t.trim() !== ""),
      };

      const { data, error } = await supabase
        .from("todos")
        .insert([newTodo])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      return { type: "add", data: data[0] };
    } catch (err) {
      console.error("saveTodoAsync failed:", err);
      throw err;
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    title: "",
    subTasks: [""],
    todos: [],
    editIndex: null,
    loading: false,
  },
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
    editTodo: (state, action) => {
      const todo = state.todos[action.payload];
      state.title = todo.title;
      state.subTasks = todo.subtasks.length ? todo.subtasks : [""];
      state.editIndex = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })

      // save
      .addCase(saveTodoAsync.fulfilled, (state, action) => {
        if (!action.payload) return;

        if (action.payload.type === "add") {
          state.todos.unshift(action.payload.data);
        } else {
          state.todos[action.payload.index] = action.payload.data;
          state.editIndex = null;
        }

        state.title = "";
        state.subTasks = [""];
      })

      // delete
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.todos = state.todos.filter(
          (_, i) => i !== action.payload
        );
      });
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
