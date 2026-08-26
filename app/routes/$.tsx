import { data, Link, useLocation } from "react-router";
import { GeneralErrorBoundary } from "~/components/errors";
import type { Route } from "./+types/$";
export async function loader() {
  throw data(null, { status: 404 });
}

export async function action() {
  throw data(null, { status: 404 });
}

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1>We can't find this page:</h1>
        <pre className="text-lg break-all whitespace-pre-wrap">
          {location.pathname}
        </pre>
      </div>

      <Link to="/" className="text-base underline">
        Back to home
      </Link>
    </div>
  );
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
