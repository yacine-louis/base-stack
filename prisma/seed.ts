import { prisma } from "@db/prisma";

async function seed() {
  console.log("🌱 Seeding...");

  await prisma.note.deleteMany();
  await prisma.user.deleteMany();

  // Create predictable users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        email: "kody@example.com",
        username: "kody",
        name: "Kody",
      },
      {
        id: 2,
        email: "alice@example.com",
        username: "alice",
        name: "Alice",
      },
      {
        id: 3,
        email: "bob@example.com",
        username: "bob",
        name: "Bob",
      },
    ],
  });

  // Create predictable notes
  await prisma.note.createMany({
    data: [
      {
        id: "note-001",
        title: "Welcome to Notes",
        content: "This is Kody's first note.",
        ownerId: 1,
      },
      {
        id: "note-002",
        title: "Getting Started",
        content: "This note contains some information about getting started.",
        ownerId: 1,
      },
      {
        id: "note-003",
        title: "Ideas",
        content: "Build something interesting with React Router.",
        ownerId: 2,
      },
      {
        id: "note-004",
        title: "Todo",
        content: "Finish the project and deploy it.",
        ownerId: 2,
      },
      {
        id: "note-005",
        title: "Meeting Notes",
        content: "Discuss the new features and deployment strategy.",
        ownerId: 3,
      },
    ],
  });

  console.log("🌱 Database seeded");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
