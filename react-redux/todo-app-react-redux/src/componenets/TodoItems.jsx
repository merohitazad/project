import styles from "./TodoItems.module.css";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { itemsListActions } from "../store/itemsSlice";

function TodoItems({id, todoName, todoDate }) {
  const dispatch = useDispatch();
  return (
    <div className="container">
      <div className={`row ${styles.dataRow}`}>
        <div className="col-6">{todoName}</div>
        <div className="col-4">{todoDate}</div>
        <div className="col-2 text-center">
          <button
            type="button"
            className={`btn btn-danger ${styles.btnSize}`}
            onClick={() => dispatch(itemsListActions.deleteItem(id))}
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItems;
