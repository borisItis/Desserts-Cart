fetch("./data.json").then((response) => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
});

// Основные элементы и переменные
const cartItems = [];
const dessertsList = document.querySelector(".desserts__list");
const modal = document.querySelector(".dessert-card__modal");

// Обработчик кликов по списку десертов
dessertsList.addEventListener("click", (e) => {
  const target = e.target;

  // Добавление в корзину
  if (target.closest(".dessert-card__add-btn")) {
    const button = target.closest(".dessert-card__add-btn");
    const card = button.closest(".dessert-card");
    const name = card.querySelector(".dessert-card__name").textContent;
    const price = parseFloat(
      card.querySelector(".dessert-card__price").textContent.replace("$", "")
    );

    addToCart(name, price, card);
  }

  // Увеличение количества
  if (target.classList.contains("increase")) {
    const button = target.closest(".increase");
    const name = button.dataset.name;
    changeQuantity(name, 1);
  }

  // Уменьшение количества
  if (target.classList.contains("decrease")) {
    const button = target.closest(".decrease");
    const name = button.dataset.name;
    changeQuantity(name, -1);
  }
});

// Функция добавления в корзину
function addToCart(name, price, card) {
  const existingItem = cartItems.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      name: name,
      price: price,
      quantity: 1,
    });

    // Создаем элементы управления количеством
    const controlsHTML = `
      <div class="cart-controls">
        <button class="decrease" data-name="${name}">-</button>
        <span class="quantity">1</span>
        <button class="increase" data-name="${name}">+</button>
      </div>
    `;
    card
      .querySelector(".dessert-card__image-wrapper")
      .insertAdjacentHTML("beforeend", controlsHTML);
  }

  // Обновляем отображение
  card.querySelector(".dessert-card__add-btn").style.display = "none";
  card.querySelector(".cart-controls").style.display = "flex";
  card.querySelector(".quantity").textContent = cartItems.find(
    (item) => item.name === name
  ).quantity;
}

// Функция изменения количества
function changeQuantity(name, change) {
  const item = cartItems.find((item) => item.name === name);
  if (!item) return;

  item.quantity += change;

  // Обновляем отображение
  const quantityElements = document.querySelectorAll(
    `.cart-controls [data-name="${name}"] + .quantity`
  );
  quantityElements.forEach((el) => {
    el.textContent = item.quantity;
  });

  // Если количество стало 0, удаляем товар
  if (item.quantity <= 0) {
    removeFromCart(name);
  }
}

// Функция удаления из корзины
function removeFromCart(name) {
  const index = cartItems.findIndex((item) => item.name === name);
  if (index === -1) return;

  cartItems.splice(index, 1);

  // Обновляем отображение
  const cards = document.querySelectorAll(".dessert-card");
  cards.forEach((card) => {
    if (card.querySelector(".dessert-card__name").textContent === name) {
      card.querySelector(".dessert-card__add-btn").style.display = "flex";
      const controls = card.querySelector(".cart-controls");
      if (controls) controls.remove();
    }
  });
}

// Модальное окно
document.addEventListener("click", (e) => {
  // Открытие модального окна
  if (e.target.classList.contains("view-cart")) {
    showModal();
  }

  // Закрытие модального окна
  if (e.target === modal || e.target.classList.contains("close-modal")) {
    modal.style.display = "none";
  }

  // Подтверждение заказа
  if (e.target.classList.contains("confirm-btn")) {
    alert("Order confirmed! Thank you!");
    modal.style.display = "none";
  }

  // Новый заказ
  if (e.target.classList.contains("new-order-btn")) {
    cartItems.length = 0;
    updateCartDisplay();
    modal.style.display = "none";
    alert("New order started!");
  }
});

// Показать модальное окно
function showModal() {
  const cartItemsList = modal.querySelector(".cart-items");
  const totalPriceElement = modal.querySelector(".total-price");

  cartItemsList.innerHTML = "";
  let total = 0;

  cartItems.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(
      item.price * item.quantity
    ).toFixed(2)}
    `;
    cartItemsList.appendChild(li);
    total += item.price * item.quantity;
  });

  totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
  modal.style.display = "flex";
}

// Обновить отображение корзины
function updateCartDisplay() {
  const cards = document.querySelectorAll(".dessert-card");
  cards.forEach((card) => {
    const name = card.querySelector(".dessert-card__name").textContent;
    const item = cartItems.find((item) => item.name === name);

    if (item) {
      card.querySelector(".dessert-card__add-btn").style.display = "none";
      const controls =
        card.querySelector(".cart-controls") || createControls(card, name);
      controls.style.display = "flex";
      controls.querySelector(".quantity").textContent = item.quantity;
    } else {
      card.querySelector(".dessert-card__add-btn").style.display = "flex";
      const controls = card.querySelector(".cart-controls");
      if (controls) controls.style.display = "none";
    }
  });
}

// Создать элементы управления
function createControls(card, name) {
  const controlsHTML = `
    <div class="cart-controls">
      <button class="decrease" data-name="${name}">-</button>
      <span class="quantity">1</span>
      <button class="increase" data-name="${name}">+</button>
      <button class="remove" data-name="${name}">Remove</button>
    </div>
  `;
  card
    .querySelector(".dessert-card__image-wrapper")
    .insertAdjacentHTML("beforeend", controlsHTML);
  return card.querySelector(".cart-controls");
}

// Добавить кнопку просмотра корзины
const cartButton = document.createElement("button");
cartButton.className = "view-cart";
cartButton.textContent = "View Cart (" + cartItems.length + ")";
document.querySelector(".desserts").appendChild(cartButton);

// Обновлять кнопку корзины при изменениях
function updateCartButton() {
  cartButton.textContent =
    "View Cart (" +
    cartItems.reduce((total, item) => total + item.quantity, 0) +
    ")";
}
