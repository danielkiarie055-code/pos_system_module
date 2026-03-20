<?php
// save_sale.php - Professional Retail Accounting
require 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['cart'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid sale data']);
    exit;
}

try {
    $pdo->beginTransaction();

    $total_paid = $data['total'];
    $payment_method = $data['method'];
    
    // Calculate Inclusive VAT for records
    $tax_amount = $total_paid - ($total_paid / 1.16);
    $net_amount = $total_paid - $tax_amount;

    // 1. Record the Transaction
    $stmt = $pdo->prepare("INSERT INTO sales (total_amount, tax_amount, net_amount, payment_method) VALUES (?, ?, ?, ?)");
    $stmt->execute([$total_paid, $tax_amount, $net_amount, $payment_method]);
    $sale_id = $pdo->lastInsertId();

    // 2. Process Items and Deduct Stock
    foreach ($data['cart'] as $item) {
        // Record sale item
        $stmtItem = $pdo->prepare("INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)");
        $stmtItem->execute([$sale_id, $item['id'], $item['qty'], $item['price']]);

        // Deduct Stock
        $updateStock = $pdo->prepare("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?");
        $updateStock->execute([$item['qty'], $item['id']]);
    }

    $pdo->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>