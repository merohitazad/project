import styles from "./WelcomeMessage.module.css"
import { TodoItemsContext } from "../store/todo-items-store";
import { useContext } from "react";

function WelcomeMessage () {
  const {todoItems} = useContext(TodoItemsContext);
  return (todoItems.length == 0 && <p className={styles.welcome}>Enjoy Your Day</p>)
}

export default WelcomeMessage;