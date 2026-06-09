const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { getStoredItems, storeItems } = require("./data/items");
const { getBagItems, addBagItem, deleteBagItem } = require("./data/bag");

const app = express();

app.use(
  cors({
    origin: "https://curly-guide-jjp947rv6rgxfpq5x-5173.app.github.dev",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

app.get("/items", async (req, res) => {
  const storedItems = await getStoredItems();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 4000));
  res.json({ items: storedItems });
});

// app.get("/bagItems", async (req, res) => {
//   try {
//     const bagItems = await getBagItems();
//     res.json({ bagItemsId: bagItems });
//   } catch (error) {
//     console.error("Failed to serve bag items:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/bagItems", async (req, res) => {
//   try {
//     const { itemId } = req.body;
//     if (!itemId) {
//       return res.status(400).json({ error: "Item ID is required" });
//     }
//     await addBagItem(itemId);
//     res.status(200).json({ message: "Item added to bag successfully.", itemId });
//     } catch (error) {
//     console.error("Failed to add item to bag:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.delete("/bagItems", async (req, res) => {
//   try {
//     const { itemId } = req.body;
//     if (!itemId) {
//       return res.status(400).json({ error: "Item ID is required" });
//     }
//     await deleteBagItem(itemId);
//     res.status(200).json({ message: "Item removed from bag successfully.", itemId });
//   } catch (error) {
//     console.error("Failed to remove item from bag:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/items/:id", async (req, res) => {
  const storedItems = await getStoredItems();
  const item = storedItems.find((item) => item.id === req.params.id);
  res.json({ item });
});

// app.post("/items", async (req, res) => {
//   const existingItems = await getStoredItems();
//   const itemData = req.body;
//   const newItem = {
//     ...itemData,
//     id: Math.random().toString(),
//   };

//   const updatedItems = [newItem, ...existingItems];
//   await storeItems(updatedItems);
//   res.status(201).json({ message: "Stored new item.", item: newItem });
// });

app.listen(8080);
