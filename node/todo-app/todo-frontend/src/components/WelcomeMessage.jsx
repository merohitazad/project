import { TodoItemsContext } from "../store/todo-items-store";
import { useContext } from "react";

function WelcomeMessage () {
  const {todoItems} = useContext(TodoItemsContext);
  return (todoItems.length == 0 && <p className="text-[25px] mt-5 font-semibold">There is no todo, enjoy your day</p>)
}

export default WelcomeMessage;