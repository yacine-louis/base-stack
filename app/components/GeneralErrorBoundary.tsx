import { type ReactElement } from "react";
import {
  type ErrorResponse,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from "react-router";

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => ReactElement | null;

const defaultStatusHandler: StatusHandler = ({ error }) => (
  <p>
    {error.status} {error.data}
  </p>
);

const defaultUnexpectedErrorHandler = (error: unknown) => (
  <p>{getErrorMessage(error)}</p>
);

export function GeneralErrorBoundary({
  defaultStatusHandler: statusHandler,
  statusHandlers,
  unexpectedErrorHandler,
}: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => ReactElement | null;
}) {
  const error = useRouteError();
  const params = useParams();
  const isResponse = isRouteErrorResponse(error);
  const resolvedStatusHandler = statusHandler ?? defaultStatusHandler;
  const resolvedUnexpectedErrorHandler =
    unexpectedErrorHandler ?? defaultUnexpectedErrorHandler;

  if (typeof document !== "undefined") {
    console.error(error);
  }

  return (
    <div className="container flex items-center justify-center p-20 text-2xl">
      {isResponse
        ? (statusHandlers?.[error.status] ?? resolvedStatusHandler)({
            error,
            params,
          })
        : resolvedUnexpectedErrorHandler(error)}
    </div>
  );
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
