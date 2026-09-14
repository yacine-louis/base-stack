import { type ReactElement } from "react";
import { type ErrorResponse, isRouteErrorResponse } from "react-router";

type StatusHandler = (error: ErrorResponse) => ReactElement | null;
type UnexpectedErrorHandler = (error: unknown) => ReactElement | null;
type GeneralErrorBoundaryProps = {
  error: unknown;
  defaultHandler?: StatusHandler;
  handlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: UnexpectedErrorHandler;
};

const defaultStatusHandler: StatusHandler = (error) => (
  <p className="text-lg font-bold">
    {error.status} {error.statusText}
  </p>
);

export const UnexpectedError: UnexpectedErrorHandler = (error) => {
  if (import.meta.env.DEV) {
    if (error instanceof Error) {
      return (
        <>
          <p className="text-lg font-bold">{error.message}</p>
          {error.stack && (
            <pre className="w-full overflow-x-auto p-4">
              <code>{error.stack}</code>
            </pre>
          )}
        </>
      );
    }
    return <p className="text-lg font-bold">{getErrorMessage(error)}</p>;
  }

  return (
    <p className="text-lg font-bold">Oops! An unexpected error occurred.</p>
  );
};

export function GeneralErrorBoundary({
  error,
  defaultHandler = defaultStatusHandler,
  handlers = {},
  unexpectedErrorHandler = UnexpectedError,
}: GeneralErrorBoundaryProps) {
  if (typeof document !== "undefined") {
    console.error(error);
  }

  if (isRouteErrorResponse(error)) {
    const handler = handlers[error.status] ?? defaultHandler;

    return handler(error);
  }

  return unexpectedErrorHandler(error);
}

export function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}
