import { prisma } from "@db/prisma";
import type { Route } from "./+types/users_.$username_.notes.$noteId_.edit";
import { cn, invariantResponse } from "~/utils/misc";
import {
  data,
  Form,
  href,
  Link,
  redirect,
  useFormAction,
  useNavigation,
} from "react-router";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import { ErrorList } from "~/components/ErrorList";
import z from "zod";
import { parseWithZod } from "@conform-to/zod/v4";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { useHydrated } from "~/hooks/useHydrated";

const titleMaxLength = 100;
const contentMaxLength = 1000;

const NoteEditorSchema = z.object({
  title: z.string().min(1).max(titleMaxLength),
  content: z.string().min(1).max(contentMaxLength),
});

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

  const submission = parseWithZod(formData, { schema: NoteEditorSchema });

  if (submission.status !== "success") {
    return data(
      { result: submission.reply() },
      {
        status: submission.status === "error" ? 400 : 200,
      },
    );
  }

  const { title, content } = submission.value;

  await prisma.note.update({
    data: { title, content },
    where: { id: params.noteId },
  });

  // invariantResponse(updatedNote, "Note not found", { status: 404 });

  return redirect(
    href("/users/:username/notes/:noteId", {
      username: params.username,
      noteId: params.noteId,
    }),
  );
}

export default function RouteComponent({
  params,
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { note } = loaderData;

  const navigation = useNavigation();
  const formAction = useFormAction();
  const isSubmitting =
    navigation.state === "submitting" && navigation.formAction === formAction;

  const isHydrated = useHydrated();
  const [form, fields] = useForm({
    id: "note-editor",
    // last submittion
    lastResult: actionData?.result,
    // client side validation
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: NoteEditorSchema });
    },
    shouldValidate: "onBlur",
    defaultValue: {
      title: note.title,
      content: note.content,
    },
    defaultNoValidate: isHydrated,
  });

  return (
    <>
      <Form
        method="POST"
        className="flex flex-col gap-4"
        {...getFormProps(form)}
      >
        <label
          htmlFor={fields.title.id}
          className="flex flex-col gap-1 font-medium"
        >
          Title
        </label>
        <input {...getInputProps(fields.title, { type: "text" })} />

        <div className="min-h-6">
          <ErrorList id={fields.title.errorId} errors={fields.title.errors} />
        </div>

        <label
          htmlFor={fields.content.id}
          className="flex flex-col gap-1 font-medium"
        >
          Content
        </label>
        <textarea
          className="min-h-40 resize-none rounded-md border px-3 py-2"
          {...getTextareaProps(fields.content)}
        />
        <div className="min-h-6">
          <ErrorList
            id={fields.content.errorId}
            errors={fields.content.errors}
          />
        </div>
        <div className="min-h-6">
          <ErrorList id={form.errorId} errors={form.errors} />
        </div>
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
            className={cn(
              "rounded-md bg-blue-600 px-4 py-2 text-white",
              isSubmitting ? "opacity-75" : undefined,
            )}
            disabled={isSubmitting}
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
