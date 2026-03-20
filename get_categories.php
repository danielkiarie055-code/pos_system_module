<?php
require 'db.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query("SELECT id, name FROM categories ORDER BY name ASC");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    echo json_encode([]);
}
?>