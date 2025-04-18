const API_KEY = "bf47584e-ef32-481c-b592-921572ca5b0f";
const API_URL = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods";
const productsGrid = document.querySelector(".products-grid");
const loadMoreButton = document.querySelector(".load-more");
const sortSelect = document.querySelector(".sort-select");

let currentPage = 1;
const perPage = 10; // Количество товаров на странице

function showNotification(message, type = 'info', timeout = 5000) {
    // Найти область для уведомлений
    const notificationContainer = 
    document.querySelector('.notifications-container');
    if (!notificationContainer) {
        console.error('Уведомления контейнер отсутствует в HTML!');
        return;
    }

    // Создать новое уведомление
    const notification = document.createElement('div');
    notification.className = `notifications ${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <button class="close-btn">X</button>
    `;

    // Добавить уведомление в контейнер
    notificationContainer.appendChild(notification);

    // Закрытие уведомления по кнопке
    const closeButton = notification.querySelector('.close-btn');
    closeButton.onclick = () => {
        notification.remove();
    };

    // Автоматическое скрытие уведомления через `timeout` миллисекунд
    if (timeout > 0) {
        setTimeout(() => {
            notification.remove();
        }, timeout);
    }
}

// Функция для загрузки товаров с сервера
async function fetchGoods(page, sortOrder) {
    try {
        const response = await 
        fetch(
            `${API_URL}?page=${page}&per_page=${perPage}` +
            `&sort_order=${sortOrder}&api_key=${API_KEY}`
        );
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        return null;
    }
}

// Функция для добавления ID товара в localStorage
function addToLocalStorage(id) {
    const storedIds = JSON.parse(localStorage.getItem("selectedGoods")) || [];
    if (!storedIds.includes(id)) {
        storedIds.push(id);
        localStorage.setItem("selectedGoods", JSON.stringify(storedIds));
    }
}

function renderStars(rating) {
    const roundedRating = Math.round(rating); 
    const fullStars = roundedRating;
    const emptyStars = 5 - fullStars;
    return `<span class="rating-number">
    ${rating}</span> <span class="rating-stars">
    ${'★'.repeat(fullStars) + '☆'.repeat(emptyStars)}</span>`;
}

function calculateDiscountPercentage(actualPrice, discountPrice) {
    return Math.round(((actualPrice - discountPrice) / actualPrice) * 100);
}

function renderGoods(goods) {
    const storedIds = JSON.parse(localStorage.getItem("selectedGoods")) || [];

    goods.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";

        if (storedIds.includes(item.id)) {
            card.classList.add("selected");
        }

        const img = document.createElement("img");
        img.src = item.image_url;
        img.alt = item.name;

        const name = document.createElement("h3");
        name.textContent = item.name;

        const category = document.createElement("p");
        category.textContent = `Категория: ${item.main_category}`;

        const rating = document.createElement("p");
        rating.className = "product-rating";
        rating.innerHTML = `Рейтинг: 
        ${renderStars(item.rating)}`;

        const price = document.createElement("p");
        const actualPrice = `${item.actual_price} ₽`;
        const discountPrice = item.discount_price
            ? `<span class="discount-price">${item.discount_price} ₽</span>`
            : null;
        const discountPercentage = item.discount_price
            ? `<span class="discount-percentage">-
            ${calculateDiscountPercentage(item.actual_price, 
        item.discount_price)}%</span>`
            : "";

        price.innerHTML = discountPrice
            ? `${discountPrice} <s class='actual_discount'>
            ${actualPrice}</s> ${discountPercentage}`
            : actualPrice;

        const addButton = document.createElement("button");
        addButton.textContent = "Добавить";
        addButton.className = "add-to-cart-btn";

        addButton.addEventListener("click", () => {
            addToLocalStorage(item.id);
            card.classList.add("selected"); 
        });

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(category);
        card.appendChild(rating);
        card.appendChild(price);
        card.appendChild(addButton);

        productsGrid.appendChild(card);
    });
}


// Функция для загрузки товаров и обновления состояния кнопки "Загрузить ещё"
async function loadGoods() {
    const sortOrder = 
    sortSelect.value; // Получаем выбранный параметр сортировки
    const data = await fetchGoods(currentPage, sortOrder);

    if (data) {
        renderGoods(data.goods);

        // Проверяем, достигнут ли конец списка
        const totalPages = Math.ceil(data._pagination.total_count / perPage);
        if (currentPage >= totalPages) {
            loadMoreButton.style.display = "none"; // Скрываем кнопку
        } else {
            currentPage++; // Увеличиваем номер текущей страницы
        }
    } else {
        console.error("Не удалось загрузить товары.");
    }
}

function displayLocalStorage() {
    const storedIds = JSON.parse(localStorage.getItem("selectedGoods")) || [];
    console.log("Выбранные товары:", storedIds);
}

// Событие для кнопки "Загрузить ещё"
if (loadMoreButton) {
    loadMoreButton.addEventListener("click", loadGoods);
}

// Событие для изменения сортировки
sortSelect.addEventListener("change", () => {
    currentPage = 1; // Сбросить страницу при изменении сортировки
    productsGrid.innerHTML = ''; // Очистить текущие товары
    loadGoods();
});

document.addEventListener("DOMContentLoaded", loadGoods);
