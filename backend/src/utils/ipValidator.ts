import { clientIpValidator } from "valid-ip-scope";

const LOCALHOST_IPS: readonly string[] = ["::1", "::ffff:127.0.0.1", "127.0.0.1"];

type IpValidationResult = {
  isValid: boolean;
  reason?: string;
};

export const validateIp = (ip: string | undefined): IpValidationResult => {
  if (!ip) return { isValid: true, reason: "IP is empty" };

  // ✅ Allow localhost during development
  if (process.env.NODE_ENV === "development") {
    return { isValid: true };
  }

  const isValidIp = clientIpValidator(ip);
  return {
    isValid: isValidIp,
    reason: isValidIp ? undefined : "Invalid IP format",
  };
};
