export function normalizePhoneNumber(value) {
  const input = String(value ?? "").trim();

  if (!input) return "";

  if (input.startsWith("+62")) {
    return input;
  }

  const digits = input.replace(/\D/g, "");

  if (!digits) return "";

  if (digits.startsWith("0")) {
    return `+62 ${digits.slice(1)}`;
  }

  if (digits.startsWith("62")) {
    return `+62 ${digits.slice(2)}`;
  }

  return `+62 ${digits}`;
}