export const fetchBagItemsFromServer = async (signal) => {
  try {
    const response = await fetch(
      "https://curly-guide-jjp947rv6rgxfpq5x-8080.app.github.dev/bagItems",
      { signal }
    );
    const data = await response.json();
    return data.bagItemsId;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Failed to fetch bag items:", error);
    }
    throw error;
  }
};

export const addBagItemToServer = async (itemId) => {
  try {
    const response = await fetch(
      "https://curly-guide-jjp947rv6rgxfpq5x-8080.app.github.dev/bagItems",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add item to bag");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to add item to bag:", error);
    throw error;
  }
};

export const deleteBagItemFromServer = async (itemId) => {
  try {
    const response = await fetch(
      `https://curly-guide-jjp947rv6rgxfpq5x-8080.app.github.dev/bagItems`,
      { method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
       }
    );
    if (!response.ok) {
      throw new Error("Failed to remove item from bag");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to remove item from bag:", error);
    throw error;
  }
};  