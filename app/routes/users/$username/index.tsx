import { prisma } from "@db/prisma";
import { href, Link, Outlet } from "react-router";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import { invariantResponse } from "~/utils/misc";
import type { Route } from "./+types/index";

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
      <p className="text-foreground">{id}</p>
      <p className="text-foreground">{username}</p>

      <Link
        className="text-primary decoration-primary/50 hover:text-primary/80 underline underline-offset-4"
        to={href("/users/:username/notes", { username: username })}
      >
        Go to Notes
      </Link>
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error, params }: Route.ErrorBoundaryProps) {
  return (
    <GeneralErrorBoundary
      error={error}
      handlers={{
        404: () => <p>No user with the username "{params.username}" exists</p>,
      }}
    />
  );
}
