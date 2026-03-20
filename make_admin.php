<?php
// make_admin.php
require 'db.php';
try {
    $pdo->query("UPDATE users SET role = 'Admin' WHERE email = 'cashier@pos.com'");
    echo "✅ Success! You are now an Admin. Go log in again.";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>