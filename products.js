fetch("./data.json").then((response) => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
});

const cartItems = [];
const cartModal = document.querySelector(".dessert-card__modal");
const cartItemsList = document.querySelector(".dessert-card__modal-list");
const cartTotal = document.querySelector(".dessert-card__modal-total");
const confirmBtn = document.querySelector(".dessert-card__modal-btn");
const cartIcon = document.querySelector(".cart-icon");
const cartCount = document.querySelector(".cart-icon__count");

document.querySelector(".desserts__list")?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const card = btn.closest(".dessert-card");
  const name = card.querySelector(".dessert-card__name").textContent;
  const price = parseFloat(
    card.querySelector(".dessert-card__price").textContent.replace("$", "")
  );

  if (btn.classList.contains("dessert-card__add-btn")) {
    addToCart(name, price, card);
    showCart();
  } else if (btn.classList.contains("dessert-card__quantity-decrease")) {
    updateQuantity(name, -1);
  } else if (btn.classList.contains("dessert-card__quantity-increase")) {
    updateQuantity(name, 1);
  }
});

const addToCart = (name, price, card) => {
  const existingItem = cartItems.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({
      name,
      price,
      quantity: 1,
      element: card,
    });
  }

  updateCartDisplay();
};

const updateCartDisplay = () => {
  cartItems.forEach((item) => {
    const { element, quantity } = item;
    const quantityValue = element.querySelector(
      ".dessert-card__quantity-value"
    );
    if (quantityValue) quantityValue.textContent = quantity;
  });

  if (cartItemsList) {
    cartItemsList.innerHTML = "";
    let total = 0;

    cartItems.forEach((item) => {
      const li = document.createElement("li");
      li.className = "dessert-card__modal-item";
      li.innerHTML = `
        <div class="dessert-card__modal-item-info">
          <span class="dessert-card__modal-item-name">${item.name}</span>
          <span class="dessert-card__modal-item-quantity">x${
            item.quantity
          }</span>
        </div>
        <span class="dessert-card__modal-item-price">$${(
          item.price * item.quantity
        ).toFixed(2)}</span>
      `;
      cartItemsList.appendChild(li);
      total += item.price * item.quantity;
    });

    if (cartTotal) cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    if (cartCount)
      cartCount.textContent = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
  }
};

if (cartIcon) {
  cartIcon.addEventListener("click", showCart);
}

const showCart = () => {
  if (cartModal) cartModal.classList.add("dessert-card__modal--visible");
};
const hideCart = () => {
  if (cartModal) cartModal.classList.remove("dessert-card__modal--visible");
};

const updateQuantity = (name, change) => {
  const item = cartItems.find((item) => item.name === name);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(name);
  } else {
    updateCartDisplay();
  }
};

const removeFromCart = (name) => {
  const index = cartItems.findIndex((item) => item.name === name);
  if (index === -1) return;

  cartItems.splice(index, 1);
  updateCartDisplay();
};

updateCartDisplay();
