import { prisma } from "@db/prisma";
import type { Route } from "./+types/users_.$username_.notes.$noteId";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import { invariantResponse } from "~/utils/misc";

export async function loader({ params }: Route.LoaderArgs) {
  const { username, noteId } = params;

  const note = await prisma.note.findUnique({
    select: {
      id: true,
      title: true,
      content: true,
    },
    where: {
      id: noteId,
      owner: {
        username,
      },
    },
  });

  invariantResponse(note, "Note Not Found", { status: 404 });

  return { note };
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData;
  return (
    <div>
      <h2 className="text-h2">{note.title}</h2>
      <br />
      <p>{note.content}</p>
    </div>
  );
}

export function ErrorBoundary({ params }: Route.ErrorBoundaryProps) {
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => <p>No notes with "{params.noteId}" exists</p>,
      }}
    />
  );
}
