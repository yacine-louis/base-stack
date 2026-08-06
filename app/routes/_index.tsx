import { Form, redirect } from "react-router";
import type { Route } from "./+types/_index";

export async function loader({}: Route.LoaderArgs) {
  return null;
}

export default function RouteComponent() {
  return <>Notes App</>;
}
