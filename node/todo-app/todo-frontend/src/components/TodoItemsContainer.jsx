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
          id={item.id}
          todoName={item.name}
          todoDate={item.dueDate}
          completed={item.completed}
        />
      ))}
    </div>
  );
};

export default TodoItemsContainer;
