import TodoItems from "./TodoItems";
import { useSelector } from "react-redux";

const TodoItemsContainer = () => {
  const todoItems = useSelector(store => store.itemsList);
  return (
    <div className="items-container">
      {todoItems.map((item, index) => (
        <TodoItems
          key={index}
          id={item.id}
          todoName={item.name}
          todoDate={item.dueDate}
        />
      ))}
    </div>
  );
};

export default TodoItemsContainer;
