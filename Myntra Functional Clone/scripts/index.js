let bagItems;
onLoad();

function onLoad() {
  let bagItemsStr = localStorage.getItem('bagItems');
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : []; 
  displayItemOnHomePage();
  displayBagIcon();
}

function displayBagIcon() {
  const bagItemCountElement = document.querySelector(".bag-item-count");
  if (bagItems.length > 0) {
    bagItemCountElement.innerText = bagItems.length;
    bagItemCountElement.style.visibility = "visible";
  } else {
    bagItemCountElement.style.visibility = "hidden";
  }
}

function addToBag(itemId) {
  bagItems.push(itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  displayBagIcon();
}

function displayItemOnHomePage() {
  const itemsContainerElement = document.querySelector(".items-container");
  if (!itemsContainerElement) {
    return;
  }
  let innerHTML = ``;
  items.forEach((item) => {
    innerHTML += `
  <div class="item-container">
    <a href="./pages/product.html" class="product-item-display" data-id="${item.id}">
      <img class="item-image" src="${item.image}" alt="Item Image" />
      <div class="rating">${item.rating.stars} ⭐ | ${item.rating.count}</div>
      <div class="company-name">${item.company}</div>
      <div class="item-name">${item.item_name}</div>
      <div class="price">
        <span class="current-price">Rs ${item.current_price}</span>
        <span class="original-price">Rs ${item.original_price}</span>
        <span class="discount">(${item.discount_percentage}% OFF)</span>
      </div>
    </a>
    <button class="btn-add-bag" onclick="addToBag(${item.id});">Add to Bag</button>
  </div>`;
  });
  itemsContainerElement.innerHTML = innerHTML;
}

const productPage = document.querySelectorAll('.product-item-display');
let productPageItem = JSON.parse(localStorage.getItem("Product Page Item")) || [];

productPage.forEach(el => {
  el.addEventListener("click", (e) => {
    const id = Number(el.dataset.id);
    productPageItem = [];
    productPageItem.push(id);
    console.log("Clicked item id:", id);
    localStorage.setItem("Product Page Item",JSON.stringify(productPageItem));
  });
});

let selectedItem = items.find(item => item.id == productPageItem[0]);

