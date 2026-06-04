import AppName from "./componenets/AppName";
import AddTodo from "./componenets/AddTodo";
import TodoItemsContainer from "./componenets/TodoItemsContainer";
import WelcomeMessage from "./componenets/WelcomeMessage";
import { Provider } from "react-redux";
import todoStore from "./store";

function App() {

  return (
    <center className="todo-container">
      <AppName />
      <Provider store={todoStore}>
        <AddTodo />
        <WelcomeMessage />
        <TodoItemsContainer />
      </Provider>
    </center>
  );
}

export default App;