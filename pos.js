// pos.js - Final 11:30 AM Build with Category Support
let products = [];
let cart = [];
let categories = [];
let activeCategoryId = null;

const productListEl = document.getElementById('product-list');
const cartEl = document.getElementById('cart');
const searchEl = document.getElementById('search');
const categoryContainer = document.getElementById('category-filters');

// --- 1. INITIALIZE ---
async function initializeData() {
    try {
        const [prodRes, catRes] = await Promise.all([
            fetch('get_products.php'),
            fetch('get_categories.php')
        ]);
        
        products = await prodRes.json();
        categories = await catRes.json();
        
        renderCategories();
        applyFilters(); 
        if(searchEl) searchEl.focus(); 
    } catch (e) { 
        console.error("Connection lost", e); 
        productListEl.innerHTML = '<p style="color:red;">Sync Error. Check XAMPP.</p>';
    }
}

// --- 2. RENDER CATEGORY PILLS ---
function renderCategories() {
    if(!categoryContainer) return;
    
    // Always start with "All Items"
    let html = `<button class="cat-btn ${activeCategoryId === null ? 'active' : ''}" onclick="filterByCategory(null)">All Items</button>`;
    
    categories.forEach(cat => {
        html += `<button class="cat-btn ${activeCategoryId == cat.id ? 'active' : ''}" onclick="filterByCategory(${cat.id})">${cat.name}</button>`;
    });
    
    categoryContainer.innerHTML = html;
}

function filterByCategory(id) {
    activeCategoryId = id;
    renderCategories(); // Update UI to show active button
    applyFilters();
}

// --- 3. RENDER PRODUCTS (With Badges) ---
function renderProducts(productsToRender) {
    productListEl.innerHTML = '';
    if (productsToRender.length === 0) {
        productListEl.innerHTML = '<p style="color: #7f8c8d; padding: 20px;">No items found in this section.</p>';
        return;
    }

    productsToRender.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.style.position = 'relative'; 
        div.onclick = () => addToCart(p.id);
        
        const isLow = parseFloat(p.stock_quantity) < 5;
        const badge = isLow ? `<span style="background:#fee2e2; color:#ef4444; padding:4px 8px; border-radius:10px; font-size:10px; font-weight:900; position:absolute; top:10px; right:10px; border: 1px solid #fecaca; z-index:10;">LOW STOCK</span>` : '';
        const imgPath = (p.image_path && p.image_path !== '') ? p.image_path : 'uploads/default.png';
        
        div.innerHTML = `
            ${badge}
            <img src="${imgPath}" onerror="this.src='uploads/default.png'" 
                 style="width:100%; height:120px; object-fit:cover; border-radius:10px; margin-bottom:12px;">
            <div class="product-name">${p.name}</div>
            <div class="product-stock">Stock: ${parseFloat(p.stock_quantity).toFixed(2)} ${p.unit || 'pcs'}</div>
            <div class="product-price">KES ${parseFloat(p.selling_price).toFixed(2)}</div>
        `;
        productListEl.appendChild(div);
    });
}

// --- 4. CART & CHECKOUT (Inclusive VAT) ---
function addToCart(id) {
    const p = products.find(item => item.id === id);
    if (!p || parseFloat(p.stock_quantity) <= 0) return alert("Item out of stock!");
    
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.qty++; } 
    else { cart.push({ id: p.id, name: p.name, price: parseFloat(p.selling_price), qty: 1 }); }
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm("Clear all items from the current order?")) {
        cart = [];
        updateCartUI();
    }
}

function updateCartUI() {
    cartEl.innerHTML = '';
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const lineTotal = item.price * item.qty;
        grandTotal += lineTotal;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div style="text-align:left;">
                <div style="font-weight:600; color:#2c3e50;">${item.name}</div>
                <div style="font-size:12px; color:#7f8c8d;">${item.qty} x ${item.price.toFixed(2)}</div>
            </div>
            <div style="text-align:right; display:flex; align-items:center; gap:10px;">
                <strong style="color:#2c3e50;">KES ${lineTotal.toFixed(2)}</strong>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-weight:800; padding:5px;">✕</button>
            </div>`;
        cartEl.appendChild(div);
    });

    const taxAmount = grandTotal - (grandTotal / 1.16);
    const netTotal = grandTotal - taxAmount;

    document.getElementById('subtotal').innerText = `KES ${netTotal.toFixed(2)}`;
    document.getElementById('tax').innerText = `KES ${taxAmount.toFixed(2)}`;
    document.getElementById('total').innerText = `KES ${grandTotal.toFixed(2)}`;
}

async function processSale(method) {
    if (cart.length === 0) return alert("Cart is empty.");
    const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
    const phone = document.getElementById('customer-phone') ? document.getElementById('customer-phone').value : '';
    
    const res = await fetch('save_sale.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, total, method, customer_phone: phone })
    });

    if ((await res.json()).success) {
        alert(`Sale Recorded: ${method}`);
        cart = [];
        updateCartUI();
        initializeData();
        if(document.getElementById('customer-phone')) document.getElementById('customer-phone').value = '';
    }
}

// --- 5. SEARCH & FILTER LOGIC ---
function applyFilters() {
    const term = searchEl.value.toLowerCase();
    
    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(term);
        const matchesCategory = activeCategoryId === null || p.category_id == activeCategoryId;
        return matchesSearch && matchesCategory;
    });
    
    renderProducts(filtered);
}

const mpesaBtn = document.getElementById('mpesa-btn');
const cashBtn = document.getElementById('cash-btn');
if (mpesaBtn) mpesaBtn.onclick = () => processSale('M-Pesa');
if (cashBtn) cashBtn.onclick = () => processSale('Cash');
if(searchEl) searchEl.oninput = applyFilters;

initializeData();