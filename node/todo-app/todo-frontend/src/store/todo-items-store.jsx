import { createContext, useEffect, useReducer, useState } from "react"; 
import { addItemToServer, deleteItemFromServer, fetchItemsFromServer, itemCompletedStatusOnServer } from "../services/itemsService";
import { checkAuthStatus } from "../services/authService"; 

export const TodoItemsContext = createContext({
  todoItems: [],
  addNewItem: () => {},
  deleteItem: () => {},
  taskCompletionStatus: () => {},
  isLoggedIn: false,
  username: "",
  setIsLoggedIn: () => {},
  setUsername: () => {},
  loadingAuth: true, 
  loadingItems: false
});

const todoItemsReducer = (currTodoItems, action) => {
  function sortedItems(items) {
    return [...items].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed - b.completed;
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }
  
  let newTodoItems = currTodoItems;
  if (action.type === "SERVER_ITEMS") {
    newTodoItems = sortedItems(action.payload.items);
  } else if (action.type === "NEW_ITEM") {
    newTodoItems = sortedItems([action.payload, ...currTodoItems]);
  } else if (action.type === "DELETE_ITEM") {
    newTodoItems = currTodoItems.filter(
      (item) => item.id !== action.payload.itemId
    );
  } else if (action.type === "STATUS_ITEM") {
    newTodoItems = currTodoItems.map((item) => {
      if (item.id === action.payload.id) {
        return action.payload;
      }
      return item;
    });
    newTodoItems = sortedItems(newTodoItems);
  } else if (action.type === "CLEAR_ITEMS") {
    newTodoItems = [];
  }
  return newTodoItems;
};

export const TodoItemsContextProvider = ({ children }) => {
  const [todoItems, dispatchTodoItems] = useReducer(todoItemsReducer, []);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true); 
  const [loadingItems, setLoadingItems] = useState(false);

  const formattedItem = (item) => {
    if (!item) return null;
    const date = new Date(item.dueDate);
    return { 
      id: item.id, 
      name: item.name, 
      dueDate: `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}, ${date.getFullYear()}`, 
      completed: item.completed 
    };
  };

  useEffect(() => {
    const verifySessionOnRefresh = async () => {
      try {
        const response = await checkAuthStatus();
        const data = await response.json();

        if (response.ok && data.success) {
          setIsLoggedIn(true);
          setUsername(data.user.username);
        }
      } catch (error) {
        console.error("No active session recovered on boot:", error);
      } finally {
        setLoadingAuth(false); 
      }
    };
    verifySessionOnRefresh();
  }, []);

  useEffect(() => {
    if (loadingAuth) return; 

    if (!isLoggedIn) {
      dispatchTodoItems({ type: "CLEAR_ITEMS" });
      return;
    }

    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const itemsFromServer = await fetchItemsFromServer();
        const formattedItems = itemsFromServer
          .map((item) => formattedItem(item))
          .filter(Boolean); 

        dispatchTodoItems({ type: "SERVER_ITEMS", payload: { items: formattedItems } });
        setLoadingItems(false);
      } catch (error) {
        console.error("Error loading secure user items:", error);
      } finally {
        setLoadingItems(false); 
      }
    };
    fetchItems();
  }, [isLoggedIn, loadingAuth]);

  const addNewItem = async (itemName, itemDueDate) => {
    const item = await addItemToServer(itemName, itemDueDate);
    const newItem = formattedItem(item);
    dispatchTodoItems({ type: "NEW_ITEM", payload: newItem });
  };

  const deleteItem = async (id) => {
    const itemId = await deleteItemFromServer(id);
    dispatchTodoItems({ type: "DELETE_ITEM", payload: { itemId: itemId } });
  };

  const taskCompletionStatus = async (id) => {
    const item = await itemCompletedStatusOnServer(id);
    const updatedItem = formattedItem(item);
    dispatchTodoItems({ type: "STATUS_ITEM", payload: updatedItem });
  };

  return (
    <TodoItemsContext.Provider 
      value={{ 
        todoItems, 
        addNewItem, 
        deleteItem, 
        taskCompletionStatus,
        isLoggedIn,   
        username,      
        setIsLoggedIn,
        setUsername,
        loadingAuth,
        loadingItems
      }}
    >
      {children}
    </TodoItemsContext.Provider>
  );
};

export default TodoItemsContextProvider;