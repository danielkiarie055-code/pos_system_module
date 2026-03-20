<?php
// add_supplier.php
require 'db.php';
header('Content-Type: application/json');

// Get the JSON data from the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['name']) && !empty($data['name'])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO suppliers (name, contact) VALUES (?, ?)");
        $success = $stmt->execute([
            $data['name'], 
            $data['contact'] ?? ''
        ]);
        echo json_encode(['success' => $success]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Supplier Name is required']);
}
?>