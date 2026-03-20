<?php
require 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing ID']);
    exit;
}

try {
    if ($data['action'] === 'delete') {
        //
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(['success' => true]);
    }
} catch (Exception $e) {
    // Prevents deletion if products are currently assigned to this category
    echo json_encode(['success' => false, 'error' => 'Category is linked to active products.']);
}
?>