import styles from "./WelcomeMessage.module.css"
import { useSelector } from "react-redux";

function WelcomeMessage () {
    const todoItems = useSelector(store => store.itemsList);
  return (todoItems.length === 0 && <p className={styles.welcome}>Enjoy Your Day</p>)
}

export default WelcomeMessage;