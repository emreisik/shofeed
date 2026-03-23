import { randomBytes } from "crypto";

export function generateFeedToken(): string {
  return randomBytes(24).toString("hex");
}
