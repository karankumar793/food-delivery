// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
        category: "electronics",
        rating: 4.5,
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80",
        category: "electronics",
        rating: 4.2,
        description: "Feature-rich smartwatch with health tracking"
    },
    {
        id: 3,
        name: "Denim Jacket",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=300&q=80",
        category: "fashion",
        rating: 4.0,
        description: "Classic denim jacket for all seasons"
    },
    {
        id: 4,
        name: "Table Lamp",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80",
        category: "home",
        rating: 4.8,
        description: "Modern table lamp with adjustable brightness"
    },
    {
        id: 5,
        name: "Novel Collection",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
        category: "books",
        rating: 4.6,
        description: "Collection of bestselling novels"
    }
];

// Cart state
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const loginModal = document.getElementById('loginModal');
const overlay = document.getElementById('overlay');
const searchInput = document.getElementById('searchInput');
const priceRange = document.getElementById('priceRange');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const categoryFilters = document.querySelectorAll('.filter-group input[type="checkbox"]');
const ratingFilters = document.querySelectorAll('.filter-group input[type="radio"]');
const applyFiltersBtn = document.querySelector('.apply-filters');
const loginBtn = document.querySelector('.login-btn');

// Display products
function displayProducts(filteredProducts = products) {
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="rating">
                    ${"★".repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? "½" : ""}
                    <span class="rating-number">${product.rating}</span>
                </div>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showCart();
}

// Update cart
function updateCart() {
    // Update cart items display
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Update cart count
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Show/hide cart
function showCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function hideCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Filter products
function filterProducts() {
    let filteredProducts = [...products];

    // Price filter
    const minPriceValue = parseFloat(minPrice.value);
    const maxPriceValue = parseFloat(maxPrice.value);
    filteredProducts = filteredProducts.filter(product => 
        product.price >= minPriceValue && product.price <= maxPriceValue
    );

    // Category filter
    const selectedCategories = Array.from(categoryFilters)
        .filter(input => input.checked)
        .map(input => input.value);
    
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }

    // Rating filter
    const selectedRating = document.querySelector('input[name="rating"]:checked')?.value;
    if (selectedRating) {
        filteredProducts = filteredProducts.filter(product => 
            product.rating >= parseFloat(selectedRating)
        );
    }

    displayProducts(filteredProducts);
}

// Search products
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    displayProducts(filteredProducts);
}

// Show/hide modals
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    overlay.classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    overlay.classList.remove('active');
}

// Event listeners
cartIcon.addEventListener('click', showCart);
closeCart.addEventListener('click', hideCart);
overlay.addEventListener('click', () => {
    hideCart();
    hideModal('checkoutModal');
    hideModal('loginModal');
});

checkoutBtn.addEventListener('click', () => {
    hideCart();
    showModal('checkoutModal');
});

loginBtn.addEventListener('click', () => showModal('loginModal'));

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        hideModal('checkoutModal');
        hideModal('loginModal');
    });
});

searchInput.addEventListener('input', (e) => searchProducts(e.target.value));

priceRange.addEventListener('input', (e) => {
    maxPrice.value = e.target.value;
});

minPrice.addEventListener('input', (e) => {
    if (parseFloat(e.target.value) > parseFloat(maxPrice.value)) {
        e.target.value = maxPrice.value;
    }
});

maxPrice.addEventListener('input', (e) => {
    if (parseFloat(e.target.value) < parseFloat(minPrice.value)) {
        e.target.value = minPrice.value;
    }
    priceRange.value = e.target.value;
});

applyFiltersBtn.addEventListener('click', filterProducts);

// Handle checkout form
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically process the payment and send order to backend
    alert('Order placed successfully! Thank you for shopping with us.');
    cart = [];
    updateCart();
    hideModal('checkoutModal');
});

// Handle login form
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically handle authentication
    alert('Login successful!');
    hideModal('loginModal');
});

// Initialize
displayProducts();
