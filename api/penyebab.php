<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$pdo = require __DIR__ . '/config/database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = $_GET['id'] ?? '';

        if ($id === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Parameter id wajib diisi',
            ]);
            exit;
        }

        $stmt = $pdo->prepare('DELETE FROM penyebab WHERE id = :id');
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Data penyebab tidak ditemukan',
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Penyebab berhasil dihapus',
        ]);
        exit;
    }

    $stmt = $pdo->query('SELECT id, nama, dispatch, solusi FROM penyebab ORDER BY id');
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
        'message' => 'Failed to fetch penyebab',
        'error' => $e->getMessage(),
    ]);
}
