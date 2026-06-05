# Panduan Setup N8N Webhook untuk WiFi Troubleshooting

## Prerequisites

- Docker (opsional, jika menggunakan Docker)
- Node.js & npm (jika install lokal)
- Port 5678 tersedia di localhost

## Opsi 1: Menggunakan Docker (Recommended)

### 1. Install & Run N8N

```bash
docker run -it --rm --name n8n \
  -p 5678:80 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Tunggu sampai muncul:

```
n8n ready on 0.0.0.0, port 5678
```

### 2. Akses N8N

Buka browser ke: `http://localhost:5678`

### 3. Setup Admin User

- Buat email dan password untuk admin
- Selesaikan setup wizard

---

## Opsi 2: Install Lokal dengan npm

### 1. Install N8N Global

```bash
npm install -g n8n
```

### 2. Start N8N

```bash
n8n start
```

Akses di: `http://localhost:5678`

---

## Membuat Workflow untuk Menerima Webhook

### Step 1: Create New Workflow

1. Klik "New Workflow"
2. Beri nama: `WiFi Troubleshooting Analysis`
3. Klik "Create"

### Step 2: Add Webhook Trigger

1. Klik **"+" button** di canvas
2. Cari **"Webhook"**
3. Pilih **"Webhook"** node
4. Di kanan panel, konfigurasi:
   - **HTTP Method**: POST

**Catatan penting**: untuk menerima data dari aplikasi, gunakan node **Webhook**. Node **HTTP Request** dipakai untuk mengirim request keluar dari n8n, bukan untuk menerima payload dari app.

- **Path**: `/webhook/netreport`
- **URL**: Akan otomatis menjadi: `http://localhost:5678/webhook/netreport`

**Penting**: Copy path penuh ini untuk konfigurasi aplikasi WiFi Troubleshooting

### Step 3: Add Logger/Logger Node

1. Klik **"+" button**
2. Cari **"Execute Command"** atau **"Code"** node (opsional)
3. Atau langsung gunakan **"Set"** node untuk transform data

Contoh workflow minimal:

```
[Webhook] → [Set/Logger] → [Respond to Webhook]
```

### Step 4: Add Response Node

1. Klik **"+" button**
2. Cari **"Respond to Webhook"**
3. Set output:

```json
{
  "status": "success",
  "message": "Data received",
  "data": {
    "nama": "{{ $json.nama }}",
    "no_telepon": "{{ $json.no_telepon }}",
    "hasil_analisa": "{{ $json.hasil_analisa.nama }}"
  }
}
```

### Step 5: Save & Activate Workflow

1. Klik **"Save"**
2. Klik **"Activate"** (toggle switch di atas)
3. Status berubah menjadi "Active"

---

## Test Webhook dari Aplikasi WiFi Troubleshooting

### 1. Konfigurasi URL (Opsional)

Jika n8n tidak di `localhost:5678`, edit `.env.local`:

```env
VITE_N8N_WEBHOOK_URL=http://your-n8n-url:5678/webhook/netreport
```

### 2. Run Aplikasi WiFi

```bash
npm run dev
```

### 3. Test Flow

1. **Landing Page** → Pilih "Buat Laporan"
2. **Symptoms Page**:
   - Isi "Nama WiFi": `WiFi Main Office`
   - Isi "No. HP (WhatsApp)": `081234567890`
   - Pilih beberapa gejala (minimal 1)
3. **Results Page**:
   - Klik tombol **"Cetak"**
   - Lihat notifikasi "✅ Data berhasil dikirim ke n8n"
   - Browser print dialog akan muncul

### 4. Verifikasi di N8N

1. Buka tab **"Execution"** di workflow n8n
2. Klik execution terakhir
3. Lihat data yang diterima di **Webhook node output**

Jika ingin mengetes endpoint sementara dari editor n8n, klik "Listen for test event" dan gunakan `/webhook-test/netreport`. Untuk aplikasi yang dipakai normal, pakai `/webhook/netreport` dan pastikan workflow sudah aktif.

Contoh output:

```json
{
  "nama": "WiFi Main Office",
  "no_telepon": "081234567890",
  "hasil_analisa": {
    "kode": "P01",
    "nama": "Bandwidth penuh / overload pengguna",
    "cf": 0.87,
    "solusi": "Kurangi jumlah pengguna yang aktif...",
    "dispatch": "self"
  },
  "gejala_ditekan": [
    { "kode": "G01", "nama": "WiFi terasa lambat", "bobot": 0.8 },
    { "kode": "G03", "nama": "WiFi sering putus-nyambung", "bobot": 0.6 }
  ],
  "timestamp": "2026-06-01T10:30:45.123Z"
}
```

---

## Advanced: Store Data to Database

### Tambah Node: Save to PostgreSQL

1. Klik **"+"** setelah Webhook
2. Cari **"PostgreSQL"**
3. Konfigurasi:
   - **Host**: `localhost`
   - **Database**: `wifi_reports`
   - **User**: `postgres`
   - **Password**: `your_password`

4. Set Query:

```sql
INSERT INTO wifi_reports (wifi_name, phone, diagnosis, confidence, timestamp)
VALUES ('{{ $json.nama }}', '{{ $json.no_telepon }}', '{{ $json.hasil_analisa.nama }}', {{ $json.hasil_analisa.cf }}, '{{ $json.timestamp }}')
```

---

## Advanced: Send WhatsApp Notification

Jika menggunakan Qontak API atau webhook WhatsApp:

1. Klik **"+"** setelah Webhook
2. Cari **"HTTP Request"**
3. Konfigurasi:
   - **Method**: POST
   - **URL**: `https://api.qontak.com/v1/broadcasts/whatsapp/direct`
   - **Headers**:
     ```
     Authorization: Bearer YOUR_QONTAK_TOKEN
     Content-Type: application/json
     ```
   - **Body**:
     ```json
     {
       "to": "{{ $json.no_telepon }}",
       "type": "template",
       "message_template_id": "wifi_report_received",
       "body": {
         "params": ["{{ $json.nama }}", "{{ $json.hasil_analisa.nama }}"]
       }
     }
     ```

---

## Troubleshooting

### Webhook tidak menerima data

**Error**: "Failed to send webhook"

**Solution**:

1. Pastikan n8n running: `http://localhost:5678` dapat diakses
2. Cek network tab di DevTools untuk actual request
3. Verify webhook path di n8n workflow

### CORS Error

**Error**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**:

1. N8N default sudah handle CORS, pastikan tidak ada nginx/reverse proxy yang block
2. Jika menggunakan reverse proxy, tambah header:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
   ```

### Port 5678 sudah digunakan

**Error**: "Port 5678 already in use"

**Solution**:

```bash
# Cari process yang menggunakan port 5678
lsof -i :5678

# Kill process (macOS/Linux)
kill -9 <PID>

# Atau gunakan port berbeda
docker run -it --rm -p 5679:80 n8nio/n8n
```

### Data tidak diterima di N8N

**Checklist**:

- [ ] N8N workflow status = "Active"
- [ ] Webhook node path sama dengan di aplikasi
- [ ] Execution log di N8N menunjukkan webhook call
- [ ] Payload valid JSON

---

## Environment Variables

Buat `.env.local` di root project:

```env
# Development
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/netreport

# Production (contoh)
# VITE_N8N_WEBHOOK_URL=https://n8n.example.com/webhook-test/netreport
```

---

## File Struktur

```
wifi_troubleshoot/
├── src/
│   ├── utils/
│   │   ├── webhookService.js      # Core webhook logic
│   │   ├── webhookConfig.js       # Configuration
│   │   └── cfEngine.js
│   ├── pages/
│   │   └── Results.jsx            # Webhook integration
│   └── ...
├── .env.example                   # Environment template
├── .env.local                     # Local env (gitignored)
├── N8N_WEBHOOK_API.md             # API Documentation
└── N8N_SETUP_GUIDE.md            # Setup guide (this file)
```

---

## Next Steps

1. ✅ Setup N8N webhook
2. ✅ Test data flow dari aplikasi
3. 🔄 Integrate dengan database (optional)
4. 🔄 Integrate dengan WhatsApp (optional)
5. 📦 Deploy ke production

---

## Support

Jika ada masalah:

1. Cek browser console untuk error message
2. Monitor N8N execution log
3. Review network request di DevTools
4. Baca dokumentasi: [N8N_WEBHOOK_API.md](./N8N_WEBHOOK_API.md)

Happy troubleshooting! 🚀
