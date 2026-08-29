import axios from "axios";

import type {
  ApiErrorResponse,
} from "../types/api";

export function getApiErrorMessage(
  error: unknown,
): string {
  if (
    axios.isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    const apiMessage =
      error.response?.data?.message;

    if (apiMessage) {
      return apiMessage;
    }

    if (error.code === "ECONNABORTED") {
      return "The request took too long. Please try again.";
    }

    if (!error.response) {
      return "Unable to connect to the server.";
    }
  }

  return "An unexpected error occurred.";
}