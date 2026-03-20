<?php
// get_all_sales.php
require 'db.php';
session_start();

header('Content-Type: application/json');

// Security: Only allow logged-in users to see history
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

try {
    // We join the sales table with the users table to show WHICH cashier made the sale
    // We use a LEFT JOIN so that even if a user was deleted, the sale still shows up
    $stmt = $pdo->query("
        SELECT 
            sales.id, 
            sales.receipt_no, 
            sales.total_amount, 
            sales.payment_method, 
            sales.created_at, 
            users.name as cashier_name 
        FROM sales 
        LEFT JOIN users ON sales.user_id = users.id 
        ORDER BY sales.created_at DESC
    ");
    
    $sales = $stmt->fetchAll();
    
    // Send the data back to sales.js
    echo json_encode($sales);

} catch (PDOException $e) {
    // This will tell us EXACTLY what is wrong (e.g., "Column not found")
    http_response_code(500);
    echo json_encode(['error' => 'Database Error: ' . $e->getMessage()]);
}
?>