import { Outlet } from "react-router";
import type { Route } from "./+types/users";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function loader({ request }: Route.LoaderArgs) {
  return null;
}

export default function RouteComponent() {
  return (
    <>
      Users page
      <Outlet />
    </>
  );
}
