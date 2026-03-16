import { useState } from "react";

export default function App() {

  const [title, setTitle] = useState("");
  const [subTasks, setSubTasks] = useState([""]);
  const [todos, setTodos] = useState([]);

  const addSubTask = () => {
    setSubTasks([...subTasks, ""]);
  };

  const updateSubTask = (index, value) => {
    const updated = [...subTasks];
    updated[index] = value;
    setSubTasks(updated);
  };

  const saveTodo = () => {

    if (!title) return;

    const newTodo = {
      title,
      subTasks
    };

    setTodos([...todos, newTodo]);
    setTitle("");
    setSubTasks([""]);
  };

  const deleteTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">
      <div className="min-w-xl max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl text-center font-bold mb-4">
         My Todo List App
        </h1>

       

        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Todo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <h2 className="font-semibold mb-2">
          Sub Tasks
        </h2>

        {subTasks.map((task, index) => (

          <div key={index} className="flex gap-2 mb-2">

            <input
              className="flex-1 border p-2 rounded"
              placeholder={`Sub Task ${index + 1}`}
              value={task}
              onChange={(e) =>
                // subTasks.append(e.target.value)
                updateSubTask(index, e.target.value)
              }
            />

 { index===subTasks.length-1 &&(
              <button
                onClick={addSubTask}
                className="bg-green-400 font-bold text-white px-3 rounded"
              >
                +
              </button>
)}
           

          </div>
        ))
        }

        <button
          onClick={saveTodo}
          className="mt-3 bg-green-500 text-purple-500 px-4 py-2 rounded w-full"
        >
          Save Todo
        </button>

      </div>






      <div className="max-w-xl mx-auto mt-8">
        {todos.map((todo, index) => (

          <div
            key={index}
            className="bg-white p-4 rounded shadow mb-4"
          >

            <div className="flex justify-between">

              <h3 className="font-bold text-lg">
                {todo.title}
              </h3>

              <button
                onClick={() => deleteTodo(index)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>

            <ul className="mt-2 list-disc ml-6">

              {todo.subTasks.map((val, index) => (
                <li key={index}>
                  {val}
                </li>

              ))}

            </ul>

          </div>

        ))}

      </div>

    </div>
  );
}