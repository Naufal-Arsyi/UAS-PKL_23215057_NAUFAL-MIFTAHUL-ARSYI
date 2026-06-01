# N8N Webhook Integration API

## Overview
Sistem WiFi Troubleshooting ini telah terintegrasi dengan n8n untuk mengirim data hasil analisis otomatis ke webhook ketika user menekan tombol "Cetak".

## Webhook Configuration

### URL
```
http://localhost:5678/webhook-test/Laptop-diagnose
```

### Method
`POST`

### Headers
```
Content-Type: application/json
```

## Payload Structure

Setiap kali user menekan tombol "Cetak", data berikut akan dikirim ke webhook n8n:

```json
{
  "wifiName": "string",
  "phone": "string",
  "diagnosis": {
    "id": "string",
    "nama": "string",
    "cf": "number (0-1)",
    "solusi": "string",
    "dispatch": "string (self|remote|onsite)"
  },
  "symptoms": {
    "[gejalaId]": "number (0-1)",
    ...
  },
  "timestamp": "ISO 8601 datetime string"
}
```

## Field Description

### wifiName
- **Type**: String
- **Description**: Nama WiFi yang sedang bermasalah
- **Example**: "WiFi Main Office"

### phone
- **Type**: String
- **Description**: Nomor telepon (WhatsApp) pelapor
- **Example**: "081234567890"

### diagnosis.id
- **Type**: String
- **Description**: ID penyebab gangguan unik
- **Example**: "P01"

### diagnosis.nama
- **Type**: String
- **Description**: Nama penyebab gangguan
- **Example**: "Bandwidth penuh / overload pengguna"

### diagnosis.cf
- **Type**: Number (0-1)
- **Description**: Certainty Factor - tingkat keyakinan diagnosis
- **Example**: 0.85

### diagnosis.solusi
- **Type**: String
- **Description**: Solusi yang direkomendasikan untuk penyebab tersebut
- **Example**: "Kurangi jumlah pengguna yang aktif..."

### diagnosis.dispatch
- **Type**: String (Enum)
- **Description**: Tipe penanganan yang direkomendasikan
- **Values**:
  - `self`: Klien dapat menangani sendiri
  - `remote`: Teknisi tangani dari jarak jauh
  - `onsite`: Teknisi harus datang ke lokasi

### symptoms
- **Type**: Object (key-value pairs)
- **Description**: Gejala yang dipilih dengan confidence value
- **Example**: `{"G01": 0.8, "G03": 0.6, "G08": 1.0}`

### timestamp
- **Type**: ISO 8601 String
- **Description**: Waktu laporan dikirim
- **Example**: "2026-06-01T10:30:45.123Z"

## Example Payload

```json
{
  "wifiName": "WiFi Main Office",
  "phone": "081234567890",
  "diagnosis": {
    "id": "P01",
    "nama": "Bandwidth penuh / overload pengguna",
    "cf": 0.87,
    "solusi": "Kurangi jumlah pengguna yang aktif atau upgrade bandwidth. Cek statistik pengguna di admin panel router.",
    "dispatch": "self"
  },
  "symptoms": {
    "G01": 0.8,
    "G03": 0.6,
    "G08": 1.0
  },
  "timestamp": "2026-06-01T10:30:45.123Z"
}
```

## Integration Points

### Frontend Service
File: `src/utils/webhookService.js`

#### Function: `sendToN8nWebhook(payload)`
- **Purpose**: Mengirim payload ke webhook n8n
- **Parameters**: payload object
- **Returns**: Promise<Response>
- **Error Handling**: Throws error jika request gagal

#### Function: `formatN8nPayload(company, topResult, selected)`
- **Purpose**: Format data menjadi struktur yang sesuai untuk n8n
- **Parameters**:
  - `company`: {name, phone}
  - `topResult`: Diagnosis hasil teratas
  - `selected`: Object gejala yang dipilih
- **Returns**: Formatted payload object

### UI Integration
File: `src/pages/Results.jsx`

#### Button Handler: `handlePrint()`
- Dipicu ketika user menekan tombol "Cetak"
- Format payload dari data hasil analisis
- Kirim ke webhook n8n via `sendToN8nWebhook()`
- Tampilkan success/error message kepada user
- Trigger browser print dialog

#### Status Indicators
- **Sending**: Tombol cetak menampilkan "Mengirim..." dengan disabled state
- **Success**: Green notification "✅ Data berhasil dikirim ke n8n"
- **Error**: Red notification "⚠️ Webhook gagal: [error message]"

## Error Handling

### Network Error
```javascript
Tidak ada koneksi ke webhook n8n
```

### Invalid Response
```javascript
Webhook error: 400 Bad Request
```

### CORS Error
```javascript
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Pastikan n8n webhook dikonfigurasi untuk menerima CORS requests atau gunakan proxy.

## Testing

### 1. Start n8n Locally
```bash
docker run -it --rm --name n8n -p 5678:80 n8nio/n8n
```

### 2. Create Webhook Workflow
- Buka n8n di `http://localhost:5678`
- Buat workflow baru dengan trigger "Webhook"
- Set webhook URL: `/webhook-test/Laptop-diagnose`
- Konfigurasi untuk method POST
- Tambahkan logger/action untuk menerima data

### 3. Test dari Aplikasi
- Jalankan aplikasi WiFi Troubleshooting
- Isikan data WiFi dan gejala
- Klik tombol "Cetak"
- Lihat pesan success/error di aplikasi
- Cek workflow log di n8n untuk data yang diterima

## Production Considerations

1. **URL Configuration**: Gunakan environment variable untuk webhook URL
   ```javascript
   const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook-test/Laptop-diagnose";
   ```

2. **Security**: 
   - Implementasi authentication token jika diperlukan
   - Validasi payload di sisi n8n
   - Gunakan HTTPS untuk production

3. **Rate Limiting**: 
   - Implementasi cooldown antara webhook calls
   - Handle duplicate requests

4. **Retry Logic**:
   ```javascript
   const maxRetries = 3;
   const retryDelay = 1000; // 1 second
   ```

5. **Logging**:
   - Log semua webhook calls untuk audit trail
   - Monitor error rates dan patterns

## N8N Workflow Setup Example

```yaml
name: WiFi Troubleshooting Analysis
description: Receive and process WiFi analysis data

nodes:
  - name: Webhook
    type: webhook
    config:
      method: POST
      path: /webhook-test/Laptop-diagnose
  
  - name: Parse Data
    type: function
    code: |
      return {
        wifiName: $input.body.wifiName,
        phone: $input.body.phone,
        diagnosis: $input.body.diagnosis,
        symptoms: $input.body.symptoms,
        timestamp: $input.body.timestamp
      };
  
  - name: Store in Database
    type: database
    config:
      # Configure your database connection
  
  - name: Send WhatsApp
    type: qontak_whatsapp
    config:
      phone: $input.body.phone
      message: "Laporan WiFi anda telah diterima..."
```

## Support & Troubleshooting

### Webhook tidak menerima data
1. Cek n8n apakah sedang berjalan
2. Verifikasi webhook URL benar
3. Cek browser console untuk error messages
4. Monitor network tab di DevTools

### CORS Error
1. Konfigurasi n8n untuk allow CORS
2. Gunakan n8n dengan SSL/TLS
3. Implement server-side proxy di backend

### Data tidak lengkap
1. Pastikan semua field dikirim dengan benar
2. Cek validation di n8n workflow
3. Review logs di aplikasi (browser console)
