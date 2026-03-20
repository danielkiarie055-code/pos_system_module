<?php
// get_users.php
require 'db.php';
session_start();
header('Content-Type: application/json');

// Security: Only Admins should see the staff list
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'Admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

try {
    // We select name, email, role, and status (never send the password hash)
    $stmt = $pdo->query("SELECT id, name, email, role, status FROM users ORDER BY name ASC");
    $users = $stmt->fetchAll();
    echo json_encode($users);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>