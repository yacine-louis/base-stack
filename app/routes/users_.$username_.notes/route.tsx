import { prisma } from "@db/prisma";
import type { Route } from "./+types/route";
import { NavLink, Outlet } from "react-router";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import { cn, invariantResponse } from "~/utils/misc";

export async function loader({ params }: Route.LoaderArgs) {
  const { username } = params;

  const data = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      notes: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    where: {
      username,
    },
  });

  invariantResponse(data, "Data not found", { status: 404 });

  return { data };
}
let rerenders = 0;

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  // oxlint-disable-next-line
  rerenders += 1;
  return (
    <>
      <div className="flex">
        <aside className="border-border bg-card w-64 shrink-0 border-r p-4">
          <h2 className="text-muted-foreground mb-3 text-sm font-semibold">
            Notes
          </h2>

          <nav className="flex flex-col gap-1">
            {data.notes.map((note) => (
              <NavLink
                key={note.id}
                to={`/users/${data.username}/notes/${note.id}`}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
                preventScrollReset
              >
                {note.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="bg-background text-foreground min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export function ErrorBoundary({ error, params }: Route.ErrorBoundaryProps) {
  return (
    <GeneralErrorBoundary
      error={error}
      handlers={{
        404: () => <p>No notes with the username "{params.username}" exists</p>,
      }}
    />
  );
}
