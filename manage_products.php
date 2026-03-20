<?php
// manage_products.php - Edit/Delete Logic
require 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

try {
    if ($data['action'] === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$data['id']]);
    } elseif ($data['action'] === 'update_price') {
        $stmt = $pdo->prepare("UPDATE products SET selling_price = ? WHERE id = ?");
        $stmt->execute([$data['price'], $data['id']]);
    }
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>