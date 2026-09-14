import { data, Link, useLocation } from "react-router";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import type { Route } from "./+types/route";
export async function loader() {
  throw data(null, { status: 404 });
}

export async function action() {
  throw data(null, { status: 404 });
}

function NotFound() {
  const location = useLocation();

  return (
    <div className="text-foreground flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-h3">We can't find this page:</h1>
        <pre className="bg-muted text-muted-foreground rounded-md p-3 text-lg break-all whitespace-pre-wrap">
          {location.pathname}
        </pre>
      </div>

      <Link
        to="/"
        className="text-primary decoration-primary/50 hover:text-primary/80 text-base underline underline-offset-4"
      >
        Back to home
      </Link>
    </div>
  );
}

export default function RouteComponent() {
  return <NotFound />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <GeneralErrorBoundary
      error={error}
      handlers={{
        404: () => <NotFound />,
      }}
    />
  );
}
