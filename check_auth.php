<?php
// check_auth.php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'authenticated' => true,
        'user_name' => $_SESSION['user_name'],
        'role' => $_SESSION['user_role']
    ]);
} else {
    http_response_code(401);
    echo json_encode(['authenticated' => false]);
}
?>