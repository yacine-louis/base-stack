import { prisma } from "@db/prisma";

export async function isNoteTitleUnique({
  title,
  username,
  noteId,
}: {
  title: string;
  username: string;
  noteId?: string;
}): Promise<boolean> {
  const existing = await prisma.note.findFirst({
    select: { id: true },
    where: {
      title,
      owner: { username },
      // Exclude the note currently being edited, otherwise saving
      // without changing the title would always report a conflict.
      NOT: { id: noteId },
    },
  });
  return existing === null;
}
