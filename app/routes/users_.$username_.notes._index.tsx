import { GeneralErrorBoundary } from "~/components/errors";
import type { Route } from "./+types/users_.$username_.notes._index";

export default function RouteComponent() {
  return <p className="text-muted-foreground">no note is selected</p>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  <GeneralErrorBoundary error={error} />;
}
