import type { Route } from "./+types/users_.$username_.notes.$noteId";
import { useRouteLoaderDataTyped } from "~/hooks/use-route-loader-data";
import type { Route as NotesRoute } from "./+types/users_.$username_.notes";
export default function RouteComponent({}: Route.ComponentProps) {
  const notes = useRouteLoaderDataTyped<
    NotesRoute.ComponentProps["loaderData"]
  >("routes/users_.$username_.notes");
  console.log(notes);
  return <>note content here</>;
}
