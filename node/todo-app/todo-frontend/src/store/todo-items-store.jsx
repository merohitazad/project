import { createContext, useEffect, useReducer, useState } from "react";
import {
  addItemToServer,
  deleteItemFromServer,
  fetchItemsFromServer,
  itemCompletedStatusOnServer,
} from "../services/itemsService";
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
  loadingItems: false,
});

const todoItemsReducer = (currTodoItems, action) => {
  function sortedItems(items) {
    return [...items].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed - b.completed;
      }
      return new Date(a.rawDate) - new Date(b.rawDate);
    });
  }

  let newTodoItems = currTodoItems;
  if (action.type === "SERVER_ITEMS") {
    newTodoItems = sortedItems(action.payload.items);
  } else if (action.type === "NEW_ITEM") {
    newTodoItems = sortedItems([action.payload, ...currTodoItems]);
  } else if (action.type === "DELETE_ITEM") {
    newTodoItems = currTodoItems.filter(
      (item) => item.id !== action.payload.itemId,
    );
  } else if (action.type === "UNDO_DELETE") {
    newTodoItems = sortedItems([action.payload.item, ...currTodoItems]);
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

  // --- 1. Request Notification Permission ---
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // --- 2. Notification Loop (Using raw values for perfect calculations) ---
  useEffect(() => {
    const activeTimeouts = [];

    if (Notification.permission !== "granted") return;

    todoItems.forEach((item) => {
      if (item.completed || !item.rawDate) return;

      const deadlineTime = new Date(item.rawDate).getTime();
      const notificationTime = deadlineTime - 2 * 60 * 60 * 1000; // 2 hours before
      const timeUntilNotification = notificationTime - Date.now();

      if (timeUntilNotification > 0) {
        const timerId = setTimeout(() => {
          new Notification("Task Deadline Reminder", {
            body: `"${item.name}" is due in 2 hours!`,
            tag: item.id,
          });
        }, timeUntilNotification);

        activeTimeouts.push(timerId);
      }
    });

    return () => {
      activeTimeouts.forEach((id) => clearTimeout(id));
    };
  }, [todoItems]);

  // --- 3. Fixed Date Formatting (Keeps UI locked & feeds the timer) ---
  const formattedItem = (item) => {
    if (!item) return null;

    // Remove backend UTC timezone 'Z' to preserve your exact local input string
    let dateStrInput = item.dueDate;
    if (typeof dateStrInput === "string" && dateStrInput.endsWith("Z")) {
      dateStrInput = dateStrInput.slice(0, -1);
    }

    const date = new Date(dateStrInput);
    const dateStr = `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}, ${date.getFullYear()}`;
    const timeStr = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return {
      id: item.id,
      name: item.name,
      dueDate: dateStr,     // Your UI displays this exact static string
      dueTime: timeStr,     // Your UI displays this exact static string
      rawDate: dateStrInput, // Used purely for background calculations so notifications work
      completed: item.completed,
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

        dispatchTodoItems({
          type: "SERVER_ITEMS",
          payload: { items: formattedItems },
        });
      } catch (error) {
        console.error("Error loading secure user items:", error);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, [isLoggedIn, loadingAuth]);

  const addNewItem = async (itemName, itemDueDate) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticItem = {
      id: tempId,
      name: itemName,
      dueDate: itemDueDate,
      completed: false,
      isSaving: true,
    };
    const formattedOptimisticItem = formattedItem(optimisticItem);
    const updatedItem = { ...formattedOptimisticItem, isSaving: true };
    dispatchTodoItems({ type: "NEW_ITEM", payload: updatedItem });
    try {
      const item = await addItemToServer(itemName, itemDueDate);
      const newItem = formattedItem(item);
      dispatchTodoItems({ type: "DELETE_ITEM", payload: { itemId: tempId } });
      dispatchTodoItems({ type: "NEW_ITEM", payload: newItem });
    } catch (error) {
      console.error("Failed to add new item:", error);
      dispatchTodoItems({ type: "DELETE_ITEM", payload: { itemId: tempId } });
    }
  };

  const deleteItem = async (item) => {
    dispatchTodoItems({ type: "DELETE_ITEM", payload: { itemId: item.id } });
    try {
      await deleteItemFromServer(item.id);
    } catch (error) {
      console.error("Server delete failed, rolling back...");
      dispatchTodoItems({ type: "UNDO_DELETE", payload: { item: item } });
    }
  };

  const taskCompletionStatus = async (item) => {
    const updatedItem = { ...item, completed: !item.completed };
    dispatchTodoItems({ type: "STATUS_ITEM", payload: updatedItem });
    try {
      await itemCompletedStatusOnServer(item.id);
    } catch (error) {
      console.error("Server status update failed, rolling back...");
      dispatchTodoItems({ type: "STATUS_ITEM", payload: item });
    }
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
        loadingItems,
      }}
    >
      {children}
    </TodoItemsContext.Provider>
  );
};

export default TodoItemsContextProvider;