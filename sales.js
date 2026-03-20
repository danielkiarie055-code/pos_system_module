// sales.js

let allSales = [];

// --- 1. AUTHENTICATION CHECK ---
async function checkAuth() {
    try {
        const response = await fetch('check_auth.php');
        const data = await response.json();

        if (!response.ok || !data.authenticated) {
            window.location.href = 'login.html'; 
            return;
        }

        if (data.role !== 'Admin' && data.role !== 'Super Admin') {
            alert("❌ Access Denied");
            window.location.href = 'index.html'; 
        }
    } catch (e) {
        window.location.href = 'login.html';
    }
}

// --- 2. FETCH & RENDER SALES ---
async function fetchSales() {
    try {
        const response = await fetch('get_all_sales.php');
        allSales = await response.json();
        
        if (!response.ok) throw new Error('Failed to load sales');
        
        renderSales(allSales);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('sales-table-body').innerHTML = `<tr><td colspan="5" style="color:red;">Error loading data.</td></tr>`;
    }
}

function renderSales(salesData) {
    const tbody = document.getElementById('sales-table-body');
    tbody.innerHTML = '';

    if (salesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No sales found.</td></tr>';
        return;
    }

    salesData.forEach(sale => {
        const tr = document.createElement('tr');
        const saleDate = new Date(sale.created_at).toLocaleString();

        tr.innerHTML = `
            <td><strong>${sale.receipt_no}</strong></td>
            <td>${saleDate}</td>
            <td>${sale.cashier_name}</td>
            <td>${sale.payment_method}</td>
            <td style="color: #28a745; font-weight: bold;">${parseFloat(sale.total_amount).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- 3. LIVE SEARCH FILTER ---
document.getElementById('search-sales').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allSales.filter(sale => 
        sale.receipt_no.toLowerCase().includes(term) || 
        sale.cashier_name.toLowerCase().includes(term)
    );
    renderSales(filtered);
});

// Initialize
checkAuth().then(() => {
    fetchSales();
});