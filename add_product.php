<?php
require 'db.php';
header('Content-Type: application/json');

try {
    // Collect data from the FormData object
    $name = $_POST['name'];
    $cat_id = $_POST['category_id'];
    $sup_id = $_POST['supplier_id'];
    $unit = $_POST['unit'];
    $b_price = $_POST['buying_price'];
    $s_price = $_POST['selling_price'];
    $stock = $_POST['stock_quantity'];

    $image_path = 'uploads/default.png'; // Fallback

    // Process Image
    if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] == 0) {
        $target_dir = "uploads/";
        if (!is_dir($target_dir)) mkdir($target_dir, 0777, true);
        
        $file_name = time() . "_" . $_FILES["product_image"]["name"];
        if (move_uploaded_file($_FILES["product_image"]["tmp_name"], $target_dir . $file_name)) {
            $image_path = $target_dir . $file_name;
        }
    }

    $sql = "INSERT INTO products (category_id, supplier_id, name, unit, buying_price, selling_price, stock_quantity, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$cat_id, $sup_id, $name, $unit, $b_price, $s_price, $stock, $image_path]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>