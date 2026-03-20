<?php
// get_products.php
require 'db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM products ORDER BY name ASC");
    $products = $stmt->fetchAll();
    
    // Ensure the image path is relative and clean
    foreach ($products as &$p) {
        if (empty($p['image_path']) || !file_exists($p['image_path'])) {
            $p['image_path'] = 'uploads/default.png';
        }
    }
    
    echo json_encode($products);
} catch (Exception $e) {
    echo json_encode([]);
}
?>