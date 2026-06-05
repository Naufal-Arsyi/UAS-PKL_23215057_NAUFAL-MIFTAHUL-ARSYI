# 🔄 NetReport Migration Guide

## Dari Client-Side CF Engine → Server-Side PHP API

---

## 📊 ALUR SAAT INI vs ALUR BARU

### ❌ Alur Saat Ini (Browser-based)

```
Symptoms.jsx
    ↓ User click "Analisis"
    ↓ onAnalyze()
    ↓
App.jsx:37 → calcCF(selected)
    ↓
cfEngine.js
    ├── import PENYEBAB from gejala.js
    ├── import RULES from rules.js
    └── Calculate locally in JavaScript
    ↓
setResults(...)
    ↓
Results.jsx (display)
```

### ✅ Alur Baru (Server-based)

```
Symptoms.jsx
    ↓ User click "Analisis"
    ↓ onAnalyze() → fetch("/api/diagnosa.php", POST)
    ↓
PHP diagnosa.php
    ├── Read request: selectedSymptoms + CF values
    ├── Query MySQL: gejala, penyebab, rules
    ├── Calculate CF in PHP
    └── return JSON { results: [...], cf: [...] }
    ↓
React setState(results)
    ↓
Results.jsx (display)
```

---

## 🔧 FILE-BY-FILE CHANGES

### 1️⃣ cfEngine.js - Remove Imports

**File:** `src/utils/cfEngine.js`

#### SEBELUM (Baris 1-2):

```javascript
import { PENYEBAB } from "../data/penyebab.js";
import { RULES } from "../data/rules.js";
```

#### SESUDAH (DIHAPUS atau menjadi comment):

```javascript
// Deprecated: PENYEBAB dan RULES sekarang dari API PHP
// CF calculation dipindah ke server-side
```

---

### 2️⃣ App.jsx - Make handleAnalyze Async

**File:** `src/App.jsx`

#### SEBELUM (Baris 1-2):

```javascript
import { useState } from "react";
import { calcCF } from "./utils/cfEngine.js";
```

#### SESUDAH:

```javascript
import { useState } from "react";
// import { calcCF } from "./utils/cfEngine.js";  // ← REMOVED
```

---

#### SEBELUM (Baris 37-39):

```javascript
const handleAnalyze = () => {
  setResults(calcCF(selected));
  setPage("results");
};
```

#### SESUDAH:

```javascript
const handleAnalyze = async () => {
  try {
    // Prepare payload
    const payload = {
      selected: selected,
      company: {
        name: company.name,
        phone: company.phone,
      },
    };

    // Fetch diagnosa dari PHP API
    const response = await fetch("http://localhost:8000/diagnosa.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    setResults(data.results || []);
    setPage("results");
  } catch (error) {
    console.error("Diagnosa failed:", error);
    alert("Gagal melakukan diagnosa. Pastikan server PHP berjalan.");
  }
};
```

---

### 3️⃣ Symptoms.jsx - Keep Same (No Changes Needed Yet)

**File:** `src/pages/Symptoms.jsx`

#### Baris 12 - Masih import dari gejala.js (untuk sekarang):

```javascript
import { GEJALA, CF_LEVELS, CF_LABELS } from "../data/gejala.js";
```

**NOTE:** Baris ini akan berubah di **TAHAP 4** ketika kita migrate data gejala ke API.

---

## 📁 FILE PHP YANG PERLU DIBUAT

### 1️⃣ /api/gejala.php

**Purpose:** Return semua gejala dari MySQL

```php
<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include database config
include __DIR__ . "/config/database.php";

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "SELECT id, nama, deskripsi, kategori FROM gejala ORDER BY id";
    $stmt = $pdo->query($query);
    $gejala = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $gejala,
        "count" => count($gejala)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
```

**Test:** `curl http://localhost:8000/gejala.php`

---

### 2️⃣ /api/penyebab.php

**Purpose:** Return semua penyebab dari MySQL

```php
<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include __DIR__ . "/config/database.php";

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "SELECT id, nama, dispatch, solusi FROM penyebab ORDER BY id";
    $stmt = $pdo->query($query);
    $penyebab = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $penyebab,
        "count" => count($penyebab)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
```

**Test:** `curl http://localhost:8000/penyebab.php`

---

### 3️⃣ /api/rules.php

**Purpose:** Return semua rules dari MySQL

```php
<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include __DIR__ . "/config/database.php";

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "SELECT id, penyebab, gejala, bobot FROM rules ORDER BY id";
    $stmt = $pdo->query($query);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert gejala JSON string to array
    $rules = array_map(function($rule) {
        $rule['gejala'] = json_decode($rule['gejala'], true);
        return $rule;
    }, $results);

    echo json_encode([
        "status" => "success",
        "data" => $rules,
        "count" => count($rules)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
```

**Test:** `curl http://localhost:8000/rules.php`

---

### 4️⃣ /api/diagnosa.php ⭐ MOST IMPORTANT

**Purpose:** Main endpoint - receive selected symptoms, calculate CF, return top-3 diagnosis

```php
<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . "/config/database.php";

/**
 * Certainty Factor Calculation
 * CF_new = CF_old + CF_curr × (1 – CF_old)
 */
function combineCF($cf_old, $cf_curr) {
    return $cf_old + $cf_curr * (1 - $cf_old);
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents("php://input"), true);
    $selected = $input['selected'] ?? [];

    if (empty($selected)) {
        throw new Exception("No symptoms selected");
    }

    // Connect to database
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Get all penyebab
    $penyebabQuery = "SELECT id, nama, dispatch, solusi FROM penyebab";
    $penyebabStmt = $pdo->query($penyebabQuery);
    $penyebab = $penyebabStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get all rules
    $rulesQuery = "SELECT id, penyebab, gejala, bobot FROM rules";
    $rulesStmt = $pdo->query($rulesQuery);
    $rulesData = $rulesStmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate CF for each penyebab
    $scores = [];

    foreach ($penyebab as $p) {
        $cf = 0;

        foreach ($rulesData as $rule) {
            if ($rule['penyebab'] !== $p['id']) continue;

            // Parse gejala array from JSON
            $rule_gejala = json_decode($rule['gejala'], true);
            if (!is_array($rule_gejala)) continue;

            // Find matched gejala from user selection
            $matched_gejala = array_filter(
                $rule_gejala,
                fn($g) => isset($selected[$g])
            );

            if (empty($matched_gejala)) continue;

            // Get max CF from user selection
            $max_cf_user = max(array_map(
                fn($g) => $selected[$g],
                $matched_gejala
            ));

            // CF Expert from rule
            $cf_expert = (float)$rule['bobot'];

            // CF Combined
            $cf_combined = $max_cf_user * $cf_expert;

            // CF Sequential combination
            $cf = combineCF($cf, $cf_combined);
        }

        if ($cf > 0) {
            $scores[$p['id']] = [
                "id" => $p['id'],
                "nama" => $p['nama'],
                "dispatch" => $p['dispatch'],
                "solusi" => $p['solusi'],
                "cf" => round($cf, 3)
            ];
        }
    }

    // Sort by CF descending
    usort($scores, fn($a, $b) => $b['cf'] <=> $a['cf']);

    // Get top 3
    $top3 = array_slice($scores, 0, 3);

    echo json_encode([
        "status" => "success",
        "results" => $top3,
        "count" => count($top3),
        "all_scores" => $scores
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
```

**Test:**

```bash
curl -X POST http://localhost:8000/diagnosa.php \
  -H "Content-Type: application/json" \
  -d '{
    "selected": {
      "G01": 0.8,
      "G02": 0.6,
      "G05": 0.9
    }
  }'
```

---

## ⚙️ TAHAPAN MIGRASI AMAN

### ✅ Tahap 1: Database Setup (SUDAH DONE)

- [x] Create tables: gejala, penyebab, rules
- [x] Insert data

### ⏳ Tahap 2: Create PHP APIs (NEXT)

- [ ] Create `/api/gejala.php`
- [ ] Create `/api/penyebab.php`
- [ ] Create `/api/rules.php`
- [ ] Create `/api/diagnosa.php`

### ⏳ Tahap 3: Test APIs

- [ ] `php -S localhost:8000` di folder `/api`
- [ ] Test setiap endpoint dengan curl
- [ ] Verify JSON response format

### ⏳ Tahap 4: Update App.jsx

- [ ] Remove import calcCF
- [ ] Update handleAnalyze() jadi async + fetch()
- [ ] Test di browser

### ⏳ Tahap 5: Update Symptoms.jsx (Later)

- [ ] Fetch gejala dari API instead of hardcoded
- [ ] Remove GEJALA import

### ⏳ Tahap 6: Cleanup

- [ ] Delete src/data/gejala.js
- [ ] Delete src/data/penyebab.js
- [ ] Delete src/data/rules.js
- [ ] Delete or refactor cfEngine.js

---

## 🧪 TESTING SEQUENCE

### 1. Start PHP Server

```bash
cd c:\laragon\www\netreport\api
php -S localhost:8000
```

### 2. Test APIs with curl

```bash
# Test gejala
curl http://localhost:8000/gejala.php

# Test penyebab
curl http://localhost:8000/penyebab.php

# Test rules
curl http://localhost:8000/rules.php

# Test diagnosa
curl -X POST http://localhost:8000/diagnosa.php \
  -H "Content-Type: application/json" \
  -d '{
    "selected": {
      "G01": 0.8,
      "G02": 0.6
    }
  }'
```

### 3. Start React Dev Server (in another terminal)

```bash
cd c:\laragon\www\netreport
npm run dev
```

### 4. Test in Browser

- Navigate to http://localhost:5173
- Select symptoms
- Click "Analisis"
- Check Network tab in DevTools for `/diagnosa.php` request
- Verify results display correctly

---

## 🔑 KEY POINTS

1. **No breaking changes** - React still runs on port 5173, PHP on port 8000
2. **CORS headers** - Already included in PHP endpoints
3. **Backward compatible** - Old files still exist during migration
4. **Safe rollback** - Can revert if issues occur
5. **Database is source of truth** - Data in MySQL, not JavaScript files

---

## 🐛 COMMON ISSUES & SOLUTIONS

| Issue                     | Cause                   | Solution                            |
| ------------------------- | ----------------------- | ----------------------------------- |
| CORS error in browser     | PHP not allowing origin | Add CORS headers to PHP             |
| 404 gejala.php            | PHP server not running  | `php -S localhost:8000`             |
| Database connection error | DB_HOST/USER/PASS wrong | Check `/api/config/database.php`    |
| Empty results             | Rules not matching      | Check SQL rule format (JSON gejala) |
| TypeError in App.jsx      | handleAnalyze not async | Make it `async`                     |

---

## 📝 NEXT STEPS

1. Create the 4 PHP files above
2. Update database.php if needed
3. Test APIs with curl
4. Update App.jsx handleAnalyze
5. Test in browser
6. Report issues or proceed to Tahap 5
