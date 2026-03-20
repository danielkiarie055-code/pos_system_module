<?php
require 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['name'])) {
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    $success = $stmt->execute([$data['name']]);
    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false, 'error' => 'Name is required']);
}
?>