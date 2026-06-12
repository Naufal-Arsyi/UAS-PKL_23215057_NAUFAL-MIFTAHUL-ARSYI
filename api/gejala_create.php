<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed',
    ]);
    exit;
}

$pdo = require __DIR__ . '/config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];

    $id = trim((string)($input['id'] ?? ''));
    $nama = trim((string)($input['nama'] ?? ''));
    $deskripsi = trim((string)($input['deskripsi'] ?? ''));

    if ($id === '' || $nama === '') {
        throw new RuntimeException('id dan nama gejala wajib diisi');
    }

    $checkStmt = $pdo->prepare('SELECT id FROM gejala WHERE id = :id LIMIT 1');
    $checkStmt->execute(['id' => $id]);
    if ($checkStmt->fetch()) {
        throw new RuntimeException('ID gejala sudah digunakan');
    }

    $insertStmt = $pdo->prepare('INSERT INTO gejala (id, nama, deskripsi) VALUES (:id, :nama, :deskripsi)');
    $insertStmt->execute([
        'id' => $id,
        'nama' => $nama,
        'deskripsi' => $deskripsi,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Gejala berhasil ditambahkan',
        'data' => [
            'id' => $id,
            'nama' => $nama,
            'deskripsi' => $deskripsi,
        ],
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menambah gejala',
        'error' => $e->getMessage(),
    ]);
}
