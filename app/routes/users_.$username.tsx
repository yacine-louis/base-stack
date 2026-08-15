import { prisma } from "@db/prisma";
import type { Route } from "./+types/users_.$username";
import {
  href,
  isRouteErrorResponse,
  Link,
  Outlet,
  useParams,
} from "react-router";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import { invariantResponse } from "~/utils/misc";

export async function loader({ params }: Route.LoaderArgs) {
  const { username } = params;
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
    },
    where: {
      username,
    },
  });

  invariantResponse(user, "user not found", { status: 404 });

  return user;
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { id, username } = loaderData;
  return (
    <>
      <p>{id}</p>
      <p>{username}</p>

      <Link
        className="text-blue-500 underline"
        to={href("/users/:username/notes", { username: username })}
        prefetch="render"
      >
        Go to Notes
      </Link>
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ params }: Route.ErrorBoundaryProps) {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => <p>No user with the username "{params.username}" exists</p>,
      }}
    />
  );
}
