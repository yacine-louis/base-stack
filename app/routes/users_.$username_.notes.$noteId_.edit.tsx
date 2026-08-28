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
  useNavigate,
  useNavigation,
} from "react-router";
import { GeneralErrorBoundary } from "~/components/errors";
import { ErrorList } from "~/components/ErrorList";
import z from "zod";
import { parseWithZod } from "@conform-to/zod/v4";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getConstraints } from "@conform-to/zod/v4/future";
import { useHydrated } from "~/hooks/useHydrated";

const titleMaxLength = 100;
const contentMaxLength = 1000;

const NoteEditorSchema = z.object({
  title: z.string({ error: "Invalid type" }).min(1).max(titleMaxLength),
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
  const navigate = useNavigate();

  const [form, fields] = useForm({
    id: "edit-note-form",
    defaultNoValidate: isHydrated,

    // add constraints to form fields
    constraint: getConstraints(NoteEditorSchema),
    // last submittion
    lastResult: actionData?.result,
    defaultValue: {
      title: note.title,
      content: note.content,
    },
    shouldValidate: "onBlur",
    // client side validation
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: NoteEditorSchema });
    },
    onSubmit(event, { formData }) {
      const currentValues = {
        title: formData.get("title"),
        content: formData.get("content"),
      };

      const unchanged =
        currentValues.title === note.title &&
        currentValues.content === note.content;
      if (unchanged) {
        event.preventDefault();
        navigate(
          href("/users/:username/notes", {
            username: params.username,
          }),
        );
      }
    },
  });

  return (
    <>
      <Form
        method="POST"
        className="flex flex-col gap-4"
        {...getFormProps(form)}
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor={fields.title.id}
            className="text-foreground font-bold"
          >
            Title
          </label>
          <input
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            {...getInputProps(fields.title, { type: "text" })}
          />
          <div className="min-h-6">
            <ErrorList
              errorId={fields.title.errorId}
              errors={fields.title.errors}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor={fields.content.id}
            className="text-foreground font-bold"
          >
            Content
          </label>
          <textarea
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-40 w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            {...getTextareaProps(fields.content)}
          />
          <div className="min-h-6">
            <ErrorList
              errorId={fields.content.errorId}
              errors={fields.content.errors}
            />
          </div>
        </div>
        <div className="min-h-6">
          <ErrorList errorId={form.errorId} errors={form.errors} />
        </div>
        <div className="flex gap-2">
          <button
            type="reset"
            className="border-input bg-background hover:bg-muted cursor-pointer rounded-md border px-4 py-2 text-sm font-medium"
          >
            Reset
          </button>
          <Link
            className="border-input bg-background hover:bg-muted rounded-md border px-4 py-2 text-sm font-medium"
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
              "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
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

export function ErrorBoundary({ error, params }: Route.ErrorBoundaryProps) {
  return (
    <GeneralErrorBoundary
      error={error}
      handlers={{
        404: () => <p>No notes with "{params.noteId}" exists</p>,
      }}
    />
  );
}
