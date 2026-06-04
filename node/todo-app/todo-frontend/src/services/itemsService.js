export const fetchItemsFromServer = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/todo`, {
    method: "GET",
    credentials: "include", // 🚀 Sends session cookie to identify user
  });

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  const data = await response.json();

  // 💡 Handle both cases: if backend sends raw array [..] OR the whole user object { todoList: [..] }
  const todoArray = Array.isArray(data) ? data : data.todoList || [];
  return todoArray.map((item) => mapServerItemToClientItem(item));
};

export const addItemToServer = async (task, date) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/todo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task, date, completed: false }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add todo");
  }

  const data = await response.json();

  // 💡 If backend returns the whole updated user object, get the last item added
  const item = data.todoList ? data.todoList[data.todoList.length - 1] : data;
  return mapServerItemToClientItem(item);
};

export const deleteItemFromServer = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/todo/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }

  const data = await response.json();

  // Use the ID returned by the server, falling back to the parameter ID
  return data.id || data._id || id;
};

export const itemCompletedStatusOnServer = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/todo/${id}`,
    {
      method: "PUT",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update status");
  }

  const data = await response.json();

  // 💡 If backend returns whole user, find the specific updated todo item inside the array
  const item = data.todoList ? data.todoList.find((t) => t._id === id) : data;
  return mapServerItemToClientItem(item);
};

const mapServerItemToClientItem = (serverItem) => {
  if (!serverItem) return null;
  return {
    id: serverItem._id,
    name: serverItem.task,
    dueDate: serverItem.date,
    completed: serverItem.completed,
    createdAt: serverItem.createdAt,
    updatedAt: serverItem.updatedAt,
  };
};
