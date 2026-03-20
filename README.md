# POS_system - Full-Stack Retail Management System 

A professional, high-performance Point of Sale (POS) and inventory management solution built with a modern **Midnight & Emerald** aesthetic. This platform is designed for Kenyan retail SMEs, featuring a "Zero-Click" checkout workflow, real-time stock intelligence, and integrated compliance tools.

This project was developed as a comprehensive demonstration of full-stack architecture, real-time database synchronization, and localized fintech solutions  retail market.

##  Key Features

### Storefront & Checkout (Cashier Terminal)
* **Midnight & Emerald UI:** A high-contrast interface optimized for long-shift retail environments, reducing eye strain for cashiers.
* **Inclusive VAT Engine:** Automatically calculates 16% VAT hidden within the sticker price, ensuring KRA-compliant reporting without requiring manual calculations.
* **Smart Search & Filter:** Live search bar with "Automatic Focus" and dynamic category pills (Fruits, Clothing, Stationery) for instant item retrieval.
* **Low-Stock Intelligence:** Real-time visual "LOW STOCK" badges that trigger automatically when inventory levels fall below a critical threshold (5 units).

### Payment & Fintech Integration
* **Multi-Method Checkout:** Supports **Cash**, **Safaricom M-Pesa Express**, and **Digital Debt (BNPL)**.
* **WhatsApp Receipting:** Integrated simulator that generates and sends professional digital receipts directly to a customer's WhatsApp, significantly reducing thermal paper costs.
* **Digital Debt Ledger:** A built-in "Credit Book" feature to track loyal customers who buy on credit, professionalizing traditional retail debt management.

### Management Backend (Admin Dashboard)
* **Inventory Control Center:** Add, delete, and live-edit product prices or stock quantities with instant asynchronous synchronization to the sales floor.
* **Supplier Relationship Management:** Built-in module to track supplier names and contact details for one-touch restocking.
* **Sales Analytics:** Secure reporting area to track total revenue, net margins, and tax collected per shift.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3 , JavaScript 
* **Backend:** PHP 8+ 
* **Database:** MySQL (Relational Database with Foreign Key constraints)
* **Integrations:** Safaricom Daraja API logic & WhatsApp Business API simulator.

## 🚀 How to Run Locally

If you want to run this project on your local machine (using XAMPP, WAMP, or similar):

1. **Clone the repository:**
   `git clone https://github.com/pos_system/BingwaPOS.git`
2. **Setup the Database:**
   * Open phpMyAdmin.
   * Create a new database named `pos_system`.
   * Import the provided `.sql` file to set up the `products`, `categories`, `suppliers`, and `sales` tables.
3. **Configure the Connection:**
   * Open `db.php`.
   * Update the credentials (`$servername`, `$username`, `$password`, `$dbname`) to match your local server environment.
4. **Run the Server:**
   * Place the project folder inside your `htdocs` directory and navigate to `http://localhost/pos_system` in your browser.

## 👨‍💻 Developer
Developed by **Daniel** 
