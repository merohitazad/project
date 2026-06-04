import { useContext } from "react";
import { TodoItemsContext } from "../store/todo-items-store";
import TodoItems from "./TodoItems";

const TodoItemsContainer = () => {
  const {todoItems} = useContext(TodoItemsContext);
  return (
    <div className="items-container">
      {todoItems.map((item, index) => (
        <TodoItems
          key={index}
          todoName={item.name}
          todoDate={item.dueDate}
        />
      ))}
    </div>
  );
};

export default TodoItemsContainer;
