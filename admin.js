// admin.js - Full Restored 11:30 AM Build

document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIAL LOAD
    loadCategories();
    loadSuppliers();
    loadInventory();

    // 2. PRODUCT UPLOAD HANDLER (FormData for Images)
    const productForm = document.getElementById('add-product-form');
    if (productForm) {
        productForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(productForm);
            try {
                const res = await fetch('add_product.php', { method: 'POST', body: formData });
                const result = await res.json();
                if (result.success) {
                    alert("Product Saved Successfully!");
                    productForm.reset();
                    loadInventory();
                } else { alert("Error: " + result.error); }
            } catch (err) { console.error("Server error during upload", err); }
        };
    }

    // 3. ADD CATEGORY HANDLER (JSON)
    const categoryForm = document.getElementById('add-category-form');
    if (categoryForm) {
        categoryForm.onsubmit = async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(categoryForm));
            const res = await fetch('add_category.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if ((await res.json()).success) {
                categoryForm.reset();
                loadCategories();
                alert("Category Added!");
            }
        };
    }

    // 4. ADD SUPPLIER HANDLER (FIXED & ACTIVE)
    const supplierForm = document.getElementById('add-supplier-form');
    if (supplierForm) {
        supplierForm.onsubmit = async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(supplierForm));
            const res = await fetch('add_supplier.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                supplierForm.reset();
                loadSuppliers();
                alert("Supplier Added Successfully!");
            } else { alert("Supplier Error: " + result.error); }
        };
    }
});

// --- LOADERS ---

async function loadCategories() {
    const res = await fetch('get_categories.php');
    const data = await res.json();
    const select = document.getElementById('p-category');
    if (select) select.innerHTML = '<option value="">Select Category</option>' + 
        data.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

async function loadSuppliers() {
    const res = await fetch('get_suppliers.php');
    const data = await res.json();
    const select = document.getElementById('p-supplier');
    if (select) select.innerHTML = '<option value="">Select Supplier</option>' + 
        data.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

async function loadInventory() {
    const res = await fetch('get_products.php');
    const data = await res.json();
    const table = document.getElementById('inventory-table-body');
    if (table) {
        table.innerHTML = data.map(p => {
            const isLow = parseFloat(p.stock_quantity) < 5;
            return `
            <tr>
                <td>
                    <img src="${p.image_path || 'uploads/default.png'}" onerror="this.src='uploads/default.png'" style="width:40px; height:40px; object-fit:cover; border-radius:6px; margin-right:10px; vertical-align:middle;">
                    ${p.name}
                </td>
                <td>${p.unit || 'pcs'}</td>
                <td style="${isLow ? 'color:#e74c3c; font-weight:bold;' : ''}">
                    ${parseFloat(p.stock_quantity).toFixed(2)}
                    ${isLow ? ' <small>(LOW)</small>' : ''}
                </td>
                <td>KES ${parseFloat(p.selling_price).toFixed(2)}</td>
                <td>
                    <button onclick="editProduct(${p.id}, '${p.name}', ${p.selling_price})" style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
                    <button onclick="deleteProduct(${p.id})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-left:5px;">Del</button>
                </td>
            </tr>`;
        }).join('');
    }
}

// --- RESTORED EDIT & DELETE ACTIONS ---

function editProduct(id, name, currentPrice) {
    const newPrice = prompt(`Update Selling Price for ${name}:`, currentPrice);
    if (newPrice !== null && newPrice !== "") {
        fetch('manage_products.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_price', id, price: newPrice })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Price Updated!");
                loadInventory();
            }
        });
    }
}

async function deleteProduct(id) {
    if (confirm("Permanently delete this product from inventory?")) {
        const res = await fetch('manage_products.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id })
        });
        if ((await res.json()).success) {
            alert("Product Deleted.");
            loadInventory();
        }
    }
}