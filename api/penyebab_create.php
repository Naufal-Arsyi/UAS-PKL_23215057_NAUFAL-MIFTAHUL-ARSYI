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
    $dispatch = trim((string)($input['dispatch'] ?? ''));
    $solusi = trim((string)($input['solusi'] ?? ''));
    $rules = $input['rules'] ?? [];

    if ($id === '' || $nama === '' || $dispatch === '' || $solusi === '') {
        throw new RuntimeException('id, nama, dispatch, dan solusi wajib diisi');
    }

    if (!in_array($dispatch, ['self', 'remote', 'onsite'], true)) {
        throw new RuntimeException('dispatch harus bernilai self, remote, atau onsite');
    }

    if (!is_array($rules) || count($rules) === 0) {
        throw new RuntimeException('rules minimal 1 item');
    }

    $pdo->beginTransaction();

    $checkStmt = $pdo->prepare('SELECT id FROM penyebab WHERE id = :id LIMIT 1');
    $checkStmt->execute(['id' => $id]);
    if ($checkStmt->fetch()) {
        throw new RuntimeException('ID penyebab sudah digunakan');
    }

    $insertPenyebab = $pdo->prepare('INSERT INTO penyebab (id, nama, dispatch, solusi) VALUES (:id, :nama, :dispatch, :solusi)');
    $insertPenyebab->execute([
        'id' => $id,
        'nama' => $nama,
        'dispatch' => $dispatch,
        'solusi' => $solusi,
    ]);

    $checkGejala = $pdo->prepare('SELECT id FROM gejala WHERE id = :id LIMIT 1');
    $insertRule = $pdo->prepare('INSERT INTO rules (penyebab_id, gejala_id, bobot) VALUES (:penyebab_id, :gejala_id, :bobot)');

    foreach ($rules as $item) {
        $gejalaId = trim((string)($item['gejala_id'] ?? ''));
        $bobot = (float)($item['bobot'] ?? -1);

        if ($gejalaId === '' || $bobot < 0 || $bobot > 1) {
            throw new RuntimeException('Setiap rules wajib memiliki gejala_id valid dan bobot 0-1');
        }

        $checkGejala->execute(['id' => $gejalaId]);
        if (!$checkGejala->fetch()) {
            throw new RuntimeException('Gejala dengan id ' . $gejalaId . ' tidak ditemukan');
        }

        $insertRule->execute([
            'penyebab_id' => $id,
            'gejala_id' => $gejalaId,
            'bobot' => $bobot,
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Penyebab dan rules berhasil disimpan',
        'data' => [
            'id' => $id,
            'nama' => $nama,
            'dispatch' => $dispatch,
            'solusi' => $solusi,
            'rules_count' => count($rules),
        ],
    ]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menyimpan penyebab',
        'error' => $e->getMessage(),
    ]);
}
