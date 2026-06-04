import { useRef, useContext } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { TodoItemsContext } from "../store/todo-items-store";

function AddTodo() {
  const { addNewItem } = useContext(TodoItemsContext);

  const todoNameElement = useRef();
  const dueDateElement = useRef();

  const handleAddButtonClicked = (event) => {
    event.preventDefault();

    const todoName = todoNameElement.current.value;
    const dueDate = dueDateElement.current.value;

    if (!todoName || !dueDate) return;

    addNewItem(todoName, dueDate);

    todoNameElement.current.value = "";
    dueDateElement.current.value = "";
  };

  return (
    <div className="container mx-auto px-4">
      <form
        onSubmit={handleAddButtonClicked}
        // Changed to flex-col on mobile, flex-row on md+
        className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 md:p-5 md:mb-8 bg-white rounded-2xl border border-gray-200 shadow-sm"
      >
        <input
          type="text"
          ref={todoNameElement}
          placeholder="What needs to be done?"
          className="flex-1 md:w-44 px-4 py-3 border border-gray-400 rounded-xl text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        <div className="flex gap-3">
          <input
            type="date"
            ref={dueDateElement}
            className="flex-1 md:w-44 h-12 px-3 border border-gray-400 rounded-xl transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="submit"
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-600 text-white text-3xl cursor-pointer transition-all hover:bg-green-700 hover:scale-105 active:scale-95"
          >
            <IoAddCircleOutline />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTodo;