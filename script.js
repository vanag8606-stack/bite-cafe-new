const TELEGRAM_URL = "https://t.me/BiteCafeOrderBot";

// Sample menu and prices — replace with the cafe's approved menu before launch.
const products = [
  { id: 1, name: "Класичний бургер", category: "burger", price: 149, emoji: "🍔", badge: "ФАВОРИТ", description: "Яловичина, чедер, салат, томат і соус Bite.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=850&q=85", alt: "Класичний бургер із сиром та овочами" },
  { id: 2, name: "Подвійний смаш", category: "burger", price: 199, emoji: "🍔", badge: "ПОДВІЙНИЙ", description: "Дві яловичі котлети, подвійний чедер і пікантний соус.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=850&q=85", alt: "Чізбургер із подвійним сиром" },
  { id: 3, name: "BBQ Бекон", category: "burger", price: 209, emoji: "🍔", badge: "BBQ LOVE", description: "Бекон, сир, карамелізована цибуля та соус барбекю.", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=850&q=85", alt: "Бургер із беконом" },
  { id: 4, name: "Кріспі чікен", category: "burger", price: 169, emoji: "🍗", badge: "ХРУМКО", description: "Хрумка курка, салат, маринований огірок і ніжний соус.", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=850&q=85", alt: "Бургер із хрумкою куркою" },
  { id: 5, name: "Спайсі бургер", category: "burger", price: 189, emoji: "🌶️", badge: "З ВОГНИКОМ", description: "Соковита котлета, халапеньйо, чедер і гострий соус.", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457b4f?auto=format&fit=crop&w=850&q=85", alt: "Гострий бургер" },
  { id: 6, name: "Пепероні", category: "pizza", price: 229, emoji: "🍕", badge: "ХІТ", description: "Пепероні, томатний соус, моцарела й ароматні трави.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=850&q=85", alt: "Піца пепероні" },
  { id: 7, name: "Маргарита", category: "pizza", price: 199, emoji: "🍕", badge: "КЛАСИКА", description: "Моцарела, стиглі томати, базилік і томатний соус.", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=850&q=85", alt: "Піца Маргарита з базиліком" },
  { id: 8, name: "Чотири сири", category: "pizza", price: 249, emoji: "🧀", badge: "СИРНИЙ", description: "Моцарела, чедер, дорблю та пармезан.", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=850&q=85", alt: "Піца з кількома видами сиру" },
  { id: 9, name: "BBQ Chicken", category: "pizza", price: 259, emoji: "🍕", badge: "ФІРМОВА", description: "Курка, соус барбекю, червона цибуля та моцарела.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=850&q=85", alt: "Піца з куркою та овочами" },
  { id: 10, name: "Картопля фрі", category: "snack", price: 69, emoji: "🍟", badge: "ХРУМ-ХРУМ", description: "Золотиста картопля з сіллю та соусом на вибір.", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=850&q=85", alt: "Золотиста картопля фрі" },
  { id: 11, name: "Сирні кульки", category: "snack", price: 99, emoji: "🧀", badge: "СИРНА РАДІСТЬ", description: "Ніжний розплавлений сир у хрумкій скоринці.", image: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=850&q=85", alt: "Сирні закуски" },
  { id: 12, name: "Курячі нагетси", category: "snack", price: 109, emoji: "🍗", badge: "CRUNCH", description: "Курячі шматочки в золотистій паніровці та соус.", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=850&q=85", alt: "Хрумкі курячі нагетси" },
  { id: 13, name: "Крильця BBQ", category: "snack", price: 149, emoji: "🍗", badge: "СОУС MUST", description: "Запечені курячі крильця в ароматному соусі BBQ.", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=850&q=85", alt: "Курячі крильця в соусі" },
  { id: 14, name: "Комбо Bite", category: "meal", price: 269, emoji: "🍔", badge: "КОМБО", description: "Класичний бургер, фрі та напій — усе в одному.", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457b4f?auto=format&fit=crop&w=850&q=85", alt: "Бургер із гарніром" },
  { id: 15, name: "Рол із куркою", category: "meal", price: 159, emoji: "🌯", badge: "ЗРУЧНО ЇСТИ", description: "Курка, свіжі овочі, сир і соус у тонкому лаваші.", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=850&q=85", alt: "Рол із куркою та овочами" },
  { id: 16, name: "Цезар-рол", category: "meal", price: 169, emoji: "🌯", badge: "СВІЖИЙ ВИБІР", description: "Курка, салат, пармезан і соус Цезар у лаваші.", image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c3?auto=format&fit=crop&w=850&q=85", alt: "Рол із куркою та зеленню" },
  { id: 17, name: "Кола", category: "drink", price: 45, emoji: "🥤", badge: "ICE COLD", description: "Класична солодка газована вода — найкраща пара до фрі.", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=850&q=85", alt: "Склянка коли з льодом" },
  { id: 18, name: "Домашній лимонад", category: "drink", price: 69, emoji: "🍋", badge: "СВІЖІСТЬ", description: "Лимон, м'ята, лід і легка цитрусова кислинка.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=850&q=85", alt: "Освіжаючий лимонад з лимоном" },
  { id: 19, name: "Айс-лате", category: "drink", price: 79, emoji: "🧋", badge: "COFFEE TIME", description: "Кава, молоко та лід для холодного кавового настрою.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=850&q=85", alt: "Холодна кава з молоком" },
  { id: 20, name: "Мілкшейк", category: "drink", price: 89, emoji: "🥤", badge: "CREAMY", description: "Густий молочний коктейль із ніжним вершковим смаком.", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=850&q=85", alt: "Молочний коктейль" },
  { id: 21, name: "Пончик", category: "dessert", price: 59, emoji: "🍩", badge: "SWEET BITE", description: "М'яке тісто, солодка глазур і гарний настрій.", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=850&q=85", alt: "Пончики з глазур'ю" },
  { id: 22, name: "Чізкейк", category: "dessert", price: 99, emoji: "🍰", badge: "НЕЖНІСТЬ", description: "Ніжний вершковий десерт на крихкій основі.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=850&q=85", alt: "Шматочок чізкейку" },
  { id: 23, name: "Брауні", category: "dessert", price: 79, emoji: "🍫", badge: "CHOCOLATE", description: "Насичений шоколадний смак із вологою серединкою.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=850&q=85", alt: "Шоколадний брауні" },
  { id: 24, name: "Морозиво", category: "dessert", price: 75, emoji: "🍦", badge: "СОЛОДКИЙ ФІНАЛ", description: "Ніжне морозиво для солодкого завершення.", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=850&q=85", alt: "Морозиво у вафельному ріжку" }
];

const productsBox = document.getElementById("products");
const filtersBox = document.querySelector(".filters");
const searchInput = document.getElementById("menu-search");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
let currentCategory = "all";
let searchTerm = "";
const CART_STORAGE_KEY = "biteCafeCartV1";
const cart = loadCart();

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const valid = {};
    for (const [idText, qty] of Object.entries(parsed)) {
      const id = Number(idText);
      if (products.some(p => p.id === id) && Number.isInteger(qty) && qty > 0) {
        valid[id] = Math.min(35, qty);
      }
    }
    return valid;
  } catch {
    return {};
  }
}

function saveCart() {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch { /* Private browsing may disable storage. */ }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function money(value) {
  return `${value.toLocaleString("uk-UA")} ₴`;
}

function cartQuantity() {
  return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

function cartTotal() {
  return products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
}

function productCard(product, index) {
  const name = escapeHTML(product.name);
  const description = escapeHTML(product.description);
  const alt = escapeHTML(product.alt);
  const image = escapeHTML(product.image);
  const emoji = escapeHTML(product.emoji);
  const badge = escapeHTML(product.badge);
  const stagger = index % 4;
  const quantity = cart[product.id] || 0;

  return `
    <article class="product" style="--card-order:${stagger}">
      <div class="product-image-link" aria-label="${name}">
        <div class="product-media">
          <img src="${image}" alt="${alt}" loading="lazy" decoding="async" onerror="this.hidden=true; this.parentElement.classList.add('image-missing')">
          <span class="product-fallback" aria-hidden="true">${emoji}</span>
          <span class="product-badge">${badge}</span>
          <span class="product-image-arrow" aria-hidden="true">✦</span>
        </div>
      </div>
      <div class="product-content">
        <div class="product-title-row"><h3>${name}</h3><span class="product-mini-emoji" aria-hidden="true">${emoji}</span></div>
        <p>${description}</p>
        <div class="product-bottom">
          <span class="price">${product.price}<small>₴</small></span>
          <button class="order-card-button" type="button" data-add-to-cart="${product.id}" aria-label="Додати ${name} до кошика">${quantity ? `У кошику · ${quantity}` : "+ У кошик"} <span aria-hidden="true">＋</span></button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase("uk-UA");
  const filtered = products.filter(product => {
    const categoryMatches = currentCategory === "all" || product.category === currentCategory;
    const searchMatches = !normalizedSearch || `${product.name} ${product.description} ${product.badge}`.toLocaleLowerCase("uk-UA").includes(normalizedSearch);
    return categoryMatches && searchMatches;
  });

  productsBox.innerHTML = filtered.map(productCard).join("");
  productsBox.hidden = filtered.length === 0;
  emptyState.hidden = filtered.length !== 0;
  resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "страва" : filtered.length > 1 && filtered.length < 5 ? "страви" : "страв"}`;
  const allFilter = document.querySelector('[data-category="all"] span');
  if (allFilter) allFilter.textContent = String(products.length).padStart(2, "0");
}

// Cart drawer is injected here so there is no checkout form or fake order form on the website.
document.body.insertAdjacentHTML("beforeend", `
  <button class="cart-fab" id="cart-fab" type="button" aria-label="Відкрити кошик" aria-controls="cart-overlay" aria-expanded="false" hidden>
    <span class="cart-fab-icon" aria-hidden="true">🛒</span>
    <span class="cart-fab-label">Мій кошик <small id="cart-fab-summary">0 товарів</small></span>
    <span class="cart-fab-count" id="cart-fab-count">0</span>
    <span class="cart-fab-total" id="cart-fab-total">0 ₴</span>
  </button>
  <div class="cart-overlay" id="cart-overlay" hidden>
    <button class="cart-backdrop" type="button" data-close-cart aria-label="Закрити кошик"></button>
    <aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabindex="-1">
      <div class="cart-drawer-header">
        <div><span class="cart-eyebrow">BITE CAFE · CHECKOUT</span><h2 id="cart-title">Твій кошик<span>.</span></h2><p>Перевір замовлення перед переходом у Telegram.</p></div>
        <button class="cart-close" type="button" data-close-cart aria-label="Закрити кошик">×</button>
      </div>
      <div class="cart-progress"><span></span></div>
      <div class="cart-items" id="cart-items"></div>
      <div class="cart-empty" id="cart-empty" hidden><span>🛍️</span><h3>Поки тут порожньо</h3><p>Додай щось смачне з меню — підрахунок зробимо автоматично.</p><button type="button" class="btn btn-dark" data-close-cart>До меню</button></div>
      <div class="cart-summary" id="cart-summary">
        <div class="cart-summary-line"><span>Товарів</span><strong id="cart-items-subtotal">0</strong></div>
        <div class="cart-summary-line"><span>Доставка</span><strong>Уточнюється в боті</strong></div>
        <div class="cart-grand-total"><span>Разом за страви</span><strong id="cart-grand-total">0 ₴</strong></div>
        <p>Адресу, телефон і спосіб оплати введеш у Telegram. Вартість доставки, якщо є, підтвердить кафе.</p>
        <a class="cart-checkout" id="cart-checkout" href="https://t.me/BiteCafeOrderBot" aria-label="Продовжити оформлення замовлення в Telegram" aria-disabled="true">Перейти до оформлення <span>↗</span></a>
        <button type="button" class="cart-continue" data-close-cart>← Повернутися до меню</button>
      </div>
    </aside>
  </div>
  <div class="cart-toast" id="cart-toast" aria-live="polite" role="status"></div>
`);

const cartFab = document.getElementById("cart-fab");
const cartOverlay = document.getElementById("cart-overlay");
const cartDrawer = document.querySelector(".cart-drawer");
const cartItemsBox = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartSummary = document.getElementById("cart-summary");
const checkoutLink = document.getElementById("cart-checkout");
let lastFocusedElement = null;
let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById("cart-toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

function updateCartUI() {
  const ids = Object.keys(cart).map(Number).filter(id => cart[id] > 0);
  const count = cartQuantity();
  const total = cartTotal();
  cartFab.hidden = count === 0;
  document.getElementById("cart-fab-count").textContent = String(count);
  document.getElementById("cart-fab-total").textContent = money(total);
  document.getElementById("cart-fab-summary").textContent = `${count} ${count === 1 ? "товар" : count < 5 ? "товари" : "товарів"}`;
  document.getElementById("cart-items-subtotal").textContent = String(count);
  document.getElementById("cart-grand-total").textContent = money(total);
  cartEmpty.hidden = count > 0;
  cartSummary.hidden = count === 0;
  cartItemsBox.hidden = count === 0;

  cartItemsBox.innerHTML = ids.map(id => {
    const product = products.find(item => item.id === id);
    const qty = cart[id];
    return `<article class="cart-item">
      <img src="${escapeHTML(product.image)}" alt="" loading="lazy" onerror="this.hidden=true">
      <div class="cart-item-info"><h3>${escapeHTML(product.name)}</h3><span>${money(product.price)} / шт.</span>
        <div class="cart-qty-control"><button type="button" data-qty-change="-1" data-item-id="${id}" aria-label="Зменшити кількість ${escapeHTML(product.name)}">−</button><strong>${qty}</strong><button type="button" data-qty-change="1" data-item-id="${id}" aria-label="Збільшити кількість ${escapeHTML(product.name)}" ${qty >= 35 ? "disabled" : ""}>+</button></div>
      </div>
      <div class="cart-item-end"><strong>${money(product.price * qty)}</strong><button type="button" data-remove-item="${id}" class="cart-remove" aria-label="Видалити ${escapeHTML(product.name)}">Видалити</button></div>
    </article>`;
  }).join("");

  // Telegram deep-link payload is compact and under Telegram's 64-character limit.
  const payload = encodeCartForTelegram(ids);
  if (count > 0 && payload && payload.length <= 64) {
    checkoutLink.href = `${TELEGRAM_URL}?start=${payload}`;
    checkoutLink.setAttribute("aria-disabled", "false");
    checkoutLink.title = "Передати кошик у Telegram і продовжити оформлення";
  } else {
    checkoutLink.href = "#";
    checkoutLink.setAttribute("aria-disabled", "true");
  }
  saveCart();
}

function encodeCartForTelegram(ids) {
  // Each product ID and quantity is encoded as one base-36 character: cart_<id><qty>...
  // 24 products x 2 chars + 5-char prefix = 53, within Telegram's 64-char start parameter limit.
  let encoded = "cart_";
  for (const id of ids.sort((a, b) => a - b)) {
    const qty = cart[id];
    if (!Number.isInteger(qty) || qty < 1 || qty > 35 || id < 1 || id > 35) return "";
    encoded += id.toString(36) + qty.toString(36);
  }
  return encoded;
}

function openCart() {
  lastFocusedElement = document.activeElement;
  cartOverlay.hidden = false;
  document.body.classList.add("cart-open");
  cartFab.setAttribute("aria-expanded", "true");
  cartDrawer.focus();
}

function closeCart() {
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");
  cartFab.setAttribute("aria-expanded", "false");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
}

function addToCart(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;
  const current = cart[product.id] || 0;
  if (current >= 35) {
    showToast("Максимум 35 одиниць однієї страви в одному замовленні.");
    return;
  }
  cart[product.id] = current + 1;
  renderProducts();
  updateCartUI();
  showToast(`${product.emoji} ${product.name} додано до кошика`);
}

productsBox.addEventListener("click", event => {
  const button = event.target.closest("[data-add-to-cart]");
  if (button) addToCart(button.dataset.addToCart);
});

cartFab.addEventListener("click", openCart);
cartOverlay.addEventListener("click", event => {
  if (event.target.closest("[data-close-cart]")) closeCart();
  const qtyButton = event.target.closest("[data-qty-change]");
  if (qtyButton) {
    const id = Number(qtyButton.dataset.itemId);
    const delta = Number(qtyButton.dataset.qtyChange);
    const next = (cart[id] || 0) + delta;
    if (next <= 0) delete cart[id];
    else if (next <= 35) cart[id] = next;
    renderProducts();
    updateCartUI();
  }
  const removeButton = event.target.closest("[data-remove-item]");
  if (removeButton) {
    delete cart[Number(removeButton.dataset.removeItem)];
    renderProducts();
    updateCartUI();
    showToast("Страву видалено з кошика");
  }
});

checkoutLink.addEventListener("click", event => {
  if (checkoutLink.getAttribute("aria-disabled") === "true" || cartQuantity() === 0) {
    event.preventDefault();
    showToast("Спочатку додай страви до кошика.");
    return;
  }
  // Allow the browser to open the Telegram deep link. The bot reconstructs the cart and total from it.
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !cartOverlay.hidden) closeCart();
});

filtersBox.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  currentCategory = button.dataset.category;
  filtersBox.querySelectorAll(".filter").forEach(filter => {
    const active = filter === button;
    filter.classList.toggle("active", active);
    filter.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

const mobileToggle = document.querySelector(".mobile-menu-toggle");
const nav = document.querySelector(".main-nav");
mobileToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
  mobileToggle.setAttribute("aria-label", isOpen ? "Закрити навігацію" : "Відкрити навігацію");
  mobileToggle.textContent = isOpen ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.setAttribute("aria-label", "Відкрити навігацію");
    mobileToggle.textContent = "☰";
  });
});

renderProducts();
updateCartUI();
