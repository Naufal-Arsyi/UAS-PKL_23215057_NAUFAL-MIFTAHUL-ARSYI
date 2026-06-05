/**
 * Service untuk mengirim data analisis ke webhook n8n
 */

import { normalizePhoneNumber } from "./phoneNumber.js";
import { WEBHOOK_CONFIG } from "./webhookConfig.js";

/**
 * Kirim data hasil analisis ke webhook n8n
 * @param {Object} payload - Data yang akan dikirim
 * @param {string} payload.nama - Nama pelapor/WiFi
 * @param {string} payload.no_telepon - Nomor telepon
 * @param {Object} payload.hasil_analisa - Hasil analisis penyebab
 * @param {string} payload.hasil_analisa.kode - ID penyebab
 * @param {string} payload.hasil_analisa.nama - Nama penyebab
 * @param {number} payload.hasil_analisa.cf - Certainty Factor (0-1)
 * @param {string} payload.hasil_analisa.solusi - Solusi untuk penyebab
 * @param {string} payload.hasil_analisa.dispatch - Tipe penanganan (self/remote/onsite)
 * @param {Array<{ kode: string, nama: string, bobot: number }>} payload.gejala_ditekan - Gejala yang dipilih
 * @param {string} payload.timestamp - Timestamp laporan
 * @returns {Promise<Response>}
 */
export async function sendToN8nWebhook(payload) {
  const { N8N_WEBHOOK_URL, TIMEOUT } = WEBHOOK_CONFIG;
  const { debug } = WEBHOOK_CONFIG.FEATURES;

  try {
    if (debug) {
      console.log("📤 Mengirim data ke webhook n8n:", N8N_WEBHOOK_URL);
      console.log("📦 Payload:", payload);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (debug) {
      console.log("✅ Data berhasil dikirim ke n8n:", result);
    }
    
    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("❌ Webhook timeout:", error);
      throw new Error(`Webhook timeout (${TIMEOUT}ms) - n8n tidak merespons`);
    }

    console.error("❌ Gagal mengirim ke webhook n8n:", error);
    throw error;
  }
}

/**
 * Format payload untuk dikirim ke n8n
 * @param {Object} company - Data pelapor { name, phone }
 * @param {Object} topResult - Hasil diagnosa teratas
 * @param {Object} selected - Gejala yang dipilih { [id]: confidence }
 * @returns {Object} Payload yang siap dikirim
 */
export function formatN8nPayload(company, topResult, selected, gejalaMap = {}) {
  const normalizedPhone = normalizePhoneNumber(company.phone);

  const gejalaDitekan = Object.entries(selected)
    .map(([id, bobot]) => {
      const gejala = gejalaMap[id];

      if (!gejala) return null;

      return {
        kode: gejala.id,
        nama: gejala.nama,
        bobot,
      };
    })
    .filter(Boolean);

  const hasilAnalisa = topResult
    ? {
        kode: topResult.id,
        nama: topResult.nama,
        cf: topResult.cf,
        solusi: topResult.solusi,
        dispatch: topResult.dispatch,
      }
    : null;

  return {
    nama: company.name || "",
    no_telepon: normalizedPhone,
    hasil_analisa: hasilAnalisa,
    gejala_ditekan: gejalaDitekan,
    timestamp: new Date().toISOString(),

    // Legacy aliases to avoid breaking existing webhook flows.
    wifiName: company.name || "",
    phone: normalizedPhone,
    diagnosis: hasilAnalisa,
    symptoms: selected,
  };
}
