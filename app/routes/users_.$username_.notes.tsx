import { prisma } from "@db/prisma";
import type { Route } from "./+types/users_.$username_.notes";
import { Outlet } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const { username } = params;

  const data = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      notes: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    where: {
      username,
    },
  });

  return { data };
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const data = loaderData;
  return (
    <>
      notes here
      <br />
      <Outlet />
    </>
  );
}
