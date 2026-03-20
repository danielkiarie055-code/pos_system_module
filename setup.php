<?php
// setup.php
require 'db.php';

$password = '123456';
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = 'cashier@pos.com'");
    $stmt->execute([$hashed_password]);
    echo "✅ Password updated successfully! You can now log in.";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>