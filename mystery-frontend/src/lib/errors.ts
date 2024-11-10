import { isAxiosError } from "axios";

export function formatError(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data.error || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
