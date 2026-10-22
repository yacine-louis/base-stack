import { formOptions, type FormValidatorFn } from "@tanstack/react-form";
import { z } from "zod";

export const titleMaxLength = 100;
export const contentMaxLength = 10_000;

export const titleRequiredMessage = "Title is required";
export const titleTooLongMessage = `Title must be ${titleMaxLength} characters or less`;
export const contentRequiredMessage = "Content is required";
export const contentTooLongMessage = `Content must be ${contentMaxLength} characters or less`;
export const titleTakenMessage = "A note with this title already exists";

export const NoteFormSchema = z
  .object({
    title: z
      .string()
      .min(1, titleRequiredMessage)
      .max(titleMaxLength, titleTooLongMessage),

    content: z
      .string()
      .min(1, contentRequiredMessage)
      .max(contentMaxLength, contentTooLongMessage),
  })
  .refine((note) => note.title !== note.content, {
    message: "Title and content must be different", // no `path` -> form-level issue
  });

export type NoteFormValues = z.infer<typeof NoteFormSchema>;
export const noteFormDefaultValues: NoteFormValues = {
  title: "",
  content: "",
};

export function createNoteFormOptions(
  serverRun: FormValidatorFn<NoteFormValues> = async () => undefined,
) {
  return formOptions({
    defaultValues: noteFormDefaultValues,
    validators: [
      {
        triggers: ["change", "server"],
        run: async ({ value, parseIssues }) => {
          const result = await NoteFormSchema["~standard"].validate(value);
          if (!result.issues) return undefined;

          const parsed = parseIssues(result.issues);
          return {
            ...parsed,
            form: parsed.form.filter((issue) => !issue.path?.length),
          };
        },
      },
      { triggers: ["server"], runOnSubmit: false, run: serverRun },
    ],
  });
}
