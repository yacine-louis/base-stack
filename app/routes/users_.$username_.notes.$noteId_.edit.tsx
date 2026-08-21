import { prisma } from "@db/prisma";
import type { Route } from "./+types/users_.$username_.notes.$noteId_.edit";
import { invariantResponse } from "~/utils/misc";
import { Form, href, Link, redirect } from "react-router";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";

export async function loader({ params }: Route.LoaderArgs) {
  const note = await prisma.note.findFirst({
    select: {
      title: true,
      content: true,
    },
    where: {
      id: params.noteId,
      owner: {
        username: params.username,
      },
    },
  });

  invariantResponse(note, "Note not Found", { status: 404 });

  return { note };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  invariantResponse(typeof title === "string", "Title must be string", {
    status: 400,
  });
  invariantResponse(typeof content === "string", "Content must be string", {
    status: 400,
  });

  const updatedNote = await prisma.note.update({
    data: { title, content },
    where: { id: params.noteId },
  });

  invariantResponse(updatedNote, "Note not found", { status: 404 });

  return redirect(
    href("/users/:username/notes/:noteId", {
      username: params.username,
      noteId: params.noteId,
    }),
  );
}

export default function RouteComponent({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { note } = loaderData;

  return (
    <>
      <Form method="POST" className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-medium">Title</span>
          <input
            name="title"
            type="text"
            defaultValue={note.title}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Content</span>
          <textarea
            name="content"
            defaultValue={note.content}
            className="min-h-40 resize-none rounded-md border px-3 py-2"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="reset"
            className="cursor-pointer rounded-md border px-4 py-2"
          >
            Reset
          </button>
          <Link
            className="rounded-md border px-4 py-2"
            to={href("/users/:username/notes/:noteId", {
              username: params.username,
              noteId: params.noteId,
            })}
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white"
          >
            Submit
          </button>
        </div>
      </Form>
    </>
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
