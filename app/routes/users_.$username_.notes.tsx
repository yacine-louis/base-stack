import { prisma } from "@db/prisma";
import type { Route } from "./+types/users_.$username_.notes";
import { NavLink, Outlet } from "react-router";
import { GeneralErrorBoundary } from "~/components/errors";
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

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  return (
    <>
      <div className="flex">
        <aside className="w-64 shrink-0 border-r border-gray-200 p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Notes</h2>

          <nav className="flex flex-col gap-1">
            {data.notes.map((note) => (
              <NavLink
                key={note.id}
                to={`/users/${data.username}/notes/${note.id}`}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm",
                    isActive
                      ? "bg-blue-500 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100",
                  )
                }
                preventScrollReset
              >
                {note.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-6">
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
