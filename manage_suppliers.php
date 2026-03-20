<?php
// manage_suppliers.php
require 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if ($data['action'] === 'delete') {
    $stmt = $pdo->prepare("DELETE FROM suppliers WHERE id = ?");
    $result = $stmt->execute([$data['id']]);
    echo json_encode(['success' => $result]);
} else {
    echo json_encode(['success' => false, 'error' => 'Unknown action']);
}
?>