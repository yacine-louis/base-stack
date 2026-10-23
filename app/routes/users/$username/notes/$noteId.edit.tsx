import { prisma } from "@db/prisma";
import type { Route } from "./+types/$noteId.edit";
import { invariantResponse } from "~/utils/misc";
import { data, Form, href, redirect } from "react-router";
import { GeneralErrorBoundary } from "~/components/GeneralErrorBoundary";
import { createServerValidate } from "~/utils/form.server";
import { createNoteFormOptions } from "./+form/config";
import { isNoteTitleUnique } from "./+form/actions.server";
import { useAppForm } from "~/components/form/app-form";
import { BackLink } from "~/components/BackLink";

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

  const serverValidate = createServerValidate(
    createNoteFormOptions(async ({ value, createErrorMap }) => {
      const unique = await isNoteTitleUnique({
        title: value.title,
        username: params.username,
        noteId: params.noteId,
      });
      if (unique) return undefined;

      const errors = createErrorMap();
      errors.fields.title = "You already have a note with this title";
      return errors;
    }),
  );

  const result = await serverValidate(formData);
  if (!result.success) {
    return data({ serverState: result.serverState }, { status: 400 });
  }

  const { title, content } = result.values;
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

  const form = useAppForm({
    ...createNoteFormOptions(),
    defaultValues: {
      title: note.title,
      content: note.content,
    },
    serverState: actionData?.serverState,
  });

  return (
    <>
      <form.AppForm>
        <Form
          id={form.formId}
          method="post"
          noValidate
          onSubmit={() => form.handleSubmit()}
          className="flex flex-col gap-4"
        >
          <form.Field name="title">
            {(field) => (
              <div className="flex flex-col gap-1">
                <field.Label className="text-foreground font-bold">
                  Title
                </field.Label>
                <field.TextInput className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none" />
                <field.Error className="min-h-6" />
              </div>
            )}
          </form.Field>

          <form.Field name="content">
            {(field) => (
              <div className="flex flex-col gap-1">
                <field.Label className="text-foreground font-bold">
                  Content
                </field.Label>
                <field.TextArea className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-40 w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none" />
                <field.Error className="min-h-6" />
              </div>
            )}
          </form.Field>

          <div role="alert" className="min-h-6">
            <form.Error />
          </div>

          <div className="flex gap-2">
            <button
              type="reset"
              className="border-input bg-background hover:bg-muted cursor-pointer rounded-md border px-4 py-2 text-sm font-medium"
              onClick={(event) => {
                event.preventDefault();
                form.reset();
              }}
            >
              Reset
            </button>
            <BackLink
              className="border-input bg-background hover:bg-muted rounded-md border px-4 py-2 text-sm font-medium"
              fallback={href("/users/:username/notes/:noteId", {
                username: params.username,
                noteId: params.noteId,
              })}
            >
              Cancel
            </BackLink>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  form={form.formId}
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </Form>
      </form.AppForm>
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
