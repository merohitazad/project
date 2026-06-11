export const getItemsFromServer = async (signal) => {
  try {
    const response = await fetch(
      "https://curly-guide-jjp947rv6rgxfpq5x-8080.app.github.dev/items",
      { signal } 
    );
    const data = await response.json();
    return data.items;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Failed to fetch items:", error);
    }
    throw error;
  }
};

export const getItemDetailsFromServer = async (itemId, signal) => {
  try {
    const response = await fetch(
      `https://curly-guide-jjp947rv6rgxfpq5x-8080.app.github.dev/items/${itemId}`,
      { signal }
    );
    const data = await response.json();
    return data.item;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(`Failed to fetch details for item ${itemId}:`, error);
    }
    throw error;
  }};