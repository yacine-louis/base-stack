import { prisma } from "@db/prisma";
import type { Route } from "./+types/users_.$username_.notes.$noteId";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import { invariantResponse } from "~/utils/misc";
import { Form, href, Link, redirect, useNavigation } from "react-router";

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

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "delete":
      const note = await prisma.note.findUnique({
        where: {
          id: params.noteId,
        },
      });

      invariantResponse(note, "Note not found", { status: 404 });

      await prisma.note.delete({
        where: {
          id: params.noteId,
        },
      });
      return redirect(
        href("/users/:username/notes", { username: params.username }),
      );
    default:
      throw new Response(`Invalid intent: ${intent}`, { status: 400 });
  }
}

export default function RouteComponent({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { note } = loaderData;
  const navigation = useNavigation();
  return (
    <div>
      <h2 className="text-h2">{note.title}</h2>
      <p>{note.content}</p>

      <div className="mt-4 flex gap-2">
        <Link
          className="inline-block rounded-md border px-3 py-2"
          to={href("/users/:username/notes/:noteId/edit", {
            username: params.username,
            noteId: params.noteId,
          })}
        >
          Edit
        </Link>

        <Form method="POST">
          <button
            type="submit"
            className="cursor-pointer rounded-md border px-4 py-2"
            name="intent"
            value="delete"
            disabled={navigation.formData?.get("intent") === "delete"}
          >
            Delete
          </button>
        </Form>
      </div>
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
