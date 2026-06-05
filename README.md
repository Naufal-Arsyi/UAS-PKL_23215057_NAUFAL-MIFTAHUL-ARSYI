# SISTEM PAKAR GANGGUAN WiFi - WIFI EXPERT SYSTEM
## Rule-Based Diagnostic System with Certainty Factor (CF) and Forward Chaining

---

## 📋 RINGKASAN EKSEKUTIF

Sistem Pakar Gangguan WiFi adalah aplikasi intelligent berbasis Python yang dirancang untuk:

1. **Mendiagnosa gangguan WiFi secara otomatis** dari laporan klien
2. **Mengidentifikasi root cause** (penyebab utama) gangguan
3. **Menentukan rekomendasi kunjungan teknisi** ke lokasi klien
4. **Menghasilkan laporan diagnostik formal** untuk dokumentasi

---

## 🎯 TUJUAN PENELITIAN

Mengembangkan sistem pelaporan gangguan WiFi dari client ke provider yang dapat:

- Mengurangi waktu response time troubleshooting
- Membantu helpdesk dalam prioritas teknisi yang akan dikirim
- Dokumentasi otomatis keluhan dan diagnosis
- Training tool untuk teknisi junior
- Validasi apakah kunjungan teknisi benar-benar diperlukan

---

## 🔧 METODOLOGI

### Pendekatan Sistem:
- **Rule-Based Expert System** - Menggunakan rules IF-THEN untuk diagnosis
- **Forward Chaining** - Dari gejala menuju diagnosa gangguan
- **Certainty Factor (CF)** - Ukuran kepercayaan dalam diagnosis
- **Multi-evidence CF Combination** - Menggabungkan multiple symptoms

### Formula CF Combination:
```
CF_combined = CF₁ + CF₂(1 - CF₁)

Contoh:
Jika CF₁ = 0.8 dan CF₂ = 0.6
CF_combined = 0.8 + 0.6(1 - 0.8)
CF_combined = 0.8 + 0.6 × 0.2
CF_combined = 0.8 + 0.12
CF_combined = 0.92
```

---

## 📊 KOMPONEN SISTEM

### 1. Gangguan WiFi (G01-G10) - 10 Kategori

| Kode | Gangguan | Severity | CF Typical |
|------|----------|----------|-----------|
| G01 | Koneksi WiFi Lambat | Medium | 0.0 |
| G02 | Putus Koneksi Berulang | High | 0.0 |
| G03 | Sinyal Lemah | Low | 0.0 |
| G04 | Latensi Tinggi | Medium | 0.0 |
| G05 | Masalah Resolusi DNS | Medium | 0.0 |
| G06 | Masalah DHCP (IP Assignment) | High | 0.0 |
| G07 | AP Overheating | High | 0.0 |
| G08 | Gangguan Interferensi | Medium | 0.0 |
| G09 | Kegagalan Autentikasi | High | 0.0 |
| G10 | Kemacetan Bandwidth | High | 0.0 |

**Severity Levels:**
- **High (Kritis)**: Perlu tindakan segera, berdampak pada banyak user
- **Medium (Penting)**: Mengganggu produksi, perlu investigasi cepat
- **Low (Minor)**: Berdampak terbatas, bisa ditangani user sendiri

---

### 2. Penyebab Gangguan (P01-P20) - 20 Jenis

| Kode | Penyebab | Jenis | CF Range | Solusi |
|------|----------|-------|----------|---------|
| P01 | Jarak jauh dari AP | Hardware | 0.6-0.8 | Pindahkan AP lebih dekat |
| P02 | Antena AP rusak | Hardware | 0.7-0.9 | Ganti antena AP |
| P03 | Channel WiFi tidak optimal | Configuration | 0.5-0.7 | Ubah WiFi channel |
| P04 | Bandwidth settings tidak sesuai | Configuration | 0.4-0.6 | Optimalkan bandwidth |
| P05 | Daya transmit AP rendah | Configuration | 0.6-0.8 | Tingkatkan TX power |
| P06 | Kabel Ethernet rusak | Hardware | 0.8-0.95 | Perbaiki kabel |
| P07 | AP overheating | Hardware | 0.7-0.9 | Bersihkan AP |
| P08 | Firmware AP outdated | Software | 0.5-0.7 | Update firmware |
| P09 | Interferensi 2.4GHz | Environmental | 0.6-0.8 | Ubah channel |
| P10 | ISP problem | External | 0.75-0.95 | Hubungi ISP |
| P11 | User terlalu banyak | Load | 0.6-0.85 | Limit koneksi |
| P12 | DNS Server tidak responsif | Service | 0.65-0.85 | Ganti DNS server |
| P13 | DHCP Server bermasalah | Service | 0.7-0.9 | Restart DHCP |
| P14 | IP range penuh | Configuration | 0.65-0.85 | Extend IP range |
| P15 | Hardware/driver klien problem | Client | 0.5-0.75 | Update driver |
| P16 | MAC filtering aktif | Security | 0.8-0.95 | Register MAC address |
| P17 | Password WiFi salah | Security | 0.75-0.95 | Verifikasi password |
| P18 | Memory AP penuh | Hardware | 0.6-0.8 | Restart AP |
| P19 | WPS issue | Security | 0.4-0.6 | Disable WPS |
| P20 | Thermal throttling | Hardware | 0.7-0.9 | Tingkatkan ventilasi |

**Jenis Penyebab:**
- **Hardware**: Kerusakan fisik atau hardware problem
- **Configuration**: Setting tidak optimal di AP/Router
- **Software**: Issue firmware atau driver
- **Environmental**: Gangguan dari lingkungan sekitar
- **External**: ISP atau service provider problem
- **Service**: DHCP, DNS service issue
- **Security**: Masalah authentication/security
- **Load**: Beban traffic/user berlebihan
- **Client**: Problem di sisi klien/perangkat

---

### 3. Rules (R001-R024) - 24 Rules

**Contoh Rules:**

| Rule ID | Antecedents | Consequent | CF | Description |
|---------|-------------|-----------|----|----|
| R001 | P01, P03 | G01 | 0.85 | Jarak jauh + channel penuh → WiFi lambat |
| R002 | P10 | G01 | 0.9 | ISP problem → WiFi lambat |
| R013 | P13, P14 | G06 | 0.92 | DHCP rusak + IP range penuh → DHCP problem |
| R015 | P07, P20, P18 | G07 | 0.95 | Overheating + thermal throttling + RAM penuh → AP overheat |

**Total: 24 rules** yang menghubungkan penyebab ke gangguan dengan confidence factors

---

### 4. Symptom Mapping - Pemetaan Gejala Klien

10 gejala yang dapat dilaporkan klien:

1. **slow_connection** - WiFi lambat
2. **frequent_disconnect** - WiFi sering putus
3. **weak_signal** - Sinyal lemah
4. **high_latency** - Ping/delay tinggi
5. **dns_issue** - DNS lookup lambat
6. **cannot_connect** - Device tidak bisa konek
7. **ip_assignment_fail** - Device dapat IP invalid
8. **ap_hot** - AP panas
9. **many_devices** - Banyak device terhubung
10. **intermittent_issue** - Gangguan intermittent

---

## 🚀 CARA KERJA SISTEM

### Flow Diagram:

```
┌─────────────────────────────────┐
│ 1. Klien Laporan Gejala         │
│    (via form atau chat)         │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│ 2. Sistem Memetakan Gejala      │
│    ke Penyebab + CF values      │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│ 3. Forward Chaining Engine      │
│    Aplikasikan Rules            │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│ 4. CF Calculation & Combination │
│    Hitung diagnosa gangguan     │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│ 5. Generate Diagnosis Report    │
│    + Technician Recommendation  │
└─────────────────────────────────┘
```

### Step-by-Step:

**Step 1: Klien Melaporkan Gejala**
```python
# Klien melaporkan 2 gejala dengan confidence level
test_complaints = [
    complaint_form.get_complaint_input('slow_connection', 0.9),
    complaint_form.get_complaint_input('many_devices', 0.85)
]
```

**Step 2: Mapping Gejala ke Penyebab**
```
Gejala: slow_connection (confidence: 0.9)
  → P01 (0.7) = 0.9 × 0.7 = 0.63
  → P10 (0.85) = 0.9 × 0.85 = 0.765
  → P11 (0.8) = 0.9 × 0.8 = 0.72

Gejala: many_devices (confidence: 0.85)
  → P11 (0.9) = 0.85 × 0.9 = 0.765

P11 Combination: CF(P11) = 0.72 + 0.765(1-0.72) = 0.72 + 0.2135 = 0.9335
```

**Step 3: Forward Chaining**
```
Rule R001: IF P01 AND P03 THEN G01 (CF=0.85)
Rule R002: IF P10 THEN G01 (CF=0.9)
Rule R003: IF P11 THEN G01 (CF=0.8)
...
```

**Step 4: CF Calculation**
```
G01 dari R003: CF(P11) × CF(R003) = 0.9335 × 0.8 = 0.7468
G10 dari R021: CF(P11) × CF(R021) = 0.9335 × 0.9 = 0.8402
```

**Step 5: Report Generation**
```
DIAGNOSIS HASIL:
- G01 (WiFi Lambat): CF = 0.8452 (Confidence: Tinggi)
- G10 (Kemacetan Bandwidth): CF = 0.8402 (Confidence: Tinggi)
- G04 (Latensi Tinggi): CF = 0.7707 (Confidence: Tinggi)

REKOMENDASI: DIREKOMENDASIKAN kunjungan teknisi
ALASAN: Multiple disturbances detected
```

---

## 💡 TEST CASES

### Test Case 1: WiFi Lambat + Banyak Device
**Klien Reports:**
- Koneksi internet sangat lambat (Confidence: 0.9)
- Banyak perangkat terhubung (Confidence: 0.85)

**Expected Diagnosis:**
- G01 (Slow WiFi): CF 0.8452 - Tinggi
- G10 (Congestion): CF 0.8402 - Tinggi
- G04 (High Latency): CF 0.7707 - Tinggi

**Recommendation:** SANGAT DIREKOMENDASIKAN - Multiple disturbances

---

### Test Case 2: AP Panas + Putus Koneksi
**Klien Reports:**
- AP panas dan bau hangus (Confidence: 0.95)
- WiFi sering putus-putus (Confidence: 0.88)

**Expected Diagnosis:**
- G07 (AP Overheating): CF 0.95+ - Sangat Tinggi
- G02 (Frequent Disconnections): CF 0.85+ - Tinggi

**Recommendation:** SANGAT DIREKOMENDASIKAN - Hardware issue detected

---

### Test Case 3: Sinyal Lemah + DNS Issue
**Klien Reports:**
- Sinyal WiFi sangat lemah (Confidence: 0.8)
- DNS lookup sangat lambat (Confidence: 0.75)

**Expected Diagnosis:**
- G03 (Weak Signal): CF 0.78 - Tinggi
- G05 (DNS Issue): CF 0.82 - Tinggi

**Recommendation:** PERTIMBANGKAN - Could be location or ISP issue

---

## 📈 CONFIDENCE LEVELS & DECISION MAKING

### CF Values Interpretation:

```
CF ≥ 0.8  →  Sangat Tinggi (Very High)    - Highly Confident
CF 0.6-0.8 → Tinggi (High)                - Moderately Confident
CF 0.4-0.6 → Sedang (Medium)              - Somewhat Confident
CF < 0.4   → Rendah (Low)                 - Low Confidence
```

### Technician Visit Recommendation Logic:

```
IF CF > 0.8 OR (Severity = High AND CF > 0.7)
  THEN "SANGAT DIREKOMENDASIKAN" (Highly Recommended)

ELSE IF Multiple Disturbances Detected
  THEN "SANGAT DIREKOMENDASIKAN"

ELSE IF (Severity = High AND CF > 0.7)
  THEN "DIREKOMENDASIKAN" (Recommended)

ELSE IF CF > 0.5
  THEN "PERTIMBANGKAN" (Consider)

ELSE
  THEN "TIDAK PERLU" (Not Needed)
```

---

## 📁 FILE STRUCTURE

```
wifi_troubleshoot/
├── wifi_expert_system.ipynb              # Main Jupyter notebook
├── WiFi_Expert_System_Database.xlsx      # Complete reference database
├── generate_database.py                  # Script untuk buat Excel
├── expert_system_database.py             # Old version
└── README.md                             # This file
```

---

## 🚀 CARA MENGGUNAKAN SISTEM

### 1. Persiapan

```bash
# Install dependencies
pip install pandas numpy jupyter matplotlib seaborn openpyxl xlsxwriter
```

### 2. Run Jupyter Notebook

```bash
jupyter notebook wifi_expert_system.ipynb
```

### 3. Tahap-tahap Penggunaan

**A. Initialize System (Run all cells in Section 1-4)**

```python
# Sistem otomatis membaca dan initialize database
expert_system = WiFiExpertSystem(disturbances, causes, rules)
print("✓ System initialized")
```

**B. Input Klien Complaints (Section 5)**

```python
# Option 1: Menggunakan predefined symptoms
test_complaints = [
    complaint_form.get_complaint_input('slow_connection', 0.9),
    complaint_form.get_complaint_input('many_devices', 0.85)
]

# Option 2: Custom complaints
custom_complaints = [
    {
        'symptom_id': 'slow_connection',
        'description': 'WiFi lambat',
        'confidence': 0.85
    }
]
```

**C. Run Diagnosis (Section 6)**

```python
# Map symptoms to causes
mapped_causes = complaint_form.map_symptoms_to_causes(test_complaints)

# Add facts to expert system
for cause_id, cf_value in mapped_causes.items():
    test_system.add_fact(cause_id, cf_value)

# Run forward chaining
diagnosis = test_system.forward_chain()

# Get recommendation
visit_recommendation, reason = test_system.get_visit_recommendation(diagnosis)
```

**D. Generate Report (Section 11)**

```python
# Create report
report = report_generator.generate_report(
    case_name="Test Case 1",
    complaints=test_complaints,
    diagnosis=diagnosis,
    visit_recommendation=visit_recommendation,
    reason=reason
)

# Display and save
print(report)
report_generator.save_report('Laporan_Diagnosa.txt', report)
```

---

## 📊 EXCEL DATABASE REFERENCE

### Sheet 1: Gangguan
- **10 WiFi disturbances** (G01-G10)
- Codes, names, descriptions, severity levels
- Use for symptom mapping

### Sheet 2: Penyebab
- **20 causes** (P01-P20)
- CF ranges, type classification
- Solutions for each cause

### Sheet 3: Rules
- **24 inference rules** (R001-R024)
- Links between causes and disturbances
- CF values for each rule

### Sheet 4: Symptom Mapping
- **10 symptoms** that clients can report
- Primary and secondary causes for each symptom
- Mapping CF values

### Sheet 5: CF Reference
- **CF Combination Formula**
- Confidence level interpretation
- Technician visit decision rules

### Sheet 6: Documentation
- System overview and methodology
- Components and workflow description
- Features and next steps

---

## ✨ FITUR UTAMA SISTEM

### ✅ Automated Diagnosis
- Automatic symptom to cause mapping
- Forward chaining inference
- Multi-evidence CF combination

### ✅ Intelligent Decision Making
- CF-based confidence scoring
- Severity-aware recommendations
- Technician visit prioritization

### ✅ Comprehensive Reporting
- Detailed diagnostic reports
- Root cause analysis
- Recommended actions

### ✅ Scalability
- Easy to add new rules
- Support for new disturbances/causes
- Modular architecture

### ✅ Historical Analysis
- Excel import for historical data
- Pattern recognition capability
- Empirical CF validation

---

## 🔮 FUTURE ENHANCEMENTS

### Phase 1: Validation
- [ ] Validate CF values with real historical data
- [ ] Fine-tune rule weights based on actual outcomes
- [ ] Adjust confidence thresholds

### Phase 2: Integration
- [ ] API endpoint for helpdesk integration
- [ ] Database backend for data persistence
- [ ] Web interface for user-friendly input
- [ ] Mobile app for self-service diagnosis

### Phase 3: Advanced Features
- [ ] Machine Learning for CF auto-tuning
- [ ] Time-series analysis for trend detection
- [ ] Predictive maintenance recommendations
- [ ] Network topology integration
- [ ] Automated email/SMS notifications
- [ ] Performance analytics dashboard

### Phase 4: AI Enhancement
- [ ] Natural Language Processing (NLP) for free-text complaints
- [ ] Deep Learning for pattern recognition
- [ ] Anomaly detection for unusual scenarios
- [ ] Continuous learning from new cases

---

## 📞 SUPPORT & MAINTENANCE

### Regular Updates Needed
- Monthly: Review new disturbance patterns
- Quarterly: Validate and adjust CF values
- Semi-annually: Add new rules based on trends
- Annually: Full system audit and optimization

### Common Issues & Solutions

**Issue: WiFi intermittent, cannot isolate cause**
- Solution: Ask for additional symptoms (time of day, specific devices, etc.)
- Collect more data before final diagnosis

**Issue: Multiple diagnosis with similar CF values**
- Solution: Recommend broader investigation
- May require technician visit for physical inspection

**Issue: High CF but issue persists**
- Solution: Collect feedback from technician
- Update rules and CF values based on actual findings

---

## 📝 NOTES & BEST PRACTICES

### Data Collection Best Practices
1. Ask for specific symptoms, not vague complaints
2. Get confidence levels (how sure is the reporter?)
3. Collect environmental context (time, location, affected users)
4. Track actual outcomes vs. diagnosis for learning

### Rule Development Guidelines
1. Rules should have clear cause-effect relationships
2. CF values should reflect empirical evidence
3. Complex rules (3+ antecedents) should have high CF threshold
4. Single antecedent rules can be more liberal

### System Validation Checklist
- [ ] Does system correctly identify single cause diagnoses?
- [ ] Can system combine multiple causes logically?
- [ ] Are technician recommendations appropriate?
- [ ] Do reports provide actionable insights?
- [ ] Can historical data validate system accuracy?

---

## 📚 REFERENCES & FURTHER READING

### Certainty Factor Theory
- Shortliffe, E.H. & Buchanan, B.G. (1975). A model of inexact reasoning in medicine
- Based on MYCIN expert system pioneering work
- CF ranges from -1 to +1 (often 0 to 1 for medical applications)

### Expert Systems
- Jackson, P. (1998). Introduction to Expert Systems
- Giarratano & Riley. Expert Systems: Principles and Programming

### WiFi Troubleshooting Standards
- IEEE 802.11 specifications
- WiFi Alliance best practices
- ISP standards and SLAs

---

## 🔗 N8N Webhook Integration

Sistem ini dilengkapi dengan integrasi webhook untuk mengirim data analisis secara otomatis ke **N8N** workflow automation platform.

### Fitur Webhook:
- **Automatic Data Transmission**: Data hasil analisis dikirim otomatis ketika user menekan tombol "Cetak"
- **Structured JSON Payload**: Format data terstandar untuk mudah diproses di N8N
- **Error Handling**: User-friendly error messages jika webhook gagal
- **Real-time Feedback**: Success/error notifications di UI

### Data yang Dikirim:
```json
{
  "wifiName": "Nama WiFi",
  "phone": "081234567890",
  "diagnosis": {
    "id": "P01",
    "nama": "Nama penyebab gangguan",
    "cf": 0.87,
    "solusi": "Solusi yang direkomendasikan",
    "dispatch": "self|remote|onsite"
  },
  "symptoms": { "G01": 0.8, "G03": 0.6 },
  "timestamp": "2026-06-01T10:30:45.123Z"
}
```

### Webhook URL:
```
http://localhost:5678/webhook-test/netreport
```

### Setup Instructions:
Lihat file dokumentasi lengkap:
- **API Documentation**: [N8N_WEBHOOK_API.md](./N8N_WEBHOOK_API.md)
- **Setup Guide**: [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md)

### Quick Start:
```bash
# 1. Start N8N (menggunakan Docker)
docker run -it --rm -p 5678:80 n8nio/n8n

# 2. Setup webhook di N8N
# Buka http://localhost:5678
# Buat workflow dengan webhook trigger di path: /webhook-test/netreport

# 3. Run aplikasi WiFi Troubleshooting
npm run dev

# 4. Test
# - Buat laporan WiFi
# - Pilih gejala
# - Klik "Cetak"
# - Lihat data di N8N execution log
```

### Konfigurasi:
Jika menggunakan N8N di URL berbeda, edit `.env.local`:
```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook-test/netreport
```

---

## ✉️ Contact & Questions

For questions, improvements, or bug reports regarding this WiFi Expert System, please contact the development team.

**System Version:** 1.1
**Last Updated:** June 2026
**Status:** Production Ready with N8N Integration

---

*End of Documentation*
