<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$pdo = require __DIR__ . '/config/database.php';

function combineCF(float $old, float $current): float
{
    return $old + $current * (1 - $old);
}

try {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $selected = $input['selected'] ?? [];

    if (!is_array($selected) || count($selected) === 0) {
        throw new RuntimeException('Pilih setidaknya satu gejala.');
    }

    $penyebabStmt = $pdo->query('SELECT id, nama, dispatch, solusi FROM penyebab ORDER BY id');
    $penyebab = $penyebabStmt->fetchAll(PDO::FETCH_ASSOC);

    $rulesStmt = $pdo->query('SELECT r.penyebab_id, r.gejala_id, r.bobot FROM rules r ORDER BY r.id');
    $rules = $rulesStmt->fetchAll(PDO::FETCH_ASSOC);

    $scores = [];

    foreach ($penyebab as $p) {
        $cf = 0.0;

        foreach ($rules as $rule) {
            if ($rule['penyebab_id'] !== $p['id']) {
                continue;
            }

            if (!isset($selected[$rule['gejala_id']])) {
                continue;
            }

            $cf = combineCF($cf, (float)$rule['bobot'] * (float)$selected[$rule['gejala_id']]);
        }

        if ($cf > 0) {
            $scores[] = [
                'id' => $p['id'],
                'nama' => $p['nama'],
                'dispatch' => $p['dispatch'],
                'solusi' => $p['solusi'],
                'cf' => round($cf, 3),
            ];
        }
    }

    usort($scores, fn($a, $b) => $b['cf'] <=> $a['cf']);

    echo json_encode([
        'success' => true,
        'results' => array_slice($scores, 0, 3),
        'count' => count($scores),
        'selected' => $selected,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal melakukan diagnosa',
        'error' => $e->getMessage(),
    ]);
}
