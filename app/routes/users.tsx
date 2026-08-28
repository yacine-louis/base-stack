import { href, Link } from "react-router";
import type { Route } from "./+types/users";
import { prisma } from "@db/prisma";
import { GeneralErrorBoundary } from "~/components/errors";

export async function loader() {
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
      <p className="text-foreground">Users page</p>
      <div className="flex flex-col">
        {users.map((user) => (
          <Link
            to={href("/users/:username", { username: user.username })}
            key={user.id}
            className="text-primary decoration-primary/50 hover:text-primary/80 underline underline-offset-4"
          >
            {user.username}
          </Link>
        ))}
      </div>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <GeneralErrorBoundary error={error} />;
}
