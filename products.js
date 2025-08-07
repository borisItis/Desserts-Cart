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
  const buttom = e.target.closest("button");
  if (!buttom) return;

  const card = buttom.closest(".dessert-card");
  const name = card.querySelector(".dessert-card__name").textContent;
  const price = parseFloat(
    card.querySelector(".dessert-card__price").textContent.replace("$", "")
  );

  if (buttom.classList.contains("dessert-card__add-btn")) {
    addCart(name, price, card);
  } else if (buttom.classList.contains("decrease")) {
    updateQuantity(name, -1);
  } else if (buttom.classList.contains("increase")) {
    updateQuantity(name, 1);
  }
});

const addCart = (name, price, card) => {
  const exItem = cartItems.find((item) => item.name === name);

  if (exItem) {
    exItem.quantity++;
  } else {
    cartItems.push({ name, price, quantity: 1, element: card });

    const controls = card.querySelector(".dessert-card__btn-control");
    if (controls) controls.style.display = "flex";

    const addButton = card.querySelector(".dessert-card__add-btn");
    if (addButton) addButton.style.display = "none";
  }

  updateCartDisplay();
};

const updateCartDisplay = () => {
  cartItems.forEach((item) => {
    const quantityElement = item.element.querySelector(".quantity");
    if (quantityElement) quantityElement.textContent = item.quantity;
  });

  cartItemsList.innerHTML = "";
  let total = 0;

  cartItems.forEach((item) => {
    total += item.price * item.quantity;
    cartItemsList.innerHTML += `
          <li class="dessert-card__modal-item">
            <div>
              <span>${item.name}</span> <span>x${item.quantity}</span>
            </div>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        `;
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  cartCounter.textContent = cartItems.length;
};

const updateQuantity = (name, change) => {
  const item = cartItems.find((item) => item.name === name);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + change);
  updateCartDisplay();
};

cartIcon.addEventListener("click", () => {
  cartModal.classList.toggle("dessert-card__modal--visible");
  document.body.classList.toggle("no-scroll");
});

confirmBtn.addEventListener("click", () => {
  alert("Спасибо за заказ! Мы скоро свяжемся с вами.");
  updateCartDisplay();
});

document.addEventListener("click", (e) => {
  const isClickInside = cartModal.contains(e.target);
  const isCartIcon = cartIcon.contains(e.target);
  if (!isClickInside && !isCartIcon) {
    cartModal.classList.remove("dessert-card__modal--visible");
  }
});
