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
const cartCounter = document.querySelector(".cart-icon__count");

document.querySelector(".desserts__list").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const card = btn.closest(".dessert-card");
  const name = card.querySelector(".dessert-card__name").textContent;
  const price = parseFloat(
    card.querySelector(".dessert-card__price").textContent.replace("$", "")
  );

  if (btn.classList.contains("dessert-card__add-btn")) {
    addToCart(name, price, card);
  } else if (btn.classList.contains("decrease")) {
    updateQuantity(name, -1);
  } else if (btn.classList.contains("increase")) {
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

    const controls = card.querySelector(".dessert-card__btn-control");
    if (controls) controls.style.display = "flex";

    const addBtn = card.querySelector(".dessert-card__add-btn");
    if (addBtn) addBtn.style.display = "none";
  }

  updateCartDisplay();
};
const updateCartDisplay = () => {
  cartItems.forEach((item) => {
    const quantityElement = item.element.querySelector(".quantity");
    if (quantityElement) quantityElement.textContent = item.quantity;
  });

  if (cartItemsList) {
    cartItemsList.innerHTML = "";
    let total = 0;

    cartItems.forEach((item) => {
      const li = document.createElement("li");
      li.className = "dessert-card__modal-item";
      li.innerHTML = `
        <div class="dessert-card__modal-item-info">
          <span>${item.name}</span>
          <span>x${item.quantity}</span>
        </div>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      `;
      cartItemsList.appendChild(li);
      total += item.price * item.quantity;
    });

    if (cartTotal) cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }
  cartIcon.querySelector(".cart-icon__count").textContent = cartItems.length;
};

const updateQuantity = (name, change) => {
  const item = cartItems.find((item) => item.name === name);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + change);
  updateCartDisplay();
};
cartIcon.addEventListener("click", () => {
  cartModal.classList.toggle("dessert-card__modal--visible");
});

document
  .querySelector(".dessert-card__modal-btn")
  .addEventListener("click", () => {
    alert("Order confirmed! Thank you!");
    updateCartDisplay();
  });
