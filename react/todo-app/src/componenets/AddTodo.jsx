import { useRef } from "react";
import styles from "./AddTodo.module.css";
import { IoAddCircleOutline } from "react-icons/io5";
import { useContext } from "react";
import { TodoItemsContext } from "../store/todo-items-store";

function AddTodo() {
  const {addNewItem} = useContext(TodoItemsContext);

  const todoNameElement = useRef();
  const dueDateElement = useRef();

  const handleAddButtonClicked = (event) => {
    event.preventDefault();
    const todoName = todoNameElement.current.value;
    const dueDate = dueDateElement.current.value;
    todoNameElement.current.value = "";
    dueDateElement.current.value = "";
    addNewItem(todoName, dueDate);
  };

  return (
    <div className="container">
      <form className="row" onSubmit={handleAddButtonClicked}>
        <div className="col-6">
          <input
            type="text"
            ref={todoNameElement}
            placeholder="Enter Todo here"
          />
        </div>
        <div className="col-4">
          <input type="date" ref={dueDateElement} />
        </div>
        <div className="col-2">
          <button className={`btn btn-success ${styles.btnSize}`}>
            <IoAddCircleOutline />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTodo;
