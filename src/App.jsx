import { useDispatch, useSelector } from "react-redux";
import {
  setTitle,
  addSubTask,
  updateSubTask,
  editTodo,
  // fetchTodos,
  saveTodoAsync,
  deleteTodoAsync,
} from "../redux/todoSlice";
import Login from "./components/login";
import { supabase } from "../utils/supabaseclient";
import { useEffect,useState } from "react";

export default function App() {
  const dispatch = useDispatch();
  const { title, subTasks, todos, editIndex } = useSelector(
    (state) => state.todos,
  );

  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  
  if (!user) {
    return <Login />;
  }


  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4 text-center">
          My Todo List App
        </h1>

        <button
          onClick={() => supabase.auth.signOut()}
          className="mb-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>

        <input
          className="w-full border p-2 mb-4 rounded"
          placeholder="Todo Title"
          value={title}
          onChange={(e) => dispatch(setTitle(e.target.value))}
        />

        {subTasks.map((task, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              className="flex-1 border p-2 rounded"
              placeholder="add subtask"
              value={task}
              onChange={(e) =>
                dispatch(
                  updateSubTask({
                    index,
                    value: e.target.value,
                  }),
                )
              }
            />

            {index === subTasks.length - 1 && (
              <button
                onClick={() => dispatch(addSubTask())}
                className="bg-green-400 px-3 rounded"
              >
                +
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => dispatch(saveTodoAsync())}
          className="mt-3 bg-blue-500 p-2 rounded"
        >
          {editIndex !== null ? "Update Todo" : "Save To-Do"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto mt-6">
        {todos.map((todo, index) => (
          <div key={index} className="bg-gray-200 p-4 mb-4 rounded shadow">
            <div className="flex justify-between">
              <h2 className="font-bold">{todo.title}</h2>

              <div className="flex gap-3">
                <button onClick={() => dispatch(editTodo(index))}>
                  Edit
                </button>

                <button
                  onClick={() => dispatch(deleteTodoAsync(index))}
                >
                  Delete
                </button>
              </div>
            </div>

            <ul className="list-disc ml-5 mt-2">
              {todo.subtasks.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
