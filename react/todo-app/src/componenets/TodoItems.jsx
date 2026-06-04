import styles from "./TodoItems.module.css";
import { MdDelete } from "react-icons/md";
import { useContext } from "react";
import { TodoItemsContext } from "../store/todo-items-store";

function TodoItems({ todoName, todoDate }) {
  const {deleteItem} = useContext(TodoItemsContext);
  return (
    <div className="container">
      <div className={`row ${styles.dataRow}`}>
        <div className="col-6">{todoName}</div>
        <div className="col-4">{todoDate}</div>
        <div className="col-2 text-center">
          <button
            type="button"
            className={`btn btn-danger ${styles.btnSize}`}
            onClick={() => deleteItem(todoName)}
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItems;
