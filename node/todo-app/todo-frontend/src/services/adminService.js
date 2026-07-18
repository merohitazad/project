// Internal utility parser mirroring your precise data-mapping layout
const mapServerItemToClientItem = (serverItem) => {
  if (!serverItem) return null;
  return {
    id: serverItem._id,
    name: serverItem.task,
    dueDate: serverItem.date,
    completed: serverItem.completed || false, 
    createdAt: serverItem.createdAt,
    updatedAt: serverItem.updatedAt,
  };
};

/**
 * 1. NEW: Admin Authentication / Login Handler
 * Targets the /login endpoint on your admin route layer
 */
export const loginAdminWithServer = async (username, password) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/todo/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    credentials: "include", // Ensures the session cookie is saved by the browser
  });

  if (!response.ok) {
    // Read as text first to prevent crashing on HTML error page responses
    const errorText = await response.text();
    let errorMessage = "Failed to authenticate administrator";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch (e) {
      // Response was HTML (like a 404 or 405 routing page error)
      console.error("Server returned non-JSON response:", errorText);
    }
    
    throw new Error(errorMessage);
  }

  return await response.json(); // Returns { success: true, message: "..." }
};

/**
 * 2. GET: Fetch all broadcast items
 */
export const fetchAdminItemsFromServer = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/todo`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin broadcast tasks");
  }

  const data = await response.json();

  // Handle both array responses and nested object payloads safely
  const todoArray = Array.isArray(data) ? data : data.todoList || [];
  return todoArray.map((item) => mapServerItemToClientItem(item)).filter(Boolean);
};

/**
 * 3. POST: Add a new broadcast item
 */
export const addAdminItemToServer = async (task, date) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/todo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task, date }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to broadcast admin todo");
  }

  const data = await response.json();

  // If the server returns the updated list, pull the last element; otherwise use data direct
  const item = data.todoList ? data.todoList[data.todoList.length - 1] : data;
  return mapServerItemToClientItem(item);
};

/**
 * 4. DELETE: Remove a broadcast item globally
 */
export const deleteAdminItemFromServer = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/admin/todo/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete admin task");
  }

  const data = await response.json();

  return data.id || data._id || id;
};