import { MdDelete } from "react-icons/md";
import { useContext } from "react";
import { TodoItemsContext } from "../store/todo-items-store";

function TodoItems({ item }) {
  const { deleteItem, taskCompletionStatus } = useContext(TodoItemsContext);

  return (
    <div className="container mx-auto px-4">
      <div
        className="
          w-full my-2 px-4 py-3
          flex flex-col md:flex-row items-start md:items-center 
          bg-white rounded-2xl
          border border-gray-200
          transition-all duration-200
          hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg
        "
      >

        <div className="flex items-center w-full mb-3 md:mb-0 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => taskCompletionStatus(item)}
            className="w-6 h-6 cursor-pointer mr-4 shrink-0"
          />
          <div
            className={`text-left text-lg font-medium truncate ${
              item.completed ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {item.name}
          </div>
        </div>

        <div className="flex items-center justify-between w-full md:w-auto md:ml-4 shrink-0">
          <div className="text-left text-base md:text-xl text-gray-600 md:text-gray-800 w-full md:w-36">
            {item.dueDate}
          </div>

          <button
            type="button"
            onClick={() => deleteItem(item)}
            disabled={item.isSaving || false}
            className="
              w-10 h-10 md:w-12 md:h-12 ml-4
              flex items-center justify-center
              rounded-full
              bg-red-500 text-white
              text-lg md:text-xl
              transition-transform duration-200
              hover:scale-110 hover:bg-red-600
              shrink-0
            "
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItems;