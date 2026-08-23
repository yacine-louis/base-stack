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
import { useHydrated } from "~/hooks/useHydrated";
import { ErrorList } from "~/components/ErrorList";
import { useEffect, useRef } from "react";

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

type FormErrors<T extends string> = {
  formErrors: string[];
  fieldErrors: Record<T, string[]>;
};

const titleMaxLength = 100;
const contentMaxLength = 1000;

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

  const errors: FormErrors<"title" | "content"> = {
    formErrors: [],
    fieldErrors: {
      title: [],
      content: [],
    },
  };

  if (title === "") {
    errors.fieldErrors.title.push("Title is required");
  }
  if (title.length > titleMaxLength) {
    errors.fieldErrors.title.push(
      `Title must be ${titleMaxLength} characters of less`,
    );
  }
  if (content === "") {
    errors.fieldErrors.content.push("Content is required");
  }
  if (content.length > contentMaxLength) {
    errors.fieldErrors.content.push(
      `Content must be ${contentMaxLength} characters of less`,
    );
  }

  const hasErrors =
    errors.formErrors.length > 0 ||
    Object.values(errors.fieldErrors).some(
      (fieldErrors) => fieldErrors.length > 0,
    );
  if (hasErrors) {
    return data({ status: "error", errors } as const, 400);
  }

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
  params,
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { note } = loaderData;

  const navigation = useNavigation();
  const formAction = useFormAction();
  const isSubmitting =
    navigation.state === "submitting" && navigation.formAction === formAction;

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;
    if (actionData?.status !== "error") return;

    if (formEl.matches('[aria-invalid="true"]')) {
      formEl.focus();
    } else {
      const firstInvalidField = formEl.querySelector('[aria-invalid="true"]');
      if (firstInvalidField instanceof HTMLElement) {
        firstInvalidField.focus();
      }
    }
  }, [actionData]);

  const formErrors = actionData?.errors.formErrors;
  const fieldErrors = actionData?.errors.fieldErrors;

  // form errors
  const formHasErrors = Boolean(formErrors?.length);
  const formErrorId = formHasErrors ? "form-error" : undefined;
  const titleHasErrors = Boolean(fieldErrors?.title.length);
  const titleErrorId = titleHasErrors ? "title-error" : undefined;
  const contentHasErrors = Boolean(fieldErrors?.content.length);
  const contentErrorId = contentHasErrors ? "content-error" : undefined;

  const isHydrated = useHydrated();
  return (
    <>
      <Form
        method="POST"
        className="flex flex-col gap-4"
        noValidate={isHydrated}
        aria-invalid={formHasErrors || undefined}
        aria-describedby={formErrorId}
        ref={formRef}
        tabIndex={-1}
      >
        <label className="flex flex-col gap-1">
          <span className="font-medium">Title</span>
          <input
            name="title"
            type="text"
            defaultValue={note.title}
            className="rounded-md border px-3 py-2"
            maxLength={titleMaxLength}
            required
            aria-invalid={titleHasErrors || undefined}
            aria-describedby={titleErrorId}
            autoFocus
          />
        </label>
        <div className="min-h-6">
          <ErrorList id={titleErrorId} errors={fieldErrors?.title} />
        </div>

        <label className="flex flex-col gap-1">
          <span className="font-medium">Content</span>
          <textarea
            name="content"
            defaultValue={note.content}
            className="min-h-40 resize-none rounded-md border px-3 py-2"
            maxLength={contentMaxLength}
            required
            aria-invalid={contentHasErrors || undefined}
            aria-describedby={contentErrorId}
          />
        </label>
        <div className="min-h-6">
          <ErrorList id={contentErrorId} errors={fieldErrors?.content} />
        </div>

        <div className="min-h-6">
          <ErrorList id={formErrorId} errors={formErrors} />
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
