import type { Route } from "./+types/users_.$username_.notes.$noteId";
import { loader } from "./users_.$username_.notes";
import { useRouteLoaderDataTyped } from "~/hooks/use-route-loader-data";
export default function RouteComponent({}: Route.ComponentProps) {
  const notes = useRouteLoaderDataTyped<typeof loader>(
    "routes/users_.$username_.notes",
  );
  console.log(notes);
  return <>note content here</>;
}
