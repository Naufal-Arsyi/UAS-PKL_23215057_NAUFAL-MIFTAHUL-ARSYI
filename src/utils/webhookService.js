/**
 * Service untuk mengirim data analisis ke webhook n8n
 */

import { WEBHOOK_CONFIG } from "./webhookConfig.js";

/**
 * Kirim data hasil analisis ke webhook n8n
 * @param {Object} payload - Data yang akan dikirim
 * @param {string} payload.wifiName - Nama WiFi
 * @param {string} payload.phone - Nomor telepon (WhatsApp)
 * @param {Object} payload.diagnosis - Hasil analisis penyebab
 * @param {string} payload.diagnosis.id - ID penyebab
 * @param {string} payload.diagnosis.nama - Nama penyebab
 * @param {number} payload.diagnosis.cf - Certainty Factor (0-1)
 * @param {string} payload.diagnosis.solusi - Solusi untuk penyebab
 * @param {string} payload.diagnosis.dispatch - Tipe penanganan (self/remote/onsite)
 * @param {Object} payload.symptoms - Gejala yang dipilih { [id]: confidence }
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
export function formatN8nPayload(company, topResult, selected) {
  return {
    wifiName: company.name || "",
    phone: company.phone || "",
    diagnosis: {
      id: topResult.id,
      nama: topResult.nama,
      cf: topResult.cf,
      solusi: topResult.solusi,
      dispatch: topResult.dispatch,
    },
    symptoms: selected,
    timestamp: new Date().toISOString(),
  };
}
