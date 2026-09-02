import axios from "axios";

function getObjectMessage(
  data: unknown,
): string | null {
  if (
    typeof data !== "object" ||
    data === null
  ) {
    return typeof data === "string"
      ? data
      : null;
  }

  const response = data as Record<
    string,
    unknown
  >;

  if (
    typeof response.message === "string" &&
    response.message.trim()
  ) {
    return response.message;
  }

  if (
    typeof response.detail === "string" &&
    response.detail.trim()
  ) {
    return response.detail;
  }

  if (
    typeof response.title === "string" &&
    response.title.trim()
  ) {
    return response.title;
  }

  if (
    typeof response.error === "string" &&
    response.error.trim()
  ) {
    return response.error;
  }

  if (
    typeof response.data === "object" &&
    response.data !== null
  ) {
    const validationErrors =
      Object.values(
        response.data as Record<
          string,
          unknown
        >,
      )
        .flatMap((value) =>
          Array.isArray(value)
            ? value
            : [],
        )
        .filter(
          (value): value is string =>
            typeof value === "string",
        );

    if (validationErrors.length > 0) {
      return validationErrors.join(" ");
    }
  }

  return null;
}

export function getApiErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      getObjectMessage(
        error.response?.data,
      );

    if (responseMessage) {
      return responseMessage;
    }

    if (error.code === "ECONNABORTED") {
      return "The request took too long. Please try again.";
    }

    if (!error.response) {
      return "Unable to connect to the server.";
    }

    switch (error.response.status) {
      case 400:
        return "The submitted data is invalid.";

      case 401:
        return "Your session has expired. Please sign in again.";

      case 403:
        return "You do not have permission to perform this action.";

      case 404:
        return "The requested item could not be found.";

      case 409:
        return "This action conflicts with existing related data.";

      case 500:
        return "The server could not complete this action.";

      default:
        return `Request failed with status ${error.response.status}.`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}