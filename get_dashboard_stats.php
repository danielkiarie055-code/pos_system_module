<?php
// get_dashboard_stats.php
require 'db.php';
header('Content-Type: application/json');

try {
    // Fetch sum of revenue
    $revStmt = $pdo->query("SELECT SUM(total_amount) FROM sales");
    $revenue = $revStmt->fetchColumn() ?: 0;

    // Fetch total count of sales
    $countStmt = $pdo->query("SELECT COUNT(*) FROM sales");
    $salesCount = $countStmt->fetchColumn() ?: 0;

    // Fetch 5 latest sales
    $recentStmt = $pdo->query("SELECT receipt_no, total_amount, payment_method, created_at FROM sales ORDER BY created_at DESC LIMIT 5");
    $recent = $recentStmt->fetchAll();

    echo json_encode([
        'total_revenue' => (float)$revenue,
        'total_sales' => (int)$salesCount,
        'recent_sales' => $recent
    ]);
} catch (Exception $e) {
    echo json_encode(['total_revenue' => 0, 'total_sales' => 0, 'recent_sales' => []]);
}
?>