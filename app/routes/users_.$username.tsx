import { prisma } from "@db/prisma";
import type { Route } from "./+types/users_.$username";
import { isRouteErrorResponse, Outlet } from "react-router";

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
  if (!user) {
    throw new Response("user not found", { status: 404 });
  }
  return user;
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { id, username } = loaderData;
  return (
    <>
      <p>{id}</p>
      <p>{username}</p>
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
