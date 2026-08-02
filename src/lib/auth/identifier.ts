export type IdentifierChannel = "email" | "phone";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9]{10,15}$/;

export function detectChannel(raw: string): IdentifierChannel | null {
  const value = raw.trim();
  if (emailPattern.test(value)) return "email";
  const digits = normalizePhone(value);
  if (phonePattern.test(digits) || phonePattern.test(value.replace(/\s+/g, ""))) {
    return "phone";
  }
  return null;
}

export function normalizeIdentifier(raw: string, channel: IdentifierChannel) {
  if (channel === "email") {
    return raw.trim().toLowerCase();
  }
  return normalizePhone(raw);
}

export function normalizePhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    digits = `7${digits}`;
  }
  return `+${digits}`;
}

export function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
