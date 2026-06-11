export const getItemsFromServer = async (options = {}) => {
  try {
    const response = await fetch('/items.json', { signal: options.signal });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data?.items ?? [];
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Error fetching items:", error);
    }
    throw error; 
  }
};

export const getItemDetailsFromServer = async (itemId, options = {}) => {
  const items = await getItemsFromServer(options);
  
  return items.find(item => item.id === itemId);
};