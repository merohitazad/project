import { MdDelete } from "react-icons/md";
import { BiCalendarAlt, BiTimeFive } from "react-icons/bi";
import { useContext } from "react";
import { TodoItemsContext } from "../store/todo-items-store";

function TodoItems({ item }) {
  const { deleteItem, taskCompletionStatus } = useContext(TodoItemsContext);

  return (
    <div className="w-full my-2 px-5 sm:px-8">
      <div
        className={`
          w-full px-5 py-4
          flex flex-col sm:flex-row items-start sm:items-center justify-between
          bg-white rounded-2xl border 
          transition-all duration-300 ease-in-out shadow-sm
          ${item.completed 
            ? "border-gray-100 bg-gray-50/50 opacity-75" 
            : "border-gray-200 hover:border-blue-400 hover:shadow-md"
          }
        `}
      >
        <div className="flex items-center w-full sm:w-auto flex-1 min-w-0 mb-4 sm:mb-0">
          <div className="relative flex items-center justify-center shrink-0 mr-4">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => taskCompletionStatus(item)}
              className="w-5 h-5 cursor-pointer accent-blue-600 rounded-md border-gray-300 transition-all duration-200 transform hover:scale-105"
            />
          </div>
          
          <div
            className={`text-left text-base sm:text-lg font-medium pr-6 transition-all duration-300 break-words overflow-hidden flex-1 ${
              item.completed 
                ? "line-through text-gray-400 decoration-gray-400/60 font-normal" 
                : "text-gray-800"
            }`}
          >
            {item.name}
          </div>
        </div>

        {/* Right Section: Badges & Action */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto md:gap-4 shrink-0 pt-3 sm:pt-0 border-t border-gray-100 sm:border-t-0">
          
          {/* Metadata Badges Wrapper */}
          <div className="flex flex-row items-center gap-2 flex-wrap">
            {/* Date Badge - Increased text-xs to text-sm/base, and padding */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50/60 text-blue-700 rounded-full text-sm md:text-base font-medium border border-blue-100/50">
              <BiCalendarAlt className="text-base shrink-0 text-blue-500" />
              <span>{item.dueDate}</span>
            </div>
            
            {/* Time Badge - Increased text-xs to text-sm/base, and padding */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50/60 text-amber-700 rounded-full text-sm md:text-base font-medium border border-amber-100/50">
              <BiTimeFive className="text-base shrink-0 text-amber-500" />
              <span>{item.dueTime}</span>
            </div>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => deleteItem(item)}
            disabled={item.isSaving || false}
            aria-label="Delete task"
            className="
              w-9 h-9 sm:w-10 sm:h-10
              flex items-center justify-center
              rounded-xl
              bg-gray-50 hover:bg-red-50 
              text-gray-400 hover:text-red-600
              border border-gray-100 hover:border-red-100
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              shrink-0 shadow-sm hover:shadow
            "
          >
            <MdDelete className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItems;