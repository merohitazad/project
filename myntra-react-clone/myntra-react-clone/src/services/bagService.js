// export const fetchBagItemsFromServer = async (signal) => {
//   try {
//     const response = await fetch(
//       "https://curly-guide-jjp947rv6rgxfpq5x-8080.app.github.dev/bagItems",
//       { signal }
//     );
//     const data = await response.json();
//     return data.bagItemsId;
//   } catch (error) {
//     if (error.name !== "AbortError") {
//       console.error("Failed to fetch bag items:", error);
//     }
//     throw error;
//   }
// };

// export const addBagItemToServer = async (itemId) => {
//   try {
//     const response = await fetch(
//       "https://curly-guide-jjp947rv6rgxfpq5x-8080.app.github.dev/bagItems",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ itemId }),
//       }
//     );
//     if (!response.ok) {
//       throw new Error("Failed to add item to bag");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Failed to add item to bag:", error);
//     throw error;
//   }
// };

// export const deleteBagItemFromServer = async (itemId) => {
//   try {
//     const response = await fetch(
//       `https://curly-guide-jjp947rv6rgxfpq5x-8080.app.github.dev/bagItems`,
//       { method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ itemId }),
//        }
//     );
//     if (!response.ok) {
//       throw new Error("Failed to remove item from bag");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Failed to remove item from bag:", error);
//     throw error;
//   }
// };  

// 1. Fetch items from localStorage instead of the server
export const fetchBagItemsFromServer = async (signal) => {
  try {
    // We simulate an async operation to keep it compatible with your existing code
    const localBag = localStorage.getItem("myntra_bag");
    const bagItemsId = localBag ? JSON.parse(localBag) : [];
    return bagItemsId;
  } catch (error) {
    console.error("Failed to fetch bag items from localStorage:", error);
    throw error;
  }
};

// 2. Add an item to localStorage instead of sending a POST request
export const addBagItemToServer = async (itemId) => {
  try {
    // Get current items, push the new one, and save back
    const localBag = localStorage.getItem("myntra_bag");
    let bagItemsId = localBag ? JSON.parse(localBag) : [];
    
    // Prevent adding duplicates if you want unique items in the bag
    if (!bagItemsId.includes(itemId)) {
      bagItemsId.push(itemId);
    }
    
    localStorage.setItem("myntra_bag", JSON.stringify(bagItemsId));
    return { message: "Item added to bag successfully.", itemId };
  } catch (error) {
    console.error("Failed to add item to localStorage bag:", error);
    throw error;
  }
};

// 3. Remove an item from localStorage instead of sending a DELETE request
export const deleteBagItemFromServer = async (itemId) => {
  try {
    const localBag = localStorage.getItem("myntra_bag");
    let bagItemsId = localBag ? JSON.parse(localBag) : [];
    
    // Filter out the item to be removed
    bagItemsId = bagItemsId.filter(id => id !== itemId);
    
    localStorage.setItem("myntra_bag", JSON.stringify(bagItemsId));
    return { message: "Item removed from bag successfully.", itemId };
  } catch (error) {
    console.error("Failed to remove item from localStorage bag:", error);
    throw error;
  }
};