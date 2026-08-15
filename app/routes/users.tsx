import { href, Link, Outlet } from "react-router";
import type { Route } from "./+types/users";
import { prisma } from "@db/prisma";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";

export async function loader({ request }: Route.LoaderArgs) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });

  return { users };
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;
  return (
    <>
      <p>Users page</p>
      <div className="flex flex-col">
        {users.map((user) => (
          <Link
            to={href("/users/:username", { username: user.username })}
            key={user.id}
            className="text-blue-500 underline"
          >
            {user.username}
          </Link>
        ))}
      </div>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <GeneralErrorBoundary />;
}
