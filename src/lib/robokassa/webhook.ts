import { createHash } from "node:crypto";

import { getEnv } from "@/config/env";

export function buildRobokassaResultSignature(input: {
  outSum: string;
  invId: string;
  password2: string;
}) {
  const source = `${input.outSum}:${input.invId}:${input.password2}`;
  return createHash("md5").update(source).digest("hex");
}

export function verifyRobokassaResultSignature(input: {
  outSum: string;
  invId: string;
  signatureValue: string;
}) {
  const env = getEnv();
  if (!env.ROBOKASSA_PASSWORD2) {
    throw new Error("Robokassa: задайте ROBOKASSA_PASSWORD2");
  }

  const expected = buildRobokassaResultSignature({
    outSum: input.outSum,
    invId: input.invId,
    password2: env.ROBOKASSA_PASSWORD2,
  });

  return expected.toLowerCase() === input.signatureValue.toLowerCase();
}
