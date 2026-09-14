import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import type { Route } from "./+types/route";

export default function RouteComponent() {
  return (
    <>
      <h1 className="text-h1 text-foreground">index route</h1>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <GeneralErrorBoundary error={error} />;
}
