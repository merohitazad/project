import AppName from "./componenets/AppName";
import AddTodo from "./componenets/AddTodo";
import TodoItemsContainer from "./componenets/TodoItemsContainer";
import WelcomeMessage from "./componenets/WelcomeMessage";
import TodoItemsContextProvider from "./store/todo-items-store";

function App() {

  return (
    <center className="todo-container">
      <AppName />
      <TodoItemsContextProvider>
        <AddTodo />
        <WelcomeMessage />
        <TodoItemsContainer />
      </TodoItemsContextProvider>
    </center>
  );
}

export default App;