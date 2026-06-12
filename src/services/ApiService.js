const API_URL =
  import.meta.env.VITE_API_URL;
  
console.log(
  "CLIENT API URL:",
  API_URL
);
async function request(
  path,
  options = {}
) {

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        headers: {
          "Content-Type":
            "application/json",
          ...(options.headers || {}),
        },
        ...options,
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Request gagal"
    );
  }

  return result;
}

export async function fetchGejala() {

  const result =
    await request(
      "/gejala.php"
    );

  return result.data || [];
}

export async function fetchPenyebab() {

  const result =
    await request(
      "/penyebab.php"
    );

  return result.data || [];
}

export async function fetchRules() {

  const result =
    await request(
      "/rules.php"
    );

  return result.data || [];
}

export async function diagnose(
  selected
) {

  return request(
    "/diagnosa.php",
    {
      method: "POST",
      body: JSON.stringify({
        selected,
      }),
    }
  );
}