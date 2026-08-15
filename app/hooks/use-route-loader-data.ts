import type { RouteId } from "~types/route-id";
import { useRouteLoaderData, useLoaderData } from "react-router";

type SerializeFrom<T> = ReturnType<typeof useLoaderData<T>>;

export function useRouteLoaderDataTyped<T = unknown>(routeId: RouteId) {
  return useRouteLoaderData(routeId) as SerializeFrom<T>;
}

// Usage
// import type { Route as NotesRoute } from "./+types/users_.$username_.notes";
// const notes = useRouteLoaderDataTyped<NotesRoute.ComponentProps["loaderData"]>(
//   "routes/users_.$username_.notes",
// );
