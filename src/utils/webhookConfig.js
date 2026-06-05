/**
 * Konfigurasi Webhook N8N
 * Edit file ini untuk mengubah webhook URL atau settings lainnya
 */

export const WEBHOOK_CONFIG = {
  // URL webhook n8n untuk menerima data analisis
  N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL || "http://localhost:5678/webhook-test/netreport",

  // Timeout untuk webhook call (ms)
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    enabled: true,
    maxAttempts: 3,
    delayMs: 1000,
  },

  // Feature flags
  FEATURES: {
    // Aktifkan webhook integration
    enabled: true,
    // Debug mode untuk console logging
    debug: true,
    // Show user notifications
    showNotifications: true,
  },

  // Environment-specific settings
  ENV: {
    development: {
      debug: true,
    },
    production: {
      debug: false,
    },
  },
};

/**
 * Get active webhook config berdasarkan environment
 */
export function getWebhookConfig() {
  const isDev = import.meta.env.DEV;
  const env = isDev ? "development" : "production";
  const baseConfig = WEBHOOK_CONFIG;
  const envConfig = baseConfig.ENV[env] || {};

  return {
    ...baseConfig,
    ...envConfig,
  };
}
