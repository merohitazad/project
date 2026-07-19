import { createContext, useEffect, useReducer, useState } from "react";
import {
  addItemToServer,
  deleteItemFromServer,
  fetchItemsFromServer,
  itemCompletedStatusOnServer,
} from "../services/itemsService";
import { checkAuthStatus } from "../services/authService";

// IMPORTED: Secure administrative service hooks that pass cookie credentials correctly
import {
  fetchAdminItemsFromServer,
  addAdminItemToServer,
  deleteAdminItemFromServer,
} from "../services/adminService"; // Double-check this relative path matches your directory structure

// Helper utility to convert VAPID keys to a compatible Uint8Array format
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const TodoItemsContext = createContext({
  todoItems: [],
  addNewItem: () => {},
  deleteItem: () => {},
  addAdminItem: () => {},     
  deleteAdminItem: () => {},  
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

  // Helper function resolved to target the correct Vercel variable mapping
  const getBackendUrl = () => {
    let baseUrl = import.meta.env.VITE_API_URL || "";
    if (!baseUrl && window.location.hostname.includes("github.dev")) {
      baseUrl = `https://${window.location.hostname.replace("-5173.", "-3000.")}`;
    }
    return baseUrl;
  };

  // --- AUTOMATIC BACKGROUND WEB PUSH REGISTRATION ---
  useEffect(() => {
    if (loadingAuth || !isLoggedIn) return;

    const automaticPushSync = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Push notifications are not natively supported by this browser.");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("User has restricted notification permissions.");
          return;
        }

        const PUBLIC_VAPID_KEY = "YOUR_BACKEND_PUBLIC_VAPID_KEY_HERE"; 
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });

        const backendUrl = getBackendUrl();
        await fetch(`${backendUrl}/api/todo/save-subscription`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscription }),
        });

        console.log("Automatic push notifications synced and active for user:", username);
      } catch (error) {
        console.error("Failed to automatically initialize push updates:", error);
      }
    };

    automaticPushSync();
  }, [isLoggedIn, loadingAuth, username]);

  // --- Safe Date Formatting Logic ---
  const formattedItem = (item) => {
    if (!item) return null;

    let dateStrInput = item.dueDate || item.date;
    
    if (!dateStrInput) {
      return {
        id: item.id || item._id,
        name: item.name || item.task,
        dueDate: "No Date Set",
        dueTime: "--:--",
        rawDate: new Date().toISOString(),
        completed: item.completed || false,
      };
    }

    if (typeof dateStrInput === "string" && dateStrInput.endsWith("Z")) {
      dateStrInput = dateStrInput.slice(0, -1);
    }

    const date = new Date(dateStrInput);
    
    if (isNaN(date.getTime())) {
      return {
        id: item.id || item._id,
        name: item.name || item.task,
        dueDate: String(dateStrInput),
        dueTime: "--:--",
        rawDate: dateStrInput,
        completed: item.completed || false,
      };
    }
    
    const dateStr = `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}, ${date.getFullYear()}`;
    const timeStr = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return {
      id: item.id || item._id,
      name: item.name || item.task,
      dueDate: dateStr,     
      dueTime: timeStr,     
      rawDate: dateStrInput, 
      completed: item.completed || false,
    };
  };

  // Sync admin broadcast items down to the management panel view state engine
  useEffect(() => {
    if (loadingAuth) return;

    const fetchAdminFeedItems = async () => {
      if (window.location.pathname === "/admin") {
        setLoadingItems(true);
        try {
          // MODIFIED: Uses your secure, credential-safe API utility pipeline
          const formattedItems = await fetchAdminItemsFromServer();
          dispatchTodoItems({ type: "SERVER_ITEMS", payload: { items: formattedItems } });
        } catch (err) {
          console.error("Failed loading administrative global broadcast items:", err);
        } finally {
          setLoadingItems(false);
        }
      }
    };

    fetchAdminFeedItems();
  }, [isLoggedIn, loadingAuth]);

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
    if (loadingAuth || window.location.pathname === "/admin") return;

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

  // --- USER SPACE ACTION INTERFACES ---
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

  // --- ADMIN CONTROL INTERFACES ---
  const addAdminItem = async (itemName, itemDueDate) => {
    const tempId = `temp-${Date.now()}`;
    
    const optimisticItem = {
      id: tempId,
      name: itemName,
      dueDate: itemDueDate,
      completed: false,
      isSaving: true,
    };
    
    dispatchTodoItems({ type: "NEW_ITEM", payload: { ...formattedItem(optimisticItem), isSaving: true } });
    
    try {
      // MODIFIED: Replaced raw fetch with your structured service function
      const freshTask = await addAdminItemToServer(itemName, itemDueDate);
      
      dispatchTodoItems({ type: "DELETE_ITEM", payload: { itemId: tempId } });
      dispatchTodoItems({ type: "NEW_ITEM", payload: freshTask });
    } catch (error) {
      console.error("Failed executing structural database broadcast:", error);
      dispatchTodoItems({ type: "DELETE_ITEM", payload: { itemId: tempId } });
    }
  };

  const deleteAdminItem = async (item) => {
    dispatchTodoItems({ type: "DELETE_ITEM", payload: { itemId: item.id } });
    
    try {
      // MODIFIED: Replaced raw fetch with your structured service function
      await deleteAdminItemFromServer(item.id);
    } catch (error) {
      console.error("Retraction server execution failed, rolling back:", error);
      dispatchTodoItems({ type: "UNDO_DELETE", payload: { item: item } });
    }
  };

  return (
    <TodoItemsContext.Provider
      value={{
        todoItems,
        addNewItem,
        deleteItem,
        addAdminItem,      
        deleteAdminItem,    
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