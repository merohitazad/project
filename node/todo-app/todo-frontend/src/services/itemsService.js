export const fetchItemsFromServer = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/todo`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  const data = await response.json();

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
