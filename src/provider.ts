import {z} from "zod";
import {AppError} from "./shared.js";
export const reservedRequestParams = ["model", "messages", "input", "tools", "stream"];
export const profileSchema = z
  .object({
    provider: z.literal("openai-compatible").default("openai-compatible"),
    // Absent on older profiles, which continue using Chat Completions.
    apiFormat: z.enum(["responses", "chat-completions"]).optional(),
    baseUrl: z.string().url(),
    model: z.string().min(1).max(150),
    apiKeyEnv: z
      .string()
      // Empty explicitly disables environment lookup for UI-created profiles.
      .regex(/^(?:[A-Z_][A-Z0-9_]*)?$/)
      .default("BIRDEYE_AI_API_KEY"),
    apiKey: z.string().max(4096).optional(),
    // Provider-specific body fields merged into every request; null removes an app default such as include.
    requestParams: z.record(z.string(), z.unknown())
      .refine(params => !Object.keys(params).some(key => reservedRequestParams.includes(key)), {message: "model, messages, input, tools and stream are set by the app."})
      .refine(params => JSON.stringify(params).length <= 4000, {message: "Keep extra request parameters under 4,000 characters."})
      .optional(),
  })
  .strict();
export function validateProviderUrl(value: string) {
  const url = new URL(value);
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !["http:", "https:"].includes(url.protocol)
  )
    throw new AppError(
      "INVALID_PROVIDER_URL",
      "Use a base URL without credentials, query or fragment.",
    );
  if (
    url.protocol === "http:" &&
    !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)
  )
    throw new AppError(
      "INVALID_PROVIDER_URL",
      "Remote AI providers require HTTPS. Local providers may use loopback HTTP.",
    );
  return url;
}
