const fs = require('node:fs/promises');

async function getBagItems() {
  try {
    const rawFileContent = await fs.readFile('bag.json', { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    return data ?? [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function addBagItem(itemId) {
  try {
    const currentItems = await getBagItems();
    if (itemId) {
      currentItems.push(itemId);
    }
    await fs.writeFile('bag.json', JSON.stringify(currentItems, null, 2));
    return currentItems;
  } catch (error) {
    console.error("Failed to update bag items:", error);
    throw error;
  }
}

async function deleteBagItem(itemId) {
  try {
    const currentItems = await getBagItems();
    const updatedItems = currentItems.filter((id) => id !== itemId);
    await fs.writeFile('bag.json', JSON.stringify(updatedItems, null, 2));
    return updatedItems;
  } catch (error) {
    console.error("Failed to update bag items:", error);
    throw error;
  }
}

exports.getBagItems = getBagItems;
exports.addBagItem = addBagItem;
exports.deleteBagItem = deleteBagItem;  