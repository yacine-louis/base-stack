import { GeneralErrorBoundary } from "~/components/errors";
import type { Route } from "../+types/root";

export default function RouteComponent() {
  return (
    <>
      <h1 className="text-h1">index route</h1>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <GeneralErrorBoundary error={error} />;
}
