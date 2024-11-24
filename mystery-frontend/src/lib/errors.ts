import { isAxiosError } from "axios";

export type SocketError = Error & { description?: number };

function isSocketError(error: unknown): error is SocketError {
  return (
    error instanceof Error &&
    "description" in error &&
    typeof (error as SocketError).description === "number"
  );
}

export function formatError(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data.error || error.message;
  }

  if (isSocketError(error)) {
    return `${error.message}, with error code: ${error.description}`;
  }
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
