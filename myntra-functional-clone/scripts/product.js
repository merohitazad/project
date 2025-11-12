const mainSection = document.querySelector("main");

function getProductFromHash() {
  const hash = window.location.hash || "";
  const clean = hash.startsWith("#/")
    ? hash.slice(2)
    : hash.startsWith("#")
    ? hash.slice(1)
    : hash;
  const parts = clean.split("/").filter(Boolean);

  if (parts.length >= 3) {
    const companySlug = parts[0];
    const productSlug = parts[1];
    const id = parts[2];

    const companyName = companySlug.replace(/\+/g, " ");
    const productName = productSlug.replace(/-/g, " ");

    let found = items.find((item) => String(item.id) === String(id));

    if (!found) {
      found = items.find(
        (item) =>
          item.company.toLowerCase() === companyName.toLowerCase() &&
          item.item_name.toLowerCase() === productName.toLowerCase()
      );
    }
    return found || null;
  }
  return null;
}

const selectedItem = getProductFromHash();

if (!selectedItem) {
  mainSection.innerHTML = "<h2>Product not found 😢</h2>";
} else {
  mainSection.innerHTML = `
    <!-- Product main section -->
    <section id="product-description"
      class="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-12 gap-6"
    >
      <!-- Left: Product Image -->
      <div class="md:col-span-5 flex flex-col gap-4">
        <div
          class="aspect-w-4 aspect-h-5 bg-gray-100 rounded-xl overflow-hidden border"
        >
          <img
            src="../${selectedItem.image}"
            alt="${selectedItem.company} ${selectedItem.item_name}"
            class="object-cover w-full h-full"
          />
        </div>
      </div>

      <!-- Right: Product Details -->
      <div class="md:col-span-7 flex flex-col gap-4">
        <h1 class="text-2xl font-semibold text-gray-900">${selectedItem.company}</h1>
        <p class="text-sm text-gray-500">${selectedItem.item_name}</p>

        <!-- Ratings -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1">
            <span class="text-yellow-500 font-bold">${selectedItem.rating.stars}</span>
            <svg
              class="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.154c.969 0 1.371 1.24.588 1.81l-3.37 2.447a1 1 0 00-.364 1.118l1.287 3.945c.3.922-.755 1.688-1.539 1.118L10 13.348l-3.371 2.445c-.783.57-1.838-.196-1.539-1.118l1.287-3.945a1 1 0 00-.364-1.118L2.642 9.373c-.783-.57-.38-1.81.588-1.81h4.154a1 1 0 00.95-.69L9.049 2.927z"
              />
            </svg>
          </div>
          <div class="text-sm text-gray-500">| ${selectedItem.rating.count}</div>
        </div>

        <!-- Price -->
        <div class="flex items-baseline gap-4">
          <div class="text-2xl font-extrabold text-gray-900">Rs ${selectedItem.current_price}</div>
          <div class="text-sm text-gray-500 line-through">Rs ${selectedItem.original_price}</div>
          <div class="text-sm text-green-600 font-semibold">(${selectedItem.discount_percentage}% OFF)</div>
        </div>

        <!-- Add to Bag -->
        <button
          class="w-full bg-green-400 hover:bg-green-500 text-gray-900 font-semibold py-3 rounded-full shadow mt-2" onclick="addToBag(${selectedItem.id})"
        >
          Add to Bag
        </button>

        <!-- Product Description -->
        <div class="mt-4 border-t pt-4">
          <h2 class="text-lg font-medium text-gray-900">
            Product Description
          </h2>
          <p class="text-sm text-gray-600 mt-2 leading-relaxed">
            These elegant Rhodium-Plated CZ Floral Studs from Carlton London
            add a timeless sparkle to your look. Crafted with high-quality
            cubic zirconia stones, they offer a refined shine perfect for both
            daily wear and special occasions. Designed to be lightweight,
            durable, and hypoallergenic.
          </p>
        </div>
      </div>
    </section>`;
}
