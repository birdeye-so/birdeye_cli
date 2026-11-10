import { BigNumber } from "bignumber.js";
import { ZodError } from "zod";

export type Data = Record<string, any>;
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public retryable = false,
    public details?: unknown,
  ) {
    super(message);
  }
}
export function errorData(error: unknown) {
  if (error instanceof ZodError)
    return {
      code: "INVALID_INPUT",
      message: error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
      retryable: false,
    };
  if (error instanceof AppError)
    return {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
      details: error.details,
    };
  if (error instanceof Error && error.name === "AbortError")
    return { code: "CANCELLED", message: "Run cancelled.", retryable: false };
  return {
    code: "INTERNAL_ERROR",
    message: "Operation failed. Check configuration and retry.",
    retryable: false,
  };
}
export function parseData(text: string): any {
  return JSON.parse(text, ((
    _: string,
    value: unknown,
    context?: { source?: string },
  ) => {
    if (typeof value !== "number" || !context?.source) return value;
    return Number.isFinite(value) &&
      (!Number.isInteger(value) || Number.isSafeInteger(value)) &&
      new BigNumber(value).eq(context.source)
      ? value
      : context.source;
  }) as (key: string, value: any) => any);
}
export function integer(
  value: unknown,
  name: string,
  min = 0,
  max = 1_000_000_000,
) {
  const n = Number(value);
  if (value === "" || !Number.isSafeInteger(n) || n < min || n > max)
    throw new AppError(
      "INVALID_INPUT",
      `${name} must be an integer from ${min} to ${max}.`,
    );
  return n;
}
export function object(value: unknown): Data {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Data)
    : {};
}
export function decimal(value: unknown): BigNumber | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  try {
    const n = new BigNumber(value);
    return n.isFinite() ? n : null;
  } catch {
    return null;
  }
}
export const now = () => new Date().toISOString();
