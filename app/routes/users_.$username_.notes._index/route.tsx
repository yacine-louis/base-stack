import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import type { Route } from "./+types/route";

export default function RouteComponent() {
  return <p className="text-muted-foreground">no note is selected</p>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  <GeneralErrorBoundary error={error} />;
}
