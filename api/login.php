<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$pdo = require __DIR__ . '/config/database.php';

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$username =
    trim($data['username'] ?? '');

$password =
    trim($data['password'] ?? '');

try {

    $stmt = $pdo->prepare("
        SELECT *
        FROM admin
        WHERE username = ?
        LIMIT 1
    ");

    $stmt->execute([
        $username
    ]);

    $admin = $stmt->fetch();

    if (!$admin) {

        echo json_encode([
            'success' => false,
            'message' =>
                'Username tidak ditemukan'
        ]);

        exit;
    }

    if ($admin['password'] !== $password) {

        echo json_encode([
            'success' => false,
            'message' =>
                'Password salah'
        ]);

        exit;
    }

    echo json_encode([
        'success' => true,
        'admin' => [
            'id' =>
                $admin['id'],
            'username' =>
                $admin['username'],
            'nama_admin' =>
                $admin['nama_admin']
        ]
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' =>
            $e->getMessage()
    ]);
}