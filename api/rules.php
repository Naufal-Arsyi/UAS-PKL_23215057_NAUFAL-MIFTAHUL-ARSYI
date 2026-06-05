<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$pdo = require __DIR__ . '/config/database.php';

try {
    $stmt = $pdo->query('SELECT r.id, r.penyebab_id, r.gejala_id, r.bobot, p.nama AS penyebab_nama, g.nama AS gejala_nama FROM rules r JOIN penyebab p ON p.id = r.penyebab_id JOIN gejala g ON g.id = r.gejala_id ORDER BY r.id');
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $data,
        'count' => count($data),
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch rules',
        'error' => $e->getMessage(),
    ]);
}
