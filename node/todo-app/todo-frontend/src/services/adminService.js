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
  return todoArray.map((item) => mapServerItemToClientItem(item));
};

export const addAdminItemToServer = async (task, date) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/todo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task, date }), // Admin pushes don't require personal completion flags
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