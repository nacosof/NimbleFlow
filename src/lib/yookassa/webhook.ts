import { getEnv } from "@/config/env";

const YOOKASSA_IPV4_CIDRS = [
  "185.71.76.0/27",
  "185.71.77.0/27",
  "77.75.153.0/25",
  "77.75.154.128/25",
] as const;

const YOOKASSA_IPV4_EXACT = new Set(["77.75.156.11", "77.75.156.35"]);

function ipv4ToInt(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return null;
  }
  return (
    ((parts[0]! << 24) >>> 0) +
    ((parts[1]! << 16) >>> 0) +
    ((parts[2]! << 8) >>> 0) +
    (parts[3]! >>> 0)
  );
}

function matchCidr(ip: string, cidr: string) {
  const [base, bitsRaw] = cidr.split("/");
  if (!base || !bitsRaw) return false;
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base);
  const bits = Number(bitsRaw);
  if (ipInt == null || baseInt == null || Number.isNaN(bits)) return false;
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || null;
  }
  return request.headers.get("x-real-ip");
}

export function isYooKassaIp(ip: string | null) {
  if (!ip) return false;
  if (ip.includes(":")) {
    return ip.toLowerCase().startsWith("2a02:5180:");
  }
  if (YOOKASSA_IPV4_EXACT.has(ip)) return true;
  return YOOKASSA_IPV4_CIDRS.some((cidr) => matchCidr(ip, cidr));
}

export function assertYooKassaWebhookIp(request: Request) {
  const env = getEnv();
  if (env.NODE_ENV !== "production") {
    return;
  }

  const ip = getRequestIp(request);
  if (!isYooKassaIp(ip)) {
    throw new Error(`YooKassa webhook rejected: unexpected IP ${ip ?? "unknown"}`);
  }
}

export async function fetchYooKassaPayment(paymentId: string) {
  const env = getEnv();
  if (!env.YOOKASSA_SHOP_ID || !env.YOOKASSA_SECRET_KEY) {
    throw new Error("ЮKassa: задайте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY");
  }

  const auth = Buffer.from(
    `${env.YOOKASSA_SHOP_ID}:${env.YOOKASSA_SECRET_KEY}`,
  ).toString("base64");

  const response = await fetch(
    `https://api.yookassa.ru/v3/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
  );

  const payload = (await response.json()) as {
    id?: string;
    status?: string;
    amount?: { value: string; currency: string };
    metadata?: Record<string, string>;
    description?: string;
    code?: string;
  };

  if (!response.ok || !payload.id) {
    throw new Error(
      payload.description ||
        payload.code ||
        `ЮKassa get payment failed (${response.status})`,
    );
  }

  return payload as {
    id: string;
    status: string;
    amount?: { value: string; currency: string };
    metadata?: Record<string, string>;
  };
}
