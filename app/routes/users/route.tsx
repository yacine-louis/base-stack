import { href, Link } from "react-router";
import type { Route } from "./+types/route";
import { prisma } from "@db/prisma";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import { useEffect } from "react";

export async function loader() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });

  return new Response(JSON.stringify({ users }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData as any;
  return (
    <>
      <p className="text-foreground">Users page</p>
      <div className="flex flex-col">
        {users.map((user: { username: string; id: string }) => (
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
