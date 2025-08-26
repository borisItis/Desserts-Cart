fetch("./data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .catch((err) => console.error(err));

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

  if (cartItems.length === 0) {
    cartItemsList.innerHTML = `<li class="empty">В корзине пока нет товаров</li>`;
    cartTotal.textContent = `Total: $0.00`;
    cartCounter.textContent = "0";
    return;
  }

  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;
    cartItemsList.innerHTML += `
      <li class="dessert-card__modal-item">
        <div>
          <span>${item.name}</span> 
          <span>x${item.quantity}</span>
        </div>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove-item" data-index="${index}">&times;</button>
      </li>
    `;
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  cartCounter.textContent = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  cartItemsList.querySelectorAll(".remove-item").forEach((btn) =>
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      removeItem(idx);
    })
  );
};

const updateQuantity = (name, change) => {
  const item = cartItems.find((i) => i.name === name);
  if (!item) return;
  item.quantity += change;

  if (item.quantity <= 0) {
    removeItem(cartItems.indexOf(item));
  } else {
    updateCartDisplay();
  }
};

const removeItem = (index) => {
  if (index >= 0 && index < cartItems.length) {
    const item = cartItems[index];
    const addButton = item.element.querySelector(".dessert-card__add-btn");
    const controls = item.element.querySelector(".dessert-card__btn-control");
    if (addButton) addButton.style.display = "inline-block";
    if (controls) controls.style.display = "none";
    cartItems.splice(index, 1);
    updateCartDisplay();
  }
};

cartIcon.addEventListener("click", () => {
  const isVisible = cartModal.classList.toggle("dessert-card__modal--visible");
  document.body.classList.toggle("no-scroll", isVisible);
});

confirmBtn.addEventListener("click", () => {
  if (cartItems.length === 0) return;
  alert("Спасибо за заказ! Мы скоро свяжемся с вами.");
  cartItems.length = 0;
  updateCartDisplay();
  cartModal.classList.remove("dessert-card__modal--visible");
  document.body.classList.remove("no-scroll");
});

document.addEventListener("click", (e) => {
  const isClickInside = cartModal.contains(e.target);
  const isCartIcon = cartIcon.contains(e.target);
  if (!isClickInside && !isCartIcon) {
    cartModal.classList.remove("dessert-card__modal--visible");
    document.body.classList.remove("no-scroll");
  }
});
