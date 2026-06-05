const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchGejala() {
  const result = await request('/gejala.php');
  return result.data || [];
}

export async function fetchPenyebab() {
  const result = await request('/penyebab.php');
  return result.data || [];
}

export async function fetchRules() {
  const result = await request('/rules.php');
  return result.data || [];
}

export async function diagnose(selected) {
  const result = await request('/diagnosa.php', {
    method: 'POST',
    body: JSON.stringify({ selected }),
  });
  return result;
}
