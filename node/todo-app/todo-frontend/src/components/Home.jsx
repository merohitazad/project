import { useContext } from "react";
import { TodoItemsContext } from "../store/todo-items-store";
import AddTodo from "./AddTodo";
import AppName from "./AppName";
import TodoItemsContainer from "./TodoItemsContainer";
import WelcomeMessage from "./WelcomeMessage";
import LoadingSpinner from "./LoadingSpinner";

const Home = () => {
  const { loadingItems } = useContext(TodoItemsContext);

  return (
    <>
      <AppName />
      <AddTodo />
      {loadingItems ? (
        <LoadingSpinner />
      ) : (
        <>
          <WelcomeMessage />
          <TodoItemsContainer />
        </>
      )}
    </>
  );
}

export default Home;